Components.utils.import("resource://didius/js/app.js");

// ----------------------------------------------------------------------------------------------------------
// | MAIN																									|
// ----------------------------------------------------------------------------------------------------------
var main =
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	mode : "",
	customer : null,
	checksum : null,

	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{		
		if (window.arguments[0].customerId == null)
		{						
			main.customer = didius.customer.create ();
			main.mode = "NEW";									
		}
		else if (window.arguments[0].customerId != null)
		{
			try
			{				
				main.customer = didius.customer.load (window.arguments[0].customerId);
			}
			catch (error)
			{
				app.error ({exception: error})
				main.close ();
				return;
			}			
									
			main.mode = "EDIT";
		}
		
		// Init tabs
		details.init ();
		cases.init ();
		bids.init ();
		settlements.init ();
		invoices.init ();	
		creditnotes.init ();	
		notes.init ();
		
		main.set ();									
		
		// Hook events.
		app.events.onCustomerDestroy.addHandler (eventHandlers.onCustomerDestroy);
				
		app.events.onCaseSave.addHandler (eventHandlers.onCaseSave);
		app.events.onCaseDestroy.addHandler (eventHandlers.onCaseDestroy);
		
		app.events.onBidSave.addHandler (eventHandlers.onBidSave);
		app.events.onBidDestroy.addHandler (eventHandlers.onBidDestroy)
		
		app.events.onSettlementCreate.addHandler (eventHandlers.onSettlementCreate);
		
		app.events.onInvoiceCreate.addHandler (eventHandlers.onInvoiceCreate);
						
		app.events.onCreditnoteCreate.addHandler (eventHandlers.onCreditnoteCreate);
	},
				
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{
		main.checksum = SNDK.tools.arrayChecksum (main.customer);										
		main.onChange ();			
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | GET																								|	
	// ------------------------------------------------------------------------------------------------------
	get : function ()
	{		
		details.get ();
		notes.get ();		
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------
	onChange : function ()
	{
		main.get ();
	
		if (main.mode == "NEW")
		{
			document.getElementById ("tab.details").disabled = false;
			document.getElementById ("tab.cases").disabled = true;
			document.getElementById ("tab.bids").disabled = true;
			document.getElementById ("tab.settlements").disabled = true;
			document.getElementById ("tab.invoices").disabled = true;
			document.getElementById ("tab.creditnotes").disabled = true;
			document.getElementById ("tab.notes").disabled = false;
		}
		else
		{
			document.getElementById ("tab.details").disabled = false;
			document.getElementById ("tab.cases").disabled = false;
			document.getElementById ("tab.bids").disabled = false;
			document.getElementById ("tab.settlements").disabled = false;
			document.getElementById ("tab.invoices").disabled = false;
			document.getElementById ("tab.creditnotes").disabled = false;
			document.getElementById ("tab.notes").disabled = false;
		}
	
		if ((SNDK.tools.arrayChecksum (main.customer) != main.checksum) && (main.customer.name != ""))
		{
			document.title = "Kunde: "+ main.customer.name +" ["+ main.customer.no +"] *";
		
			document.getElementById ("button.save").disabled = false;
			document.getElementById ("button.close").disabled = false;
		}
		else
		{
			document.title = "Kunde: "+ main.customer.name +" ["+ main.customer.no +"]";
		
			document.getElementById ("button.save").disabled = true;
			document.getElementById ("button.close").disabled = false;
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SAVE																								|	
	// ------------------------------------------------------------------------------------------------------
	save : function ()
	{		
		main.get ();
			
		if ((SNDK.tools.arrayChecksum (main.customer) != main.checksum))
		{		
			// If and email has been given, check if its allready being used by another customer.
			if (main.customer.email != "")
			{
				if (didius.user.isEmailInUse (main.customer.email, main.customer.userid))
				{
					app.window.prompt.alert ("Email adresse", "Den angivende email adresse er allerede registeret med en anden kunde.")				
					return;
				}			
			}
			
			didius.customer.save (main.customer);
			
			// Set mode to EDIT.
			main.mode = "EDIT";
									
			main.checksum = SNDK.tools.arrayChecksum (main.customer);
			main.onChange ();				
		}
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
			if ((SNDK.tools.arrayChecksum (main.customer) != main.checksum))
			{
				if (!app.window.prompt.confirm ("Ændringer ikke gemt", "Der er fortaget ændringer der ikke er gemt, vil du forsætte ?"))
				{
					return false;
				}			
			}
		}
		
		// Unhook events.
		app.events.onCustomerDestroy.removeHandler (eventHandlers.onCustomerDestroy);		
				
		app.events.onCaseSave.removeHandler (eventHandlers.onCaseSave);
		app.events.onCaseDestroy.removeHandler (eventHandlers.onCaseDestroy);
		
		app.events.onBidSave.removeHandler (eventHandlers.onBidSave);
		app.events.onBidDestroy.removeHandler (eventHandlers.onBidDestroy)
		
		app.events.onSettlementCreate.removeHandler (eventHandlers.onSettlementCreate);
		
		app.events.onInvoiceCreate.removeHandler (eventHandlers.onInvoiceCreate);
		
		app.events.onCreditnoteCreate.removeHandler (eventHandlers.onCreditnoteCreate);
	
		// Close window.
		window.close ();
	}
}

// ----------------------------------------------------------------------------------------------------------
// | DETAILS																								|
// ----------------------------------------------------------------------------------------------------------
var details =
{
	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{		
		details.set ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{
		document.getElementById ("textbox.no").value = main.customer.no;
		document.getElementById ("datepicker.createdate").dateValue = SNDK.tools.timestampToDate (main.customer.createtimestamp);
	
		document.getElementById ("textbox.name").value = main.customer.name;
		document.getElementById ("textbox.name").focus ();
		document.getElementById ("textbox.address1").value = main.customer.address1;
		document.getElementById ("textbox.address2").value = main.customer.address2;
		document.getElementById ("textbox.postcode").value = main.customer.postcode;
		document.getElementById ("textbox.city").value = main.customer.city;
		document.getElementById ("textbox.country").value = main.customer.country;
		
		document.getElementById ("textbox.att").value = main.customer.att;
		document.getElementById ("textbox.phone").value = main.customer.phone;
		document.getElementById ("textbox.mobile").value = main.customer.mobile;
		document.getElementById ("textbox.email").value = main.customer.email;		
		document.getElementById ("checkbox.newssms").checked = main.customer.newssms;
		
		document.getElementById ("checkbox.vat").checked = main.customer.vat;
		document.getElementById ("textbox.vatno").value = main.customer.vatno;
		
		document.getElementById ("textbox.bankname").value = main.customer.bankname;
		document.getElementById ("textbox.bankregistrationno").value = main.customer.bankregistrationno;
		document.getElementById ("textbox.bankaccountno").value = main.customer.bankaccountno;
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | GET																								|	
	// ------------------------------------------------------------------------------------------------------
	get : function ()
	{
		main.customer.name = document.getElementById ("textbox.name").value;
		main.customer.address1 = document.getElementById ("textbox.address1").value;
		main.customer.address2 = document.getElementById ("textbox.address2").value;
		main.customer.postcode = document.getElementById ("textbox.postcode").value;
		main.customer.city = document.getElementById ("textbox.city").value;
		main.customer.country = document.getElementById ("textbox.country").value;						
		
		main.customer.att = document.getElementById ("textbox.att").value;
		main.customer.phone = document.getElementById ("textbox.phone").value;
		main.customer.mobile = document.getElementById ("textbox.mobile").value;
		main.customer.email = document.getElementById ("textbox.email").value;
		main.customer.newssms = document.getElementById ("checkbox.newssms").checked;
		
		main.customer.vat = document.getElementById ("checkbox.vat").checked;
		main.customer.vatno = document.getElementById ("textbox.vatno").value;
		
		main.customer.bankname = document.getElementById ("textbox.bankname").value;
		main.customer.bankregistrationno = document.getElementById ("textbox.bankregistrationno").value;
		main.customer.bankaccountno = document.getElementById ("textbox.bankaccountno").value;	
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																								|	
	// ------------------------------------------------------------------------------------------------------
	onChange : function ()
	{		
		main.onChange ();
		
		if (app.data.postcodes[main.customer.postcode] != null)
		{
			main.customer.city = app.data.postcodes[main.customer.postcode];
			document.getElementById ("textbox.city").value = main.customer.city;
			main.onChange ();
		}
		else
		{			
			document.getElementById ("textbox.city").value = "";
			main.onChange ();
		}
	}
}

// ----------------------------------------------------------------------------------------------------------
// | CASES																									|
// ----------------------------------------------------------------------------------------------------------
var cases =
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	casesTreeHelper : null,

	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{
		cases.casesTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("tree.cases"), sortColumn: "no", sortDirection: "descending", onDoubleClick: cases.edit});
		cases.set ();
	},
				
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{
		switch (main.mode)
		{
			case "NEW":
			{
				// Enable listview
				document.getElementById ("tree.cases").disabled = false;																
				cases.onChange ();
				break;
			}
			
			case "EDIT":
			{
							var onDone = 	function (items)
								{				
									cases.casesTreeHelper.disableRefresh ();			
									for (idx in items)
									{				
										var data = {};
										var case_ = items[idx];										
										var auction = didius.auction.load (case_.auctionid);
															
										data.id = case_.id;
										data.no = case_.no;
										data.title = case_.title;
										data.auctiontitle = auction.title;																
																																																			
										cases.casesTreeHelper.addRow ({data: data});									
									}
									cases.casesTreeHelper.enableRefresh ();
							
									// Enable listview.
									document.getElementById ("tree.cases").disabled = false;																
									cases.onChange ();
								};
						
				didius.case.list ({customer: main.customer, async: true, onDone: onDone});
				break;
			}			
		}		
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | SORT																								|	
	// ------------------------------------------------------------------------------------------------------
	sort : function (attributes)
	{
		cases.casesTreeHelper.sort (attributes);
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------
	onChange : function ()
	{
		if (cases.casesTreeHelper.getCurrentIndex () != -1)
		{								
			document.getElementById ("button.casecreate").disabled = false;
			document.getElementById ("button.caseedit").disabled = false;
			document.getElementById ("button.casedestroy").disabled = false;				
		}
		else
		{										
			document.getElementById ("button.casecreate").disabled = false;		
			document.getElementById ("button.caseedit").disabled = true;
			document.getElementById ("button.casedestroy").disabled = true;				
		}						
	},
			
	// ------------------------------------------------------------------------------------------------------
	// | CREATE																								|	
	// ------------------------------------------------------------------------------------------------------			
	create : function ()
	{
		var onDone =	function (result)
						{
							if (result)
							{
								app.window.open (window, "chrome://didius/content/case/edit.xul", "didius.case.edit."+ SNDK.tools.newGuid (), null, {auctionId: result.id, customerId: main.customer.id});
							}
						};
													
		app.choose.auction ({parentWindow: window, onDone: onDone});
	},
			
	// ------------------------------------------------------------------------------------------------------
	// | EDIT																								|	
	// ------------------------------------------------------------------------------------------------------
	edit : function ()
	{				
		app.window.open (window, "chrome://didius/content/case/edit.xul", "didius.case.edit."+ cases.casesTreeHelper.getRow ().id, null, {caseId: cases.casesTreeHelper.getRow ().id});
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | DESTROY																							|	
	// ------------------------------------------------------------------------------------------------------
	destroy : function ()
	{
		if (app.window.prompt.confirm ("Slet sag", "Er du sikker på du vil slette denne sag ?"))
		{
			try
			{
				didius.case.destroy ({id: cases.casesTreeHelper.getRow ().id});
			}
			catch (error)
			{
				app.error ({exception: error})
			}								
		}
	}
}

// ----------------------------------------------------------------------------------------------------------
// | BIDS																									|
// ----------------------------------------------------------------------------------------------------------
var bids =
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	bidsTreeHelper : null,

	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{
		bids.bidsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("tree.bids"),  sortColumn: "createtimestamp", sortDirection: "ascending", onDoubleClick: bids.edit});			
		bids.set ();
	},
				
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{
		switch (main.mode)
		{
			case "NEW":
			{
				document.getElementById ("tree.bids").disabled = false;																											
				bids.onChange ();
				break;
			}
			
			case "EDIT":
			{					
				var onDone = 	function (items)
								{				
									bids.bidsTreeHelper.disableRefresh ();										
									for (idx in items)
									{				
										var bid = items[idx];																								
										var item = didius.item.load ({id: bid.itemid});								
										var _case = didius.case.load ({id: item.caseid});																
										var auction = didius.auction.load (_case.auctionid);
									
										var data = {};
										data.id = bid.id;
										data.createtimestamp = bid.createtimestamp;
										data.auctionno = auction.no;
										data.auctiontitle = auction.title;
										data.itemcatalogno = item.catalogno;
										data.itemno = item.no;
										data.itemtitle = item.title;
										data.amount = bid.amount.toFixed (2) +" kr.";
										
										bids.bidsTreeHelper.addRow ({data: data});
									}
									bids.bidsTreeHelper.enableRefresh ();
									
									// Enable listview.
									document.getElementById ("tree.bids").disabled = false;																											
									bids.onChange ();
								};
						
				var onError =	function (exception)
								{
									app.error ({exception: exception})							
								};
			
				didius.bid.list ({customer: main.customer, onDone: onDone, onError: onError});
				break;
			}
		}
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------				
	onChange : function ()
	{
		if (bids.bidsTreeHelper.getCurrentIndex () != -1)
		{					
			document.getElementById ("button.bidcreate").disabled = false;
			document.getElementById ("button.bidedit").disabled = false;
			document.getElementById ("button.biddestroy").disabled = false;
		}
		else
		{												
			document.getElementById ("button.bidcreate").disabled = false;
			document.getElementById ("button.bidedit").disabled = true;
			document.getElementById ("button.biddestroy").disabled = true;
		}						
	},
						
	// ------------------------------------------------------------------------------------------------------
	// | CREATE																								|	
	// ------------------------------------------------------------------------------------------------------
	create : function ()
	{
		app.window.open (window, "chrome://didius/content/bid/create.xul", "didius.bid.create."+ SNDK.tools.newGuid (), "modal", {customerId: main.customer.id});		
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | EDIT																								|	
	// ------------------------------------------------------------------------------------------------------
	edit : function ()
	{
		app.window.open (window, "chrome://didius/content/bid/edit.xul", "didius.bid.edit."+ bids.bidsTreeHelper.getRow ().id, "modal", {bidId: bids.bidsTreeHelper.getRow ().id});				
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | DESTROY																							|	
	// ------------------------------------------------------------------------------------------------------
	destroy : function ()
	{
		if (app.window.prompt.confirm ("Slet bud", "Er du sikker på du vil slette dette bud ?"))
		{
			try
			{
				var bid = didius.bid.load ({id: bids.bidsTreeHelper.getRow ().id});								
				var item = didius.item.load ({id: bid.itemid});
			
				if (item.invoiced == true)
				{
					if (app.window.prompt.confirm ("Bud er faktureret", "Før dette bud kan rettes, skal der laves en kreditnota. Vil du gøre dette ?"))
					{				
						var creditnote = didius.creditnote.create ({customer: main.customer, item: item, simulate: false});									
					}
					else
					{
						return;
					}
				}
			
				didius.bid.destroy ({id: bids.bidsTreeHelper.getRow ().id});
			}
			catch (error)
			{
				app.error ({exception: error})
			}								
		}
	}
}

// ----------------------------------------------------------------------------------------------------------
// | SETTLEMENTS																							|
// ----------------------------------------------------------------------------------------------------------
var settlements =
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	settlementsTreeHelper : null,
	
	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{
		settlements.settlementsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("tree.settlements"),  sortColumn: "createtimestamp", sortDirection: "ascending", onDoubleClick: settlements.show});			
		settlements.set ();
	},
				
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------		
	set : function ()
	{
		switch (main.mode)
		{
			case "NEW":
			{
				// Enable listview.
				document.getElementById ("tree.settlements").disabled = false;
				settlements.onChange ();
				break;
			}
			
			case "EDIT":
			{
				var onDone = 	function (items)
								{				
									settlements.settlementsTreeHelper.disableRefresh ();								
									for (idx in items)
									{				
										var data = {};
										data.id = items[idx].id;
										data.createtimestamp = items[idx].createtimestamp;
										data.no = items[idx].no;
										
										var case_ = didius.case.load ({id: items[idx].caseid})										
										data.caseno = case_.no;
										
										var auction = didius.auction.load (items[idx].auctionid)										
										data.auctiontitle = auction.title;
										data.total = items[idx].total.toFixed (2) +" kr.";	
										
										settlements.settlementsTreeHelper.addRow ({data: data});
									}
									settlements.settlementsTreeHelper.enableRefresh ();
									
									// Enable listview.
									document.getElementById ("tree.settlements").disabled = false;
									settlements.onChange ();
								};
					
				didius.settlement.list ({customer: main.customer, async: true, onDone: onDone});
				break;
			}		
		}	
	},
			
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------
	onChange : function ()
	{
		if (settlements.settlementsTreeHelper.getCurrentIndex () != -1)
		{					
			document.getElementById ("button.settlementshow").disabled = false;				
		}
		else
		{												
			document.getElementById ("button.settlementshow").disabled = true;				
		}						
	},
				
	// ------------------------------------------------------------------------------------------------------
	// | SHOW																								|	
	// ------------------------------------------------------------------------------------------------------
	show : function ()
	{				
		app.window.open (window, "chrome://didius/content/settlement/show.xul", "didius.settlement.show."+ settlements.settlementsTreeHelper.getRow ().id, null, {settlementId: settlements.settlementsTreeHelper.getRow ().id});				
	}
}

// ----------------------------------------------------------------------------------------------------------
// | INVOICES																								|
// ----------------------------------------------------------------------------------------------------------
var invoices =
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	invoicesTreeHelper : null,
	
	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{
		invoices.invoicesTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("tree.invoices"),  sortColumn: "createtimestamp", sortDirection: "ascending", onDoubleClick: invoices.show});			
		invoices.set ();
	},
					
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------		
	set : function ()
	{
		switch (main.mode)
		{
			case "NEW":
			{
				// Enable listview.
				document.getElementById ("tree.invoices").disabled = false;											
				invoices.onChange ();
				break;
			}
			
			case "EDIT":
			{
				var onDone = 	function (items)
								{														
									invoices.invoicesTreeHelper.disableRefresh ();
									for (idx in items)
									{				
										var item = items[idx];
																														
										var data = {};
										data.id = item.id;
										data.createtimestamp = item.createtimestamp;
										data.no = item.no;				
										
										var date = SNDK.tools.timestampToDate (item.createtimestamp)										
										data.date = SNDK.tools.padLeft (date.getDate (), 2, "0") +"-"+ SNDK.tools.padLeft ((date.getMonth () + 1), 2, "0") +"-"+ date.getFullYear ();					
																				
										data.vat = item.vat.toFixed (2) +" kr."; 
										data.total = item.total.toFixed (2) +" kr.";			
										
										invoices.invoicesTreeHelper.addRow ({data: data});
									}
									invoices.invoicesTreeHelper.enableRefresh ();							
									
									// Enable listview.
									document.getElementById ("tree.invoices").disabled = false;																
									invoices.onChange ();
								};
							
				didius.invoice.list ({customer: main.customer, async: true, onDone: onDone});
				break;
			}
		}
	},
					
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------					
	onChange : function ()
	{
		if (invoices.invoicesTreeHelper.getCurrentIndex () != -1)
		{					
			document.getElementById ("button.invoiceshow").disabled = false;				
			document.getElementById ("button.invoicecreate").disabled = false;
		}
		else
		{												
			document.getElementById ("button.invoiceshow").disabled = true;
			document.getElementById ("button.invoicecreate").disabled = false;				
		}						
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | CREATE																								|	
	// ------------------------------------------------------------------------------------------------------
	create : function ()
	{				
		var onDone = 	function (result)
						{					
							if (result)
							{								
								if (result != null)
								{																	
									app.window.open (window, "chrome://didius/content/invoice/create.xul", "didius.auction.invoice.create."+ SNDK.tools.newGuid (), "modal", {customerId: main.customer.id, auctionId: result.id});				
								}									
							}																												
						};
																				
		app.choose.auction ({onDone: onDone, parentWindow: window});		
	},	
										
	// ------------------------------------------------------------------------------------------------------
	// | SHOW																								|	
	// ------------------------------------------------------------------------------------------------------																																																				
	show : function ()
	{						
		app.window.open (window, "chrome://didius/content/invoice/show.xul", "didius.auction.invoice.show."+ invoices.invoicesTreeHelper.getRow ().id, null, {invoiceId: invoices.invoicesTreeHelper.getRow ().id});				
	}	
}

