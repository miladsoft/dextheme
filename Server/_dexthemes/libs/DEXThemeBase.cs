namespace Blockcore.AtomicSwaps._dexhemes.libs;

// Base type class for theme settings
class DEXThemeBase
{
    public string ThemeDir { get; set; }

    public string Direction { get; set; }

    public bool ModeSwitchEnabled { get; set; }

    public string ModeDefault { get; set; }

    public string AssetsDir { get; set; }

    public DEXThemeAssets Assets { get; set; }

    public SortedDictionary<string, SortedDictionary<string, string[]>> Vendors { get; set; }
}
