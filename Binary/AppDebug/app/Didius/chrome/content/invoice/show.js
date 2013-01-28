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
						}
	
		setTimeout (onInit, 1);
	},
			
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{				
		document.title = "Faktura: "+ main.invoice.no +" ["+ main.customer.name +"]";
		document.getElementById ("createdate").dateValue = SNDK.tools.timestampToDate (main.invoice.createtimestamp);
		
		document.getElementById ("no").value = main.invoice.no;
		document.getElementById ("customername").value = main.customer.name;
					
		main.itemsTreeHelper.disableRefresh ();
		for (idx in main.invoice.lines)
		{						
			var line = main.invoice.lines[idx];
		
			var data = {};
			data["id"] = line.id;			
			data["no"] = line.no;
			data["text"] = line.text;
			data["amount"] = line.amount.toFixed (2)+ " kr.";
			data["commissionfee"] = line.commissionfee.toFixed (2) +" kr.";
			data["vat"] = line.vat.toFixed (2) +" kr.";
			data["total"] = line.total.toFixed (2) +" kr.";
			
			sXUL.console.log (line.total)
											
			main.itemsTreeHelper.addRow ({data: data});
		}		
		main.itemsTreeHelper.enableRefresh ();
				
		document.getElementById ("totalsales").value = main.invoice.sales;
		document.getElementById ("totalcommissionFee").value = main.invoice.commissionfee;
		document.getElementById ("totalvat").value = main.invoice.vat;
		document.getElementById ("totaltotal").value = main.invoice.total;
				
		document.getElementById ("print").disabled = false;
		
		if (main.customer.email != "")
		{
			document.getElementById ("mail").disabled = false;
		}
		
		document.getElementById ("close").disabled = false;
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | PRINT																								|	
	// ------------------------------------------------------------------------------------------------------
	print : function ()
	{
		var progresswindow = app.window.open (window, "chrome://didius/content/invoice/progress.xul", "auction.invoice.progress."+ main.invoice.id, "", {});	
										
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
													
								didius.common.print.invoice ({invoice: main.invoice, onDone: onDone});			
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
		var progresswindow = app.window.open (window, "chrome://didius/content/invoice/progress.xul", "auction.invoice.progress."+ main.invoice.id, "", {});	
										
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
													
								didius.common.print.invoice ({invoice: main.invoice, mail: true, onDone: onDone});			
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