Components.utils.import("resource://didius/js/app.js");

// ----------------------------------------------------------------------------------------------------------
// | MAIN																									|
// ----------------------------------------------------------------------------------------------------------
var main =
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	case : null,
	customer: null,	
	itemsTreeHelper : null,

	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{	
		main.itemsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("tree.items"), sortColumn: "catalogno", sortDirection: "descending"});
	
		var onInit = 	function ()
						{
							try
							{	
								main.case = didius.case.load ({id: window.arguments[0].caseId});
								main.customer = didius.customer.load (main.case.customerid);
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
		document.title = "Salgsaftale: "+ main.case.title +" ["+ main.case.no +"]";
						
		var onDone =	function (result)
						{										
							main.itemsTreeHelper.disableRefresh ();
							for (idx in result)
							{						
								var item = result[idx];
							
								var data = {};
								data["id"] = item.id;
								data["catalogno"] = item.catalogno;
								data["no"] = item.no;
								data["title"] = item.title;			
								
								if (item.vat)
								{
									data["vat"] = "Ja";								
								}
								else								
								{
									data["vat"] = "Nej";
								}
								
								data["minimumbid"] = item.minimumbid.toFixed (2) + " kr.";
																														
								main.itemsTreeHelper.addRow ({data: data});
							}		
							main.itemsTreeHelper.enableRefresh ();
														
							document.getElementById ("button.print").disabled = false;
							
							if (main.customer.email != "")
							{
								document.getElementById ("button.mail").disabled = false;
							}				
							
							document.getElementById ("button.close").disabled = false;
						}
						
		didius.item.list ({case: main.case, async: true, onDone: onDone});		
	},	
		
	// ------------------------------------------------------------------------------------------------------
	// | PRINT																								|	
	// ------------------------------------------------------------------------------------------------------
	print : function ()
	{
		var	progresswindow = app.window.open (window, "chrome://didius/content/case/salesagreement/progress.xul", "case.salesagreement.progress."+ main.case.id, "dialog=yes", {});	
										
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
													//app.error ({errorCode: "APP00150"});	
													finish ();
												}
													
								didius.common.print.salesAgreement ({case: main.case, onDone: onDone, onError: onError});			
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
		var	progresswindow = app.window.open (window, "chrome://didius/content/case/salesagreement/progress.xul", "case.salesagreement.progress."+ main.case.id, "dialog=yes", {});	
										
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
													
								didius.common.print.salesAgreement ({case: main.case, mail: true, onDone: onDone, onError: onError});			
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