public sealed class DicomMetadataRecord
{
    public long Id { get; set; }
    public string Modality { get; set; } = string.Empty;
    public string SopClassUid { get; set; } = string.Empty;
    public bool ContainsPatientIdentity { get; set; }
    public string PatientIdentityRemoved { get; set; } = string.Empty;
    public bool IsPartial { get; set; }
    public DateTime InspectedAtUtc { get; set; }
}

public sealed class SecurityAuditEvent
{
    public long Id { get; set; }
    public string EventType { get; set; } = string.Empty;
    public string Outcome { get; set; } = string.Empty;
    public DateTime TimestampUtc { get; set; }
}

public sealed record DicomMetadataRecordView(
    long Id,
    string Modality,
    string SopClassUid,
    bool ContainsPatientIdentity,
    string PatientIdentityRemoved,
    bool IsPartial,
    DateTime InspectedAtUtc
);
