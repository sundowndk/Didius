Components.utils.import("resource://didius/js/app.js");

var main =
{
	checksum : null,
	current : null,
	running : false,
	items : null,
	currentCatalogNo : 1,
	buyernos: {},

	init : function ()
	{
		try
		{
			main.current = didius.auction.load (window.arguments[0].auctionId);
			main.items = didius.item.list ({auction: main.current, async: false});
			
			var buyernos = main.current.buyernos.split ("|");
			for (idx in buyernos)
			{
				try
				{
					var buyerno = buyernos[idx].split (":")[0];
					var customerid = buyernos[idx].split (":")[1];
			
					main.buyernos[buyerno] = customerid;
				}
				catch (exception)
				{		
					sXUL.console.log (exception)		
				}
			}
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}								
	
		main.set ();
		
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
		main.checksum = SNDK.tools.arrayChecksum (main.current);
	
		document.getElementById ("no").value = main.current.no;
		document.getElementById ("createdate").dateValue = SNDK.tools.timestampToDate (main.current.createtimestamp);
	
		document.getElementById ("title").value = main.current.title;		
		
		switch (main.current.status)
		{
			case "Open":
			{
				document.getElementById ("auctionStart").collapsed = false;
				document.getElementById ("auctionStart").disabled = false;				
				document.getElementById ("auctionStop").collapsed = true;
				document.getElementById ("auctionStop").disabled = true;				
				
				document.getElementById ("counter").label = "Effekt 0 af 0";
				
				document.getElementById ("itemDescription").value = "";
				document.getElementById ("itemPicture").src = "chrome://didius/content/icons/noimage.jpg";
				document.getElementById ("itemMinimumBid").value = "";
				document.getElementById ("itemAppraisal1").value = "";
				document.getElementById ("itemAppraisal2").value = "";
				document.getElementById ("itemAppraisal3").value = "";
				
				document.getElementById ("itemNext").disabled = true;
				document.getElementById ("itemPrev").disabled = true;
								
				break;
			}
			
			case "Closed":
			{
				document.getElementById ("auctionStart").collapsed = true;
				document.getElementById ("auctionStart").disabled = true;				
				document.getElementById ("auctionStop").collapsed = true;
				document.getElementById ("auctionStop").disabled = true;	
				break;
			}
			
			case "Running":
			{
				document.getElementById ("auctionStart").collapsed = true;
				document.getElementById ("auctionStart").disabled = true;				
				document.getElementById ("auctionStop").collapsed = false;
				document.getElementById ("auctionStop").disabled = false;								
				break;
			}
		}
		
		document.title = "Auktion afvikling: "+ main.current.title +" ["+ main.current.no +"]";
	},
	
	get : function ()
	{
		main.current.title = document.getElementById ("title").value;		
		main.current.auctiondate = SNDK.tools.dateToYMD (document.getElementById ("auctiondate").dateValue);
		main.current.description = document.getElementById ("description").value;				
		
		main.current.notes = document.getElementById ("notes").value;				
	},
	
	start : function ()
	{
		main.current.status = "Running";
		didius.auction.save (main.current);
		
		main.set ();
											
		document.getElementById ("counter").label = "Effekt 1 af "+ main.items.length;
		main.setItem (1);	
		
		var eventData = {};
		eventData.auctionid = main.current.id;
		eventData.action = "auctionstart";
		eventData.actiondata = main.items[0].id;
	
		app.events.onAuctionControl.execute (eventData);
	},
		
	stop : function ()
	{
		main.current.status = "Open";
		didius.auction.save (main.current);
						
		main.set ();
		
		var eventData = {};
		eventData.auctionid = main.current.id;
		eventData.action = "auctionstop";	
		
		app.events.onAuctionControl.execute (eventData);	
	},
	
	display : function ()
	{				
	//	app.window.open (window, "chrome://didius/content/auctionrun/display.xul", "display-"+ main.current.id, "chrome, resizable, dialog=no", {auctionId: main.current.id, itemId: main.items[main.currentCatalogNo - 1].id});
	
		//window.openDialog ("chrome://didius/content/auctionrun/display.xul", "display-"+ main.current.id, "chrome, resizable, dialog=no", {auctionId: main.current.id});
	},

	getBid : function ()
	{
		if (document.getElementById ("bidBuyerNo").value != 0 && document.getElementById ("bidAmount").value != 0.00)
		{
			var buyerno = document.getElementById ("bidBuyerNo").value;
			var amount = document.getElementById ("bidAmount").value;
		
			for (idx in main.buyernos)
			{							
				if (idx == buyerno)
				{
					var customer = didius.customer.load (main.buyernos[idx]);
					var item = main.items[(main.currentCatalogNo - 1)];
				
					var bid = didius.bid.create (customer, item, amount);
					didius.bid.save (bid);			
					
					main.items[(main.currentCatalogNo - 1)] = didius.item.load (item.id);
					return;		
				}
			}
			
			app.error ({errorCode: "APP00280"});
		}
	},

	itemPrev : function ()
	{
		if (main.currentCatalogNo > 1)
		{					
			main.getBid ();
		
			document.getElementById ("itemPrev").disabled = true;
			document.getElementById ("itemNext").disabled = true;
			main.setItem ((main.currentCatalogNo - 1));
			
			var eventData = {};
			eventData.auctionid = main.current.id;
			eventData.action = "itemprev";
			eventData.actiondata = main.items[main.currentCatalogNo - 1].id;
	
			app.events.onAuctionControl.execute (eventData);
		}
	},
			
	itemNext : function ()
	{
		if (main.currentCatalogNo < main.items.length)
		{
			main.getBid ();
		
			document.getElementById ("itemPrev").disabled = true;
			document.getElementById ("itemNext").disabled = true;
			main.setItem ((main.currentCatalogNo + 1));
							
			var eventData = {};
			eventData.auctionid = main.current.id;
			eventData.action = "itemnext";
			eventData.actiondata = main.items[main.currentCatalogNo - 1].id;
	 
			app.events.onAuctionControl.execute (eventData);
		}
	},
				
	setItem : function (catalogNo)
	{									
		main.currentCatalogNo = catalogNo;
	
		document.getElementById ("counter").label = "Effekt "+ catalogNo +" af "+ main.items.length;
		
		catalogNo--;
	
		document.getElementById ("itemDescription").value = main.items[catalogNo].description;
		
		document.getElementById ("itemMinimumBid").value = main.items[catalogNo].minimumbid;
		
//		if (main.items[catalogNo].minimumbid > 0)
//		{
			//document.getElementById ("itemMinimumBid").className = "TextboxRed";
//		}
		
		document.getElementById ("itemAppraisal1").value = main.items[catalogNo].appraisal1;
		document.getElementById ("itemAppraisal2").value = main.items[catalogNo].appraisal2;
		document.getElementById ("itemAppraisal3").value = main.items[catalogNo].appraisal3;
			
		if (main.items[catalogNo].pictureid != SNDK.tools.emptyGuid)
		{
			document.getElementById ("itemPicture").src = didius.runtime.ajaxUrl +"getmedia/" + main.items[catalogNo].pictureid;
		}
		else
		{
			document.getElementById ("itemPicture").src = "chrome://didius/content/icons/noimage.jpg";
		}
		
		if (main.items[catalogNo].currentbidid != SNDK.tools.emptyGuid)
		{
			var bid = didius.bid.load (main.items[catalogNo].currentbidid);
		
			document.getElementById ("itemCurrentBidCustomer").value = bid.customer.name;
			document.getElementById ("itemCurrentBidAmount").value = bid.amount;
		}
		else
		{
			document.getElementById ("itemCurrentBidCustomer").value = "";
			document.getElementById ("itemCurrentBidAmount").value = "";
		}
						
		main.onChange ();
	},
			
	close : function (force)
	{							
		if ((main.current.status == "Running"))
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			var result = prompts.confirm (null, "Auktionen er i gang", "Er du sikker på du vil stoppe den igangværende auktion ?");
			
			sXUL.console.log (result)
			
			if (!result)
			{
				return false;
			}	
		}
		
		// Unhook events.						
		app.events.onAuctionDestroy.removeHandler (main.eventHandlers.onAuctionDestroy);
							
		main.stop ();
							
		// Close window.		
		window.close ();
	},
	
	onChange : function ()
	{
		if (main.currentCatalogNo > 1)
		{
			document.getElementById ("itemPrev").disabled = false;
		}
		else
		{
			document.getElementById ("itemPrev").disabled = true;
		}
		
		if (main.currentCatalogNo < main.items.length)
		{
			document.getElementById ("itemNext").disabled = false;
		}
		else
		{
			document.getElementById ("itemNext").disabled = true;
		}
	}	
}