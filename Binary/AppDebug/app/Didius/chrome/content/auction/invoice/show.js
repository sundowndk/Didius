Components.utils.import("resource://didius/js/app.js");

var main =
{
	current : null,

	init : function ()
	{	 	
		try
		{
			main.current = didius.invoice.load (window.arguments[0].invoiceId);
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
		for (idx in main.current.items)
		{						
			var item = main.current.items[idx];
		
			var data = {};
			data["id"] = item.id;
			data["catalogno"] = item.catalogno;
			data["no"] = item.no;
			data["title"] = item.title;
			data["bidamount"] = didius.bid.load (item.currentbidid).amount;								
			data["commissionfee"] = item.commissionfee;
											
			main.itemsTreeHelper.addRow ({data: data});
		}		
				
		document.getElementById ("sales").value = main.current.sales;
		document.getElementById ("commissionFee").value = main.current.commissionfee;
		document.getElementById ("total").value = main.current.total;
		
		if (main.current.customer.email != "")
		{
			document.getElementById ("mail").disabled = false;
		}
	},
	
	mail : function ()
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
													
								didius.common.print.invoice ({invoice: main.current, mail: true, onDone: onDone});			
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