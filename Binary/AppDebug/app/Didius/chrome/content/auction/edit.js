Components.utils.import("resource://didius/js/app.js");

// ----------------------------------------------------------------------------------------------------------
// | MAIN																									|
// ---------------------------------------------------------------------------------------------------------
var main =
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	checksum : null,
	auction : null,

	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{
		try
		{
			main.auction = didius.auction.load (window.arguments[0].auctionId);
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}								
	
		// Init tabs.
		details.init ();
		cases.init ();
		notes.init ();
	
		main.set ();
		
		// Hook events.			
		app.events.onAuctionDestroy.addHandler (eventHandlers.onAuctionDestroy);
		
//		app.events.onCaseCreate.addHandler (main.eventHandlers.onCaseCreate);
//		app.events.onCaseSave.addHandler (main.eventHandlers.onCaseSave);
//		app.events.onCaseDestroy.addHandler (main.eventHandlers.onCaseDestroy);				
		
//		app.events.onItemCreate.addHandler (main.eventHandlers.onItemCreate);
//		app.events.onItemSave.addHandler (main.eventHandlers.onItemSave);
//		app.events.onItemDestroy.addHandler (main.eventHandlers.onItemDestroy);				
	},
	
	
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{
		main.checksum = SNDK.tools.arrayChecksum (main.auction);
		
		details.set ();
		cases.set ();
		notes.set ();
		
		main.onChange ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | GET																								|	
	// ------------------------------------------------------------------------------------------------------
	get : function ()
	{
		details.get ();
		notes.get ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------
	onChange : function ()
	{
		main.get ();
	
		if ((SNDK.tools.arrayChecksum (main.auction) != main.checksum))
		{
			document.title = "Auktion: "+ main.auction.title +" ["+ main.auction.no +"] *";
		
			document.getElementById ("save").disabled = false;
			document.getElementById ("close").disabled = false;
		}
		else
		{
			document.title = "Auktion: "+ main.auction.title +" ["+ main.auction.no +"]";
		
			document.getElementById ("save").disabled = true;
			document.getElementById ("close").disabled = false;
		}
//		
//		if (main.current.type == "Web" || main.current.type == "LiveWeb")
//		{
//			document.getElementById ("end").disabled = false;
//			document.getElementById ("endtime").disabled = false;
//		}
//		else
//		{
//			document.getElementById ("end").disabled = true;
//			document.getElementById ("endtime").disabled = true;
//		}
		
//		main.cases.onChange ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SAVE																								|	
	// ------------------------------------------------------------------------------------------------------
	save : function ()
	{			
		main.get ();
		
		didius.auction.save (main.auction);
				
		main.checksum = SNDK.tools.arrayChecksum (main.current);
		main.onChange ();
		
		if (window.arguments[0].onSave != null)
		{
			window.arguments[0].onSave (main.current);
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | CLOSE																								|	
	// ------------------------------------------------------------------------------------------------------
	close : function (force)
	{			
		// If we are forced to close, then dont promt user about potential unsaved data.
		if (!force)
		{
			// If checksums do not match, promt user about unsaved data.
			if ((SNDK.tools.arrayChecksum (main.auction) != main.checksum))
			{							
				if (!app.window.prompt.confirm ("Ændringer ikke gemt", "Der er fortaget ændringer, der ikke er gemt, vil du forstætte ?"))
				{
					return;
				}			
			}
		}
		
		// Unhook events.						
		app.events.onAuctionDestroy.removeHandler (eventHandlers.onAuctionDestroy);
		
//		app.events.onCaseCreate.removeHandler (main.eventHandlers.onCaseCreate);
//		app.events.onCaseSave.removeHandler (main.eventHandlers.onCaseSave);
//		app.events.onCaseDestroy.removeHandler (main.eventHandlers.onCaseDestroy);
		
//		app.events.onItemCreate.removeHandler (main.eventHandlers.onItemCreate);
//		app.events.onItemSave.removeHandler (main.eventHandlers.onItemSave);
//		app.events.onItemDestroy.removeHandler (main.eventHandlers.onItemDestroy);
			
		// Close window.		
		window.close ();
	}
}

// ----------------------------------------------------------------------------------------------------------
// | DETAILS																								|
// ----------------------------------------------------------------------------------------------------------
var details = 
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------

	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{
		//details.set ();
//		main.items.itemsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("items"), sortColumn: "catalogno", sortDirection: "descending", onDoubleClick: main.items.edit});
//		main.items.set ();		
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{		
		document.getElementById ("no").value = main.auction.no;
		document.getElementById ("createdate").dateValue = SNDK.tools.timestampToDate (main.auction.createtimestamp);
	
		document.getElementById ("title").value = main.auction.title;				
		document.getElementById ("status").value = main.auction.status;		
		document.getElementById ("type").value = main.auction.type;		
		
		var begin = new Date (Date.parse (main.auction.begin));
		document.getElementById ("begin").dateValue = begin;
		document.getElementById ("begintime").value = SNDK.tools.padLeft (begin.getHours (), 2, "0") +":"+ SNDK.tools.padLeft (begin.getMinutes (), 2, "0");
		
		var end = new Date (Date.parse (main.auction.end));
		document.getElementById ("end").dateValue = end;
		document.getElementById ("endtime").value = SNDK.tools.padLeft (end.getHours (), 2, "0") +":"+ SNDK.tools.padLeft (end.getMinutes (), 2, "0");;
		
		var deadline = new Date (Date.parse (main.auction.deadline));
		document.getElementById ("deadline").dateValue = deadline;
		document.getElementById ("deadlinetime").value = SNDK.tools.padLeft (deadline.getHours (), 2, "0") +":"+ SNDK.tools.padLeft (deadline.getMinutes (), 2, "0");
		
		document.getElementById ("location").value = main.auction.location;								
		document.getElementById ("description").value = main.auction.description;						
		
		document.getElementById ("title").focus ();		
																			
		details.onChange ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | GET																								|	
	// ------------------------------------------------------------------------------------------------------
	get : function ()
	{
		main.auction.title = document.getElementById ("title").value;		
		
		main.auction.status = document.getElementById ("status").value;		
		main.auction.type = document.getElementById ("type").value;		
		
		var begin = document.getElementById ("begin").dateValue;
		begin.setHours (document.getElementById ("begintime").value.split (":")[0]);
		begin.setMinutes (document.getElementById ("begintime").value.split (":")[1]);						
		main.auction.begin = SNDK.tools.dateToYMDHM (begin);		
		
		var end = document.getElementById ("end").dateValue;
		end.setHours (document.getElementById ("endtime").value.split (":")[0]);
		end.setMinutes (document.getElementById ("endtime").value.split (":")[1]);										
		main.auction.end = SNDK.tools.dateToYMDHM (end);
		
		var deadline = document.getElementById ("deadline").dateValue;
		deadline.setHours (document.getElementById ("deadlinetime").value.split (":")[0]);
		deadline.setMinutes (document.getElementById ("deadlinetime").value.split (":")[1]);
		main.auction.deadline = SNDK.tools.dateToYMDHM (deadline);
						
		main.auction.location = document.getElementById ("location").value;						
		main.auction.description = document.getElementById ("description").value;						
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------
	onChange : function ()
	{
		details.get ();
		main.onChange ();
	}
}

// ----------------------------------------------------------------------------------------------------------
// | CASES																									|
// ----------------------------------------------------------------------------------------------------------
var cases =
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	casesTreeHelper : null,

	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{
		cases.casesTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("cases"), sortColumn: "no", sortDirection: "descending", onDoubleClick: cases.edit});		
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{
		var onDone = 	function (items)
						{															
							for (idx in items)
							{	
								var _case = items[idx];
							
								var data = {};
								data.id = _case.id;
								data.no = _case.no;
								data.title = _case.title;
															
								var customer = didius.customer.load (_case.customerid);								
								data.customer = customer.name;
																						
								cases.casesTreeHelper.addRow ({data: data});
							}
							
							// Enable controls
							document.getElementById ("cases").disabled = false;																
							cases.onChange ();
						};
			
		didius.case.list ({auction: main.auction, async: true, onDone: onDone});			
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------
	onChange : function ()
	{					
		if (cases.casesTreeHelper.getCurrentIndex () != -1)
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
		
		if (main.auction.status == "Closed" || main.auction.status == "Running")
		{
			document.getElementById ("caseCreate").disabled = true;
			document.getElementById ("caseDestroy").disabled = true;
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SORT																								|	
	// ------------------------------------------------------------------------------------------------------
	sort : function (attributes)
	{
		cases.casesTreeHelper.sort (attributes);
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | CREATE																								|	
	// ------------------------------------------------------------------------------------------------------
	create : function ()
	{
		var onDone =	function (result)
						{
							if (result)
							{
								window.openDialog ("chrome://didius/content/case/edit.xul", "didius.case.edit."+ SNDK.tools.newGuid (), "chrome", {auctionId: main.auction.id, customerId: result.id});															
							}
						};
													
		app.choose.customer ({onDone: onDone});
	},
			
	// ------------------------------------------------------------------------------------------------------
	// | EDIT																								|	
	// ------------------------------------------------------------------------------------------------------					
	edit : function ()
	{		
		window.openDialog ("chrome://didius/content/case/edit.xul", "didius.case.edit."+ cases.casesTreeHelper.getRow ().id, "chrome", {caseId: cases.casesTreeHelper.getRow ().id});
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | DESTROY																							|	
	// ------------------------------------------------------------------------------------------------------
	destroy : function ()
	{
		if (app.window.prompt.confirm ("Slet sag", "Er du sikker på du vuk slette denne sag ?"))
		{
			try
			{
				didius.case.destroy (cases.casesTreeHelper.getRow ().id);										
			}
			catch (error)
			{					
				app.error ({exception: error})
			}								
		}
	}
}			

// ----------------------------------------------------------------------------------------------------------
// | ITEMS																									|
// ----------------------------------------------------------------------------------------------------------
var items =
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	itemsTreeHelper : null,
	
	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{
		main.items.itemsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("items"), sortColumn: "catalogno", sortDirection: "descending", onDoubleClick: main.items.edit});
		main.items.set ();		
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
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
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------
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
	
	// ------------------------------------------------------------------------------------------------------
	// | SORT																								|	
	// ------------------------------------------------------------------------------------------------------
	sort : function (attributes)
	{
		main.items.itemsTreeHelper.sort (attributes);
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | EDIT																								|	
	// ------------------------------------------------------------------------------------------------------					
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
	
	// ------------------------------------------------------------------------------------------------------
	// | DESTROY																							|	
	// ------------------------------------------------------------------------------------------------------
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
}

// ----------------------------------------------------------------------------------------------------------
// | CATALOG																								|
// ----------------------------------------------------------------------------------------------------------
var catalog =
{
	// ------------------------------------------------------------------------------------------------------
	// | PRINT																								|	
	// ------------------------------------------------------------------------------------------------------
	print : function ()
	{
		window.openDialog ("chrome://didius/content/auction/catalog/print.xul", "printcatalog", "chrome, modal", {auctionId: main.current.id});	
	}
}



// ----------------------------------------------------------------------------------------------------------
// | NOTES																									|
// ----------------------------------------------------------------------------------------------------------
var notes =
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	
	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{
		notes.set ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{
		document.getElementById ("notes").value = main.auction.notes;		
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | GET																								|	
	// ------------------------------------------------------------------------------------------------------
	get : function ()
	{
		main.auction.notes = document.getElementById ("notes").value;
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------
	onchange : function ()
	{
		notes.get ();
		main.onChange ();
	}
}


// ----------------------------------------------------------------------------------------------------------
// | EVENTHANDLERS																							|
// ---------------------------------------------------------------------------------------------------------
var eventHandlers =
{
	// ------------------------------------------------------------------------------------------------------
	// | ONAUCTIONDESTROY																					|	
	// ------------------------------------------------------------------------------------------------------
	onAuctionDestroy : function (eventData)
	{
		if (main.auction.id == eventData.id)
		{
			main.close (true);
		}
	},

	// ------------------------------------------------------------------------------------------------------
	// | ONITEMCREATE																						|	
	// ------------------------------------------------------------------------------------------------------
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
	
	// ------------------------------------------------------------------------------------------------------
	// | ONITEMSAVE																							|	
	// ------------------------------------------------------------------------------------------------------
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
	
	// ------------------------------------------------------------------------------------------------------
	// | ONITEMDESTROY																						|	
	// ------------------------------------------------------------------------------------------------------
	onItemDestroy : function (eventData)
	{
		main.items.itemsTreeHelper.removeRow ({id: eventData.id});	
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCASECREATE																						|	
	// ------------------------------------------------------------------------------------------------------
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
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCASESAVE																							|	
	// ------------------------------------------------------------------------------------------------------
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
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCASEDESTROY																						|	
	// ------------------------------------------------------------------------------------------------------
	onCaseDestroy : function (eventData)
	{
		main.cases.casesTreeHelper.removeRow ({id: eventData.id});
	}
}
		