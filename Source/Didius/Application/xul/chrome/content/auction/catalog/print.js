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
			
			for (i=0; i<5; i++)
			{
				var row = doc.createElement ("tr");
				
				var cell = doc.createElement ("td");
				cell.innerHTML = "Bla bla bla"
				row.appendChild (cell)
				
				table.appendChild (row);
			}
			
			doc.body.appendChild (table);
			
			//printframe.focus();
			//printframe.print();
			
		
			var settings = PrintUtils.getPrintSettings();
			settings.docURL = "asdfasdasdfasdf";  // suppress URL on printout
			settings.footerStrRight = " ";
		//	sXUL.console.log (settings.printSettings ())
									
//			for (index in settings)
//			{
//				sXUL.console.log (index)
//			}
			
//			PrintUtils.printPreview(document.getElementById("printframe").contentWindow)
			
			//PrintUtils.print (document.getElementById("printframe").contentWindow)
			
			//window.print ();
			document.getElementById("printframe").contentWindow.print();
			
				
	}	
}
