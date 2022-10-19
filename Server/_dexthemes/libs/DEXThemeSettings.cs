namespace Blockcore.AtomicSwaps.Theme._dexhemes.libs;

class DEXThemeSettings
{
    public static DEXThemeBase config;

    public static void init(IConfiguration configuration)
    {
        config = configuration.GetSection("DEX").Get<DEXThemeBase>();
    }
}
