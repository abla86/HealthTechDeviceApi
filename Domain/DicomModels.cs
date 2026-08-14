public sealed record DicomStudyMetadata(
    string PatientId,
    string PatientName,
    string Modality,
    string StudyInstanceUid,
    string SeriesInstanceUid,
    string SopInstanceUid,
    string SopClassUid,
    string StudyDescription,
    bool Synthetic
);

public sealed record DicomArtifact(
    byte[] Content,
    DicomStudyMetadata Metadata,
    string FileName,
    string ContentType
);

public sealed record DicomInspectionResult(
    string Modality,
    string SopClassUid,
    bool ContainsPatientIdentity,
    string PatientIdentityRemoved,
    bool IsPartial
);
