using System.ComponentModel.DataAnnotations;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

var devices = new List<Device>
{
    new(1, "Blood Pressure Monitor", "Vital Signs", "Online", "Home Care"),
    new(2, "Pulse Oximeter", "Vital Signs", "Online", "Home Care"),
    new(3, "Medication Dispenser", "Medication", "Offline", "Patient Home")
};

app.MapGet("/", () => Results.Ok(new
{
    name = "HealthTech Device API",
    version = "1.0.0",
    status = "running"
}));

app.MapGet("/health", () => Results.Ok(new
{
    status = "healthy",
    timestamp = DateTime.UtcNow
}));

app.MapGet("/devices", () => Results.Ok(devices));

app.MapGet("/devices/{id:int}", (int id) =>
{
    var device = devices.FirstOrDefault(d => d.Id == id);

    return device is null
        ? Results.NotFound(new { message = $"Device {id} was not found." })
        : Results.Ok(device);
});

app.MapPost("/devices", (CreateDevice request) =>
{
    if (string.IsNullOrWhiteSpace(request.Name) ||
        string.IsNullOrWhiteSpace(request.Type) ||
        string.IsNullOrWhiteSpace(request.Status) ||
        string.IsNullOrWhiteSpace(request.Location))
    {
        return Results.BadRequest(new { message = "All fields are required." });
    }

    var nextId = devices.Count == 0 ? 1 : devices.Max(d => d.Id) + 1;

    var device = new Device(
        nextId,
        request.Name.Trim(),
        request.Type.Trim(),
        request.Status.Trim(),
        request.Location.Trim()
    );

    devices.Add(device);

    return Results.Created($"/devices/{device.Id}", device);
});

app.MapPut("/devices/{id:int}", (int id, UpdateDevice request) =>
{
    var index = devices.FindIndex(d => d.Id == id);

    if (index == -1)
    {
        return Results.NotFound(new { message = $"Device {id} was not found." });
    }

    var current = devices[index];

    var updated = current with
    {
        Name = request.Name ?? current.Name,
        Type = request.Type ?? current.Type,
        Status = request.Status ?? current.Status,
        Location = request.Location ?? current.Location
    };

    devices[index] = updated;

    return Results.Ok(updated);
});

app.MapDelete("/devices/{id:int}", (int id) =>
{
    var device = devices.FirstOrDefault(d => d.Id == id);

    if (device is null)
    {
        return Results.NotFound(new { message = $"Device {id} was not found." });
    }

    devices.Remove(device);

    return Results.NoContent();
});

app.Run();

record Device(
    int Id,
    string Name,
    string Type,
    string Status,
    string Location
);

record CreateDevice(
    [Required] string Name,
    [Required] string Type,
    [Required] string Status,
    [Required] string Location
);

record UpdateDevice(
    string? Name,
    string? Type,
    string? Status,
    string? Location
);
