invoice : function (attributes)
{	
	var Cc = Components.classes;
	var Ci = Components.interfaces;
	var Cu = Components.utils;
	var Cr = Components.results;

	var render = 	function (attributes)
					{							
						var customer = didius.customer.load (attributes.invoice.customerid)
						
						var auctions = {};
						
						for (index in attributes.invoice.auctionids)
						{
							auctions[auctions.length] = didius.auction.load (attributes.invoice.auctionids[index]);
						}
																					
						var template = didius.helpers.parsePrintTemplate (didius.settings.get ({key: "didius_template_invoice"}));
						
						var print = document.getElementById ("iframe.print");
						print.contentDocument.body.innerHTML = " ";
						
						var pageCount = 1;									
																							
						var contentType1 =	function ()
											{
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
													
													// Page
													{							
														var render = "";
														render += template.header;
														render += template.footer;									
													
														// PAGENUMBER
														{				
															render = render.replace ("%%PAGENUMBER%%", pageCount++);
														}
														
														page.innerHTML = render;
													}
													
													// Add content holder.																						
													var content = print.contentDocument.createElement ("div")
													content.className = "PrintContent";
													content.style.top = print.contentDocument.getElementById ("PageHeader").offsetHeight;
													page.appendChild (content);
												
												
													var render = template.contenttype1.replace ("%%CONTENTTYPE1%%", template.contenttype1);
													// CUSTOMERNAME
													{
														render = render.replace ("%%CUSTOMERNAME%%", customer.name);
													}
											
													// CUSTOMERADDRESS
													{
														var customeraddress = customer.address1;
														
														if (customer.address2 != "")
														{
															customeraddress += "<br>"+ customer.address2;
														}
													
														render = render.replace ("%%CUSTOMERADDRESS%%", customeraddress);														
													}
													
													// POSTCODE
													{
														render = render.replace ("%%CUSTOMERPOSTCODE%%", customer.postcode);														
													}
													
													// CUSTOMERCITY
													{
														render = render.replace ("%%CUSTOMERCITY%%", customer.city);														
													}
													
													// CUSTOMERCOUNTRY
													{
														render = render.replace ("%%CUSTOMERCOUNTRY%%", customer.country);														
													}
													
													// CUSTOMERNO
													{
														render = render.replace ("%%CUSTOMERNO%%", customer.no);														
													}
													
													// CUSTOMERPHONE
													{
														render = render.replace ("%%CUSTOMERPHONE%%", customer.phone);
													}
													
													// CUSTOMERMOBILE
													{
														render = render.replace ("%%CUSTOMERMOBILE%%", customer.mobile);
													}
													
													// CUSTOMEREMAIL
													{
														render = render.replace ("%%CUSTOMEREMAIL%%", customer.email);														
													}
																										
													// AUCTIONINFO
													{
														var auctioninfo = template.auctioninfo;
													
														for (index in auctions)
														{															
															var auction = auctions[index];
															
															// AUCTIONNO
															{
																auctioninfo = auctioninfo.replace ("%%AUCTIONNO%%", auction.no);
															}
															
															// AUCTIONTITLE
															{
																auctioninfo = auctioninfo.replace ("%%AUCTIONTITLE%%", auction.title);
															}
															
															// BUYERNO
															{
																var buyernos = didius.helpers.parseBuyerNos (auction.buyernos);
	
																for (index in buyernos)
																{
																	if (buyernos[index] == customer.id)
																	{																		
																		auctioninfo = auctioninfo.replace ("%%BUYERNO%%", buyernos[index]);
																	}																																
																}
																
																auctioninfo = auctioninfo.replace ("%%BUYERNO%%", "");
															}
														}													
													
														render = render.replace ("%%AUCTIONINFO%%", auctioninfo);
													}
													
													// AUCTIONTITLE
													{
						//								render = render.replace ("%%AUCTIONTITLE%%", attributes.invoice.auction.title);
													}
																			
													// INVOICENO
													{
														render = render.replace ("%%INVOICENO%%", attributes.invoice.no);
													}
													
													// INVOICEDATE
													{															
														var date = SNDK.tools.timestampToDate (attributes.invoice.createtimestamp)
														render = render.replace ("%%INVOICEDATE%%", SNDK.tools.padLeft (date.getDate (), 2, "0") +"-"+ SNDK.tools.padLeft ((date.getMonth () + 1), 2, "0") +"-"+ date.getFullYear ());
													}
													
													// CUSTOMERBANKACCOUNT
													{
														render = render.replace ("%%CUSTOMERBANKACCOUNT%%", customer.bankregistrationno +" "+ customer.bankaccountno);
													}
													
													content.innerHTML = render;	
															
													// ROWS
													{
														// Add data rows.
														var rows = "";	
														var count = 0;
																				
														for (var idx = from; idx < attributes.invoice.lines.length; idx++)
														{							
															var row = template.row;
															
															// NO
															{
																row = row.replace ("%%NO%%", attributes.invoice.lines[idx].no);
															}
															
															// TEXT
															{
																row = row.replace ("%%TEXT%%", attributes.invoice.lines[idx].text);
															}		
														
															// AMOUNT
															{
																row = row.replace ("%%AMOUNT%%", attributes.invoice.lines[idx].amount.toFixed (2));
															}
																																
															// VATAMOUNT
															{
																row = row.replace ("%%VATAMOUNT%%", attributes.invoice.lines[idx].vatamount.toFixed (2));
															}
															
															// COMMISSIONFEE
															{
																row = row.replace ("%%COMMISSIONFEE%%", attributes.invoice.lines[idx].commissionfee.toFixed (2));
															}					
															
															// VATCOMMISSIONFEE
															{
																row = row.replace ("%%VATCOMMISSIONFEE%%", attributes.invoice.lines[idx].vatcommissionfee.toFixed (2));
															}					
															
															// TOTAL
															{
																row = row.replace ("%%TOTAL%%", attributes.invoice.lines[idx].total.toFixed (2));
															}					

															content.innerHTML = render.replace ("%%ROWS%%", rows + row);
																																					
															if ((page.offsetHeight - print.contentDocument.getElementById ("PageFooter").offsetHeight - print.contentDocument.getElementById ("PageHeader").offsetHeight ) < (content.offsetHeight))
															{   					
																render = render.replace ("%%ROWS%%", rows);																															
																content.innerHTML = render;
																
																{
																	var render = page.innerHTML;
																	render = render.replace ("%%TRANSFER%%", template.transfer)						
																	render = render.replace ("%%TOTAL%%", "");		
																	render = render.replace ("%%DISCLAIMER%%", "");							
																	page.innerHTML = render;																																
																}
																break;	
															}
																						
															rows += row;																	
															count++;						
														}
														
														render = render.replace ("%%ROWS%%", rows);													
														content.innerHTML = render;
														
														{
															var render = page.innerHTML;														
															render = render.replace ("%%TRANSFER%%", "");
															page.innerHTML = render;
														}
													}
													
													// TOTAL
													{																										
														var render = page.innerHTML;
														render = render.replace ("%%TOTAL%%", template.total);
														render = render.replace ("%%TOTALSALE%%", attributes.invoice.sales.toFixed (2));
														render = render.replace ("%%TOTALCOMMISSIONFEE%%", attributes.invoice.commissionfee.toFixed (2));
														render = render.replace ("%%TOTALVAT%%", attributes.invoice.vat.toFixed (2));
														render = render.replace ("%%TOTALTOTAL%%", attributes.invoice.total.toFixed (2));
														page.innerHTML = render;
													}				
																					
													// DISCLAIMER
													{
														var render = page.innerHTML;
														render = render.replace ("%%DISCLAIMER%%", template.disclaimer);
														
														var auction = didius.auction.load (attributes.invoice.auctionids[0]);														
														render = render.replace ("%%PICKUPTEXT%%", auction.pickuptext.replace ("\n", "<br>"));
														page.innerHTML = render;
													}		
													
													return count;				
												}
											
												var c = 0;				
												while (c < attributes.invoice.lines.length)
												{							
									 				c += page (c);				 				
												}												
											};
											
						contentType1 ();
						
						return print.contentDocument.body.innerHTML;						
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
	
	var print = document.getElementById ("iframe.print");
	print.contentDocument.body.innerHTML = data;		
							
	var settings = PrintUtils.getPrintSettings ();
																																								
	settings.marginLeft = 0.5;
	settings.marginRight = 0.5;
	settings.marginTop = 0.5;
	settings.marginBottom = 0.5;
	settings.shrinkToFit = true;		
	settings.paperName =  "iso_a4";
	settings.paperWidth = 210;
	settings.paperHeight = 297
	settings.paperSizeUnit = Ci.nsIPrintSettings.kPaperSizeMillimeters;																					
   	settings.printFrameType = Ci.nsIPrintSettings.kFramesAsIs;	
	settings.printBGImages = true;
    settings.printBGColors = true;    	    	   
    settings.footerStrCenter = "";
    settings.footerStrLeft = "";
    settings.footerStrRight = "";
    settings.headerStrCenter = "";
    settings.headerStrLeft = "";
    settings.headerStrRight = "";    	
	
	settings.title = "DidiusInvoice";
		
	if (attributes.mail) 
	{
		var localDir = sXUL.tools.getLocalDirectory ();
		//var filename = localDir.path + app.session.pathSeperator +"temp"+ app.session.pathSeperator + main.current.id;
		var filename = localDir.path + app.session.pathSeperator + attributes.invoice.id +".pdf";
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
			
		sXUL.tools.print ({contentWindow: print.contentWindow, settings: settings, onDone: onDone, onError: attributes.onError});
	}
	else
	{
		sXUL.tools.print ({contentWindow: print.contentWindow, settings: settings, onDone: attributes.onDone, onError: attributes.onError});							
	}		
}

