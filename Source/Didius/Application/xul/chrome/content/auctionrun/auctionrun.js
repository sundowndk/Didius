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
				document.getElementById ("auctionControl").disabled = true;
				document.getElementById ("auctionBid").disabled = true;
				document.getElementById ("auctionStart").collapsed = false;
				document.getElementById ("auctionStart").disabled = false;				
				document.getElementById ("auctionStop").collapsed = true;
				document.getElementById ("auctionStop").disabled = true;				
				break;
			}
			
			case "Closed":
			{
				document.getElementById ("auctionControl").disabled = true;
				document.getElementById ("auctionBid").disabled = true;
				document.getElementById ("auctionStart").collapsed = true;
				document.getElementById ("auctionStart").disabled = true;				
				document.getElementById ("auctionStop").collapsed = true;
				document.getElementById ("auctionStop").disabled = true;	
				break;
			}
			
			case "Running":
			{
				document.getElementById ("auctionControl").disabled = false;
				document.getElementById ("auctionBid").disabled = false;				
				document.getElementById ("auctionStart").collapsed = true;
				document.getElementById ("auctionStart").disabled = true;				
				document.getElementById ("auctionStop").collapsed = false;
				document.getElementById ("auctionStop").disabled = false;				
				break;
			}
		}
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
		
//		main.items = didius.item.list ({auction: main.current, async: false});
				
