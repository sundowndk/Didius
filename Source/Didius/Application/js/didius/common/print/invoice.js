invoice : function (attributes)
{	
	var Cc = Components.classes;
	var Ci = Components.interfaces;
	var Cu = Components.utils;
	var Cr = Components.results;

	var render = 	function (attributes)
					{
						var template = didius.helpers.parsePrintTemplate (sXUL.tools.fileToString ("chrome://didius/content/templates/invoice.tpl"));										
						var print = app.mainWindow.document.createElement ("iframe");
						app.mainWindow.document.getElementById ("PrintHolder").appendChild (print);
												
						var pageCount = 1;				
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
							
				//			sXUL.console.log ("maxHeight: "+ maxHeight);
				//			sXUL.console.log ("maxHeight2: "+ maxHeight2);			
							
							// CUSTOMERNAME
							{
								render = render.replace ("%%CUSTOMERNAME%%", attributes.invoice.customer.name);
								content.innerHTML = render;
							}
					
							// CUSTOMERADDRESS
							{
								var customeraddress = attributes.invoice.customer.address1;
								
								if (attributes.invoice.customer.address2 != "")
								{
									address += "<br>"+ attributes.invoice.customer.address2;
								}
							
								render = render.replace ("%%CUSTOMERADDRESS%%", customeraddress);
								content.innerHTML = render;
							}
							
							// POSTCODE
							{
								render = render.replace ("%%CUSTOMERPOSTCODE%%", attributes.invoice.customer.postcode);
								content.innerHTML = render;
							}
							
							// CUSTOMERCITY
							{
								render = render.replace ("%%CUSTOMERCITY%%", attributes.invoice.customer.city);
								content.innerHTML = render;
							}
							
							// CUSTOMERCOUNTRY
							{
								render = render.replace ("%%CUSTOMERCOUNTRY%%", attributes.invoice.customer.country);
								content.innerHTML = render;
							}
							
							// CUSTOMERNO
							{
								render = render.replace ("%%CUSTOMERNO%%", attributes.invoice.customer.no);
								content.innerHTML = render;
							}
							
							// CUSTOMERPHONE
							{
								render = render.replace ("%%CUSTOMERPHONE%%", attributes.invoice.customer.phone);
								content.innerHTML = render;
							}
							
							// CUSTOMEREMAIL
							{
								render = render.replace ("%%CUSTOMEREMAIL%%", attributes.invoice.customer.email);
								content.innerHTML = render;
							}
							
							// AUCTIONNO
							{
								render = render.replace ("%%AUCTIONNO%%", attributes.invoice.auction.no);
								content.innerHTML = render;
							}
							
							// AUCTIONTITLE
							{
								render = render.replace ("%%AUCTIONTITLE%%", attributes.invoice.auction.title);
								content.innerHTML = render;
							}
													
							// INVOICENO
							{
								render = render.replace ("%%INVOICENO%%", attributes.invoice.no);
								content.innerHTML = render;
							}
							
							// INVOICEDATE
							{
								render = render.replace ("%%INVOICEDATE%%", attributes.invoice.createtimestamp);
								content.innerHTML = render;
							}
							
							// CUSTOMERBANKACCOUNT
							{
								render = render.replace ("%%CUSTOMERBANKACCOUNT%%", attributes.invoice.customer.bankregistrationno +" "+ attributes.invoice.customer.bankaccountno);
								content.innerHTML = render;
							}
					
							// ROWS
							{
								// Add data rows.
								var rows = "";	
								var count = 0;
														
								for (var idx = from; idx < attributes.invoice.items.length; idx++)
								{							
									var row = template.row;
									
									// CATALOGNO						
									{
										row = row.replace ("%%CATALOGNO%%", attributes.invoice.items[idx].catalogno);
									}			
								
									// DESCRIPTION
									{
										row = row.replace ("%%DESCRIPTION%%", attributes.invoice.items[idx].description);
									}		
								
									// BIDAMOUNT
									{
										row = row.replace ("%%BIDAMOUNT%%", attributes.invoice.items[idx].bidamount);
									}
								
									// COMMISSIONFEE
									{
										row = row.replace ("%%COMMISSIONFEE%%", attributes.invoice.items[idx].commissionfee);
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
								render = render.replace ("%%TOTALSALE%%", parseInt (attributes.invoice.sales).toFixed (2));
								render = render.replace ("%%TOTALCOMMISSIONFEE%%", parseInt (attributes.invoice.commissionfee).toFixed (2));
								render = render.replace ("%%TOTALVAT%%", parseInt (attributes.invoice.vat).toFixed (2));
								render = render.replace ("%%TOTALTOTAL%%", parseInt (attributes.invoice.total).toFixed (2));
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
						while (c < attributes.invoice.items.length)
						{							
						 	c += page (c);				 				
						}	
				
						var result = print.contentDocument.body.innerHTML;
						
						app.mainWindow.document.getElementById ("PrintHolder").removeChild (print);
						
						return result;
					};

	var data = "";
																			
	if (attributes.invoice)
	{
		data = render ({invoice: attributes.invoice});
	}
	else if (attributes.invoices)
	{
		for (index in attributes.invoices)
		{
			data += render ({invoice: attributes.invoices[index]});
		}			
	}
	
	//var template = didius.helpers.parsePrintTemplate (sXUL.tools.fileToString ("chrome://didius/content/templates/invoice.tpl"));										
	var print = app.mainWindow.document.createElement ("iframe");
	app.mainWindow.document.getElementById ("PrintHolder").appendChild (print);
		
	print.contentDocument.body.innerHTML = data;
					
	var settings = PrintUtils.getPrintSettings ();
																																								
	settings.marginLeft = 0.5;
	settings.marginRight = 0.5;
	settings.marginTop = 0.5;
	settings.marginBottom = 0.0;
	settings.shrinkToFit = true;
		
	settings.paperName =  "iso_a4";
	settings.paperWidth = 210;
	settings.paperHeight = 297
	settings.paperSizeUnit = Ci.nsIPrintSettings.kPaperSizeMillimeters;
		
	if (attributes.mail) 
	{
		var localDir = sXUL.tools.getLocalDirectory ();
		//var filename = localDir.path + app.session.pathSeperator +"temp"+ app.session.pathSeperator + main.current.id;
		var filename = localDir.path + app.session.pathSeperator + main.current.id +".pdf";
		//var filename = "F:\\test.pdf";
					
    	settings.printSilent = true;
    	settings.showPrintProgress = false;
	    settings.printToFile = true;    		
		    		    		    		   
    	//settings.printFrameType = 1;
    		
    	settings.outputFormat = 2;
    		
		settings.printSilent = true;
    	settings.showPrintProgress = false;
    	settings.printBGImages = true;
    	settings.printBGColors = true;
    	settings.printToFile = true;
    
    	settings.printFrameType = Ci.nsIPrintSettings.kFramesAsIs;
    	settings.outputFormat = Ci.nsIPrintSettings.kOutputFormatPDF;
    
    	settings.footerStrCenter = "";
    	settings.footerStrLeft = "";
    	settings.footerStrRight = "";
    	settings.headerStrCenter = "";
    	settings.headerStrLeft = "";
    	settings.headerStrRight = "";
    	settings.printBGColors = true;
    	settings.title = "Didius Invoice";    		

		settings.toFileName = filename;
			
		sXUL.console.log (filename)
			
		var onDone =	function ()
						{
							var onLoad = 		function (respons)
												{														
													var respons = respons.replace ("\n","").split (":");
																				
													switch (respons[0].toLowerCase ())
													{
														case "success":
														{	
															try
															{
																sXUL.tools.fileDelete (filename);
															}
															catch (e)
															{
																sXUL.console.log (e);
															}
																															
															break;
														}
									
														default:
														{
															app.error ({errorCode: "APP00001"});																
															break;
														}							
													}
														
													onDone ();
												};
					
							var onProgress =	function (event)
												{															
												};
							
							var onError =		function (event)
												{														
													app.error ({errorCode: "APP00001"});
													onDone ();
												};
													
							var onDone = 		function ()							
												{
													sXUL.console.log ("ondone");
													if (attributes.onDone != null)
													{
														setTimeout (attributes.onDone, 1);
													}
												}
												
							var worker = function ()
							{																
								sXUL.tools.fileUpload ({postUrl: didius.runtime.ajaxUrl, fieldName: "file", filePath: filename, additionalFields: {cmd: "function", "cmd.function": "Didius.Helpers.MailInvoice", invoiceid: attributes.invoice.id, customerid: attributes.invoice.customerid, auctionid: attributes.invoice.auctionid}, onLoad: onLoad, onProgress: onProgress, onError: onError});
								//sXUL.tools.fileUpload ({postUrl: didius.runtime.ajaxUrl, fieldName: "file", filePath: filename, additionalFields: {cmd: "function", "cmd.function": "Didius.Helpers.MailInvoice", invoiceid: attributes.invoice.id}, onLoad: onLoad, onProgress: onProgress, onError: onError});
							}
							
							setTimeout (worker, 5000);																																
						};
			
		sXUL.tools.print (print.contentWindow, settings, onDone);
	}
	else
	{
		var onDone =	function ()
						{
							if (attributes.onDone != null)
							{
								setTimeout (attributes.onDone, 1);
							}
						};
	
		sXUL.tools.print (print.contentWindow, settings, onDone);				
	}		
}
