Components.utils.import("resource://didius/js/app.js");

var main = 
{
	init : function ()
	{				
		app.startup (window);
		
		main.customers.init ();
		main.auctions.init ();
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
		},
		
		auctions :
		{
			addRow : function (auction)
			{
				var treechildren = document.getElementById ('auctionsTreeChildren');			
				
				var treeitem = document.createElement ('treeitem');	
				treechildren.appendChild (treeitem)

				var treerow = document.createElement('treerow');
				treeitem.appendChild (treerow);

				var columns = [auction["id"], auction["no"], auction["title"]];
									
				for (index in columns)
				{
					var treecell = document.createElement ('treecell');
					treecell.setAttribute ('label', columns[index]);
					treerow.appendChild (treecell);																		
				}
			},
			
			changeRow : function (auction)
			{
				var tree = document.getElementById ('auctions');
				
				for (var i = 0; i < tree.view.rowCount; i++) 
				{
					if (tree.view.getCellText (i, tree.columns.getNamedColumn('id')) == auction.id)					
					{					
						tree.view.setCellText (i, tree.columns.getNamedColumn('no'), auction.no);
						tree.view.setCellText (i, tree.columns.getNamedColumn('title'), auction.title);
						break;
					}
				}
			},
			
			removeRow : function (row)
			{
				if (!row)
				{
					var tree = document.getElementById("auctions");
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
				var treechildren = document.getElementById ('auctionsTreeChildren');
								
				while (treechildren.firstChild) 
				{
 					treechildren.removeChild (treechildren.firstChild);
				}
			},	
			
			refresh : function ()
			{					
				var onDone = 	function (auctions)
								{
									for (index in auctions)
									{									
										main.controls.auctions.addRow (auctions[index]);
									}
								
								// Enable controls
								document.getElementById ("auctions").disabled = false;								
								document.getElementById ("auctionCreate").disabled = false;								
								
								main.controls.auctions.onChange ();
							};

				// Disable controls
				document.getElementById ("auctions").disabled = true;
				document.getElementById ("auctionCreate").disabled = true;
				document.getElementById ("auctionEdit").disabled = true;
				document.getElementById ("auctionDestroy").disabled = true;
			
				didius.auction.list ({async: true, onDone: onDone});					
			},
			
			getSelected : function ()
			{
				var result = new Array ();
				var tree = document.getElementById ('auctions');
				
				result.id = tree.view.getCellText (tree.currentIndex, tree.columns.getNamedColumn('id'));
				result.no = tree.view.getCellText (tree.currentIndex, tree.columns.getNamedColumn('no'));				
				result.title = tree.view.getCellText (tree.currentIndex, tree.columns.getNamedColumn('title'));				
				
				return result;
			},
		
			onChange : function ()
			{
				var view = document.getElementById ("auctions").view;
				var selection = view.selection.currentIndex; //returns -1 if the tree is not focused
				
				if (selection != -1)
				{
					document.getElementById ("auctionEdit").disabled = false;
					document.getElementById ("auctionDestroy").disabled = false;
				}
				else
				{
					document.getElementById ("auctionEdit").disabled = true;
					document.getElementById ("auctionDestroy").disabled = true;
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
	},
	
	auctions :
	{
		init : function ()
		{
			main.controls.auctions.refresh ();		
		},
								
		create : function ()
		{		
			var current = didius.auction.create ();						
			didius.auction.save (current);																								
			
			main.controls.auctions.addCustomer (current);
			
			var onSave = function (result)
			{				
				if (result != null)
				{
					main.controls.auctions.changeRow (result);					
				}													
			}
												
			window.openDialog ("chrome://didius/content/auctionedit/auctionedit.xul", current.id, "chrome", {auctionId: current.id, onSave: onSave});
		},
		
		edit : function ()
		{		
			var current = main.controls.auctions.getSelected ();
						
			var onSave = function (result)
			{				
				if (result != null)
				{
					main.controls.auctions.changeRow (result);					
				}													
			}
							
			window.openDialog ("chrome://didius/content/auctionedit/auctionedit.xul", current.id, "chrome", {auctionId: current.id, onSave: onSave});
		},
		
		destroy : function ()
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			var result = prompts.confirm (null, "Slet auktion", "Er du sikker på du vil slette denne auktion ?");
			
			if (result)
			{
				try
				{
					didius.auction.destroy (main.controls.auctions.getSelected ().id);
					main.controls.auctions.removeRow ();
				}
				catch (error)
				{
					app.error ({exception: error})
				}								
			}
		}
	}	
}
