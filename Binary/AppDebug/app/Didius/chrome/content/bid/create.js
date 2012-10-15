Components.utils.import("resource://didius/js/app.js");

var main =
{
	checksum : null,
	current : {},
	customer : null,
	item : null,

	init : function ()
	{	 	
		main.customer = window.arguments[0].customer;
		main.item = window.arguments[0].item;		
	
		main.set ();
		
		// Hook events.						
		app.events.onCustomerSave.addHandler (main.eventHandlers.onCustomerSave);
		app.events.onCustomerDestroy.addHandler (main.eventHandlers.onCustomerDestroy);
		
		app.events.onItemSave.addHandler (main.eventHandlers.onItemSave);
		app.events.onItemDestroy.addHandler (main.eventHandlers.onItemDestroy);			
	},
	
	eventHandlers :
	{
		onCustomerSave : function (eventData)
		{			
			if (main.customer.id == eventData.id)
			{
							
			}
		},
	
		onCustomerDestroy : function (eventData)
		{
			if (main.customer.id == eventData.id)
			{
				main.close (true);
			}
		},
		
		onItemSave : function (eventData)
		{			
			if (main.item.id == eventData.id)
			{
							
			}
		},
		
		onItemDestroy : function (eventData)
		{
			if (main.item.id == eventData.id)
			{
				main.close (true);
			}
		}										
	},
		
	set : function ()
	{
		main.checksum = SNDK.tools.arrayChecksum (main.current);
	
		document.getElementById ("customer").value = main.customer.name;		
		document.getElementById ("item").value = main.item.title;				
	
		document.getElementById ("amount").value = main.current.amount;		
														
		main.onChange ();
	},
	
	get : function ()
	{
		main.current.customer = main.customer;
		main.current.item = main.item;
				
		main.current.amount = document.getElementById ("amount").value;		
	},
	
	create : function ()
	{			
		main.get ();
		
		var bid = didius.bid.create (main.current.customer, main.current.item, main.current.amount);		
		didius.bid.save (bid);
		
		main.close ();
						
		if (window.arguments[0].onSave != null)
		{
			window.arguments[0].onSave (main.current);
		}
	},
	
	close : function ()
	{							
		// Unhook events.
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
	
		if (document.getElementById ("amount") != 0.00)
		{					
			document.getElementById ("create").disabled = false;
			document.getElementById ("close").disabled = false;
		}
		else
		{					
			document.getElementById ("create").disabled = true;
			document.getElementById ("close").disabled = false;
		}
	}	
}