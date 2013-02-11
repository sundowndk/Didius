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
		main.itemsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("tree.items"), sortColumn: "no", sortDirection: "descending"});
	
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
	
			document.getElementById ("textbox.totalSale").value = main.invoice.sales;
			document.getElementById ("textbox.totalCommissionFee").value = main.invoice.commissionfee;
			document.getElementById ("textbox.totalVat").value = main.invoice.vat;
			document.getElementById ("textbox.totalTotal").value = main.invoice.total;									
		}
		catch (exception)
		{
			app.error ({exception: exception})		
		}
						
		if (main.invoice != null)
		{
			if (main.invoice.lines.length > 0)
			{
				document.getElementById ("checkbox.invoiceprint").disabled = false;
				document.getElementById ("checkbox.invoicemail").disabled = false;				
				document.getElementById ("button.create").disabled = false;
			}
			
			document.getElementById ("textbox.totalSale").disabled = false;
			document.getElementById ("textbox.totalCommissionFee").disabled = false;			
			document.getElementById ("textbox.totalVat").disabled = false;						
			document.getElementById ("textbox.totalTotal").disabled = false;
			
			if (main.customer.email == "")
			{
				document.getElementById ("checkbox.invoicemail").disabled = false;
				document.getElementById ("checkbox.invoicemail").checked = false;				
			}
		}
		else
		{
			document.getElementById ("textbox.totalSale").disabled = true;
			document.getElementById ("textbox.totalCommissionFee").disabled = true;			
			document.getElementById ("textbox.totalVat").disabled = true;						
			document.getElementById ("textbox.totalTotal").disabled = true;
		}
				
		document.getElementById ("button.close").disabled = false;
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
													
								if (document.getElementById ("checkbox.invoiceprint").checked)
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

								if (document.getElementById ("checkbox.invoicemail").checked)
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