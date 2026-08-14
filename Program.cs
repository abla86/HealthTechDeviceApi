using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;

const long MaxDicomUploadBytes = 5 * 1024 * 1024;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddSingleton<IDeviceRepository, InMemoryDeviceRepository>();
builder.Services.AddSingleton<DeviceService>();
builder.Services.AddSingleton<IDicomFileService, FoDicomFileService>();

var connectionString = builder.Configuration.GetConnectionString("HealthTech")
    ?? "Data Source=healthtech.db";

builder.Services.AddDbContext<HealthTechDbContext>(options =>
    options.UseSqlite(connectionString));
builder.Services.AddScoped<IDicomMetadataRepository, EfDicomMetadataRepository>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<HealthTechDbContext>();
    db.Database.EnsureCreated();
}

app.Use(async (context, next) =>
{
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["X-Frame-Options"] = "DENY";
    context.Response.Headers["Referrer-Policy"] = "no-referrer";
    context.Response.Headers["Cache-Control"] = "no-store";
    await next();
});

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGet("/", () => Results.Ok(new
{
    name = "HealthTech Device API",
    version = "1.5.0",
    status = "running"
}));

app.MapGet("/health", async (HealthTechDbContext db, CancellationToken cancellationToken) =>
{
    var databaseAvailable = await db.Database.CanConnectAsync(cancellationToken);

    return Results.Ok(new
    {
        status = databaseAvailable ? "healthy" : "degraded",
        database = databaseAvailable ? "available" : "unavailable",
        timestamp = DateTime.UtcNow
    });
});

app.MapGet("/devices", (
    DeviceService service,
    string? status,
    string? type,
    string? location) =>
{
    return Results.Ok(service.GetDevices(status, type, location));
});

app.MapGet("/devices/stats", (DeviceService service) =>
{
    return Results.Ok(service.GetStats());
});

app.MapGet("/devices/{id:int}", (int id, DeviceService service) =>
{
    var device = service.GetDevice(id);

    return device is null
        ? Results.NotFound(new { message = $"Device {id} was not found." })
        : Results.Ok(device);
});

app.MapPost("/devices", (CreateDevice request, DeviceService service) =>
{
    var result = service.Create(request);

    if (result.Error is not null)
    {
        return Results.BadRequest(new { message = result.Error });
    }

    var device = result.Device!;
    return Results.Created($"/devices/{device.Id}", device);
});

app.MapPut("/devices/{id:int}", (int id, UpdateDevice request, DeviceService service) =>
{
    var result = service.Update(id, request);

    if (result.NotFound)
    {
        return Results.NotFound(new { message = $"Device {id} was not found." });
    }

    if (result.Error is not null)
    {
        return Results.BadRequest(new { message = result.Error });
    }

    return Results.Ok(result.Device);
});

app.MapDelete("/devices/{id:int}", (int id, DeviceService service) =>
{
    return service.Delete(id)
        ? Results.NoContent()
        : Results.NotFound(new { message = $"Device {id} was not found." });
});

app.MapGet("/dicom/synthetic/metadata", (IDicomFileService service) =>
{
    var artifact = service.CreateSyntheticStudy();
    return Results.Ok(artifact.Metadata);
});

app.MapGet("/dicom/synthetic", (IDicomFileService service) =>
{
    var artifact = service.CreateSyntheticStudy();

    return Results.File(
        artifact.Content,
        artifact.ContentType,
        artifact.FileName);
});

app.MapPost("/dicom/inspect", async (
    HttpRequest request,
    IDicomFileService service,
    IDicomMetadataRepository repository,
    CancellationToken cancellationToken) =>
{
    if (request.ContentType?.StartsWith(
            "application/dicom",
            StringComparison.OrdinalIgnoreCase) != true)
    {
        await repository.AddAuditEventAsync("dicom.inspect", "unsupported-media-type", cancellationToken);
        return Results.StatusCode(StatusCodes.Status415UnsupportedMediaType);
    }

    if (request.ContentLength is > MaxDicomUploadBytes)
    {
        await repository.AddAuditEventAsync("dicom.inspect", "payload-too-large", cancellationToken);
        return Results.StatusCode(StatusCodes.Status413PayloadTooLarge);
    }

    using var buffer = new MemoryStream();
    var chunk = new byte[81920];
    long total = 0;

    while (true)
    {
        var read = await request.Body.ReadAsync(chunk, cancellationToken);
        if (read == 0)
        {
            break;
        }

        total += read;
        if (total > MaxDicomUploadBytes)
        {
            await repository.AddAuditEventAsync("dicom.inspect", "payload-too-large", cancellationToken);
            return Results.StatusCode(StatusCodes.Status413PayloadTooLarge);
        }

        await buffer.WriteAsync(chunk.AsMemory(0, read), cancellationToken);
    }

    if (total == 0)
    {
        await repository.AddAuditEventAsync("dicom.inspect", "empty-body", cancellationToken);
        return Results.BadRequest(new { message = "A DICOM request body is required." });
    }

    buffer.Position = 0;

    try
    {
        var inspection = service.Inspect(buffer);
        await repository.AddInspectionAsync(inspection, cancellationToken);
        await repository.AddAuditEventAsync("dicom.inspect", "success", cancellationToken);
        return Results.Ok(inspection);
    }
    catch (FellowOakDicom.DicomFileException)
    {
        await repository.AddAuditEventAsync("dicom.inspect", "invalid-dicom", cancellationToken);
        return Results.BadRequest(new { message = "The request body is not a readable DICOM file." });
    }
});

app.MapGet("/dicom/admin/inspections", async (
    HttpRequest request,
    IConfiguration configuration,
    IDicomMetadataRepository repository,
    int? take,
    CancellationToken cancellationToken) =>
{
    if (!IsAuthorized(request, configuration))
    {
        await repository.AddAuditEventAsync("dicom.admin.inspections", "unauthorized", cancellationToken);
        return Results.Unauthorized();
    }

    await repository.AddAuditEventAsync("dicom.admin.inspections", "success", cancellationToken);
    var records = await repository.GetRecentAsync(take ?? 25, cancellationToken);
    return Results.Ok(records);
});

app.Run();

static bool IsAuthorized(HttpRequest request, IConfiguration configuration)
{
    var configuredKey = configuration["Security:ApiKey"];
    if (string.IsNullOrWhiteSpace(configuredKey))
    {
        return false;
    }

    if (!request.Headers.TryGetValue("X-API-Key", out var suppliedValues))
    {
        return false;
    }

    var suppliedKey = suppliedValues.ToString();
    if (string.IsNullOrWhiteSpace(suppliedKey))
    {
        return false;
    }

    var configuredBytes = SHA256.HashData(Encoding.UTF8.GetBytes(configuredKey));
    var suppliedBytes = SHA256.HashData(Encoding.UTF8.GetBytes(suppliedKey));
    return CryptographicOperations.FixedTimeEquals(configuredBytes, suppliedBytes);
}

public partial class Program
{
}
