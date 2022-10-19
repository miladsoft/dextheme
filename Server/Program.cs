using Blockcore.AtomicSwaps.ThemeBase;
using Blockcore.AtomicSwaps.ThemeBase.libs;
using Blockcore.AtomicSwaps.Data;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();
builder.Services.AddHttpClient();
builder.Services.AddSingleton<WeatherForecastService>();
builder.Services.AddScoped<ITheme, Theme>();
builder.Services.AddScoped<IBootstrapBase, BootstrapBase>();

IConfiguration configuration = new ConfigurationBuilder()
                            .AddJsonFile("appsettings.json")
                            .Build();

var app = builder.Build();

ThemeSettings.init(configuration);

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
}


app.UseStaticFiles();

app.UseRouting();
app.MapBlazorHub();
app.MapFallbackToPage("/_Host");

app.Run();
