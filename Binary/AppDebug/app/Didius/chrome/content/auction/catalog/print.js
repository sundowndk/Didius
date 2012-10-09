Components.utils.import("resource://didius/js/app.js");

var main = 
{
	init : function ()
	{	
//	   var doc = null;
//   if(iframe.contentDocument)
//      // Firefox, Opera
//      doc = iframe.contentDocument;
//   else if(iframe.contentWindow)
//      // Internet Explorer
//      doc = iframe.contentWindow.document;
//   else if(iframe.document)
//      // Others?
//      doc = iframe.document;
 
//   if(doc == null)
//      throw "Document not initialized";
 
//   doc.open();
//   doc.write("Hello IFrame!");
//   doc.close();
 
//   var div = doc.createElement("div");
//   div.style.width = "50px"; div.style.height = "50px";
//   div.style.border = "solid 1px #000000";
//   div.innerHTML = "Hello IFrame!";
//   doc.body.appendChild(div);
	
			var sortArrayHash = function (array, key, direction)
							{
								if (direction == "numeric")
								{
									compareFunc = 	function compare (first, second)
													{	
														return first[key]-second[key];
													} 
								}
								else if (direction == "ascending") 
								{																					
									compareFunc = 	function (first, second) 
													{       									
														if (first[key].toLowerCase () < second[key].toLowerCase ())
														{
															return -1;	
														}
													
														if (first[key].toLowerCase () > second[key].toLowerCase ())
														{
															return 1;	
														}
														return 0;      								
													}													
								} 								
								else 
								{  					
									compareFunc = 	function (second, first) 
													{    									    							
														if (first[key].toLowerCase () < second[key].toLowerCase ())
														{
															return -1;	
														}
									
														if (first[key].toLowerCase () > second[key].toLowerCase ())
														{
															return 1;	
														}
													}
								}
		
								array.sort (compareFunc);						
							};
	

					
			var items = didius.item.list ({auction: main.current});	
	
	
			sortArrayHash (items, "catalogno", "numeric");
	
			var printframe = document.getElementById ("printframe");
			var iframeDocument = printframe.contentDocument;

			var pageCount = 1;

			var page = function (from)
			{
				var container = iframeDocument.createElement ("div");
				container.className = "ContainerA4";
				iframeDocument.body.appendChild (container);
									
				var header = iframeDocument.createElement ("div");
				header.className ="Header";
				header.innerHTML = "Auktionskatalog, Waldemarsvej 1, 4296 Nyrup Sjælland<br>lørdag, 05. maj 2012";
			
				var footer = iframeDocument.createElement ("div");
				footer.className ="Footer";
				footer.innerHTML = "Tilmeld dig vores nyhedsmail på www.york-auktion.dk, så for du automatisk besked om næste auktion<br>Side "+ pageCount++;
			
				container.appendChild (header);
				
					
				var content = iframeDocument.createElement ("div")
				content.className = "PrintContent";
				container.appendChild (content);
				
				container.appendChild (footer);
			
				var containerHeight = container.offsetHeight;
				var headerHeight = header.offsetHeight;
				var footerHeight = footer.offsetHeight;

				var maxHeight = containerHeight - headerHeight - footerHeight;
			
				sXUL.console.log ("headerheight:"+ headerHeight)
				sXUL.console.log ("maxheight:"+ maxHeight)
			
				var table = iframeDocument.createElement ("table");
				table.className = "Table";
				
				content.appendChild (table);
			
				var height = 0;
				var line = 0;
				var total = items.length;				
				
				var count = 0;
				
				{
					var tr = iframeDocument.createElement ("tr");
					table.appendChild (tr);
										
					var catalogno = iframeDocument.createElement ("td");
					catalogno.className = "CellCatalogNo ColumnHeader";
					catalogno.innerHTML = "Katalog nr.";
					tr.appendChild (catalogno);
										
					var description = iframeDocument.createElement ("td");
					description.className = "CellDescription ColumnHeader";
					description.innerHTML = "Salgsgenstand";
					tr.appendChild (description);
										
					var notes = iframeDocument.createElement ("td");
					notes.className = "CellNotes ColumnHeader";
					notes.innerHTML = "Notat";
					tr.appendChild (notes);				
				}
						
				for (var idx = from; idx < total; idx++)
				{									
					var tr = iframeDocument.createElement ("tr");
					table.appendChild (tr);
										
					var catalogno = iframeDocument.createElement ("td");
					catalogno.className = "CellCatalogNo";
					catalogno.innerHTML = items[idx].catalogno;
					tr.appendChild (catalogno);
										
					var description = iframeDocument.createElement ("td");
					description.className = "CellDescription";
					description.innerHTML = items[idx].description;
					tr.appendChild (description);
										
					var notes = iframeDocument.createElement ("td");
					notes.className = "CellNotes";
					notes.innerHTML = "&nbsp;";
					tr.appendChild (notes);
										
					sXUL.console.log (content.offsetHeight)
															
					if (content.offsetHeight > maxHeight)
					{
						table.removeChild (tr);
						break;	
					}
										
					count++;
				}								
				
				return count;														
			}
			
			var bla = page (0);
			page (bla);
			

//	console.log (maxHeight);

//	for (i=0; i<175; i++)
//	{
//		var e1 = document.createElement ("div");
//		e1.className = "row";
//		e1.innerHTML = "Line "+i		
		
//		content.appendChild (e1);
		
//		height += e1.offsetHeight


//		if (height > maxHeight)
//		{
		

//			height = 0;
//			console.log ("break at: "+ i)
//						break;
//		}
		
//		console.log (e1.offsetHeight);
//	}			
			
						   
//		<div id="container" style="width: 210mm; height: 287mm; page-break-after:always; display: block; background: #aaa;">
//			<div id="header" style="height: 60px; text-align: center;";>
//				Auktionskatalog, Waldemarsvej 1, 4296 Nyrup Sjælland<br>
//				lørdag, 05. maj 2012								
//			</div>
//			
//			<div id="content">
//				
//			</div>
//			
//			<div id="footer" style="height: 20px; padding-top: 20px; text-align: center;">
//				Tilmeld dig vores nyhedsmail på www.york-auktion.dk, så for du automatisk besked om næste auktion<br>
//				Side 1
//			</div>
//		</divs>						   						   						   
						   
						   
			
			
//			var table = doc.createElement ("table");
//			table.style.width = "210mm";
//			table.style.height = "297mm";
//			table.style.border = "solid";
//			table.style.pageBreakAfter = "always";
			
//			for (i=0; i<5; i++)
//			{
//				var row = doc.createElement ("tr");
//				
//				var cell = doc.createElement ("td");
//				cell.innerHTML = "Bla bla bla"
//				row.appendChild (cell)
//				
//				table.appendChild (row);
//			}
//			
//			doc.body.appendChild (table);

			
		///	netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			
  // 			var nsIPrintSettings = Components.classes["@mozilla.org/gfx/printsettings-service;1"].getService(Components.interfaces.nsIPrintSettingsService).newPrintSettings;
   			
//   			nsIPrintSettings.printSilent = true;
 //  			nsIPrintSettings.printToFile = true;
   //			nsIPrintSettings.toFileName = "/home/sundown/test_silent_print_ff.pdf";
   	//		nsIPrintSettings.outputFormat = 2;
   			
//   			var browserPrint = window.content.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIWebBrowserPrint);
//			browserPrint.print(nsIPrintSettings, null);						
									
												
																		
			//printframe.focus();
			//printframe.print();
			
				//PrintUtils.gPrintSettingsAreGlobal = true;

						
						
						
		
				var settings = PrintUtils.getPrintSettings();
				
				
				settings.headerStrLeft = "";
				settings.headerStrCenter = "";
				settings.headerStrRight = "";
				settings.footerStrLeft = "";
				settings.footerStrCenter = "";
				settings.footerStrRight = "";
				
				settings.marginLeft = 0.5;
				settings.marginRight = 0.5;
				settings.marginTop = 0.5;
				settings.marginBottom = 0.5;
				settings.shrinkToFit = true;
				
				settings.paperName =  "iso_a4";
				settings.paperWidth = "210.00";
				settings.paperHeight = "297.00";
				
				//sXUL.console.log (settings.paperWidth);				
				
    var doc = document.getElementById("printframe")
    var req = doc.contentWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor);
    var wbprint = req.getInterface(Components.interfaces.nsIWebBrowserPrint);
    
    wbprint.print(settings, null);				
				
				///ettings.setPaperName("Legal");
//				settings.headerStrRight = "bla bla ";
				
//				sXUL.console.log (gPrintSettingsAreGlobal)
			
			//PrintUtils.initPrintSettingsFromPrefs (settings, false);
			
			//ttings.docURL = "asdfasdasdfasdf";  // suppress URL on printout
			//settings.footerStrRight = " ";
		//	sXUL.console.log (settings.printSettings ())
									
//			for (index in settings)
//			{
//				sXUL.console.log (index)
//			}
			
//			PrintUtils.printPreview(document.getElementById("printframe").contentWindow)
		
	//	PrintUtils.showPageSetup ()
				
		//	PrintUtils.print (document.getElementById("printframe").contentWindow)
			
			//window.print ();
			//document.getElementById("printframe").contentWindow.print();
			
				
	}	
}
