using Blockcore.AtomicSwaps._dexhemes;
using Blockcore.AtomicSwaps._dexhemes.libs;
using Blockcore.AtomicSwaps.Data;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();
builder.Services.AddHttpClient();
builder.Services.AddSingleton<WeatherForecastService>();
builder.Services.AddScoped<IDEXTheme, DEXTheme>();
builder.Services.AddScoped<IBootstrapBase, BootstrapBase>();

IConfiguration configuration = new ConfigurationBuilder()
                            .AddJsonFile("appsettings.json")
                            .Build();

var app = builder.Build();

DEXThemeSettings.init(configuration);

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
