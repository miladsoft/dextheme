namespace Blockcore.AtomicSwaps.Server.ThemeBase.libs;

class ThemeSettings
{
    public static ThemeBase config;

    public static void init(IConfiguration configuration)
    {
        config = configuration.GetSection("DEX").Get<ThemeBase>();
    }
}