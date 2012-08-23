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
	
		// Hook events.		
		app.events.onItemDestroy.addHandler (main.eventHandlers.onItemDestroy);		
	},
	
	eventHandlers : 
	{
		onItemDestroy : function (id)
		{
			if (main.current.id == id)
			{
				main.close (true);
			}
		}		
	},
	
	controls :
	{		
	},
	
	set : function ()
	{
		main.checksum = SNDK.tools.arrayChecksum (main.current);
		main.catalogNo = main.current.catalogno;
	
		document.getElementById ("no").value = main.current.no;
	
		document.getElementById ("catalogno").value = main.current.catalogno;
		document.getElementById ("title").value = main.current.title;
		document.getElementById ("description").value = main.current.description;
		
		document.getElementById ("minimumbid").value = main.current.minimumbid;
		
		document.getElementById ("appraisal1").value = main.current.appraisal1;
		document.getElementById ("appraisal2").value = main.current.appraisal2;
		document.getElementById ("appraisal3").value = main.current.appraisal3;
				
		main.onChange ();
	},
	
	get : function ()
	{			
		main.current.catalogno = document.getElementById ("catalogno").value;		
		main.current.title = document.getElementById ("title").value;
		main.current.description = document.getElementById ("description").value;	
		
		main.current.minimumbid = document.getElementById ("minimumbid").value;	
		
		main.current.appraisal1 = document.getElementById ("appraisal1").value;	
		main.current.appraisal2 = document.getElementById ("appraisal2").value;	
		main.current.appraisal3 = document.getElementById ("appraisal3").value;	
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
	}
}