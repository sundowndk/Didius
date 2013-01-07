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
		//items.init ();
		
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
		main.checksum = SNDK.tools.arrayChecksum (main.current);												
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
	
		if ((SNDK.tools.arrayChecksum (main.current) != main.checksum))
		{
			document.title = "Sag: "+ main.current.title +" ["+ main.current.no +"] *";
		
			document.getElementById ("save").disabled = false;
			document.getElementById ("close").disabled = false;
		}
		else
		{
			document.title = "Sag: "+ main.current.title +" ["+ main.current.no +"]";
		
			document.getElementById ("save").disabled = true;
			document.getElementById ("close").disabled = false;
		}
		
		if (main.current.auction.status == "Closed")
		{	
			document.getElementById ("createSettlement").disabled = false;	
			document.getElementById ("showSettlement").disabled = false;
			
			if (main.current.settled)
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
		
		if (main.current.auction.status == "Closed" || main.current.auction.status == "Running")
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
		
		didius.case.save (main.current);
				
		main.checksum = SNDK.tools.arrayChecksum (main.current);
		main.onChange ();
		
		if (window.arguments[0].onSave != null)
		{
			window.arguments[0].onSave (main.current);
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
			if ((SNDK.tools.arrayChecksum (main.current) != main.checksum))
			{
				if (app.window.prompt.confirm ("Ændringer ikke gemt", "Der er fortaget ændringer, der ikke er gemt, vil du forsætte ?"))
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

var details = 
{
	init : function ()
	{
		details.set ();
	},
	
	set : function ()
	{
		document.getElementById ("no").value = main.current.no;
		document.getElementById ("createdate").dateValue = SNDK.tools.timestampToDate (main.current.createtimestamp);
		document.getElementById ("auction").value = main.current.auction.title;		
		document.getElementById ("customer").value = main.current.customer.name;
	
		document.getElementById ("title").value = main.current.title;		
		
		document.getElementById ("customerreference").value = main.current.customerreference;		
		document.getElementById ("commisionfeepercentage").value = main.current.commisionfeepercentage;		
		document.getElementById ("commisionfeeminimum").value = main.current.commisionfeeminimum;		
	},
	
	get : function ()	
	{
		main.current.title = document.getElementById ("title").value;		
		
		main.current.customerreference = document.getElementById ("customerreference").value;		
		main.current.commisionfeepercentage = document.getElementById ("commisionfeepercentage").value;		
		main.current.commisionfeeminimum = document.getElementById ("commisionfeeminimum").value;		
	},
	
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
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{
		main.items.itemsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("items"), sortColumn: "catalogno", sortDirection: "descending", onDoubleClick: main.items.edit});
		main.items.set ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
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
			document.getElementById ("itemCreate").disabled = true;
			document.getElementById ("itemEdit").disabled = true;
			document.getElementById ("itemDestroy").disabled = true;
					
			didius.item.list ({case: main.current, async: true, onDone: onDone});				
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | OMNCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------
	onChange : function ()
	{
		if (main.items.itemsTreeHelper.getCurrentIndex () != -1)
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
		
		if (main.current.auction.status == "Closed" || main.current.auction.status == "Running")
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
		main.items.itemsTreeHelper.sort (attributes);
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | CREATE																								|	
	// ------------------------------------------------------------------------------------------------------
	create : function ()
	{		
		// Create new item.
		var current = didius.item.create (main.current);						
		didius.item.save (current);																								
																												
		window.openDialog ("chrome://didius/content/itemedit/itemedit.xul", current.id, "chrome", {itemId: current.id});
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | EDIT																								|	
	// ------------------------------------------------------------------------------------------------------							
	edit : function ()
	{		
		var current = main.items.itemsTreeHelper.getRow ();
								
		window.openDialog ("chrome://didius/content/itemedit/itemedit.xul", current.id, "chrome", {itemId: current.id});
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | DESTROY																							|	
	// ------------------------------------------------------------------------------------------------------
	destroy : function ()
	{
		var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
		var result = prompts.confirm (null, "Slet effekt", "Er du sikker på du vil slette denne effekt ?");
		
		if (result)
		{
			try
			{
				// Get row currently selected and delete the item underneath.
				didius.item.destroy (main.items.itemsTreeHelper.getRow ().id);															
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
		window.openDialog ("chrome://didius/content/case/salesagreement/show.xul", "salesagreement-"+ main.current.id, "chrome", {caseId: main.current.id});
	}			
}

// ----------------------------------------------------------------------------------------------------------
// | SETTLEMENT																								|
// ----------------------------------------------------------------------------------------------------------
settlement :
{	
	// ------------------------------------------------------------------------------------------------------
	// | CREATE																								|	
	// ------------------------------------------------------------------------------------------------------
	create : function ()
	{
		var onApprove = function ()
						{
							main.current.settled = true;
							main.checksum = SNDK.tools.arrayChecksum (main.current);
							main.onChange ();
						};
				
		window.openDialog ("chrome://didius/content/case/settlement/create.xul", "settlement-"+ main.current.id, "chrome, modal", {caseId: main.current.id, onApprove: onApprove});
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SHOW																								|	
	// ------------------------------------------------------------------------------------------------------
	show : function ()
	{								
		window.openDialog ("chrome://didius/content/case/settlement/show.xul", "settlement-"+ main.current.id, "chrome", {caseId: main.current.id});
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
		if (main.current.id == eventData.caseid)
		{
			main.items.itemsTreeHelper.addRow ({data: eventData});
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONITEMSAVE																							|	
	// ------------------------------------------------------------------------------------------------------
	onItemSave : function (eventData)
	{			
		if (main.current.id == eventData.caseid)
		{
			main.items.itemsTreeHelper.setRow ({data: eventData});
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONITEMDESTROY																						|	
	// ------------------------------------------------------------------------------------------------------
	onItemDestroy : function (eventData)
	{			
		main.items.itemsTreeHelper.removeRow ({id: eventData.id});
	}
}