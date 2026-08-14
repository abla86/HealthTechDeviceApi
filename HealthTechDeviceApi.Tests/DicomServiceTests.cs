using Xunit;

namespace HealthTechDeviceApi.Tests;

public sealed class DicomServiceTests
{
    [Fact]
    public void CreateSyntheticStudy_ProducesPart10DicomFile()
    {
        var service = new FoDicomFileService();

        var artifact = service.CreateSyntheticStudy();

        Assert.True(artifact.Content.Length > 132);
        Assert.Equal("application/dicom", artifact.ContentType);
        Assert.EndsWith(".dcm", artifact.FileName, StringComparison.OrdinalIgnoreCase);
        Assert.Equal("DICM", System.Text.Encoding.ASCII.GetString(artifact.Content, 128, 4));
    }

    [Fact]
    public void CreateSyntheticStudy_UsesSyntheticIdentityOnly()
    {
        var service = new FoDicomFileService();

        var artifact = service.CreateSyntheticStudy();

        Assert.True(artifact.Metadata.Synthetic);
        Assert.Equal("SYNTHETIC-001", artifact.Metadata.PatientId);
        Assert.Equal("SYNTHETIC^PATIENT", artifact.Metadata.PatientName);
        Assert.Equal("OT", artifact.Metadata.Modality);
        Assert.False(string.IsNullOrWhiteSpace(artifact.Metadata.StudyInstanceUid));
        Assert.False(string.IsNullOrWhiteSpace(artifact.Metadata.SeriesInstanceUid));
        Assert.False(string.IsNullOrWhiteSpace(artifact.Metadata.SopInstanceUid));
    }

    [Fact]
    public void Inspect_ReturnsAllowListedMetadataWithoutIdentityValues()
    {
        var service = new FoDicomFileService();
        var artifact = service.CreateSyntheticStudy();

        using var stream = new MemoryStream(artifact.Content);
        var result = service.Inspect(stream);

        Assert.Equal("OT", result.Modality);
        Assert.Equal(artifact.Metadata.SopClassUid, result.SopClassUid);
        Assert.True(result.ContainsPatientIdentity);
        Assert.Equal("YES", result.PatientIdentityRemoved);
        Assert.False(result.IsPartial);
    }
}
