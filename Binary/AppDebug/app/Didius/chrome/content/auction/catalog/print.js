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
	
	
			var printframe = document.getElementById ("printframe");
			var doc = printframe.contentDocument;
						   
						   
						   
			
			
			var table = doc.createElement ("table");
			table.style.width = "210mm";
			table.style.height = "297mm";
			table.style.border = "solid";
			table.style.pageBreakAfter = "always";
			
			for (i=0; i<5; i++)
			{
				var row = doc.createElement ("tr");
				
				var cell = doc.createElement ("td");
				cell.innerHTML = "Bla bla bla"
				row.appendChild (cell)
				
				table.appendChild (row);
			}
			
			doc.body.appendChild (table);

			
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
				
				settings.marginLeft = 0;
				settings.marginRight = 0;
				settings.marginTop = 0;
				settings.marginBottom = 0;
				settings.shrinkToFit = true;
				
				
    var doc = document.getElementById("printframe")
    var req = doc.contentWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor);
    var wbprint = req.getInterface(Components.interfaces.nsIWebBrowserPrint);
    
    //wbprint.print(settings, null);				
				
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
