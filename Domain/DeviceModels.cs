using System.ComponentModel.DataAnnotations;

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

public record DeviceStats(
    int Total,
    int Online,
    int Offline,
    int Maintenance
);
