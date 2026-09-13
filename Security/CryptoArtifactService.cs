using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace HealthTechDeviceApi.Security;

/// <summary>
/// Small, self-contained cryptography demonstrator for synthetic portfolio artifacts.
/// It intentionally keeps keys in memory and is not a production key-management design.
/// </summary>
public sealed class CryptoArtifactService
{
    private readonly byte[] _encryptionKey = RandomNumberGenerator.GetBytes(32);

    public SignatureDemoResult SignAndVerify(object payload)
    {
        var canonical = JsonSerializer.Serialize(payload, new JsonSerializerOptions
        {
            WriteIndented = false
        });

        using var signer = ECDsa.Create(ECCurve.NamedCurves.nistP256);
        var data = Encoding.UTF8.GetBytes(canonical);
        var signature = signer.SignData(data, HashAlgorithmName.SHA256);
        var publicKey = signer.ExportSubjectPublicKeyInfo();
        var verified = signer.VerifyData(data, signature, HashAlgorithmName.SHA256);

        return new SignatureDemoResult(
            Algorithm: "ECDSA P-256 / SHA-256",
            PayloadSha256: Convert.ToHexString(SHA256.HashData(data)),
            SignatureBase64: Convert.ToBase64String(signature),
            PublicKeyBase64: Convert.ToBase64String(publicKey),
            Verified: verified);
    }

    public EncryptionDemoResult EncryptAndDecrypt(string plaintext)
    {
        var input = Encoding.UTF8.GetBytes(plaintext);
        var nonce = RandomNumberGenerator.GetBytes(12);
        var ciphertext = new byte[input.Length];
        var tag = new byte[16];

        using (var aes = new AesGcm(_encryptionKey, 16))
        {
            aes.Encrypt(nonce, input, ciphertext, tag);
        }

        var recovered = new byte[ciphertext.Length];
        using (var aes = new AesGcm(_encryptionKey, 16))
        {
            aes.Decrypt(nonce, ciphertext, tag, recovered);
        }

        return new EncryptionDemoResult(
            Algorithm: "AES-256-GCM",
            PlaintextSha256: Convert.ToHexString(SHA256.HashData(input)),
            CiphertextBase64: Convert.ToBase64String(ciphertext),
            NonceBase64: Convert.ToBase64String(nonce),
            TagBase64: Convert.ToBase64String(tag),
            RoundTripVerified: CryptographicOperations.FixedTimeEquals(input, recovered));
    }
}

public sealed record SignatureDemoResult(
    string Algorithm,
    string PayloadSha256,
    string SignatureBase64,
    string PublicKeyBase64,
    bool Verified);

public sealed record EncryptionDemoResult(
    string Algorithm,
    string PlaintextSha256,
    string CiphertextBase64,
    string NonceBase64,
    string TagBase64,
    bool RoundTripVerified);
