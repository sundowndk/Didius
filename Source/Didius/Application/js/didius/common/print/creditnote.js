creditnote : function (attributes)
{	
	var Cc = Components.classes;
	var Ci = Components.interfaces;
	var Cu = Components.utils;
	var Cr = Components.results;

	var render = 	function (attributes)
					{							
						var customer = didius.customer.load (attributes.creditnote.customerid)
																					
						var template = didius.helpers.parsePrintTemplate (didius.settings.get ({key: "didius_template_creditnote"}));
						
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
													
													// AUCTIONNO
													{
						//								render = render.replace ("%%AUCTIONNO%%", attributes.invoice.auction.no);
													}
													
													// AUCTIONTITLE
													{
						//								render = render.replace ("%%AUCTIONTITLE%%", attributes.invoice.auction.title);
													}
																			
													// CREDITNOTENO
													{
														render = render.replace ("%%CREDITNOTENO%%", attributes.creditnote.no);
													}
													
													// CREDITNOTEDATE
													{															
														var date = SNDK.tools.timestampToDate (attributes.creditnote.createtimestamp)
														render = render.replace ("%%CREDITNOTEDATE%%", SNDK.tools.padLeft (date.getDate (), 2, "0") +"-"+ SNDK.tools.padLeft ((date.getMonth () + 1), 2, "0") +"-"+ date.getFullYear ());
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
																				
														for (var idx = from; idx < attributes.creditnote.lines.length; idx++)
														{							
															var row = template.row;
															
															// NO
															{
																row = row.replace ("%%NO%%", attributes.creditnote.lines[idx].no);
															}
															
															// TEXT
															{
																row = row.replace ("%%TEXT%%", attributes.creditnote.lines[idx].text);
															}		
														
															// AMOUNT
															{
																row = row.replace ("%%AMOUNT%%", attributes.creditnote.lines[idx].amount.toFixed (2));
															}
																																
															// VATAMOUNT
															{
																row = row.replace ("%%VATAMOUNT%%", attributes.creditnote.lines[idx].vat.toFixed (2));
															}																													
															
															// TOTAL
															{
																row = row.replace ("%%TOTAL%%", attributes.creditnote.lines[idx].total.toFixed (2));
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
														render = render.replace ("%%TOTALAMOUNT%%", attributes.creditnote.amount.toFixed (2));														
														render = render.replace ("%%TOTALVAT%%", attributes.creditnote.vat.toFixed (2));
														render = render.replace ("%%TOTALTOTAL%%", attributes.creditnote.total.toFixed (2));
														page.innerHTML = render;
													}				
																					
													// DISCLAIMER
													{
														var render = page.innerHTML;
														render = render.replace ("%%DISCLAIMER%%", template.disclaimer);														
													}		
													
													return count;				
												}
											
												var c = 0;				
												while (c < attributes.creditnote.lines.length)
												{							
									 				c += page (c);				 				
												}												
											};
											
						contentType1 ();
						
						return print.contentDocument.body.innerHTML;						
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
	
	settings.title = "DidiusCreditnote";
		
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
								sXUL.tools.fileUpload ({postUrl: didius.runtime.ajaxUrl, fieldName: "file", filePath: filename, additionalFields: {cmd: "function", "cmd.function": "Didius.Helpers.MailCreditnote", creditnoteid: attributes.creditnote.id, customerid: attributes.creditnote.customerid}, onLoad: onLoad, onProgress: onProgress, onError: onError});
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

