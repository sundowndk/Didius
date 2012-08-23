Components.utils.import("resource://didius/js/app.js");

var main =
{
	checksum : null,
	current : null,

	init : function ()
	{
		try
		{
			main.current = didius.case.load (window.arguments[0].caseId);
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}								
	
		main.set ();
		
		// Hook events.
		app.events.onCaseDestroy.addHandler (main.eventHandlers.onCaseDestroy);
		
		app.events.onItemCreate.addHandler (main.eventHandlers.onItemCreate);
		app.events.onItemSave.addHandler (main.eventHandlers.onItemSave);
		app.events.onItemDestroy.addHandler (main.eventHandlers.onItemDestroy);
	},
	
	eventHandlers :
	{
		onCaseDestroy : function (id)
		{
			if (main.current.id == id)
			{
				main.close (true);
			}
		},
	
		onItemCreate : function (item)
		{
			// Only react to Items beloning to this case.
			if (item.caseid == main.current.id)
			{
				main.controls.items.addRow (item);
			}
		},
		
		onItemSave : function (item)
		{
			// Only react to Items beloning to this case.
			if (item.caseid == main.current.id)
			{
				main.controls.items.changeRow (item);
			}
		},
		
		onItemDestroy : function (id)
		{			
			main.controls.items.removeRow (id);
		}
	},
	
	controls :
	{
		items :
		{
			addRow : function (item)
			{
				var treechildren = document.getElementById ('itemsTreeChildren');		
	
				var treeitem = document.createElement('treeitem');	
				treechildren.appendChild (treeitem)

				var treerow = document.createElement('treerow');
				treeitem.appendChild (treerow);

				var columns = [item["id"], item["catalogno"], item["no"], item["title"]];
									
				for (index in columns)
				{
					var treecell = document.createElement('treecell');
					treecell.setAttribute ('label', columns[index]);
					treerow.appendChild (treecell);
				}
			},
									
			removeRow : function (id)
			{
				var tree = document.getElementById ('items');
				var index = -1;
				
				if (!id)
				{
					index = tree.currentIndex;									
  				}
  				else
  				{  									
					for (var i = 0; i < tree.view.rowCount; i++) 
					{
						if (tree.view.getCellText (i, tree.columns.getNamedColumn ('id')) == id)
						{					
							index = i;				
							break;
						}
					}
  				}
  				
  				if (index != -1)
  				{
  					tree.view.getItemAtIndex (index).parentNode.removeChild (tree.view.getItemAtIndex (index));
  				}
			},
			
			changeRow : function (item)
			{
				var tree = document.getElementById ('items');
				var index = -1;
				
				if (!item)
				{
					index = tree.currentIndex;
				}
				else
				{
					for (var i = 0; i < tree.view.rowCount; i++) 
					{	
						if (tree.view.getCellText (i, tree.columns.getNamedColumn ('id')) == item.id)
						{					
							index = i;							
							break;
						}
					}
				}

				if (index != -1)
				{
					tree.view.setCellText (index, tree.columns.getNamedColumn ('id'), item.id);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('catalogno'), item.catalogno);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('title'), item.title);				
				}
			},
			
			getRow : function (id)
			{
				var result = new Array ();
				
				var tree = document.getElementById ('items');
				var index = -1;				
				
				if (!id)
				{
					index = tree.currentIndex;				
				}
				else
				{
					for (var i = 0; i < tree.view.rowCount; i++) 
					{
						if (tree.view.getCellText (i, tree.columns.getNamedColumn ('id')) == item.id)
						{					
							index = i;
							break;
						}
					}	
				}
				
				if (index != -1)
				{									
					result.id = tree.view.getCellText (index, tree.columns.getNamedColumn ('id'));
					result.catalogno = tree.view.getCellText (index, tree.columns.getNamedColumn ('catalogno'));
					result.no = tree.view.getCellText (index, tree.columns.getNamedColumn ('no'));				
					result.title = tree.view.getCellText (index, tree.columns.getNamedColumn ('title'));
				}
				
				return result;
			},
		
			refresh : function ()
			{
				var onDone = 	function (items)
								{
									for (index in items)
									{									
										main.controls.items.addRow (items[index]);
									}
								
								// Enable controls
								document.getElementById ("items").disabled = false;																
								main.controls.items.onChange ();
							};

				// Disable controls
				document.getElementById ("items").disabled = true;
				document.getElementById ("itemCreate").disabled = true;
				document.getElementById ("itemEdit").disabled = true;
				document.getElementById ("itemDestroy").disabled = true;
						
				didius.item.list ({case: main.current, async: true, onDone: onDone});				
			},
			
			onChange : function ()
			{
				var view = document.getElementById ("items").view;
				var selection = view.selection.currentIndex; 
				
				if (selection != -1)
				{
					document.getElementById ("itemCreate").disabled = false;
					document.getElementById ("itemEdit").disabled = false;
					document.getElementById ("itemDestroy").disabled = false;
				}
				else
				{
					document.getElementById ("itemCreate").disabled = false;
					document.getElementById ("itemEdit").disabled = true;
					document.getElementById ("itemDestroy").disabled = true;
				}
			}
		}
	},
	
	set : function ()
	{
		main.checksum = SNDK.tools.arrayChecksum (main.current);
	
		document.getElementById ("no").value = main.current.no;
	
		document.getElementById ("title").value = main.current.title;		
		
		document.getElementById ("customerreference").value = main.current.customerreference;		
		document.getElementById ("preparationfee").value = main.current.preparationfee;		
		document.getElementById ("commisionfeepercentage").value = main.current.commisionfeepercentage;		
		document.getElementById ("commisionfeeminimum").value = main.current.commisionfeeminimum;		
		
		main.items.init ();
							
		main.onChange ();
	},
	
	get : function ()
	{
		main.current.title = document.getElementById ("title").value;		
		
		main.current.customerreference = document.getElementById ("customerreference").value;		
		main.current.preparationfee = document.getElementById ("preparationfee").value;		
		main.current.commisionfeepercentage = document.getElementById ("commisionfeepercentage").value;		
		main.current.commisionfeeminimum = document.getElementById ("commisionfeeminimum").value;		
	},
	
	save : function ()
	{			
		main.get ();
		
		didius.case.save (main.current);
				
		main.checksum = SNDK.tools.arrayChecksum (main.current);
		main.onChange ();
		
		if (window.arguments[0].onSave != null)
		{
			window.arguments[0].onSave (main.current);
		}
	},
	
	close : function (force)
	{			
		// If we are forced to close, then dont promt user about potential unsaved data.	
		if (!force)
		{
			// If checksums do not match, promt user about unsaved data.
			if ((SNDK.tools.arrayChecksum (main.current) != main.checksum))
			{
				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
				
				if (!prompts.confirm (null, "Ændringer ikke gemt", "Der er fortaget ændringer, der ikke er gemt, vil du forstætte ?"))
				{
					return;
				}			
			}
		}
		
		// Unhook events.
		app.events.onCaseDestroy.removeHandler (main.eventHandlers.onCaseDestroy);
		
		app.events.onItemCreate.removeHandler (main.eventHandlers.onItemCreate);
		app.events.onItemSave.removeHandler (main.eventHandlers.onItemSave);
		app.events.onItemDestroy.removeHandler (main.eventHandlers.onItemDestroy);
	
		// Close window.
		window.close ();
	},
	
	onChange : function ()
	{
		main.get ();
	
		if ((SNDK.tools.arrayChecksum (main.current) != main.checksum))
		{
			document.title = "Sag: "+ main.current.title +" ["+ main.current.no +"] *";
		
			document.getElementById ("save").disabled = false;
			document.getElementById ("close").disabled = false;
		}
		else
		{
			document.title = "Sag: "+ main.current.title +" ["+ main.current.no +"]";
		
			document.getElementById ("save").disabled = true;
			document.getElementById ("close").disabled = false;
		}
	},
	
	items :
	{
		init : function ()
		{
			main.controls.items.refresh ();		
		},
			
		create : function ()
		{		
			// Create new item.
			var current = didius.item.create (main.current);			
			didius.item.save (current);																								
																													
			window.openDialog ("chrome://didius/content/itemedit/itemedit.xul", current.id, "chrome", {itemId: current.id});
		},
									
		edit : function ()
		{		
			var current = main.controls.items.getRow ();
									
			window.openDialog ("chrome://didius/content/itemedit/itemedit.xul", current.id, "chrome", {itemId: current.id});
		},
		
		destroy : function ()
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			var result = prompts.confirm (null, "Slet effekt", "Er du sikker på du vil slette denne effekt ?");
			
			if (result)
			{
				try
				{
					// Get row currently selected and delete the item underneath.
					didius.item.destroy (main.controls.items.getRow ().id);										
					
					// Event: ItemDestroy
					app.events.onItemDestroy.execute (main.controls.items.getRow ().id);
				}
				catch (error)
				{					
					app.error ({exception: error})
				}								
			}
		}
	}		
}