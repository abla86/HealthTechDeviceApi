public interface IDicomFileService
{
    DicomArtifact CreateSyntheticStudy();

    DicomInspectionResult Inspect(Stream stream);
}
