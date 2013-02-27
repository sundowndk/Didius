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
		OS : Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime).OS,
		pathSeperator : "/",
		eventListenerId: null,
		xulRuntime : Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime),
		//	inSafeMode				
		//	logConsoleErrors		
		//	OS						
		//	processType				
		//	widgetToolkit
		//	XPCOMABI
		appInfo : Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo)
		//	appBuildID
		//	ID
		//	name
		//  platformBuildID
		//  platformVersion
		//	vendor
		//	version		
	},
	
	print : 
	{
		getSettings : function ()
		{
			settings.marginLeft = 0.5;
			settings.marginRight = 0.5;
			settings.marginTop = 0.5;
			settings.marginBottom = 0.0;
			settings.shrinkToFit = true;
		
			settings.paperName =  "iso_a4";
			settings.paperWidth = 210;
			settings.paperHeight = 297
			settings.paperSizeUnit = Ci.nsIPrintSettings.kPaperSizeMillimeters;																					
	
			settings.printBGImages = true;
    		settings.printBGColors = true;    	
    	
    		settings.printFrameType = Ci.nsIPrintSettings.kFramesAsIs;
    		settings.outputFormat = Ci.nsIPrintSettings.kOutputFormatPDF;
    
    		settings.footerStrCenter = "";
    		settings.footerStrLeft = "";
    		settings.footerStrRight = "";
    		settings.headerStrCenter = "";
    		settings.headerStrLeft = "";
    		settings.headerStrRight = "";    			
		}
	},

	events : new Array (),	
	
	config : new Array (),
	
	startup : function (mainWindow)
	{
		// Make so everybody can get to the main window.
		app.mainWindow = mainWindow;
			
		if (app.session.OS == "Linux")
		{
			app.session.pathSeperator = "/";
		}			
		else if (app.session.OS == "WINNT")
		{
			app.session.pathSeperator = "\\";
		}
		else if (app.session.OS == "Darwin")
		{
			app.session.pathSeperator = "/";
		}
		
				
		//dump("App startup!");
	},
	
	shutdown : function (ForceQuit)
	{
		//dump("App shutdown!");
  		var appStartup = Components.classes['@mozilla.org/toolkit/app-startup;1'].getService (Components.interfaces.nsIAppStartup);
	
  		var quitSeverity = ForceQuit ? Components.interfaces.nsIAppStartup.eForceQuit :
                                  Components.interfaces.nsIAppStartup.eAttemptQuit;
  		appStartup.quit(quitSeverity);  		  	
	},
	
	choose : 
	{
		customer : function (attributes)
		{
			app.window.open (attributes.parentWindow, "chrome://didius/content/chooser/customer.xul", "didius.chooser.customer", "modal", attributes);				
		},
		
		auction : function (attributes)
		{			
			app.window.open (attributes.parentWindow, "chrome://didius/content/chooser/auction.xul", "didius.chooser.auction", "modal", attributes);				
		},
		
		item : function (attributes)
		{		
			app.window.open (attributes.parentWindow, "chrome://didius/content/chooser/item.xul", "didius.chooser.item", "", attributes);											
		}
	},
	
	data : 
	{
		postcodes : {},
	},
	
	window :
	{
		focusTab : function (tab)
		{
			tab.click ();
			//document.getElementById (tab).click ();
		},
	
		open : function (window, url, name, features, args)
		{
			if (window == null)
				window = app.mainWindow;
		
			var openNewWindow = true;
			var windowManager = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
			var test = windowManager.getEnumerator (null);

			while(test.hasMoreElements()) 
			{
  				var win = test.getNext().QueryInterface( Components.interfaces.nsIDOMChromeWindow );
  				if( win.name == name) 
  				{
    				openNewWindow = false;    				
    				return win;
  				}
			}

			if (openNewWindow) 
			{
				if (features == null)
					features = "resizable=yes,dialog=no,centerscreen=yes";
			
//				args.wrappedJSObject = args;
 
//				var win = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService(Components.interfaces.nsIWindowWatcher);
 
//				win.openWindow (null, url, name, features, args);

				// In the window code
				//var args = window.arguments[0].wrappedJSObject;
			
			
  				var win = window.openDialog (url, name, features, args);
  				//var win = window.open ()
  				return win;
			}		
		},

		filePicker :
		{
			nsiFilePicker : Components.interfaces.nsIFilePicker,
		
			filter :
			{
				all : Components.interfaces.nsIFilePicker.filterAll,
				HTML : Components.interfaces.nsIFilePicker.filterHTML,
				text : Components.interfaces.nsIFilePicker.filterText,
				XML : Components.interfaces.nsIFilePicker.filterXML,
				XUL : Components.interfaces.nsIFilePicker.filterXUL,
				apps : Components.interfaces.nsIFilePicker.filterApps,
				allowUrls : Components.interfaces.nsIFilePicker.filterAllowURLs,
				images : Components.interfaces.nsIFilePicker.filterImages,
				audio : Components.interfaces.nsIFilePicker.filterAudio,
				video : Components.interfaces.nsIFilePicker.filterVideo																
			},
			
			return : 
			{
				OK : Components.interfaces.nsIFilePicker.returnOK,
				Cancel : Components.interfaces.nsIFilePicker.returnCancel,
				Replace : Components.interfaces.nsIFilePicker.returnReplace
			},	
		
			open : function (attributes)
			{
				var nsIFilePicker = Components.interfaces.nsIFilePicker;
				var filePicker = Components.classes["@mozilla.org/filepicker;1"].createInstance (nsIFilePicker);
				filePicker.init (attributes.window, attributes.title, nsIFilePicker.modeOpen);
				
				if (attributes.filters != null)
				{
					for (index in attributes.filters)
					{
						filePicker.appendFilter (attributes.filters[index]);					
					}
				}
				
				return filePicker;
			},
			
			save : function ()
			{
			
			},
			
			folder : function ()
			{
			
			}		
		},		
		
		prompt :
		{
			alert : function (title, text)
			{
				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
				return prompts.alert (null, title, text)
			},
		
			confirm : function (title, text)
			{
				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
				return prompts.confirm (null, title, text);		
			}
		}
	},
	
	error : function (attributes)
	{			
		var text = "";
		
		if (attributes.errorCode != null)
		{
			switch (attributes.errorCode.split ("|")[0])
			{			
				// AUCTION.SIGNIN
				case "APP00280":
				{
					text = "Køber nummer er allerede tildelt en anden kunde.";
					break;
				}
																
				// ITEM
				case "APP00480":
				{
					text = "Der skete en fejl under upload af billede.";
					break;
				}
				
				// PDFTOEMAIL
				case "APP00150":
				{
					text = "Der skete en fejl under upload af PDF til afsendelse.";
				}
							
				case "APP00151":
				{
					text = "Der skete en fejl under afsendelse af PDF.";
				}
				
				// DEFAULT
				default:
				{
					text = "Der er opstået en ukendt fejl. '"+ attributes.errorCode +"'";
					break;
				}
			}	
			
			//text = "["+ attributes.errorCode.split ("|")[0] +"]: "+ text;		
		}
								
		if (attributes.exception != null)
		{
			dump (attributes.exception)
			
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
				
				case "SERV00601":
				{
					text = "Kan ikke lave afregning, da denne sag allerede er blevet afregnet.";
					break;
				}
				
				case "SERV00602":
				{
					text = "Kan ikke lave afregning, da der ingen effekter er som kan afregnes.";
					break;
				}
				
				case "SERV00610":
				{
					break;
				}
				
				case "SERV00620":
				{
					text = "Kan ikke hente afrening."
					break;
				}
				
				// DEFAULT
				default:
				{
					text = "Der er opstået en ukendt fejl. '"+ attributes.exception +"'";
					break;
				}
			}
		}
																								
		// Display error alert
		var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
		prompts.alert(null, "Der opstod en fejl", text);
	}
	
}

