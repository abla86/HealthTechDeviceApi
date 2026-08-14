using FellowOakDicom;

public sealed class FoDicomFileService : IDicomFileService
{
    public DicomArtifact CreateSyntheticStudy()
    {
        var studyInstanceUid = DicomUIDGenerator.GenerateDerivedFromUUID().UID;
        var seriesInstanceUid = DicomUIDGenerator.GenerateDerivedFromUUID().UID;
        var sopInstanceUid = DicomUIDGenerator.GenerateDerivedFromUUID().UID;
        var sopClassUid = DicomUID.SecondaryCaptureImageStorage.UID;

        var dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian)
        {
            { DicomTag.SpecificCharacterSet, "ISO_IR 100" },
            { DicomTag.PatientID, "SYNTHETIC-001" },
            { DicomTag.PatientName, "SYNTHETIC^PATIENT" },
            { DicomTag.PatientIdentityRemoved, "YES" },
            { DicomTag.DeidentificationMethod, "Synthetic demonstration data" },
            { DicomTag.StudyInstanceUID, studyInstanceUid },
            { DicomTag.SeriesInstanceUID, seriesInstanceUid },
            { DicomTag.SOPInstanceUID, sopInstanceUid },
            { DicomTag.SOPClassUID, sopClassUid },
            { DicomTag.Modality, "OT" },
            { DicomTag.StudyDescription, "Synthetic HealthTech DICOM Study" },
            { DicomTag.SeriesDescription, "Secure DICOM Service Demo" },
            { DicomTag.StudyDate, DateTime.UtcNow.ToString("yyyyMMdd") },
            { DicomTag.StudyTime, DateTime.UtcNow.ToString("HHmmss") },
            { DicomTag.SeriesNumber, "1" },
            { DicomTag.InstanceNumber, "1" }
        };

        var file = new DicomFile(dataset);

        using var stream = new MemoryStream();
        file.Save(stream);

        var metadata = new DicomStudyMetadata(
            "SYNTHETIC-001",
            "SYNTHETIC^PATIENT",
            "OT",
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
            sopClassUid,
            "Synthetic HealthTech DICOM Study",
            true);

        return new DicomArtifact(
            stream.ToArray(),
            metadata,
            $"synthetic-{sopInstanceUid}.dcm",
            "application/dicom");
    }
}
