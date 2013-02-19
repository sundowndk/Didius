Components.utils.import("resource://didius/js/app.js");

// ----------------------------------------------------------------------------------------------------------
// | MAIN																									|
// ----------------------------------------------------------------------------------------------------------
var main =
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	settlement : null,
	customer : null,

	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{	 	
		main.linesTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("tree.lines"), sortColumn: "no", sortDirection: "descending"});
	
		var onInit = 	function ()
						{
							try
							{
								if (window.arguments[0].settlementId)
								{
									main.settlement = didius.settlement.load ({id: window.arguments[0].settlementId});									
								}
								else if (window.arguments[0].caseId)
								{
									main.settlement = didius.settlement.load ({caseId: window.arguments[0].caseId});
								}
								
								main.customer = didius.customer.load (main.settlement.customerid);
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
		document.title = "Afregning: "+ main.settlement.no +" ["+ main.customer.name +"]";
		
		main.linesTreeHelper.disableRefresh ();
			for (var index in main.settlement.lines)
			{
				var line = main.settlement.lines[index];
				var data = {};
				data.id = line.id;
				data.no = line.no;				
				data.text = line.text;
				data.amount = line.amount.toFixed (2) +" kr.";
				data.vatamount = line.vatamount.toFixed (2) +" kr.";
				data.commissionfee = line.commissionfee.toFixed (2) +" kr.";			
				data.vatcommissionfee = line.vatcommissionfee.toFixed (2) +" kr.";			
				data.total = line.total.toFixed (2) +" kr.";			
							
				main.linesTreeHelper.addRow ({data: data});
			}
			main.linesTreeHelper.enableRefresh ();

		document.getElementById ("textbox.sale").value = main.settlement.sales;
		document.getElementById ("textbox.commissionfee").value = main.settlement.commissionfee;
		document.getElementById ("textbox.vat").value = main.settlement.vat;
		document.getElementById ("textbox.total").value = main.settlement.total;		
			
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
		var progresswindow = app.window.open (window, "chrome://didius/content/settlement/progress.xul", "didius.settlement.progress."+ main.settlement.id, "", {});	
										
		var workload = function ()
		{
			progresswindow.removeEventListener ("load", workload, false)
		
			var overallprogress = 0;
			var totalprogress = 1;
			
			var customers = new Array ();		
			var invoices = new Array ();
		
			// Start.
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
												
								var onError = 	function ()
												{
													app.error ({errorCode: "APP00150"});	
													finish ();
												}
													
								didius.common.print.settlement ({settlement: main.settlement, onDone: onDone, onError: onError});	
							};
																
			var finish =	function ()	
							{															
								progresswindow.close ();
							};
			
			// Start worker.
			setTimeout (start, 100);
		}
		
		progresswindow.addEventListener ("load", workload);		
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | MAIL																								|	
	// ------------------------------------------------------------------------------------------------------
	mail : function ()
	{
		var progresswindow = app.window.open (window, "chrome://didius/content/settlement/progress.xul", "didius.settlement.progress."+ main.settlement.id, "", {});	
										
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
												
								var onError =	function ()
												{
													app.error ({errorCode: "APP00151"});
													finish ();
												}
													
								didius.common.print.settlement ({settlement: main.settlement, mail: true, onDone: onDone, onError: onError});			
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