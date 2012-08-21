Components.utils.import("resource://didius/js/app.js");

var main = 
{
	init : function ()
	{				
		main.controls.customers.refresh ();
	},
	
	choose : function ()
	{
		if (window.arguments[0].onDone != null)
		{
			window.arguments[0].onDone (main.controls.customers.getSelected ());
		}
		
		window.close ();
	},
	
	close : function ()
	{
		if (window.arguments[0].onDone != null)
		{
			window.arguments[0].onDone (null);
		}
	
		window.close ();
	},
	
	controls : 
	{
		customers :
		{
			addRow : function (customer)
			{
				var treechildren = document.getElementById ('customersTreeChildren');		
	
				var treeitem = document.createElement ('treeitem');	
				treechildren.appendChild (treeitem)

				var treerow = document.createElement ('treerow');
				treeitem.appendChild (treerow);

				var columns = [customer["id"], customer["name"], customer["address1"], customer["postcode"], customer["city"], customer["email"]]
									
				for (index in columns)
				{
					var treecell = document.createElement ('treecell');
					treecell.setAttribute ('label', columns[index]);
					treerow.appendChild (treecell);
				}
			},
					
			clear : function ()
			{
				var treechildren = document.getElementById ('customersTreeChildren');
								
				while (treechildren.firstChild) 
				{
 						treechildren.removeChild (treechildren.firstChild);
				}
			},	
			
			refresh : function ()
			{					
				var onDone = 	function (customers)
								{
									for (index in customers)
									{									
										main.controls.customers.addRow (customers[index]);
									}
								
								// Enable controls
								document.getElementById ("customers").disabled = false;																								
								main.controls.customers.onChange ();
							};

				// Disable controls
				document.getElementById ("customers").disabled = true;								
				document.getElementById ("close").disabled = true;
				document.getElementById ("choose").disabled = true;
			
				didius.customer.list ({async: true, onDone: onDone});					
			},
			
			getSelected : function ()
			{
				var result = new Array ();
				var tree = document.getElementById ('customers');
				
				result.id = tree.view.getCellText (tree.currentIndex, tree.columns.getNamedColumn('id'));
				result.name = tree.view.getCellText (tree.currentIndex, tree.columns.getNamedColumn('name'));
				result.address1 = tree.view.getCellText (tree.currentIndex, tree.columns.getNamedColumn('address1'));
				result.postcode = tree.view.getCellText (tree.currentIndex, tree.columns.getNamedColumn('postcode'));
				result.city = tree.view.getCellText (tree.currentIndex, tree.columns.getNamedColumn('city'));
				result.email = tree.view.getCellText (tree.currentIndex, tree.columns.getNamedColumn('email'));
				
				return result;
			},
		
			onChange : function ()
			{
				var view = document.getElementById ("customers").view;
				var selection = view.selection.currentIndex; //returns -1 if the tree is not focused
				
				if (selection != -1)
				{
					document.getElementById ("close").disabled = false;
					document.getElementById ("choose").disabled = false;
				}
				else
				{
					document.getElementById ("close").disabled = false;
					document.getElementById ("choose").disabled = true;
				}
			}
		}		
	}
}
