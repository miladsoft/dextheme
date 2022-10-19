using Blockcore.AtomicSwaps.Theme._dexhemes;
using Blockcore.AtomicSwaps.Theme._dexhemes.libs;

public class ThemeMiddleware {
    private readonly RequestDelegate _next;

    private readonly ILogger<ThemeMiddleware> _logger;

    public ThemeMiddleware(RequestDelegate next, ILogger<ThemeMiddleware> logger)
    {
        _logger = logger;
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, IDEXTheme theme, IBootstrapBase bootstrapBase)
    {
        bootstrapBase.init(theme);

        await _next(context);
    }
}

public static class ThemeMiddlewareExtensions
{
    public static IApplicationBuilder UseThemeMiddleware(
        this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<ThemeMiddleware>();
    }
}