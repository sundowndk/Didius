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
		onItemCreate : function (eventData)
		{		
			var onDone = 	function (items)
							{
								for (idx in items)
								{
									if (items[idx].id == eventData.caseid)
									{	
										main.items.itemsTreeHelper.addRow ({data: eventData});
										break;
									}
								}
							};
						
			didius.case.list ({auction: main.current, async: true, onDone: onDone});
		},
		
		onItemSave : function (eventData)
		{			
			var onDone = 	function (items)
							{
								for (idx in items)
								{
									if (items[idx].id == eventData.caseid)
									{	
										main.items.itemsTreeHelper.setRow ({data: eventData});
										break;
									}
								}
							};
						
			didius.case.list ({auction: main.current, async: true, onDone: onDone});	
		},
		
		onItemDestroy : function (eventData)
		{
			main.items.itemsTreeHelper.removeRow ({id: eventData.id});	
		},
		
		onCaseCreate : function (eventData)
		{		
			if (main.current.id == eventData.auctionid)
			{	
				var data = {};
				data.id = eventData.id;
				data.no = eventData.no;
				data.title = eventData.title;
				data.customer = eventData.customer.name;
			
				main.cases.casesTreeHelper.addRow ({data: data});
			}
		},
		
		onCaseSave : function (eventData)
		{			
			if (main.current.id == eventData.auctionid)
			{	
				var data = {};
				data.id = eventData.id;
				data.no = eventData.no;
				data.title = eventData.title;
				data.customer = eventData.customer.name;
			
				main.cases.casesTreeHelper.setRow ({data: data});
			}
		},
		
		onCaseDestroy : function (eventData)
		{
			main.cases.casesTreeHelper.removeRow ({id: eventData.id});
		},		
		
		onAuctionDestroy : function (eventData)
		{
			if (main.current.id == eventData.id)
			{
				main.close (true);
			}
		}
	},
		
	set : function ()
	{
		main.checksum = SNDK.tools.arrayChecksum (main.current);
	
		document.getElementById ("no").value = main.current.no;
		document.getElementById ("createdate").dateValue = SNDK.tools.timestampToDate (main.current.createtimestamp);
	
		document.getElementById ("title").value = main.current.title;				
		document.getElementById ("status").value = main.current.status;		
		document.getElementById ("type").value = main.current.type;		
		
		var begin = new Date (Date.parse (main.current.begin));
		document.getElementById ("begin").dateValue = begin;
		document.getElementById ("begintime").value = begin.getHours () +":"+ begin.getMinutes ();
		
		var end = new Date (Date.parse (main.current.end));
		document.getElementById ("end").dateValue = end;
		document.getElementById ("endtime").value = end.getHours () +":"+ end.getMinutes ();
		
		var deadline = new Date (Date.parse (main.current.deadline));
		document.getElementById ("deadline").dateValue = deadline;
		document.getElementById ("deadlinetime").value = deadline.getHours () +":"+ deadline.getMinutes ();
		
		document.getElementById ("location").value = main.current.location;						
		
		document.getElementById ("description").value = main.current.description;						
		
		document.getElementById ("notes").value = main.current.notes;		
						
		main.cases.init ();
		main.items.init ();
							
		document.getElementById ("title").focus ();		
							
		main.onChange ();
	},
	
	get : function ()
	{
		main.current.title = document.getElementById ("title").value;		
		
		main.current.status = document.getElementById ("status").value;		
		main.current.type = document.getElementById ("type").value;		
		
		var begin = document.getElementById ("begin").dateValue;
		begin.setHours (document.getElementById ("begintime").value.split (":")[0]);
		begin.setMinutes (document.getElementById ("begintime").value.split (":")[1]);						
		main.current.begin = SNDK.tools.dateToYMDHM (begin);		
		
		var end = document.getElementById ("end").dateValue;
		end.setHours (document.getElementById ("endtime").value.split (":")[0]);
		end.setMinutes (document.getElementById ("endtime").value.split (":")[1]);										
		main.current.end = SNDK.tools.dateToYMDHM (end);
		
		var deadline = document.getElementById ("deadline").dateValue;
		deadline.setHours (document.getElementById ("deadlinetime").value.split (":")[0]);
		deadline.setMinutes (document.getElementById ("deadlinetime").value.split (":")[1]);
		main.current.deadline = SNDK.tools.dateToYMDHM (deadline);
		
		sXUL.console.log (SNDK.tools.dateToYMDHM (deadline))
		
		main.current.location = document.getElementById ("location").value;				
		
		main.current.description = document.getElementById ("description").value;				
		
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
		
		if (main.current.type == "Web" || main.current.type == "LiveWeb")
		{
			document.getElementById ("end").disabled = false;
			document.getElementById ("endtime").disabled = false;
		}
		else
		{
			document.getElementById ("end").disabled = true;
			document.getElementById ("endtime").disabled = true;
		}
		
		main.cases.onChange ();
	},
	
	items :
	{
		itemsTreeHelper : null,
		
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
			document.getElementById ("itemEdit").disabled = true;
			document.getElementById ("itemDestroy").disabled = true;
						
			didius.item.list ({auction: main.current, async: true, onDone: onDone});				
		},
		
		onChange : function ()
		{
			if (main.items.itemsTreeHelper.getCurrentIndex () != -1)
			{										
				document.getElementById ("itemEdit").disabled = false;
				document.getElementById ("itemDestroy").disabled = false;
			}
			else
			{				
				document.getElementById ("itemEdit").disabled = true;
				document.getElementById ("itemDestroy").disabled = true;
			}
			
			if (main.current.status == "Closed" || main.current.status == "Running")
			{				
				document.getElementById ("itemDestroy").disabled = true;
			}
		},
		
		sort : function (attributes)
		{
			main.items.itemsTreeHelper.sort (attributes);
		},
							
		edit : function ()
		{		
			var current = main.items.itemsTreeHelper.getRow ();
						
			var onSave = function (result)
			{				
				if (result != null)
				{
					main.items.itemsTreeHelper.setRow ({data :result});					
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
					didius.item.destroy (main.items.itemsTreeHelper.getRow ().id);					
				}
				catch (error)
				{
					app.error ({exception: error})
				}								
			}
		}
	},
	
	catalog : 
	{
		print : function ()
		{
			window.openDialog ("chrome://didius/content/auction/catalog/print.xul", "printcatalog", "chrome, modal", {auctionId: main.current.id});	
		}
	},
	
	cases :
	{
		casesTreeHelper : null,
	
		init : function ()
		{
			main.cases.casesTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("cases"), sortColumn: "no", sortDirection: "descending", onDoubleClick: main.cases.edit});
			main.cases.set ();	
		},
		
		set : function ()
		{
			var onDone = 	function (items)
							{															
								for (idx in items)
								{	
									var data = {};
									data.id = items[idx].id;
									data.no = items[idx].no;
									data.title = items[idx].title;
									data.customer = items[idx].customer.name;
																							
									main.cases.casesTreeHelper.addRow ({data: data});
								}
								
								// Enable controls
								document.getElementById ("cases").disabled = false;																
								main.cases.onChange ();
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
			if (main.cases.casesTreeHelper.getCurrentIndex () != -1)
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
			
			if (main.current.status == "Closed" || main.current.status == "Running")
			{
				document.getElementById ("caseCreate").disabled = true;
				document.getElementById ("caseDestroy").disabled = true;
			}
		},
		
		sort : function (attributes)
		{
			main.cases.casesTreeHelper.sort (attributes);
		},
		
		create : function ()
		{
			var onDone =	function (result)
							{
								if (result)
								{
									var case_ = didius.case.create (main.current, result);
																		
									case_.commisionfeepercentage = didius.settings.get ({key: "didius_value_seller_commission_percentage"});
									case_.commisionfeeminimum = didius.settings.get ({key: "didius_value_seller_commission_minimum"});;
									didius.case.save (case_);
																									
									window.openDialog ("chrome://didius/content/caseedit/caseedit.xul", case_.id, "chrome", {caseId: case_.id});
								}
							};
														
			app.choose.customer ({onDone: onDone});
		},
									
		edit : function ()
		{		
			var current = main.cases.casesTreeHelper.getRow ();
															
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
					didius.case.destroy (main.cases.casesTreeHelper.getRow ().id);										
				}
				catch (error)
				{					
					app.error ({exception: error})
				}								
			}
		}
	}			
}