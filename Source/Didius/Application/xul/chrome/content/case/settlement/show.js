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

	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
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
			
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------			
	set : function ()
	{		
		document.getElementById ("totalSale").value = main.settlement.sales;
		document.getElementById ("totalCommissionFee").value = main.settlement.commissionfee;
		document.getElementById ("totalVat").value = main.settlement.vat;
		document.getElementById ("totalTotal").value = main.settlement.total;	
		
		for (idx in main.settlement.items)
		{
			var item = main.settlement.items[idx];
			main.itemsTreeHelper.addRow ({data: item});
		}
	
		document.getElementById ("print").disabled = false;
		document.getElementById ("mail").disabled = false;
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | PRINT																								|	
	// ------------------------------------------------------------------------------------------------------
	print : function ()
	{
		var progresswindow = app.window.open (window, "chrome://didius/content/case/settlement/progress.xul", "didius.case.settlement.progress."+ main.settlement.id, "", {});	
										
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
		window.openDialog ("chrome://didius/content/case/settlement/print.xul", "settlementprint-"+ main.current.id, "chrome, modal", {settlementId: main.current.id});
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