salesAgreement : function (attributes)		
{					
	var Cc = Components.classes;
	var Ci = Components.interfaces;
	var Cu = Components.utils;
	var Cr = Components.results;

	var render = 	function ()
					{
						var template = didius.helpers.parsePrintTemplate (didius.settings.get ({key: "didius_template_salesagreement"}));
						//var template = didius.settings.get ({key: "didius_template_salesagreement"});
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
								render = render.replace ("%%CASENO%%", main.current.no);
								content.innerHTML = render;
							}
							
							// CASETITLE
							{
								render = render.replace ("%%CASETITLE%%", main.current.title);
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
										row = row.replace ("%%MINIMUMBID%%", items[idx].minimumbid);
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
						
						var items = didius.item.list ({case: main.current});												
						SNDK.tools.sortArrayHash (items, "catalogno", "numeric");		
						
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
									render = render.replace ("%%CASECOMMISIONFEEPERCENTAGE%%", main.current.commisionfeepercentage);
								}
								
								// CASECOMMISIONFEEMINIMUM
								{
									render = render.replace ("%%CASECOMMISIONFEEMINIMUM%%", main.current.commisionfeeminimum);
								}
					
								// CUSTOMERBANKACCOUNT
								{
									render = render.replace ("%%CUSTOMERBANKACCOUNT%%", main.current.customer.bankregistrationno +" - "+ main.current.customer.bankaccountno);
									content.innerHTML = render;
								}		
								
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
				
								// AUCTIONLOCATION
								{
									render = render.replace ("%%AUCTIONLOCATION%%", main.current.auction.location);
									content.innerHTML = render;
								}			
								
								// AUCTIONBEGIN
								{
									var begin = new Date (Date.parse (main.current.auction.begin));													
									render = render.replace ("%%AUCTIONBEGIN%%", begin.getDate () +"-"+ (begin.getMonth () + 1)  +"-"+ begin.getFullYear ());
									content.innerHTML = render;
								}			
								
								// AUCTIONBEGINTIME
								{
									var begin = new Date (Date.parse (main.current.auction.begin));													
									render = render.replace ("%%AUCTIONBEGINTIME%%", begin.getHours () +":"+ begin.getMinutes ());
									content.innerHTML = render;
								}			
								
								// AUCTIONDEADLINE
								{
									var deadline = new Date (Date.parse (main.current.auction.deadline));	
									render = render.replace ("%%AUCTIONDEADLINE%%", deadline.getDate () +"-"+ (deadline.getMonth () + 1) +"-"+ deadline.getFullYear ());
									content.innerHTML = render;
								}			
								
								// AUCTIONDEADLINETIME
								{
									var deadline = new Date (Date.parse (main.current.auction.deadline));													
									render = render.replace ("%%AUCTIONDEADLINETIME%%", deadline.getHours () +":"+ deadline.getMinutes ());
									content.innerHTML = render;
								}			
				
								// DATE
								{					
									var now = new Date ();
									render = render.replace ("%%DATE%%", now.getDate () +"-"+ (now.getMonth () + 1) +"-"+ now.getFullYear ());
									content.innerHTML = render;				
								}						
							
								// HASVATNO
								{
									if (main.current.customer.vat)
									{
										render = render.replace ("%%HASVATNO%%", template.hasvatno);
										render = render.replace ("%%VATNO%%", main.current.customer.vatno);
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
					
	var data = "";
																	
	if (attributes.case)
	{
		data = render ({case: attributes.case});
	}
	else if (attributes.cases)
	{
		for (index in attributes.cases)
		{
			data += render ({case: attributes.cases[index]});
		}			
	}					
						
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
    	settings.title = "Didius Salesagreement";    		

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
								sXUL.tools.fileUpload ({postUrl: didius.runtime.ajaxUrl, fieldName: "file", filePath: filename, additionalFields: {cmd: "function", "cmd.function": "Didius.Helpers.MailSalesAgreement", customerid: attributes.case.customerid}, onLoad: onLoad, onProgress: onProgress, onError: onError});
								//sXUL.tools.fileUpload ({postUrl: didius.runtime.ajaxUrl, fieldName: "file", filePath: filename, additionalFields: {cmd: "function", "cmd.function": "Didius.Helpers.MailFileToCustomer", customerid: main.current.customer.id, template: "Hej med dig!"}, onLoad: onLoad, onProgress: onProgress, onError: onError});
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