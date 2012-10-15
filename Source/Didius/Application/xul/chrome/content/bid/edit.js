Components.utils.import("resource://didius/js/app.js");

var main =
{
	checksum : null,
	current : null,

	init : function ()
	{	 
		try
		{
			main.current = didius.bid.load (window.arguments[0].bidId);
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}				
						
		main.set ();
		
		// Hook events.								
		app.events.onBidDestroy.addHandler (main.eventHandlers.onBidDestroy);
		
		app.events.onCustomerSave.addHandler (main.eventHandlers.onCustomerSave);
		app.events.onCustomerDestroy.addHandler (main.eventHandlers.onCustomerDestroy);					
		
		app.events.onItemDestroy.addHandler (main.eventHandlers.onItemDestroy);
	},
	
	eventHandlers :
	{
		onBidDestroy : function (eventData)
		{
			if (main.current.id == eventData.id)
			{
				main.close (true);
			}
		},									
	
		onCustomerSave : function (eventData)
		{			
			if (main.current.customerid == eventData.id)
			{
							
			}
		},
	
		onCustomerDestroy : function (eventData)
		{
			if (main.current.customerid == eventData.id)
			{
				main.close (true);
			}
		},
		
		onItemSave : function (eventData)
		{			
			if (main.current.itemid == eventData.id)
			{
							
			}
		},
		
		onItemDestroy : function (eventData)
		{
			if (main.current.itemid == eventData.id)
			{
				main.close (true);
			}
		}										
	},
		
	set : function ()
	{
		main.checksum = SNDK.tools.arrayChecksum (main.current);
	
		document.getElementById ("customer").value = main.current.customer.name;
		document.getElementById ("item").value = main.current.item.title;
	
		document.getElementById ("amount").value = main.current.amount;		
														
		main.onChange ();
	},
	
	get : function ()
	{					
		main.current.amount = document.getElementById ("amount").value;
	},
	
	save : function ()
	{			
		main.get ();
				
		didius.bid.save (main.current);
		
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
		app.events.onBidDestroy.removeHandler (main.eventHandlers.onBidDestroy);
		
		app.events.onCustomerSave.removeHandler (main.eventHandlers.onCustomerSave);
		app.events.onCustomerDestroy.removeHandler (main.eventHandlers.onCustomerDestroy);
								
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
			document.getElementById ("save").disabled = false;
			document.getElementById ("close").disabled = false;
		}
		else
		{					
			document.getElementById ("save").disabled = true;
			document.getElementById ("close").disabled = false;
		}
	}	
}