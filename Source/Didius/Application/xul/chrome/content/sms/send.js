Components.utils.import("resource://didius/js/app.js");

// ----------------------------------------------------------------------------------------------------------
// | MAIN																									|
// ----------------------------------------------------------------------------------------------------------
var main = 
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	message : "",	

	// ------------------------------------------------------------------------------------------------------
	// | INIT																							|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{
		main.set ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SET																							|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{
		document.getElementById ("textbox.message").disabled = false;
		document.getElementById ("button.close").disabled = false;
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | GET																							|	
	// ------------------------------------------------------------------------------------------------------
	get : function ()
	{
		main.message = document.getElementById ("textbox.message").value;
	},
			
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------			
	onChange : function ()
	{
		main.get ();
		
		if (main.message != "")
		{
			document.getElementById ("button.send").disabled = false;
		}
		else
		{
			document.getElementById ("button.send").disabled = true;
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | CLOSE																							|	
	// ------------------------------------------------------------------------------------------------------
	close : function ()
	{										
		// Close window.
		window.close ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SEND																								|	
	// ------------------------------------------------------------------------------------------------------
	send : function ()
	{
		var progresswindow = app.window.open (window, "chrome://didius/content/creditnote/progress.xul", "auction.creditnote.progress."+ SNDK.tools.newGuid (), "", {});	
										
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
													
								didius.helpers.sendSMS ({message: main.message, onDone: onDone});			
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
}
