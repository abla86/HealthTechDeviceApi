const long MaxDicomUploadBytes = 5 * 1024 * 1024;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddSingleton<IDeviceRepository, InMemoryDeviceRepository>();
builder.Services.AddSingleton<DeviceService>();
builder.Services.AddSingleton<IDicomFileService, FoDicomFileService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGet("/", () => Results.Ok(new
{
    name = "HealthTech Device API",
    version = "1.4.0",
    status = "running"
}));

app.MapGet("/health", () => Results.Ok(new
{
    status = "healthy",
    timestamp = DateTime.UtcNow
}));

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
        ? Results.NotFound(new
        {
            message = $"Device {id} was not found."
        })
        : Results.Ok(device);
});

app.MapPost("/devices", (CreateDevice request, DeviceService service) =>
{
    var result = service.Create(request);

    if (result.Error is not null)
    {
        return Results.BadRequest(new
        {
            message = result.Error
        });
    }

    var device = result.Device!;

    return Results.Created(
        $"/devices/{device.Id}",
        device);
});

app.MapPut("/devices/{id:int}", (
    int id,
    UpdateDevice request,
    DeviceService service) =>
{
    var result = service.Update(id, request);

    if (result.NotFound)
    {
        return Results.NotFound(new
        {
            message = $"Device {id} was not found."
        });
    }

    if (result.Error is not null)
    {
        return Results.BadRequest(new
        {
            message = result.Error
        });
    }

    return Results.Ok(result.Device);
});

app.MapDelete("/devices/{id:int}", (int id, DeviceService service) =>
{
    return service.Delete(id)
        ? Results.NoContent()
        : Results.NotFound(new
        {
            message = $"Device {id} was not found."
        });
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
    CancellationToken cancellationToken) =>
{
    if (request.ContentType?.StartsWith(
            "application/dicom",
            StringComparison.OrdinalIgnoreCase) != true)
    {
        return Results.StatusCode(StatusCodes.Status415UnsupportedMediaType);
    }

    if (request.ContentLength is > MaxDicomUploadBytes)
    {
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
            return Results.StatusCode(StatusCodes.Status413PayloadTooLarge);
        }

        await buffer.WriteAsync(chunk.AsMemory(0, read), cancellationToken);
    }

    if (total == 0)
    {
        return Results.BadRequest(new
        {
            message = "A DICOM request body is required."
        });
    }

    buffer.Position = 0;

    try
    {
        return Results.Ok(service.Inspect(buffer));
    }
    catch (FellowOakDicom.DicomFileException)
    {
        return Results.BadRequest(new
        {
            message = "The request body is not a readable DICOM file."
        });
    }
});

app.Run();

public partial class Program
{
}
