Components.utils.import("resource://didius/js/app.js");

var main =
{
	current : null,
	items : null,

	init : function ()
	{	 				
		main.set ();		
	},
			
	set : function ()
	{			
		main.current = {};						
	},
	
	get : function ()
	{
		main.current.sender = document.getElementById ("sender").value;
		main.current.description = document.getElementById ("description").value;
	},
	
	onChange : function ()
	{
		main.get ();
	
		if (main.current.sender != "" && main.current.description != "")
		{
			document.getElementById ("send").disabled = false;	
		}
		else
		{
			document.getElementById ("send").disabled = true;
		}
	},	
			
	send : function ()
	{
		var progresswindow = app.window.open (window, "chrome://didius/content/bug/progress.xul", "bug.progress."+ main.current.id, "", {});	
										
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
								progresswindow.document.getElementById ("description1").textContent = "Sender fejlrapport ...";
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
													
								didius.helpers.bugReport (main.current);
								onDone ();
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