// ----------------------------------------------------------------------------------------------------------
// | CREDITNOTES																							|
// ----------------------------------------------------------------------------------------------------------
var creditnotes =
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	invoicesTreeHelper : null,
	
	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{
		creditnotes.creditnotesTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("tree.creditnotes"),  sortColumn: "createtimestamp", sortDirection: "ascending", onDoubleClick: creditnotes.show});
		creditnotes.set ();
	},
					
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------		
	set : function ()
	{
		switch (main.mode)
		{
			case "NEW":
			{
				// Enable listview.
				document.getElementById ("tree.creditnotes").disabled = false;
				invoices.onChange ();
				break;
			}
			
			case "EDIT":
			{
				var onDone = 	function (items)
								{														
									creditnotes.creditnotesTreeHelper.disableRefresh ();
									for (idx in items)
									{				
										var item = items[idx];
																	
										var data = {};
										data.id = item.id;
										data.createtimestamp = item.createtimestamp;
										data.no = item.no;				
										
										var date = SNDK.tools.timestampToDate (item.createtimestamp)										
										data.date = SNDK.tools.padLeft (date.getDate (), 2, "0") +"-"+ SNDK.tools.padLeft ((date.getMonth () + 1), 2, "0") +"-"+ date.getFullYear ();					
																					
										data.vat = item.vat.toFixed (2) +" kr.";
										data.total = item.total.toFixed (2) +" kr.";
										
										creditnotes.creditnotesTreeHelper.addRow ({data: data});
									}
									creditnotes.creditnotesTreeHelper.enableRefresh ();							
									
									// Enable listview.
									document.getElementById ("tree.creditnotes").disabled = false;
									creditnotes.onChange ();
								};
							
				didius.creditnote.list ({customer: main.customer, async: true, onDone: onDone});
				break;
			}
		}
	},
					
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------					
	onChange : function ()
	{
		if (creditnotes.creditnotesTreeHelper.getCurrentIndex () != -1)
		{					
			document.getElementById ("button.creditnoteshow").disabled = false;							
		}
		else
		{												
			document.getElementById ("button.creditnoteshow").disabled = true;			
		}						
	},
				
	// ------------------------------------------------------------------------------------------------------
	// | SHOW																								|	
	// ------------------------------------------------------------------------------------------------------																																																				
	show : function ()
	{				
		window.openDialog ("chrome://didius/content/creditnote/show.xul", "didius.creditnote.show."+ creditnotes.creditnotesTreeHelper.getRow ().id, "chrome", {creditnoteId: creditnotes.creditnotesTreeHelper.getRow ().id});
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | CREATE																								|	
	// ------------------------------------------------------------------------------------------------------
	create : function ()
	{				
		var onDone = 	function (result)
						{					
							if (result)
							{								
								if (result != null)
								{								
									window.openDialog ("chrome://didius/content/invoice/create.xul", "didius.auction.invoice.show."+ SNDK.tools.newGuid (), "chrome", {customerId: main.customer.id, auctionId: result.id});
								}									
							}																												
						};
																				
		app.choose.auction ({onDone: onDone, parentWindow: window});		
	},
}
	
