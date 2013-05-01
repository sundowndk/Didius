Components.utils.import("resource://didius/js/app.js");

// ----------------------------------------------------------------------------------------------------------
// | MAIN																									|
// ----------------------------------------------------------------------------------------------------------
var main = 
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	template : "large",
	auction : null,

	// ------------------------------------------------------------------------------------------------------
	// | INIT																							|	
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
	
	
		main.set ();					
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SET																							|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{
		document.getElementById ("button.close").disabled = false;
		document.getElementById ("button.print").disabled = false;
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | GET																							|	
	// ------------------------------------------------------------------------------------------------------
	get : function ()
	{
		main.template = document.getElementById ("menulist.template").value;
	},
			
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------			
	onChange : function ()
	{
		main.get ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | CLOSE																							|	
	// ------------------------------------------------------------------------------------------------------
	close : function ()
	{										
		// Close window.
		window.close ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | PRINT																							|	
	// ------------------------------------------------------------------------------------------------------
	print : function ()
	{	
		var progresswindow = app.window.open (window, "chrome://didius/content/auction/catalog/progress.xul", "didius.auction.catalog.progress."+ main.auction.id, "", {});	
										
		var workload = function ()
		{
			progresswindow.removeEventListener ("load", workload, false)
		
			var overallprogress = 0;
			var totalprogress = 1;
			
			var customers = new Array ();		
			var invoices = new Array ();
		
			var start =	function ()	
						{						
							worker1 ();
						};
								
			// Email invoice.
			var worker1 =	function ()
							{
								// Reset progressmeter #1.
								progresswindow.document.getElementById ("description1").textContent = "Udskriver ...";
								progresswindow.document.getElementById ("progressmeter1").mode = "undetermined"
								progresswindow.document.getElementById ("progressmeter1").value = 0;
																						
								var nextWorker =	function ()
													{
														// Update progressmeter #1
														overallprogress++;
														progresswindow.document.getElementById ("progressmeter1").mode = "determined"
														progresswindow.document.getElementById ("progressmeter1").value = (overallprogress / totalprogress) * 100;
																																				
														setTimeout (finish, 100);
													};
																							
								var onDone = 	function ()
												{
													nextWorker ();
												};
																																						
								didius.common.print.catalog ({printContainer: document.getElementById ("vbox.printholder"), auction: main.auction, template: main.template, onDone: onDone, progressWindow: progresswindow});
							};
																
			var finish =	function ()	
							{															
								progresswindow.close ();
							};
			
			// Start worker1;				
			setTimeout (start, 100);
		}
		
		progresswindow.addEventListener ("load", workload);		
	
	},
	
	
	printbla : function ()
	{						
				

		var items = didius.item.list ({auction: main.auction});			
		SNDK.tools.sortArrayHash (items, "catalogno", "numeric");
				
		var template = "";
		
//		if (main.templateName == "internal")
//		{
			template = didius.helpers.parsePrintTemplate (didius.settings.get ({key: "didius_template_cataloglarge"}));
			//template = didius.helpers.parsePrintTemplate (sXUL.tools.fileToString ("chrome://didius/content/templates/cataloglarge.tpl"));
//		}
//		else if (main.templateName == "buyer")
//		{
//			template = didius.helpers.parsePrintTemplate (didius.settings.get ({key: "didius_template_catalogsmall"}));
			//template = didius.helpers.parsePrintTemplate (sXUL.tools.fileToString ("chrome://didius/content/templates/catalogsmall.tpl"));
//		}
//		else if (main.templateName == "label")
//		{
//			template = didius.helpers.parsePrintTemplate (didius.settings.get ({key: "didius_template_label"}));
			//template = didius.helpers.parsePrintTemplate (sXUL.tools.fileToString ("chrome://didius/content/templates/label.tpl"));
//		}
																																		
		var pageCount = 0;			
												
//		var printDocument = document.getElementById ("printframe").contentDocument;		
		
//		var printDocument = app.mainWindow.document.createElement ("iframe");
//		app.mainWindow.document.getElementById ("PrintHolder").appendChild (print);
		
		printDocument.body.innerHTML = " ";
		
		var page = function (from)
		{		
			pageCount++;
		
			// Add styles.																		
			var styles = printDocument.createElement ("style");					
			printDocument.body.appendChild (styles);					
			styles.innerHTML = template.styles;
					
			// Create page.				
			var page = printDocument.createElement ("div");
			page.className = "A4";
			printDocument.body.appendChild (page);
			
			// Add content holder.																																												
			var content = printDocument.createElement ("div")
			content.className = "Page";
			page.appendChild (content);
																		
			// Add inital content.					
			var render = template.page;			
			content.innerHTML = render;
									
			// Caluculate page maxheight for content.			
			var headerHeight = 0;
			var footerHeight = 0;
			
			// PAGENUMBER
			{
				render = render.replace ("%%PAGENUMBER%%", pageCount);
				content.innerHTML = render;
			}
			
			// AUCTIONBEGIN
			{
				var begin = new Date (Date.parse (main.auction.begin));
				render = render.replace ("%%AUCTIONBEGIN%%", begin.getDate () +"-"+ (begin.getMonth () + 1)  +"-"+ begin.getFullYear ());
				content.innerHTML = render;
			}			
				
			// AUCTIONBEGINTIME
			{
				var begin = new Date (Date.parse (main.auction.begin));											
				
				render = render.replace ("%%AUCTIONBEGINTIME%%", SNDK.tools.padLeft (begin.getHours (), 2, "0") +":"+ SNDK.tools.padLeft (begin.getMinutes (), 2, "0"));
				content.innerHTML = render;
			}			
			
			if (printDocument.getElementById ("Header"))
			{
				headerHeight = printDocument.getElementById ("Header").offsetHeight;
			}
			
			if (printDocument.getElementById ("Footer"))
			{
				printDocument.getElementById ("Footer").id = "Footer"+ pageCount;
				footerHeight = printDocument.getElementById ("Footer"+ pageCount).offsetHeight;
			}
													
			//var maxHeight = page.offsetHeight - headerHeight - footerHeight;
			var maxHeight = page.offsetHeight;
																																																			
			var count = 0;					
			var rows = "";
			
		//	progressmeter.value = 0;
																				
			// Add data rows.																																					
			for (var idx = from; idx < items.length; idx++)
			{																			
				var item = items[idx];				
				
				var case_ = didius.case.load ({id: item.caseid});
				var row = template.row;
				
				// ITEMCATALOGNO
				{
					row = row.replace ("%%ITEMCATALOGNO%%", item.catalogno);
				}
				
				// ITEMNO
				{
					row = row.replace ("%%ITEMNO%%", item.no);
				}
				
				// ITEMDESCRIPTION
				{
					row = row.replace ("%%ITEMDESCRIPTION%%", item.description);
				}
				
				// ITEMVAT
				{
					var vat = "Ikke momsfri";
					if (item.vat)
					{					
						row = row.replace ("%%ITEMVAT%%", "Ikke momsfri");
					}
					else
					{
						row = row.replace ("%%ITEMVAT%%", "Momsfri");
					}
				}
				
				// ITEMAPPRAISAL1
				{
					row = row.replace ("%%ITEMAPPRAISAL1%%", items[idx].appraisal1);
				}
				
				// ITEMAPPRAISAL2
				{
					row = row.replace ("%%ITEMAPPRAISAL2%%", items[idx].appraisal2);
				}
				
				// ITEMAPPRAISAL3
				{
					row = row.replace ("%%ITEMAPPRAISAL3%%", items[idx].appraisal3);
				}
				
				// ITEMMINIMUMBID
				{
					row = row.replace ("%%ITEMMINIMUMBID%%", items[idx].minimumbid);
				}
				
				// CUSTOMERNAME
				{
//					row = row.replace ("%%CUSTOMERNAME%%", items[idx].case.customer.name);
				}
				
				// CUSTOMERNO
				{
//					row = row.replace ("%%CUSTOMERNO%%", items[idx].case.customer.no);
				}
				
				// CUSTOMERPHONE
				{
//					row = row.replace ("%%CUSTOMERPHONE%%", items[idx].case.customer.phone);
				}
				
				// CUSTOMEREMAIL
				{
//					row = row.replace ("%%CUSTOMEREMAIL%%", items[idx].case.customer.email);
				}
								
			
				// BID / BUYER
				
//				{
//					var bidcustomername = "";
//					var bidcustomerno = "";
//					var bidamount = "";
				
//					if (items[idx].currentbidid != SNDK.tools.emptyGuid)
//					{
//						var bid = didius.bid.load (items[idx].currentbidid);
//						
//						bidcustomername = bid.customer.name;
//						bidcustomerno = bid.customer.no;
//						bidamount = bid.amount;
//					}
					
					// BIDCUSTOMERNAME
//					{
//						row = row.replace ("%%BIDCUSTOMERNAME%%", bidcustomername);
//					}
						
					// BIDCUSTOMERNO
//					{						
//						row = row.replace ("%%BIDCUSTOMERNO%%", bidcustomerno);
//					}
						
					// BIDAMOUNT
//					{
//						row = row.replace ("%%BIDAMOUNT%%", bidamount);
//					}
//				}
																							
				// Test if rows fit inside maxheight of page.
				content.innerHTML = render.replace ("%%ROWS%%", rows + row);
				
				// If rows exceed, use last amount of rows that fit.					
				if (content.offsetHeight > maxHeight)
				{												
					content.innerHTML = render.replace ("%%ROWS%%", rows);
					break;	
				}
																
				rows += row;
				count++;	
				
				//progressmeter.value = (count / items.length) * 100;					
			}									
			
			content.style.height = maxHeight  + "px";
			
			return count;
		}
			
		
		var c = 0;				
		while (c < items.length)
		{							
		 	c += page (c);				 				
		}		
						
														
		//progressmeter.value = 100;
		
//		document.getElementById ("main").hidden = false;						
//		document.getElementById ("progress").hidden = true;
		
//		document.getElementById ("close").disabled = false;
//		document.getElementById ("print").disabled = false;
		
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

		//sXUL.tools.print (document.getElementById ("printframe").contentWindow, settings);
		
		sXUL.console.log (document.getElementById ("printframe").contentDocument.body.innerHTML)
		return
	},
	
	printold : function ()
	{				
		document.getElementById ("main").hidden = true;						
		document.getElementById ("progress").hidden = false;

		document.getElementById ("close").disabled = true;
		document.getElementById ("print").disabled = true;
		
		var progressmeter = document.getElementById ("progressmeter");

		var items = didius.item.list ({auction: main.current});			
		SNDK.tools.sortArrayHash (items, "catalogno", "numeric");
				
		var template = "";
		
		if (main.templateName == "internal")
		{
			template = didius.helpers.parsePrintTemplate (sXUL.tools.fileToString ("chrome://didius/content/templates/cataloglarge.tpl"));
		}
		else if (main.templateName == "buyer")
		{
			template = didius.helpers.parsePrintTemplate (sXUL.tools.fileToString ("chrome://didius/content/templates/catalogsmall.tpl"));
		}
		else if (main.templateName == "label")
		{
			template = didius.helpers.parsePrintTemplate (sXUL.tools.fileToString ("chrome://didius/content/templates/label.tpl"));
		}
																																		
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
			
			var hest = 0;
			if (print.contentDocument.getElementById ("PageFooter") != null)
				hest = print.contentDocument.getElementById ("PageFooter").offsetHeight;
			
			
			
			// Caluculate page maxheight for printing.										
			var maxHeight = page.offsetHeight - hest;
						
															
			var count = 0;					
			var rows = "";
			var dummy = "";
			
			progressmeter.value = 0;
								
			// Add data rows.																																					
			for (var idx = from; idx < items.length; idx++)
			{				
				var e = (idx / items.length) * 100;
			
				progressmeter.value = (idx / items.length) * 100;
					
				var row = template.row;
										
				//var case_ = didius.case.load (items[idx].caseid);
				//var customer = didius.customer.load (case_.customerid)
				
				// Replace template placeholders.
				//row = row.replace ("%%AUCTIONDATE%%", ""); // AuctionDate						
				
				row = row.replace ("%%CATALOGNO%%", items[idx].catalogno); // CatalogNo
				row = row.replace ("%%DESCRIPTION%%", items[idx].description); // Description						
				
				row = row.replace ("%%APPRAISAL1%%", items[idx].appraisal1); // Appraisal1
				row = row.replace ("%%APPRAISAL2%%", items[idx].appraisal2); // Appraisal2
				row = row.replace ("%%APPRAISAL3%%", items[idx].appraisal3); // Appraisal3
				row = row.replace ("%%MINIMUMBID%%", items[idx].minimumbid); // Minimumbid
				
				row = row.replace ("%%CUSTOMERNAME%%", items[idx].case.customer.name); // CustomerName						
				row = row.replace ("%%CUSTOMERNO%%", items[idx].case.customer.no); // CustomerNo
				row = row.replace ("%%CUSTOMERPHONE%%", items[idx].case.customer.phone); // CustomerPhome
				row = row.replace ("%%CUSTOMEREMAIL%%", items[idx].case.customer.email); // CustomerEmail
								
			
				if (items[idx].currentbidid != SNDK.tools.emptyGuid)
				{
					var bid = didius.bid.load (items[idx].currentbidid);
					row = row.replace ("%%BIDCUSTOMERNAME%%", bid.customer.name); // BIDCUSTOMERNAME
					row = row.replace ("%%BIDCUSTOMERNO%%", bid.customer.no); // BIDCUSTOMERNO
					row = row.replace ("%%BIDAMOUNT%%", bid.amount); // BIDAMOUNT
				}
				else
				{
					row = row.replace ("%%BIDCUSTOMERNAME%%", ""); // BIDCUSTOMERNAME
					row = row.replace ("%%BIDCUSTOMERNO%%", ""); // BIDCUSTOMERNO
					row = row.replace ("%%BIDAMOUNT%%", ""); // BIDAMOUNT
				}
				
								
				
				
							
				// Test if rows fit inside maxheight of page.																																																																																																																											
				dummy += row;						
				content.innerHTML = page2.replace ("%%ROWS%%", dummy);
															
				sXUL.console.log (content.offsetHeight +" "+ maxHeight)															
															
				// If rows exceed, use last amount of rows that fit.					
				if (content.offsetHeight > maxHeight)
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
		
		sXUL.console.log ("BLA BLA BLA")
		
		progressmeter.value = 100;
		
		document.getElementById ("main").hidden = false;						
		document.getElementById ("progress").hidden = true;
		
		document.getElementById ("close").disabled = false;
		document.getElementById ("print").disabled = false;
		
		var settings = PrintUtils.getPrintSettings ();
																																								
		settings.marginLeft = 0.0
		settings.marginRight = 0.0;
		settings.marginTop = 0.0;
		settings.marginBottom = 0.0;
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
