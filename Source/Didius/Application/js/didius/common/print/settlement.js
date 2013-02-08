settlement : function (attributes)		
{					
	if (!attributes.settlement)
		throw "DIDIUS.COMMON.PRINT.SETTLEMENT.PRINT: No SETTLEMENT given, cannot print nothing.";

	var Cc = Components.classes;
	var Ci = Components.interfaces;
	var Cu = Components.utils;
	var Cr = Components.results;

	// ------------------------------------------------------------------------------------------------------
	// | RENDER																								|	
	// ------------------------------------------------------------------------------------------------------
	var render = 	function (attributes)
					{
						var settlement = attributes.settlement;
						var _case = didius.case.load (settlement.caseid);
						var customer = didius.customer.load (settlement.customerid);
						var items = settlement.items;
						
						SNDK.tools.sortArrayHash (items, "catalogno", "numeric");		
					
						var template = didius.helpers.parsePrintTemplate (didius.settings.get ({key: "didius_template_settlement"}));						
						var print = app.mainWindow.document.createElement ("iframe");
						app.mainWindow.document.getElementById ("PrintHolder").appendChild (print);
												
						var pageCount = 1;				
					
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
							
							// SETTLEMENTNO
							{
								render = render.replace ("%%SETTLEMENTNO%%", settlement.no);
							}
							
							// CUSTOMERNO
							{
								render = render.replace ("%%CUSTOMERNO%%", customer.no);
							}
							
							// CUSTOMERNAME
							{
								render = render.replace ("%%CUSTOMERNAME%%", customer.name);
							}
							
							// CUSTOMERADDRESS
							{
								var address = customer.address1;
								
								if (customer.address2 != "")
								{
									address += "<br>"+ customer.address2;
								}
							
								render = render.replace ("%%CUSTOMERADDRESS%%", address);
							}
							
							// CUSTOMERPOSTCODE
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
							
							// CUSTOMERPHONE
							{
								render = render.replace ("%%CUSTOMERPHONE%%", customer.phone);
							}
							
							// CUSTOMEREMAIL
							{
								render = render.replace ("%%CUSTOMEREMAIL%%", customer.email);
							}
			
							// CUSTOMERBANKACCOUNT
							{
								render = render.replace ("%%CUSTOMERBANKACCOUNT%%", customer.bankregistrationno +" "+ customer.bankaccountno);
								content.innerHTML = render;
							}
							
							// CASENO
							{
								render = render.replace ("%%CASENO%%", _case.no);
							}
							
							// CASETITLE
							{
								render = render.replace ("%%CASETITLE%%", _case.title);
							}
			
							// ROWS
							{
								// Add data rows.
								var rows = "";	
								var count = 0;				
								for (var idx = from; idx < items.length; idx++)
								{							
									var row = template.row;
									
									if (items[idx].bidamount != "0.00")
									{							
										// CATALOGNO						
										{
											row = row.replace ("%%CATALOGNO%%", items[idx].catalogno);
										}			
								
										// DESCRIPTION
										{
											row = row.replace ("%%DESCRIPTION%%", items[idx].description);
										}		
								
										// BIDAMOUNT
										{
											row = row.replace ("%%BIDAMOUNT%%",  items[idx].bidamount.toFixed (2));
										}
								
										// COMMISSIONFEE
										{
											row = row.replace ("%%COMMISSIONFEE%%", items[idx].commissionfee.toFixed (2));
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
																		
										totalSale += parseInt (items[idx].bidamount);
										totalCommissionFee += parseInt (items[idx].commissionfee);
										totalTotal = totalSale + totalCommissionFee;				
									
										rows += row;
									}
																				
									count++;						
								}																		
							
								render = render.replace ("%%ROWS%%", rows);
								render = render.replace ("%%TRANSFER%%", "");
								
								content.innerHTML = render;
							}
			
							// TOTAL
							{
								render = render.replace ("%%TOTAL%%", template.total);
								render = render.replace ("%%TOTALSALE%%", settlement.sales.toFixed (2));
								render = render.replace ("%%TOTALCOMMISSIONFEE%%", settlement.commissionfee.toFixed (2));
								render = render.replace ("%%TOTALTOTAL%%", settlement.total.toFixed (2));
								render = render.replace ("%%TOTALVAT%%", settlement.vat.toFixed (2));
								content.innerHTML = render;
							}				
														
							// DISCLAIMER
							{
								render = render.replace ("%%DISCLAIMER%%", template.disclaimer);
								content.innerHTML = render;
							}
																				
							return count;				
						}												
						
						var c = 0;				
						while (c < items.length)
						{							
			 				c += page (c);				 				
						}			
																		
						var result = print.contentDocument.body.innerHTML;						
						app.mainWindow.document.getElementById ("PrintHolder").removeChild (print);
						
						return result;						
					};
					
	var data = render ({settlement: attributes.settlement});
	
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
	
	settings.printBGImages = true;
    settings.printBGColors = true;    	
    	
    settings.printFrameType = Ci.nsIPrintSettings.kFramesAsIs;
    //settings.outputFormat = Ci.nsIPrintSettings.kOutputFormatPDF;
    
    settings.footerStrCenter = "";
    settings.footerStrLeft = "";
    settings.footerStrRight = "";
    settings.headerStrCenter = "";
    settings.headerStrLeft = "";
    settings.headerStrRight = "";    	
	
	settings.title = "Didius Settlement";
	
	if (attributes.mail) 
	{
		var localDir = sXUL.tools.getLocalDirectory ();		
		var filename = localDir.path + app.session.pathSeperator + SNDK.tools.newGuid () +".pdf";		
				
		// Hide print dialog.
		settings.printToFile = true;    					
    	settings.printSilent = true;
  		settings.showPrintProgress = false;
	    		    		
	   	// Set output format to PDF.    		    		           	
    	settings.outputFormat = 2;
    				        	        	    
  		// Set output filename.
		settings.toFileName = filename;
													
		var onDone =	function ()
						{
							var onLoad = 		function (respons)
												{														
													var respons = respons.replace ("\n","").split (":");
																				
													switch (respons[0].toLowerCase ())
													{
														case "success":
														{																
															//sXUL.tools.fileDelete (filename);																														
															break;
														}
									
														default:
														{
															onError ();
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
													if (attributes.onError != null)
													{
														setTimeout (attributes.onError, 1);
													}
												};
													
							var onDone = 		function ()							
												{													
													if (attributes.onDone != null)
													{
														setTimeout (attributes.onDone, 1);
													}
												}
												
							var worker = function ()
							{							
								sXUL.tools.fileUpload ({postUrl: didius.runtime.ajaxUrl, fieldName: "file", filePath: filename, additionalFields: {cmd: "function", "cmd.function": "Didius.Helpers.MailSettlement", customerid: attributes.settlement.customerid}, onLoad: onLoad, onProgress: onProgress, onError: onError});																
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