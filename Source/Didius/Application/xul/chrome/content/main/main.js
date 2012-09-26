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
			main.controls.customers.addRow (customer);
		},
		
		onCustomerSave : function (customer)
		{
			main.controls.customers.setRow (customer);
		},
		
		onCustomerDestroy : function (eventdata)
		{
			main.controls.customers.removeRow (eventdata);
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
 
			var result = prompts.promptUsernameAndPassword (null, "Login", "Angiv brugernavn og adgangskode\nfor at logge på systemmet.", username, password, null, check);
			
			if (result)
			{
				
			}
			else
			{
				app.shutdown (false);
			}		
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
		},
	
		customers :
		{
			addRow : function (customer)
			{
				var treechildren = document.getElementById ('customersTreeChildren');		
	
				var treeitem = document.createElement('treeitem');	
				treechildren.appendChild (treeitem)

				var treerow = document.createElement('treerow');
				treeitem.appendChild (treerow);

				var columns = [customer["id"], customer["name"], customer["address1"], customer["postcode"], customer["city"], customer["email"]]
										
				for (index in columns)
				{
					var treecell = document.createElement('treecell');
					treecell.setAttribute ('label', columns[index]);
					treerow.appendChild (treecell);
				}
			},
									
			removeRow : function (id)
			{
				var tree = document.getElementById ('customers');
				var index = -1;
				
				if (!id)
				{
					index = tree.currentIndex;									
  				}
  				else
  				{  									
					for (var i = 0; i < tree.view.rowCount; i++) 
					{
						if (tree.view.getCellText (i, tree.columns.getNamedColumn ('id')) == id)
						{					
							index = i;				
							break;
						}
					}
  				}
  				
  				if (index != -1)
  				{
  					tree.view.getItemAtIndex (index).parentNode.removeChild (tree.view.getItemAtIndex (index));
  				}
			},
			
			setRow : function (customer)
			{
				var tree = document.getElementById ('customers');
				var index = -1;
				
				if (!customer)
				{
					index = tree.currentIndex;
				}
				else
				{
					for (var i = 0; i < tree.view.rowCount; i++) 
					{	
						if (tree.view.getCellText (i, tree.columns.getNamedColumn ('id')) == customer.id)
						{					
							index = i;							
							break;
						}
					}
				}

				if (index != -1)
				{
					tree.view.setCellText (index, tree.columns.getNamedColumn ('id'), customer.id);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('name'), customer.name);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('address1'), customer.address1);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('postcode'), customer.postcode);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('city'), customer.city);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('email'), customer.email);	
				}
			},
			
			getRow : function (id)
			{
				var result = new Array ();
				
				var tree = document.getElementById ('customers');
				var index = -1;				
				
				if (!id)
				{
					index = tree.currentIndex;				
				}
				else
				{
					for (var i = 0; i < tree.view.rowCount; i++) 
					{
						if (tree.view.getCellText (i, tree.columns.getNamedColumn ('id')) == id)
						{					
							index = i;
							break;
						}
					}	
				}
				
				if (index != -1)
				{									
					result.id = tree.view.getCellText (index, tree.columns.getNamedColumn ('id'));
					result.name = tree.view.getCellText (index, tree.columns.getNamedColumn ('name'));
					result.address1 = tree.view.getCellText (index, tree.columns.getNamedColumn ('address1'));				
					result.postcode = tree.view.getCellText (index, tree.columns.getNamedColumn ('postcode'));
					result.city = tree.view.getCellText (index, tree.columns.getNamedColumn ('city'));
					result.email = tree.view.getCellText (index, tree.columns.getNamedColumn ('email'));
				}
				
				return result;
			},
		
			refresh : function ()
			{
				var onDone = 	function (customers)
								{
									for (index in customers)
									{									
										main.controls.customers.addRow (customers[index]);
									}
								
								// Enable controls
								document.getElementById ("customers").disabled = false;																
								main.controls.customers.onChange ();
							};

				// Disable controls
				document.getElementById ("customers").disabled = true;	
				document.getElementById ("customerCreate").disabled = true;			
				document.getElementById ("customerEdit").disabled = true;
				document.getElementById ("customerDestroy").disabled = true;
						
				didius.customer.list ({async: true, onDone: onDone});				
			},
			
			onChange : function ()
			{
				var view = document.getElementById ("customers").view;
				var selection = view.selection.currentIndex; 
				
				if (selection != -1)
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
			}		
		},
		
		auctions :
		{
			addRow : function (auction)
			{
				var treechildren = document.getElementById ('auctionsTreeChildren');		
	
				var treeitem = document.createElement('treeitem');	
				treechildren.appendChild (treeitem)

				var treerow = document.createElement('treerow');
				treeitem.appendChild (treerow);

				var columns = [auction["id"], auction["no"], auction["title"]];
										
				for (index in columns)
				{
					var treecell = document.createElement('treecell');
					treecell.setAttribute ('label', columns[index]);
					treerow.appendChild (treecell);
				}
			},
									
			removeRow : function (id)
			{
				var tree = document.getElementById ('auctions');
				var index = -1;
				
				if (!id)
				{
					index = tree.currentIndex;									
  				}
  				else
  				{  									
					for (var i = 0; i < tree.view.rowCount; i++) 
					{
						if (tree.view.getCellText (i, tree.columns.getNamedColumn ('id')) == id)
						{					
							index = i;				
							break;
						}
					}
  				}
  				
  				if (index != -1)
  				{
  					tree.view.getItemAtIndex (index).parentNode.removeChild (tree.view.getItemAtIndex (index));
  				}
			},
			
			setRow : function (auction)
			{
				var tree = document.getElementById ('auctions');
				var index = -1;
				
				if (!auction)
				{
					index = tree.currentIndex;
				}
				else
				{
					for (var i = 0; i < tree.view.rowCount; i++) 
					{	
						if (tree.view.getCellText (i, tree.columns.getNamedColumn ('id')) == auction.id)
						{					
							index = i;							
							break;
						}
					}
				}

				if (index != -1)
				{
					tree.view.setCellText (index, tree.columns.getNamedColumn ('id'), auction.id);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('no'), auction.no);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('title'), auction.title);
				}
			},
			
			getRow : function (id)
			{
				var result = new Array ();
				
				var tree = document.getElementById ('auctions');
				var index = -1;				
				
				if (!id)
				{
					index = tree.currentIndex;				
				}
				else
				{
					for (var i = 0; i < tree.view.rowCount; i++) 
					{
						if (tree.view.getCellText (i, tree.columns.getNamedColumn ('id')) == id)
						{					
							index = i;
							break;
						}
					}	
				}
				
				if (index != -1)
				{									
					result.id = tree.view.getCellText (index, tree.columns.getNamedColumn ('id'));
					result.no = tree.view.getCellText (index, tree.columns.getNamedColumn ('no'));
					result.title = tree.view.getCellText (index, tree.columns.getNamedColumn ('title'));				
				}
				
				return result;
			},
		
			refresh : function ()
			{
				var onDone = 	function (auctions)
								{
									for (index in auctions)
									{									
										main.controls.auctions.addRow (auctions[index]);
									}
								
								// Enable controls
								document.getElementById ("auctions").disabled = false;																
								main.controls.auctions.onChange ();
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
				var view = document.getElementById ("auctions").view;
				var selection = view.selection.currentIndex; 
				
				if (selection != -1)
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
			}		
		}
	},
	
	customers :
	{
		init : function ()
		{
			main.controls.customers.refresh ();		
		},
								
		create : function ()
		{		
			var current = didius.customer.create ();			
			current.name = "Unavngiven kunde";
			didius.customer.save (current);																								
																											
			window.openDialog ("chrome://didius/content/customeredit/customeredit.xul", "customeredit:"+ current.id, "chrome", {customerId: current.id});
		},
		
		edit : function ()
		{		
			var current = main.controls.customers.getRow ();
													
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
					didius.customer.destroy (main.controls.customers.getRow ().id);					
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
		init : function ()
		{
			main.controls.auctions.refresh ();		
		},
								
		create : function ()
		{		
			var current = didius.auction.create ();						
			didius.auction.save (current);																												
																	
			window.openDialog ("chrome://didius/content/auctionedit/auctionedit.xul", current.id, "chrome", {auctionId: current.id});
		},
		
		edit : function ()
		{		
			var current = main.controls.auctions.getRow ();
													
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
					didius.auction.destroy (main.controls.auctions.getRow ().id);					
				}
				catch (error)
				{
					app.error ({exception: error})
				}								
			}
		},
		
		run : function ()
		{
			var current = main.controls.auctions.getRow ();
													
			window.openDialog ("chrome://didius/content/auctionrun/auctionrun.xul", current.id, "chrome", {auctionId: current.id});
		}
	}	
}
