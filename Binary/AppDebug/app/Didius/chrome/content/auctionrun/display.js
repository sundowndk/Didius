Components.utils.import("resource://didius/js/app.js");

var main =
{	
	current : null,

	init : function ()
	{
		try
		{
			main.current = didius.auction.load (window.arguments[0].auctionId);			
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}								
	
		main.set ();
		
		// Hook events.			
		app.events.onAuctionDestroy.addHandler (main.eventHandlers.onAuctionDestroy);				
		
		app.events.onAuctionControl.addHandler (main.eventHandlers.onAuctionControl);
	},
	
	eventHandlers : 
	{								
		onAuctionDestroy : function (eventData)
		{
			if (main.current.id == eventData.id)
			{
				main.close (true);
			}
		},
		
		onAuctionControl : function (eventData)
		{
			if (eventData.auctionid == main.current.id)
			{		
				switch (eventData.action)
				{
					case "auctionstart":
					{
						main.setItem (eventData.actiondata);		
						break;
					}
					
					case "auctionstop":
					{
						main.setItem ();		
						break;
					}			
				
					case "itemnext":
					{
						main.setItem (eventData.actiondata);		
						break;
					}
					
					case "itemprev":
					{
						main.setItem (eventData.actiondata);
						break;
					}				
				}					
			}
		}
	},
		
	set : function ()
	{
		var template = didius.helpers.parsePrintTemplate (sXUL.tools.fileToString ("chrome://didius/content/templates/display.tpl"));
	
		var display = document.getElementById ("display");	
		display.contentDocument.body.innerHTML = " ";						
	
		// Add styles.																		
		var styles = display.contentDocument.createElement ("style");
		display.contentDocument.body.appendChild (styles);					
		styles.innerHTML = template.styles;
	
		// Create content.				
		var content = display.contentDocument.createElement ("div");		
		display.contentDocument.body.appendChild (content);
																	
		// Add inital content.
		var render = template.page;
		content.innerHTML = render;
				
		document.title = "Auktion display: "+ main.current.title +" ["+ main.current.no +"] - Tryk F11 for fuldskærm";
		
		main.setItem (window.arguments[0].itemId);			
	},
	
	setItem : function  (itemId)
	{
		if (itemId != null)
		{	
			var item = didius.item.load (itemId);
	
			document.getElementById ("display").contentDocument.getElementById ("ItemPicture").src = didius.runtime.ajaxUrl +"getmedia/"+ item.pictureid;		
			document.getElementById ("display").contentDocument.getElementById ("ItemCatalogNo").innerHTML = item.catalogno;				
			document.getElementById ("display").contentDocument.getElementById ("ContainerItemCatalogNo").style.display = "block";				
		}
		else
		{
			document.getElementById ("display").contentDocument.getElementById ("ItemPicture").src = "";
			document.getElementById ("display").contentDocument.getElementById ("ItemCatalogNo").innerHTML = " ";				
			document.getElementById ("display").contentDocument.getElementById ("ContainerItemCatalogNo").style.display = "none";				
		}
	},
				
	close : function (force)
	{							
		// Unhook events.						
		app.events.onAuctionDestroy.removeHandler (main.eventHandlers.onAuctionDestroy);
		
		app.events.onAuctionControl.removeHandler (main.eventHandlers.onAuctionControl);
							
		// Close window.		
		window.close ();
	},
	
	fullscreen : function ()
	{
		if (!window.fullScreen)
		{
			window.fullScreen = true;
		}
		else
		{
			window.fullScreen = false;
		}
	}
}