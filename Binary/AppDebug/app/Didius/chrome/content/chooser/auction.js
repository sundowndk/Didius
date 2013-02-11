Components.utils.import("resource://didius/js/app.js");

// ----------------------------------------------------------------------------------------------------------
// | MAIN																									|
// ----------------------------------------------------------------------------------------------------------
var main = 
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	customersTreeHelper : null,

	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{				
		main.auctionsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("auctions"), sortColumn: "title", sortDirection: "descending", onDoubleClick: main.choose});				
		
		// Hook events.					
		app.events.onAuctionSave.addHandler (eventHandlers.onCustomerSave);
		app.events.onAuctionDestroy.addHandler (eventHandlers.onCustomerDestroy);
		
		// Set
		main.set ();
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{
		var onDone = 	function (items)
						{
							main.auctionsTreeHelper.disableRefresh ();
							for (idx in items)
							{									
								main.auctionsTreeHelper.addRow ({data: items[idx]});
							}
							main.auctionsTreeHelper.enableRefresh ();
							
							// Enable controls							
							document.getElementById ("auctions").disabled = false;
							
							main.onChange ();
						};
					
		didius.auction.list ({async: true, onDone: onDone});					
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------
	onChange : function ()
	{
		if (main.auctionsTreeHelper.getCurrentIndex () != -1)
		{
			document.getElementById ("close").disabled = false;
			document.getElementById ("choose").disabled = false;
		}
		else
		{
			document.getElementById ("close").disabled = false;
			document.getElementById ("choose").disabled = true;
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SORT																								|	
	// ------------------------------------------------------------------------------------------------------
	sort : function (attributes)
	{
		main.auctionsTreeHelper.sort (attributes);
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | FILTER																								|	
	// ------------------------------------------------------------------------------------------------------
	filter : function ()
	{
		var value = document.getElementById ("auctionSearch").value;
		main.auctionsTreeHelper.filter ({column: "title", columns: "no,title", value: value, direction: "in"});
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | CHOOSE																								|	
	// ------------------------------------------------------------------------------------------------------
	choose : function ()
	{
		if (window.arguments[0].onDone != null)
		{
			setTimeout (function () {window.arguments[0].onDone (main.auctionsTreeHelper.getRow ())}, 0);
			
		}
		
		setTimeout (main.close, 100);				
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | CLOSE																								|	
	// ------------------------------------------------------------------------------------------------------
	close : function ()
	{					
		// Unhook events.		
		app.events.onAuctionSave.removeHandler (eventHandlers.onAuctionSave);
		app.events.onAuctionDestroy.removeHandler (eventHandlers.onAuctionDestroy);			
	
		// Close window.
		window.close ();
	}
}

// ----------------------------------------------------------------------------------------------------------
// | EVENTHANDLERS																							|
// ----------------------------------------------------------------------------------------------------------
var	eventHandlers =
{	
	// ------------------------------------------------------------------------------------------------------
	// | ONAUCTIONSAVE																						|	
	// ------------------------------------------------------------------------------------------------------
	onAuctionSave : function (eventData)
	{
		main.auctionsTreeHelper.setRow ({data: eventData});
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONAUCTIONDESTROY																					|	
	// ------------------------------------------------------------------------------------------------------
	onAuctionDestroy : function (eventData)
	{
		main.auctionsTreeHelper.removeRow ({id: eventData.id});
	}		
}