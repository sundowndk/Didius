creditnote : function (attributes)
{	
	var Cc = Components.classes;
	var Ci = Components.interfaces;
	var Cu = Components.utils;
	var Cr = Components.results;

	var render = 	function (attributes)
					{											
						attributes.customer = didius.customer.load (attributes.creditnote.customerid);
					
						var template = didius.helpers.parsePrintTemplate (didius.settings.get ({key: "didius_template_creditnote"}));
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
								render = render.replace ("%%CUSTOMERNAME%%", attributes.customer.name);
								content.innerHTML = render;
							}
					
							// CUSTOMERADDRESS
							{
								var customeraddress = attributes.customer.address1;
								
								if (attributes.customer.address2 != "")
								{
									customeraddress += "<br>"+ attributes.customer.address2;
								}
							
								render = render.replace ("%%CUSTOMERADDRESS%%", customeraddress);
								content.innerHTML = render;
							}
							
							// POSTCODE
							{
								render = render.replace ("%%CUSTOMERPOSTCODE%%", attributes.customer.postcode);
								content.innerHTML = render;
							}
							
							// CUSTOMERCITY
							{
								render = render.replace ("%%CUSTOMERCITY%%", attributes.customer.city);
								content.innerHTML = render;
							}
							
							// CUSTOMERCOUNTRY
							{
								render = render.replace ("%%CUSTOMERCOUNTRY%%", attributes.customer.country);
								content.innerHTML = render;
							}
							
							// CUSTOMERNO
							{
								render = render.replace ("%%CUSTOMERNO%%", attributes.customer.no);
								content.innerHTML = render;
							}
							
							// CUSTOMERPHONE
							{
								render = render.replace ("%%CUSTOMERPHONE%%", attributes.customer.phone);
								content.innerHTML = render;
							}
							
							// CUSTOMEREMAIL
							{
								render = render.replace ("%%CUSTOMEREMAIL%%", attributes.customer.email);
								content.innerHTML = render;
							}
							
							// AUCTIONNO
							{
//								render = render.replace ("%%AUCTIONNO%%", attributes.invoice.auction.no);
//								content.innerHTML = render;
							}
							
							// AUCTIONTITLE
							{
//								render = render.replace ("%%AUCTIONTITLE%%", attributes.invoice.auction.title);
//								content.innerHTML = render;
							}
													
							// CREDITNOTENO
							{
								render = render.replace ("%%CREDITNOTENO%%", attributes.creditnote.no);
								content.innerHTML = render;
							}
							
							// CREDITNOTEDATE
							{															
								var date = SNDK.tools.timestampToDate (attributes.creditnote.createtimestamp)
								render = render.replace ("%%CREDITNOTEDATE%%", SNDK.tools.padLeft (date.getDate (), 2, "0") +"-"+ SNDK.tools.padLeft ((date.getMonth () + 1), 2, "0") +"-"+ date.getFullYear ());
								content.innerHTML = render;				
							}
							
							// CUSTOMERBANKACCOUNT
							{
								render = render.replace ("%%CUSTOMERBANKACCOUNT%%", attributes.customer.bankregistrationno +" "+ attributes.customer.bankaccountno);
								content.innerHTML = render;
							}
					
							// ROWS
							{
								// Add data rows.
								var rows = "";	
								var count = 0;
														
								for (var idx = from; idx < attributes.creditnote.lines.length; idx++)
								{							
									var row = template.row;
									
									// TEXT
									{
										row = row.replace ("%%TEXT%%", attributes.creditnote.lines[idx].text);
									}		
								
									// AMOUNT
									{
										row = row.replace ("%%AMOUNT%%", attributes.creditnote.lines[idx].amount.toFixed (2));
									}
								
									// VAT
									{
										row = row.replace ("%%VAT%%", attributes.creditnote.lines[idx].vat.toFixed (2));
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
								render = render.replace ("%%TOTALAMOUNT%%", parseInt (attributes.creditnote.amount).toFixed (2));								
								render = render.replace ("%%TOTALVAT%%", parseInt (attributes.creditnote.vat).toFixed (2));
								render = render.replace ("%%TOTALTOTAL%%", parseInt (attributes.creditnote.total).toFixed (2));
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
						while (c < attributes.creditnote.lines.length)
						{							
						 	c += page (c);				 				
						}	
				
						var result = print.contentDocument.body.innerHTML;
						
						
						app.mainWindow.document.getElementById ("PrintHolder").removeChild (print);
						
						return result;
					};

	var data = "";
																			
	if (attributes.creditnote)
	{
		data = render ({creditnote: attributes.creditnote});
	}
	else if (attributes.creditnotes)
	{
		for (index in attributes.creditnotes)
		{
			data += render ({creditnote: attributes.creditnotes[index]});
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
		var filename = localDir.path + app.session.pathSeperator + attributes.creditnote.id +".pdf";
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
    	settings.title = "Didius Creditnote";    		

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
								sXUL.tools.fileUpload ({postUrl: didius.runtime.ajaxUrl, fieldName: "file", filePath: filename, additionalFields: {cmd: "function", "cmd.function": "Didius.Helpers.MailCreditnote", creditnoteid: attributes.creditnote.id, customerid: attributes.creditnote.customerid}, onLoad: onLoad, onProgress: onProgress, onError: onError});
								//sXUL.tools.fileUpload ({postUrl: didius.runtime.ajaxUrl, fieldName: "file", filePath: filename, additionalFields: {cmd: "function", "cmd.function": "Didius.Helpers.MailInvoice", invoiceid: attributes.invoice.id}, onLoad: onLoad, onProgress: onProgress, onError: onError});
							}
							
							setTimeout (worker, 5000);																																
						};
			
		sXUL.tools.print ({contentWindow: print.contentWindow, settings: settings, onDone: onDone, onError: attributes.onError});
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
	
		sXUL.tools.print ({contentWindow: print.contentWindow, settings: settings, onDone: attributes.onDone, onError: attributes.onError});				
	}		
}

