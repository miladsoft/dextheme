using Blockcore.AtomicSwaps._dexhemes.libs;

namespace Blockcore.AtomicSwaps._dexhemes;

public class BootstrapBase: IBootstrapBase {
    private IDEXTheme _theme;

    // Init theme mode option from settings
    public void initThemeMode()
    {
        _theme.setModeSwitch(DEXThemeSettings.config.ModeSwitchEnabled);
        _theme.setModeDefault(DEXThemeSettings.config.ModeDefault);
    }
 
    // Init theme direction option (RTL or LTR) from settings
    public void initThemeDirection()
    {
        _theme.setDirection(DEXThemeSettings.config.Direction);
    }

    // Init RTL html attributes by checking if RTL is enabled.
    // This function is being called for the html tag
    public void initRtl()
    {
        if (_theme.isRtlDirection())
        {
            _theme.addHtmlAttribute("html", "direction", "rtl");
            _theme.addHtmlAttribute("html", "dir", "rtl");
            _theme.addHtmlAttribute("html", "style", "direction: rtl");
        }
    }

    // Init layout
    public void initLayout()
    {
        _theme.addHtmlAttribute("body", "id", "dex_app_body");
        _theme.addHtmlAttribute("body", "data-dex-app-page-loading", "on");
    }

    // Global theme initializer
    public void init(IDEXTheme theme)
    {
        _theme = theme;

        initThemeMode();
        initThemeDirection();
        initRtl();
        initLayout();
    }
}
