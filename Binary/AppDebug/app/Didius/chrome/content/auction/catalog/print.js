Components.utils.import("resource://didius/js/app.js");

var main = 
{
	templateName : "internal",

	init : function ()
	{
		main.set ();					
	},
	
	set : function ()
	{
		document.getElementById ("close").disabled = false;
		document.getElementById ("print").disabled = false;
	},
	
	get : function ()
	{
		main.templateName = document.getElementById ("template").value;
	},
			
	onChange : function ()
	{
		main.get ();
	},
	
	close : function ()
	{										
		// Close window.
		window.close ();
	},
	
	print : function ()
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
			template = didius.helpers.parsePrintTemplate (sXUL.tools.fileToString ("chrome://didius/content/templates/catalogsmall.tpl"));
		}
		else if (main.templateName == "buyer")
		{
			template = didius.helpers.parsePrintTemplate (sXUL.tools.fileToString ("chrome://didius/content/templates/cataloglarge.tpl"));
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
			
			// Caluculate page maxheight for printing.										
			var maxHeight = page.offsetHeight 
															
			var count = 0;					
			var rows = "";
			var dummy = "";
			
			progressmeter.value = 0;
								
			// Add data rows.																																					
			for (var idx = from; idx < items.length; idx++)
			{						
				progressmeter.value = (idx / items.length) * 100;
					
				var row = template.row;
										
				//var case_ = didius.case.load (items[idx].caseid);
				//var customer = didius.customer.load (case_.customerid)
				
				// Replace template placeholders.
				row = row.replace ("%%AUCTIONDATE%%", ""); // AuctionDate						
				
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
							
				// Test if rows fit inside maxheight of page.																																																																																																																											
				dummy += row;						
				content.innerHTML = page2.replace ("%%ROWS%%", dummy);
															
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
		
		progressmeter.value = 100;
		
		document.getElementById ("main").hidden = false;						
		document.getElementById ("progress").hidden = true;
		
		document.getElementById ("close").disabled = false;
		document.getElementById ("print").disabled = false;
		
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
