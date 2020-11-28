(async () => {

    messenger.WindowListener.registerDefaultPrefs("defaults/preferences/tbdialout.js");
    
    messenger.WindowListener.registerChromeUrl([
        ["content", "tbdialout",  "chrome/content/"],
        ["locale",  "tbdialout",  "en-US",  "chrome/locale/en-US/"],
        ["locale",  "tbdialout",  "en-GB",  "chrome/locale/en-GB/"],
        ["locale",  "tbdialout",  "de",  "chrome/locale/de/"],
        ["locale",  "tbdialout",  "es-ES",  "chrome/locale/es-ES/"],
        ["locale",  "tbdialout",  "zh-CN",  "chrome/locale/zh-CN/"],
        ["locale",  "tbdialout",  "nl",  "chrome/locale/nl/"],
        ["locale",  "tbdialout",  "fr",  "chrome/locale/fr/"],
        ["locale",  "tbdialout",  "sv-SE",  "chrome/locale/sv-SE/"],
        ["locale",  "tbdialout",  "it",  "chrome/locale/it/"],
        ["locale",  "tbdialout",  "ru",  "chrome/locale/ru/"],
        ["resource",  "tbdialout",  "chrome/"]
    ]);
    
    messenger.WindowListener.registerOptionsPage("chrome://tbdialout/content/options.xhtml");
    
    messenger.WindowListener.registerWindow(
        "chrome://messenger/content/addressbook/addressbook.xhtml", 
        "chrome://tbdialout/content/scripts/addressbook.js");
    messenger.WindowListener.registerWindow(
        "chrome://messenger/content/customizeToolbar.xhtml", 
        "chrome://tbdialout/content/scripts/toolbar.js");
    
    //messenger.WindowListener.registerShutdownScript("chrome://tbdialout/content/scripts/shutdown.js");
    
    messenger.WindowListener.startListening();

})()