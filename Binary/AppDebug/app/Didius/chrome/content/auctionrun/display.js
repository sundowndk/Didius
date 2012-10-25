Components.utils.import("resource://didius/js/app.js");

var main =
{	
	current : null,

	init : function ()
	{
		try
		{
//			main.current = didius.auction.load (window.arguments[0].auctionId);			
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}								
	
		main.set ();
		
		
		//window.fullScreen = true;
		
		//window.hidechrome = true
		
		sXUL.console.log ("vgl")
		
		setTimeout( function () {window.fullScreen = true}, 1);

		
		// Hook events.			
		app.events.onAuctionDestroy.addHandler (main.eventHandlers.onAuctionDestroy);				
	},
	
	eventHandlers : 
	{								
		onAuctionDestroy : function (eventData)
		{
			if (main.current.id == eventData.id)
			{
				main.close (true);
			}
		}
	},
		
	set : function ()
	{
	},
				
	close : function (force)
	{							
		// Unhook events.						
		app.events.onAuctionDestroy.removeHandler (main.eventHandlers.onAuctionDestroy);
							
		// Close window.		
		window.close ();
	}	
}