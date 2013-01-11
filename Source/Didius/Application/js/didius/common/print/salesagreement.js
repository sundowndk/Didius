salesAgreement : function (attributes)		
{					
	if (!attributes.case)
		throw "DIDIUS.COMMON.PRINT.SALESAGREEMENT.PRINT: No CASE given, cannot print nothing.";

	var Cc = Components.classes;
	var Ci = Components.interfaces;
	var Cu = Components.utils;
	var Cr = Components.results;

	// ------------------------------------------------------------------------------------------------------
	// | RENDER																								|	
	// ------------------------------------------------------------------------------------------------------
	var render = 	function (attributes)
					{
						var _case = attributes.case;						
						var auction = didius.auction.load (_case.auctionid);
						var customer = didius.customer.load (_case.customerid);
						
						var items = didius.item.list ({case: _case});
						SNDK.tools.sortArrayHash (items, "catalogno", "numeric");		
					
						var template = didius.helpers.parsePrintTemplate (didius.settings.get ({key: "didius_template_salesagreement"}));						
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
							
							// CUSTOMERNAME
							{
								render = render.replace ("%%CUSTOMERNAME%%", customer.name);
								content.innerHTML = render;
							}
						
							// CUSTOMERADDRESS
							{
								var customeraddress = customer.address1;
							
								if (customer.address2 != "")
								{
									address += "<br>"+ customer.address2;
								}
						
								render = render.replace ("%%CUSTOMERADDRESS%%", customeraddress);
								content.innerHTML = render;
							}
			
							// POSTCODE
							{
								render = render.replace ("%%CUSTOMERPOSTCODE%%", customer.postcode);
								content.innerHTML = render;
							}
							
							// CUSTOMERCITY
							{
								render = render.replace ("%%CUSTOMERCITY%%", customer.city);
								content.innerHTML = render;
							}
							
							// CUSTOMERCOUNTRY
							{
								render = render.replace ("%%CUSTOMERCOUNTRY%%", customer.country);
								content.innerHTML = render;
							}
							
							// CUSTOMERNO
							{
								render = render.replace ("%%CUSTOMERNO%%", customer.no);
								content.innerHTML = render;
							}
				
							// CUSTOMERPHONE
							{
								render = render.replace ("%%CUSTOMERPHONE%%", customer.phone);
								content.innerHTML = render;
							}
						
							// CUSTOMEREMAIL
							{
								render = render.replace ("%%CUSTOMEREMAIL%%", customer.email);
								content.innerHTML = render;
							}
							
							// CASENO
							{
								render = render.replace ("%%CASENO%%", _case.no);
								content.innerHTML = render;
							}
							
							// CASETITLE
							{
								render = render.replace ("%%CASETITLE%%", _case.title);
								content.innerHTML = render;
							}
														
							// ROWS
							{
								// Add data rows.
								var rows = "";	
								var count = 0;				
								for (var idx = from; idx < items.length; idx++)
								{							
									var row = template.row;
								
									// CATALOGNO						
									{
										row = row.replace ("%%CATALOGNO%%", items[idx].catalogno);
									}			
								
									// DESCRIPTION
									{
										row = row.replace ("%%DESCRIPTION%%", items[idx].description);
									}		
								
									// MINIMUMBID
									{
										row = row.replace ("%%MINIMUMBID%%", items[idx].minimumbid.toFixed (2));
									}											

									content.innerHTML = render.replace ("%%ROWS%%", rows + row);
																															
									if (content.offsetHeight > (maxHeight2))
									{						
										render = render.replace ("%%ROWS%%", rows);															
										render = render.replace ("%%DISCLAIMER%%", "");							
										content.innerHTML = render;
										break;	
									}
																													
									rows += row;
																					
									count++;						
								}																		
								
								render = render.replace ("%%ROWS%%", rows);											
								content.innerHTML = render;
							}
																				
							return count;				
						}	
																		
						var c = 0;				
						while (c < items.length)
						{							
			 				c += page (c);				 				
						}			
						
						// DISCLAIMERPAGE
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
							var render = template.disclaimer;
							content.innerHTML = render;
									
							// DISCLAIMER
							{				
								// CASECOMMISIONFEEPERCENTAGE
								{
									render = render.replace ("%%CASECOMMISIONFEEPERCENTAGE%%", _case.commisionfeepercentage);
								}
								
								// CASECOMMISIONFEEMINIMUM
								{
									render = render.replace ("%%CASECOMMISIONFEEMINIMUM%%", _case.commisionfeeminimum.toFixed (2));
								}
					
								// CUSTOMERBANKACCOUNT
								{
									render = render.replace ("%%CUSTOMERBANKACCOUNT%%", customer.bankregistrationno +" - "+ customer.bankaccountno);
									content.innerHTML = render;
								}		
								
								// CUSTOMERNAME
								{
									render = render.replace ("%%CUSTOMERNAME%%", customer.name);
									content.innerHTML = render;
								}
			
								// CUSTOMERADDRESS
								{
									var customeraddress = customer.address1;
								
									if (customer.address2 != "")
									{
										address += "<br>"+ customer.address2;
									}
							
									render = render.replace ("%%CUSTOMERADDRESS%%", customeraddress);
									content.innerHTML = render;
								}
							
								// POSTCODE
								{
									render = render.replace ("%%CUSTOMERPOSTCODE%%", customer.postcode);
									content.innerHTML = render;
								}
								
								// CUSTOMERCITY
								{
									render = render.replace ("%%CUSTOMERCITY%%", customer.city);
									content.innerHTML = render;
								}
								
								// CUSTOMERCOUNTRY
								{
									render = render.replace ("%%CUSTOMERCOUNTRY%%", customer.country);
									content.innerHTML = render;
								}											
				
								// AUCTIONLOCATION
								{
									render = render.replace ("%%AUCTIONLOCATION%%", auction.location);
									content.innerHTML = render;
								}			
								
								// AUCTIONBEGIN
								{
									var begin = new Date (Date.parse (auction.begin));													
									render = render.replace ("%%AUCTIONBEGIN%%", begin.getDate () +"-"+ (begin.getMonth () + 1)  +"-"+ begin.getFullYear ());
									content.innerHTML = render;
								}			
								
								// AUCTIONBEGINTIME
								{
									var begin = new Date (Date.parse (auction.begin));																							
									render = render.replace ("%%AUCTIONBEGINTIME%%", SNDK.tools.padLeft (begin.getHours (), 2, "0") +":"+ SNDK.tools.padLeft (begin.getMinutes (), 2, "0"));
									content.innerHTML = render;
								}			
								
								// AUCTIONDEADLINE
								{
									var deadline = new Date (Date.parse (auction.deadline));	
									render = render.replace ("%%AUCTIONDEADLINE%%", deadline.getDate () +"-"+ (deadline.getMonth () + 1) +"-"+ deadline.getFullYear ());
									content.innerHTML = render;
								}			
								
								// AUCTIONDEADLINETIME
								{
									var deadline = new Date (Date.parse (auction.deadline));													
									render = render.replace ("%%AUCTIONDEADLINETIME%%", SNDK.tools.padLeft (deadline.getHours (), 2, "0") +":"+ SNDK.tools.padLeft (deadline.getMinutes (), 2, "0"));
									content.innerHTML = render;
								}			
				
								// DATE
								{					
									var now = new Date ();
									render = render.replace ("%%DATE%%", SNDK.tools.padLeft (now.getDate (), 2, "0") +"-"+ SNDK.tools.padLeft ((now.getMonth () + 1), 2, "0") +"-"+ now.getFullYear ());
									content.innerHTML = render;				
								}						
							
								// HASVATNO
								{
									if (customer.vat)
									{
										render = render.replace ("%%HASVATNO%%", template.hasvatno);
										render = render.replace ("%%VATNO%%", customer.vatno);
									}
									else
									{
										render = render.replace ("%%HASVATNO%%", "");						
									}
								}
					
								content.innerHTML = render;
							}
						}
						
						var result = print.contentDocument.body.innerHTML;
						
						app.mainWindow.document.getElementById ("PrintHolder").removeChild (print);
						
						return result;						
					};
					
	var data = render ({case: attributes.case});			
						
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
    settings.outputFormat = Ci.nsIPrintSettings.kOutputFormatPDF;
    
    settings.footerStrCenter = "";
    settings.footerStrLeft = "";
    settings.footerStrRight = "";
    settings.headerStrCenter = "";
    settings.headerStrLeft = "";
    settings.headerStrRight = "";    	
	
	settings.title = "Didius Salesagreement";

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
								sXUL.tools.fileUpload ({postUrl: didius.runtime.ajaxUrl, fieldName: "file", filePath: filename, additionalFields: {cmd: "function", "cmd.function": "Didius.Helpers.MailSalesAgreement", customerid: attributes.case.customerid}, onLoad: onLoad, onProgress: onProgress, onError: onError});
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