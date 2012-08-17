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


