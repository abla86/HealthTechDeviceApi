using Microsoft.EntityFrameworkCore;
using Xunit;

namespace HealthTechDeviceApi.Tests;

public sealed class DicomPersistenceTests
{
    [Fact]
    public async Task Repository_PersistsAllowListedInspectionMetadata()
    {
        var databasePath = Path.Combine(
            Path.GetTempPath(),
            $"healthtech-{Guid.NewGuid():N}.db");

        try
        {
            var options = new DbContextOptionsBuilder<HealthTechDbContext>()
                .UseSqlite($"Data Source={databasePath}")
                .Options;

            await using var db = new HealthTechDbContext(options);
            await db.Database.EnsureCreatedAsync();

            var repository = new EfDicomMetadataRepository(db);
            var inspection = new DicomInspectionResult(
                "CT",
                "1.2.840.10008.5.1.4.1.1.2",
                true,
                "NO",
                false);

            var stored = await repository.AddInspectionAsync(inspection);
            var recent = await repository.GetRecentAsync(10);

            Assert.True(stored.Id > 0);
            var item = Assert.Single(recent);
            Assert.Equal("CT", item.Modality);
            Assert.Equal(inspection.SopClassUid, item.SopClassUid);
            Assert.True(item.ContainsPatientIdentity);
        }
        finally
        {
            if (File.Exists(databasePath))
            {
                File.Delete(databasePath);
            }
        }
    }

    [Fact]
    public async Task Repository_BoundsHistoryQueryToOneHundredRows()
    {
        var databasePath = Path.Combine(
            Path.GetTempPath(),
            $"healthtech-{Guid.NewGuid():N}.db");

        try
        {
            var options = new DbContextOptionsBuilder<HealthTechDbContext>()
                .UseSqlite($"Data Source={databasePath}")
                .Options;

            await using var db = new HealthTechDbContext(options);
            await db.Database.EnsureCreatedAsync();

            for (var index = 0; index < 105; index++)
            {
                db.DicomMetadata.Add(new DicomMetadataRecord
                {
                    Modality = "OT",
                    SopClassUid = "1.2.3",
                    InspectedAtUtc = DateTime.UtcNow.AddSeconds(index)
                });
            }

            await db.SaveChangesAsync();
            var repository = new EfDicomMetadataRepository(db);
            var recent = await repository.GetRecentAsync(500);

            Assert.Equal(100, recent.Count);
        }
        finally
        {
            if (File.Exists(databasePath))
            {
                File.Delete(databasePath);
            }
        }
    }
}
