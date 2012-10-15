Components.utils.import("resource://didius/js/app.js");

var main =
{	
	auction : null,
	customer : null,

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
	
		main.set ();
					
		// Hook events.			
		app.events.onAuctionDestroy.addHandler (main.eventHandlers.onAuctionDestroy);
		
		app.events.onCustomerCreate.addHandler (main.eventHandlers.onCustomerCreate);
		app.events.onCustomerSave.addHandler (main.eventHandlers.onCustomerSave);
		app.events.onCustomerDestroy.addHandler (main.eventHandlers.onCustomerDestroy);								
	},
	
	eventHandlers : 
	{
		onAuctionDestroy : function (eventData)
		{
			if (main.auction.id == eventData.id)
			{
				main.close (true);
			}
		},
						
		onCustomerCreate : function (eventData)
		{					
			main.customers.customersTreeHelper.addRow ({data: eventData});						
		},
		
		onCustomerSave : function (eventData)
		{			
			main.customers.customersTreeHelper.setRow ({data: eventData});
			
			if (main.customer.id == eventData.id)
			{
				main.customer = eventData;
				main.onChange ();
			}
		},
		
		onCustomerDestroy : function (eventData)
		{
			main.customers.customersTreeHelper.removeRow ({id: eventData.id});
			
			if (main.customer.id == eventData.id)
			{
				main.customer = null;;
				main.onChange ();
			}
		}				
	},
		
	set : function ()
	{
		main.customers.init ();
							
		main.onChange ();
	},
	
	get : function ()
	{
		main.current.title = document.getElementById ("title").value;		
		main.current.auctiondate = SNDK.tools.dateToYMD (document.getElementById ("auctiondate").dateValue);
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
	
	close : function ()
	{							
		// Unhook events.						
		app.events.onAuctionDestroy.removeHandler (main.eventHandlers.onAuctionDestroy);
		
		app.events.onCustomerCreate.removeHandler (main.eventHandlers.onCustomerCreate);
		app.events.onCustomerSave.removeHandler (main.eventHandlers.onCustomerSave);
		app.events.onCustomerDestroy.removeHandler (main.eventHandlers.onCustomerDestroy);
							
		// Close window.		
		window.close ();
	},
	
	onChange : function ()
	{
		//main.get ();
	
		if (main.customer != null)
		{
			document.getElementById ("customerno").value = main.customer.no;
			document.getElementById ("customername").value = main.customer.name;			
			document.getElementById ("customeraddress1").value = main.customer.address1;
			document.getElementById ("customeraddress2").value = main.customer.address2;
			document.getElementById ("customerpostcode").value = main.customer.postcode;
			document.getElementById ("customercity").value = main.customer.city;
			document.getElementById ("customerphone").value = main.customer.phone;
			document.getElementById ("customermobile").value = main.customer.mobile;
			document.getElementById ("customeremail").value = main.customer.email			
			
			document.getElementById ("customerEdit").disabled = false;			
		}
		else
		{
			document.getElementById ("customerno").value = "";
			document.getElementById ("customername").value = "";			
			document.getElementById ("customeraddress1").value = "";
			document.getElementById ("customeraddress2").value = "";
			document.getElementById ("customerpostcode").value = "";
			document.getElementById ("customercity").value = "";
			document.getElementById ("customerphone").value = "";
			document.getElementById ("customermobile").value = "";
			document.getElementById ("customeremail").value = "";	
		
			document.getElementById ("customerEdit").disabled = true;
		}
		
		document.getElementById ("auctionno").value = main.auction.no;
		document.getElementById ("auctiontitle").value = main.auction.title;
	
//		if ((SNDK.tools.arrayChecksum (main.current) != main.checksum))
//		{
//			document.title = "Auktion: "+ main.current.title +" ["+ main.current.no +"] *";
		
//			document.getElementById ("save").disabled = false;
//			document.getElementById ("close").disabled = false;
//		}
//		else
//		{
//			document.title = "Auktion: "+ main.current.title +" ["+ main.current.no +"]";
		
//			document.getElementById ("save").disabled = true;
//			document.getElementById ("close").disabled = false;
//		}
	},
	
	customers :
	{
		itemsTreeHelper : null,
		
		init : function ()
		{
			main.customers.customersTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("customers"), sortColumn: "name", sortDirection: "descending"});
			main.customers.set ();		
		},
		
		set : function ()
		{
			var onDone = 	function (items)
							{
								for (idx in items)
								{									
									main.customers.customersTreeHelper.addRow ({data: items[idx]});
								}
								
								// Enable controls
								document.getElementById ("customers").disabled = false;																
								main.customers.onChange ();
							};

			// Disable controls
			document.getElementById ("customers").disabled = true;								
						
			didius.customer.list ({async: true, onDone: onDone});				
		},
		
		onChange : function ()
		{					
			if (main.customers.customersTreeHelper.getCurrentIndex () != -1)
			{										
				main.customer = didius.customer.load (main.customers.customersTreeHelper.getRow ().id);
				
				main.onChange ();
			
//				document.getElementById ("itemEdit").disabled = false;
//				document.getElementById ("itemDestroy").disabled = false;
			}
//			else
//			{				
//				document.getElementById ("itemEdit").disabled = true;
//				document.getElementById ("itemDestroy").disabled = true;
//			}
		},
		
		sort : function (attributes)
		{
			main.customers.custoemrsTreeHelper.sort (attributes);
		},
									
		edit : function ()
		{																
			window.openDialog ("chrome://didius/content/customeredit/customeredit.xul", main.customer.id, "chrome", {customerId: main.customer.id});
		}	
	}
}