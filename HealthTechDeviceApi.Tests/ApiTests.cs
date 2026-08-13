using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace HealthTechDeviceApi.Tests;

public sealed class ApiTests
    : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public ApiTests(
        WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Health_ReturnsOk()
    {
        var response =
            await _client.GetAsync("/health");

        Assert.Equal(
            HttpStatusCode.OK,
            response.StatusCode);
    }

    [Fact]
    public async Task Devices_ReturnsSampleDevices()
    {
        var devices =
            await _client.GetFromJsonAsync<List<Device>>(
                "/devices");

        Assert.NotNull(devices);
        Assert.True(devices.Count >= 3);
    }

    [Fact]
    public async Task GetDevice_ReturnsNotFoundForUnknownId()
    {
        var response =
            await _client.GetAsync("/devices/9999");

        Assert.Equal(
            HttpStatusCode.NotFound,
            response.StatusCode);
    }

    [Fact]
    public async Task FilterDevices_ByStatus_ReturnsOnlineDevices()
    {
        var devices =
            await _client.GetFromJsonAsync<List<Device>>(
                "/devices?status=Online");

        Assert.NotNull(devices);
        Assert.NotEmpty(devices);

        Assert.All(
            devices,
            device => Assert.Equal(
                "Online",
                device.Status));
    }

    [Fact]
    public async Task CreateDevice_ReturnsCreated()
    {
        var request = new CreateDevice(
            "Test Sensor",
            "Sensor",
            "Maintenance",
            "Test Location"
        );

        var response =
            await _client.PostAsJsonAsync(
                "/devices",
                request);

        Assert.Equal(
            HttpStatusCode.Created,
            response.StatusCode);

        var created =
            await response.Content
                .ReadFromJsonAsync<Device>();

        Assert.NotNull(created);
        Assert.Equal(
            "Test Sensor",
            created.Name);
    }

    [Fact]
    public async Task CreateDevice_RejectsInvalidStatus()
    {
        var request = new CreateDevice(
            "Test Sensor",
            "Sensor",
            "Unknown",
            "Test Location"
        );

        var response =
            await _client.PostAsJsonAsync(
                "/devices",
                request);

        Assert.Equal(
            HttpStatusCode.BadRequest,
            response.StatusCode);
    }

    [Fact]
    public async Task Stats_ReturnsOk()
    {
        var response =
            await _client.GetAsync(
                "/devices/stats");

        Assert.Equal(
            HttpStatusCode.OK,
            response.StatusCode);
    }
}
