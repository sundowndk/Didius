var EXPORTED_SYMBOLS = ["app", "event"];
  
function event()
{
	this.eventHandlers = new Array ();
}

event.prototype.addHandler = function(eventHandler)
{	
	this.eventHandlers.push(eventHandler);
}

event.prototype.removeHandler = function (fn)
{	
	for (var i in this.eventHandlers) 
	{	
		if (this.eventHandlers[i] === fn) 
		{			
			this.eventHandlers.splice(i, 1);
			return;
		}
	}
}

event.prototype.execute = function(args)
{
	for(var i = 0; i < this.eventHandlers.length; i++)
	{
		this.eventHandlers[i](args);
	}
}







  
var app =
{
	mainWindow : null,
	
	session :
	{
		loggedIn : false,
		current : null,
		eventListenerId: null		
	},

	events : new Array (),	

	startup : function (mainWindow)
	{
		// Make so everybody can get to the main window.
		app.mainWindow = mainWindow;
	
		// Setup events.
//		app.events.onCustomerCreate = new event ();
//		app.events.onCustomerLoad = new event ();
//		app.events.onCustomerSave = new event ();
//		app.events.onCustomerDestroy = new event ();
		
		app.events.onCaseCreate = new event ();
		app.events.onCaseLoad = new event ();
		app.events.onCaseSave = new event ();
		app.events.onCaseDestroy = new event ();
		
		app.events.onItemCreate = new event ();
		app.events.onItemLoad = new event ();
		app.events.onItemSave = new event ();
		app.events.onItemDestroy = new event ();
				
		app.events.onAuctionCreate = new event ();
		app.events.onAuctionLoad = new event ();
		app.events.onAuctionSave = new event ();
		app.events.onAuctionDestroy = new event ();
				
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
	
	choose : 
	{
		customer : function (attributes)
		{
			app.mainWindow.openDialog ("chrome://didius/content/chooser/customer.xul", "test", "chrome", attributes);
		}	
	},
	
	error : function (attributes)
	{
		dump (attributes.exception)
	
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
				text = "Kan ikke slette kunden da denne har tilknyttet sager. Slet alle sagerne og forsøg igen.";
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

