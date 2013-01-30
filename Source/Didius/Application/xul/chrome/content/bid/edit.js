Components.utils.import("resource://didius/js/app.js");

// ----------------------------------------------------------------------------------------------------------
// | MAIN																									|
// ----------------------------------------------------------------------------------------------------------
var main =
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	mode : "EDIT",
	checksum : null,
	bid : null,
	customer : null,
	auction : null,
	case : null,
	item : null,

	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{	 
		// Hook events.								
		app.events.onBidDestroy.addHandler (eventHandlers.onBidDestroy);
		
		app.events.onCustomerSave.addHandler (eventHandlers.onCustomerSave);
		app.events.onCustomerDestroy.addHandler (eventHandlers.onCustomerDestroy);					
		
		app.events.onAuctionSave.addHandler (eventHandlers.onAuctionSave);
		app.events.onAuctionDestroy.addHandler (eventHandlers.onAuctionDestroy);					
		
		app.events.onItemSave.addHandler (eventHandlers.onItemSave);
		app.events.onItemDestroy.addHandler (eventHandlers.onItemDestroy);


		var onInit =	function ()
						{
							try
							{
								main.bid = didius.bid.load ({id: window.arguments[0].bidId});											
								main.customer = didius.customer.load (main.bid.customerid);
								main.item = didius.item.load (main.bid.itemid);
								main.case = didius.case.load (main.item.caseid);
								main.auction = didius.auction.load (main.case.auctionid);
							}
							catch (exception)
							{
								app.error ({exception: exception})
								main.close ();
								return;			
							}
							
							onDone ();
						};
						
		var onDone =	function ()
						{
							main.set ();
						};
						
		setTimeout (onInit, 1);
	},
				
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{			
		main.checksum = SNDK.tools.arrayChecksum (main.bid);
	
		document.getElementById ("customername").value = main.customer.name;
		document.getElementById ("auctiontitle").value = main.auction.title;
		document.getElementById ("itemtitle").value = main.item.title;	
		document.getElementById ("amount").value = main.bid.amount;		
		document.getElementById ("amount").disabled = false;
		
		if (main.item.invoiced == true)
		{
			if (app.window.prompt.confirm ("Bud er faktureret", "Før dette bud kan rettes, skal der laves en kreditnota. Vil du gøre dette ?"))
			{				
				var creditnote = didius.creditnote.create ({customer: main.customer, item: main.item, simulate: false});
				
				//sXUL.console.log (creditnote);
				main.mode = "EDIT";
			}
			else
			{
				main.mode = "SHOW";
			}
		}
		
//		switch (main.mode)
//		{
//			case "SHOW":
//			{
//				document.getElementById ("amount").disabled = true;
//				break;
//			}
//			
//			case "EDIT":
//			{
//				break;
//			}
//		}
														
		main.onChange ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | GET																								|	
	// ------------------------------------------------------------------------------------------------------
	get : function ()
	{					
		main.bid.amount =  parseInt (document.getElementById ("amount").value);
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SAVE																								|	
	// ------------------------------------------------------------------------------------------------------
	save : function ()
	{			
		main.get ();
				
		didius.bid.save ({bid: main.bid});
		
		main.checksum = SNDK.tools.arrayChecksum (main.bid);
		main.onChange ();								
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | CLOSE																								|	
	// ------------------------------------------------------------------------------------------------------
	close : function (force)
	{		
		// If we are forced to close, then dont promt user about potential unsaved data.		
		if (!force)
		{	
			// If checksums do not match, promt user about unsaved data.
			if ((SNDK.tools.arrayChecksum (main.bid) != main.checksum))
			{
				if (!app.window.prompt.confirm ("Ændringer ikke gemt", "Der er fortaget ændringer, der ikke er gemt, vil du forsætte ?"))				
				{
					return false;
				}			
			}
		}
											
		// Unhook events.
		app.events.onBidDestroy.removeHandler (eventHandlers.onBidDestroy);
		
		app.events.onCustomerSave.removeHandler (eventHandlers.onCustomerSave);
		app.events.onCustomerDestroy.removeHandler (eventHandlers.onCustomerDestroy);
								
		app.events.onAuctionSave.removeHandler (eventHandlers.onAuctionSave);
		app.events.onAuctionDestroy.removeHandler (eventHandlers.onAuctionDestroy);								
								
		app.events.onItemSave.removeHandler (eventHandlers.onItemSave);
		app.events.onItemDestroy.removeHandler (eventHandlers.onItemDestroy);
	
		// Close window.
		window.close ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------
	onChange : function ()
	{
		main.get ();
	
		if ((SNDK.tools.arrayChecksum (main.bid) != main.checksum))
		{					
			document.getElementById ("save").disabled = false;
			document.getElementById ("close").disabled = false;
		}
		else
		{					
			document.getElementById ("save").disabled = true;
			document.getElementById ("close").disabled = false;
		}
		
		switch (main.mode)
		{
			case "SHOW":
			{
				document.getElementById ("amount").disabled = true;
				document.getElementById ("save").disabled = true;
				break;
			}
			
			case "EDIT":
			{
				document.getElementById ("amount").disabled = false;				
			}
		}
	}	
}

// ----------------------------------------------------------------------------------------------------------
// | EVENTHANDLERS																							|
// ----------------------------------------------------------------------------------------------------------
var eventHandlers =
{
	// ------------------------------------------------------------------------------------------------------
	// | ONBIDDESTROY																						|	
	// ------------------------------------------------------------------------------------------------------
	onBidDestroy : function (eventData)
	{
		if (main.bid.id == eventData.id)
		{
			main.close (true);
		}
	},									

	// ------------------------------------------------------------------------------------------------------
	// | ONCUSTOMERSAVE																						|	
	// ------------------------------------------------------------------------------------------------------
	onCustomerSave : function (eventData)
	{			
		if (main.customer.id == eventData.id)
		{
			main.customer = eventData;
			document.getElementById ("customername").value = main.customer.name;			
			main.onChange ();
		}
	},

	// ------------------------------------------------------------------------------------------------------
	// | ONCUSTOMERDESTROY																					|	
	// ------------------------------------------------------------------------------------------------------
	onCustomerDestroy : function (eventData)
	{
		if (main.customer.id == eventData.id)
		{
			main.close (true);
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONAUCTIONSAVE																						|	
	// ------------------------------------------------------------------------------------------------------	
	onAuctionSave : function (eventData)
	{			
		if (main.auction.id == eventData.id)
		{
			main.auction = eventData;
			document.getElementById ("auctiontitle").value = main.auction.title;
			main.onChange ();
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONAUCTIONDESTROY																					|	
	// ------------------------------------------------------------------------------------------------------
	onAuctionDestroy : function (eventData)
	{
		if (main.auction.id == eventData.id)
		{
			main.close (true);
		}
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | ONITEMSAVE																							|	
	// ------------------------------------------------------------------------------------------------------	
	onItemSave : function (eventData)
	{			
		if (main.item.id == eventData.id)
		{
			main.item = eventData;
			document.getElementById ("itemtitle").value = main.item.title;
			main.onChanges ();
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONITEMDESTROY																						|	
	// ------------------------------------------------------------------------------------------------------
	onItemDestroy : function (eventData)
	{
		if (main.item.id == eventData.id)
		{
			main.close (true);
		}
	}										
}