Components.utils.import("resource://didius/js/app.js");

var main = 
{
	current : null,

	init : function ()
	{
		try
		{
			main.current = didius.settlement.load (window.arguments[0].settlementId);
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}								
		
		try
		{
			main.print ();
		}
		catch (exception)
		{
			sXUL.console.log (exception);
		}
		main.close ();
	},
					
	close : function ()
	{										
		// Close window.
		window.close ();
	},
	
	print : function ()
	{					
		//var items = didius.item.list ({case: main.current});		
		var items = new Array ();	
							
		//SNDK.tools.sortArrayHash (items, "catalogno", "numeric");
			
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
			
			
			// CUSTOMERNAME
			{
				render = render.replace ("%%CUSTOMERNAME%%", main.current.customer.name);
				content.innerHTML = render;
			}
			
			// CUSTOMERADDRESS
			{
				var customeraddress = main.current.customer.address1;
				
				if (main.current.customer.address2 != "")
				{
					address += "<br>"+ main.current.customer.address2;
				}
			
				render = render.replace ("%%CUSTOMERADDRESS%%", customeraddress);
				content.innerHTML = render;
			}
			
			// POSTCODE
			{
				render = render.replace ("%%CUSTOMERPOSTCODE%%", main.current.customer.postcode);
				content.innerHTML = render;
			}
			
			// CUSTOMERCITY
			{
				render = render.replace ("%%CUSTOMERCITY%%", main.current.customer.city);
				content.innerHTML = render;
			}
			
			// CUSTOMERCOUNTRY
			{
				render = render.replace ("%%CUSTOMERCOUNTRY%%", main.current.customer.country);
				content.innerHTML = render;
			}
			
			// CUSTOMERNO
			{
				render = render.replace ("%%CUSTOMERNO%%", main.current.customer.no);
				content.innerHTML = render;
			}
			
			// CUSTOMERPHONE
			{
				render = render.replace ("%%CUSTOMERPHONE%%", main.current.customer.phone);
				content.innerHTML = render;
			}
			
			// CUSTOMEREMAIL
			{
				render = render.replace ("%%CUSTOMEREMAIL%%", main.current.customer.email);
				content.innerHTML = render;
			}
			
			// CASENO
			{
				render = render.replace ("%%CASENO%%", main.current.case.no);
				content.innerHTML = render;
			}
			
			// CASETITLE
			{
				render = render.replace ("%%CASETITLE%%", main.current.case.title);
				content.innerHTML = render;
			}
						
			// CUSTOMERINFO
	//		{
	//			var customerInfo = "";					
	//			customerInfo += main.current.customer.name +"<br>";
	//			customerInfo += main.current.customer.address1 +"<br>";
	//			
	//			if (main.current.customer.address2 != "")
	//			{
	//				customerInfo += main.current.customer.address1 +"<br>";					
	//			}
	//			
////				customerInfo += main.current.customer.postcode +" "+ main.current.customer.city +"<br><br>";
//				
//				customerInfo += "Kunde nr. "+ main.current.customer.no +"<br><br>"
//				
//				customerInfo += "Tlf. "+ main.current.customer.phone +"<br>";
//				customerInfo += "Email "+ main.current.customer.email +"<br><br>";
//				
//				customerInfo += "Sag: "+ main.current.case.title +"<br><br>";
//				
//				render = render.replace ("%%CUSTOMERINFO%%", customerInfo);					
//				content.innerHTML = render;
//			}
			
			// SETTLEMENTNO
			{
				render = render.replace ("%%SETTLEMENTNO%%", main.current.no);
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
										
				for (var idx = from; idx < main.current.items.length; idx++)
				{							
					var row = template.row;
					
					// CATALOGNO						
					{
						row = row.replace ("%%CATALOGNO%%", main.current.items[idx].catalogno);
					}			
				
					// DESCRIPTION
					{
						row = row.replace ("%%DESCRIPTION%%", main.current.items[idx].description);
					}		
				
					// BIDAMOUNT
					{
						row = row.replace ("%%BIDAMOUNT%%", main.current.items[idx].bidamount);
					}
				
					// COMMISSIONFEE
					{
						row = row.replace ("%%COMMISSIONFEE%%", main.current.items[idx].commissionfee);
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
																		
					rows += row;																	
					count++;						
				}																		
				
				render = render.replace ("%%ROWS%%", rows);
				render = render.replace ("%%TRANSFER%%", "");
				
				content.innerHTML = render;
			}
			
			// TOTAL
			{
				render = render.replace ("%%TOTAL%%", template.total);
				render = render.replace ("%%TOTALSALE%%", parseInt (main.current.sales).toFixed (2));
				render = render.replace ("%%TOTALCOMMISSIONFEE%%", parseInt (main.current.commissionfee).toFixed (2));
				render = render.replace ("%%TOTALTOTAL%%", parseInt (main.current.total).toFixed (2));
				content.innerHTML = render;
			}				
											
			// DISCLAIMER
			{
				render = render.replace ("%%DISCLAIMER%%", template.disclaimer);
				content.innerHTML = render;
			}
			
			return count;				
		}
																																																
		var c = page (0);
		while (c < main.current.items.length)
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
