Components.utils.import("resource://didius/js/app.js");

var main =
{
	checksum : null,
	current : null,

	init : function ()
	{
		try
		{
			main.current = didius.customer.load (window.arguments[0].customerId);
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}								
		
		main.set ();
		
		main.cases.init ();
		main.bids.init ();
		main.settlements.init ();
		
		// Hook events.
		app.events.onCustomerDestroy.addHandler (main.eventHandlers.onCustomerDestroy);
		
		app.events.onCaseCreate.addHandler (main.eventHandlers.onCaseCreate);
		app.events.onCaseSave.addHandler (main.eventHandlers.onCaseSave);
		app.events.onCaseDestroy.addHandler (main.eventHandlers.onCaseDestroy);
		
		app.events.onBidCreate.addHandler (main.eventHandlers.onBidCreate);
		app.events.onBidSave.addHandler (main.eventHandlers.onBidSave);
		app.events.onBidDestroy.addHandler (main.eventHandlers.onBidDestroy)
		
		app.events.onSettlementCreate.addHandler (main.eventHandlers.onSettlementCreate);
	},
	
	eventHandlers :
	{
		onCustomerDestroy : function (eventData)
		{
			if (main.current.id == eventData.id)
			{
				main.close (true);
			}
		},
	
		onCaseCreate : function (eventData)
		{
			if (main.current.id == eventData.customerid)
			{
				main.cases.casesTreeHelper.addRow ({data: eventData});
			}
		},
		
		onCaseSave : function (eventData)
		{
			if (main.current.id == eventData.customerid)
			{
				main.cases.casesTreeHelper.setRow ({data: eventData});
			}
		},
		
		onCaseDestroy : function (eventData)
		{
			main.cases.casesTreeHelper.removeRow ({id: eventData.id});
		},
		
		onBidCreate : function (eventData)
		{
			if (main.current.id == eventData.customerid)
			{
				var data = {};
			
				data.id = eventData.id;
				data.createtimestamp = eventData.createtimestamp;
				data.auctionno = eventData.item.case.auction.no;
				data.auctiontitle = eventData.item.case.auction.title;
				data.itemno = eventData.item.no;
				data.itemtitle = eventData.item.title;
				data.amount = eventData.amount;
			
				main.bids.bidsTreeHelper.addRow ({data: data});
			}
		},
		
		onBidSave : function (eventData)
		{
			if (main.current.id == eventData.customer.id)
			{
				var data = {};
			
				data.id = eventData.id;
				data.createtimestamp = eventData.createtimestamp;
				data.auctionno = eventData.item.case.auction.no;
				data.auctiontitle = eventData.item.case.auction.title;
				data.itemno = eventData.item.no;
				data.itemtitle = eventData.item.title;
				data.amount = eventData.amount;
			
				main.bids.bidsTreeHelper.addRow ({data: data});
			}
		},
		
		onBidDestroy : function (eventData)
		{
			main.bids.bidsTreeHelper.removeRow ({id: eventData.id});
		},
		
		onSettlementCreate : function (eventData)
		{
			if (main.current.id == eventData.customerid)
			{
				var data = {};
			
				data.id = eventData.id;
				data.createtimestamp = eventData.createtimestamp;
				data.no = eventData.no;
				data.caseno = eventData.case.no;
				data.auctiontitle = eventData.case.auction.title;								
				data.total = eventData.total;
			
				main.settlements.settlementsTreeHelper.addRow ({data: data});			
			}
		},
	},
			
	set : function ()
	{
		main.checksum = SNDK.tools.arrayChecksum (main.current);
	
		document.getElementById ("no").value = main.current.no;
		document.getElementById ("createdate").dateValue = SNDK.tools.timestampToDate (main.current.createtimestamp);
	
		document.getElementById ("name").value = main.current.name;
		document.getElementById ("address1").value = main.current.address1;
		document.getElementById ("address2").value = main.current.address2;
		document.getElementById ("postcode").value = main.current.postcode;
		document.getElementById ("city").value = main.current.city;
		document.getElementById ("country").value = main.current.country;
		
		document.getElementById ("att").value = main.current.att;
		document.getElementById ("phone").value = main.current.phone;
		document.getElementById ("mobile").value = main.current.mobile;
		document.getElementById ("email").value = main.current.email;		
		
		document.getElementById ("vat").checked = main.current.vat;
		document.getElementById ("vatno").value = main.current.vatno;
		
		document.getElementById ("bankname").value = main.current.bankname;
		document.getElementById ("bankregistrationno").value = main.current.bankregistrationno;
		document.getElementById ("bankaccountno").value = main.current.bankaccountno;
		
		document.getElementById ("notes").value = main.current.notes;
							
		main.onChange ();
	},
	
	get : function ()
	{
		main.current.name = document.getElementById ("name").value;
		main.current.address1 = document.getElementById ("address1").value;
		main.current.address2 = document.getElementById ("address2").value;
		main.current.postcode = document.getElementById ("postcode").value;
		main.current.city = document.getElementById ("city").value;
		main.current.country = document.getElementById ("country").value;						
		
		main.current.att = document.getElementById ("att").value;
		main.current.phone = document.getElementById ("phone").value;
		main.current.mobile = document.getElementById ("mobile").value;
		main.current.email = document.getElementById ("email").value;
		
		main.current.vat = document.getElementById ("vat").checked;
		main.current.vatno = document.getElementById ("vatno").value;
		
		main.current.bankname = document.getElementById ("bankname").value;
		main.current.bankregistrationno = document.getElementById ("bankregistrationno").value;
		main.current.bankaccountno = document.getElementById ("bankaccountno").value;				
		
		main.current.notes = document.getElementById ("notes").value;				
	},
	
	save : function ()
	{			
		main.get ();
		
		didius.customer.save (main.current);
				
		main.checksum = SNDK.tools.arrayChecksum (main.current);
		main.onChange ();
		
		if (window.arguments[0].onSave != null)
		{
			window.arguments[0].onSave (main.current);
		}
	},
	
	close : function (force)
	{			
		// If we are forced to close, then dont promt user about potential unsaved data.
		if (!force)
		{	
			// If checksums do not match, promt user about unsaved data.
			if ((SNDK.tools.arrayChecksum (main.current) != main.checksum))
			{
				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			
				if (!prompts.confirm (null, "Ændringer ikke gemt", "Der er fortaget ændringer, der ikke er gemt, vil du forstætte ?"))
				{
					return;
				}			
			}
		}
		
		// Unhook events.
		app.events.onCustomerDestroy.removeHandler (main.eventHandlers.onCustomerDestroy);		
		
		app.events.onCaseCreate.removeHandler (main.eventHandlers.onCaseCreate);
		app.events.onCaseSave.removeHandler (main.eventHandlers.onCaseSave);
		app.events.onCaseDestroy.removeHandler (main.eventHandlers.onCaseDestroy);
	
		// Close window.
		window.close ();
	},
	
	onChange : function ()
	{
		main.get ();
	
		if ((SNDK.tools.arrayChecksum (main.current) != main.checksum) && (main.current.name != ""))
		{
			document.title = "Kunde: "+ main.current.name +" ["+ main.current.no +"] *";
		
			document.getElementById ("save").disabled = false;
			document.getElementById ("close").disabled = false;
		}
		else
		{
			document.title = "Kunde: "+ main.current.name +" ["+ main.current.no +"]";
		
			document.getElementById ("save").disabled = true;
			document.getElementById ("close").disabled = false;
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
				document.getElementById ("caseEdit").disabled = true;
				document.getElementById ("caseDestroy").disabled = true;
						
				didius.case.list ({customer: main.current, async: true, onDone: onDone});				
		},
		
		sort : function (attributes)
		{
			main.cases.casesTreeHelper.sort (attributes);
		},
					
		onChange : function ()
		{
			if (main.cases.casesTreeHelper.getCurrentIndex () != -1)
			{					
				document.getElementById ("caseEdit").disabled = false;
				document.getElementById ("caseDestroy").disabled = false;				
			}
			else
			{												
				document.getElementById ("caseEdit").disabled = true;
				document.getElementById ("caseDestroy").disabled = true;				
			}						
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
	},
	
	bids :
	{
		bidsTreeHelper : null,
	
		init : function ()
		{
			main.bids.bidsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("bids"),  sortColumn: "createtimestamp", sortDirection: "ascending", onDoubleClick: main.bids.edit});			
			main.bids.set ();
		},
							
		set : function ()
		{
			var onDone = 	function (items)
							{														
								for (idx in items)
								{				
									var data = {};
									data.id = items[idx].id;
									data.createtimestamp = items[idx].createtimestamp;
									data.auctionno = items[idx].item.case.auction.no;
									data.auctiontitle = items[idx].item.case.auction.title;
									data.itemno = items[idx].item.no;
									data.itemtitle = items[idx].item.title;
									data.amount = items[idx].amount;
									
									main.bids.bidsTreeHelper.addRow ({data: data});
								}
								
								// Enable controls
								document.getElementById ("bids").disabled = false;																
								main.cases.onChange ();
							};

				// Disable controls
				document.getElementById ("bids").disabled = true;					
				document.getElementById ("bidShow").disabled = true;				
						
				didius.bid.list ({customer: main.current, async: true, onDone: onDone});
		},
		
		sort : function (attributes)
		{
			main.cases.casesTreeHelper.sort (attributes);
		},
					
		onChange : function ()
		{
			if (main.cases.casesTreeHelper.getCurrentIndex () != -1)
			{					
				document.getElementById ("caseEdit").disabled = false;
				document.getElementById ("caseDestroy").disabled = false;				
			}
			else
			{												
				document.getElementById ("caseEdit").disabled = true;
				document.getElementById ("caseDestroy").disabled = true;				
			}						
		},
																													
		show : function ()
		{		
			var current = main.cases.casesTreeHelper.getRow ();
															
			window.openDialog ("chrome://didius/content/caseedit/caseedit.xul", current.id, "chrome", {caseId: current.id});
		}
	},
	
	settlements :
	{
		settlementsTreeHelper : null,
		
		init : function ()
		{
			main.settlements.settlementsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("settlements"),  sortColumn: "createtimestamp", sortDirection: "ascending", onDoubleClick: main.settlements.show});			
			main.settlements.set ();
		},
							
		set : function ()
		{
			var onDone = 	function (items)
							{														
								for (idx in items)
								{				
									var data = {};
									data.id = items[idx].id;
									data.createtimestamp = items[idx].createtimestamp;
									data.no = items[idx].no;
									data.caseno = items[idx].case.no;
									data.auctiontitle = items[idx].case.auction.title;
									data.total = items[idx].total;																	
									
									main.settlements.settlementsTreeHelper.addRow ({data: data});
								}
								
								// Enable controls
								document.getElementById ("settlements").disabled = false;																
								main.settlements.onChange ();
							};

				// Disable controls
				document.getElementById ("settlements").disabled = true;					
//				document.getElementById ("bidShow").disabled = true;				
						
				didius.settlement.list ({customer: main.current, async: true, onDone: onDone});
		},
		
		sort : function (attributes)
		{
			main.cases.casesTreeHelper.sort (attributes);
		},
					
		onChange : function ()
		{
			if (main.settlements.settlementsTreeHelper.getCurrentIndex () != -1)
			{					
				document.getElementById ("settlementShow").disabled = false;				
			}
			else
			{												
				document.getElementById ("settlementShow").disabled = true;				
			}						
		},
																													
		show : function ()
		{		
			var current = main.settlements.settlementsTreeHelper.getRow ();				
			
			sXUL.console.log (current.id)										
			window.openDialog ("chrome://didius/content/case/settlement/show.xul", current.id, "chrome", {settlementId: current.id});
		}
	}
}