using Microsoft.JSInterop;

namespace Layout._Helpers;

class KTThemeHelpers: IKTThemeHelpers
{
    private IJSRuntime _js;

    public KTThemeHelpers(IJSRuntime js)
    {
        _js = js;
    }

    public void addBodyAttribute(string attribute, string value)
    {
        _js.InvokeVoidAsync("document.body.setAttribute", attribute, value);
    }

    public void removeBodyAttribute(string attribute)
    {
        _js.InvokeVoidAsync("document.body.classList.removeAttribute", attribute);
    }

    public void addBodyClass(string className)
    {
        _js.InvokeVoidAsync("document.body.classList.add", className);
    }

    public void removeBodyClass(string className)
    {
        _js.InvokeVoidAsync("document.body.classList.remove", className);
    }
}
