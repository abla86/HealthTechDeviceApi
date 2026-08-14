public interface IDeviceRepository
{
    IReadOnlyList<Device> GetAll();
    Device? GetById(int id);
    Device Add(Device device);
    Device? Update(int id, Device device);
    bool Delete(int id);
}
