Components.utils.import("resource://didius/js/app.js");

var main = 
{
	init : function ()
	{		
		app.startup ();
		
		main.customers.init ();
	},
	
	controls : 
	{
		customers :
		{
			addCustomer : function (customer)
			{
				var children = document.getElementById ('customersTreeChildren');		
	
				var item = document.createElement('treeitem');	
				children.appendChild (item)

				var row = document.createElement('treerow');
				item.appendChild (row);

				var columns = [customer["id"], customer["name"], customer["address1"], customer["postcode"], customer["city"], customer["email"]]
									
				for (index in columns)
				{
					var cell = document.createElement('treecell');
					cell.setAttribute ('label', columns[index]);
					row.appendChild(cell);																		
				}
			},
			
			changeRow : function (customer)
			{
				var tree = document.getElementById('customers');
				
				for (var i = 0; i < tree.view.rowCount; i++) 
				{
					if (tree.view.getCellText (i, tree.columns.getNamedColumn('id')) == customer.id)					
					{					
						tree.view.setCellText (i, tree.columns.getNamedColumn('name'), customer.name);
						tree.view.setCellText (i, tree.columns.getNamedColumn('address1'), customer.address1);
						tree.view.setCellText (i, tree.columns.getNamedColumn('postcode'), customer.postcode);
						tree.view.setCellText (i, tree.columns.getNamedColumn('city'), customer.city);
						tree.view.setCellText (i, tree.columns.getNamedColumn('email'), customer.email);
						break;
					}
				}
			},
			
			removeRow : function (row)
			{
				if (!row)
				{
					var tree = document.getElementById("customers");
 var rangeCount = tree.view.selection.getRangeCount();
 var start = {};
 var end   = {};
 for (var i=0; i<rangeCount; i++)  
 {  
 tree.view.selection.getRangeAt(i, start, end);
 for (var c=end.value; c>=start.value; c--)  
 {
 tree.view.getItemAtIndex(c).parentNode.removeChild(tree.view.getItemAtIndex(c));
 }
 }
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
										main.controls.customers.addCustomer (customers[index]);
									}
								
								// Enable controls
								document.getElementById ("customers").disabled = false;								
								document.getElementById ("customerCreate").disabled = false;								
								
								main.controls.customers.onChange ();
							};

				// Disable controls
				document.getElementById ("customers").disabled = true;
				document.getElementById ("customerCreate").disabled = true;
				document.getElementById ("customerEdit").disabled = true;
				document.getElementById ("customerDestroy").disabled = true;
			
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
					document.getElementById ("customerEdit").disabled = false;
					document.getElementById ("customerDestroy").disabled = false;
				}
				else
				{
					document.getElementById ("customerEdit").disabled = true;
					document.getElementById ("customerDestroy").disabled = true;
				}
			}
		}
	},
	
	customers :
	{
		init : function ()
		{
			main.controls.customers.refresh ();		
		},
								
		create : function ()
		{		
			var current = didius.customer.create ();			
			current.name = "Unavngiven kunde";
			didius.customer.save (current);																								
			
			main.controls.customers.addCustomer (current);
			
			var onSave = function (result)
			{				
				if (result != null)
				{
					main.controls.customers.changeRow (result);					
				}													
			}
												
			window.openDialog ("chrome://didius/content/customeredit/customeredit.xul", "customeredit:"+ current.id, "chrome", {customerId: current.id, onSave: onSave});
		},
		
		edit : function ()
		{		
			var current = main.controls.customers.getSelected ();
						
			var onSave = function (result)
			{				
				if (result != null)
				{
					main.controls.customers.changeRow (result);					
				}													
			}
							
			window.openDialog ("chrome://didius/content/customeredit/customeredit.xul", "customeredit:"+ current.id, "chrome", {customerId: current.id, onSave: onSave});
		},
		
		destroy : function ()
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			var result = prompts.confirm (null, "Slet kunde", "Er du sikker på du vil slette denne kunde ?");
			
			if (result)
			{
				try
				{
					didius.customer.destroy (main.controls.customers.getSelected ().id);
					main.controls.customers.removeRow ();
				}
				catch (error)
				{
					app.error ({exception: error})
				}								
			}
		}
	}		
}
