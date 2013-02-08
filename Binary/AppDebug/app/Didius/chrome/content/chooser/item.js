Components.utils.import("resource://didius/js/app.js");

// ----------------------------------------------------------------------------------------------------------
// | MAIN																									|
// ----------------------------------------------------------------------------------------------------------
var main = 
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	auction : null,
	itemsTreeHelper : null,

	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{				
		main.itemsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("items"), sortColumn: "title", sortDirection: "descending", onDoubleClick: main.choose});				
		
		// Hook events.			
		app.events.onItemCreate.addHandler (eventHandlers.onItemCreate);		
		app.events.onItemSave.addHandler (eventHandlers.onItemSave);
		app.events.onItemDestroy.addHandler (eventHandlers.onItemDestroy);
		
		var onInit = 	function ()
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
							
							onDone ();							
						};
						
		var onDone =	function ()
						{
							// Set
							main.set ();
						};
						
		setTimeout (onInit, 1);		
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{
		var onDone = 	function (items)
						{
							main.itemsTreeHelper.disableRefresh ();
							for (idx in items)
							{									
								main.itemsTreeHelper.addRow ({data: items[idx]});
							}
							main.itemsTreeHelper.enableRefresh ();
							
							// Enable controls							
							document.getElementById ("items").disabled = false;
							
							main.onChange ();
						};
					
		didius.item.list ({auctionId: main.auction.id, async: true, onDone: onDone});					
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------
	onChange : function ()
	{
		if (main.itemsTreeHelper.getCurrentIndex () != -1)
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
		main.itemsTreeHelper.sort (attributes);
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | FILTER																								|	
	// ------------------------------------------------------------------------------------------------------
	filter : function ()
	{
		var value = document.getElementById ("itemSearch").value;
		main.itemsTreeHelper.filter ({column: "title", columns: "catalogno,no,title", value: value, direction: "in"});
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | CHOOSE																								|	
	// ------------------------------------------------------------------------------------------------------
	choose : function ()
	{
		if (window.arguments[0].onDone != null)
		{
			setTimeout (function () {window.arguments[0].onDone (main.itemsTreeHelper.getRow ()}, 0);
		}
		
		main.close ();				
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | CLOSE																								|	
	// ------------------------------------------------------------------------------------------------------
	close : function ()
	{					
		// Unhook events.
		app.events.onItemCreate.removeHandler (eventHandlers.onItemCreate);		
		app.events.onItemSave.removeHandler (eventHandlers.onItemSave);
		app.events.onItemDestroy.removeHandler (eventHandlers.onItemDestroy);			
	
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
	// | ONITEMCREATE																						|	
	// ------------------------------------------------------------------------------------------------------
	onItemCreate : function (eventData)
	{
		if (main.auction.id == eventData.auctionid)
		{
			main.itemsTreeHelper.addRow ({data: eventData});
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONITEMSAVE																							|	
	// ------------------------------------------------------------------------------------------------------
	onItemSave : function (eventData)
	{
		if (main.auction.id == eventData.auctionid)
		{
			main.itemsTreeHelper.setRow ({data: eventData});
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONITEMDESTROY																						|	
	// ------------------------------------------------------------------------------------------------------
	onItemDestroy : function (eventData)
	{
		main.itemsTreeHelper.removeRow ({id: eventData.id});
	}		
}