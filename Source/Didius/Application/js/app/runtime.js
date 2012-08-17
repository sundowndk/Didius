debug : false,

initialize : function ()
{
	didius.runtime.initialize ();	
},

startup : function ()
{
	dump("App startup!");
	app.runtime.initialize ();
	
	app.customers.initialize ();
	app.auctions.initialize ();	
},

shutdown : function (ForceQuit)
{
	dump("App shutdown!");
  var appStartup = Components.classes['@mozilla.org/toolkit/app-startup;1'].getService (Components.interfaces.nsIAppStartup);

  var quitSeverity = ForceQuit ? Components.interfaces.nsIAppStartup.eForceQuit :
                                  Components.interfaces.nsIAppStartup.eAttemptQuit;
  appStartup.quit(quitSeverity);
}



