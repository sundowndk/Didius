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
	auction : null,
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
								main.customer = didius.customer.load (window.arguments[0].customerId);																
								main.auction = didius.auction.load (window.arguments[0].auctionId);	
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
			main.invoice = didius.invoice.create ({auction: main.auction, customer: main.customer, simulate: true});
	
			main.itemsTreeHelper.disableRefresh ();
			for (idx in main.invoice.lines)
			{
				var line = main.invoice.lines[idx];
				var data = {};
				data.id = line.id;
				data.no = line.no;				
				data.text = line.text;
				data.amount = line.amount.toFixed (2) +" kr.";
				data.vat = line.vat.toFixed (2) +" kr.";
				data.commissionfee = line.commissionfee.toFixed (2) +" kr.";			
							
				main.itemsTreeHelper.addRow ({data: data});
			}
			main.itemsTreeHelper.enableRefresh ();
	
			document.getElementById ("totalSale").value = main.invoice.sales;
			document.getElementById ("totalCommissionFee").value = main.invoice.commissionfee;
			document.getElementById ("totalVat").value = main.invoice.vat;
			document.getElementById ("totalTotal").value = main.invoice.total;									
		}
		catch (exception)
		{
			app.error ({exception: exception})		
		}
						
		if (main.invoice != null)
		{
			if (main.invoice.lines.length > 0)
			{
				document.getElementById ("printInvoice").disabled = false;
				document.getElementById ("mailInvoice").disabled = false;				
				document.getElementById ("create").disabled = false;
			}
			
			document.getElementById ("totalSale").disabled = false;
			document.getElementById ("totalCommissionFee").disabled = false;			
			document.getElementById ("totalVat").disabled = false;						
			document.getElementById ("totalTotal").disabled = false;
			
			if (main.customer.email == "")
			{
				document.getElementById ("mailInvoice").disabled = false;
				document.getElementById ("mailInvoice").checked = false;				
			}
		}
		else
		{
			document.getElementById ("totalSale").disabled = true;
			document.getElementById ("totalCommissionFee").disabled = true;			
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
		main.invoice = didius.invoice.create ({auction: main.auction, customer: main.customer});
					
		var progresswindow = app.window.open (window, "chrome://didius/content/invoice/progress.xul", "auction.invoice.progress."+ main.invoice.id, "", {});
										
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
													
								if (document.getElementById ("printInvoice").checked)
								{
									didius.common.print.invoice ({invoice: main.invoice, onDone: onDone});			
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

								if (document.getElementById ("mailInvoice").checked)
								{																																				
									didius.common.print.invoice ({invoice: main.invoice, mail: true, onDone: onDone});			
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