turnoverReport : function (attributes)
{	
	var Cc = Components.classes;
	var Ci = Components.interfaces;
	var Cu = Components.utils;
	var Cr = Components.results;

	var render = 	function (attributes)
					{											
						var template = didius.helpers.parsePrintTemplate (didius.settings.get ({key: "didius_template_turnoverreport"}));
						
						var print = document.getElementById ("iframe.print");
						print.contentDocument.body.innerHTML = " ";
												
						var rows = new Array ();						
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
							var render = template.page.replace ("%%PAGENUMMER%%", pageCount++);					
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
							
							// ROWS
							{
								// Add data rows.
								var blabla = "";	
								var count = 0;
														
								for (var index = from; index < rows.length; index++)
								{																	
									var row = rows[index];
									
									if (row == "NEWPAGE")
									{
										render = render.replace ("%%ROWS%%", blabla);															
										content.innerHTML = render;
										count++;
										break;
									}
																										
									content.innerHTML = render.replace ("%%ROWS%%", blabla + row);
									app.thread.update ();	
																															
									if (content.offsetHeight > (maxHeight2))
									{						
										render = render.replace ("%%ROWS%%", blabla);															
										content.innerHTML = render;
										break;	
									}
																						
									blabla += row;																	
									count++;											
								}
							}
													
							return count;				
						}
																								
						for (var index in attributes.turnoverReport.buyers)
						{
							var buyer = attributes.turnoverReport.buyers[index];														
							
							// INFO
							{
								var row = template.buyerinforow;
								var customer = app.data.customers[buyer.id];								
								
								// CUSTOMERNO
								{
									row = row.replace ("%%CUSTOMERNO%%", customer.no);
								}
								
								// CUSTOMERNAME
								{
									row = row.replace ("%%CUSTOMERNAME%%", customer.name);
								}
								
								// CUSTOMERADDRESS
								{
									var address = customer.address1 +" "+ customer.address2
									row = row.replace ("%%CUSTOMERADDRESS%%", address);
								}
								
								// CUSTOMERPOSTCODE CUSTOMERCITY
								{
									row = row.replace ("%%CUSTOMERPOSTCODE%%", customer.postcode);
									row = row.replace ("%%CUSTOMERCITY%%", customer.city);
								}
								
								// CUSTOMERPHONE
								{
									row = row.replace ("%%CUSTOMERPHONE%%", customer.phone);
								}								
																				
								rows[rows.length] = row;
							}
							
							// ITEMS
							{							
								for (var index in attributes.turnoverReport.buyerlines)
								{
									var line = attributes.turnoverReport.buyerlines[index];
									
									if (line.customerid == buyer.id)
									{
										var row = template.buyeritemrow;
										
										// ITEM
										{
											// LINECATALOGNO
											{
												row = row.replace ("%%LINECATALOGNO%%", line.catalogno )
											}
											
											// LINETEXT
											{
												row = row.replace ("%%LINETEXT%%", line.text)
											}
											
											// LINEAMOUNT
											{
												row = row.replace ("%%LINEAMOUNT%%", line.amount.toFixed (2) +" kr.")
											}
											
											// LINEVATAMOUNT
											{
												row = row.replace ("%%LINEVATAMOUNT%%", line.vatamount.toFixed (2) +" kr.")
											}
											
											// LINECOMMISSIONFEE
											{
												row = row.replace ("%%LINECOMMISSIONFEE%%", line.commissionfee.toFixed (2) +" kr.")
											}
																																	
											// LINEVATCOMMISSIONFEE
											{
												row = row.replace ("%%LINEVATCOMMISSIONFEE%%", line.vatcommissionfee.toFixed (2) +" kr.")
											}										
											
											// LINETOTAL
											{
												row = row.replace ("%%LINETOTAL%%", line.total.toFixed (2) +" kr.")
											}										
										}
													
										rows[rows.length] = row;		
									}																																			
								}														
							}
							
							// TOTAL
							{							
								var row = template.buyertotalrow;
								
								// AMOUNT
								{
									row = row.replace ("%%BUYERAMOUNT%%", buyer.amount.toFixed (2) +" kr.");
								}
								
								// VATAMOUNT
								{
									row = row.replace ("%%BUYERVATAMOUNT%%", buyer.amount.toFixed (2) +" kr.");
								}
								
								// COMMISSIONFEE
								{
									row = row.replace ("%%BUYERCOMMISSFIONFEE%%", buyer.commissionfee.toFixed (2) +" kr.");
								}
								
								// VATCOMMISSIONFEE
								{
									row = row.replace ("%%BUYERVATCOMMISSFIONFEE%%", buyer.commissionfee.toFixed (2) +" kr.");
								}
								
								// TOTAL
								{
									row = row.replace ("%%BUYERTOTAL%%", buyer.total.toFixed (2) +" kr.");
								}								
																				
								rows[rows.length] = row;
							}														
						}
						
						rows[rows.length] = "NEWPAGE";
						
						for (var index in attributes.turnoverReport.sellers)
						{
							var seller = attributes.turnoverReport.sellers[index];
							
							// INFO
							{
								var row = template.sellerinforow;
								var customer = app.data.customers[seller.id];								
								
								// CUSTOMERNO
								{
									row = row.replace ("%%CUSTOMERNO%%", customer.no);
								}
								
								// CUSTOMERNAME
								{
									row = row.replace ("%%CUSTOMERNAME%%", customer.name);
								}
								
								// CUSTOMERADDRESS
								{
									var address = customer.address1 +" "+ customer.address2
									row = row.replace ("%%CUSTOMERADDRESS%%", address);
								}
								
								// CUSTOMERPOSTCODE CUSTOMERCITY
								{
									row = row.replace ("%%CUSTOMERPOSTCODE%%", customer.postcode);
									row = row.replace ("%%CUSTOMERCITY%%", customer.city);
								}
								
								// CUSTOMERPHONE
								{
									row = row.replace ("%%CUSTOMERPHONE%%", customer.phone);
								}								
																				
								rows[rows.length] = row;
							}
							
							// ITEMS
							{							
								for (var index in attributes.turnoverReport.sellerlines)
								{
									var line = attributes.turnoverReport.sellerlines[index];
									
									if (line.customerid == seller.id)
									{
										var row = template.selleritemrow;
										
										// ITEM
										{
											// LINECATALOGNO
											{
												row = row.replace ("%%LINECATALOGNO%%", line.catalogno )
											}
											
											// LINETEXT
											{
												row = row.replace ("%%LINETEXT%%", line.text)
											}
											
											// LINEAMOUNT
											{
												row = row.replace ("%%LINEAMOUNT%%", line.amount.toFixed (2) +" kr.")
											}
											
											// LINEVATAMOUNT
											{
												row = row.replace ("%%LINEVATAMOUNT%%", line.vatamount.toFixed (2) +" kr.")
											}
											
											// LINECOMMISSIONFEE
											{
												row = row.replace ("%%LINECOMMISSIONFEE%%", line.commissionfee.toFixed (2) +" kr.")
											}
																																	
											// LINEVATCOMMISSIONFEE
											{
												row = row.replace ("%%LINEVATCOMMISSIONFEE%%", line.vatcommissionfee.toFixed (2) +" kr.")
											}										
											
											// LINETOTAL
											{
												row = row.replace ("%%LINETOTAL%%", line.total.toFixed (2) +" kr.")
											}										
										}
													
										rows[rows.length] = row;									
									}																		
								}																
							}
							
							// TOTAL
							{							
								var row = template.sellertotalrow;
								
								// AMOUNT
								{
									row = row.replace ("%%SELLERAMOUNT%%", seller.amount.toFixed (2) +" kr.");
								}
								
								// VATAMOUNT
								{
									row = row.replace ("%%SELLERVATAMOUNT%%", seller.amount.toFixed (2) +" kr.");
								}
								
								// COMMISSIONFEE
								{
									row = row.replace ("%%SELLERCOMMISSFIONFEE%%", seller.commissionfee.toFixed (2) +" kr.");
								}
								
								// VATCOMMISSIONFEE
								{
									row = row.replace ("%%SELLERVATCOMMISSFIONFEE%%", seller.commissionfee.toFixed (2) +" kr.");
								}
								
								// TOTAL
								{
									row = row.replace ("%%SELLERTOTAL%%", seller.total.toFixed (2) +" kr.");
								}								
																				
								rows[rows.length] = row;
							}														
						}						
													
						rows[rows.length] = "NEWPAGE";
						
						// NOTSOLD
						{							
							for (var index in attributes.turnoverReport.notsoldlines)
							{
								var line = attributes.turnoverReport.notsoldlines[index];
									
								var row = template.notsoldrow;
										
								// LINECATALOGNO
								{
									row = row.replace ("%%LINECATALOGNO%%", line.catalogno);
								}
											
								// LINETEXT
								{
									row = row.replace ("%%LINETEXT%%", line.text);
								}
								
								// CUSTOMER
								{
									//var customer = didius.customer.load (line.customerid);
									var customer = app.data.customers[line.customerid];
									
									// CUSTOMERNAME
									{
										row = row.replace ("%%CUSTOMERNAME%%", customer.name);
									}
									
									// CUSTOMERPHONE
									{
										row = row.replace ("%%CUSTOMERPHONE%%", customer.phone);	
									}
								}
																							
								rows[rows.length] = row;																																	
							}
						}
																															
						rows[rows.length] = "NEWPAGE";
						
						// TOTAL
						{
							var row = template.totalrow;
							
							// BUYERAMOUNT
							{
								row = row.replace ("%%BUYERAMOUNT%%", attributes.turnoverReport.buyeramount.toFixed (2) +" kr.");
							}
							
							// BUYERVATAMOUNT
							{
								row = row.replace ("%%BUYERVATAMOUNT%%", attributes.turnoverReport.buyervatamount.toFixed (2) +" kr.");
							}
							
							// BUYERCOMMISSIONFEE
							{
								row = row.replace ("%%BUYERCOMMISSIONFEE%%", attributes.turnoverReport.buyercommissionfee.toFixed (2) +" kr.");
							}
							
							// BUYERVATCOMMISSIONFEE
							{
								row = row.replace ("%%BUYERVATCOMMISSIONFEE%%", attributes.turnoverReport.buyervatcommissionfee.toFixed (2) +" kr.");
							}
							
							// BUYERTOTAL
							{
								row = row.replace ("%%BUYERTOTAL%%", attributes.turnoverReport.buyertotal.toFixed (2) +" kr.");
							}
							
							// SELLERAMOUNT
							{
								row = row.replace ("%%SELLERAMOUNT%%", attributes.turnoverReport.selleramount.toFixed (2) +" kr.");
							}
							
							// SELLERVATAMOUNT
							{
								row = row.replace ("%%SELLERVATAMOUNT%%", attributes.turnoverReport.sellervatamount.toFixed (2) +" kr.");
							}
							
							// SELLERCOMMISSIONFEE
							{
								row = row.replace ("%%SELLERCOMMISSIONFEE%%", attributes.turnoverReport.sellercommissionfee.toFixed (2) +" kr.");
							}
							
							// SELLERVATCOMMISSIONFEE
							{
								row = row.replace ("%%SELLERVATCOMMISSIONFEE%%", attributes.turnoverReport.sellervatcommissionfee.toFixed (2) +" kr.");
							}
							
							// SELLERTOTAL
							{
								row = row.replace ("%%SELLERTOTAL%%", attributes.turnoverReport.sellertotal.toFixed (2) +" kr.");
							}
							
							// NETTO
							{
								row = row.replace ("%%NETTO%%", attributes.turnoverReport.netto.toFixed (2) +" kr.");
							}
							
							rows[rows.length] = row;
						}
																																																											
						var output = "";																																																																																																																																				
						var c = page (0);
						while (c < rows.length)
						{							
						 	c += page (c);			
						 	
						 	output += print.contentDocument.body.innerHTML;						 	
						 	print.contentDocument.body.innerHTML = " ";
						 	app.thread.update ();	
						 	
						 	attributes.progressWindow.document.getElementById ("description1").textContent = "Generere sider ...";
						 	attributes.progressWindow.document.getElementById ("progressmeter1").mode = "determined";
							attributes.progressWindow.document.getElementById ("progressmeter1").value = (c / rows.length) * 100;
						}	
					
						return output;
					};
	
	var print = document.getElementById ("iframe.print");
	print.contentDocument.body.innerHTML = render ({turnoverReport: attributes.report, progressWindow: attributes.progressWindow});
							
	var settings = PrintUtils.getPrintSettings ();
																																								
	settings.marginLeft = 0.5;
	settings.marginRight = 0.5;
	settings.marginTop = 0.5;
	settings.marginBottom = 0.5;
	settings.shrinkToFit = true;		
	settings.paperName =  "iso_a4";
	settings.paperWidth = 210;
	settings.paperHeight = 297;
	settings.orientation = 0;
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
	
	settings.title = "Omsætningsliste";
	
	attributes.progressWindow.document.getElementById ("description1").textContent = "Udskriver sider ...";
 	attributes.progressWindow.document.getElementById ("progressmeter1").mode = "undetermined";
	attributes.progressWindow.document.getElementById ("progressmeter1").value = 0;
						
	if (attributes.mail) 
	{
		var localDir = sXUL.tools.getLocalDirectory ();
		//var filename = localDir.path + app.session.pathSeperator +"temp"+ app.session.pathSeperator + main.current.id;
		var filename = localDir.path + app.session.pathSeperator + attributes.auction.id +".pdf";
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
    	settings.title = "DidiusTurnoverReport";    		

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
								sXUL.tools.fileUpload ({postUrl: didius.runtime.ajaxUrl, fieldName: "file", filePath: filename, additionalFields: {cmd: "function", "cmd.function": "Didius.Helpers.MailSettlement", settlementid: attributes.settlement.id, customerid: attributes.settlement.customerid, auctionid: attributes.settlement.auctionid}, onLoad: onLoad, onProgress: onProgress, onError: onError});
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

