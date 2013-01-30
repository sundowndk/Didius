Components.utils.import("resource://didius/js/app.js");

// ----------------------------------------------------------------------------------------------------------
// | MAIN																									|
// ----------------------------------------------------------------------------------------------------------
var main =
{	
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	invoice : null,	
	creditnote : null,
	customer : null,	

	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{	
		main.itemsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("items"), sortColumn: "no", sortDirection: "descending"});
	
		var onInit =	function ()
						{
							try
							{
								main.invoice = didius.invoice.load (window.arguments[0].invoiceId);
								main.customer = didius.customer.load (main.invoice.customerid);
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
						};
						
		setTimeout (onInit, 1);
	},
			
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{		
		try
		{		
			main.creditnote = didius.creditnote.create ({invoiceId: main.invoice.id, simulate: true});
	
			main.itemsTreeHelper.disableRefresh ();
			for (idx in main.creditnote.lines)
			{
				var line = main.creditnote.lines[idx];
				var data = {};
				data.id = line.id;
				data.no = line.no;				
				data.text = line.text;
				data.vat = line.vat.toFixed (2) +" kr.";				
				data.amount = line.amount.toFixed (2) +" kr.";				
				data.total = line.total.toFixed (2) +" kr.";				
							
				main.itemsTreeHelper.addRow ({data: data});
			}
			main.itemsTreeHelper.enableRefresh ();
	
			document.getElementById ("totalSale").value = main.creditnote.sales;			
			document.getElementById ("totalVat").value = main.creditnote.vat;
			document.getElementById ("totalTotal").value = main.creditnote.total;									
		}
		catch (exception)
		{
			app.error ({exception: exception})		
		}
						
		if (main.creditnote != null)
		{
			if (main.creditnote.lines.length > 0)
			{
				document.getElementById ("print").disabled = false;
				document.getElementById ("mail").disabled = false;				
				document.getElementById ("create").disabled = false;
			}
			
			document.getElementById ("totalSale").disabled = false;			
			document.getElementById ("totalVat").disabled = false;						
			document.getElementById ("totalTotal").disabled = false;
			
			if (main.customer.email == "")
			{
				document.getElementById ("mail").disabled = false;
				document.getElementById ("mail").checked = false;				
			}
		}
		else
		{
			document.getElementById ("totalSale").disabled = true;			
			document.getElementById ("totalVat").disabled = true;						
			document.getElementById ("totalTotal").disabled = true;
		}
				
		document.getElementById ("close").disabled = false;
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | CREATE																								|	
	// ------------------------------------------------------------------------------------------------------	
	create : function ()
	{
		main.creditnote = didius.creditnote.create ({invoiceId: main.invoice.id});
					
		var progresswindow = app.window.open (window, "chrome://didius/content/creditnote/progress.xul", "auction.creditnote.progress."+ main.creditnote.id, "", {});
										
		var workload = function ()
		{
			progresswindow.removeEventListener ("load", workload, false)
		
			var overallprogress = 0;
			var totalprogress = 1;
			
			var customers = new Array ();		
			var invoices = new Array ();
		
			//  Start
			var start =	function ()	
						{						
							worker1 ();
						};
								
			// Print invoice.
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
																																				
														setTimeout (worker2, 100);
													};
																							
								var onDone = 	function ()
												{
													nextWorker ();
												};
													
								if (document.getElementById ("print").checked)
								{
									didius.common.print.creditnote ({creditnote: main.creditnote , onDone: onDone});			
								}
								else
								{
									nextWorker ();
								}
							};
							
			// Mail invoice.
			var worker2 =	function ()
							{
								// Reset progressmeter #1.
								progresswindow.document.getElementById ("description1").textContent = "Sender ...";
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

								if (document.getElementById ("mail").checked)
								{																																				
									didius.common.print.creditnote ({creditnote: main.creditnote, mail: true, onDone: onDone});			
								}
								else
								{
									nextWorker ();
								}
							};							
				
			// Finish
			var finish =	function ()	
							{															
								progresswindow.close ();
								main.close ();
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