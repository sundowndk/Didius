Components.utils.import("resource://didius/js/app.js");

var main = 
{
	init : function ()
	{	
	
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
			
			var getfile = function getContents(aURL)
			{
  				var ioService=Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
  	
  				var scriptableStream=Components.classes["@mozilla.org/scriptableinputstream;1"].getService(Components.interfaces.nsIScriptableInputStream);

  				var channel=ioService.newChannel(aURL,null,null);	
  				var input=channel.open();
  				scriptableStream.init(input);
  				var str=scriptableStream.read(input.available());
  				scriptableStream.close();
  				input.close();
  				return str;
  			}
			
			var blabla = getfile ("chrome://didius/content/templates/cataloglarge.tpl")
			//var blabla = getfile ("chrome://didius/content/templates/catalogsmall.tpl")
			
			var template = {};
			
			template.page = "";
			template.row = "";
			template.styles = "";
			
			blabla = blabla.split ("\n");
			
			var inloop = false;
			var block = "";
			for (idx in blabla)
			{
				if (blabla[idx].substring(0,2) == "//")
				{					
					continue;
				}
				
				if (block == "")
				{
					if (blabla[idx] == "#BEGINROWS")
					{
						block = "rows";
						continue;
					}
					
					if (blabla[idx] == "#BEGINSTYLES")
					{
						block = "styles";
						continue;
					}
				}
				
				if (blabla[idx] == "#ENDSTYLES")
				{
					block = "";
					continue;
				}
																									
				if (blabla[idx] == "#ENDROWS")
				{
					block = "";
					continue;
				}
			
				if (block == "")
				{
					template.page += blabla[idx] +"\n";
				}
				else if (block == "styles")
				{
					template.styles += blabla[idx] +"\n";
				}							
				else if (block == "rows")
				{
					template.row += blabla[idx] +"\n";
				}							
			}
			
			//sXUL.console.log (template.styles);
//			sXUL.console.log (template.row);
			
//			sXUL.console.log (template.row);
			
			//return;
																					
			//sXUL.console.log (blabla)
			printexternallist = false;
			printinternallist = false;
			
			printtest = true;
			
			if (printtest)
			{
				var pageCount = 1;			
				var print = document.getElementById ("printframe").contentDocument;
																
				var page = function (from)
				{
					// Add styles.																		
					var styles = print.createElement ("style");					
					print.body.appendChild (styles);					
					styles.innerHTML = template.styles;
				
					// Create page.				
					var page = print.createElement ("div");
					page.className = "Page A4";
					print.body.appendChild (page);
																									
					// Add content holder.																						
					var content = print.createElement ("div")
					content.className = "PrintContent";
					page.appendChild (content);
																				
					// Add inital content.
					var page2 = template.page.replace ("%%PAGENUMBER%%", pageCount++);					
					content.innerHTML = page2;
					
					// Caluculate page maxheight for printing.										
					var maxHeight = page.offsetHeight 
																	
					var count = 0;					
					var rows = "";
					var dummy = "";
					
					// Add data rows.																																					
					for (var idx = from; idx < items.length; idx++)
					{							
						var row = template.row;
												
						var case_ = didius.case.load (items[idx].caseid);
						var customer = didius.customer.load (case_.customerid)
						
						// Replace template placeholders.
						row = row.replace ("%%CATALOGNO%%", items[idx].catalogno); // CatalogNo
						row = row.replace ("%%DESCRIPTION%%", items[idx].description); // Description						
						
						row = row.replace ("%%APPRAISAL1%%", items[idx].appraisal1); // Appraisal1
						row = row.replace ("%%APPRAISAL2%%", items[idx].appraisal2); // Appraisal2
						row = row.replace ("%%APPRAISAL3%%", items[idx].appraisal3); // Appraisal3
						row = row.replace ("%%MINIMUMBID%%", items[idx].minimumbid); // Minimumbid
						
						row = row.replace ("%%CUSTOMERNAME%%", customer.name); // CustomerName						
						row = row.replace ("%%CUSTOMERNO%%", customer.no); // CustomerNo
						row = row.replace ("%%CUSTOMERPHONE%%", customer.phone); // CustomerPhome
						row = row.replace ("%%CUSTOMEREMAIL%%", customer.email); // CustomerEmail
									
						// Test if rows fit inside maxheight of page.																																																																																																																											
						dummy += row;						
						content.innerHTML = page2.replace ("%%ROWS%%", dummy);
																	
						// If rows exceed, use last amount of rows that fit.
						sXUL.console.log (content.offsetHeight);
						if (content.offsetHeight > maxHeight)
						{												
							content.innerHTML = page2.replace ("%%ROWS%%", rows);												
							break;	
						}
						
						rows += row;
						count++;						
					}									
					
					return count;
				}
				
				var c = 0;				
				while (c < items.length)
				{			
					sXUL.console.log (c)
				 	c += page (c);				 				
				}				
			}
			
			if (printinternallist)
			{
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
						catalogno.innerHTML = "kat.nr.";
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
						
						{
							var template = "";
							
							// Table
							template += "<table class='Table'>";
							
							// ColumnHeader
							template += "<tr>";
														
							// CatalogNo
							template += "<td class='CellCatalogNo ColumnHeader'>";
							template += "Kat. nr.";
							template += "</td>";							
							
							// Description							
							template += "<td class='CellDescription ColumnHeader'>";
							template += "Salgsgenstand";
							template += "</td>";							
							
							// Notes							
							template += "<td class='CellNotes ColumnHeader'>";
							template += "Notat";
							template += "</td>";
							
							template += "</tr>"
							
							// Columns
							template += "<tr>";
							
							// CatalogNo
							template += "<td class='CellCatalogNo'>";
							template += "%%CATALOGNO%%";
							template += "</td>";
							
							// Description
							template += "<td class='CellDescription'>";
							
								// InnerTable
								template += "<table class='InnerTable'>";														
							
								// ROW 1
								template += "<tr><td colspan='4'>";
								template += "%%DESCRIPTION%%";
								template += "</td></tr>";
							
								// ROW 2
								template += "<tr>";							
								template += "<td class='InnerTableLabel'>";
								template += "Vurdering 1:";
								template += "</td>";
								
								template += "<td class='InnerTableValue'>";
								template += "%%APPRAISAL1%%";
								template += "</td>";
							
								template += "<td class='InnerTableLabel'>";
								template += "Vurdering 2:";
								template += "</td>";
								
								template += "<td class='InnerTableValue'>";
								template += "%%APPRAISAL2%%";
								template += "</td>";							
								template += "</tr>";
							
								// ROW 3
								template += "<tr>";							
								template += "<td class='InnerTableLabel'>";
								template += "Vurdering 3:";
								template += "</td>";
								
								template += "<td class='InnerTableValue'>";
								template += "%%APPRAISAL3%%";
								template += "</td>";
								
								template += "<td class='InnerTableLabel'>";
								template += "Minimums bud:";
								template += "</td>";
								
								template += "<td class='InnerTableValue'>";
								template += "%%MINIMUMBID%%";
								template += "</td>";							
								template += "</tr>";
							
								// ROW 4
								template += "<tr>";							
								template += "<td class='InnerTableLabel'>";
								template += "Kunde:";
								template += "</td>";
								
								template += "<td class='InnerTableValue'>";
								template += "%%CUSTOMERNAME%%";
								template += "</td>";
								
								template += "<td class='InnerTableLabel'>";
								template += "Kunde nr.:";
								template += "</td>";
								
								template += "<td class='InnerTableValue'>";
								template += "%%CUSTOMERNO%%";
								template += "</td>";							
								template += "</tr>";
								
								// ROW 5
								template += "<tr>";							
								template += "<td class='InnerTableLabel'>";
								template += "Telefon:";
								template += "</td>";
							
								template += "<td class='InnerTableValue'>";
								template += "%%CUSTOMERPHONE%%";
								template += "</td>";
								
								template += "<td class='InnerTableLabel'>";
								template += "Email:";
								template += "</td>";
								
								template += "<td class='InnerTableValue'>";
								template += "%%CUSTOMEREMAIL%%";
								template += "</td>";							
								template += "</tr>";
								
								template += "</table>"
								
								template += "</td>";
							
							// Notes
							template += "<td class='CellNotes'>";							
							template += "</td>";
																					
						
//						text += items[idx].description +"<br>";
//						text += "Vurdering 1: "+ items[idx].appraisal1 +"<br>"
//						text += "Vurdering 2: "+ items[idx].appraisal2 +"<br>"
//						text += "Vurdering 3: "+ items[idx].appraisal3 +"<br>"
//						text += "Min. bud : "+ items[idx].minimumbid +"<br>"
						
						var case_ = didius.case.load (items[idx].caseid);
						var customer = didius.customer.load (case_.customerid)
						
//						text += "Sags nr.: "+ case_.no +"<br>";
//						text += "Kunde: "+ customer.name +" Kunde nr.: "+ customer.no +" <br>";
//						text += "Telefon :"+ customer.phone +" email: "+ customer.email +"<br>";
						
							description.innerHTML = template;
							tr.appendChild (description);
						}
											
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
			}
			
			if (printexternallist)
			{
	
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
			
			}
			

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
