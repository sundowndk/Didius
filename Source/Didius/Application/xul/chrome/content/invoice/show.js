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
		main.linesTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("tree.lines"), sortColumn: "no", sortDirection: "descending"});	
	 	 	
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
		document.getElementById ("datepicker.createdate").dateValue = SNDK.tools.timestampToDate (main.invoice.createtimestamp);
		
		document.getElementById ("textbox.no").value = main.invoice.no;
		document.getElementById ("textbox.customername").value = main.customer.name;
					
		main.linesTreeHelper.disableRefresh ();
		for (idx in main.invoice.lines)
		{						
			var line = main.invoice.lines[idx];
		
			var data = {};
			data["id"] = line.id;			
			data["no"] = line.no;
			data["text"] = line.text;
			data["amount"] = line.amount.toFixed (2)+ " kr.";
			data["vatamount"] = line.vatamount.toFixed (2)+ " kr.";
			data["commissionfee"] = line.commissionfee.toFixed (2) +" kr.";
			data["vatcommissionfee"] = line.vatcommissionfee.toFixed (2) +" kr.";			
			data["total"] = line.total.toFixed (2) +" kr.";
			
			main.linesTreeHelper.addRow ({data: data});
		}		
		main.linesTreeHelper.enableRefresh ();
				
		document.getElementById ("textbox.totalsales").value = main.invoice.sales;
		document.getElementById ("textbox.totalcommissionFee").value = main.invoice.commissionfee;
		document.getElementById ("textbox.totalvat").value = main.invoice.vat;
		document.getElementById ("textbox.totaltotal").value = main.invoice.total;
				
		document.getElementById ("button.print").disabled = false;		
		
		if (main.customer.email != "")
		{
			document.getElementById ("button.mail").disabled = false;
		}
		
		document.getElementById ("button.credit").disabled = false;
		
		document.getElementById ("button.close").disabled = false;
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
	// | CREDIT																								|	
	// ------------------------------------------------------------------------------------------------------
	credit : function ()
	{
		app.window.open (window, "chrome://didius/content/creditnote/create.xul", "didius.creditnote.show."+ SNDK.tools.newGuid (), "modal", {invoiceId: main.invoice.id});
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