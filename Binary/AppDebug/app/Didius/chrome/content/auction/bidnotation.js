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
	running : false,
	items : null,
	currentIndex : 0,
	buyernos: {},
	
	itemsTreeHelper: null,

	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{
		try
		{
			main.auction = didius.auction.load (window.arguments[0].auctionId);				
			main.buyernos = didius.helpers.parseBuyerNos (main.auction.buyernos);				
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}								
	
		main.itemsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("tree.items"), sortColumn: "catalogno", sortDirection: "descending"});
	
		main.set ();
		
		// Hook events.			
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
		var onDone = 	function (result)
						{	
							main.items = result;
							main.itemsTreeHelper.disableRefresh ();
							for (var index in main.items)
							{				
								var item = main.items[index];					
								var data = {};
								data.id = item.id;
								data.count = index;
								data.catalogno = item.catalogno;
								data.no = item.no;
								data.title = item.title;
							
								main.itemsTreeHelper.addRow ({data: data});
							}					
							main.itemsTreeHelper.enableRefresh ();
							
							if (main.items.length > 0)
							{
								main.setItem (0);
							}	
							else
							{
								document.getElementById ("textbox.bidbuyerno").disabled = true;
								document.getElementById ("textbox.bidamount").disabled = true;		
							}								
							
							document.getElementById ("tree.items").disabled = false;							
							document.getElementById ("button.close").disabled = false;							
						};
	
		main.items = didius.item.list ({auction: main.auction, async: true, onDone: onDone});
													
		document.title = "Auktion budnotering: "+ main.auction.title +" ["+ main.auction.no +"]";				
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | GET																								|	
	// ------------------------------------------------------------------------------------------------------
	get : function ()
	{
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------
	onChange : function ()
	{
		if (main.itemsTreeHelper.getCurrentIndex () != -1)
		{										
			main.setItem (parseInt (main.itemsTreeHelper.getRow ().count));
		}
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | GETBID																								|	
	// ------------------------------------------------------------------------------------------------------
	getBid : function ()
	{
		//if (document.getElementById ("textbox.bidbuyerno").value != 0 && document.getElementById ("textbox.bidamount").value != 0.00)
		if (document.getElementById ("textbox.bidamount").value != 0.00)
		{
			var buyerno = document.getElementById ("textbox.bidbuyerno").value;
			var amount = document.getElementById ("textbox.bidamount").value;
			var maxautobidamount = document.getElementById ("textbox.currentmaxautobidamount").value; 
			
			if (buyerno == "0")
			{
				if (document.getElementById ("textbox.currentmaxautobidamount").value != "")
				{
												
					if (parseInt (maxautobidamount) >= parseInt (amount))
					{
						if (!app.window.prompt.confirm ("Bud unden køber nr.", "Der vil blive afgivet et bude uden køber nr. for at byde autobud op, vil du tillade dette ?"))
						{
							return false;
						}
						else
						{					
							var autobids = didius.autobid.list ({itemId: main.items[main.currentIndex].id});									
							var customer = didius.customer.load (autobids[0].customerid);																	
							var bid = didius.bid.create ({customerId: customer.id, item: item, amount: amount});
							didius.bid.save ({bid: bid});						
																		
							return true;
						}
					}
					else
					{
						app.window.prompt.alert ("Bud", "Det angivet bud er højere end max autobud. Derfor kan bud uden køber nr. ikke accepteres.");
						return false;									
					}
				}	
				else
				{
					app.window.prompt.alert ("Bud", "Der er ingen autobud på denne effekt. Derfor kan bud uden køber nr. ikke accepteres.");
					return false;				
				}			
			}	
			else
			{																						
				for (var index in main.buyernos)
				{							
					if (index == buyerno)
					{									
						//var customer = didius.customer.load (main.buyernos[index]);
						var item = main.items[(main.currentIndex)];
															
						if (amount <= item.bidamount)
						{
							app.window.prompt.alert ("Bud", "Budet er mindre end nuværende bud, og kan derfor ikke accepteres");
							return false;
						}
						
						if (amount < item.minimumbid )
						{
							if (!app.window.prompt.confirm ("Minimums bud", "Budet er mindre end effektens minimumsbuds grænse, vil du fjerne denne grænse og tillade budet ?"))
							{
								return false;
							}	
							
							item.minimumbid = 0;
						}
					
						var bid = didius.bid.create ({customerId: main.buyernos[index], item: item, amount: amount});
						didius.bid.save ({bid: bid});
						
						didius.item.save ({item: item});
						
						return true;		
					}
				}
			}
			
			app.error ({errorCode: "APP00280"});
			
			return false;
		}
		else
		{
			return true;
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONBIDAMOUNTKEYPRESS																				|	
	// ------------------------------------------------------------------------------------------------------
	onBidAmountKeyPress : function (event)
	{	 
		// PAGEUP
		if (event.keyCode == 33)
		{
			main.itemPrev ();
			return false;
		}
		
		// PAGEDOWN
		if (event.keyCode == 34)
		{
			main.itemNext ();
			return false;
		}
	
		// ENTER
		if (event.keyCode == 13)
		{
			document.getElementById ("textbox.bidbuyerno").focus ();
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONBUYERNOKEYPRESS																					|	
	// ------------------------------------------------------------------------------------------------------
	onBuyerNoKeyPress : function (event)
	{
		// PAGEUP
		if (event.keyCode == 33)
		{
			main.itemPrev ();
			return false;
		}
		
		// PAGEDOWN
		if (event.keyCode == 34)
		{
			main.itemNext ();
			return false;
		}
	
		if (event.keyCode == 13)
		{
			if (main.getBid ())
			{
				main.itemNext ();		
			}
		}
	},

	// ------------------------------------------------------------------------------------------------------
	// | ITEMPREV																							|	
	// ------------------------------------------------------------------------------------------------------
	itemPrev : function ()
	{
		if (main.currentIndex > 0)
		{					
			main.setItem ((main.currentIndex - 1));
		}
	},
			
	// ------------------------------------------------------------------------------------------------------
	// | ITEMNEXT																							|	
	// ------------------------------------------------------------------------------------------------------			
	itemNext : function ()
	{
		if (main.currentIndex < (main.items.length - 1))
		{
			main.setItem ((main.currentIndex + 1));										
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SETITEM																							|	
	// ------------------------------------------------------------------------------------------------------
	setItem : function (index)
	{									
		main.currentIndex = index;
	
		main.itemsTreeHelper.select (index);
	
		document.getElementById ("caption.counter").label = "Effekt "+ (main.currentIndex + 1)  +" af "+ main.items.length;
		
		 
		
		document.getElementById ("textbox.itemcatalogno").value = main.items[main.currentIndex].catalogno;
		document.getElementById ("textbox.itemdescription").value = main.items[main.currentIndex].description;
		
		document.getElementById ("textbox.itemminimumbid").value = main.items[main.currentIndex].minimumbid;
		document.getElementById ("textbox.itemappraisal1").value = main.items[main.currentIndex].appraisal1;
		document.getElementById ("textbox.itemappraisal2").value = main.items[main.currentIndex].appraisal2;
		document.getElementById ("textbox.itemappraisal3").value = main.items[main.currentIndex].appraisal3;
			
		if (main.items[main.currentIndex].pictureid != SNDK.tools.emptyGuid)
		{
			document.getElementById ("image.itempicture").src = didius.runtime.ajaxUrl +"getmedia/" + main.items[main.currentIndex].pictureid;
		}
		else
		{
			document.getElementById ("image.itempicture").src = "chrome://didius/content/icons/noimage.jpg";
		}
									
		if (main.items[main.currentIndex].currentbidid != SNDK.tools.emptyGuid)
		{
			var bid = didius.bid.load ({id: main.items[main.currentIndex].currentbidid});
		
			document.getElementById ("textbox.currentbidcustomername").value = bid.customer.name;
			document.getElementById ("textbox.currentbidamount").value = bid.amount;
		}
		else
		{
			document.getElementById ("textbox.currentbidcustomername").value = "";
			document.getElementById ("textbox.currentbidamount").value = "";
		}
		
		document.getElementById ("textbox.bidbuyerno").value = "";
		document.getElementById ("textbox.bidamount").value = "";
		
		if (!main.items[main.currentIndex].invoiced)
		{
			document.getElementById ("textbox.bidbuyerno").disabled = false;
			document.getElementById ("textbox.bidamount").disabled = false;
		}
		else
		{
			document.getElementById ("textbox.bidbuyerno").disabled = true;
			document.getElementById ("textbox.bidamount").disabled = true;
		}
		
		var autobids = didius.autobid.list ({itemId: main.items[main.currentIndex].id});
		
		if (autobids != null)
		{
			if (autobids.length > 0)
			{
				var customer = didius.customer.load (autobids[0].customerid);
				var amount = autobids[0].amount;
			
				document.getElementById ("textbox.currentmaxautobidcustomername").value = customer.name;
				document.getElementById ("textbox.currentmaxautobidamount").value = amount;						
			}
			else
			{
				document.getElementById ("textbox.currentmaxautobidcustomername").value = "";
				document.getElementById ("textbox.currentmaxautobidamount").value = "";			
			}		
		}
		
		document.getElementById ("textbox.bidamount").focus ();
		
		
		
	},	
	
	// ------------------------------------------------------------------------------------------------------
	// | CLOSE																								|	
	// ------------------------------------------------------------------------------------------------------						
	close : function ()
	{				
		// Unhook events.						
		app.events.onAuctionDestroy.removeHandler (eventHandlers.onAuctionDestroy);
		app.events.onAuctionDestroy.removeHandler (eventHandlers.onItemSave);
							
		// Close window.		
		window.close ();
	}	
}


// ----------------------------------------------------------------------------------------------------------
// | EVENTHANDLERS																							|
// ----------------------------------------------------------------------------------------------------------	
var eventHandlers =
{	
	// ------------------------------------------------------------------------------------------------------
	// | ONAUCTIONSAVE																						|	
	// ------------------------------------------------------------------------------------------------------		
	onAuctionSave : function (eventData)
	{
		if (main.auction.id == eventData.id)
		{
			main.auction = eventData;
			main.buyernos = didius.helpers.parseBuyerNos (main.auction.buyernos);
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
		var case_ = didius.case.load ({id: eventData.caseid});
					
		if (main.auction.id == case_.auctionid)
		{
			// Update tree.items.
			main.itemsTreeHelper.setRow ({data: eventData})
							
			// Update main.items.
			for (var index in main.items)
			{
				var item = main.items[index];		
				if (item.id == eventData.id)
				{
					main.items[index] = eventData;
					break;
				}
			}		
			
			// Update display.
			if (main.items[main.currentIndex].id == eventData.id)
			{
				sXUL.console.log ("CHANGE")
				main.setItem (main.currentIndex);	
			}				
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONITEMDESTROY																						|	
	// ------------------------------------------------------------------------------------------------------		
	onItemDestroy : function (eventData)
	{			
		main.itemsTreeHelper.removeRow ({id: eventData.id})
		
		for (var index in main.items)
		{
			var item = main.items[index];
			if (item.id == eventData.id)
			{
				break;
			}
		}
	}
}