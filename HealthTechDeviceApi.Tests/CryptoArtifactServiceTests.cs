using HealthTechDeviceApi.Security;
using Xunit;

namespace HealthTechDeviceApi.Tests;

public sealed class CryptoArtifactServiceTests
{
    [Fact]
    public void SignAndVerify_ReturnsVerifiedSignature()
    {
        var service = new CryptoArtifactService();

        var result = service.SignAndVerify(new { artifact = "synthetic", version = 1 });

        Assert.Equal("ECDSA P-256 / SHA-256", result.Algorithm);
        Assert.True(result.Verified);
        Assert.NotEmpty(result.PayloadSha256);
        Assert.NotEmpty(result.SignatureBase64);
        Assert.NotEmpty(result.PublicKeyBase64);
    }

    [Fact]
    public void EncryptAndDecrypt_ReturnsVerifiedRoundTrip()
    {
        var service = new CryptoArtifactService();

        var result = service.EncryptAndDecrypt("synthetic health data");

        Assert.Equal("AES-256-GCM", result.Algorithm);
        Assert.True(result.RoundTripVerified);
        Assert.NotEmpty(result.CiphertextBase64);
        Assert.NotEmpty(result.NonceBase64);
        Assert.NotEmpty(result.TagBase64);
    }
}
