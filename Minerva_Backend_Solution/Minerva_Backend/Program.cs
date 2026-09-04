//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.AspNetCore.HttpOverrides;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.IdentityModel.Tokens;
//using Minerva_Backend.Data;
//using Minerva_Backend.IServices;
//using Minerva_Backend.Models;
//using Minerva_Backend.Services;
//using System.Net;
//using System.Net.Sockets;
//using System.Text;
//using YourProject.Roadmap.Services;

//var builder = WebApplication.CreateBuilder(args);

//// Add services to the container.
//builder.Services.AddControllers();
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();
//builder.Services.AddScoped<IAuthService, AuthService>(); 
//builder.Services.AddScoped<IProfileService, ProfileService>();
//builder.Services.AddScoped<IScoringService, ScoringService>();
//builder.Services.AddScoped<IAssessmentService, AssessmentService>();
//builder.Services.AddScoped<ICareerService, CareerService>();
//builder.Services.AddScoped<IJourney1Service, Journey1Service>();
//builder.Services.AddScoped<IJourney2Service, Journey2Service>();

//builder.Services.AddHttpClient<IJourney1BridgeService, Journey1BridgeService>(client =>
//{
//    client.BaseAddress = new Uri(builder.Configuration["ScoringService:BaseUrl"]!);
//});

//builder.Services.AddHttpClient<IJourney2BridgeService, Journey2BridgeService>(client =>
//{
//    client.BaseAddress = new Uri(builder.Configuration["ScoringService:BaseUrl"]!);
//});

//builder.Services.AddDbContext<AppDbContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
//{
//    options.Password.RequiredLength = 6;
//    options.Password.RequireNonAlphanumeric = false;
//    options.Password.RequireUppercase = false;
//})
//    .AddEntityFrameworkStores<AppDbContext>()
//    .AddDefaultTokenProviders();

//// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

//var jwtKey = builder.Configuration["Jwt:Key"]!;
//var jwtIssuer = builder.Configuration["Jwt:Issuer"];
//var jwtAudience = builder.Configuration["Jwt:Audience"];

//builder.Services.AddAuthentication(options =>
//{
//    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//})
//    .AddJwtBearer(options =>
//    {
//        options.TokenValidationParameters = new TokenValidationParameters
//        {
//            ValidateIssuer = true,
//            ValidateAudience = true,
//            ValidateLifetime = true,
//            ValidateIssuerSigningKey = true,
//            ValidIssuer = jwtIssuer,
//            ValidAudience = jwtAudience,
//            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
//        };
//    });

//var microserviceUrl = builder.Configuration["MicroserviceBaseUrl"]
//    ?? throw new InvalidOperationException("MicroserviceBaseUrl is not configured.");

//builder.Services.AddHttpClient<IScoringService, ScoringService>(client =>
//{
//    client.BaseAddress = new Uri(microserviceUrl);
//});
//builder.Services.AddHttpClient<ICareerMatchingService, CareerMatchingService>(client =>
//{
//    client.BaseAddress = new Uri(microserviceUrl);
//});

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowFrontend", policy =>
//    {
//        var origins = new List<string> { "http://localhost:5173" };

//        var additionalOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
//        if (additionalOrigins != null)
//        {
//            origins.AddRange(additionalOrigins);
//        }

//        policy.WithOrigins(origins.ToArray())
//            .AllowAnyHeader()
//            .AllowAnyMethod()
//            .AllowCredentials();
//    });
//});

//builder.Services.AddHttpClient<IResumeBridgeService, ResumeBridgeService>(client =>
//{
//    client.BaseAddress = new Uri(builder.Configuration["ScoringService:BaseUrl"]!);
//});

//builder.Services.AddScoped<IResumeService, ResumeService>();

//builder.Services.AddHttpClient<IRoute3BridgeService, Route3BridgeService>(client =>
//{
//    client.BaseAddress = new Uri(builder.Configuration["ScoringService:BaseUrl"]!);
//});

//builder.Services.AddScoped<IRoute3Service, Route3Service>();

