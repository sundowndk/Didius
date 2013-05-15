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
	
		var onDone = 	function (result)
						{	
							main.items = result;
							main.set ();
						};
	
		main.items = didius.item.list ({auction: main.auction, async: true, onDone: onDone});	
				
		// Hook events.					
		app.events.onAuctionSave.addHandler (eventHandlers.onAuctionSave);
		app.events.onAuctionDestroy.addHandler (eventHandlers.onAuctionDestroy);				
	},
			
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------		
	set : function ()
	{	
		main.checksum = SNDK.tools.arrayChecksum (main.auction);
	
		switch (main.auction.status)
		{
			case "Hidden":
			{
				document.getElementById ("button.auctionstart").collapsed = false;
				document.getElementById ("button.auctionstart").disabled = false;				
				document.getElementById ("button.auctionstop").collapsed = true;
				document.getElementById ("button.auctionstop").disabled = true;				
												
				document.getElementById ("textbox.itemdescription").value = "";
				document.getElementById ("image.itempicture").src = "chrome://didius/content/icons/noimage.jpg";
				document.getElementById ("textbox.itemminimumbid").value = "";
				document.getElementById ("textbox.itemappraisal1").value = "";
				document.getElementById ("textbox.itemappraisal2").value = "";
				document.getElementById ("textbox.itemappraisal3").value = "";
				
				document.getElementById ("button.itemnext").disabled = true;
				document.getElementById ("button.itemprev").disabled = true;
				
				break;
			}
		
			case "Open":
			{
				document.getElementById ("button.auctionstart").collapsed = false;
				document.getElementById ("button.auctionstart").disabled = false;				
				document.getElementById ("button.auctionstop").collapsed = true;
				document.getElementById ("button.auctionstop").disabled = true;				
												
				document.getElementById ("textbox.itemdescription").value = "";
				document.getElementById ("image.itempicture").src = "chrome://didius/content/icons/noimage.jpg";
				document.getElementById ("textbox.itemminimumbid").value = "";
				document.getElementById ("textbox.itemappraisal1").value = "";
				document.getElementById ("textbox.itemappraisal2").value = "";
				document.getElementById ("textbox.itemappraisal3").value = "";
				
				document.getElementById ("button.itemnext").disabled = true;
				document.getElementById ("button.itemprev").disabled = true;
								
				break;
			}
			
			case "Closed":
			{
				document.getElementById ("button.auctionstart").collapsed = true;
				document.getElementById ("button.auctionstart").disabled = true;				
				document.getElementById ("button.auctionstop").collapsed = true;
				document.getElementById ("button.auctionstop").disabled = true;	
				break;
			}
			
			case "Running":
			{
				document.getElementById ("button.auctionstart").collapsed = true;
				document.getElementById ("button.auctionstart").disabled = true;				
				document.getElementById ("button.auctionstop").collapsed = false;
				document.getElementById ("button.auctionstop").disabled = false;								
				break;
			}
		}
		
		if (main.items.length > 1)
		{
			document.getElementById ("caption.counter").label = "Effekt 1 af "+ (main.items.length);
		}
		else
		{
			document.getElementById ("caption.counter").label = "Effekt 0 af 0";
		}
		
		document.title = "Auktion afvikling: "+ main.auction.title +" ["+ main.auction.no +"]";
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------
	onChange : function ()
	{
		if (main.currentIndex > 0)
		{
			document.getElementById ("button.itemprev").disabled = false;
		}
		else
		{
			document.getElementById ("button.itemprev").disabled = true;
		}
		
		if (main.currentIndex < (main.items.length - 1))
		{
			document.getElementById ("button.itemnext").disabled = false;
		}
		else
		{
			document.getElementById ("button.itemnext").disabled = true;
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | CLOSE																								|	
	// ------------------------------------------------------------------------------------------------------				
	close : function ()
	{							
		if ((main.auction.status == "Running"))
		{
			if (!app.window.prompt.confirm ("Auktionen er i gang", "Er du sikker på du vil stoppe den igangværende auktion ?"))
			{
				return false;
			}	
			
			main.auctionStop ();
		}
		
		// Unhook events.						
		app.events.onAuctionDestroy.removeHandler (eventHandlers.onAuctionDestroy);
							
		// Close window.		
		window.close ();
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | AUCTIONSTART																						|	
	// ------------------------------------------------------------------------------------------------------
	auctionStart : function ()
	{
		main.auction.status = "Running";
		didius.auction.save (main.auction);
		
		main.set ();												
		main.itemSet (main.currentIndex);	
		
		var eventData = {};
		eventData.auctionid = main.auction.id;
		eventData.action = "auctionstart";
		eventData.actiondata = main.items[0].id;
	
		app.events.onAuctionControl.execute (eventData);
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | AUCTIONSTOP																						|	
	// ------------------------------------------------------------------------------------------------------		
	auctionStop : function ()
	{
		main.auction.status = "Open";
		didius.auction.save (main.auction);
						
		main.set ();
		
		var eventData = {};
		eventData.auctionid = main.auction.id;
		eventData.action = "auctionstop";	
		
		app.events.onAuctionControl.execute (eventData);	
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ITEMSET																							|	
	// ------------------------------------------------------------------------------------------------------						
	itemSet : function (index)
	{									
		main.currentIndex = index;
	
		document.getElementById ("caption.counter").label = "Effekt "+ (main.currentIndex + 1) +" af "+ main.items.length;
					
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
			var customer = didius.customer.load (bid.customerid);
		
			document.getElementById ("textbox.currentbidcustomername").value = customer.name;
			document.getElementById ("textbox.currentbidamount").value = bid.amount;
		}
		else
		{
			document.getElementById ("textbox.currentbidcustomername").value = "";
			document.getElementById ("textbox.currentbidamount").value = "";
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
									
		main.onChange ();
	},				

	// ------------------------------------------------------------------------------------------------------
	// | ITEMPREV																							|	
	// ------------------------------------------------------------------------------------------------------
	itemPrev : function ()
	{
		if (main.auction.status == "Running")
		{
			if (main.currentIndex > 0)
			{					
				main.itemSet ((main.currentIndex - 1));
			
				var eventData = {};
				eventData.auctionid = main.auction.id;
				eventData.action = "itemprev";
				eventData.actiondata = main.items[main.currentIndex].id;
	
				app.events.onAuctionControl.execute (eventData);
			}
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ITEMNEXT																							|	
	// ------------------------------------------------------------------------------------------------------		
	itemNext : function ()
	{
		if (main.auction.status == "Running")
		{
			if (main.currentIndex < (main.items.length - 1))
			{						
				main.itemSet ((main.currentIndex + 1));
								
				var eventData = {};
				eventData.auctionid = main.auction.id;
				eventData.action = "itemnext";
				eventData.actiondata = main.items[main.currentIndex].id;
	 
				app.events.onAuctionControl.execute (eventData);
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
	// | ONAUCTIONSAVE																					|	
	// ------------------------------------------------------------------------------------------------------
	onAuctionSave : function (eventData)
	{
		if (main.auction.id == eventData.id)
		{		
			main.auction.buyernos = eventData.buyernos;
		}
	},
								
	onAuctionDestroy : function (eventData)
	{
		if (main.auction.id == eventData.id)
		{
			main.close (true);
		}
	}
}