Components.utils.import("resource://didius/js/app.js");

var Cc = Components.classes;
var Ci = Components.interfaces;
var Cu = Components.utils;
var Cr = Components.results;

// ----------------------------------------------------------------------------------------------------------
// | MAIN																									|
// ----------------------------------------------------------------------------------------------------------
var main =
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	case : null,
	checksum : null,	

	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{	 	
		try
		{
			main.case = didius.case.load (window.arguments[0].caseId);
			main.auction = didius.auction.load (main.case.auctionid);
			main.customer = didius.customer.load (main.case.customerid);
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
		items.init ();
		
		// Hook events.		
		app.events.onCaseDestroy.addHandler (eventHandlers.onCaseDestroy);
		
		app.events.onItemCreate.addHandler (eventHandlers.onItemCreate);
		app.events.onItemSave.addHandler (eventHandlers.onItemSave);
		app.events.onItemDestroy.addHandler (eventHandlers.onItemDestroy);
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{
		main.checksum = SNDK.tools.arrayChecksum (main.case);												
		main.onChange ();
		
		document.getElementById ("title").focus ();
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
	
		if ((SNDK.tools.arrayChecksum (main.case) != main.checksum))
		{
			document.title = "Sag: "+ main.case.title +" ["+ main.case.no +"] *";
		
			document.getElementById ("save").disabled = false;
			document.getElementById ("close").disabled = false;
		}
		else
		{
			document.title = "Sag: "+ main.case.title +" ["+ main.case.no +"]";
		
			document.getElementById ("save").disabled = true;
			document.getElementById ("close").disabled = false;
		}
		
		if (main.auction.status == "Closed")
		{	
			document.getElementById ("createSettlement").disabled = false;	
			document.getElementById ("showSettlement").disabled = false;
			
			if (main.case.settled)
			{
				document.getElementById ("createSettlementBox").collapsed = true;
				document.getElementById ("showSettlementBox").collapsed = false;
			}
			else		
			{
				document.getElementById ("createSettlementBox").collapsed = false;
				document.getElementById ("showSettlementBox").collapsed = true;
			}
		}
		else
		{
			document.getElementById ("createSettlement").disabled = true;
			document.getElementById ("createSettlementBox").collapsed = false;
			document.getElementById ("showSettlementBox").collapsed = true;		
		}
		
		if (main.auction.status == "Closed" || main.auction.status == "Running")
		{
			document.getElementById ("title").disabled = true;
		
			document.getElementById ("customerreference").disabled = true;
			document.getElementById ("commisionfeepercentage").disabled = true;
			document.getElementById ("commisionfeeminimum").disabled = true;
		}
		else
		{
			document.getElementById ("title").disabled = false;
		
			document.getElementById ("customerreference").disabled = false;
			document.getElementById ("commisionfeepercentage").disabled = false;
			document.getElementById ("commisionfeeminimum").disabled = false;
		}
	},
			
	// ------------------------------------------------------------------------------------------------------
	// | SAVE																								|	
	// ------------------------------------------------------------------------------------------------------
	save : function ()
	{			
		main.get ();
		
		didius.case.save (main.case);
				
		main.checksum = SNDK.tools.arrayChecksum (main.case);
		main.onChange ();				
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
			if ((SNDK.tools.arrayChecksum (main.case) != main.checksum))
			{
				if (!app.window.prompt.confirm ("Ændringer ikke gemt", "Der er fortaget ændringer, der ikke er gemt, vil du forsætte ?"))
				{
					return false;
				}			
			}
		}
		
		// Unhook events.
		app.events.onCaseDestroy.removeHandler (eventHandlers.onCaseDestroy);
		
		app.events.onItemCreate.removeHandler (eventHandlers.onItemCreate);
		app.events.onItemSave.removeHandler (eventHandlers.onItemSave);
		app.events.onItemDestroy.removeHandler (eventHandlers.onItemDestroy);
	
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
		document.getElementById ("no").value = main.case.no;
		document.getElementById ("createdate").dateValue = SNDK.tools.timestampToDate (main.case.createtimestamp);
		document.getElementById ("auction").value = main.auction.title;		
		document.getElementById ("customer").value = main.customer.name;
	
		document.getElementById ("title").value = main.case.title;		
		
		document.getElementById ("customerreference").value = main.case.customerreference;		
		document.getElementById ("commisionfeepercentage").value = main.case.commisionfeepercentage;		
		document.getElementById ("commisionfeeminimum").value = main.case.commisionfeeminimum;		
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | GET																								|	
	// ------------------------------------------------------------------------------------------------------	
	get : function ()	
	{
		main.case.title = document.getElementById ("title").value;		
		
		main.case.customerreference = document.getElementById ("customerreference").value;		
		main.case.commisionfeepercentage = document.getElementById ("commisionfeepercentage").value;		
		main.case.commisionfeeminimum = document.getElementById ("commisionfeeminimum").value;		
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------	
	onChange : function ()
	{
		details.get ();
		main.onChange ();
	}	
}

// ----------------------------------------------------------------------------------------------------------
// | ITEMS																									|
// ----------------------------------------------------------------------------------------------------------
var items =
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	itemsTreeHelper : null,

	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{		
		items.itemsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("items"), sortColumn: "catalogno", sortDirection: "descending", onDoubleClick: items.edit});
		items.set ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{
		var onDone = 	function (result)
						{
							items.itemsTreeHelper.disableRefresh ();
							for (idx in result)
							{															
								items.itemsTreeHelper.addRow ({data: result[idx]});
							}
							items.itemsTreeHelper.enableRefresh ();
							
							// Enable controls
							document.getElementById ("items").disabled = false;
							items.onChange ();
						};
								
			didius.item.list ({case: main.case, async: true, onDone: onDone});				
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------
	onChange : function ()
	{
		if (items.itemsTreeHelper.getCurrentIndex () != -1)
		{
			document.getElementById ("itemCreate").disabled = false;
			document.getElementById ("itemEdit").disabled = false;
			document.getElementById ("itemDestroy").disabled = false;
		}
		else
		{
			document.getElementById ("itemCreate").disabled = false;
			document.getElementById ("itemEdit").disabled = true;
			document.getElementById ("itemDestroy").disabled = true;
		}
		
		if (main.auction.status == "Closed" || main.auction.status == "Running")
		{
			document.getElementById ("itemCreate").disabled = true;
			document.getElementById ("itemEdit").disabled = false;
			document.getElementById ("itemDestroy").disabled = true;
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SORT																								|	
	// ------------------------------------------------------------------------------------------------------
	sort : function (attributes)
	{
		items.itemsTreeHelper.sort (attributes);
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | CREATE																								|	
	// ------------------------------------------------------------------------------------------------------
	create : function ()
	{		
		// Create new item.
		var current = didius.item.create (main.case);
		didius.item.save (current);																								
																												
		window.openDialog ("chrome://didius/content/item/edit.xul", "didius.item.edit."+ current.id, "chrome", {itemId: current.id});
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | EDIT																								|	
	// ------------------------------------------------------------------------------------------------------							
	edit : function ()
	{				
		window.openDialog ("chrome://didius/content/item/edit.xul", "didius.item.edit."+ items.itemsTreeHelper.getRow ().id, "chrome", {itemId: items.itemsTreeHelper.getRow ().id});
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | DESTROY																							|	
	// ------------------------------------------------------------------------------------------------------
	destroy : function ()
	{		
		if (app.window.prompt.confirm ("Slet effekt", "Er du sikker på du vil slette denne effekt ?"))
		{
			try
			{
				// Get row currently selected and delete the item underneath.
				didius.item.destroy (items.itemsTreeHelper.getRow ().id);	
			}
			catch (error)
			{					
				app.error ({exception: error})
			}								
		}
	}
}

// ----------------------------------------------------------------------------------------------------------
// | SALESAGREEMENT																							|
// ----------------------------------------------------------------------------------------------------------
var salesAgreement =
{
	// ------------------------------------------------------------------------------------------------------
	// | SHOW																								|	
	// ------------------------------------------------------------------------------------------------------
	show : function ()
	{
		window.openDialog ("chrome://didius/content/case/salesagreement/show.xul", "didius.case.salesagreement.show."+ main.case.id, "chrome", {caseId: main.case.id});
	}			
}

// ----------------------------------------------------------------------------------------------------------
// | SETTLEMENT																								|
// ----------------------------------------------------------------------------------------------------------
var settlement =
{	
	// ------------------------------------------------------------------------------------------------------
	// | CREATE																								|	
	// ------------------------------------------------------------------------------------------------------
	create : function ()
	{
		var onApprove = function ()
						{
							main.case.settled = true;
							main.checksum = SNDK.tools.arrayChecksum (main.case);
							main.onChange ();
						};
				
		window.openDialog ("chrome://didius/content/case/settlement/create.xul", "didius.case.settlement.create."+ main.case.id, "chrome, modal", {caseId: main.case.id, onApprove: onApprove});
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SHOW																								|	
	// ------------------------------------------------------------------------------------------------------
	show : function ()
	{								
		window.openDialog ("chrome://didius/content/case/settlement/show.xul", "didius.case.settlement.show.-"+ main.case.id, "chrome", {caseId: main.case.id});
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | PRINT																								|	
	// ------------------------------------------------------------------------------------------------------
	print : function ()
	{					
		var items = didius.item.list ({case: main.current});			
							
		SNDK.tools.sortArrayHash (items, "catalogno", "numeric");
			
		var template = "";
	
		template = didius.helpers.parsePrintTemplate (sXUL.tools.fileToString ("chrome://didius/content/templates/settlement.tpl"));
																																				
		var pageCount = 1;			
											
		var print = document.getElementById ("printframe");
	
		print.contentDocument.body.innerHTML = " ";						
			
		var totalSale = 0;
		var totalCommissionFee = 0;							
		var totalTotal = 0;																																								
																																															
		var page = function (from)
		{
			// Add styles.																		
			var styles = print.contentDocument.createElement ("style");					
			print.contentDocument.body.appendChild (styles);					
			styles.innerHTML = template.styles;
	
			// Create page.				
			var page = print.contentDocument.createElement ("div");
			page.className = "Page A4";
			print.contentDocument.body.appendChild (page);
																						
			// Add content holder.																						
			var content = print.contentDocument.createElement ("div")
			content.className = "PrintContent";
			page.appendChild (content);
																	
			// Add inital content.
			var render = template.page.replace ("%%PAGENUMBER%%", pageCount++);					
			content.innerHTML = render;
		
			// Caluculate page maxheight for printing.										
			var maxHeight = page.offsetHeight 
			var maxHeight2 = page.offsetHeight;
			
											
			// Calculate DISCLAIMER height.							
								
			// DISCLAIMER
			{										
				content.innerHTML = template.disclaimer;										
				maxHeight2 -= content.offsetHeight;
			}
			
			// TOTAL
			{
				content.innerHTML = template.total;					
				maxHeight2 -= content.offsetHeight;
			}
			
			sXUL.console.log ("maxHeight: "+ maxHeight);
			sXUL.console.log ("maxHeight2: "+ maxHeight2);
			
			
			// CUSTOMERINFO
			{
				var customerInfo = "";					
				customerInfo += main.current.customer.name +"<br>";
				customerInfo += main.current.customer.address1 +"<br>";
				
				if (main.current.customer.address2 != "")
				{
					customerInfo += main.current.customer.address1 +"<br>";					
				}
				
				customerInfo += main.current.customer.postcode +" "+ main.current.customer.city +"<br><br>";
				
				customerInfo += "Kunde nr. "+ main.current.customer.no +"<br><br>"
				
				customerInfo += "Tlf. "+ main.current.customer.phone +"<br>";
				customerInfo += "Email "+ main.current.customer.email +"<br><br>";
				
				customerInfo += "Sag: "+ main.current.title +"<br><br>";
				
				render = render.replace ("%%CUSTOMERINFO%%", customerInfo);					
				content.innerHTML = render;
			}
			
			// CUSTOMERBANKACCOUNT
			{
				render = render.replace ("%%CUSTOMERBANKACCOUNT%%", main.current.customer.bankregistrationno +" "+ main.current.customer.bankaccountno);
				content.innerHTML = render;
			}
			
			// ROWS
			{
				// Add data rows.
				var rows = "";	
				var count = 0;				
				for (var idx = from; idx < items.length; idx++)
				{							
					var row = template.row;
					
					if (items[idx].bidamount != "0.00")
					{
				
					// CATALOGNO						
					{
						row = row.replace ("%%CATALOGNO%%", items[idx].catalogno);
					}			
				
					// DESCRIPTION
					{
						row = row.replace ("%%DESCRIPTION%%", items[idx].description);
					}		
				
					// BIDAMOUNT
					{
						row = row.replace ("%%BIDAMOUNT%%", items[idx].bidamount);
					}
				
					// COMMISSIONFEE
					{
						row = row.replace ("%%COMMISSIONFEE%%", items[idx].commissionfee);
					}					

					content.innerHTML = render.replace ("%%ROWS%%", rows + row);
																											
					if (content.offsetHeight > (maxHeight2))
					{						
						render = render.replace ("%%ROWS%%", rows);															
						render = render.replace ("%%TRANSFER%%", template.transfer)
						render = render.replace ("%%TOTAL%%", "");		
						render = render.replace ("%%DISCLAIMER%%", "");							
						content.innerHTML = render;
						break;	
					}
																		
					totalSale += parseInt (items[idx].bidamount);
					totalCommissionFee += parseInt (items[idx].commissionfee);
					totalTotal = totalSale + totalCommissionFee;				
					
					rows += row;
					}
																	
					count++;						
				}																		
				
				render = render.replace ("%%ROWS%%", rows);
				render = render.replace ("%%TRANSFER%%", "");
				
				content.innerHTML = render;
			}
			
			// TOTAL
			{
				render = render.replace ("%%TOTAL%%", template.total);
				render = render.replace ("%%TOTALSALE%%", totalSale.toFixed (2));
				render = render.replace ("%%TOTALCOMMISSIONFEE%%", totalCommissionFee.toFixed (2));
				render = render.replace ("%%TOTALTOTAL%%", (totalSale + totalCommissionFee).toFixed (2));
				content.innerHTML = render;
			}				
											
			// DISCLAIMER
			{
				render = render.replace ("%%DISCLAIMER%%", template.disclaimer);
				content.innerHTML = render;
			}
			
			return count;				
		}
																																																
		var c = 0;				
		while (c < items.length)
		{							
		 	c += page (c);				 				
		}		
					
		var settings = PrintUtils.getPrintSettings ();
																																								
		settings.marginLeft = 0.5;
		settings.marginRight = 0.5;
		settings.marginTop = 0.5;
		settings.marginBottom = 0.5;
		settings.shrinkToFit = true;
		
		settings.paperName =  "iso_a4";
		settings.paperWidth = "210.00";
		settings.paperHeight = "297.00";

//			settings.printSilent = true;
//			settings.printToFile = true;
//			settings.toFileName = "/home/rvp/test.pdf";

		sXUL.tools.print (print.contentWindow, settings);				
	}
}

// ----------------------------------------------------------------------------------------------------------
// | EVENTHANDLERS																							|
// ----------------------------------------------------------------------------------------------------------
var eventHandlers =
{			
	// ------------------------------------------------------------------------------------------------------
	// | ONCASEDESTROY																						|	
	// ------------------------------------------------------------------------------------------------------
	onCaseDestroy : function (eventData)
	{
		if (main.current.id == eventData.id)
		{
			main.close (true);
		}
	},

	// ------------------------------------------------------------------------------------------------------
	// | ONITEMCREATE																						|	
	// ------------------------------------------------------------------------------------------------------
	onItemCreate : function (eventData)
	{			
		if (main.case.id == eventData.caseid)
		{
			items.itemsTreeHelper.addRow ({data: eventData});
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONITEMSAVE																							|	
	// ------------------------------------------------------------------------------------------------------
	onItemSave : function (eventData)
	{			
		if (main.case.id == eventData.caseid)
		{
			items.itemsTreeHelper.setRow ({data: eventData});
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONITEMDESTROY																						|	
	// ------------------------------------------------------------------------------------------------------
	onItemDestroy : function (eventData)
	{			
		items.itemsTreeHelper.removeRow ({id: eventData.id});
	}
}