//builder.Services.AddHttpClient<IChatBridgeService, ChatBridgeService>(client =>
//{
//    client.BaseAddress = new Uri(builder.Configuration["ScoringService:BaseUrl"]!);
//});

//builder.Services.AddScoped<IChatService, ChatService>();

//builder.Services.AddHttpClient<IInterviewBridgeService, InterviewBridgeService>(client =>
//{
//    client.BaseAddress = new Uri(builder.Configuration["ScoringService:BaseUrl"]!);
//});

//builder.Services.AddScoped<IInterviewService, InterviewService>();

//builder.Services.AddHttpClient<IRoadmapService, RoadmapService>(client =>
//{
//    client.BaseAddress = new Uri(
//        builder.Configuration["RoadmapService:BaseUrl"]
//        ?? throw new InvalidOperationException(
//            "RoadmapService:BaseUrl is not configured."
//        )
//    );

//    client.Timeout = TimeSpan.FromSeconds(60);
//});


//// builder.Services.AddOpenApi();

//// Configure port for hosting platforms that set the PORT env var (Render, Railway, etc.)
//var port = Environment.GetEnvironmentVariable("PORT");
//if (!string.IsNullOrEmpty(port))
//{
//    builder.WebHost.UseUrls($"http://+:{port}");
//}

//var app = builder.Build();
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//using (var scope = app.Services.CreateScope())
//{
//    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
//    await Minerva_Backend.Helpers.AssessmentSeeder.SeedAssessmentQuestions(dbContext);
//    await Minerva_Backend.Helpers.CareerSeeder.SeedCareers(dbContext);
//    await Minerva_Backend.Helpers.Journey1Seeder.SeedJourney1Questions(dbContext);
//}

//// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{

//}

//// Support reverse-proxy / load-balancer TLS termination (X-Forwarded-* headers)
//if (!app.Environment.IsDevelopment())
//{
//    app.UseForwardedHeaders(new ForwardedHeadersOptions
//    {
//        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
//        KnownIPNetworks = { },
//        KnownProxies = { }
//    });
//}

//app.UseHttpsRedirection();

//app.UseCors("AllowFrontend");

//app.UseAuthentication();
//app.UseAuthorization();

//app.MapControllers();

//app.Run();

//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.AspNetCore.HttpOverrides;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.IdentityModel.Tokens;
//using Minerva_Backend.Data;
//using Minerva_Backend.IServices;
//using Minerva_Backend.Models;
//using Minerva_Backend.Services;
//using System.Net;
//using System.Net.Sockets;
//using System.Text;
//using YourProject.Roadmap.Services;

//var builder = WebApplication.CreateBuilder(args);

//// Add services to the container.
//builder.Services.AddControllers();
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();
//builder.Services.AddScoped<IAuthService, AuthService>();
//builder.Services.AddScoped<IProfileService, ProfileService>();
//builder.Services.AddScoped<IScoringService, ScoringService>();
//builder.Services.AddScoped<IAssessmentService, AssessmentService>();
//builder.Services.AddScoped<ICareerService, CareerService>();
//builder.Services.AddScoped<IJourney1Service, Journey1Service>();
//builder.Services.AddScoped<IJourney2Service, Journey2Service>();

//builder.Services.AddHttpClient<IJourney1BridgeService, Journey1BridgeService>(client =>
//{
//    client.BaseAddress = new Uri(builder.Configuration["ScoringService:BaseUrl"]!);
//});

//builder.Services.AddHttpClient<IJourney2BridgeService, Journey2BridgeService>(client =>
//{
//    client.BaseAddress = new Uri(builder.Configuration["ScoringService:BaseUrl"]!);
//});

//builder.Services.AddDbContext<AppDbContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
//{
//    options.Password.RequiredLength = 6;
//    options.Password.RequireNonAlphanumeric = false;
//    options.Password.RequireUppercase = false;
//})
//    .AddEntityFrameworkStores<AppDbContext>()
//    .AddDefaultTokenProviders();

//// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

//var jwtKey = builder.Configuration["Jwt:Key"]!;
//var jwtIssuer = builder.Configuration["Jwt:Issuer"];
//var jwtAudience = builder.Configuration["Jwt:Audience"];

//builder.Services.AddAuthentication(options =>
//{
//    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//})
//    .AddJwtBearer(options =>
//    {
//        options.TokenValidationParameters = new TokenValidationParameters
//        {
//            ValidateIssuer = true,
//            ValidateAudience = true,
//            ValidateLifetime = true,
//            ValidateIssuerSigningKey = true,
//            ValidIssuer = jwtIssuer,
//            ValidAudience = jwtAudience,
//            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
//        };
//    });

//var microserviceUrl = builder.Configuration["MicroserviceBaseUrl"]
//    ?? throw new InvalidOperationException("MicroserviceBaseUrl is not configured.");

//builder.Services.AddHttpClient<IScoringService, ScoringService>(client =>
//{
//    client.BaseAddress = new Uri(microserviceUrl);
//});

//builder.Services.AddHttpClient<ICareerMatchingService, CareerMatchingService>(client =>
//{
//    client.BaseAddress = new Uri(microserviceUrl);
//});

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowFrontend", policy =>
//    {
//        var origins = new List<string> { "http://localhost:5173" };

//        var additionalOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
//        if (additionalOrigins != null)
//        {
//            origins.AddRange(additionalOrigins);
//        }

//        policy.WithOrigins(origins.ToArray())
//            .AllowAnyHeader()
//            .AllowAnyMethod()
//            .AllowCredentials();
//    });
//});

//builder.Services.AddHttpClient<IResumeBridgeService, ResumeBridgeService>(client =>
//{
//    client.BaseAddress = new Uri(builder.Configuration["ScoringService:BaseUrl"]!);
//});

//builder.Services.AddScoped<IResumeService, ResumeService>();

//builder.Services.AddHttpClient<IRoute3BridgeService, Route3BridgeService>(client =>
//{
//    client.BaseAddress = new Uri(builder.Configuration["ScoringService:BaseUrl"]!);
//});

//builder.Services.AddScoped<IRoute3Service, Route3Service>();

//builder.Services.AddHttpClient<IChatBridgeService, ChatBridgeService>(client =>
//{
//    client.BaseAddress = new Uri(builder.Configuration["ScoringService:BaseUrl"]!);
//});

//builder.Services.AddScoped<IChatService, ChatService>();

//builder.Services.AddHttpClient<IInterviewBridgeService, InterviewBridgeService>(client =>
//{
//    client.BaseAddress = new Uri(builder.Configuration["ScoringService:BaseUrl"]!);
//});

//builder.Services.AddScoped<IInterviewService, InterviewService>();

//// Roadmap Python microservice
//builder.Services.AddHttpClient<IRoadmapService, RoadmapService>(client =>
//{
//    client.BaseAddress = new Uri(microserviceUrl);
//    client.Timeout = TimeSpan.FromSeconds(60);
//});


//// builder.Services.AddOpenApi();

//// Configure port for hosting platforms that set the PORT env var (Render, Railway, etc.)
//var port = Environment.GetEnvironmentVariable("PORT");
//if (!string.IsNullOrEmpty(port))
//{
//    builder.WebHost.UseUrls($"http://+:{port}");
//}

//var app = builder.Build();

//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//using (var scope = app.Services.CreateScope())
//{
//    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
//    await Minerva_Backend.Helpers.AssessmentSeeder.SeedAssessmentQuestions(dbContext);
//    await Minerva_Backend.Helpers.CareerSeeder.SeedCareers(dbContext);
//    await Minerva_Backend.Helpers.Journey1Seeder.SeedJourney1Questions(dbContext);
//}

//// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{

//}

//// Support reverse-proxy / load-balancer TLS termination (X-Forwarded-* headers)
//if (!app.Environment.IsDevelopment())
//{
//    app.UseForwardedHeaders(new ForwardedHeadersOptions
//    {
//        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
//        KnownIPNetworks = { },
//        KnownProxies = { }
//    });
//}

