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
		onCaseDestroy : function (eventData)
		{
			if (main.current.id == eventData.id)
			{
				main.close (true);
			}
		},
	
		onItemCreate : function (eventData)
		{			
			if (main.current.id == eventData.caseid)
			{
				main.items.itemsTreeHelper.addRow ({data: eventData});
			}
		},
		
		onItemSave : function (eventData)
		{			
			if (main.current.id == eventData.caseid)
			{
				main.items.itemsTreeHelper.setRow ({data: eventData});
			}
		},
		
		onItemDestroy : function (eventData)
		{			
			main.items.itemsTreeHelper.removeRow ({id: eventData.id});
		}
	},
		
	set : function ()
	{
		main.checksum = SNDK.tools.arrayChecksum (main.current);
	
		document.getElementById ("no").value = main.current.no;
		document.getElementById ("createdate").dateValue = SNDK.tools.timestampToDate (main.current.createtimestamp);
		document.getElementById ("auction").value = main.current.auction.title;		
		document.getElementById ("customer").value = main.current.customer.name;
	
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
			main.items.itemsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("items"), sortColumn: "catalogno", sortDirection: "descending", onDoubleClick: main.items.edit});
			main.items.set ();
		},
		
		set : function ()
		{
			var onDone = 	function (items)
							{
								for (idx in items)
								{									
									main.items.itemsTreeHelper.addRow ({data: items[idx]});
								}
								
								// Enable controls
								document.getElementById ("items").disabled = false;
								main.items.onChange ();
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
			if (main.items.itemsTreeHelper.getCurrentIndex () != -1)
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
		},
		
		sort : function (attributes)
		{
			main.items.itemsTreeHelper.sort (attributes);
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
			var current = main.items.itemsTreeHelper.getRow ();
									
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
					didius.item.destroy (main.items.itemsTreeHelper.getRow ().id);															
				}
				catch (error)
				{					
					app.error ({exception: error})
				}								
			}
		}
	}		
}