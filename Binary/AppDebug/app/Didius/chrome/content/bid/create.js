Components.utils.import("resource://didius/js/app.js");

// ----------------------------------------------------------------------------------------------------------
// | MAIN																									|
// ----------------------------------------------------------------------------------------------------------
var main =
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	lockCustomer : false,
	lockAuction : false,
	lockItem : false,
	checksum : null,
	bid : null,
	customer : null,
	auction : null,
	case : null,
	item : null,	
	amount : null,

	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{			
		var onInit =	function ()
						{
							try
							{
								if (window.arguments[0].customerId)
								{
									main.customer = didius.customer.load (window.arguments[0].customerId);									
									main.lockCustomer = true;
								}			
								
								if (window.arguments[0].auctionId)
								{
									main.auction = didius.auction.load (window.arguments[0].auctionId);																			
									main.lockAuction = true;
								}
								
								if (window.arguments[0].itemId)
								{							
									main.item = didius.item.load ({id: window.arguments[0].itemId});
									main.case = didius.case.load ({id: main.item.caseid});
									main.auction = didius.auction.load (main.case.auctionid);
									
									main.lockAuction = true;
									main.lockItem = true;
								}
							}
							catch (error)
							{
								app.error ({exception: error})
								main.close ();
								return;
							}
							
							main.set ();
						};
						
		setTimeout (onInit, 1);			
		
		// Hook events.						
		app.events.onCustomerSave.addHandler (eventHandlers.onCustomerSave);
		app.events.onCustomerDestroy.addHandler (eventHandlers.onCustomerDestroy);
		
		app.events.onAuctionSave.addHandler (eventHandlers.onAuctionSave);
		app.events.onAuctionDestroy.addHandler (eventHandlers.onAuctionDestroy);
		
		app.events.onItemSave.addHandler (eventHandlers.onItemSave);
		app.events.onItemDestroy.addHandler (eventHandlers.onItemDestroy);									
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{
		main.checksum = SNDK.tools.arrayChecksum (main.current);

		if (main.customer)
		{
			document.getElementById ("textbox.customername").value = main.customer.name;			
		}
		
		document.getElementById ("textbox.customername").disabled = false;;			

		if (main.lockCustomer)
		{
			document.getElementById ("button.choosecustomer").disabled = true;
		}
		else
		{
			document.getElementById ("button.choosecustomer").disabled = false;
		}
		
		if (main.auction)
		{
			document.getElementById ("textbox.auctiontitle").value = main.auction.title;
		}
		
		document.getElementById ("textbox.auctiontitle").disabled = false;
		
		if (main.lockAuction)
		{
			document.getElementById ("button.chooseauction").disabled = true;
		}
		else
		{
			document.getElementById ("button.chooseauction").disabled = false;
		}
		
		if (main.item)
		{
			document.getElementById ("textbox.itemtitle").value = main.item.title;			
		}	
		
		document.getElementById ("textbox.itemtitle").disabled = false;
		
		if (main.lockItem)
		{
			document.getElementById ("button.chooseitem").disabled = true;
		}
		else
		{
			document.getElementById ("button.chooseitem").disabled = false;
		}
		
		document.getElementById ("textbox.amount").disabled = false;	
		document.getElementById ("textbox.amount").focus ();
																		
		main.onChange ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | GET																								|	
	// ------------------------------------------------------------------------------------------------------
	get : function ()
	{
		main.amount = document.getElementById ("textbox.amount").value;		
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------
	onChange : function ()
	{
		main.get ();
		
		if (main.customer == null)
		{
			document.getElementById ("textbox.customername").value = "";
			document.getElementById ("button.choosecustomer").disabled = false;					
		}		
					
		if (main.auction == null)
		{
			document.getElementById ("textbox.auctiontitle").value = "";			
			document.getElementById ("button.chooseauction").disabled = true;
			document.getElementById ("button.chooseitem").disabled = true;					
		}

		if (main.item == null)
		{
			document.getElementById ("textbox.itemtitle").value = "";
			document.getElementById ("textbox.amount").disabled = true;
		}
		else
		{
			document.getElementById ("textbox.amount").disabled = false;			
		}
	
		if (document.getElementById ("textbox.amount").value != 0.00 && main.customer != null && main.auction != null && main.item != null)
		{					
			document.getElementById ("button.create").disabled = false;
			document.getElementById ("button.close").disabled = false;
		}
		else
		{					
			document.getElementById ("button.create").disabled = true;
			document.getElementById ("button.close").disabled = false;
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
								document.getElementById ("textbox.customername").value = main.customer.name;
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
								document.getElementById ("textbox.auctiontitle").value = main.auction.title;								
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
								document.getElementById ("textbox.itemtitle").value = main.item.title;
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
			document.getElementById ("textbox.customername").value = main.customer.name;
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
			document.getElementById ("textbox.auctiontitle").value = main.auction.title;
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
			document.getElementByid ("textbox.itemtitle").value = main.item.title;
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