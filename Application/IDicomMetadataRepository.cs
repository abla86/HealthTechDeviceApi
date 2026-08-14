public interface IDicomMetadataRepository
{
    Task<DicomMetadataRecord> AddInspectionAsync(
        DicomInspectionResult inspection,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<DicomMetadataRecordView>> GetRecentAsync(
        int take,
        CancellationToken cancellationToken = default);

    Task AddAuditEventAsync(
        string eventType,
        string outcome,
        CancellationToken cancellationToken = default);
}
