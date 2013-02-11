Components.utils.import("resource://didius/js/app.js");

// ----------------------------------------------------------------------------------------------------------
// | MAIN																									|
// ---------------------------------------------------------------------------------------------------------
var main =
{	
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	auction : null,

	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{
		try
		{
			main.auction = didius.auction.load (window.arguments[0].auctionId);			
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}								
	
		main.set ();
		
		// Hook events.			
		app.events.onAuctionDestroy.addHandler (eventHandlers.onAuctionDestroy);						
		app.events.onAuctionControl.addHandler (eventHandlers.onAuctionControl);
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{
		var template = didius.helpers.parsePrintTemplate (didius.settings.get ({key: "didius_template_display"}));
	
		var display = document.getElementById ("iframe.display");	
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
				
		document.title = "Auktion display: "+ main.auction.title +" ["+ main.auction.no +"] - Tryk F11 for fuldskærm";
		
		main.itemSet (window.arguments[0].itemId);			
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | CLOSE																								|	
	// ------------------------------------------------------------------------------------------------------			
	close : function (force)
	{							
		// Unhook events.						
		app.events.onAuctionDestroy.removeHandler (eventHandlers.onAuctionDestroy);		
		app.events.onAuctionControl.removeHandler (eventHandlers.onAuctionControl);
							
		// Close window.		
		window.close ();
	},	
		
	// ------------------------------------------------------------------------------------------------------
	// | FULLSCREEN																							|	
	// ------------------------------------------------------------------------------------------------------
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
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ITEMSET																							|	
	// ------------------------------------------------------------------------------------------------------
	itemSet : function  (itemId)
	{
		if (itemId != null)
		{	
			var item = didius.item.load ({id: itemId});
	
			document.getElementById ("iframe.display").contentDocument.getElementById ("ItemPicture").src = didius.runtime.ajaxUrl +"getmedia/"+ item.pictureid;		
			document.getElementById ("iframe.display").contentDocument.getElementById ("ItemCatalogNo").innerHTML = item.catalogno;				
			document.getElementById ("iframe.display").contentDocument.getElementById ("ItemDescription").innerHTML = item.description;
			document.getElementById ("iframe.display").contentDocument.getElementById ("ContainerItemCatalogNo").style.display = "block";				
			document.getElementById ("iframe.display").contentDocument.getElementById ("ContainerItemDescription").style.display = "block";				
		}
		else
		{
			document.getElementById ("iframe.display").contentDocument.getElementById ("ItemPicture").src = "";
			document.getElementById ("iframe.display").contentDocument.getElementById ("ItemCatalogNo").innerHTML = " ";				
			document.getElementById ("iframe.display").contentDocument.getElementById ("ItemDescription").innerHTML = " ";			
			document.getElementById ("iframe.display").contentDocument.getElementById ("ContainerItemCatalogNo").style.display = "none";				
			document.getElementById ("iframe.display").contentDocument.getElementById ("ContainerItemDescription").style.display = "none";				
		}
	}	
}

// ----------------------------------------------------------------------------------------------------------
// | EVENTHANDLERS																							|
// ---------------------------------------------------------------------------------------------------------
var eventHandlers =
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
		if (eventData.auctionid == main.auction.id)
		{		
			switch (eventData.action)
			{
				case "auctionstart":
				{
					main.itemSet (eventData.actiondata);		
					break;
				}
				
				case "auctionstop":
				{
					main.itemSet ();		
					break;
				}			
			
				case "itemnext":
				{
					main.itemSet (eventData.actiondata);		
					break;
				}
				
				case "itemprev":
				{
					main.itemSet (eventData.actiondata);
					break;
				}				
			}					
		}
	}
}