namespace Layout._Helpers;

public interface IDEXThemeHelpers
{
    void addBodyAttribute(string attribute, string value);

    void removeBodyAttribute(string attribute);

    void addBodyClass(string className);

    void removeBodyClass(string className);
}