//		document.getElementById ("runCounter").label = "Effekt 1 af "+ main.items.length;																		
//		main.setItem (1);	
	},
	
	stop : function ()
	{
		main.current.status = "Open";
		didius.auction.save (main.current);
		
		main.set ();
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
	
		document.getElementById ("runCounter").label = "Effekt "+ catalogNo +" af "+ main.items.length;
		
		catalogNo--;
	
		document.getElementById ("runItemDescription").value = main.items[catalogNo].description;
		
		document.getElementById ("runItemMinimumBid").value = main.items[catalogNo].minimumbid;
		document.getElementById ("runItemAppraisal1").value = main.items[catalogNo].appraisal1;
		document.getElementById ("runItemAppraisal2").value = main.items[catalogNo].appraisal2;
		document.getElementById ("runItemAppraisal3").value = main.items[catalogNo].appraisal3;
			
		if (main.items[catalogNo].pictureid != SNDK.tools.emptyGuid)
		{
			document.getElementById ("runItemPicture").src = "http://sorentotest.sundown.dk/getmedia/" + main.items[catalogNo].pictureid;
		}
		else
		{
			document.getElementById ("runItemPicture").src = "chrome://didius/content/icons/noimage.jpg";
		}
		
		if (main.items[catalogNo].currentbidid != SNDK.tools.emptyGuid)
		{
			var bid = didius.bid.load (main.items[catalogNo].currentbidid);
		
			document.getElementById ("runItemCurrentBidCustomer").value = bid.customer.name;
			document.getElementById ("runItemCurrentBidAmount").value = bid.amount;
		}
		else
		{
			document.getElementById ("runItemCurrentBidCustomer").value = "";
			document.getElementById ("runItemCurrentBidAmount").value = "";
		}
						
		main.onChange ();
	},
	
	save : function ()
	{			
		main.get ();
		
		didius.auction.save (main.current);
				
		main.checksum = SNDK.tools.arrayChecksum (main.current);
		main.onChange ();
		
		if (window.arguments[0].onSave != null)
		{
			window.arguments[0].onSave (main.current);
		}
	},
	
	close : function (force)
	{							
		// Unhook events.						
		app.events.onAuctionDestroy.removeHandler (main.eventHandlers.onAuctionDestroy);
							
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
			
		
	
	
//		main.get ();
	
//		if ((SNDK.tools.arrayChecksum (main.current) != main.checksum))
//		{
//			document.title = "Auktion: "+ main.current.title +" ["+ main.current.no +"] *";
//		
//			document.getElementById ("save").disabled = false;
//			document.getElementById ("close").disabled = false;
//		}
//		else
//		{
//			document.title = "Auktion: "+ main.current.title +" ["+ main.current.no +"]";
//		
//			document.getElementById ("save").disabled = true;
//			document.getElementById ("close").disabled = false;
//		}
	},
	
	items :
	{
		itemsTreeHelper : null,
		
		init : function ()
		{
			main.items.itemsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("items"), sortColumn: "catalogno", sortDirection: "descending", onDoubleClick: main.items.edit});
			main.items.set ();		
		},
		
		set : function ()
		{
			var onDone = 	function (items)
							{
								for (idx in items)
								{									
									main.items.itemsTreeHelper.addRow ({data: items[idx]});
								}
								
								// Enable controls
								document.getElementById ("items").disabled = false;																
								main.items.onChange ();
							};

			// Disable controls
			document.getElementById ("items").disabled = true;								
			document.getElementById ("itemEdit").disabled = true;
			document.getElementById ("itemDestroy").disabled = true;
						
			didius.item.list ({auction: main.current, async: true, onDone: onDone});				
		},
		
		onChange : function ()
		{
			if (main.items.itemsTreeHelper.getCurrentIndex () != -1)
			{										
				document.getElementById ("itemEdit").disabled = false;
				document.getElementById ("itemDestroy").disabled = false;
			}
			else
			{				
				document.getElementById ("itemEdit").disabled = true;
				document.getElementById ("itemDestroy").disabled = true;
			}
		},
		
		sort : function (attributes)
		{
			main.items.itemsTreeHelper.sort (attributes);
		},
							
		edit : function ()
		{		
			var current = main.items.itemsTreeHelper.getRow ();
						
			var onSave = function (result)
			{				
				if (result != null)
				{
					main.items.itemsTreeHelper.setRow ({data :result});					
				}													
			}
							
			window.openDialog ("chrome://didius/content/itemedit/itemedit.xul", current.id, "chrome", {itemId: current.id, onSave: onSave});
		},
		
		destroy : function ()
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			var result = prompts.confirm (null, "Slet effekt", "Er du sikker på du vil slette denne effekt ?");
			
			if (result)
			{
				try
				{
					didius.item.destroy (main.items.itemsTreeHelper.getRow ().id);					
				}
				catch (error)
				{
					app.error ({exception: error})
				}								
			}
		}
	},
	
	catalog : 
	{
		print : function ()
		{
			window.openDialog ("chrome://didius/content/auction/catalog/print.xul", "printcatalog", "chrome, modal", {auctionId: main.current.id});	
		}
	},
	
	cases :
	{
		casesTreeHelper : null,
	
		init : function ()
		{
			main.cases.casesTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("cases"), sortColumn: "no", sortDirection: "descending", onDoubleClick: main.cases.edit});
			main.cases.set ();	
		},
		
		set : function ()
		{
			var onDone = 	function (items)
							{
								for (idx in items)
								{												
									main.cases.casesTreeHelper.addRow ({data: items[idx]});
								}
								
								// Enable controls
								document.getElementById ("cases").disabled = false;																
								main.cases.onChange ();
							};

			// Disable controls
			document.getElementById ("cases").disabled = true;					
			document.getElementById ("caseCreate").disabled = true;
			document.getElementById ("caseEdit").disabled = true;
			document.getElementById ("caseDestroy").disabled = true;
					
			didius.case.list ({auction: main.current, async: true, onDone: onDone});			
		},
		
		onChange : function ()
		{					
			if (main.cases.casesTreeHelper.getCurrentIndex () != -1)
			{										
				document.getElementById ("caseCreate").disabled = false;
				document.getElementById ("caseEdit").disabled = false;
				document.getElementById ("caseDestroy").disabled = false;
			}
			else
			{									
				document.getElementById ("caseCreate").disabled = false;
				document.getElementById ("caseEdit").disabled = true;
				document.getElementById ("caseDestroy").disabled = true;
			}		
		},
		
		sort : function (attributes)
		{
			main.cases.casesTreeHelper.sort (attributes);
		},
		
		create : function ()
		{
			var onDone =	function (result)
							{
								if (result)
								{
									var case_ = didius.case.create (main.current, result);
									didius.case.save (case_);
																									
									window.openDialog ("chrome://didius/content/caseedit/caseedit.xul", case_.id, "chrome", {caseId: case_.id});
								}
							};
														
			app.choose.customer ({onDone: onDone});
		},
									
		edit : function ()
		{		
			var current = main.cases.casesTreeHelper.getRow ();
															
			window.openDialog ("chrome://didius/content/caseedit/caseedit.xul", current.id, "chrome", {caseId: current.id});
		},
		
		destroy : function ()
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			var result = prompts.confirm (null, "Slet sag", "Er du sikker på du vil slette denne sag ?");
			
			if (result)
			{
				try
				{
					didius.case.destroy (main.cases.casesTreeHelper.getRow ().id);										
				}
				catch (error)
				{					
					app.error ({exception: error})
				}								
			}
		}
	}			
}