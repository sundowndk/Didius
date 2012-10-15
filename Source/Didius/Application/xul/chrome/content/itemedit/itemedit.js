Components.utils.import("resource://didius/js/app.js");

var main =
{
	checksum : null,
	current : null,
	catalogNo : null,
		
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
		
		main.bids.init ();
	
		// Hook events.		
		app.events.onItemDestroy.addHandler (main.eventHandlers.onItemDestroy);		
		
		app.events.onBidCreate.addHandler (main.eventHandlers.onBidCreate);
		app.events.onBidSave.addHandler (main.eventHandlers.onBidSave);
		app.events.onBidDestroy.addHandler (main.eventHandlers.onBidDestroy);
	},
	
	eventHandlers : 
	{
		onItemDestroy : function (eventData)
		{
			if (main.current.id == eventData.id)
			{
				main.close (true);
			}
		},		
		
		onBidCreate : function (eventData)
		{
			main.bids.bidsTreeHelper.addRow ({data: eventData});
		},
		
		onBidSave : function (eventData)
		{
			main.bids.bidsTreeHelper.setRow ({data: eventData});
		},
		
		onBidDestroy : function (eventData)
		{
			main.bids.bidsTreeHelper.removeRow ({id: eventData.id});
		}
	},
		
	setDataFields : function ()
	{
		var pref = "stelnummer;Stelnummer|aargang;Årgang|regnr;Reg.nr";
		var keys = pref.split ("|");
		
		for (idx in keys)
		{
			var key = keys[idx].split (";")[0];
			var alias = keys[idx].split (";")[1];
		
			var hbox = document.createElement ("hbox");			
			hbox.setAttribute ("align", "center");	
			document.getElementById ("datafields").appendChild (hbox);		
			
			var label = document.createElement ("label");
			label.className = "Label";
			label.setAttribute ("value", alias +":");
			hbox.appendChild (label);
			
			var textbox = document.createElement ("textbox");
			textbox.setAttribute ("id", key);
			textbox.setAttribute ("flex", 1);
			textbox.setAttribute ("onkeyup", "main.onChange ();");				
			
			hbox.appendChild (textbox);
			if (main.current.fields[key] != null)
			{
				textbox.value = main.current.fields[key];
			}
		}						
	},
	
	getDataFields : function ()
	{
		main.current.fields =  new Array ();
	
		var pref = "stelnummer;Stelnummer|aargang;Årgang|regnr;Reg.nr";
		var keys = pref.split ("|");
		for (idx in keys)
		{
			var key = keys[idx].split (";")[0];			
		
			main.current.fields[key] = document.getElementById (key).value;
		}
	},
	
	set : function ()
	{
		main.checksum = SNDK.tools.arrayChecksum (main.current);
		main.catalogNo = main.current.catalogno;
	
		document.getElementById ("no").value = main.current.no;
		document.getElementById ("createdate").dateValue = SNDK.tools.timestampToDate (main.current.createtimestamp);
	
		document.getElementById ("catalogno").value = main.current.catalogno;		
		document.getElementById ("description").value = main.current.description;						
						
		document.getElementById ("minimumbid").value = main.current.minimumbid;
		
		document.getElementById ("appraisal1").value = main.current.appraisal1;
		document.getElementById ("appraisal2").value = main.current.appraisal2;
		document.getElementById ("appraisal3").value = main.current.appraisal3;
		
		main.setDataFields ();
						
		main.onChange ();
	},
	
	get : function ()
	{			
		main.current.catalogno = document.getElementById ("catalogno").value;				
		main.current.description = document.getElementById ("description").value;	
		
		main.current.minimumbid = document.getElementById ("minimumbid").value;	
		
		main.current.appraisal1 = document.getElementById ("appraisal1").value;	
		main.current.appraisal2 = document.getElementById ("appraisal2").value;	
		main.current.appraisal3 = document.getElementById ("appraisal3").value;	
		
		main.getDataFields ();
	},
	
	save : function ()
	{			
		main.get ();
		
		// Verify CatalogNo if it was changed.
		if (main.current.catalogno != main.catalogNo)
		{																			
			if (didius.helpers.isCatalogNoTaken ({auction: didius.auction.load (didius.case.load (main.current.caseid).auctionid), catalogNo: document.getElementById ("catalogno").value}))
			{
				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
				prompts.alert(null, "Der opstod en fejl", "Det angivet katalog nummer er i brug. Systemmet har derfor fundet det laveste ubrugte katalog nummer og angivet dette i stedet.");
				
				document.getElementById ("catalogno").value = didius.helpers.newCatalogNo ({auction: didius.auction.load (didius.case.load (main.current.caseid).auctionid)});
				return;
			}								
		}
				
		didius.item.save (main.current);
								
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
					return false;
				}			
			}
		}
		
		// Unhook events.		
		app.events.onItemDestroy.removeHandler (main.eventHandlers.onItemDestroy);		
		
		app.events.onBidCreate.removeHandler (main.eventHandlers.onBidCreate);
		app.events.onBidSave.removeHandler (main.eventHandlers.onBidSave);
		app.events.onBidDestroy.removeHandler (main.eventHandlers.onBidDestroy);
		
		// Close window.
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
	
	bids :
	{
		bidsTreeHelper : null,
		
		init : function ()
		{
			main.bids.bidsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("bids"), sortColumn: "createtimestamp", sortDirection: "ascending", onDoubleClick: main.bids.edit});
			main.bids.set ();
		},
		
		set : function ()
		{
			var onDone = 	function (items)
							{
								for (idx in items)
								{				
									main.bids.bidsTreeHelper.addRow ({data: items[idx]});
								}
								
								// Enable controls
								document.getElementById ("bids").disabled = false;																
								main.bids.onChange ();
							};

				// Disable controls
				document.getElementById ("bids").disabled = true;					
				document.getElementById ("bidCreate").disabled = true;
				document.getElementById ("bidEdit").disabled = true;
				document.getElementById ("bidDestroy").disabled = true;
						
				didius.bid.list ({item: main.current, async: true, onDone: onDone});				
		},
		
		onChange : function ()
		{
			if (main.bids.bidsTreeHelper.getCurrentIndex () != -1)
			{									
				document.getElementById ("bidCreate").disabled = false;	
				document.getElementById ("bidEdit").disabled = false;
				document.getElementById ("bidDestroy").disabled = false;				
			}
			else
			{								
				document.getElementById ("bidCreate").disabled = false;	
				document.getElementById ("bidEdit").disabled = true;
				document.getElementById ("bidDestroy").disabled = true;				
			}						
		},
		
		create : function ()
		{											
			var onDone =	function (result)
							{
								if (result)
								{																																	
									window.openDialog ("chrome://didius/content/bid/create.xul", SNDK.tools.newGuid (), "chrome", {customer: result, item: main.current});
								}
							};
														
			app.choose.customer ({onDone: onDone});
		},
		
		edit : function ()
		{		
			window.openDialog ("chrome://didius/content/bid/edit.xul", main.bids.bidsTreeHelper.getRow ().id, "chrome", {bidId: main.bids.bidsTreeHelper.getRow ().id});
		},
		
		destroy : function ()
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			var result = prompts.confirm (null, "Slet bud", "Er du sikker på du vil slette dette bud ?");
			
			if (result)
			{
				try
				{
					didius.bid.destroy (main.bids.bidsTreeHelper.getRow ().id);					
				}
				catch (error)
				{
					app.error ({exception: error})
				}								
			}
		}	
	}
}