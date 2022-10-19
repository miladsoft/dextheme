using Blockcore.AtomicSwaps.Theme._dexhemes.libs;

namespace Blockcore.AtomicSwaps.Theme._dexhemes;

public interface IBootstrapBase
{
    void initThemeMode();
    
    void initThemeDirection();
    
    void initRtl();

    void initLayout();

    void init(IDEXTheme theme);
}