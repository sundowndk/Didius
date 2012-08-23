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
		app.events.onAuctionDestroy.addHandler (main.eventHandlers.onAuctionDestroy);
		
		app.events.onCaseCreate.addHandler (main.eventHandlers.onCaseCreate);
		app.events.onCaseSave.addHandler (main.eventHandlers.onCaseSave);
		app.events.onCaseDestroy.addHandler (main.eventHandlers.onCaseDestroy);				
		
		app.events.onItemCreate.addHandler (main.eventHandlers.onItemCreate);
		app.events.onItemSave.addHandler (main.eventHandlers.onItemSave);
		app.events.onItemDestroy.addHandler (main.eventHandlers.onItemDestroy);				
	},
	
	eventHandlers : 
	{
		onItemCreate : function (item)
		{		
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
			var onDone = 	function (cases)
							{
								for (index in cases)
								{
									if (item.caseid == cases[index].id)
									{	
										main.controls.items.setRow (item);
										break;
									}
								}
							};
						
			didius.case.list ({auction: main.current, async: true, onDone: onDone});		
		},
		
		onItemDestroy : function (id)
		{
			main.controls.items.removeRow (id);	
		},
		
		onCaseCreate : function (case_)
		{		
			if (main.current.id == case_.auctionid)
			{	
				main.controls.cases.addRow (case_);				
			}
		},
		
		onCaseSave : function (case_)
		{			
			if (main.current.id == case_.auctionid)
			{	
				main.controls.cases.setRow (case_);				
			}
		},
		
		onCaseDestroy : function (id)
		{
			main.controls.cases.removeRow (id);	
		},		
		
		onAuctionDestroy : function (id)
		{
			if (main.current.id == id)
			{
				main.close (true);
			}
		}
	},
	
	controls :
	{
		cases :
		{
			addRow : function (case_)
			{
				var treechildren = document.getElementById ('casesTreeChildren');		
	
				var treeitem = document.createElement('treeitem');	
				treechildren.appendChild (treeitem)

				var treerow = document.createElement('treerow');
				treeitem.appendChild (treerow);

				var columns = [case_["id"], case_["no"], case_["title"]];
										
				for (index in columns)
				{
					var treecell = document.createElement('treecell');
					treecell.setAttribute ('label', columns[index]);
					treerow.appendChild (treecell);
				}
			},
									
			removeRow : function (id)
			{
				var tree = document.getElementById ('cases');
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
			
			setRow : function (case_)
			{
				var tree = document.getElementById ('cases');
				var index = -1;
				
				if (!case_)
				{
					index = tree.currentIndex;
				}
				else
				{
					for (var i = 0; i < tree.view.rowCount; i++) 
					{	
						if (tree.view.getCellText (i, tree.columns.getNamedColumn ('id')) == case_.id)
						{					
							index = i;							
							break;
						}
					}
				}

				if (index != -1)
				{
					tree.view.setCellText (index, tree.columns.getNamedColumn ('id'), case_.id);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('no'), case_.no);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('title'), case_.title);					
				}
			},
			
			getRow : function (id)
			{
				var result = new Array ();
				
				var tree = document.getElementById ('cases');
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
					result.id = tree.view.getCellText (index, tree.columns.getNamedColumn ('id'));
					result.no = tree.view.getCellText (index, tree.columns.getNamedColumn ('no'));
					result.title = tree.view.getCellText (index, tree.columns.getNamedColumn ('title'));
				}
				
				return result;
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
		},
	
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
			
			setRow : function (item)
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
						if (tree.view.getCellText (i, tree.columns.getNamedColumn ('id')) == id)
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
		app.events.onAuctionDestroy.removeHandler (main.eventHandlers.onAuctionDestroy);
		
		app.events.onCaseCreate.removeHandler (main.eventHandlers.onCaseCreate);
		app.events.onCaseSave.removeHandler (main.eventHandlers.onCaseSave);
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
			document.title = "Auktion: "+ main.current.title +" ["+ main.current.no +"] *";
		
			document.getElementById ("save").disabled = false;
			document.getElementById ("close").disabled = false;
		}
		else
		{
			document.title = "Auktion: "+ main.current.title +" ["+ main.current.no +"]";
		
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
			var current = main.controls.items.getRow ();
						
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
																									
									window.openDialog ("chrome://didius/content/caseedit/caseedit.xul", case_.id, "chrome", {caseId: case_.id});
								}
							};
														
			app.choose.customer ({onDone: onDone});
		},
									
		edit : function ()
		{		
			var current = main.controls.cases.getRow ();
															
			window.openDialog ("chrome://didius/content/caseedit/caseedit.xul", current.id, "chrome", {caseId: current.id});
		},
		
		destroy : function ()
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			var result = prompts.confirm (null, "Slet sag", "Er du sikker på du vil slette denne sag ?");
			
			if (result)
			{
				try
				{
					didius.case.destroy (main.controls.cases.getRow ().id);										
				}
				catch (error)
				{					
					app.error ({exception: error})
				}								
			}
		}
	}			
}