Components.utils.import("resource://didius/js/app.js");

var main =
{
	checksum : null,
	current : null,

	init : function ()
	{
		try
		{
			main.current = didius.auction.load (window.arguments[0].auctionId);
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}								
	
		main.set ();
		
		// Hook events.
		app.events.onItemCreate.addHandler (main.eventHandlers.onItemCreate);
		app.events.onItemSave.addHandler (main.eventHandlers.onItemSave);
		app.events.onItemDestroy.addHandler (main.eventHandlers.onItemDestroy);
	},
	
	eventHandlers : 
	{
		onItemCreate : function (item)
		{
			// Only react to Items beloning to this auction.
			var onDone = 	function (cases)
							{
								for (index in cases)
								{
									if (item.caseid == cases[index].id)
									{	
										main.controls.items.addRow (item);
										break;
									}
								}
							};
						
			didius.case.list ({auction: main.current, async: true, onDone: onDone});						
		},
		
		onItemSave : function (item)
		{
			// Only react to Items beloning to this auction.
			var onDone = 	function (cases)
							{
								for (index in cases)
								{
									if (item.caseid == cases[index].id)
									{	
										main.controls.items.changeRow (item);
										break;
									}
								}
							};
						
			didius.case.list ({auction: main.current, async: true, onDone: onDone});		
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
			
			selectedRow : function ()
			{
				var result = new Array ();
				var tree = document.getElementById ('items');
				
				result.id = tree.view.getCellText (tree.currentIndex, tree.columns.getNamedColumn('id'));
				result.catalogno = tree.view.getCellText (tree.currentIndex, tree.columns.getNamedColumn('catalogno'));
				result.no = tree.view.getCellText (tree.currentIndex, tree.columns.getNamedColumn('no'));				
				result.title = tree.view.getCellText (tree.currentIndex, tree.columns.getNamedColumn('title'));
				
				return result;
			},
			
			clear : function ()
			{
				var treechildren = document.getElementById ('itemsTreeChildren');
								
				while (treechildren.firstChild) 
				{
 						treechildren.removeChild (treechildren.firstChild);
				}
			},
		
			refresh : function ()
			{
				main.controls.items.clear ();
			
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
				document.getElementById ("itemEdit").disabled = true;
				document.getElementById ("itemDestroy").disabled = true;
						
				didius.item.list ({auction: main.current, async: true, onDone: onDone});				
			},
			
			onChange : function ()
			{
				var view = document.getElementById ("items").view;
				var selection = view.selection.currentIndex; 
				
				if (selection != -1)
				{					
					document.getElementById ("itemEdit").disabled = false;
					document.getElementById ("itemDestroy").disabled = false;
				}
				else
				{				
					document.getElementById ("itemEdit").disabled = true;
					document.getElementById ("itemDestroy").disabled = true;
				}
			}
		},
		
			cases :
		{
			addRow : function (case_)
			{
				var children = document.getElementById ('casesTreeChildren');		
	
				var item = document.createElement('treeitem');	
				children.appendChild (item)

				var row = document.createElement('treerow');
				item.appendChild (row);

				var columns = [case_["id"], case_["no"], case_["title"]];
									
				for (index in columns)
				{
					var cell = document.createElement('treecell');
					cell.setAttribute ('label', columns[index]);
					row.appendChild(cell);																		
				}
			},
		
			refresh : function ()
			{
				var onDone = 	function (cases)
								{
									for (index in cases)
									{									
										main.controls.cases.addRow (cases[index]);
									}
								
								// Enable controls
								document.getElementById ("cases").disabled = false;																
								main.controls.cases.onChange ();
							};

				// Disable controls
				document.getElementById ("cases").disabled = true;
				document.getElementById ("caseCreate").disabled = true;
				document.getElementById ("caseEdit").disabled = true;
				document.getElementById ("caseDestroy").disabled = true;
						
				didius.case.list ({auction: main.current, async: true, onDone: onDone});				
			},
			
			changeRow : function (case_)
			{
				var tree = document.getElementById('cases');
				
				for (var i = 0; i < tree.view.rowCount; i++) 
				{
					if (tree.view.getCellText (i, tree.columns.getNamedColumn('id')) == case_.id)					
					{					
						tree.view.setCellText (i, tree.columns.getNamedColumn('title'), case_.title);						
						break;
					}
				}
			},
			
			selectedRow : function ()
			{
				var result = new Array ();
				var tree = document.getElementById ('cases');
				
				result.id = tree.view.getCellText (tree.currentIndex, tree.columns.getNamedColumn('id'));
				result.no = tree.view.getCellText (tree.currentIndex, tree.columns.getNamedColumn('no'));
				result.title = tree.view.getCellText (tree.currentIndex, tree.columns.getNamedColumn('title'));				
				
				return result;
			},
		
		removeRow : function (row)
			{
				if (!row)
				{
					var tree = document.getElementById("cases");
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
		
			onChange : function ()
			{
				var view = document.getElementById ("cases").view;
				var selection = view.selection.currentIndex; 
				
				if (selection != -1)
				{
					document.getElementById ("caseCreate").disabled = false;
					document.getElementById ("caseEdit").disabled = false;
					document.getElementById ("caseDestroy").disabled = false;
				}
				else
				{
					document.getElementById ("caseCreate").disabled = false;
					document.getElementById ("caseEdit").disabled = true;
					document.getElementById ("caseDestroy").disabled = true;
				}
			}
		}
	},
	
	set : function ()
	{
		main.checksum = SNDK.tools.arrayChecksum (main.current);
	
		document.getElementById ("no").value = main.current.no;
	
		document.getElementById ("title").value = main.current.title;		
		
		document.getElementById ("notes").value = main.current.notes;		
						
		main.cases.init ();
		main.items.init ();
							
		main.onChange ();
	},
	
	get : function ()
	{
		main.current.title = document.getElementById ("title").value;		
		
		main.current.notes = document.getElementById ("notes").value;				
	},
	
	save : function ()
	{			
		main.get ();
		
		didius.auction.save (main.current);
				
		main.checksum = SNDK.tools.arrayChecksum (main.current);
		main.onChange ();
		
		if (window.arguments[0].onSave != null)
		{
			window.arguments[0].onSave (main.current);
		}
	},
	
	close : function ()
	{			
		if ((SNDK.tools.arrayChecksum (main.current) != main.checksum))
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			
			if (!prompts.confirm (null, "Ændringer ikke gemt", "Der er fortaget ændringer, der ikke er gemt, vil du forstætte ?"))
			{
				return;
			}			
		}
	
		window.close ();
	},
	
	onChange : function ()
	{
		main.get ();
	
		if ((SNDK.tools.arrayChecksum (main.current) != main.checksum))
		{
			document.getElementById ("save").disabled = false;
			document.getElementById ("close").disabled = false;
		}
		else
		{
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
					
		edit : function ()
		{		
			var current = main.controls.items.selectedRow ();
						
			var onSave = function (result)
			{				
				if (result != null)
				{
					main.controls.items.changeRow (result);					
				}													
			}
							
			window.openDialog ("chrome://didius/content/itemedit/itemedit.xul", current.id, "chrome", {itemId: current.id, onSave: onSave});
		},
		
		destroy : function ()
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			var result = prompts.confirm (null, "Slet effekt", "Er du sikker på du vil slette denne effekt ?");
			
			if (result)
			{
				try
				{
					didius.item.destroy (main.controls.items.selectedRow ().id);
					main.controls.items.removeRow ();
				}
				catch (error)
				{
					app.error ({exception: error})
				}								
			}
		}
	},
	
	cases :
	{
		init : function ()
		{
			main.controls.cases.refresh ();		
		},
		
		create : function ()
		{
			var onDone =	function (result)
							{
								if (result)
								{
									var case_ = didius.case.create (main.current, result);
									didius.case.save (case_);
						
									main.controls.cases.addRow (case_);
									
									var onSave = function (result)
									{				
										if (result != null)
										{
											main.controls.cases.changeRow (result);
										}													
									}
							
									window.openDialog ("chrome://didius/content/caseedit/caseedit.xul", case_.id, "chrome", {caseId: case_.id, onSave: onSave});
								}
							};
														
			app.choose.customer ({onDone: onDone});
		},
									
		edit : function ()
		{		
			var current = main.controls.cases.selectedRow ();
						
			var onSave = function (result)
			{				
				if (result != null)
				{
					main.controls.cases.changeRow (result);					
				}													
			}
							
			window.openDialog ("chrome://didius/content/caseedit/caseedit.xul", current.id, "chrome", {caseId: current.id, onSave: onSave});
		},
		
		destroy : function ()
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			var result = prompts.confirm (null, "Slet sag", "Er du sikker på du vil slette denne sag ?");
			
			if (result)
			{
				try
				{
					didius.case.destroy (main.controls.cases.selectedRow ().id);
					main.controls.cases.removeRow ();
				}
				catch (error)
				{					
					app.error ({exception: error})
				}								
			}
		}
	}			
}