// ----------------------------------------------------------------------------------------------------------
// | NOTES																									|
// ----------------------------------------------------------------------------------------------------------
var notes =
{
	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{		
		notes.set ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{
		document.getElementById ("textbox.notes").value = main.customer.notes;
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | GET																								|	
	// ------------------------------------------------------------------------------------------------------
	get : function ()
	{
		main.customer.notes = document.getElementById ("textbox.notes").value;
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------
	onChange : function ()
	{		
		main.onChange ();
	}
}

// ----------------------------------------------------------------------------------------------------------
// | EVENTHANDLERS																							|
// ----------------------------------------------------------------------------------------------------------
var eventHandlers =
{
	// ------------------------------------------------------------------------------------------------------
	// | ONCUSTOMERDESTROY																					|	
	// ------------------------------------------------------------------------------------------------------
	onCustomerDestroy : function (eventData)
	{
		if (main.current.id == eventData.id)
		{
			main.close (true);
		}
	},
			
	// ------------------------------------------------------------------------------------------------------
	// | ONCASESAVE																							|	
	// ------------------------------------------------------------------------------------------------------
	onCaseSave : function (eventData)
	{
		if (main.customer.id == eventData.customerid)
		{
			var data = {};	
			var case_ = eventData
			var auction = didius.auction.load (case_.auctionid);
															
			data.id = case_.id;
			data.no = case_.no;
			data.title = case_.title;
			data.auctiontitle = auction.title;																
																																																			
			cases.casesTreeHelper.addRow ({data: data});								
		}
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | ONCASEDESTROY																						|	
	// ------------------------------------------------------------------------------------------------------
	onCaseDestroy : function (eventData)
	{
		cases.casesTreeHelper.removeRow ({id: eventData.id});
	},		
		
	// ------------------------------------------------------------------------------------------------------
	// | ONBIDSAVE																							|	
	// ------------------------------------------------------------------------------------------------------
	onBidSave : function (eventData)
	{
		if (main.customer.id == eventData.customer.id)
		{			
			var data = {};
			
			var item = didius.item.load ({id: eventData.itemid});
			var case_ = didius.case.load ({id: item.caseid});																
			var auction = didius.auction.load (case_.auctionid);			
									
			var data = {};
			data.id = eventData.id;
			data.createtimestamp = eventData.createtimestamp;
			data.auctionno = auction.no;
			data.auctiontitle = auction.title;
			data.itemcatalogno = item.catalogno;
			data.itemno = item.no;
			data.itemtitle = item.title;
			data.amount = eventData.amount.toFixed (2) +" kr.";
			
			bids.bidsTreeHelper.setRow ({data: data});
		}
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | ONBIDDESTROY																						|	
	// ------------------------------------------------------------------------------------------------------
	onBidDestroy : function (eventData)
	{
		bids.bidsTreeHelper.removeRow ({id: eventData.id});
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | ONSETTLEMENTCREATE																					|	
	// ------------------------------------------------------------------------------------------------------
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
			
			settlements.settlementsTreeHelper.addRow ({data: data});			
		}
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | ONINVOICECREATE																					|	
	// ------------------------------------------------------------------------------------------------------
	onInvoiceCreate : function (eventData)
	{
		if (main.customer.id == eventData.customerid)
		{
			var data = {};
																		
			data.id = eventData.id;
			data.createtimestamp = eventData.createtimestamp;
			data.no = eventData.no;				
																													
			var date = SNDK.tools.timestampToDate (eventData.createtimestamp)										
			data.date = SNDK.tools.padLeft (date.getDate (), 2, "0") +"-"+ SNDK.tools.padLeft ((date.getMonth () + 1), 2, "0") +"-"+ date.getFullYear ();					
										
			data.vat = eventData.vat.toFixed (2) +" kr."; 
			data.total = eventData.total.toFixed (2) +" kr.";			
			
			invoices.invoicesTreeHelper.addRow ({data: data});			
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCREDITNOTECREATE																					|	
	// ------------------------------------------------------------------------------------------------------
	onCreditnoteCreate : function (eventData)
	{
		if (main.customer.id == eventData.customerid)
		{
			var data = {};
			
			data.id = eventData.id;
			data.createtimestamp = eventData.createtimestamp;
			data.no = eventData.no;				
										
			var date = SNDK.tools.timestampToDate (eventData.createtimestamp)										
			data.date = SNDK.tools.padLeft (date.getDate (), 2, "0") +"-"+ SNDK.tools.padLeft ((date.getMonth () + 1), 2, "0") +"-"+ date.getFullYear ();					
																					
			data.vat = eventData.vat.toFixed (2) +" kr.";
			data.total = eventData.total.toFixed (2) +" kr.";
			
			creditnotes.creditnotesTreeHelper.addRow ({data: data});			
		}
	}
}