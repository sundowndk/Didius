Components.utils.import("resource://didius/js/app.js");

// ----------------------------------------------------------------------------------------------------------
// | MAIN																									|
// ----------------------------------------------------------------------------------------------------------
var main =
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	checksum : null,
	bid : null,
	customer : null,
	auction : null,
	item : null,	
	amount : null,

	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{	
		// Hook events.						
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
								if (window.arguments[0].customerId)
								{
									main.customer = didius.customer.load (window.arguments[0].customerId);										
								}			
								
								if (window.arguments[0].auctionId)
								{
									main.auction = didius.auction.load (window.arguments[0].auctionId);										
								}
								
								if (window.arguments[0].itemId)
								{									
									main.item = didius.item.load (window.arguments[0].itemId);									
									main.auction = didius.auction.load (main.item.auctionid)
								}
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
							main.set ();
						};
				
		setTimeout (onInit, 1);									
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{
		main.checksum = SNDK.tools.arrayChecksum (main.current);
		
		if (main.customer)
		{
			document.getElementById ("customername").disabled = false;
			document.getElementById ("customername").value = main.customer.name;			
		}
		
		document.getElementById ("choosecustomer").disabled = false;
		
		if (main.auction)
		{
			document.getElementById ("auctiontitle").disabled = false;
			document.getElementById ("auctiontitle").value = main.auction.title;			
		}
		
		document.getElementById ("chooseauction").disabled = false;
		
		if (main.item)
		{
			document.getElementById ("itemtitle").disabled = false;
			document.getElementById ("itemtitle").value = main.item.title;			
		}	
		
		document.getElementById ("amount").disabled = false;	
																		
		main.onChange ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | GET																								|	
	// ------------------------------------------------------------------------------------------------------
	get : function ()
	{
		main.amount = document.getElementById ("amount").value;		
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------
	onChange : function ()
	{
		main.get ();
		
		if (main.customer != null)
		{
		
		}
		else
		{
			document.getElementById ("customername").value = "";
		}
					
		if (main.auction != null)
		{
			document.getElementById ("auctiontitle").disabled = false;
			document.getElementById ("itemtitle").disabled = false;
			document.getElementById ("chooseitem").disabled = false;			
		}
		else
		{
			document.getElementById ("auctiontitle").value = "";
			document.getElementById ("auctiontitle").disabled = true;
			document.getElementById ("itemtitle").disabled = true;
			document.getElementById ("chooseitem").disabled = true;
		}
		
		if (main.item != null)
		{
		
		}
		else
		{
			document.getElementById ("itemtitle").value = "";
		}
	
		if (document.getElementById ("amount").value != 0.00 && main.customer != null && main.auction != null && main.item != null)
		{					
			document.getElementById ("create").disabled = false;
			document.getElementById ("close").disabled = false;
		}
		else
		{					
			document.getElementById ("create").disabled = true;
			document.getElementById ("close").disabled = false;
		}
	},	
	
	// ------------------------------------------------------------------------------------------------------
	// | CHOOSECUSTOMER																						|	
	// ------------------------------------------------------------------------------------------------------
	chooseCustomer : function ()
	{
		var onDone = 	function (result)
						{	
							if (result)
							{
								main.customer = result;
								document.getElementById ("customername").value = main.customer.name;
							}						
							
							main.onChange ();
						};
																										
		app.choose.customer ({onDone: onDone, parentWindow: window});
	},	
	
	// ------------------------------------------------------------------------------------------------------
	// | CHOOSEAUCTION																						|	
	// ------------------------------------------------------------------------------------------------------
	chooseAuction : function ()
	{
		var onDone = 	function (result)
						{
							if (result)
							{									
								if (main.auction != null)
								{								
									if (main.auction.id != result.id)
									{
										main.item = null;
									}
								}
								
								main.auction = result;
								document.getElementById ("auctiontitle").value = main.auction.title;								
							}							
							
							main.onChange ();
						};
																				
		app.choose.auction ({onDone: onDone, parentWindow: window});
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | CHOOSEITEM																							|	
	// ------------------------------------------------------------------------------------------------------
	chooseItem : function ()
	{
		var onDone = 	function (result)
						{
							if (result)
							{
								main.item = result;
								document.getElementById ("itemtitle").value = main.item.title;
							}							
							
							main.onChange ();
						};
																				
		app.choose.item ({auctionId: main.auction.id, onDone: onDone, parentWindow: window});
	},
			
	// ------------------------------------------------------------------------------------------------------
	// | CREATE																								|	
	// ------------------------------------------------------------------------------------------------------
	create : function ()
	{			
		main.get ();
		
		var bid = didius.bid.create ({customer: main.customer, item: main.item, amount: main.amount});
		didius.bid.save ({bid: bid});
		
		main.close ();								
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | CLOSE																								|	
	// ------------------------------------------------------------------------------------------------------
	close : function ()
	{							
		// Unhook events.
		app.events.onCustomerSave.removeHandler (eventHandlers.onCustomerSave);
		app.events.onCustomerDestroy.removeHandler (eventHandlers.onCustomerDestroy);
								
		app.events.onItemSave.removeHandler (eventHandlers.onAuctionSave);
		app.events.onItemDestroy.removeHandler (eventHandlers.onAuctionDestroy);								
								
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
	// | ONCUTOMERDESTROY																					|	
	// ------------------------------------------------------------------------------------------------------
	onCustomerDestroy : function (eventData)
	{
		if (main.customer.id == eventData.id)
		{
			main.customer = null;
			main.onChange ();
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONAUCTIONSAVE																							|	
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
	// | ONAUCTIONDESTROY																						|	
	// ------------------------------------------------------------------------------------------------------
	onAuctionDestroy : function (eventData)
	{
		if (main.auction.id == eventData.id)
		{
			main.auction = null;
			main.onChange ();
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
			document.getElementByid ("itemtitle").value = main.item.title;
			main.onChange ();			
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONITEMDESTROY																						|	
	// ------------------------------------------------------------------------------------------------------
	onItemDestroy : function (eventData)
	{
		if (main.item.id == eventData.id)
		{
			main.item = null;
			main.onChange ();
		}
	}										
}