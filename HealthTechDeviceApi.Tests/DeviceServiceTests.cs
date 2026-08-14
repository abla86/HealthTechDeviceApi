using Xunit;

namespace HealthTechDeviceApi.Tests;

public sealed class DeviceServiceTests
{
    [Fact]
    public void Create_NormalizesStatusAndAddsDevice()
    {
        var service = CreateService();

        var result = service.Create(new CreateDevice(
            "ECG Monitor",
            "Diagnostic",
            "online",
            "Imaging Lab"));

        Assert.Null(result.Error);
        Assert.NotNull(result.Device);
        Assert.Equal("Online", result.Device.Status);
        Assert.True(result.Device.Id > 0);
    }

    [Fact]
    public void Create_RejectsInvalidStatus()
    {
        var service = CreateService();

        var result = service.Create(new CreateDevice(
            "ECG Monitor",
            "Diagnostic",
            "Unknown",
            "Imaging Lab"));

        Assert.NotNull(result.Error);
        Assert.Null(result.Device);
    }

    [Fact]
    public void Filter_ReturnsOnlyMatchingDevices()
    {
        var service = CreateService();

        var devices = service.GetDevices(
            "Online",
            "Vital Signs",
            "Home Care");

        Assert.NotEmpty(devices);
        Assert.All(devices, device =>
        {
            Assert.Equal("Online", device.Status);
            Assert.Equal("Vital Signs", device.Type);
            Assert.Equal("Home Care", device.Location);
        });
    }

    [Fact]
    public void Delete_RemovesExistingDevice()
    {
        var service = CreateService();

        Assert.True(service.Delete(1));
        Assert.Null(service.GetDevice(1));
    }

    private static DeviceService CreateService() =>
        new(new InMemoryDeviceRepository());
}
