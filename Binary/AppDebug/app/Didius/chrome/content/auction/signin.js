Components.utils.import("resource://didius/js/app.js");

var main =
{	
	auction : null,
	customer : null,
	buyernos : {},
	editCustomer : false,
	customersTreeHelper : null,

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
		
		main.customersTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("customers"), sortColumn: "name", sortDirection: "descending"});			
			
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
			main.customersTreeHelper.addRow ({data: eventData});						
		},
		
		onCustomerSave : function (eventData)
		{	
			var data = {};			
			data.id = eventData.id;
			data.no = eventData.no;
			data.name = eventData.name;
			data.address1 = eventData.address1;
			data.city = eventData.city;
			data.phone = eventData.phone;
			data.email = eventData.email;
								
			for (idx2 in main.buyernos)
			{							
				data.buyerno = "";
				if (main.buyernos[idx2] == main.customer.id)
				{
					data.buyerno = "#"+ idx2;
				} 
			}				
			
			main.customersTreeHelper.setRow ({data: data});
		
			if (main.customer.id == eventData.id)
			{
				main.customer = eventData;
				main.customers.set ();
			}
		},
		
		onCustomerDestroy : function (eventData)
		{
			main.customersTreeHelper.removeRow ({id: eventData.id});
			
			if (main.customer.id == eventData.id)
			{
				main.customer = null;
				main.customers.set ();
			}
		}				
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
								data.name = items[idx].name;
								data.address1 = items[idx].address1;
								data.city = items[idx].city;
								data.phone = items[idx].phone;
								data.email = items[idx].email;
								
								for (idx2 in main.buyernos)
								{							
									data.buyerno = "";
									if (main.buyernos[idx2] == items[idx].id)
									{
										data.buyerno = "#"+ idx2;
									} 
								}				
								
								main.customersTreeHelper.addRow ({data: data});								
							}
								
							// Enable controls
							document.getElementById ("customers").disabled = false;							
						};

		// Disable controls
		document.getElementById ("customers").disabled = true;			
						
		didius.customer.list ({async: true, onDone: onDone});		
		
		document.title = "Auktions registering: "+ main.auction.title +" ["+ main.auction.no +"]";
	},
	
	sort : function (attributes)
	{			
		main.customersTreeHelper.sort (attributes);		
	},
	
	filter : function ()
	{
		var value = document.getElementById ("customerSearch").value;
		main.customersTreeHelper.filter ({column: "name", columns: "no,buyerno,name,address1,phone,email", value: value, direction: "in"});
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
		if (main.editCustomer)
		{								
			document.getElementById ("customername").readOnly = false;
			document.getElementById ("customeraddress1").readOnly = false;
			document.getElementById ("customeraddress2").readOnly = false;
			document.getElementById ("customerpostcode").readOnly = false;
			document.getElementById ("customercity").readOnly = false;
			document.getElementById ("customerphone").readOnly = false;
			document.getElementById ("customermobile").readOnly = false;
			document.getElementById ("customeremail").readOnly = false;	
				
			document.getElementById ("customerSearch").disabled = true;	
			document.getElementById ("customers").disabled = true;	
			document.getElementById ("buyerNo").disabled = true;	
			document.getElementById ("addBuyerNo").disabled = true;
			document.getElementById ("invoiceCreate").disabled = true;
			
			document.getElementById ("customerButtonsBox1").collapsed = true;
			document.getElementById ("customerButtonsBox2").collapsed = false;						
		}
		else
		{
			document.getElementById ("customername").readOnly = true;
			document.getElementById ("customeraddress1").readOnly = true;
			document.getElementById ("customeraddress2").readOnly = true;
			document.getElementById ("customerpostcode").readOnly = true;
			document.getElementById ("customercity").readOnly = true;
			document.getElementById ("customerphone").readOnly = true;
			document.getElementById ("customermobile").readOnly = true;
			document.getElementById ("customeremail").readOnly = true;	
				
			document.getElementById ("customerSearch").disabled = false;	
			document.getElementById ("customers").disabled = false;	
			document.getElementById ("buyerNo").disabled = false;	
			document.getElementById ("addBuyerNo").disabled = false;								
			
			document.getElementById ("customerButtonsBox1").collapsed = false;
			document.getElementById ("customerButtonsBox2").collapsed = true;								
		
			if (main.customersTreeHelper.getCurrentIndex () != -1)
			{										
				main.customer = didius.customer.load (main.customersTreeHelper.getRow ().id);								
			}			
			
			main.customers.set ();
			
			if (main.customer != null)
			{					
				document.getElementById ("customerEdit").disabled = false;
			}
			else	
			{					
				document.getElementById ("customerEdit").disabled = true;
			}
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
					try
					{
						didius.customer.load (main.buyernos[idx]);
						document.getElementById ("buyerNo").value = main.customers.currentBuyerNo;
						main.customers.onChange ();
						app.error ({errorCode: "APP00280"});
						return;
					}
					catch (exception)
					{
						main.buyernos[idx] = "";
					}
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
			
			main.customers.currentBuyerNo = buyerno;
			main.customers.onChange ();
			
			var data = {};			
			data.id = main.customer.id;
			data.no = main.customer.no;
			data.name = main.customer.name;
			data.address1 = main.customer.address1;
			data.city = main.customer.city;
			data.phone = main.customer.phone;
			data.email = main.customer.email;
								
			for (idx2 in main.buyernos)
			{							
				if (main.buyernos[idx2] == main.customer.id)
				{
					data.buyerno = "#"+ idx2;
				} 
			}				
			
			main.customersTreeHelper.setRow ({data: data});
		}
	},
	
	customers :
	{
		checksum : null,
		currentBuyerNo : null,
	
		set : function ()
		{
			main.customers.currentBuyerNo = "";
			document.getElementById ("buyerNo").value = "";
			document.getElementById ("addBuyerNo").value = "";
			document.getElementById ("invoiceCreate").disabled = true;	
		
			if (main.customer != null)
			{
				main.customers.checksum = SNDK.tools.arrayChecksum (main.customer);				
			
				document.getElementById ("customerno").value = main.customer.no;
				document.getElementById ("customername").value = main.customer.name;			
				document.getElementById ("customeraddress1").value = main.customer.address1;
				document.getElementById ("customeraddress2").value = main.customer.address2;
				document.getElementById ("customerpostcode").value = main.customer.postcode;
				document.getElementById ("customercity").value = main.customer.city;
				document.getElementById ("customerphone").value = main.customer.phone;
				document.getElementById ("customermobile").value = main.customer.mobile;
				document.getElementById ("customeremail").value = main.customer.email						
				
				document.getElementById ("buyerNo").disabled = false;
				document.getElementById ("addBuyerNo").disabled = false;
				
				for (idx in main.buyernos)
				{					
					if (main.buyernos[idx] == main.customer.id)
					{
						main.customers.currentBuyerNo = idx;
						document.getElementById ("buyerNo").value = idx;
						document.getElementById ("addBuyerNo").value = main.buyernos[idx];
						
						document.getElementById ("invoiceCreate").disabled = false;
					}
				}
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
				
				document.getElementById ("buyerNo").disabled = true;
				document.getElementById ("addBuyerNo").disabled = true;								
			}
			
			main.customers.onChange ();
		},
		
		get : function ()
		{
			main.customer.name = document.getElementById ("customername").value;
			main.customer.address1 = document.getElementById ("customeraddress1").value;
			main.customer.address2 = document.getElementById ("customeraddress2").value;
			main.customer.postcode = document.getElementById ("customerpostcode").value;
			main.customer.city = document.getElementById ("customercity").value;
			main.customer.phone = document.getElementById ("customerphone").value;
			main.customer.mobile = document.getElementById ("customermobile").value;
			main.customer.email = document.getElementById ("customeremail").value;			
		},
		
		onChange : function ()
		{
			main.customers.get ();
		
			if ((SNDK.tools.arrayChecksum (main.customer) != main.checksum))
			{
				document.getElementById ("customerSave").disabled = false;
			}	
			else			
			{
				document.getElementById ("customerSave").disabled = true;
			}
									
			if ((document.getElementById ("buyerNo").value == main.customers.currentBuyerNo) || (document.getElementById ("buyerNo").value == ""))
			{
				document.getElementById ("addBuyerNo").disabled = true;
			}
			else
			{
				document.getElementById ("addBuyerNo").disabled = false;
			}
			
			if (main.customers.currentBuyerNo != "")
			{
				document.getElementById ("invoiceCreate").disabled = false;
			}
			else
			{
				document.getElementById ("invoiceCreate").disabled = true;
			}
		},	
		
		close : function ()
		{
			main.editCustomer = false;
			main.onChange ();
		},
		
		save : function ()
		{
			main.editCustomer = false;
			main.customers.get ();
			didius.customer.save (main.customer);			
			main.customers.close ();
		},
	
		create : function ()
		{
			main.editCustomer = true;
			
			main.customer = didius.customer.create ();
			main.customer.name = "Unavngiven kunde";
			didius.customer.save (main.customer);
			
			main.customers.set ();								
			main.onChange ();
		},
		
		edit : function ()
		{
			main.editCustomer = true;
			main.onChange ();
		}
	},
	
	customers11 :
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
			
			
//			if (main.customers.customersTreeHelper.getCurrentIndex () != -1)
//			{										
//				main.customer = didius.customer.load (main.customers.customersTreeHelper.getRow ().id);
//				
//				main.onChange ();
//													
//				document.getElementById ("buyerNo").value = "";
//				document.getElementById ("addBuyerNo").value = "";
//					
//				for (idx in main.buyernos)
//				{					
//					if (main.buyernos[idx] == main.customer.id)
//					{
//						document.getElementById ("buyerNo").value = idx;
//						document.getElementById ("addBuyerNo").value = main.buyernos[idx];
//					}
//				}
//			}
//			else
//			{	
//				main.onChange ();
//												
//				document.getElementById ("buyerNo").value = "";
//				document.getElementById ("addBuyerNo").value = "";
//			}
//			
//			if (main.customer != null)
//			{
//				document.getElementById ("customerno").value = main.customer.no;
//				document.getElementById ("customername").value = main.customer.name;			
//				document.getElementById ("customeraddress1").value = main.customer.address1;
//				document.getElementById ("customeraddress2").value = main.customer.address2;
//				document.getElementById ("customerpostcode").value = main.customer.postcode;
//				document.getElementById ("customercity").value = main.customer.city;
//				document.getElementById ("customerphone").value = main.customer.phone;
//				document.getElementById ("customermobile").value = main.customer.mobile;
//				document.getElementById ("customeremail").value = main.customer.email						
//			}
//			else
//			{
//				document.getElementById ("customerno").value = "";
//				document.getElementById ("customername").value = "";			
//				document.getElementById ("customeraddress1").value = "";
//				document.getElementById ("customeraddress2").value = "";
//				document.getElementById ("customerpostcode").value = "";
//				document.getElementById ("customercity").value = "";
//				document.getElementById ("customerphone").value = "";
//				document.getElementById ("customermobile").value = "";
//				document.getElementById ("customeremail").value = "";	
//			}						
		},
		
		sort : function (attributes)
		{			
			main.customers.customersTreeHelper.sort (attributes);		
		},
					
		create : function ()
		{
			main.editCustomer = true;
			
			main.customer = didius.customer.create ();
			main.customer.name = "Unavngiven kunde";
			didius.customer.save (main.customer);
									
			main.onChange ();
		},
																	
		edit : function ()
		{																
			window.openDialog ("chrome://didius/content/customeredit/customeredit.xul", main.customer.id, "chrome", {customerId: main.customer.id});
		}	
	},
	
	invoices :
	{
		create : function ()
		{
			var onApprove = function (eventData)
							{
							
								window.openDialog ("chrome://didius/content/auction/invoice/print.xul", "invoiceprint-"+ eventData.id, "chrome, modal", {invoiceId: eventData.id});

//								alert (eventData.id);
//								main.current.settled = true;
//								main.checksum = SNDK.tools.arrayChecksum (main.current);
//								main.onChange ();
							};
					
			window.openDialog ("chrome://didius/content/auction/invoice/create.xul", "invoicecreate-"+ main.customer.id, "chrome, modal", {customerId: main.customer.id, auctionId: main.auction.id, onApprove: onApprove});
		}
	}
}