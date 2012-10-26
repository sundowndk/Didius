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
					
	//setTimeout( function () {window.fullScreen = true}, 1);
		
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
			
			
			main.setItem (eventData.actiondata);
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
		
		

	},
	
	setItem : function  (itemId)
	{
		var item = didius.item.load (itemId);
	
		document.getElementById ("display").contentDocument.getElementById ("ItemPicture").src = didius.runtime.ajaxUrl +"getmedia/"+ item.pictureid;
		
		document.getElementById ("display").contentDocument.getElementById ("ItemCatalogNo").innerHTML = item.catalogno;
		
		sXUL.console.log (didius.runtime.ajaxUrl +"getmedia/"+ item.pictureid)
//			sXUL.console.log (eventData.actiondata);
		
//					document.getElementById ("itemPicture").src = "http://sorentotest.sundown.dk/getmedia/" + main.items[catalogNo].pictureid;
		
		
	},
				
	close : function (force)
	{							
		// Unhook events.						
		app.events.onAuctionDestroy.removeHandler (main.eventHandlers.onAuctionDestroy);
		
		app.events.onAuctionControl.removeHandler (main.eventHandlers.onAuctionControl);
							
		// Close window.		
		window.close ();
	}	
}