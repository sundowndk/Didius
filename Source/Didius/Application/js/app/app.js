var EXPORTED_SYMBOLS = ["app"];
  
var app =
{
	startup : function ()
	{
		dump("App startup!");
	},
	
	shutdown : function (ForceQuit)
	{
		dump("App shutdown!");
  		var appStartup = Components.classes['@mozilla.org/toolkit/app-startup;1'].getService (Components.interfaces.nsIAppStartup);
	
  		var quitSeverity = ForceQuit ? Components.interfaces.nsIAppStartup.eForceQuit :
                                  Components.interfaces.nsIAppStartup.eAttemptQuit;
  		appStartup.quit(quitSeverity);  		  	
	},
	
	error : function (error)
	{
		var text = "";
								
		switch (attributes.exception.split ("|")[0])
		{
		
			// CUSTOMER
			case "00120":
			{
				text = "Kunden eksistere ikke i databasen.";
				break;																
			}
		
			case "00130":
			{
				text = "Kunne ikke finde kunden der skulle slettes, prøv igen.";	
				break;																
			}
								
			case "00131":
			{
				text = "Kan ikke slette kunden da denne har tilknyttet sager. Slet sagerne og forsøg igen.";
				break;
			}
			
			// CASE
			case "00330":
			{
				text = "Kunne ikke finde sagen der skulle slettes, prøv igen.";	
				break;
			}
		
			case "00331":
			{
				text = "Kan ikke slette sagen da denne har tilknyttet effekter. Slet effekter og forsøg igen.";	
				break;
			}
			
			case "00530":
			{
				text = "Kunne ikke finde auktion der skulle slettes, prøv igen.";	
				break;																
			}
			
			case "00531":
			{
				text = "Kan ikke slette auktion da denne har tilknyttet sager. Slet sagerne og forsøg igen.";
				break;
			}
			
			// DEFAULT
			default:
			{
				text = "Der er opstået en ukendt fejl. '"+ attributes.exception +"'";
				break;
			}
		}
																								
		// Display error alert
		var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
		prompts.alert(null, "Der opstod en fejl", text);
	}
}

