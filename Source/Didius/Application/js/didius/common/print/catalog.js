catalog : function (attributes)
{	
	var Cc = Components.classes;
	var Ci = Components.interfaces;
	var Cu = Components.utils;
	var Cr = Components.results;

	var render = 	function (attributes)
					{	
						var print = document.getElementById ("iframe.print");
						print.contentDocument.body.innerHTML = " ";
																									
						var items = didius.item.list ({auction: attributes.auction});			
						SNDK.tools.sortArrayHash (items, "catalogno", "numeric");																			
						
						var template;
						if (attributes.template == "large")
						{
							template = didius.helpers.parsePrintTemplate (didius.settings.get ({key: "didius_template_cataloglarge"}));							
						}
						else if (attributes.template == "small")
						{
							template = didius.helpers.parsePrintTemplate (didius.settings.get ({key: "didius_template_catalogsmall"}));
						}
												
						var pageCount = 0;
						var page = function (from)
						{		
							pageCount++;
						
							// Add styles.																		
							var styles = print.contentDocument.createElement ("style");					
							print.contentDocument.body.appendChild (styles);					
							styles.innerHTML = template.styles;
									
							// Create page.				
							var page = print.contentDocument.createElement ("div");
							page.className = "A4";
							print.contentDocument.body.appendChild (page);
							
							// Add content holder.																																												
							var content = print.contentDocument.createElement ("div")
							content.className = "Page";
							page.appendChild (content);
																						
							// Add inital content.					
							var render = template.page;			
							content.innerHTML = render;
													
							// Caluculate page maxheight for content.			
							var headerHeight = 0;
							var footerHeight = 0;
							
							// PAGENUMBER
							{
								render = render.replace ("%%PAGENUMBER%%", pageCount);
								content.innerHTML = render;
							}
							
							// AUCTIONBEGIN
							{
								var begin = new Date (Date.parse (main.auction.begin));
								render = render.replace ("%%AUCTIONBEGIN%%", begin.getDate () +"-"+ (begin.getMonth () + 1)  +"-"+ begin.getFullYear ());
								content.innerHTML = render;
							}			
								
							// AUCTIONBEGINTIME
							{
								var begin = new Date (Date.parse (main.auction.begin));											
								
								render = render.replace ("%%AUCTIONBEGINTIME%%", SNDK.tools.padLeft (begin.getHours (), 2, "0") +":"+ SNDK.tools.padLeft (begin.getMinutes (), 2, "0"));
								content.innerHTML = render;
							}			
							
							if (print.contentDocument.getElementById ("Header"))
							{
								headerHeight = print.contentDocument.getElementById ("Header").offsetHeight;
							}
							
							if (print.contentDocument.getElementById ("Footer"))
							{
								print.contentDocument.getElementById ("Footer").id = "Footer"+ pageCount;
								footerHeight = print.contentDocument.getElementById ("Footer"+ pageCount).offsetHeight;
							}
																	
							//var maxHeight = page.offsetHeight - headerHeight - footerHeight;
							var maxHeight = page.offsetHeight;
							
							sXUL.console.log (maxHeight)
																																																							
							var count = 0;					
							var rows = "";
							
							// Add data rows.																																					
							for (var idx = from; idx < items.length; idx++)
							{																			
								var item = items[idx];				
								
								var case_ = didius.case.load ({id: item.caseid});
								var customer = didius.customer.load (case_.customerid);
								
								var row = template.row;
								
								// ITEMCATALOGNO
								{
									row = row.replace ("%%ITEMCATALOGNO%%", item.catalogno);
								}
								
								// ITEMNO
								{
									row = row.replace ("%%ITEMNO%%", item.no);
								}
								
								// ITEMDESCRIPTION
								{
									row = row.replace ("%%ITEMDESCRIPTION%%", item.description);
								}
								
								// ITEMVAT
								{
									var vat = "";
									if (item.vat)
									{					
										row = row.replace ("%%ITEMVAT%%", "&#10004;");
									}
									else
									{
										row = row.replace ("%%ITEMVAT%%", "");
									}
								}
								
								// ITEMAPPRAISAL1
								{
									row = row.replace ("%%ITEMAPPRAISAL1%%", item.appraisal1);
								}
								
								// ITEMAPPRAISAL2
								{
									row = row.replace ("%%ITEMAPPRAISAL2%%", item.appraisal2);
								}
								
								// ITEMAPPRAISAL3
								{
									row = row.replace ("%%ITEMAPPRAISAL3%%", item.appraisal3);
								}
								
								// ITEMMINIMUMBID
								{
									row = row.replace ("%%ITEMMINIMUMBID%%", item.minimumbid);
								}
								
								// CUSTOMERNAME
								{
									row = row.replace ("%%CUSTOMERNAME%%", customer.name);
								}
								
								// CUSTOMERNO
								{
									row = row.replace ("%%CUSTOMERNO%%", customer.no);
								}
								
								// CUSTOMERPHONE
								{
									row = row.replace ("%%CUSTOMERPHONE%%", customer.phone);
								}
								
								// CUSTOMEREMAIL
								{
									row = row.replace ("%%CUSTOMEREMAIL%%", customer.email);
								}
												
								// BID / BUYER								
								{
									var bidcustomername = "";
									var bidcustomerno = "";
									var bidamount = "";
								
									if (item.currentbidid != SNDK.tools.emptyGuid)
									{
										var bid = didius.bid.load ({id: item.currentbidid});
										
										bidcustomername = bid.customer.name;
										bidcustomerno = bid.customer.no;
										bidamount = bid.amount;
									}
									
									// BIDCUSTOMERNAME
									{
										row = row.replace ("%%BIDCUSTOMERNAME%%", bidcustomername);
									}
										
									// BIDCUSTOMERNO
									{						
										row = row.replace ("%%BIDCUSTOMERNO%%", bidcustomerno);
									}
										
									// BIDAMOUNT
									{
										row = row.replace ("%%BIDAMOUNT%%", bidamount);
									}
								}
																											
								// Test if rows fit inside maxheight of page.
								content.innerHTML = render.replace ("%%ROWS%%", rows + row);
								
								// If rows exceed, use last amount of rows that fit.					
								if (content.offsetHeight > maxHeight)
								{												
									content.innerHTML = render.replace ("%%ROWS%%", rows);
									break;	
								}
																				
								rows += row;
								count++;	
							}									
							
							content.style.height = maxHeight  + "px";
							
							return count;
						}
							
						
						var c = 0;				
						while (c < items.length)
						{							
						 	c += page (c);				 				
						}		
												
						return print.contentDocument.body.innerHTML;
					};

	var data = render ({auction: attributes.auction, template: attributes.template});		
	
	var print = document.getElementById ("iframe.print");			
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
    	settings.title = "Didius Catalog";    		

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
