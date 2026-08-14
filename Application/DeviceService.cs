public sealed class DeviceService
{
    private static readonly string[] ValidStatuses =
    [
        "Online",
        "Offline",
        "Maintenance"
    ];

    private readonly IDeviceRepository _repository;

    public DeviceService(IDeviceRepository repository)
    {
        _repository = repository;
    }

    public IReadOnlyList<Device> GetDevices(
        string? status,
        string? type,
        string? location)
    {
        IEnumerable<Device> result = _repository.GetAll();

        if (!string.IsNullOrWhiteSpace(status))
        {
            result = result.Where(device =>
                device.Status.Equals(status, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(type))
        {
            result = result.Where(device =>
                device.Type.Equals(type, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(location))
        {
            result = result.Where(device =>
                device.Location.Equals(location, StringComparison.OrdinalIgnoreCase));
        }

        return result.ToList();
    }

    public Device? GetDevice(int id) => _repository.GetById(id);

    public (Device? Device, string? Error) Create(CreateDevice request)
    {
        var error = ValidateCreateRequest(request);
        if (error is not null)
        {
            return (null, error);
        }

        var device = new Device(
            0,
            request.Name.Trim(),
            request.Type.Trim(),
            NormalizeStatus(request.Status),
            request.Location.Trim());

        return (_repository.Add(device), null);
    }

    public (Device? Device, string? Error, bool NotFound) Update(
        int id,
        UpdateDevice request)
    {
        var current = _repository.GetById(id);
        if (current is null)
        {
            return (null, null, true);
        }

        var error = ValidateUpdateRequest(request);
        if (error is not null)
        {
            return (null, error, false);
        }

        var updated = current with
        {
            Name = request.Name?.Trim() ?? current.Name,
            Type = request.Type?.Trim() ?? current.Type,
            Status = request.Status is null
                ? current.Status
                : NormalizeStatus(request.Status),
            Location = request.Location?.Trim() ?? current.Location
        };

        return (_repository.Update(id, updated), null, false);
    }

    public bool Delete(int id) => _repository.Delete(id);

    public DeviceStats GetStats()
    {
        var devices = _repository.GetAll();

        return new DeviceStats(
            devices.Count,
            devices.Count(device => device.Status.Equals("Online", StringComparison.OrdinalIgnoreCase)),
            devices.Count(device => device.Status.Equals("Offline", StringComparison.OrdinalIgnoreCase)),
            devices.Count(device => device.Status.Equals("Maintenance", StringComparison.OrdinalIgnoreCase)));
    }

    private static string? ValidateCreateRequest(CreateDevice request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) ||
            string.IsNullOrWhiteSpace(request.Type) ||
            string.IsNullOrWhiteSpace(request.Status) ||
            string.IsNullOrWhiteSpace(request.Location))
        {
            return "Name, type, status and location are required.";
        }

        return IsValidStatus(request.Status)
            ? null
            : "Status must be Online, Offline or Maintenance.";
    }

    private static string? ValidateUpdateRequest(UpdateDevice request)
    {
        if (request.Name is not null && string.IsNullOrWhiteSpace(request.Name))
        {
            return "Name cannot be empty.";
        }

        if (request.Type is not null && string.IsNullOrWhiteSpace(request.Type))
        {
            return "Type cannot be empty.";
        }

        if (request.Location is not null && string.IsNullOrWhiteSpace(request.Location))
        {
            return "Location cannot be empty.";
        }

        if (request.Status is not null && !IsValidStatus(request.Status))
        {
            return "Status must be Online, Offline or Maintenance.";
        }

        return null;
    }

    private static bool IsValidStatus(string status) =>
        ValidStatuses.Any(valid =>
            valid.Equals(status, StringComparison.OrdinalIgnoreCase));

    private static string NormalizeStatus(string status) =>
        status.Trim().ToLowerInvariant() switch
        {
            "online" => "Online",
            "offline" => "Offline",
            "maintenance" => "Maintenance",
            _ => status.Trim()
        };
}
