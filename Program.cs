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
    version = "1.3.0",
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

app.Run();

public partial class Program
{
}
