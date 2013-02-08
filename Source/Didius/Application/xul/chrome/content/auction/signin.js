Components.utils.import("resource://didius/js/app.js");

// ----------------------------------------------------------------------------------------------------------
// | MAIN																									|
// ---------------------------------------------------------------------------------------------------------
var main =
{	
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	mode : "",
	auction : null,	
	buyernos : {},	
	customersTreeHelper : null,
	
	customer : null,
	buyerNo : null,

	// ------------------------------------------------------------------------------------------------------
	// | INIT																							|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{
		try
		{
			main.auction = didius.auction.load (window.arguments[0].auctionId);
			
			var buyernos = main.auction.buyernos.split ("|");
			for (var index in buyernos)
			{
				try
				{
					var buyerno = buyernos[index].split (":")[0];
					var customerid = buyernos[index].split (":")[1];
			
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
		
		main.customersTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("tree.customers"), sortColumn: "name", sortDirection: "descending"});			
			
		main.set ();
					
		// Hook events.			
		app.events.onAuctionDestroy.addHandler (eventHandlers.onAuctionDestroy);
				
		app.events.onCustomerSave.addHandler (eventHandlers.onCustomerSave);
		app.events.onCustomerDestroy.addHandler (eventHandlers.onCustomerDestroy);								
	},
	
	
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{
		var onDone = 	function (result)
						{
							for (var index in result)
							{					
								var customer = result[index];
								var data = {};								
								data.id = customer.id;
								data.no = customer.no;
								data.name = customer.name;
								data.address1 = customer.address1;
								data.city = customer.city;
								data.phone = customer.phone;
								data.email = customer.email;
								
								for (var index2 in main.buyernos)
								{							
									data.buyerno = "";
									if (main.buyernos[index2] == customer.id)
									{
										data.buyerno = "#"+ index2;
									} 
								}				
								
								main.customersTreeHelper.addRow ({data: data});								
							}
								
							// Enable controls
							document.getElementById ("tree.customers").disabled = false;							
						};

		didius.customer.list ({async: true, onDone: onDone});		
		
		document.title = "Auktions registering: "+ main.auction.title +" ["+ main.auction.no +"]";
		
		document.getElementById ("textbox.auctionno").value = main.auction.no;
		document.getElementById ("textbox.auctiontitle").value = main.auction.title;	
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SORT																								|	
	// ------------------------------------------------------------------------------------------------------
	sort : function (attributes)
	{			
		main.customersTreeHelper.sort (attributes);		
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | FILTER																								|	
	// ------------------------------------------------------------------------------------------------------
	filter : function ()
	{
		var value = document.getElementById ("textbox.customersearch").value;
		main.customersTreeHelper.filter ({column: "name", columns: "no,buyerno,name,address1,phone,email", value: value, direction: "in"});
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------
	onChange : function ()
	{
		if (main.mode == "EDIT")
		{	
			main.getCustomer ();
																
			document.getElementById ("textbox.customername").readOnly = false;			
			document.getElementById ("textbox.customeraddress1").readOnly = false;
			document.getElementById ("textbox.customeraddress2").readOnly = false;
			document.getElementById ("textbox.customerpostcode").readOnly = false;
			document.getElementById ("textbox.customercity").readOnly = false;
			document.getElementById ("textbox.customerphone").readOnly = false;
			document.getElementById ("textbox.customermobile").readOnly = false;
			document.getElementById ("textbox.customeremail").readOnly = false;	
				
			document.getElementById ("textbox.customersearch").disabled = true;	
			document.getElementById ("tree.customers").disabled = true;	
			document.getElementById ("textbox.buyerno").disabled = true;	
			document.getElementById ("button.buyernoset").disabled = true;
			document.getElementById ("button.invoicecreate").disabled = true;
			
			document.getElementById ("button.customercreate").collapsed = true;
			document.getElementById ("button.customeredit").collapsed = true;
			document.getElementById ("button.customerclose").collapsed = false;						
			document.getElementById ("button.customersave").collapsed = false;						
			
			if ((SNDK.tools.arrayChecksum (main.customer) != main.checksum))
			{
				document.getElementById ("button.customersave").disabled = false;
			}	
			else			
			{
				document.getElementById ("button.customersave").disabled = true;
			}
		}
		else
		{
			document.getElementById ("textbox.customername").readOnly = true;
			document.getElementById ("textbox.customeraddress1").readOnly = true;
			document.getElementById ("textbox.customeraddress2").readOnly = true;
			document.getElementById ("textbox.customerpostcode").readOnly = true;
			document.getElementById ("textbox.customercity").readOnly = true;
			document.getElementById ("textbox.customerphone").readOnly = true;
			document.getElementById ("textbox.customermobile").readOnly = true;
			document.getElementById ("textbox.customeremail").readOnly = true;	
				
			document.getElementById ("textbox.customersearch").disabled = false;	
			document.getElementById ("tree.customers").disabled = false;	
			document.getElementById ("textbox.buyerno").disabled = false;	
			document.getElementById ("button.buyernoset").disabled = false;								
			
			document.getElementById ("button.customercreate").collapsed = false;
			document.getElementById ("button.customeredit").collapsed = false;
			document.getElementById ("button.customerclose").collapsed = true;						
			document.getElementById ("button.customersave").collapsed = true;								
			
			if (main.customersTreeHelper.getCurrentIndex () != -1)
			{	
				if (main.customer)
				{
					if (main.customer.id != main.customersTreeHelper.getRow ().id)
					{
						main.customer = didius.customer.load (main.customersTreeHelper.getRow ().id);												
						main.setCustomer ();
					}
				}										
				else
				{
					main.customer = didius.customer.load (main.customersTreeHelper.getRow ().id);												
					main.setCustomer ();
				}
			}			
			
//			if (main.customer != null)
//			{	
//				document.getElementById ("button.customercreate").disabled = true;								
//				document.getElementById ("button.customercreate").collapsed = true;				
			
//				document.getElementById ("button.customerclose").disabled = false;
//				document.getElementById ("button.customerclose").collapsed = false;
//				document.getElementById ("button.customersave").disabled = false;
//				document.getElementById ("button.customersave").collapsed = false;
//			}
//			else	
//			{					
//				document.getElementById ("button.customercreate").disabled = false;
//				document.getElementById ("button.customercreate").collapsed = false;
//			
//				document.getElementById ("button.customerclose").disabled = true;
//				document.getElementById ("button.customerclose").collapsed = true;
//				document.getElementById ("button.customersave").disabled = true;
//				document.getElementById ("button.customersave").collapsed = true;
//			}
		}	
		
				
//			if ((SNDK.tools.arrayChecksum (main.customer) != main.checksum))
//			{
//				document.getElementById ("customerSave").disabled = false;
//			}	
//			else			
//			{
//				document.getElementById ("customerSave").disabled = true;
//			}
									
			if ((document.getElementById ("textbox.buyerno").value == main.buyerNo) || (document.getElementById ("textbox.buyerno").value == ""))
			{
				document.getElementById ("button.buyernoset").disabled = true;
			}
			else
			{
				document.getElementById ("button.buyernoset").disabled = false;
			}
			
			if (main.buyerNo != "")
			{
				document.getElementById ("button.invoicecreate").disabled = false;
			}
			else
			{
				document.getElementById ("button.invoicecreate").disabled = true;
			}								
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | CLOSE																								|	
	// ------------------------------------------------------------------------------------------------------				
	close : function ()
	{							
		// Unhook events.						
		app.events.onAuctionDestroy.removeHandler (eventHandlers.onAuctionDestroy);
				
		app.events.onCustomerSave.removeHandler (eventHandlers.onCustomerSave);
		app.events.onCustomerDestroy.removeHandler (eventHandlers.onCustomerDestroy);
							
		// Close window.		
		window.close ();
	},
	
	setCustomer : function ()
	{
		main.buyerNo = "";
		
		document.getElementById ("textbox.buyerno").value = "";
		document.getElementById ("button.buyernoset").value = "";
		document.getElementById ("button.invoicecreate").disabled = true;	
	
		document.getElementById ("textbox.customerno").value = main.customer.no;
		document.getElementById ("textbox.customername").value = main.customer.name;			
		document.getElementById ("textbox.customeraddress1").value = main.customer.address1;
		document.getElementById ("textbox.customeraddress2").value = main.customer.address2;
		document.getElementById ("textbox.customerpostcode").value = main.customer.postcode;
		document.getElementById ("textbox.customercity").value = main.customer.city;
		document.getElementById ("textbox.customerphone").value = main.customer.phone;
		document.getElementById ("textbox.customermobile").value = main.customer.mobile;
		document.getElementById ("textbox.customeremail").value = main.customer.email		
		
		for (var index in main.buyernos)
		{					
			if (main.buyernos[index] == main.customer.id)
			{
				main.buyerNo = index;
				document.getElementById ("textbox.buyerno").value = index;					
				document.getElementById ("button.invoicecreate").disabled = false;
			}
		}
	},
	
	getCustomer : function ()
	{
		main.customer.name = document.getElementById ("textbox.customername").value;
		main.customer.address1 = document.getElementById ("textbox.customeraddress1").value;
		main.customer.address2 = document.getElementById ("textbox.customeraddress2").value;
		main.customer.postcode = document.getElementById ("textbox.customerpostcode").value;
		main.customer.city = document.getElementById ("textbox.customercity").value;
		main.customer.phone = document.getElementById ("textbox.customerphone").value;
		main.customer.mobile = document.getElementById ("textbox.customermobile").value;
		main.customer.email = document.getElementById ("textbox.customeremail").value;			
	},
	
	saveCustomer : function ()
	{
		main.getCustomer ();
		didius.customer.save (main.customer);
		main.closeCustomer ();
	},
	
	closeCustomer : function ()
	{
		main.mode = "";
		main.onChange ();
	},
	
	setBuyerNo : function ()
	{
		var buyerno = document.getElementById ("textbox.buyerno").value;
		var customerid = main.customer.id;		
		
		for (var index in main.buyernos)
		{							
			if (index == document.getElementById ("textbox.buyerno").value)
			{
				try
				{
					didius.customer.load (main.buyernos[index]);					
					app.error ({errorCode: "APP00280"});
					return;
				}
				catch (exception)
				{						
				}
			}
				
			if (main.buyernos[index] == main.customer.id)
			{
				main.buyernos[index] = "";	
			}
//				app.error ({errorCode: "APP00280"});
//				return;
		}
						
		main.buyernos[buyerno] = main.customer.id;
			
		var buyernos = "";
		for (var index in main.buyernos)
		{
			if (main.buyernos[index] != "")
			{
				buyernos += index +":"+ main.buyernos[index]+"|";
			}
		}
									
		main.auction.buyernos = buyernos;		
		didius.auction.save (main.auction);
			
		main.buyerNo = buyerno;
		main.onChange ();
			
		var data = {};			
		data.id = main.customer.id;
		data.no = main.customer.no;
		data.name = main.customer.name;
		data.address1 = main.customer.address1;
		data.city = main.customer.city;
		data.phone = main.customer.phone;
		data.email = main.customer.email;
								
		for (var index2 in main.buyernos)
		{							
			if (main.buyernos[index2] == main.customer.id)
			{
				data.buyerno = "#"+ index2;
			} 
		}				
			
		main.customersTreeHelper.setRow ({data: data});
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | CREATE																								|	
	// ------------------------------------------------------------------------------------------------------
	createInvoice : function ()
	{				
		window.openDialog ("chrome://didius/content/invoice/create.xul", "didius.auction.invoice.show."+ SNDK.tools.newGuid (), "modal", {customerId: main.customer.id, auctionId: main.auction.id});
	},
	
	createCustomer : function ()
	{
		main.mode = "EDIT";
			
		main.customer = didius.customer.create ();						
		main.setCustomer ();
		main.checksum = SNDK.tools.arrayChecksum (main.customer);
		main.onChange ();
		document.getElementById ("textbox.customername").focus ();
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

var eventHandlers =
{
	onAuctionDestroy : function (eventData)
	{
		if (main.auction.id == eventData.id)
		{
			main.close (true);
		}
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
							
		for (var index in main.buyernos)
		{							
			data.buyerno = "";
			if (main.buyernos[index] == main.customer.id)
			{
				data.buyerno = "#"+ index;
			} 
		}				
		
		main.customersTreeHelper.setRow ({data: data});
	
		if (main.customer.id == eventData.id)
		{
			main.customer = eventData;
			main.setCustomer ();
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
}