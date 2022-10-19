using Blockcore.AtomicSwaps._dexhemes.libs;

namespace Blockcore.AtomicSwaps._dexhemes;

public interface IBootstrapBase
{
    void initThemeMode();
    
    void initThemeDirection();
    
    void initRtl();

    void initLayout();

    void init(IDEXTheme theme);
}