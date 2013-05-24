catalog : function (attributes)
{	
	var Cc = Components.classes;
	var Ci = Components.interfaces;
	var Cu = Components.utils;
	var Cr = Components.results;

	var render = 	function (attributes)
					{						
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
																																																
						
						var print = document.getElementById ("iframe.print");
						print.contentDocument.body.innerHTML = " ";
						
						var pageCount = 1;
						
						var cases = new Array ();
						var bids = new Array ();
						
						var contentType1 = 	function ()
											{												
												var page = function (from)
												{
													// Add styles.																		
													var styles = print.contentDocument.createElement ("style");					
													print.contentDocument.body.appendChild (styles);					
													styles.innerHTML = template.styles;
											
													// Create page.				
													var page1 = print.contentDocument.createElement ("div");
													page1.className = "Page A4";
													print.contentDocument.body.appendChild (page1);
													
													var page = print.contentDocument.createElement ("div");
													page.className = "test";
													page1.appendChild (page);
													
													
													// Page
													{							
														var render = "";
														render += template.header;
														render += template.footer;									
													
														// PAGENUMBER
														{				
															render = render.replace ("%%PAGENUMBER%%", pageCount++);
														}
														
														// AUCTIONBEGIN
														{																											
															var begin = new Date (Date.parse (main.auction.begin));
															render = render.replace ("%%AUCTIONBEGIN%%", begin.getDate () +"-"+ (begin.getMonth () + 1)  +"-"+ begin.getFullYear ());				
														}			

														// AUCTIONBEGINTIME	
														{															
															var begin = new Date (Date.parse (main.auction.begin));																			
															render = render.replace ("%%AUCTIONBEGINTIME%%", SNDK.tools.padLeft (begin.getHours (), 2, "0") +":"+ SNDK.tools.padLeft (begin.getMinutes (), 2, "0"));														
														}	
																												
														page.innerHTML = render;
													}
													
													// Add content holder.																						
													var content = print.contentDocument.createElement ("div")
													content.className = "PrintContent";
													content.style.top = print.contentDocument.getElementById ("PageHeader").offsetHeight;
													page.appendChild (content);

													var render = template.contenttype1.replace ("%%CONTENTTYPE1%%", template.contenttype1).replace ("%%CONTENTTYPE2%%", "");
							
													content.innerHTML = render;	
													
													// ROWS
													{
														// Add data rows.
														var rows = "";	
														var count = 0;				
														for (var idx = from; idx < items.length; idx++)
														{							
															var item = items[idx];				
																													
															if (cases[item.caseid] == null)
															{																
																cases[item.caseid] = didius.case.load ({id: item.caseid});
															}
															
															var case_ = cases[item.caseid];
															
															var customer = app.data.customers[case_.customerid];																													
																																																																						
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
																var bidamount = 0;
															
																if (item.currentbidid != SNDK.tools.emptyGuid)
																{
																	if (bids[item.currentbidid] == null)
																	{																
																		bids[item.currentbidid] = didius.bid.load ({id: item.currentbidid});
																	}
																																																													
																	var bid = bids[item.currentbidid];
																	
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
																									
															content.innerHTML = render.replace ("%%ROWS%%", rows + row);																									

															if ((page.offsetHeight - print.contentDocument.getElementById ("PageFooter").offsetHeight - print.contentDocument.getElementById ("PageHeader").offsetHeight - 10) <= (content.offsetHeight))		
//															if ((page.offsetHeight - print.contentDocument.getElementById ("PageFooter").offsetHeight - print.contentDocument.getElementById ("PageHeader").offsetHeight ) < (content.offsetHeight))
															{   
																render = render.replace ("%%ROWS%%", rows);
																content.innerHTML = render;
																break;										
															}												
																																												
															rows += row;																										
															count++;	
															
															app.thread.update ();						
														}																		
													
														render = render.replace ("%%ROWS%%", rows);											
														content.innerHTML = render;
													}
													
													return count;	
												}		
														
												var output = "";
												var c = 0;		
												while (c < items.length)
												{							
									 				c += page (c);	
									 				
									 				//output += print.contentDocument.body.innerHTML;
						 							//print.contentDocument.body.innerHTML = " ";
						 							
						 							app.thread.update ();							 	
						 							attributes.progressWindow.document.getElementById ("description1").textContent = "Generere sider ...";
						 							attributes.progressWindow.document.getElementById ("progressmeter1").mode = "determined";
													attributes.progressWindow.document.getElementById ("progressmeter1").value = (c / items.length) * 100;
												}	
												
												return print.contentDocument.body.innerHTML;
											};		
								
							return contentType1 ();			
					};

	var data = render ({auction: attributes.auction, template: attributes.template, progressWindow: attributes.progressWindow});		
	
	var print = document.getElementById ("iframe.print");
	print.contentDocument.body.innerHTML = data;		
					
	var settings = PrintUtils.getPrintSettings ();
																																								
	settings.marginLeft = 0;
	settings.marginRight = 0;
	settings.marginTop = 0;
	settings.marginBottom = 0;
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
	
	settings.title = "DidiusCatalog";
	
	attributes.progressWindow.document.getElementById ("description1").textContent = "Udskriver sider ...";
 	attributes.progressWindow.document.getElementById ("progressmeter1").mode = "undetermined";
	attributes.progressWindow.document.getElementById ("progressmeter1").value = 0;
		
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
		sXUL.tools.print ({contentWindow: print.contentWindow, settings: settings, onDone: attributes.onDone, onError: attributes.onError});	
	}		
}
