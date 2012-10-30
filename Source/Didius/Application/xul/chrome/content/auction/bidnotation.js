Components.utils.import("resource://didius/js/app.js");

var main =
{
	current : null,
	running : false,
	items : null,
	currentCatalogNo : 1,
	buyernos: {},
	
	itemsTreeHelper: null,

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
	
		main.itemsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("items"), sortColumn: "catalogno", sortDirection: "descending"});
	
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
		for (idx in main.items)
		{									
			main.itemsTreeHelper.addRow ({data: main.items[idx]});
		}
								
		// Enable controls
		document.getElementById ("items").disabled = false;																
		//main.items.onChange ();
		
		document.title = "Auktion budnotering: "+ main.current.title +" ["+ main.current.no +"]";
		
		if (main.items.length > 0)
		{
			main.setItem (1);
		}	
		else
		{
			document.getElementById ("bidBuyerNo").disabled = true;
			document.getElementById ("bidAmount").disabled = true;		
		}	
	},
	
	get : function ()
	{
	},
	
	onChange : function ()
	{
		
		if (main.itemsTreeHelper.getCurrentIndex () != -1)
		{										
			main.setItem (parseInt (main.itemsTreeHelper.getRow ().catalogno));
		}
		else
		{				
			
		}
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
	
	onBidAmountKeyPress : function (event)
	{	 
		if (event.keyCode == 13)
		{
			document.getElementById ("bidBuyerNo").focus ();
		}
	},
	
	onBuyerNoKeyPress : function (event)
	{
		if (event.keyCode == 13)
		{
			main.getBid ();
			main.itemNext ();		
			
								
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
		}
	},
	
	setItem : function (catalogNo)
	{									
		main.currentCatalogNo = catalogNo;
	
		document.getElementById ("counter").label = "Effekt "+ catalogNo +" af "+ main.items.length;
		
		catalogNo--;
	
		document.getElementById ("itemDescription").value = main.items[catalogNo].description;
		
		document.getElementById ("itemMinimumBid").value = main.items[catalogNo].minimumbid;
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
		
		document.getElementById ("bidBuyerNo").value = "";
		document.getElementById ("bidAmount").value = "";
		
		if (!main.items[catalogNo].invoiced)
		{
			document.getElementById ("bidBuyerNo").disabled = false;
			document.getElementById ("bidAmount").disabled = false;
		}
		else
		{
			document.getElementById ("bidBuyerNo").disabled = true;
			document.getElementById ("bidAmount").disabled = true;
		}
		
		document.getElementById ("bidAmount").focus ();
	},	
							
	close : function (force)
	{							
		// Unhook events.						
		app.events.onAuctionDestroy.removeHandler (main.eventHandlers.onAuctionDestroy);
							
		// Close window.		
		window.close ();
	}	
}