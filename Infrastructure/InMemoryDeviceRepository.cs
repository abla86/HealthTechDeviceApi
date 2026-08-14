public sealed class InMemoryDeviceRepository : IDeviceRepository
{
    private readonly List<Device> _devices =
    [
        new(1, "Blood Pressure Monitor", "Vital Signs", "Online", "Home Care"),
        new(2, "Pulse Oximeter", "Vital Signs", "Online", "Home Care"),
        new(3, "Medication Dispenser", "Medication", "Offline", "Patient Home")
    ];

    private readonly object _sync = new();

    public IReadOnlyList<Device> GetAll()
    {
        lock (_sync)
        {
            return _devices.ToList();
        }
    }

    public Device? GetById(int id)
    {
        lock (_sync)
        {
            return _devices.FirstOrDefault(device => device.Id == id);
        }
    }

    public Device Add(Device device)
    {
        lock (_sync)
        {
            var nextId = _devices.Count == 0
                ? 1
                : _devices.Max(existing => existing.Id) + 1;

            var created = device with { Id = nextId };
            _devices.Add(created);
            return created;
        }
    }

    public Device? Update(int id, Device device)
    {
        lock (_sync)
        {
            var index = _devices.FindIndex(existing => existing.Id == id);
            if (index < 0)
            {
                return null;
            }

            var updated = device with { Id = id };
            _devices[index] = updated;
            return updated;
        }
    }

    public bool Delete(int id)
    {
        lock (_sync)
        {
            var device = _devices.FirstOrDefault(existing => existing.Id == id);
            return device is not null && _devices.Remove(device);
        }
    }
}
