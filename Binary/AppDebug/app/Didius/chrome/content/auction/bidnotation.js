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
		var buyerno = document.getElementById ("textbox.bidbuyerno").value;
		var amount = parseInt (document.getElementById ("textbox.bidamount").value);
		var currentbidamount = parseInt (document.getElementById ("textbox.currentbidamount").value); 
		var maxautobidamount = parseInt (document.getElementById ("textbox.currentmaxautobidamount").value); 		
		var item = main.items[(main.currentIndex)];
		var bid;
		var customerid;
														
		if (buyerno != "0")
		{
			var foundbuyer = false;
			for (var index in main.buyernos)
			{							
				if (index == buyerno)
				{	
					customerid = main.buyernos[index];	
					foundbuyer = true;
					break;				
				}
			}
		
			// BUYER NOT FOUND.
			if (!foundbuyer)
			{
				sXUL.console.log ("GETBID: 1");
				app.window.prompt.alert ("Bud", "Der findes ingen kunde med det angivende køber nummer i denne auktion.");
				return false;
			}
		}		
				
		// NO AMOUNT, NO BUYER, NO PREBIDDER, NOT SOLD.
		if (amount == 0 && buyerno == "0" && currentbidamount == 0)
		{
			sXUL.console.log ("GETBID: 2");
			
			//app.window.prompt.alert ("Bud", "Der er ikke noget forhåndsbud på denne effekt. Det er derfor ikke muligt at opbyde forhåndsbudet.");
			return true;
		}
				
		// NO AMOUNT, NO BUYER, PREBIDDER, SOLD TO PREBIDDER.
		else if (amount == 0 && buyerno == "0" && currentbidamount != 0)
		{
			sXUL.console.log ("GETBID: 3");
					
			item.approvedforinvoice = true;
		}
		
		// NO AMOUNT, BUYER, NOPREBIDDER, SOLD FOR NOTHING TO BUYER.
		else if (amount == 0 && buyerno != "0" && currentbidamount == 0)
		{
			sXUL.console.log ("GETBID: 4");
										
			item.approvedforinvoice = true;
			bid = didius.bid.create ({customerId: customerid, item: item, amount: 0});
		}
		
		// NO AMOUNT, BUYER, PREBIDDER, NOT SOLD.
		else if (amount == 0 && buyerno != "0" && currentbidamount != 0)
		{						
			sXUL.console.log ("GETBID: 5");
			
			app.window.prompt.alert ("Bud", "Bud er mindre end nuværende forhåndsbud. Det er derfor ikke muligt at afgive budet.");
			return false;		
		}		

		// NO AMOUNT, NO BUYER, NO PREBIDDER, NOT SOLD.
		else if (amount != 0 && buyerno == "0" && currentbidamount == 0)
		{								
			sXUL.console.log ("GETBID: 6");
		
			app.window.prompt.alert ("Bud", "Der er intet forhåndsbud på denne effekt og der ikke angivet et køber nummer. Det er derfor ikke muligt at afgive budet.");					
			return false;
		}
		
		// AMOUNT, NO BUYER, PREBIDDER, PREBIDMAX HIGHER/EQUAL TO AMOUNT, USER CHOICE, NOT SOLD / SOLD TO PREBIDDER.
		else if (amount != 0 && buyerno == "0" && currentbidamount != 0 && maxautobidamount >= amount)
		{			
			if (!app.window.prompt.confirm ("Bud", "Nuværende forhåndsbud vil blive budt op. Vil du forsætte ?"))
			{	
				sXUL.console.log ("GETBID: 7a");
				return false;
			}
			else
			{	
				sXUL.console.log ("GETBID: 7b");
				
				item.approvedforinvoice = true;				
				var autobids = didius.autobid.list ({itemId: item.id});				
				bid = didius.bid.create ({customerId: autobids[0].customerid, item: item, amount: amount});
			}
		}
		
		// AMOUNT, NO BUYER, PREBIDDER, PREBIDMAX LOWER THAN AMOUNT, NOT SOLD.
		else if (amount != 0 && buyerno == "0" && currentbidamount != 0 && maxautobidamount != 0 && maxautobidamount < amount)
		{			
			sXUL.console.log ("GETBID: 8");
			
			app.window.prompt.alert ("Bud", "Det angivet bud er højere end max forhåndsbud. Det er derfor ikke muligt at opbyde forhåndsbudet.");
			return false;
		}
		
		// AMOUNT, NO BUYER, PREBIDDER, NO PREBIDMAX, NOT SOLD.
		else if (amount != 0 && buyerno == "0" && currentbidamount != 0 && maxautobidamount == 0)
		{			
			sXUL.console.log ("GETBID: 9");
			
			app.window.prompt.alert ("Bud", "Effekten har ikke noget max forhåndsbud. Det er derfor ikke muligt at opbyde forhåndsbudet.");
			return false;
		}
		
		// AMOUNT, BUYER, PREBID HIGHER THAN AMOUNT, NOT SOLD.
		else if (amount != 0 && buyerno != "0" && currentbidamount > amount)
		{
			sXUL.console.log ("GETBID: 10");
			
			app.window.prompt.alert ("Bud", "Budet er lavere end nuværende forhåndsbud. Det er derfor ikke muligt at afgive budet.");
			return false;
		}
		
		// AMOUNT, BUYER, PREBIDMAX HIGHER TO AMOUNT, NOT SOLD.
		else if (amount != 0 && buyerno != "0" && maxautobidamount > amount)
		{
			sXUL.console.log ("GETBID: 11");
			
			app.window.prompt.alert ("Bud", "Budet er ikke højre end nuværende max forhåndsbud. Det er derfor ikke muligt at afgive budet.");
			return false;
		}
		
		// AMOUNT, BUYER, PREBIDMAX EQUAL TO AMOUNT, SOLD TO BUYER.
