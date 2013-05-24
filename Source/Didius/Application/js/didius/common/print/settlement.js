settlement : function (attributes)
{	
	var Cc = Components.classes;
	var Ci = Components.interfaces;
	var Cu = Components.utils;
	var Cr = Components.results;

	var render = 	function (attributes)
					{							
						var customer = didius.customer.load (attributes.settlement.customerid)
						var auction = didius.auction.load (attributes.settlement.auctionid);
																							
																															
						var template = didius.helpers.parsePrintTemplate (didius.settings.get ({key: "didius_template_settlement"}));
						
						var print = document.getElementById ("iframe.print");
						print.contentDocument.body.innerHTML = " ";
						
						var pageCount = 1;									
																							
						var contentType1 =	function ()
											{
												var rows = new Array ();			
											
											
												var page = function (from)
												{
													var totalsize = 0;
												
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
													
													// CUSTOMERVATNO
													{
														if (customer.vat)
														{
															render = render.replace ("%%CUSTOMERVATNO%%", customer.vatno);
														}
														else
														{
															render = render.replace ("%%CUSTOMERVATNO%%", "");
														}
													}
																										
													// AUCTIONINFO
													{
														var auctioninfo = template.auctioninfo;
																											
														// AUCTIONNO
														{
															auctioninfo = auctioninfo.replace ("%%AUCTIONNO%%", auction.no);
														}
															
														// AUCTIONTITLE
														{
															auctioninfo = auctioninfo.replace ("%%AUCTIONTITLE%%", auction.title);
														}															
													
														render = render.replace ("%%AUCTIONINFO%%", auctioninfo);
													}
																																
													// SETTLEMENTNO
													{
														render = render.replace ("%%SETTLEMENTNO%%", attributes.settlement.no);
													}
													
													// SETTLEMENTDATE
													{															
														var date = SNDK.tools.timestampToDate (attributes.settlement.createtimestamp)
														render = render.replace ("%%SETTLEMENTDATE%%", SNDK.tools.padLeft (date.getDate (), 2, "0") +"-"+ SNDK.tools.padLeft ((date.getMonth () + 1), 2, "0") +"-"+ date.getFullYear ());
													}
													
													// CUSTOMERBANKACCOUNT
													{
														render = render.replace ("%%CUSTOMERBANKACCOUNT%%", customer.bankregistrationno +" "+ customer.bankaccountno);
													}
													
													// CASENO
													{
														render = render.replace ("%%CASENO%%", attributes.settlement.caseno);
													}
													
													// REFERENCE
													{
														render = render.replace ("%%REFERENCE%%", attributes.settlement.reference);
													}
													
													content.innerHTML = render;	
															
													// ROWS
													{
														// Add data rows.
														var blabla = "";
														var count = 0;
																				
														for (var idx = from; idx < rows.length; idx++)
														{							
															var row = rows[idx];				
															content.innerHTML = render.replace ("%%ROWS%%", blabla + row);
																												
															sXUL.console.log ("********************")
															sXUL.console.log (row)
															sXUL.console.log ("********************")
																																																																																						
															if ((page.offsetHeight - print.contentDocument.getElementById ("PageFooter").offsetHeight - print.contentDocument.getElementById ("PageHeader").offsetHeight - 10) <= (content.offsetHeight))
															{   																																				
															
																render = render.replace ("%%ROWS%%", blabla);																																																															
																content.innerHTML = render;																																														
																
																break;	
															}
																						
															blabla += row;																	
															count++;						
														}
														
														//sXUL.console.log (pageCount +" "+ (page.offsetHeight - print.contentDocument.getElementById ("PageFooter").offsetHeight - print.contentDocument.getElementById ("PageHeader").offsetHeight) +" < "+ content.offsetHeight)
														
														render = render.replace ("%%ROWS%%", blabla);													
														content.innerHTML = render;
													}
															
													return count;				
												}
																																			
																
												
												
												for (idx in attributes.settlement.lines)
												{
													var row = template.row;
																																													
													// TEXT
													{
														row = row.replace ("%%TEXT%%", attributes.settlement.lines[idx].text);
													}		
													
													// AMOUNT
													{
														row = row.replace ("%%AMOUNT%%", attributes.settlement.lines[idx].amount.toFixed (2));
													}
																																
													// VATAMOUNT
													{
														row = row.replace ("%%VATAMOUNT%%", attributes.settlement.lines[idx].vatamount.toFixed (2));
													}
													
													// COMMISSIONFEE
													{
														row = row.replace ("%%COMMISSIONFEE%%", attributes.settlement.lines[idx].commissionfee.toFixed (2));
													}					
													
													// VATCOMMISSIONFEE
													{
														row = row.replace ("%%VATCOMMISSIONFEE%%", attributes.settlement.lines[idx].vatcommissionfee.toFixed (2));
													}					
													
													// TOTAL
													{
														row = row.replace ("%%TOTAL%%", attributes.settlement.lines[idx].total.toFixed (2));
													}		
													
													rows[rows.length] = row;
												}
												
												// TOTAL
												{																										
													var row = template.total;
													row = row.replace ("%%TOTAL%%", template.total);
													row = row.replace ("%%TOTALSALE%%", attributes.settlement.sales.toFixed (2));
													row = row.replace ("%%TOTALCOMMISSIONFEE%%", attributes.settlement.commissionfee.toFixed (2));
													row = row.replace ("%%TOTALVAT%%", attributes.settlement.vat.toFixed (2));
													row = row.replace ("%%TOTALTOTAL%%", attributes.settlement.total.toFixed (2));
													rows[rows.length] = row;
												}				
																					
												// DISCLAIMER
												{													
													rows[rows.length] = template.disclaimer;
												}		
												
											
												
											
												var output = "";
												var c = 0;				
												//while (c < attributes.settlement.lines.length)
												while (c < rows.length)
												{																													
								 					c += page (c);						 				
									 				
									 				output += print.contentDocument.body.innerHTML;
									 				print.contentDocument.body.innerHTML = " ";	
												}					
												
																								
												
												return output;
											};
											
											
											
						return contentType1 ();											
					};
					
	var data = "";
																																																
	if (attributes.settlement)
	{
		data = render ({settlement: attributes.settlement});
	}
	else if (attributes.settlements)
	{
		
		for (index in attributes.settlements)
		{
			sXUL.console.log (index)
			data += render ({settlement: attributes.settlements[index]});
		}			
	}
	sXUL.console.log (data)
	var print = document.getElementById ("iframe.print");
	print.contentDocument.body.innerHTML = data;		
							
	var settings = PrintUtils.getPrintSettings ();
																																								
	settings.marginLeft = 0.0;
	settings.marginRight = 0.0;
	settings.marginTop = 0.0;
	settings.marginBottom = 0.0;
	settings.shrinkToFit = true;		
	settings.paperName =  "iso_a4";
	//settings.paperName =  "iso_a5";
	settings.paperWidth = 210;
	settings.paperHeight = 297
	//settings.paperWidth = 148;
	//settings.paperHeight = 210
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
	
	settings.title = "DidiusSettlement";
		
	if (attributes.mail) 
	{
		var localDir = sXUL.tools.getLocalDirectory ();
		//var filename = localDir.path + app.session.pathSeperator +"temp"+ app.session.pathSeperator + main.current.id;
		var filename = localDir.path + app.session.pathSeperator + attributes.settlement.id +".pdf";
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
								sXUL.tools.fileUpload ({postUrl: didius.runtime.ajaxUrl, fieldName: "file", filePath: filename, additionalFields: {cmd: "function", "cmd.function": "Didius.Helpers.MailSettlement", settlementid: attributes.settlement.id}, onLoad: onLoad, onProgress: onProgress, onError: onError});			
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

