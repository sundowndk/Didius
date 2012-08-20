Components.utils.import("resource://didius/js/app.jsm");

var main = 
{
	init : function ()
	{		
		app.startup ();
		
		main.customers.init ();
	},
	
	customers :
	{
		init : function ()
		{
			main.customers.refresh ();		
		},
	
		refresh : function ()
		{
			var onDone = 	function (customers)
							{
								//var customers = new Array ();
								//customers[0] = {id: 1, name: "Rasmus Pedersen", address1: "Agersøvej 303", postcode: "4200", city: "Slagelse", email: "rasmus@akvaservice.dk"};
							
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
		
		create : function ()
		{		
			try
			{
				window.open ("chrome://didius/content/customers/edit.xul", "customeredit", "chrome", {status: "Reading remote data", maxProgress: 50, progress: 10} );
			} 
			catch (error)
			{
				dump (error);
			}
		}
	}
	
	
}
