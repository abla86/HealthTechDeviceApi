using Microsoft.EntityFrameworkCore;

public sealed class HealthTechDbContext : DbContext
{
    public HealthTechDbContext(DbContextOptions<HealthTechDbContext> options)
        : base(options)
    {
    }

    public DbSet<DicomMetadataRecord> DicomMetadata => Set<DicomMetadataRecord>();
    public DbSet<SecurityAuditEvent> SecurityAuditEvents => Set<SecurityAuditEvent>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DicomMetadataRecord>(entity =>
        {
            entity.HasKey(item => item.Id);
            entity.Property(item => item.Modality).HasMaxLength(32);
            entity.Property(item => item.SopClassUid).HasMaxLength(128);
            entity.Property(item => item.PatientIdentityRemoved).HasMaxLength(32);
            entity.HasIndex(item => item.InspectedAtUtc);
        });

        modelBuilder.Entity<SecurityAuditEvent>(entity =>
        {
            entity.HasKey(item => item.Id);
            entity.Property(item => item.EventType).HasMaxLength(64);
            entity.Property(item => item.Outcome).HasMaxLength(32);
            entity.HasIndex(item => item.TimestampUtc);
        });
    }
}
