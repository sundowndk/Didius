Components.utils.import("resource://didius/js/app.js");

// ----------------------------------------------------------------------------------------------------------
// | MAIN																									|
// ----------------------------------------------------------------------------------------------------------
var main =
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	creditnote : null,
	customer : null,

	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{	
		main.linesTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("tree.lines"), sortColumn: "no", sortDirection: "descending"});	
	 	 	
		var onInit =	function ()
						{
							try
							{
								main.creditnote = didius.creditnote.load ({id: window.arguments[0].creditnoteId});
								main.customer = didius.customer.load (main.creditnote.customerid);			
							}
							catch (error)
							{
								app.error ({exception: error})
								main.close ();
								return;
							}
							
							onDone ();
						};
						
		var onDone =	function ()
						{
							main.set ();
						}
	
		setTimeout (onInit, 1);
	},
			
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{				
		document.title = "Kreditnota: "+ main.creditnote.no +" ["+ main.customer.name +"]";
		document.getElementById ("datepicker.createdate").dateValue = SNDK.tools.timestampToDate (main.creditnote.createtimestamp);
		
		document.getElementById ("textbox.no").value = main.creditnote.no;
		document.getElementById ("textbox.customername").value = main.customer.name;

		main.linesTreeHelper.disableRefresh ();
		for (idx in main.creditnote.lines)
		{						
			var line = main.creditnote.lines[idx];
			
			var data = {};
			data["id"] = line.id;			
			data["no"] = line.no;
			data["text"] = line.text;
			data["amount"] = line.amount.toFixed (2)+ " kr.";			
			data["vat"] = line.vat.toFixed (2) +" kr.";
			data["total"] = line.total.toFixed (2) +" kr.";						
											
			main.linesTreeHelper.addRow ({data: data});
		}		
		main.linesTreeHelper.enableRefresh ();
				
		document.getElementById ("textbox.amount").value = main.creditnote.amount;
		document.getElementById ("textbox.vat").value = main.creditnote.vat;
		document.getElementById ("textbox.total").value = main.creditnote.total;
				
		document.getElementById ("button.print").disabled = false;
		
		if (main.customer.email != "")
		{
			document.getElementById ("button.mail").disabled = false;
		}
		
		document.getElementById ("button.close").disabled = false;
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | PRINT																								|	
	// ------------------------------------------------------------------------------------------------------
	print : function ()
	{
		var progresswindow = app.window.open (window, "chrome://didius/content/creditnote/progress.xul", "auction.creditnote.progress."+ main.creditnote.id, "", {});	
										
		var workload = function ()
		{
			progresswindow.removeEventListener ("load", workload, false)
		
			var overallprogress = 0;
			var totalprogress = 1;
			
			var customers = new Array ();		
			var invoices = new Array ();
		
			var start =	function ()	
						{						
							worker1 ();
						};
								
			// Email invoice.
			var worker1 =	function ()
							{
								// Reset progressmeter #1.
								progresswindow.document.getElementById ("description1").textContent = "Udskriver ...";
								progresswindow.document.getElementById ("progressmeter1").mode = "undetermined"
								progresswindow.document.getElementById ("progressmeter1").value = 0;
																						
								var nextWorker =	function ()
													{
														// Update progressmeter #1
														overallprogress++;
														progresswindow.document.getElementById ("progressmeter1").mode = "determined"
														progresswindow.document.getElementById ("progressmeter1").value = (overallprogress / totalprogress) * 100;
																																				
														setTimeout (finish, 100);
													};
																							
								var onDone = 	function ()
												{
													nextWorker ();
												};
													
								didius.common.print.creditnote ({creditnote: main.creditnote, onDone: onDone});			
							};
																
			var finish =	function ()	
							{															
								progresswindow.close ();
							};
			
			// Start worker1;				
			setTimeout (start, 100);
		}
		
		progresswindow.addEventListener ("load", workload);		
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | MAIL																								|	
	// ------------------------------------------------------------------------------------------------------
	mail : function ()
	{
		var progresswindow = app.window.open (window, "chrome://didius/content/creditnote/progress.xul", "auction.creditnote.progress."+ main.creditnote.id, "", {});	
										
		var workload = function ()
		{
			progresswindow.removeEventListener ("load", workload, false)
		
			var overallprogress = 0;
			var totalprogress = 1;
			
			var customers = new Array ();		
			var creditnote = new Array ();
		
			var start =	function ()	
						{						
							worker1 ();
						};
								
			// Email creditnote.
			var worker1 =	function ()
							{
								// Reset progressmeter #1.
								progresswindow.document.getElementById ("description1").textContent = "Sender e-mail ...";
								progresswindow.document.getElementById ("progressmeter1").mode = "undetermined"
								progresswindow.document.getElementById ("progressmeter1").value = 0;
																						
								var nextWorker =	function ()
													{
														// Update progressmeter #1
														overallprogress++;
														progresswindow.document.getElementById ("progressmeter1").mode = "determined"
														progresswindow.document.getElementById ("progressmeter1").value = (overallprogress / totalprogress) * 100;
																																				
														setTimeout (finish, 100);
													};
																							
								var onDone = 	function ()
												{
													nextWorker ();
												};
													
								didius.common.print.creditnote ({creditnote: main.creditnote, mail: true, onDone: onDone});			
							};
																
			var finish =	function ()	
							{															
								progresswindow.close ();
							};
			
			// Start worker1;				
			setTimeout (start, 100);
		}
		
		progresswindow.addEventListener ("load", workload);		
	},	
		
	// ------------------------------------------------------------------------------------------------------
	// | CLOSE																								|	
	// ------------------------------------------------------------------------------------------------------
	close : function (force)
	{									
		// Close window.
		window.close ();
	}
}