//app.UseHttpsRedirection();

//app.UseCors("AllowFrontend");

//app.UseAuthentication();
//app.UseAuthorization();

//app.MapControllers();

//app.Run();


using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Minerva_Backend.Data;
using Minerva_Backend.IServices;
using Minerva_Backend.Models;
using Minerva_Backend.Services;
using System.Net;
using System.Net.Sockets;
using System.Text;
using YourProject.Roadmap.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<IScoringService, ScoringService>();
builder.Services.AddScoped<IAssessmentService, AssessmentService>();
builder.Services.AddScoped<ICareerService, CareerService>();
builder.Services.AddScoped<IJourney1Service, Journey1Service>();
builder.Services.AddScoped<IJourney2Service, Journey2Service>();

var microserviceUrl = builder.Configuration["MicroserviceBaseUrl"]
    ?? throw new InvalidOperationException("MicroserviceBaseUrl is not configured.");

builder.Services.AddHttpClient<IJourney1BridgeService, Journey1BridgeService>(client =>
{
    client.BaseAddress = new Uri(microserviceUrl);
});

builder.Services.AddHttpClient<IJourney2BridgeService, Journey2BridgeService>(client =>
{
    client.BaseAddress = new Uri(microserviceUrl);
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
})
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

var jwtKey = builder.Configuration["Jwt:Key"]!;
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddHttpClient<IScoringService, ScoringService>(client =>
{
    client.BaseAddress = new Uri(microserviceUrl);
});

builder.Services.AddHttpClient<ICareerMatchingService, CareerMatchingService>(client =>
{
    client.BaseAddress = new Uri(microserviceUrl);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var origins = new List<string> { "http://localhost:5173" };

        var additionalOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
        if (additionalOrigins != null)
        {
            origins.AddRange(additionalOrigins);
        }

        policy.WithOrigins(origins.ToArray())
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddHttpClient<IResumeBridgeService, ResumeBridgeService>(client =>
{
    client.BaseAddress = new Uri(microserviceUrl);
});

builder.Services.AddScoped<IResumeService, ResumeService>();

builder.Services.AddHttpClient<IRoute3BridgeService, Route3BridgeService>(client =>
{
    client.BaseAddress = new Uri(microserviceUrl);
});

builder.Services.AddScoped<IRoute3Service, Route3Service>();

builder.Services.AddHttpClient<IChatBridgeService, ChatBridgeService>(client =>
{
    client.BaseAddress = new Uri(microserviceUrl);
});

builder.Services.AddScoped<IChatService, ChatService>();

builder.Services.AddHttpClient<IInterviewBridgeService, InterviewBridgeService>(client =>
{
    client.BaseAddress = new Uri(microserviceUrl);
});

builder.Services.AddScoped<IInterviewService, InterviewService>();

// Roadmap Python microservice
builder.Services.AddHttpClient<IRoadmapService, RoadmapService>(client =>
{
    client.BaseAddress = new Uri(microserviceUrl);
    client.Timeout = TimeSpan.FromSeconds(60);
});


// builder.Services.AddOpenApi();

// Configure port for hosting platforms that set the PORT env var (Render, Railway, etc.)
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
{
    builder.WebHost.UseUrls($"http://+:{port}");
}

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await Minerva_Backend.Helpers.AssessmentSeeder.SeedAssessmentQuestions(dbContext);
    await Minerva_Backend.Helpers.CareerSeeder.SeedCareers(dbContext);
    await Minerva_Backend.Helpers.Journey1Seeder.SeedJourney1Questions(dbContext);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{

}

// Support reverse-proxy / load-balancer TLS termination (X-Forwarded-* headers)
if (!app.Environment.IsDevelopment())
{
    app.UseForwardedHeaders(new ForwardedHeadersOptions
    {
        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
        KnownIPNetworks = { },
        KnownProxies = { }
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();