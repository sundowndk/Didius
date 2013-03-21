Components.utils.import("resource://didius/js/app.js");

// ----------------------------------------------------------------------------------------------------------
// | MAIN																									|
// ----------------------------------------------------------------------------------------------------------
var main =
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	mode : null,
	checksum : null,
	auction : null,

	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{
		if (window.arguments[0].auctionId == null)
		{						
			main.auction = didius.auction.create ();
			main.mode = "NEW";									
		}
		else if (window.arguments[0].auctionId != null)
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
			
			main.mode = "EDIT";						
		}
	
		// Init tabs.
		details.init ();
		cases.init ();
		items.init ();
		notes.init ();
	
		main.set ();
		
		// Hook events.			
		app.events.onAuctionDestroy.addHandler (eventHandlers.onAuctionDestroy);
		
		app.events.onCaseSave.addHandler (eventHandlers.onCaseSave);
		app.events.onCaseDestroy.addHandler (eventHandlers.onCaseDestroy);				
		
		app.events.onItemSave.addHandler (eventHandlers.onItemSave);
		app.events.onItemDestroy.addHandler (eventHandlers.onItemDestroy);				
	},
	
	
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{
		main.checksum = SNDK.tools.arrayChecksum (main.auction);
		
		details.set ();
		cases.set ();
		items.set ();
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
	
		if (main.mode == "NEW")
		{
			document.getElementById ("tab.details").disabled = false;
			document.getElementById ("tab.cases").disabled = true;
			document.getElementById ("tab.items").disabled = true;
			document.getElementById ("tab.notes").disabled = false;
		}
		else
		{
			document.getElementById ("tab.details").disabled = false;
			document.getElementById ("tab.cases").disabled = false;
			document.getElementById ("tab.items").disabled = false;
			document.getElementById ("tab.notes").disabled = false;
		}
	
		if ((SNDK.tools.arrayChecksum (main.auction) != main.checksum))
		{
			document.title = "Auktion: "+ main.auction.title +" ["+ main.auction.no +"] *";
		
			document.getElementById ("button.save").disabled = false;
			document.getElementById ("button.close").disabled = false;
		}
		else
		{
			document.title = "Auktion: "+ main.auction.title +" ["+ main.auction.no +"]";
		
			document.getElementById ("button.save").disabled = true;
			document.getElementById ("button.close").disabled = false;
		}
		
		document.getElementById ("button.invoice").disabled = false;
		document.getElementById ("button.turnover").disabled = false;
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
		
		main.mode = "EDIT";
				
		main.checksum = SNDK.tools.arrayChecksum (main.auction);
		main.onChange ();
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
		
		app.events.onCaseSave.removeHandler (eventHandlers.onCaseSave);
		app.events.onCaseDestroy.removeHandler (eventHandlers.onCaseDestroy);
		
		app.events.onItemSave.removeHandler (eventHandlers.onItemSave);
		app.events.onItemDestroy.removeHandler (eventHandlers.onItemDestroy);
			
		// Close window.		
		window.close ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | INVOICE																							|	
	// ------------------------------------------------------------------------------------------------------
	invoice : function ()
	{		
		app.window.open (window, "chrome://didius/content/auction/invoice.xul", "didius.auction.invoice."+ main.auction.id, "modal", {auctionId: main.auction.id});
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | TURNOVER																							|	
	// ------------------------------------------------------------------------------------------------------
	turnover : function ()
	{		
		app.window.open (window, "chrome://didius/content/auction/turnover.xul", "didius.auction.turnover."+ main.auction.id, "modal", {auctionId: main.auction.id});
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
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{		
		document.getElementById ("textbox.no").value = main.auction.no;
		document.getElementById ("datepicker.createdate").dateValue = SNDK.tools.timestampToDate (main.auction.createtimestamp);
	
		document.getElementById ("textbox.title").value = main.auction.title;				
		document.getElementById ("title").focus ();		
		
		document.getElementById ("menulist.status").value = main.auction.status;		
		document.getElementById ("menulist.type").value = main.auction.type;		
		
		var begin = new Date (Date.parse (main.auction.begin));
		document.getElementById ("datepicker.begin").dateValue = begin;
		document.getElementById ("textbox.begintime").value = SNDK.tools.padLeft (begin.getHours (), 2, "0") +":"+ SNDK.tools.padLeft (begin.getMinutes (), 2, "0");
		
		var end = new Date (Date.parse (main.auction.end));
		document.getElementById ("datepicker.end").dateValue = end;
		document.getElementById ("textbox.endtime").value = SNDK.tools.padLeft (end.getHours (), 2, "0") +":"+ SNDK.tools.padLeft (end.getMinutes (), 2, "0");;
		
		var deadline = new Date (Date.parse (main.auction.deadline));
		document.getElementById ("datepicker.deadline").dateValue = deadline;
		document.getElementById ("textbox.deadlinetime").value = SNDK.tools.padLeft (deadline.getHours (), 2, "0") +":"+ SNDK.tools.padLeft (deadline.getMinutes (), 2, "0");
		
		document.getElementById ("textbox.location").value = main.auction.location;								
		document.getElementById ("textbox.description").value = main.auction.description;						
																			
		details.onChange ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | GET																								|	
	// ------------------------------------------------------------------------------------------------------
	get : function ()
	{
		main.auction.title = document.getElementById ("textbox.title").value;		
		
		main.auction.status = document.getElementById ("menulist.status").value;		
		main.auction.type = document.getElementById ("menulist.type").value;		
		
		var begin = document.getElementById ("datepicker.begin").dateValue;
		begin.setHours (document.getElementById ("textbox.begintime").value.split (":")[0]);
		begin.setMinutes (document.getElementById ("textbox.begintime").value.split (":")[1]);						
		main.auction.begin = SNDK.tools.dateToYMDHM (begin);		
		
		var end = document.getElementById ("datepicker.end").dateValue;
		end.setHours (document.getElementById ("textbox.endtime").value.split (":")[0]);
		end.setMinutes (document.getElementById ("textbox.endtime").value.split (":")[1]);										
		main.auction.end = SNDK.tools.dateToYMDHM (end);
		
		var deadline = document.getElementById ("datepicker.deadline").dateValue;
		deadline.setHours (document.getElementById ("textbox.deadlinetime").value.split (":")[0]);
		deadline.setMinutes (document.getElementById ("textbox.deadlinetime").value.split (":")[1]);
		main.auction.deadline = SNDK.tools.dateToYMDHM (deadline);
						
		main.auction.location = document.getElementById ("textbox.location").value;						
		main.auction.description = document.getElementById ("textbox.description").value;						
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
		cases.casesTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("tree.cases"), sortColumn: "no", sortDirection: "descending", onDoubleClick: cases.edit});		
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{
		switch (main.mode)
		{
			case "NEW":
			{
				// Enable listview
				document.getElementById ("tree.cases").disabled = false;
				cases.onChange ();
				break;
			}
			
			case "EDIT":
			{
				var onDone = 	function (items)
								{					
									cases.casesTreeHelper.disableRefresh ();										
									for (idx in items)
									{	
										var _case = items[idx];
									
										var data = {};
										data.id = _case.id;
										data.no = _case.no;
										data.title = _case.title;
																	
										var customer = didius.customer.load (_case.customerid);								
										data.customername = customer.name;
																								
										cases.casesTreeHelper.addRow ({data: data});
									}
									cases.casesTreeHelper.enableRefresh ();
									
									// Enable controls
									document.getElementById ("tree.cases").disabled = false;																
									cases.onChange ();
								};
					
				didius.case.list ({auction: main.auction, async: true, onDone: onDone});			
				break;
			}
		}		
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------
	onChange : function ()
	{					
		if (cases.casesTreeHelper.getCurrentIndex () != -1)
		{										
			document.getElementById ("button.casecreate").disabled = false;
			document.getElementById ("button.caseedit").disabled = false;
			document.getElementById ("button.casedestroy").disabled = false;
		}
		else
		{									
			document.getElementById ("button.casecreate").disabled = false;
			document.getElementById ("button.caseedit").disabled = true;
			document.getElementById ("button.casedestroy").disabled = true;
		}		
		
		if (main.auction.status == "Closed" || main.auction.status == "Running")
		{
			document.getElementById ("button.casecreate").disabled = true;
			document.getElementById ("button.casedestroy").disabled = true;
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
								app.window.open (window, "chrome://didius/content/case/edit.xul", "didius.case.edit."+ SNDK.tools.newGuid (), null, {auctionId: main.auction.id, customerId: result.id});
							}
						};
													
		app.choose.customer ({onDone: onDone});
	},
			
	// ------------------------------------------------------------------------------------------------------
	// | EDIT																								|	
	// ------------------------------------------------------------------------------------------------------					
	edit : function ()
	{		
		app.window.open (window, "chrome://didius/content/case/edit.xul", "didius.case.edit."+ cases.casesTreeHelper.getRow ().id, null, {caseId: cases.casesTreeHelper.getRow ().id});
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
				didius.case.destroy ({id: cases.casesTreeHelper.getRow ().id});
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
		items.itemsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("tree.items"), sortColumn: "catalogno", sortDirection: "descending", onDoubleClick: items.edit});				
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{	
		switch (main.mode)
		{
			case "NEW":
			{
				// Enable listview
				document.getElementById ("tree.items").disabled = false;
				cases.onChange ();
				break;
			}
			
			case "EDIT":
			{
				var onDone = 	function (result)
						{
							items.itemsTreeHelper.disableRefresh ();
							for (var index in result)
							{			
								var item = result[index];						
								var data = {};
								data.id = item.id;
								data.catalogno = item.catalogno;
								data.no = item.no;
								data.title = item.title;
								
								if (item.vat)
								{
									data.vat = "ja";								
								}
								else
								{
									data.vat = "nej";								
								}
								
							//	var case_ = didius.case.load ({id: item.caseid});
							//	var customer = didius.customer.load (case_.customerid);								
							//	data.customername = customer.name;																								
							
								items.itemsTreeHelper.addRow ({data: data});
							}
							items.itemsTreeHelper.enableRefresh ();
							
							// Enable controls
							document.getElementById ("tree.items").disabled = false;																
							items.onChange ();
						};

				didius.item.list ({auction: main.auction, async: true, onDone: onDone});				
				break;
			}
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------
	onChange : function ()
	{
		if (items.itemsTreeHelper.getCurrentIndex () != -1)
		{										
			document.getElementById ("button.itemedit").disabled = false;
			document.getElementById ("button.itemdestroy").disabled = false;
		}
		else
		{				
			document.getElementById ("button.itemedit").disabled = true;
			document.getElementById ("button.itemdestroy").disabled = true;
		}
		
		if (main.auction.status == "Closed" || main.auction.status == "Running")
		{				
			document.getElementById ("button.itemdestroy").disabled = true;
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SORT																								|	
	// ------------------------------------------------------------------------------------------------------
	sort : function (attributes)
	{
		items.itemsTreeHelper.sort (attributes);
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | EDIT																								|	
	// ------------------------------------------------------------------------------------------------------					
	edit : function ()
	{		
		app.window.open (window, "chrome://didius/content/item/edit.xul", "didius.item.edit."+ items.itemsTreeHelper.getRow ().id, null, {itemId: items.itemsTreeHelper.getRow ().id});
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | DESTROY																							|	
	// ------------------------------------------------------------------------------------------------------
	destroy : function ()
	{
		if (app.window.prompt.confirm ("Slet effekt", "Er du sikker på du vil slette denne effekt ?"))
		{
			try
			{
				didius.item.destroy ({id: items.itemsTreeHelper.getRow ().id});					
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
		app.window.open (window, "chrome://didius/content/auction/catalog/print.xul", "didius.auction.catalog.print."+ main.auction.id, "modal", {auctionId: main.auction.id});
	}
}

// ----------------------------------------------------------------------------------------------------------
// | LABELS																								|
// ----------------------------------------------------------------------------------------------------------
var labels =
{
	// ------------------------------------------------------------------------------------------------------
	// | PRINT																								|	
	// ------------------------------------------------------------------------------------------------------
	print : function ()
	{
		var progresswindow = app.window.open (window, "chrome://didius/content/invoice/progress.xul", "auction.invoice.progress."+ main.invoice.id, "", {});	
										
		var workload = function ()
		{
			progresswindow.removeEventListener ("load", workload, false)
		
			var overallprogress = 0;
			var totalprogress = 1;
						
			var items = didius.item.list ({auction: main.auction});
		
			var start =	function ()	
						{						
							worker1 ();
						};
								
			// Email invoice.
			var worker1 =	function ()
							{
								// Reset progressmeter #1.
								progresswindow.document.getElementById ("description1").textContent = "Udskriver ...";
								progresswindow.document.getElementById ("progressmeter1").mode = "undetermined"
								progresswindow.document.getElementById ("progressmeter1").value = 0;
																						
								var nextWorker =	function ()
													{
													
													
														// Update progressmeter #1
														overallprogress++;
														progresswindow.document.getElementById ("progressmeter1").mode = "determined"
														progresswindow.document.getElementById ("progressmeter1").value = (overallprogress / totalprogress) * 100;
																																				
														setTimeout (finish, 100);
													};
																							
								var onDone = 	function ()
												{
													nextWorker ();
												};
													
								didius.common.print.label ({items: items, onDone: onDone});			
							};
																
			var finish =	function ()	
							{															
								progresswindow.close ();
							};
			
			// Start worker1;				
			setTimeout (start, 100);
		}
		
		progresswindow.addEventListener ("load", workload);		
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
		document.getElementById ("textbox.notes").value = main.auction.notes;		
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | GET																								|	
	// ------------------------------------------------------------------------------------------------------
	get : function ()
	{
		main.auction.notes = document.getElementById ("textbox.notes").value;
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------
	onChange : function ()
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
	// | ONCASESAVE																							|	
	// ------------------------------------------------------------------------------------------------------
	onCaseSave : function (eventData)
	{			
		if (main.auction.id == eventData.auctionid)
		{	
			var data = {};
			data.id = eventData.id;
			data.no = eventData.no;
			data.title = eventData.title;
			
			var customer = didius.customer.load (eventData.customerid);
			data.customername = customer.name;
			
			cases.casesTreeHelper.setRow ({data: data});
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCASEDESTROY																						|	
	// ------------------------------------------------------------------------------------------------------
	onCaseDestroy : function (eventData)
	{
		cases.casesTreeHelper.removeRow ({id: eventData.id});
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONITEMSAVE																							|	
	// ------------------------------------------------------------------------------------------------------
	onItemSave : function (eventData)
	{	
		var case_ = didius.case.load ({id: eventData.caseid});
	
		if (main.auction.id == case_.auctionid)
		{				
			var data = {};
			data.id = eventData.id;
			data.catalogno = eventData.catalogno;
			data.no = eventData.no;
			data.title = eventData.title;
								
			var customer = didius.customer.load (case_.customerid);								
			data.customername = customer.name;																								
							
			items.itemsTreeHelper.setRow ({data: data});	
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONITEMDESTROY																						|	
	// ------------------------------------------------------------------------------------------------------
	onItemDestroy : function (eventData)
	{
		items.itemsTreeHelper.removeRow ({id: eventData.id});	
	}
}
		