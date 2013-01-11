settlement : function (attributes)		
{					
	var Cc = Components.classes;
	var Ci = Components.interfaces;
	var Cu = Components.utils;
	var Cr = Components.results;

	var render = 	function (attributes)
					{
						var _case = attributes.case;
						var customer = didius.customer.load (_case.id);						
						var items = didius.item.list ({case: _case});
						
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
							
							// CUSTOMERINFO
							{
								var customerInfo = "";					
								customerInfo += customer.name +"<br>";
								customerInfo += customer.address1 +"<br>";
				
								if (customer.address2 != "")
								{
									customerInfo += customer.address1 +"<br>";					
								}
				
								customerInfo += customer.postcode +" "+ customer.city +"<br><br>";
								
								customerInfo += "Kunde nr. "+ customer.no +"<br><br>"
								
								customerInfo += "Tlf. "+ customer.phone +"<br>";
								customerInfo += "Email "+ customer.email +"<br><br>";
								
								customerInfo += "Sag: "+ _case.title +"<br><br>";
								
								render = render.replace ("%%CUSTOMERINFO%%", customerInfo);					
								content.innerHTML = render;
							}
			
							// CUSTOMERBANKACCOUNT
							{
								render = render.replace ("%%CUSTOMERBANKACCOUNT%%", customer.bankregistrationno +" "+ customer.bankaccountno);
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
											row = row.replace ("%%BIDAMOUNT%%", items[idx].bidamount);
										}
								
										// COMMISSIONFEE
										{
											row = row.replace ("%%COMMISSIONFEE%%", items[idx].commissionfee);
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
								render = render.replace ("%%TOTALSALE%%", totalSale.toFixed (2));
								render = render.replace ("%%TOTALCOMMISSIONFEE%%", totalCommissionFee.toFixed (2));
								render = render.replace ("%%TOTALTOTAL%%", (totalSale + totalCommissionFee).toFixed (2));
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