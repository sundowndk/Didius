Components.utils.import("resource://didius/js/app.js");

var main =
{	
	auction : null,
	customer : null,
	buyernos : {},

	init : function ()
	{
		try
		{
			main.auction = didius.auction.load (window.arguments[0].auctionId);				
			
			sXUL.console.log (main.auction.buyernos)
			
			var test = main.auction.buyernos.split ("|");
			for (idx in test)
			{
				try
				{
					var buyerno = test[idx].split (":")[0];
					var customerid = test[idx].split (":")[1];
			
					main.buyernos[buyerno] = customerid;
				}
				catch (exception)
				{		
				sXUL.console.log (exception)		
				}
			}
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
			document.getElementById ("customerEdit").disabled = false;
			
			document.getElementById ("buyerNo").disabled = false;
			document.getElementById ("addBuyerNo").disabled = false;
		}
		else
		{					
			document.getElementById ("customerEdit").disabled = true;
			
			document.getElementById ("buyerNo").disabled = true;
			document.getElementById ("addBuyerNo").disabled = true;
		}
		
		document.getElementById ("auctionno").value = main.auction.no;
		document.getElementById ("auctiontitle").value = main.auction.title;	
	},
	
	buyerNo :
	{
		add : function ()
		{
			var buyerno = document.getElementById ("buyerNo").value;
			var customerid = main.customer.id;		
		
			for (idx in main.buyernos)
			{							
				if (idx == document.getElementById ("buyerNo").value)
				{
					app.error ({errorCode: "APP00280"});
					return;
				}
				
				if (main.buyernos[idx] == main.customer.id)
				{
					main.buyernos[idx] = "";	
				}
			}
						
			main.buyernos[buyerno] = customerid;						
			
			var test = "";
			for (idx in main.buyernos)
			{
				if (main.buyernos[idx] != "")
				{
					test += idx +":"+ main.buyernos[idx]+"|";
				}
			}
			
			sXUL.console.log (test);
			
			main.auction.buyernos = test;
			
			didius.auction.save (main.auction);
		}
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
				
				document.getElementById ("customerno").value = main.customer.no;
				document.getElementById ("customername").value = main.customer.name;			
				document.getElementById ("customeraddress1").value = main.customer.address1;
				document.getElementById ("customeraddress2").value = main.customer.address2;
				document.getElementById ("customerpostcode").value = main.customer.postcode;
				document.getElementById ("customercity").value = main.customer.city;
				document.getElementById ("customerphone").value = main.customer.phone;
				document.getElementById ("customermobile").value = main.customer.mobile;
				document.getElementById ("customeremail").value = main.customer.email							
				
				document.getElementById ("buyerNo").value = "";
				document.getElementById ("addBuyerNo").value = "";
				
				for (idx in main.buyernos)
				{					
					if (main.buyernos[idx] == main.customer.id)
					{
						document.getElementById ("buyerNo").value = idx;
						document.getElementById ("addBuyerNo").value = main.buyernos[idx];
					}
				}
			}
			else
			{	
				main.onChange ();
			
				document.getElementById ("customerno").value = "";
				document.getElementById ("customername").value = "";			
				document.getElementById ("customeraddress1").value = "";
				document.getElementById ("customeraddress2").value = "";
				document.getElementById ("customerpostcode").value = "";
				document.getElementById ("customercity").value = "";
				document.getElementById ("customerphone").value = "";
				document.getElementById ("customermobile").value = "";
				document.getElementById ("customeremail").value = "";	
				
				document.getElementById ("buyerNo").value = "";
				document.getElementById ("addBuyerNo").value = "";
			}
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