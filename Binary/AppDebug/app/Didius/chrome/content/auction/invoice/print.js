Components.utils.import("resource://didius/js/app.js");
var Cc = Components.classes;
var Ci = Components.interfaces;
var Cu = Components.utils;
var Cr = Components.results;

var main = 
{
	current : null,

	init : function ()
	{
		try
		{
			main.current = didius.invoice.load (window.arguments[0].invoiceId);
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
	
		template = didius.helpers.parsePrintTemplate (sXUL.tools.fileToString ("chrome://didius/content/templates/invoice.tpl"));
																																				
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
			
			// AUCTIONNO
			{
				render = render.replace ("%%AUCTIONNO%%", main.current.auction.no);
				content.innerHTML = render;
			}
			
			// AUCTIONTITLE
			{
				render = render.replace ("%%AUCTIONTITLE%%", main.current.auction.title);
				content.innerHTML = render;
			}
									
			// INVOICENO
			{
				render = render.replace ("%%INVOICENO%%", main.current.no);
				content.innerHTML = render;
			}
			
			// INVOICEDATE
			{
				render = render.replace ("%%INVOICEDATE%%", main.current.createtimestamp);
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
				render = render.replace ("%%TOTALVAT%%", parseInt (main.current.vat).toFixed (2));
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
		
		if (window.arguments[0].mailto != null) 
		{
			var localDir = sXUL.tools.getLocalDirectory ();
					
    		settings.printSilent = true;
    		settings.showPrintProgress = false;
		    settings.printToFile = true;    		
    		settings.printFrameType = 1;
    		settings.outputFormat = 2;

			//sXUL.console.log (localDir.path+ "\\"+ "test.pdf");
			settings.toFileName = localDir.path + "/test.pdf";
			//settings.toFileName = "c:\\"+ main.current.id +".pdf";
			
			var onLoad = 		function (respons)
								{
									sXUL.console.log ("blablalbal")
								
									var respons = respons.replace ("\n","").split (":");
							
									switch (respons[0].toLowerCase ())
									{
										case "success":
										{											
											break;
										}
								
										default:
										{
											app.error ({errorCode: "APP00480"});
											break;
										}							
									}																			
								}
						
			var onProgress =	function (event)
								{
								
//										document.getElementById ("pictureUploadProgressmeter").value = (event.loaded / event.total) * 100;										
								};
							
			var onError =		function (event)
								{
								
									app.error ({errorCode: "APP00001"});
								};
			
			
			var test = false;
		    var listener = {
      						  onStateChange: function(aWebProgress, aRequest, aStateFlags, aStatus) 
      						  {
      						  	//sXUL.console.log (aStateFlags)
            						if (aStateFlags & Ci.nsIWebProgressListener.STATE_STOP) 
            						{
            							if (!test)
            							{
            								test = true;
        									sXUL.console.log ("SENDING");
        									sXUL.tools.fileUpload ({postUrl: didius.runtime.ajaxUrl, fieldName: "pdf", filePath: localDir.path + "/test.pdf", additionalFields: {cmd: "function", "cmd.function": "Didius.Invoice.MailTo", customerid: main.current.customer.id}, onLoad: onLoad, onProgress: onProgress, onError: onError})
        									sXUL.console.log ("SENT");
        								}
                					//sendAsyncMessage("Browser:SaveAs:Return", { type: json.type, id: json.id, referrer: json.referrer });
            						}
        						},		
        						onProgressChange : function(aWebProgress, aRequest, aCurSelfProgress, aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress) 
        						{
        						},

        // stubs for the nsIWebProgressListener interfaces which nsIWebBrowserPrint doesn't use.
        onLocationChange : function() { throw "Unexpected onLocationChange"; },
        onStatusChange     : function() { throw "Unexpected onStatusChange";     },
        onSecurityChange : function() { throw "Unexpected onSecurityChange"; }
    };
			
			
			sXUL.tools.print (print.contentWindow, settings, listener);
			
			
		}
		else
		{
			sXUL.tools.print (print.contentWindow, settings);				
		}
		
	}
}
