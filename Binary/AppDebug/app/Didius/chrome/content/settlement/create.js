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
	auction : null,
	case : null,
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
								main.case = didius.case.load ({id: window.arguments[0].caseId});
								main.auction = didius.auction.load (main.case.auctionid);	
								main.customer = didius.customer.load (main.case.customerid);
							}
							catch (error)
							{
								app.error ({exception: error})
								main.close ();
								return;
							}												
							
							main.set ();
						};
						
		setTimeout (onInit, 0);
	},
			
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{		
		try
		{		
			main.settlement = didius.settlement.create ({case: main.case, simulate: true});
	
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
		}
		catch (exception)
		{
			app.error ({exception: exception})		
		}
						
		if (main.settlement != null)
		{
			if (main.settlement.lines.length > 0)
			{
				document.getElementById ("checkbox.print").disabled = false;
				document.getElementById ("checkbox.email").disabled = false;				
				document.getElementById ("button.create").disabled = false;
			}
			
			document.getElementById ("textbox.sale").disabled = false;
			document.getElementById ("textbox.commissionfee").disabled = false;			
			document.getElementById ("textbox.vat").disabled = false;						
			document.getElementById ("textbox.total").disabled = false;
			
			if (main.customer.email == "")
			{
				document.getElementById ("checkbox.email").disabled = false;
				document.getElementById ("checkbox.email").checked = false;				
			}
		}
		else
		{
			document.getElementById ("textbox.sale").disabled = true;
			document.getElementById ("textbox.commissionfee").disabled = true;			
			document.getElementById ("textbox.vat").disabled = true;						
			document.getElementById ("textbox.total").disabled = true;
		}
				
		document.getElementById ("textbox.customername").value = main.customer.name;
		document.getElementById ("textbox.auctiontitle").value = main.auction.title;
		document.getElementById ("textbox.casetitle").value = main.case.title;
				
		document.getElementById ("button.close").disabled = false;
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | CREATE																								|	
	// ------------------------------------------------------------------------------------------------------	
	create : function ()
	{
		main.settlement = didius.settlement.create ({case: main.case});
					
		var progresswindow = app.window.open (window, "chrome://didius/content/settlement/progress.xul", "auction.settlement.progress."+ main.settlement.id, "", {});
										
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
													
								if (document.getElementById ("checkbox.print").checked)
								{
									didius.common.print.settlement ({settlement: main.settlement, onDone: onDone});			
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

								if (document.getElementById ("checkbox.email").checked)
								{																																				
									didius.common.print.settlement ({settlement: main.settlement, mail: true, onDone: onDone});			
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