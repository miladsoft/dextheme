using Blockcore.AtomicSwaps.ThemeBase.libs;

namespace Blockcore.AtomicSwaps.ThemeBase;

public interface IBootstrapBase
{
    void initThemeMode();
    
    void initThemeDirection();
    
    void initRtl();

    void initLayout();

    void init(ITheme theme);
}