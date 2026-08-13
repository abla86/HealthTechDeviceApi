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

var validStatuses = new[]
{
    "Online",
    "Offline",
    "Maintenance"
};

app.MapGet("/", () => Results.Ok(new
{
    name = "HealthTech Device API",
    version = "1.1.0",
    status = "running"
}));

app.MapGet("/health", () => Results.Ok(new
{
    status = "healthy",
    timestamp = DateTime.UtcNow
}));

app.MapGet("/devices", (
    string? status,
    string? type,
    string? location) =>
{
    IEnumerable<Device> result = devices;

    if (!string.IsNullOrWhiteSpace(status))
    {
        result = result.Where(d =>
            d.Status.Equals(
                status,
                StringComparison.OrdinalIgnoreCase));
    }

    if (!string.IsNullOrWhiteSpace(type))
    {
        result = result.Where(d =>
            d.Type.Equals(
                type,
                StringComparison.OrdinalIgnoreCase));
    }

    if (!string.IsNullOrWhiteSpace(location))
    {
        result = result.Where(d =>
            d.Location.Equals(
                location,
                StringComparison.OrdinalIgnoreCase));
    }

    return Results.Ok(result);
});

app.MapGet("/devices/stats", () =>
{
    var total = devices.Count;
    var online = devices.Count(d =>
        d.Status.Equals(
            "Online",
            StringComparison.OrdinalIgnoreCase));

    var offline = devices.Count(d =>
        d.Status.Equals(
            "Offline",
            StringComparison.OrdinalIgnoreCase));

    var maintenance = devices.Count(d =>
        d.Status.Equals(
            "Maintenance",
            StringComparison.OrdinalIgnoreCase));

    return Results.Ok(new
    {
        total,
        online,
        offline,
        maintenance
    });
});

app.MapGet("/devices/{id:int}", (int id) =>
{
    var device = devices.FirstOrDefault(d => d.Id == id);

    return device is null
        ? Results.NotFound(new
        {
            message = $"Device {id} was not found."
        })
        : Results.Ok(device);
});

app.MapPost("/devices", (CreateDevice request) =>
{
    var validationError = ValidateCreateRequest(
        request,
        validStatuses);

    if (validationError is not null)
    {
        return Results.BadRequest(new
        {
            message = validationError
        });
    }

    var nextId = devices.Count == 0
        ? 1
        : devices.Max(d => d.Id) + 1;

    var device = new Device(
        nextId,
        request.Name.Trim(),
        request.Type.Trim(),
        NormalizeStatus(request.Status),
        request.Location.Trim()
    );

    devices.Add(device);

    return Results.Created(
        $"/devices/{device.Id}",
        device);
});

app.MapPut("/devices/{id:int}", (
    int id,
    UpdateDevice request) =>
{
    var index = devices.FindIndex(d => d.Id == id);

    if (index == -1)
    {
        return Results.NotFound(new
        {
            message = $"Device {id} was not found."
        });
    }

    var validationError = ValidateUpdateRequest(
        request,
        validStatuses);

    if (validationError is not null)
    {
        return Results.BadRequest(new
        {
            message = validationError
        });
    }

    var current = devices[index];

    var updated = current with
    {
        Name = request.Name?.Trim() ?? current.Name,
        Type = request.Type?.Trim() ?? current.Type,
        Status = request.Status is null
            ? current.Status
            : NormalizeStatus(request.Status),
        Location = request.Location?.Trim() ?? current.Location
    };

    devices[index] = updated;

    return Results.Ok(updated);
});

app.MapDelete("/devices/{id:int}", (int id) =>
{
    var device = devices.FirstOrDefault(d => d.Id == id);

    if (device is null)
    {
        return Results.NotFound(new
        {
            message = $"Device {id} was not found."
        });
    }

    devices.Remove(device);

    return Results.NoContent();
});

app.Run();

static string? ValidateCreateRequest(
    CreateDevice request,
    IReadOnlyCollection<string> validStatuses)
{
    if (string.IsNullOrWhiteSpace(request.Name) ||
        string.IsNullOrWhiteSpace(request.Type) ||
        string.IsNullOrWhiteSpace(request.Status) ||
        string.IsNullOrWhiteSpace(request.Location))
    {
        return "Name, type, status and location are required.";
    }

    if (!validStatuses.Any(status =>
        status.Equals(
            request.Status,
            StringComparison.OrdinalIgnoreCase)))
    {
        return "Status must be Online, Offline or Maintenance.";
    }

    return null;
}

static string? ValidateUpdateRequest(
    UpdateDevice request,
    IReadOnlyCollection<string> validStatuses)
{
    if (request.Name is not null &&
        string.IsNullOrWhiteSpace(request.Name))
    {
        return "Name cannot be empty.";
    }

    if (request.Type is not null &&
        string.IsNullOrWhiteSpace(request.Type))
    {
        return "Type cannot be empty.";
    }

    if (request.Location is not null &&
        string.IsNullOrWhiteSpace(request.Location))
    {
        return "Location cannot be empty.";
    }

    if (request.Status is not null &&
        !validStatuses.Any(status =>
            status.Equals(
                request.Status,
                StringComparison.OrdinalIgnoreCase)))
    {
        return "Status must be Online, Offline or Maintenance.";
    }

    return null;
}

static string NormalizeStatus(string status)
{
    return status.Trim().ToLowerInvariant() switch
    {
        "online" => "Online",
        "offline" => "Offline",
        "maintenance" => "Maintenance",
        _ => status.Trim()
    };
}

public record Device(
    int Id,
    string Name,
    string Type,
    string Status,
    string Location
);

public record CreateDevice(
    [Required] string Name,
    [Required] string Type,
    [Required] string Status,
    [Required] string Location
);

public record UpdateDevice(
    string? Name,
    string? Type,
    string? Status,
    string? Location
);

public partial class Program
{
}
