Components.utils.import("resource://didius/js/app.js");

var main =
{
	checksum : null,
	current : null,

	init : function ()
	{	 	
		try
		{
			main.current = didius.case.load (window.arguments[0].caseId);
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}								
	
		main.set ();
		
		// Hook events.
		app.events.onCaseDestroy.addHandler (main.eventHandlers.onCaseDestroy);
		
		app.events.onItemCreate.addHandler (main.eventHandlers.onItemCreate);
		app.events.onItemSave.addHandler (main.eventHandlers.onItemSave);
		app.events.onItemDestroy.addHandler (main.eventHandlers.onItemDestroy);
	},
	
	eventHandlers :
	{
		onCaseDestroy : function (eventData)
		{
			if (main.current.id == eventData.id)
			{
				main.close (true);
			}
		},
	
		onItemCreate : function (eventData)
		{			
			if (main.current.id == eventData.caseid)
			{
				main.items.itemsTreeHelper.addRow ({data: eventData});
			}
		},
		
		onItemSave : function (eventData)
		{			
			if (main.current.id == eventData.caseid)
			{
				main.items.itemsTreeHelper.setRow ({data: eventData});
			}
		},
		
		onItemDestroy : function (eventData)
		{			
			main.items.itemsTreeHelper.removeRow ({id: eventData.id});
		}
	},
		
	set : function ()
	{
		main.checksum = SNDK.tools.arrayChecksum (main.current);
	
		document.getElementById ("no").value = main.current.no;
		document.getElementById ("createdate").dateValue = SNDK.tools.timestampToDate (main.current.createtimestamp);
		document.getElementById ("auction").value = main.current.auction.title;		
		document.getElementById ("customer").value = main.current.customer.name;
	
		document.getElementById ("title").value = main.current.title;		
		
		document.getElementById ("customerreference").value = main.current.customerreference;		
		document.getElementById ("preparationfee").value = main.current.preparationfee;		
		document.getElementById ("commisionfeepercentage").value = main.current.commisionfeepercentage;		
		document.getElementById ("commisionfeeminimum").value = main.current.commisionfeeminimum;		
		
		main.items.init ();
							
		main.onChange ();
	},
	
	get : function ()
	{
		main.current.title = document.getElementById ("title").value;		
		
		main.current.customerreference = document.getElementById ("customerreference").value;		
		main.current.preparationfee = document.getElementById ("preparationfee").value;		
		main.current.commisionfeepercentage = document.getElementById ("commisionfeepercentage").value;		
		main.current.commisionfeeminimum = document.getElementById ("commisionfeeminimum").value;		
	},
	
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
		app.events.onCaseDestroy.removeHandler (main.eventHandlers.onCaseDestroy);
		
		app.events.onItemCreate.removeHandler (main.eventHandlers.onItemCreate);
		app.events.onItemSave.removeHandler (main.eventHandlers.onItemSave);
		app.events.onItemDestroy.removeHandler (main.eventHandlers.onItemDestroy);
	
		// Close window.
		window.close ();
	},
	
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
		
		document.getElementById ("settle").disabled = false;
		document.getElementById ("printSettlement").disabled = false;
		
		if (main.current.settled)
		{
			document.getElementById ("settleBox").collapsed = true;
			document.getElementById ("printSettlementBox").collapsed = false;
		}
		else		
		{
			document.getElementById ("settleBox").collapsed = false;
			document.getElementById ("printSettlementBox").collapsed = true;
		}
	},
			
	items :
	{
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
				document.getElementById ("itemCreate").disabled = true;
				document.getElementById ("itemEdit").disabled = true;
				document.getElementById ("itemDestroy").disabled = true;
						
				didius.item.list ({case: main.current, async: true, onDone: onDone});				
		},
		
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
		},
		
		sort : function (attributes)
		{
			main.items.itemsTreeHelper.sort (attributes);
		},
			
		create : function ()
		{		
			// Create new item.
			var current = didius.item.create (main.current);						
			didius.item.save (current);																								
																													
			window.openDialog ("chrome://didius/content/itemedit/itemedit.xul", current.id, "chrome", {itemId: current.id});
		},
									
		edit : function ()
		{		
			var current = main.items.itemsTreeHelper.getRow ();
									
			window.openDialog ("chrome://didius/content/itemedit/itemedit.xul", current.id, "chrome", {itemId: current.id});
		},
		
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
	},
	
	settlement :
	{	
		create : function ()
		{
			window.openDialog ("chrome://didius/content/case/settlement/create.xul", "settlement-"+ main.current.id, "chrome, modal", {caseId: main.current.id});
		},
		
		print : function ()
		{					
			var items = didius.item.list ({case: main.current});			
					
			
			SNDK.tools.sortArrayHash (items, "catalogno", "numeric");
				
			var template = "";
		
			template = didius.helpers.parsePrintTemplate (sXUL.tools.fileToString ("chrome://didius/content/templates/settlement.tpl"));
																																					
			var pageCount = 1;			
												
			var print = document.getElementById ("printframe");
		
			print.contentDocument.body.innerHTML = " ";						
															
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
				var page2 = template.page.replace ("%%PAGENUMBER%%", pageCount++);					
				content.innerHTML = page2;
			
				// Caluculate page maxheight for printing.										
				var maxHeight = page.offsetHeight 
															
				var count = 0;					
				var rows = "";
				var dummy = "";
			
				//progressmeter.value = 0;
				
				content.innerHTML = template.page.replace ("%%DISCLAIMER%%", template.disclaimer);
				var disclaimerHeight = (content.offsetHeight);
				content.innerHTML = " ";
				
				content.innerHTML = content.innerHTML + template.total;
				var totalHeight = (content.offsetHeight);
				content.innerHTML = " ";
				
				
				var offset2 = disclaimerHeight + totalHeight;
				
				sXUL.console.log (disclaimerHeight)
				sXUL.console.log (totalHeight)

				
				
				{
//					content.innerHTML

					var customerinfo = "";
					
					customerinfo += main.current.customer.name +"<br>";
					customerinfo += main.current.customer.address1 +"<br>";
					
					if (main.current.customer.address2 != "")
					{
						customerinfo += main.current.customer.address1 +"<br>";					
					}
					
					customerinfo += main.current.customer.postcode +" "+ main.current.customer.city +"<br><br>";
					
					customerinfo += "Kunde nr. "+ main.current.customer.no +"<br><br>"
					
					customerinfo += "Tlf. "+ main.current.customer.phone +"<br>";
					customerinfo += "Email "+ main.current.customer.email +"<br><br>";
					
					customerinfo += "Sag: "+ main.current.title +"<br><br>";
					
					page2 = page2.replace ("%%CUSTOMERINFO%%", customerinfo);
								
					page2 = page2.replace ("%%CUSTOMERBANKACCOUNT%%", main.current.customer.bankregistrationno +" "+ main.current.customer.bankaccountno);
				}
				
								
				
//				content.innerHTML = " ";
												
				// Add data rows.				
				var maxrows = 20;			
				for (var idx = from; idx < items.length; idx++)
				{						
					//progressmeter.value = (idx / items.length) * 100;
						
					var row = template.row;
											
					//var case_ = didius.case.load (items[idx].caseid);
					//var customer = didius.customer.load (case_.customerid)
					
					// Replace template placeholders.
					row = row.replace ("%%CATALOGNO%%", items[idx].catalogno); // CatalogNo
					row = row.replace ("%%DESCRIPTION%%", items[idx].description); // Description						
					
					
					//row = row.replace ("%%BIDAMOUNT%%", items[idx].); // AmountBid
					row = row.replace ("%%COMMISSIONFEE%%", items[idx].commissionfee); // CommissionFee
								
					// Test if rows fit inside maxheight of page.																																																																																																																											
					dummy += row;						
					content.innerHTML = page2.replace ("%%ROWS%%", dummy);
					
//					if (idx == (items.length - 1))
//					{
//						content.innerHTML = content.innerHTML + template.total;
//					}
					
//					content.innerHTML = content.innerHTML.replace ("%%DISCLAIMER%%", template.disclaimer);
														
//					if (maxrows == 0)
//					{
//						break;
//					}		
					
//					maxrows--;									
							
					
					// If rows exceed, use last amount of rows that fit.																	
					if (content.offsetHeight > (maxHeight - offset2))
					{							
						content.innerHTML = page2.replace ("%%ROWS%%", rows);												
						break;	
					}
															
					rows += row;
					count++;						
				}									
			
				return count;
			}
				
			var c = 0;				
			while (c < items.length)
			{							
			 	c += page (c);				 				
			}		
			
		
			
			//progressmeter.value = 100;
			
//			document.getElementById ("main").hidden = false;						
//			document.getElementById ("progress").hidden = true;
			
//			document.getElementById ("close").disabled = false;
//			document.getElementById ("print").disabled = false;
			
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
}