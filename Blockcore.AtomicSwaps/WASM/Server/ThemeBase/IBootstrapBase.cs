using Blockcore.AtomicSwaps.Server.ThemeBase.libs;

namespace Blockcore.AtomicSwaps.Server.ThemeBase;

public interface IBootstrapBase
{
    void initThemeMode();
    
    void initThemeDirection();
    
    void initRtl();

    void initLayout();

    void init(ITheme theme);
}