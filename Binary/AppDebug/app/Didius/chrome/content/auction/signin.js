Components.utils.import("resource://didius/js/app.js");

// ----------------------------------------------------------------------------------------------------------
// | MAIN																									|
// ----------------------------------------------------------------------------------------------------------
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
			main.buyernos = didius.helpers.parseBuyerNos (main.auction.buyernos);
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}				
		
		main.customersTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("tree.customers"), sortColumn: "name", sortDirection: "descending", onEnter: ""});			
			
		main.set ();
					
		// Hook events.			
		app.events.onAuctionSave.addHandler (eventHandlers.onAuctionSave);
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
							main.customersTreeHelper.disableRefresh ();			
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
								
								data.buyerno = "";
								for (var index2 in main.buyernos)
								{							
									if (main.buyernos[index2] == customer.id)
									{
										data.buyerno = "#"+ index2;
										break;
									} 
								}				
								
								main.customersTreeHelper.addRow ({data: data});								
							}
							main.customersTreeHelper.enableRefresh ();			
								
							// Enable controls
							document.getElementById ("tree.customers").disabled = false;							
							
							document.getElementById ("textbox.customersearch").disabled = false;
							document.getElementById ("textbox.customersearch").focus ();
							
							main.onChange ();
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
		if (main.mode == "NEW" || main.mode == "EDIT")
		{	
			customer.get ();
			
			document.getElementById ("textbox.customersearch").disabled = true;	
			document.getElementById ("tree.customers").disabled = true;	
																																										
			document.getElementById ("textbox.customername").readOnly = false;			
			document.getElementById ("textbox.customeraddress1").readOnly = false;
			document.getElementById ("textbox.customeraddress2").readOnly = false;
			document.getElementById ("textbox.customerpostcode").readOnly = false;
			document.getElementById ("textbox.customercity").readOnly = false;
			document.getElementById ("textbox.customercountry").readOnly = false;
			document.getElementById ("textbox.customerphone").readOnly = false;
			document.getElementById ("textbox.customermobile").readOnly = false;
			document.getElementById ("textbox.customeremail").readOnly = false;	
			document.getElementById ("checkbox.customervat").disabled = false;	
			document.getElementById ("textbox.customervatno").readOnly = false;	
							
			document.getElementById ("textbox.buyerno").disabled = true;	
			document.getElementById ("button.buyernoset").disabled = true;
			document.getElementById ("button.invoicecreate").disabled = true;
			
			document.getElementById ("button.customercreate").collapsed = true;
			document.getElementById ("button.customeredit").collapsed = true;
			document.getElementById ("button.customerclose").collapsed = false;						
			document.getElementById ("button.customersave").collapsed = false;				
			
			if (app.data.postcodes[main.customer.postcode] != null)
			{
				main.customer.city = app.data.postcodes[main.customer.postcode];
				document.getElementById ("textbox.customercity").value = main.customer.city;
			}
			else
			{
				main.customer.city = "";
				document.getElementById ("textbox.customercity").value = "";
			}		
			
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
			document.getElementById ("textbox.customersearch").disabled = false;	
			document.getElementById ("tree.customers").disabled = false;	
		
			document.getElementById ("textbox.customername").readOnly = true;
			document.getElementById ("textbox.customeraddress1").readOnly = true;
			document.getElementById ("textbox.customeraddress2").readOnly = true;
			document.getElementById ("textbox.customerpostcode").readOnly = true;
			document.getElementById ("textbox.customercity").readOnly = true;
			document.getElementById ("textbox.customercountry").readOnly = true;
			document.getElementById ("textbox.customerphone").readOnly = true;
			document.getElementById ("textbox.customermobile").readOnly = true;
			document.getElementById ("textbox.customeremail").readOnly = true;	
			document.getElementById ("checkbox.customervat").disabled = true;	
			document.getElementById ("textbox.customervatno").readOnly = true;	

			if (main.customer)
			{							
				document.getElementById ("textbox.buyerno").disabled = false;	
				document.getElementById ("button.buyernoset").disabled = false;
				document.getElementById ("button.customeredit").disabled = false;
				document.getElementById ("button.customeredit").collapsed = false;
				document.getElementById ("button.invoicecreate").disabled = false;
			}
			else
			{
				document.getElementById ("textbox.buyerno").disabled = true;
				document.getElementById ("button.buyernoset").disabled = true;	
				document.getElementById ("button.customeredit").disabled = true;
				document.getElementById ("button.customeredit").collapsed = true;				
				document.getElementById ("button.invoicecreate").disabled = true;
			}
			
			document.getElementById ("button.customercreate").collapsed = false;
			
			document.getElementById ("button.customerclose").collapsed = true;						
			document.getElementById ("button.customersave").collapsed = true;														
		}	
		
		if ((document.getElementById ("textbox.buyerno").value == main.buyerNo) || (document.getElementById ("textbox.buyerno").value == ""))
		{
			document.getElementById ("button.buyernoset").disabled = true;
		}
		else
		{
			document.getElementById ("button.buyernoset").disabled = false;
		}
			
		document.getElementById ("button.customercreate").disabled = false;
		document.getElementById ("button.close").disabled = false;
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | CLOSE																								|	
	// ------------------------------------------------------------------------------------------------------				
	close : function ()
	{							
		// Unhook events.						
		app.events.onAuctionSave.removeHandler (eventHandlers.onAuctionSave);
		app.events.onAuctionDestroy.removeHandler (eventHandlers.onAuctionDestroy);
				
		app.events.onCustomerSave.removeHandler (eventHandlers.onCustomerSave);
		app.events.onCustomerDestroy.removeHandler (eventHandlers.onCustomerDestroy);
							
		// Close window.		
		window.close ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SEARCH																								|	
	// ------------------------------------------------------------------------------------------------------
	search : function ()
	{
		document.getElementById ("textbox.customersearch").focus ();
	},
				
	// ------------------------------------------------------------------------------------------------------
	// | CREATEINVOICE																						|	
	// ------------------------------------------------------------------------------------------------------
	createInvoice : function ()
	{				
		window.openDialog ("chrome://didius/content/invoice/create.xul", "didius.auction.invoice.show."+ SNDK.tools.newGuid (), "modal", {customerId: main.customer.id, auctionId: main.auction.id});
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCUSTOMERSEARCHKEYPRESS																			|	
	// ------------------------------------------------------------------------------------------------------
	onCustomerSearchKeyPress : function (event)
	{	 		
		// DOWN
		if (event.keyCode == 40)
		{
			document.getElementById ("tree.customers").focus ();
			main.customersTreeHelper.select (0);
			return false;
		}

		main.filter ();
	},		
	
	onKeyUpTextboxBuyerNo : function (event)
	{
		sXUL.console.log (event.keyCode);
		
		// ENTER
		if (event.keyCode == 13)
		{	
			main.onChange ();
			document.getElementById ("button.buyernoset").click ();
			return false;
		}
		
		main.onChange ();
	
	}
}


// ----------------------------------------------------------------------------------------------------------
// | CUSTOMER																								|
// ----------------------------------------------------------------------------------------------------------
var customer =
{
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------
	set : function ()
	{
		main.buyerNo = "";
		
		document.getElementById ("textbox.buyerno").value = "";
		document.getElementById ("button.buyernoset").value = "";
		document.getElementById ("button.invoicecreate").disabled = true;	

		document.getElementById ("textbox.customerno").value = "";
		document.getElementById ("textbox.customername").value = "";			
		document.getElementById ("textbox.customeraddress1").value = "";
		document.getElementById ("textbox.customeraddress2").value = "";
		document.getElementById ("textbox.customerpostcode").value = "";
		document.getElementById ("textbox.customercity").value = "";
		document.getElementById ("textbox.customercountry").value = "";
		document.getElementById ("textbox.customerphone").value = "";
		document.getElementById ("textbox.customermobile").value = "";
		document.getElementById ("textbox.customeremail").value = "";			
		document.getElementById ("checkbox.customervat").checked = false;		
		document.getElementById ("textbox.customervatno").value = "";				
	
		if (main.customer)
		{
			document.getElementById ("textbox.customerno").value = main.customer.no;
			document.getElementById ("textbox.customername").value = main.customer.name;			
			document.getElementById ("textbox.customeraddress1").value = main.customer.address1;
			document.getElementById ("textbox.customeraddress2").value = main.customer.address2;
			document.getElementById ("textbox.customerpostcode").value = main.customer.postcode;
			document.getElementById ("textbox.customercity").value = main.customer.city;
			document.getElementById ("textbox.customercountry").value = main.customer.country;
			document.getElementById ("textbox.customerphone").value = main.customer.phone;
			document.getElementById ("textbox.customermobile").value = main.customer.mobile;
			document.getElementById ("textbox.customeremail").value = main.customer.email;	
			document.getElementById ("checkbox.customervat").checked = main.customer.vat;
			document.getElementById ("textbox.customervatno").value = main.customer.vatno;	
		
			for (var index in main.buyernos)
			{					
				if (main.buyernos[index] == main.customer.id)
				{
					main.buyerNo = index;
					document.getElementById ("textbox.buyerno").value = index;										
				}
			}
		}
		
		main.onChange ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | GET																								|	
	// ------------------------------------------------------------------------------------------------------
	get : function ()
	{
		main.customer.name = document.getElementById ("textbox.customername").value;
		main.customer.address1 = document.getElementById ("textbox.customeraddress1").value;
		main.customer.address2 = document.getElementById ("textbox.customeraddress2").value;
		main.customer.postcode = document.getElementById ("textbox.customerpostcode").value;
		main.customer.city = document.getElementById ("textbox.customercity").value;
		main.customer.country = document.getElementById ("textbox.customercountry").value;
		main.customer.phone = document.getElementById ("textbox.customerphone").value;
		main.customer.mobile = document.getElementById ("textbox.customermobile").value;
		main.customer.email = document.getElementById ("textbox.customeremail").value;			
		main.customer.vat = document.getElementById ("checkbox.customervat").checked;			
		main.customer.vatno = document.getElementById ("textbox.customervatno").value;			
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | CREATE																								|	
	// ------------------------------------------------------------------------------------------------------
	create : function ()
	{
		main.mode = "NEW";
			
		main.customer = didius.customer.create ();						
		main.checksum = SNDK.tools.arrayChecksum (main.customer);
		customer.set ();				
		
		document.getElementById ("textbox.customerphone").focus ();
		
		main.onChange ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | EDIT																								|	
	// ------------------------------------------------------------------------------------------------------
	edit : function ()
	{
		main.mode = "EDIT";		
		document.getElementById ("textbox.customerphone").focus ();
		main.checksum = SNDK.tools.arrayChecksum (main.customer);
		main.onChange ();				
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SAVE																								|	
	// ------------------------------------------------------------------------------------------------------
	save : function ()
	{
		customer.get ();
		didius.customer.save (main.customer);
		main.mode = "EDIT";
		customer.close ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | CLOSE																								|	
	// ------------------------------------------------------------------------------------------------------
	close : function ()
	{
		if (main.mode == "NEW")
		{
			main.customer = null;
		}
	
		main.mode = "";
		
		customer.set ();
		main.onChange ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SELECT																								|	
	// ------------------------------------------------------------------------------------------------------	
	select : function ()
	{
		if (main.customersTreeHelper.getCurrentIndex () != -1)
		{	
			if (main.customer)
			{
				if (main.customer.id != main.customersTreeHelper.getRow ().id)
				{
					main.customer = didius.customer.load (main.customersTreeHelper.getRow ().id);
				}
			}										
			else
			{
				main.customer = didius.customer.load (main.customersTreeHelper.getRow ().id);												
			}
		}
		
		customer.set ();
		main.onChange ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SETBUYERNO																							|	
	// ------------------------------------------------------------------------------------------------------
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
					
					document.getElementById ("textbox.buyerno").value = main.buyerNo;
					main.onChange ();
					return;
				}
				catch (exception)
				{		
					app.error ({exception: exception});
				}
			}
				
			if (main.buyernos[index] == main.customer.id)
			{
				main.buyernos[index] = "";	
			}
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
		
		document.getElementById ("textbox.customersearch").focus ();
	}
}


// ----------------------------------------------------------------------------------------------------------
// | EVENTHANDLERS																							|
// ----------------------------------------------------------------------------------------------------------
var eventHandlers =
{
	onAuctionSave : function (eventData)
	{
		if (main.auction.id == eventData.id)
		{
			main.auction = eventData;
			main.buyernos = didius.helpers.parseBuyerNos (main.auction.buyernos);
		}
	},

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
			customer.set ();
		}
	},
	
	onCustomerDestroy : function (eventData)
	{
		main.customersTreeHelper.removeRow ({id: eventData.id});
		
		if (main.customer.id == eventData.id)
		{
			main.customer = null;
			customer.set ();			
		}
	}				
}