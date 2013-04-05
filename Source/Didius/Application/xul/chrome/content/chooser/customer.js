Components.utils.import("resource://didius/js/app.js");

var main = 
{
	customersTreeHelper : null,

	init : function ()
	{				
		main.customersTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("customers"), sortColumn: "name", sortDirection: "descending", onDoubleClick: main.choose});		
		main.set ();
		
		// Hook events.					
		app.events.onCustomerSave.addHandler (main.eventHandlers.onCustomerSave);
		app.events.onCustomerDestroy.addHandler (main.eventHandlers.onCustomerDestroy);
	},
	
	eventHandlers : 
	{				
		onCustomerSave : function (eventData)
		{
			main.customersTreeHelper.setRow ({data: eventData});
		},
		
		onCustomerDestroy : function (eventData)
		{
			main.customersTreeHelper.removeRow ({id: eventData.id});
		}		
	},
	
	set : function ()
	{
		var onDone = 	function (items)
						{
							main.customersTreeHelper.disableRefresh ();
							for (idx in items)
							{									
								main.customersTreeHelper.addRow ({data: items[idx]});
							}
							main.customersTreeHelper.enableRefresh ();
							
							// Enable controls
							document.getElementById ("customers").disabled = false;																								
							document.getElementById ("customerSearch").disabled = false;;
							document.getElementById ("customerSearch").focus ();
							main.onChange ();
						};
		
		didius.customer.list ({async: true, onDone: onDone});					
	},
	
	onChange : function ()
	{
		if (main.customersTreeHelper.getCurrentIndex () != -1)
		{
			document.getElementById ("close").disabled = false;
			document.getElementById ("choose").disabled = false;
		}
		else
		{
			document.getElementById ("close").disabled = false;
			document.getElementById ("choose").disabled = true;
		}
	},
	
	sort : function (attributes)
	{
		main.customersTreeHelper.sort (attributes);
	},
		
	filter : function ()
	{
		var value = document.getElementById ("customerSearch").value;
		main.customersTreeHelper.filter ({column: "name", columns: "no,name,address1,city,phone,email", value: value, direction: "in"});
	},
	
	choose : function ()
	{
		if (window.arguments[0].onDone != null)
		{
			setTimeout (function () {window.arguments[0].onDone (main.customersTreeHelper.getRow ())}, 0);			
		}
		
		setTimeout (main.close, 100);
	},
	
	close : function ()
	{					
		// Unhook events.		
		app.events.onCustomerSave.removeHandler (main.eventHandlers.onCustomerSave);
		app.events.onCustomerDestroy.removeHandler (main.eventHandlers.onCustomerDestroy);			
	
		// Close window.
		window.close ();
	}
}
