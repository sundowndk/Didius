label : function (attributes)
{	
	var Cc = Components.classes;
	var Ci = Components.interfaces;
	var Cu = Components.utils;
	var Cr = Components.results;

	var render = 	function (attributes)
					{											
						//attributes.customer = didius.customer.load (attributes.invoice.customerid);
					
						var template = didius.helpers.parsePrintTemplate (didius.settings.get ({key: "didius_template_label"}));					
						//var template = didius.helpers.parsePrintTemplate (sXUL.tools.fileToString ("chrome://didius/content/templates/label.tpl"));
	
						var print = app.mainWindow.document.createElement ("iframe");
						app.mainWindow.document.getElementById ("PrintHolder").appendChild (print);
												
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
							var render = template.page.replace ("%%PAGENUMBER%%", pageCount++);					
							content.innerHTML = render;
						
							// Caluculate page maxheight for printing.										
//							var maxHeight = page.offsetHeight 
//							var maxHeight2 = page.offsetHeight;
																									
							// ITEMNO
							{
								render = render.replace ("%%ITEMNO%%", attributes.item.no);
								content.innerHTML = render;
							}										
							
							// ITEMCATALOGNO
							{
								render = render.replace ("%%ITEMCATALOGNO%%", attributes.item.catalogno);
								content.innerHTML = render;
							}										
							
							// ITEMDESCRIPTION
							{
								render = render.replace ("%%ITEMDESCRIPTION%%", attributes.item.description);
								content.innerHTML = render;
							}																	
							
																					
						//	return count;				
						}

						page ();																																																			
																																																																																																																																																						
						var result = print.contentDocument.body.innerHTML;
						app.mainWindow.document.getElementById ("PrintHolder").removeChild (print);
						return result;
					};

	var data = "";
																			
//	if (attributes.invoice)
//	{
		//data = render ({invoice: attributes.invoice});
		
		for (var index in attributes.items)
		{		
			data += render ({item: attributes.items[index]});
		}
//	}
//	else if (attributes.invoices)
//	{
//		for (index in attributes.invoices)
//		{
//			data += render ({invoice: attributes.invoices[index]});
//		}			
//	}
	
	//var template = didius.helpers.parsePrintTemplate (sXUL.tools.fileToString ("chrome://didius/content/templates/invoice.tpl"));										
	var print = app.mainWindow.document.createElement ("iframe");
	app.mainWindow.document.getElementById ("PrintHolder").appendChild (print);
		
	print.contentDocument.body.innerHTML = data;
					
	var settings = PrintUtils.getPrintSettings ();
			
	//ppd_17x54					
	//ppd_17x87
	//ppd_23x23
	//ppd_29x42
	//ppd_29x90
	//ppd_38x90
	//ppd_39x48
	//ppd_52x29
	//ppd_62x29
	//ppd_62x100
	//ppd_12Dia
	//ppd_24Dia
	//ppd_12X1
	//ppd_29X1
	//ppd_62X1
	//ppd_12X2
	//ppd_29X2
	//ppd_62X2
	//ppd_12X3
	//ppd_29X3
	//ppd_62X3
	//ppd_12X4
	//ppd_29X4
	//ppd_62X4
	//ppd_50X1
	//ppd_54X1
	//ppd_54X1
	//ppd_38X1
	//ppd_23x23
	//ppd_39x48
	//ppd_52x29
	//ppd_38X2
	//ppd_50X2
	//ppd_54X2
	//ppd_38X3
	//ppd_50X3
	//ppd_54X3
	//ppd_38X4
	//ppd_50X4
	//ppd_54X4
	
																																																																																																								
	settings.marginLeft = 0.28;
	settings.marginRight = 0.29;
	settings.marginTop = 0.14;
	settings.marginBottom = 0.14;
	settings.shrinkToFit = true;
	
	settings.unwriteableMarginTop = 0;
    settings.unwriteableMarginRight = 0;
    settings.unwriteableMarginBottom = 0;
    settings.unwriteableMarginLeft = 0;

		
	settings.orientation = Ci.nsIPrintSettings.kLandscapeOrientation;
	settings.paperSizeUnit = Ci.nsIPrintSettings.kPaperSizeMillimeters;
	//settings.paperName = "ppd_62x29";
	settings.paperWidth = 62;
	settings.paperHeight = 100;
	
	//settings.setPaperSizeType = Ci.nsIPrintSettings.kPaperSizeDefined;  	
  	//settings.setPaperSize = Ci.nsIPrintSettings.kPaperSizeNativeData;
	
	
	
	
		
	attributes = {};
		
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

