Components.utils.import("resource://didius/js/app.js");

var main = 
{
	init : function ()
	{				
			var items = didius.item.list ({auction: main.current});			
			SNDK.tools.sortArrayHash (items, "catalogno", "numeric");
			
			
			
			var blabla = getfile ("chrome://didius/content/templates/cataloglarge.tpl")
			//var blabla = getfile ("chrome://didius/content/templates/catalogsmall.tpl")
			
			var template = {};
			
			template.page = "";
			template.row = "";
			template.styles = "";
			
			blabla = blabla.split ("\n");
			
			var inloop = false;
			var block = "";
			for (idx in blabla)
			{
				if (blabla[idx].substring(0,2) == "//")
				{					
					continue;
				}
				
				if (block == "")
				{
					if (blabla[idx] == "#BEGINROWS")
					{
						block = "rows";
						continue;
					}
					
					if (blabla[idx] == "#BEGINSTYLES")
					{
						block = "styles";
						continue;
					}
				}
				
				if (blabla[idx] == "#ENDSTYLES")
				{
					block = "";
					continue;
				}
																									
				if (blabla[idx] == "#ENDROWS")
				{
					block = "";
					continue;
				}
			
				if (block == "")
				{
					template.page += blabla[idx] +"\n";
				}
				else if (block == "styles")
				{
					template.styles += blabla[idx] +"\n";
				}							
				else if (block == "rows")
				{
					template.row += blabla[idx] +"\n";
				}							
			}
																								
			printtest = true;
			
			if (printtest)
			{
				var pageCount = 1;			
				var print = document.getElementById ("printframe").contentDocument;
																
				var page = function (from)
				{
					// Add styles.																		
					var styles = print.createElement ("style");					
					print.body.appendChild (styles);					
					styles.innerHTML = template.styles;
				
					// Create page.				
					var page = print.createElement ("div");
					page.className = "Page A4";
					print.body.appendChild (page);
																									
					// Add content holder.																						
					var content = print.createElement ("div")
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
					
					// Add data rows.																																					
					for (var idx = from; idx < items.length; idx++)
					{							
						var row = template.row;
												
						var case_ = didius.case.load (items[idx].caseid);
						var customer = didius.customer.load (case_.customerid)
						
						// Replace template placeholders.
						row = row.replace ("%%AUCTIONDATE%%", ""); // AuctionDate						
						
						row = row.replace ("%%CATALOGNO%%", items[idx].catalogno); // CatalogNo
						row = row.replace ("%%DESCRIPTION%%", items[idx].description); // Description						
						
						row = row.replace ("%%APPRAISAL1%%", items[idx].appraisal1); // Appraisal1
						row = row.replace ("%%APPRAISAL2%%", items[idx].appraisal2); // Appraisal2
						row = row.replace ("%%APPRAISAL3%%", items[idx].appraisal3); // Appraisal3
						row = row.replace ("%%MINIMUMBID%%", items[idx].minimumbid); // Minimumbid
						
						row = row.replace ("%%CUSTOMERNAME%%", customer.name); // CustomerName						
						row = row.replace ("%%CUSTOMERNO%%", customer.no); // CustomerNo
						row = row.replace ("%%CUSTOMERPHONE%%", customer.phone); // CustomerPhome
						row = row.replace ("%%CUSTOMEREMAIL%%", customer.email); // CustomerEmail
									
						// Test if rows fit inside maxheight of page.																																																																																																																											
						dummy += row;						
						content.innerHTML = page2.replace ("%%ROWS%%", dummy);
																	
						// If rows exceed, use last amount of rows that fit.
						sXUL.console.log (content.offsetHeight);
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
					sXUL.console.log (c)
				 	c += page (c);				 				
				}				
			}
									
//	console.log (maxHeight);

//	for (i=0; i<175; i++)
//	{
//		var e1 = document.createElement ("div");
//		e1.className = "row";
//		e1.innerHTML = "Line "+i		
		
//		content.appendChild (e1);
		
//		height += e1.offsetHeight


//		if (height > maxHeight)
//		{
		

//			height = 0;
//			console.log ("break at: "+ i)
//						break;
//		}
		
//		console.log (e1.offsetHeight);
//	}			
			
						   
//		<div id="container" style="width: 210mm; height: 287mm; page-break-after:always; display: block; background: #aaa;">
//			<div id="header" style="height: 60px; text-align: center;";>
//				Auktionskatalog, Waldemarsvej 1, 4296 Nyrup Sjælland<br>
//				lørdag, 05. maj 2012								
//			</div>
//			
//			<div id="content">
//				
//			</div>
//			
//			<div id="footer" style="height: 20px; padding-top: 20px; text-align: center;">
//				Tilmeld dig vores nyhedsmail på www.york-auktion.dk, så for du automatisk besked om næste auktion<br>
//				Side 1
//			</div>
//		</divs>						   						   						   
						   
						   
			
			
//			var table = doc.createElement ("table");
//			table.style.width = "210mm";
//			table.style.height = "297mm";
//			table.style.border = "solid";
//			table.style.pageBreakAfter = "always";
			
//			for (i=0; i<5; i++)
//			{
//				var row = doc.createElement ("tr");
//				
//				var cell = doc.createElement ("td");
//				cell.innerHTML = "Bla bla bla"
//				row.appendChild (cell)
//				
//				table.appendChild (row);
//			}
//			
//			doc.body.appendChild (table);

			
		///	netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			
  // 			var nsIPrintSettings = Components.classes["@mozilla.org/gfx/printsettings-service;1"].getService(Components.interfaces.nsIPrintSettingsService).newPrintSettings;
   			
//   			nsIPrintSettings.printSilent = true;
 //  			nsIPrintSettings.printToFile = true;
   //			nsIPrintSettings.toFileName = "/home/sundown/test_silent_print_ff.pdf";
   	//		nsIPrintSettings.outputFormat = 2;
   			
//   			var browserPrint = window.content.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIWebBrowserPrint);
//			browserPrint.print(nsIPrintSettings, null);						
									
												
																		
			//printframe.focus();
			//printframe.print();
			
				//PrintUtils.gPrintSettingsAreGlobal = true;

						
						
						
		
				var settings = PrintUtils.getPrintSettings();
				
				
				settings.headerStrLeft = "";
				settings.headerStrCenter = "";
				settings.headerStrRight = "";
				settings.footerStrLeft = "";
				settings.footerStrCenter = "";
				settings.footerStrRight = "";
				
				settings.marginLeft = 0.5;
				settings.marginRight = 0.5;
				settings.marginTop = 0.5;
				settings.marginBottom = 0.5;
				settings.shrinkToFit = true;
				
				settings.paperName =  "iso_a4";
				settings.paperWidth = "210.00";
				settings.paperHeight = "297.00";
				
				//sXUL.console.log (settings.paperWidth);				
				
    var doc = document.getElementById("printframe")
    var req = doc.contentWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor);
    var wbprint = req.getInterface(Components.interfaces.nsIWebBrowserPrint);
    
    wbprint.print(settings, null);				
				
				///ettings.setPaperName("Legal");
//				settings.headerStrRight = "bla bla ";
				
//				sXUL.console.log (gPrintSettingsAreGlobal)
			
			//PrintUtils.initPrintSettingsFromPrefs (settings, false);
			
			//ttings.docURL = "asdfasdasdfasdf";  // suppress URL on printout
			//settings.footerStrRight = " ";
		//	sXUL.console.log (settings.printSettings ())
									
//			for (index in settings)
//			{
//				sXUL.console.log (index)
//			}
			
//			PrintUtils.printPreview(document.getElementById("printframe").contentWindow)
		
	//	PrintUtils.showPageSetup ()
				
		//	PrintUtils.print (document.getElementById("printframe").contentWindow)
			
			//window.print ();
			//document.getElementById("printframe").contentWindow.print();
			
				
	}	
}
