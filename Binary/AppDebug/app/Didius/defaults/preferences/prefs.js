pref("toolkit.defaultChromeURI", "chrome://didius/content/main/main.xul");

pref("toolkit.singletonWindowType", "didius"); 

pref("print.print_headerright", " ");
pref("print.print_headercenter", " ");
pref("print.print_headerleft", " ");
pref("print.print_footerright", " ");
pref("print.print_footercenter", "&P");
pref("print.print_footerleft", " ");

pref ("print.use_global_printsettings", true);

pref ("nglayout.debug.disable_xul_cache", true);       

/* debugging prefs */
pref("browser.dom.window.dump.enabled", true);
pref("javascript.options.showInConsole", true);
pref("javascript.options.strict", true);
pref("nglayout.debug.disable_xul_cache", true);      
pref("nglayout.debug.disable_xul_fastload", true);

pref("dom.max_script_run_time", 20);



/* Disable direct2d on windows */
pref("gfx.direct2d.disabled", true);				
/* pref("layers.acceleration.disabled", true); */	// WINDOWS

/* Disable direct2d on linux */
/* pref("layers.prefer-opengl", true); */			// MAC, LINUX
