// ---------------------------------------------------------------------------------------------------------------
// PROJECT: app
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// CLASS: app
// ---------------------------------------------------------------------------------------------------------------
var app =
{
	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: runtime
	// ---------------------------------------------------------------------------------------------------------------
	runtime :
	{
		debug : false,
		
		initialize : function ()
		{
			didius.runtime.initialize ();	
		},
		
		startup : function ()
		{
			dump("App startup!");
			app.runtime.initialize ();
			
			app.customers.initialize ();
			app.auctions.initialize ();	
		},
		
		shutdown : function (ForceQuit)
		{
			dump("App shutdown!");
		  var appStartup = Components.classes['@mozilla.org/toolkit/app-startup;1'].getService (Components.interfaces.nsIAppStartup);
		
		  var quitSeverity = ForceQuit ? Components.interfaces.nsIAppStartup.eForceQuit :
		                                  Components.interfaces.nsIAppStartup.eAttemptQuit;
		  appStartup.quit(quitSeverity);
		}
		
		
		
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: customers
	// ---------------------------------------------------------------------------------------------------------------
	customers :
	{
		initialize : function ()
		{
			app.customers.set ();
		},
		
		set : function ()
		{
			app.customers.refresh ();
		},
		
		refresh : function ()
		{
			var onDone = 	function (customers)
							{
								var tree = document.getElementById ("customers");
								var children = document.createElement('treechildren');		
								tree.appendChild (children);
		
								for (index in customers)
								{
									var customer = customers[index];
		
									var item = document.createElement('treeitem');	
									children.appendChild (item)
								
									var row = document.createElement('treerow');
									item.appendChild (row);
		
									var cell = document.createElement('treecell');
									cell.setAttribute ('label', customer["name"]);
									row.appendChild(cell);			
								}				
								
								tree.disabled = false;
							};
		
			didius.customer.list ({async: true, onDone: onDone});
		}
		
		
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: auctions
	// ---------------------------------------------------------------------------------------------------------------
	auctions :
	{
		initialize : function ()
		{
			app.auctions.set ();
		},
		
		set : function ()
		{
			app.auctions.refresh ();
		},
		
		refresh : function ()
		{
			var onDone = 	function (auctions)
							{
								var tree = document.getElementById ("auctions");
								var children = document.createElement('treechildren');		
								tree.appendChild (children);
		
								for (index in auctions)
								{
									var auction = auctions[index];
		
									var item = document.createElement('treeitem');	
									children.appendChild (item)
								
									var row = document.createElement('treerow');
									item.appendChild (row);
		
									var cell = document.createElement('treecell');
									cell.setAttribute ('label', auction["no"]);
									row.appendChild(cell);			
									
									var cell = document.createElement('treecell');
									cell.setAttribute ('label', auction["title"]);
									row.appendChild(cell);			
								}				
								
								tree.disabled = false;
							};
		
			didius.auction.list ({async: true, onDone: onDone});
		}
		
		
	}
}

