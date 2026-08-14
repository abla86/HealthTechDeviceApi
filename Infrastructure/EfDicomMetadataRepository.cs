using Microsoft.EntityFrameworkCore;

public sealed class EfDicomMetadataRepository : IDicomMetadataRepository
{
    private readonly HealthTechDbContext _dbContext;

    public EfDicomMetadataRepository(HealthTechDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<DicomMetadataRecord> AddInspectionAsync(
        DicomInspectionResult inspection,
        CancellationToken cancellationToken = default)
    {
        var record = new DicomMetadataRecord
        {
            Modality = inspection.Modality,
            SopClassUid = inspection.SopClassUid,
            ContainsPatientIdentity = inspection.ContainsPatientIdentity,
            PatientIdentityRemoved = inspection.PatientIdentityRemoved,
            IsPartial = inspection.IsPartial,
            InspectedAtUtc = DateTime.UtcNow
        };

        _dbContext.DicomMetadata.Add(record);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return record;
    }

    public async Task<IReadOnlyList<DicomMetadataRecordView>> GetRecentAsync(
        int take,
        CancellationToken cancellationToken = default)
    {
        var boundedTake = Math.Clamp(take, 1, 100);

        return await _dbContext.DicomMetadata
            .AsNoTracking()
            .OrderByDescending(item => item.InspectedAtUtc)
            .Take(boundedTake)
            .Select(item => new DicomMetadataRecordView(
                item.Id,
                item.Modality,
                item.SopClassUid,
                item.ContainsPatientIdentity,
                item.PatientIdentityRemoved,
                item.IsPartial,
                item.InspectedAtUtc))
            .ToListAsync(cancellationToken);
    }

    public async Task AddAuditEventAsync(
        string eventType,
        string outcome,
        CancellationToken cancellationToken = default)
    {
        _dbContext.SecurityAuditEvents.Add(new SecurityAuditEvent
        {
            EventType = eventType,
            Outcome = outcome,
            TimestampUtc = DateTime.UtcNow
        });

        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
