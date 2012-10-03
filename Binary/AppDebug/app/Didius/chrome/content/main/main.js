Components.utils.import("resource://didius/js/app.js");

var main = 
{
	init : function ()
	{				
		//main.login.show ();
							
		app.startup (window);
		
		didius.runtime.initialize ();
						
		document.title = "York Auktion ApS [Rasmus Pedersen] ";
				
		main.controls.statusbar.progressmeter.setMode ("undetermined");
		main.controls.statusbar.progressmeter.setDescription ("Arbejder");
				
		main.customers.init ();		
		main.auctions.init ();			
		
		main.controls.statusbar.progressmeter.setMode ("determined");
		main.controls.statusbar.progressmeter.setValue (100);
		main.controls.statusbar.progressmeter.setDescription ("Færdig");
		
		// Hook events.
		app.session.eventListenerId = sXUL.eventListener.attach ();
								
		var tester = 	function ()
						{
							var onDone = function (events)
							{
								for (index in events)
								{
									event = events[index]
							
									dump ("\n"+ event.name +"\n");
									dump (event.data +"\n");
							
									app.events[event.name].execute (event.data);
								}
							}
						
							var events = sXUL.eventListener.update ({id: app.session.eventListenerId, onDone: onDone});
						};
		
		setInterval (tester, 10000);			
						
		app.events.onCustomerCreate.addHandler (main.eventHandlers.onCustomerCreate);
		app.events.onCustomerSave.addHandler (main.eventHandlers.onCustomerSave);
		app.events.onCustomerDestroy.addHandler (main.eventHandlers.onCustomerDestroy);
		
		app.events.onAuctionCreate.addHandler (main.eventHandlers.onAuctionCreate);
		app.events.onAuctionSave.addHandler (main.eventHandlers.onAuctionSave);
		app.events.onAuctionDestroy.addHandler (main.eventHandlers.onAuctionDestroy);						
	},
	
	eventHandlers :
	{
		onCustomerCreate : function (customer)
		{
			main.customers.customersTreeHelper.addRow ({data: customer});
		},
		
		onCustomerSave : function (customer)
		{
			main.customers.customersTreeHelper.setRow ({data: customer});
		},
		
		onCustomerDestroy : function (eventdata)
		{
			main.customers.customersTreeHelper.removeRow (eventdata);
		},
		
		onAuctionCreate : function (auction)
		{
			main.controls.auctions.addRow (auction);
		},
		
		onAuctionSave : function (auction)
		{
			main.controls.auctions.setRow (auction);
		},
		
		onAuctionDestroy : function (id)
		{
			main.controls.auctions.removeRow (id);
		}	
	},
	
	login : 
	{
		show : function ()
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
 
			var username = {value: ""};
			var password = {value: ""}; 
			var check = {value: true};
 
 			var getLogin = function ()	
 			{
 		
			var result = prompts.promptUsernameAndPassword (null, "Login", "Angiv brugernavn og adgangskode\nfor at logge på systemmet.", username, password, null, check);
			
			if (result)
			{
				//alert ("Forkert brugernavn eller adgangskode.");
				getLogin ();
			}
			else
			{
				app.shutdown (false);
			}
			}		
			
			getLogin ();
		}
	
	},
	
	close : function ()
	{
		app.shutdown (false);
	},
		
	controls : 
	{
		statusbar : 
		{
			progressmeter : 
			{
				setMode : function (value)
				{
					var progressmeter = document.getElementById ("statusbarProgressmeter");
					progressmeter.mode = value;
				},
			
				setValue : function (value)
				{
					var progressmeter = document.getElementById ("statusbarProgressmeter");
					progressmeter.value = value;
				},
				
				setDescription : function (value)
				{
					var description = document.getElementById ("statusbarProgressmeterDescription");
					description.value = value;
				}			
			}		
		}		
	},
	
	customers :
	{
		customersTreeHelper : null,
		
		init : function ()
		{		
			main.customers.customersTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("customers"), sort: "name", sortDirection: "descending", onDoubleClick: main.customers.edit});
		
			main.customers.set ();
		},
								
		create : function ()
		{		
			var current = didius.customer.create ();			
			current.name = "Unavngiven kunde";
			didius.customer.save (current);																								
																											
			window.openDialog ("chrome://didius/content/customeredit/customeredit.xul", "customeredit:"+ current.id, "chrome", {customerId: current.id});
		},
		
		set : function ()
		{
				var onDone = 	function (customers)
								{
									for (idx in customers)
									{	
										main.customers.customersTreeHelper.addRow ({data: customers[idx]});
									}
								
								// Enable controls
								document.getElementById ("customers").disabled = false;														
								main.customers.onChange ();
							};

				// Disable controls
				document.getElementById ("customers").disabled = true;	
				document.getElementById ("customerSearch").disabled = true;	
				document.getElementById ("customerCreate").disabled = true;			
				document.getElementById ("customerEdit").disabled = true;
				document.getElementById ("customerDestroy").disabled = true;
						
				didius.customer.list ({async: true, onDone: onDone});				
		},		
										
		onChange : function ()
		{
			if (main.customers.customersTreeHelper.getCurrentIndex () != -1)
			{					
				document.getElementById ("customerCreate").disabled = false;
				document.getElementById ("customerEdit").disabled = false;
				document.getElementById ("customerDestroy").disabled = false;				
			}
			else
			{				
				document.getElementById ("customerCreate").disabled = false;
				document.getElementById ("customerEdit").disabled = true;
				document.getElementById ("customerDestroy").disabled = true;				
			}
			
			document.getElementById ("customerSearch").disabled = false;
		},
				
		sort : function (attributes)
		{
			main.customers.customersTreeHelper.sort (attributes);
		},
		
		filter : function ()
		{
			var value = document.getElementById ("customerSearch").value;
			main.customers.customersTreeHelper.filter ({column: "name", value: value, direction: "in"});
		},
		
		edit : function ()
		{		
			var current = main.customers.customersTreeHelper.getRow ();
													
			window.openDialog ("chrome://didius/content/customeredit/customeredit.xul", "customeredit:"+ current.id, "chrome", {customerId: current.id});
		},
		
		destroy : function ()
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			var result = prompts.confirm (null, "Slet kunde", "Er du sikker på du vil slette denne kunde ?");
			
			if (result)
			{
				try
				{									
					didius.customer.destroy (main.customers.customersTreeHelper.getRow ().id);					
				}
				catch (error)
				{
					app.error ({exception: error})
				}								
			}
		}
	},
	
	auctions :
	{
		auctionsTreeHelper : null,
	
		init : function ()
		{
			main.auctions.auctionsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("auctions"), sort: "title", sortDirection: "descending", onDoubleClick: main.auctions.edit});
			
			this.set ();
		},
					
		set : function ()
		{
			var onDone = 	function (auctions)
							{
								for (index in auctions)
								{									
									main.auctions.auctionsTreeHelper.addRow ({data: auctions[index]});
								}
							
							// Enable controls
							document.getElementById ("auctions").disabled = false;																
							main.auctions.onChange ();
						};

			// Disable controls
			document.getElementById ("auctions").disabled = true;	
			document.getElementById ("auctionCreate").disabled = true;			
			document.getElementById ("auctionEdit").disabled = true;
			document.getElementById ("auctionDestroy").disabled = true;
					
			didius.auction.list ({async: true, onDone: onDone});				
		},	
		
		onChange : function ()
		{
			if (main.auctions.auctionsTreeHelper.getCurrentIndex () != -1)
			{					
				document.getElementById ("auctionCreate").disabled = false;
				document.getElementById ("auctionEdit").disabled = false;
				document.getElementById ("auctionDestroy").disabled = false;
				document.getElementById ("auctionRun").disabled = false;
			}
			else
			{				
				document.getElementById ("auctionCreate").disabled = false;
				document.getElementById ("auctionEdit").disabled = true;
				document.getElementById ("auctionDestroy").disabled = true;
				document.getElementById ("auctionRun").disabled = true;
			}
		},	
		
		sort : function (attributes)
		{
			main.auctions.auctionsTreeHelper.sort (attributes);
		},																					
			
		create : function ()
		{		
			var current = didius.auction.create ();						
			didius.auction.save (current);																												
																	
			window.openDialog ("chrome://didius/content/auctionedit/auctionedit.xul", current.id, "chrome", {auctionId: current.id});
		},
		
		edit : function ()
		{		
			var current = main.auctions.auctionsTreeHelper.getRow ();
													
			window.openDialog ("chrome://didius/content/auctionedit/auctionedit.xul", current.id, "chrome", {auctionId: current.id});
		},
		
		destroy : function ()
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			var result = prompts.confirm (null, "Slet auktion", "Er du sikker på du vil slette denne auktion ?");
			
			if (result)
			{
				try
				{
					didius.auction.destroy (main.auctions.auctionsTreeHelper.getRow ().id);					
				}
				catch (error)
				{
					app.error ({exception: error})
				}								
			}
		},
		
		run : function ()
		{
			var current = main.auctions.auctionsTreeHelper.getRow ();
													
			window.openDialog ("chrome://didius/content/auctionrun/auctionrun.xul", current.id, "chrome", {auctionId: current.id});
		}
	}	
}
