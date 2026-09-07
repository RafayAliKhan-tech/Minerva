using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Minerva_Backend.Models;

namespace Minerva_Backend.Data;

public class AppDbContext : IdentityDbContext<AppUser>   // no <Guid> needed now
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<AppUser>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<AppUser>()
            .HasOne(u => u.Profile)
            .WithOne(p => p.User)
            .HasForeignKey<UserProfile>(p => p.UserId);

        modelBuilder.Entity<AssessmentQuestion>()
    .HasKey(q => q.QuestionId);

        modelBuilder.Entity<AssessmentAttempt>()
            .HasOne(a => a.User)
            .WithMany()
            .HasForeignKey(a => a.UserId);

        modelBuilder.Entity<AssessmentAnswer>()
            .HasOne(a => a.Attempt)
            .WithMany(at => at.Answers)
            .HasForeignKey(a => a.AttemptId);

        modelBuilder.Entity<AssessmentResult>()
            .HasOne(r => r.Attempt)
            .WithOne(a => a.Result)
            .HasForeignKey<AssessmentResult>(r => r.AttemptId);
    }

    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<AssessmentQuestion> AssessmentQuestions { get; set; }
    public DbSet<AssessmentAttempt> AssessmentAttempts { get; set; }
    public DbSet<AssessmentAnswer> AssessmentAnswers { get; set; }
    public DbSet<AssessmentResult> AssessmentResults { get; set; }
    public DbSet<Career> Careers { get; set; }
    public DbSet<CareerMatch> CareerMatches { get; set; }
    public DbSet<CareerComparison> CareerComparisons { get; set; }
    public DbSet<Journey1Result> Journey1Results { get; set; }
    public DbSet<Journey2Result> Journey2Results { get; set; }
    public DbSet<Journey1Question> Journey1Questions { get; set; }
    public DbSet<ResumeAnalysis> ResumeAnalyses { get; set; }
    public DbSet<Route3Attempt> Route3Attempts { get; set; }
    public DbSet<Route3Result> Route3Results { get; set; }
    public DbSet<ChatSession> ChatSessions { get; set; }
    public DbSet<InterviewAttempt> InterviewAttempts { get; set; }
    public DbSet<InterviewResult> InterviewResults { get; set; }
}