Components.utils.import("resource://didius/js/app.js");

var main =
{	
	auction : null,
	customer : null,
	current : null,

	init : function ()
	{	 	
		try
		{
			main.auction = didius.auction.load (window.arguments[0].auctionId);
			main.customer = didius.customer.load (window.arguments[0].customerId);
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}								
	
		main.itemsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("items"), sortColumn: "catalogno", sortDirection: "descending"});
	
		main.set ();		
	},
			
	set : function ()
	{		
		var invoice = didius.invoice.create ({auction: main.auction, customer: main.customer, simulate: true});
	
		for (idx in invoice.items)
		{
			var item = invoice.items[idx];
			
			main.itemsTreeHelper.addRow ({data: item});
		}
	
		document.getElementById ("totalSale").value = invoice.sales;
		document.getElementById ("totalCommissionFee").value = invoice.commissionfee;
		document.getElementById ("totalVat").value = invoice.vat;
		document.getElementById ("totalTotal").value = invoice.total;
		
		if (invoice.total > 0)
		{
			document.getElementById ("approve").disabled = false;
		}
	},
		
	approve : function ()
	{					
		main.current = didius.invoice.create ({auction: main.auction, customer: main.customer, simulate: true});
		
		main.print ()
									
//		if (window.arguments[0].onApprove != null)
//		{
//			window.arguments[0].onApprove (current);
//		}
		
//		main.close ();	
	},
	
	print : function ()
	{
		var progresswindow = app.window.open (window, "chrome://didius/content/auction/invoice/progress.xul", "auction.invoice.progress."+ main.current.id, "", {});
										
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
													
								didius.common.print.invoice ({invoice: main.current, onDone: onDone});			
							};
																
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
	
	close : function (force)
	{									
		// Close window.
		window.close ();
	}
}