//		else if (amount != 0 && buyerno != "0" && maxautobidamount == amount)
//		{
//			sXUL.console.log ("GETBID: 12");
//			
//			item.approvedforinvoice = true;
//			bid = didius.bid.create ({customerId: customerid, item: item, amount: 0});
//			
//			//app.window.prompt.alert ("Bud", "Budet er ikke højre end nuværende max forhåndsbud. Det er derfor ikke muligt at afgive budet.");
//			//return false;
//		}
		
		// AMOUNT, BUYER, SOLD TO BUYER.
		else if (amount != 0 && buyerno != "0")
		{
			sXUL.console.log ("GETBID: 12");
			
			item.approvedforinvoice = true;
			bid = didius.bid.create ({customerId: customerid, item: item, amount: amount});
		}
		
		// AMOUNT, BUYER, MINIMUMBUD HIGHER THAN AMOUNT, USER CHOICE, NOT SOLD / REMOVE MINIMUMBID SOLD TO BUYER.
		if (item.minimumbid > amount)
		{
			sXUL.console.log ("GETBID: 13");
		
			if (!app.window.prompt.confirm ("Bud", "Budet er mindre end effektens minimumsbud, vil du fjerne minimumbud og tillade budet ?"))
			{
				sXUL.console.log ("GETBID: 13a");
				return false;
			}
			else
			{
				sXUL.console.log ("GETBID: 13b");
				
				item.minimumbid = 0;				
			}
		}		
			
		if (bid != null)
		{
			didius.bid.save ({bid: bid});
		}
		
		didius.item.save ({item: item});			
		
		return true;			
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
		app.events.onAuctionSave.removeHandler (eventHandlers.onAuctionSave);
		app.events.onAuctionDestroy.removeHandler (eventHandlers.onAuctionDestroy);
		app.events.onItemSave.removeHandler (eventHandlers.onItemSave);
		app.events.onItemDestroy.removeHandler (eventHandlers.onItemDestroy);
																										
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
		//var case_ = didius.case.load ({id: eventData.caseid});
					
		//if (main.auction.id == case_.auctionid)
		if (main.auction.id == eventData.auctionid)
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
				main.setItem (main.currentIndex);	
			}				
		}

		if (main.auction.id == eventData.auctionid)
		{				
			var data = {};
			data.id = eventData.id;
			data.catalogno = eventData.catalogno;
			data.no = eventData.no;
			data.title = eventData.title;
											
			if (eventData.vat)
			{
				data.vat = "ja";
			}
			else
			{
				data.vat = "nej";								
			}
			
			if (eventData.invoiced)
			{
				data.invoiced = "ja";								
			}
			else
			{
				data.invoiced = "nej";								
			}								
																		
			if (eventData.approvedforinvoice)
			{
				data.approvedforinvoice = "ja";								
			}
			else
			{
				data.approvedforinvoice = "nej";								
			}
																						
//			var customer = didius.customer.load (case_.customerid);								
//			data.customername = customer.name;																								
							
			main.itemsTreeHelper.setRow ({data: data});	
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