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
			
			app.customers.create ();
		},
		
		set : function ()
		{
			app.customers.refresh ();
		},
		
		refresh : function ()
		{
			var onDone = 	function (customers)
							{
								var customers = new Array ();
								customers[0] = {id: 1, name: "Rasmus Pedersen", address1: "Agersøvej 303", postcode: "4200", city: "Slagelse", email: "rasmus@akvaservice.dk"};
							
								// Populate tree
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
		
									{
										var cell = document.createElement('treecell');
										cell.setAttribute ('label', customer["id"]);
										row.appendChild(cell);			
									}
		
									{
										var cell = document.createElement('treecell');
										cell.setAttribute ('label', customer["name"]);
										row.appendChild(cell);			
									}
									
									{
										var cell = document.createElement('treecell');
										cell.setAttribute ('label', customer["address1"]);
										row.appendChild(cell);			
									}
									
									{
										var cell = document.createElement('treecell');
										cell.setAttribute ('label', customer["postcode"]);
										row.appendChild(cell);			
									}
									
									{
										var cell = document.createElement('treecell');
										cell.setAttribute ('label', customer["city"]);
										row.appendChild(cell);			
									}
									
									{
										var cell = document.createElement('treecell');
										cell.setAttribute ('label', customer["email"]);
										row.appendChild(cell);			
									}							
								}				
								
								// Enable controls
								tree.disabled = false;						
								document.getElementById ("customerCreate").disabled = false;
							};
		
			didius.customer.list ({async: true, onDone: onDone});
		},
		
		onChange : function ()
		{
		
		
		},
		
		create : function ()
		{
			dump ("sdsf");
		try
		{
		window.openDialog("chrome://didius/content/customers/edit.xul",
		                  "myProgress", "chrome,centerscreen", 
		                  {status: "Reading remote data", maxProgress: 50, progress: 10} );
		
		//var myWin = window.open("chrome://didius/content/main.xul","findfile","chrome", "Bla");
		} catch (error)
		{
			dump (error);
		}
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
								// Populate tree
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
								
								// Enable controls
								tree.disabled = false;
								document.getElementById ("auctionCreate").disabled = false;
							};
		
			didius.auction.list ({async: true, onDone: onDone});
		}
		
		
	}
}

var EXPORTED_SYMBOLS = ["app"];
 

