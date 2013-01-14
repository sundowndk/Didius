Components.utils.import("resource://didius/js/app.js");

// ----------------------------------------------------------------------------------------------------------
// | MAIN																									|
// ----------------------------------------------------------------------------------------------------------
var main =
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	customer : null,
	checksum : null,

	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
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
		
		main.set ();					
					
		// Init tabs
		details.init ();
		cases.init ();
		bids.init ();
		settlements.init ();
		invoices.init ();
		notes.init ();
		
		// Hook events.
		app.events.onCustomerDestroy.addHandler (eventHandlers.onCustomerDestroy);
		
		app.events.onCaseCreate.addHandler (eventHandlers.onCaseCreate);
		app.events.onCaseSave.addHandler (eventHandlers.onCaseSave);
		app.events.onCaseDestroy.addHandler (eventHandlers.onCaseDestroy);
		
		app.events.onBidCreate.addHandler (eventHandlers.onBidCreate);
		app.events.onBidSave.addHandler (eventHandlers.onBidSave);
		app.events.onBidDestroy.addHandler (eventHandlers.onBidDestroy)
		
		app.events.onSettlementCreate.addHandler (eventHandlers.onSettlementCreate);
		
		app.events.onInvoiceCreate.addHandler (eventHandlers.onInvoiceCreate);
	},
				
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{
		main.checksum = SNDK.tools.arrayChecksum (main.customer);										
		main.onChange ();
		
		document.getElementById ("name").focus ();
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
		main.get ();
	
		if ((SNDK.tools.arrayChecksum (main.customer) != main.checksum) && (main.customer.name != ""))
		{
			document.title = "Kunde: "+ main.customer.name +" ["+ main.customer.no +"] *";
		
			document.getElementById ("save").disabled = false;
			document.getElementById ("close").disabled = false;
		}
		else
		{
			document.title = "Kunde: "+ main.customer.name +" ["+ main.customer.no +"]";
		
			document.getElementById ("save").disabled = true;
			document.getElementById ("close").disabled = false;
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
		
		app.events.onCaseCreate.removeHandler (eventHandlers.onCaseCreate);
		app.events.onCaseSave.removeHandler (eventHandlers.onCaseSave);
		app.events.onCaseDestroy.removeHandler (eventHandlers.onCaseDestroy);
		
		app.events.onBidCreate.removeHandler (eventHandlers.onBidCreate);
		app.events.onBidSave.removeHandler (eventHandlers.onBidSave);
		app.events.onBidDestroy.removeHandler (eventHandlers.onBidDestroy)
		
		app.events.onSettlementCreate.removeHandler (eventHandlers.onSettlementCreate);
		
		app.events.onInvoiceCreate.removeHandler (eventHandlers.onInvoiceCreate);
	
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
		document.getElementById ("no").value = main.customer.no;
		document.getElementById ("createdate").dateValue = SNDK.tools.timestampToDate (main.customer.createtimestamp);
	
		document.getElementById ("name").value = main.customer.name;
		document.getElementById ("address1").value = main.customer.address1;
		document.getElementById ("address2").value = main.customer.address2;
		document.getElementById ("postcode").value = main.customer.postcode;
		document.getElementById ("city").value = main.customer.city;
		document.getElementById ("country").value = main.customer.country;
		
		document.getElementById ("att").value = main.customer.att;
		document.getElementById ("phone").value = main.customer.phone;
		document.getElementById ("mobile").value = main.customer.mobile;
		document.getElementById ("email").value = main.customer.email;		
		
		document.getElementById ("vat").checked = main.customer.vat;
		document.getElementById ("vatno").value = main.customer.vatno;
		
		document.getElementById ("bankname").value = main.customer.bankname;
		document.getElementById ("bankregistrationno").value = main.customer.bankregistrationno;
		document.getElementById ("bankaccountno").value = main.customer.bankaccountno;
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | GET																								|	
	// ------------------------------------------------------------------------------------------------------
	get : function ()
	{
		main.customer.name = document.getElementById ("name").value;
		main.customer.address1 = document.getElementById ("address1").value;
		main.customer.address2 = document.getElementById ("address2").value;
		main.customer.postcode = document.getElementById ("postcode").value;
		main.customer.city = document.getElementById ("city").value;
		main.customer.country = document.getElementById ("country").value;						
		
		main.customer.att = document.getElementById ("att").value;
		main.customer.phone = document.getElementById ("phone").value;
		main.customer.mobile = document.getElementById ("mobile").value;
		main.customer.email = document.getElementById ("email").value;
		
		main.customer.vat = document.getElementById ("vat").checked;
		main.customer.vatno = document.getElementById ("vatno").value;
		
		main.customer.bankname = document.getElementById ("bankname").value;
		main.customer.bankregistrationno = document.getElementById ("bankregistrationno").value;
		main.customer.bankaccountno = document.getElementById ("bankaccountno").value;				
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																								|	
	// ------------------------------------------------------------------------------------------------------
	onChange : function ()
	{
		details.get ();
		main.onChange ();
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
		cases.casesTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("cases"), sortColumn: "no", sortDirection: "descending", onDoubleClick: cases.edit});
		cases.set ();
	},
				
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{
		var onDone = 	function (items)
						{				
							cases.casesTreeHelper.disableRefresh ();			
							for (idx in items)
							{													
								cases.casesTreeHelper.addRow ({data: items[idx]});									
							}
							cases.casesTreeHelper.enableRefresh ();

								
							// Enable controls
							document.getElementById ("cases").disabled = false;																
							cases.onChange ();
						};

			// Disable controls
			document.getElementById ("cases").disabled = true;					
			document.getElementById ("caseEdit").disabled = true;
			document.getElementById ("caseDestroy").disabled = true;
						
			didius.case.list ({customer: main.customer, async: true, onDone: onDone});				
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
			document.getElementById ("caseEdit").disabled = false;
			document.getElementById ("caseDestroy").disabled = false;				
		}
		else
		{												
			document.getElementById ("caseEdit").disabled = true;
			document.getElementById ("caseDestroy").disabled = true;				
		}						
	},
			
	// ------------------------------------------------------------------------------------------------------
	// | EDIT																								|	
	// ------------------------------------------------------------------------------------------------------
	edit : function ()
	{				
		window.openDialog ("chrome://didius/content/case/edit.xul", "didius.case.edit."+ cases.casesTreeHelper.getRow ().id, "chrome", {caseId: cases.casesTreeHelper.getRow ().id});
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
				didius.case.destroy (cases.casesTreeHelper.getRow ().id);					
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
		bids.bidsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("bids"),  sortColumn: "createtimestamp", sortDirection: "ascending", onDoubleClick: bids.edit});			
		bids.set ();
	},
				
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{
		var onDone = 	function (items)
						{				
							bids.bidsTreeHelper.disableRefresh ();										
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
								
								bids.bidsTreeHelper.addRow ({data: data});
							}
							bids.bidsTreeHelper.enableRefresh ();
							
							// Enable controls
							document.getElementById ("bids").disabled = false;																
							bids.onChange ();
						};

			// Disable controls
			document.getElementById ("bids").disabled = true;					
			document.getElementById ("bidShow").disabled = true;				
					
			didius.bid.list ({customer: main.customer, async: true, onDone: onDone});
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------				
	onChange : function ()
	{
		if (bids.bidsTreeHelper.getCurrentIndex () != -1)
		{					
			document.getElementById ("bidShow").disabled = false;
		}
		else
		{												
			document.getElementById ("bidShow").disabled = true;
		}						
	},
				
	// ------------------------------------------------------------------------------------------------------
	// | SHOW																							|	
	// ------------------------------------------------------------------------------------------------------
	show : function ()
	{		
		window.openDialog ("chrome://didius/content/bid/edit.xul", "didius.bid.edit."+ bids.bidsTreeHelper.getRow ().id, "chrome", {bidid: bids.bidsTreeHelper.getRow ().id});
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
		settlements.settlementsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("settlements"),  sortColumn: "createtimestamp", sortDirection: "ascending", onDoubleClick: settlements.show});			
		settlements.set ();
	},
				
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------		
	set : function ()
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
								data.caseno = items[idx].case.no;
								data.auctiontitle = items[idx].case.auction.title;
								data.total = items[idx].total;																	
								
								settlements.settlementsTreeHelper.addRow ({data: data});
							}
							settlements.settlementsTreeHelper.enableRefresh ();
							
							// Enable controls
							document.getElementById ("settlements").disabled = false;																
							settlements.onChange ();
						};

			// Disable controls
			document.getElementById ("settlements").disabled = true;					
			document.getElementById ("settlementShow").disabled = true;				
					
			didius.settlement.list ({customer: main.customer, async: true, onDone: onDone});
	},
			
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------
	onChange : function ()
	{
		if (settlements.settlementsTreeHelper.getCurrentIndex () != -1)
		{					
			document.getElementById ("settlementShow").disabled = false;				
		}
		else
		{												
			document.getElementById ("settlementShow").disabled = true;				
		}						
	},
				
	// ------------------------------------------------------------------------------------------------------
	// | SHOW																								|	
	// ------------------------------------------------------------------------------------------------------
	show : function ()
	{		
		window.openDialog ("chrome://didius/content/case/settlement/show.xul", "didius.case.settlement.show."+ settlements.settlementsTreeHelper.getRow ().id, "chrome", {settlementId: settlements.settlementsTreeHelper.getRow ().id});
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
		invoices.invoicesTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("invoices"),  sortColumn: "createtimestamp", sortDirection: "ascending", onDoubleClick: invoices.show});			
		invoices.set ();
	},
				
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------		
	set : function ()
	{
		var onDone = 	function (items)
						{														
							invoices.invoicesTreeHelper.disableRefresh ();
							for (idx in items)
							{				
								var data = {};
								data.id = items[idx].id;
								data.createtimestamp = items[idx].createtimestamp;
								data.no = items[idx].no;									
								data.auctiontitle = items[idx].auction.title;
								data.total = items[idx].total;																	
								
								invoices.invoicesTreeHelper.addRow ({data: data});
							}
							invoices.invoicesTreeHelper.enableRefresh ();							
							
							// Enable controls
							document.getElementById ("invoices").disabled = false;																
							invoices.onChange ();
						};

			// Disable controls
			document.getElementById ("invoices").disabled = true;					
			document.getElementById ("invoiceShow").disabled = true;				
					
			didius.invoice.list ({customer: main.customer, async: true, onDone: onDone});
	},
					
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------					
	onChange : function ()
	{
		if (invoices.invoicesTreeHelper.getCurrentIndex () != -1)
		{					
			document.getElementById ("invoiceShow").disabled = false;				
		}
		else
		{												
			document.getElementById ("invoiceShow").disabled = true;				
		}						
	},
				
	// ------------------------------------------------------------------------------------------------------
	// | SHOW																							|	
	// ------------------------------------------------------------------------------------------------------																																																				
	show : function ()
	{				
		window.openDialog ("chrome://didius/content/auction/invoice/show.xul", "didius.auction.invoice.show."+ invoices.invoicesTreeHelper.getRow ().id, "chrome", {invoiceId: invoices.invoicesTreeHelper.getRow ().id});
	}
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
		document.getElementById ("notes").value = main.customer.notes;
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | GET																								|	
	// ------------------------------------------------------------------------------------------------------
	get : function ()
	{
		main.customer.notes = document.getElementById ("notes").value;
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------
	onChange : function ()
	{
		notes.get ();	
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
	// | ONCASECREATE																						|	
	// ------------------------------------------------------------------------------------------------------
	onCaseCreate : function (eventData)
	{
		if (main.current.id == eventData.customerid)
		{
			cases.casesTreeHelper.addRow ({data: eventData});
		}
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | ONCASESAVE																							|	
	// ------------------------------------------------------------------------------------------------------
	onCaseSave : function (eventData)
	{
		if (main.current.id == eventData.customerid)
		{
			cases.casesTreeHelper.setRow ({data: eventData});
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
	// | ONBIDCREATE																						|	
	// ------------------------------------------------------------------------------------------------------
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
			
			bids.bidsTreeHelper.addRow ({data: data});
		}
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | ONBIDSAVE																							|	
	// ------------------------------------------------------------------------------------------------------
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
			
			bids.bidsTreeHelper.addRow ({data: data});
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
		if (main.current.id == eventData.customerid)
		{
			var data = {};
			
			data.id = eventData.id;
			data.createtimestamp = eventData.createtimestamp;
			data.no = eventData.no;				
			data.auctiontitle = eventData.case.auction.title;								
			data.total = eventData.total;
			
			invoices.invoicesTreeHelper.addRow ({data: data});			
		}
	}
}