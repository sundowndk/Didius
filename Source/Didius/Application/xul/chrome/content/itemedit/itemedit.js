Components.utils.import("resource://didius/js/app.js");

var main =
{
	checksum : null,
	current : null,
	catalogNo: null,

	init : function ()
	{
		try
		{
			main.current = didius.item.load (window.arguments[0].itemId);
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}								
	
		main.set ();
	},
	
	controls :
	{
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
								
								//main.controls.customers.onChange ();
							};

				// Disable controls
				document.getElementById ("cases").disabled = true;
				//document.getElementById ("customerCreate").disabled = true;
				//document.getElementById ("customerEdit").disabled = true;
				//document.getElementById ("customerDestroy").disabled = true;
			
			
				didius.case.list ({customer: main.current, async: true, onDone: onDone});				
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
		
			onChange : function ()
			{
				var view = document.getElementById ("cases").view;
				var selection = view.selection.currentIndex; 
				
				if (selection != -1)
				{
					document.getElementById ("caseEdit").disabled = false;
					document.getElementById ("caseDestroy").disabled = false;
				}
				else
				{
					document.getElementById ("caseEdit").disabled = true;
					document.getElementById ("caseDestroy").disabled = true;
				}
			}
		}
	},
	
	set : function ()
	{
		document.title = "Effekt: "+ main.current.title +" ["+ main.current.no +"]";
	
		main.checksum = SNDK.tools.arrayChecksum (main.current);
		main.catalogNo = main.current.catalogno;
	
		document.getElementById ("no").value = main.current.no;
	
		document.getElementById ("catalogno").value = main.current.catalogno;
		document.getElementById ("title").value = main.current.title;
		document.getElementById ("description").value = main.current.description;
				
		main.onChange ();
	},
	
	get : function ()
	{			
		main.current.catalogno = document.getElementById ("catalogno").value;
		main.current.title = document.getElementById ("title").value;
		main.current.description = document.getElementById ("description").value;	
	},
	
	save : function ()
	{			
		main.get ();
		
		// Verifty CatalogNo if it was changed.
//		if (main.current.catalogno != main.catalogno)
//		{								
//			var test = didius.helpers.isCatalogNoTaken ({auction: didius.auction.load (didius.case.load (main.current.caseid).auctionid), catalogNo: document.getElementById ("catalogno").value});
//								
//			if (test)
//			{
//				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
//				prompts.alert(null, "Der opstod en fejl", "Det angivet katalog nummer er i brug. Systemmet har derfor fundet det laveste ubrugte katalog nummer og angivet dette i stedet.");
//				
//				document.getElementById ("catalogno").value = didius.helpers.newCatalogNo ({auction: didius.auction.load (didius.case.load (main.current.caseid).auctionid)});
//			}								
//		}
				
		didius.item.save (main.current);
		
		// Event: ItemSave
		app.events.onItemSave.execute (main.current);
				
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
				return false;
			}			
		}
	
		window.close ();
	},
	
	onChange : function ()
	{
		main.get ();
	
		if ((SNDK.tools.arrayChecksum (main.current) != main.checksum))
		{
			document.title = "Effekt: "+ main.current.title +" ["+ main.current.no +"] *";
		
			document.getElementById ("save").disabled = false;
			document.getElementById ("close").disabled = false;
		}
		else
		{
			document.title = "Effekt: "+ main.current.title +" ["+ main.current.no +"]";
		
			document.getElementById ("save").disabled = true;
			document.getElementById ("close").disabled = false;
		}
	},
	
	cases :
	{
		init : function ()
		{
			main.controls.cases.refresh ();		
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
			var result = prompts.confirm (null, "Slet sag", "Er du sikker på du vil slette denne saf ?");
			
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