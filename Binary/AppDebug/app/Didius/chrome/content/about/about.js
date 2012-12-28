Components.utils.import("resource://didius/js/app.js");

var main = 
{
	init : function ()
	{
		main.set ();		
	},
	
	set : function ()
	{
		document.getElementById ("version").value = "v"+ app.session.appInfo.version +" build "+ app.session.appInfo.appBuildID;		
		document.getElementById ("platform").value = "Afvikles på XUL v"+ app.session.appInfo.platformVersion;		
	},	
														
	close : function ()
	{										
		// Close window.
		window.close ();
	}	
}
