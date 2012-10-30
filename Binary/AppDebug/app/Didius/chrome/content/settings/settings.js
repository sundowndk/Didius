Components.utils.import("resource://didius/js/app.js");

var main =
{
	checksum : null,
	current : {},
	currentPage : null,		
		 
	init : function ()
	{		
		main.set ();		
		
		app.events.onUserCreate.addHandler (this.eventHandlers.onUserCreate);
		app.events.onUserSave.addHandler (this.eventHandlers.onUserSave);
		app.events.onUserDestroy.addHandler (this.eventHandlers.onUserDestroy);
	},			
					
	eventHandlers :
	{
		onUserCreate : function (eventData)
		{
			main.access.usersTreeHelper.addRow ({data: eventData});
		},
	
		onUserSave : function (eventData)
		{			
			main.access.usersTreeHelper.setRow ({data: eventData});
		},
	
		onUserDestroy : function (eventData)
		{				
			main.access.usersTreeHelper.removeRow ({id: eventData.id});
		}		
	},	
				
	set : function ()
	{
		main.current = app.config;
		
		main.checksum = SNDK.tools.arrayChecksum (main.current);
	
		this.access.init ();		
	
		document.getElementById ("settingsMenu").selectedIndex = 0;					
		
		// COMPANY
		document.getElementById ("companyName").value = main.current.companyname;
		document.getElementById ("companyAddress").value = main.current.companyaddress;
		document.getElementById ("companyPostcode").value = main.current.companypostcode;
		document.getElementById ("companyCity").value = main.current.companycity;
		document.getElementById ("companyPhone").value = main.current.companyphone;
		document.getElementById ("companyEmail").value = main.current.companyemail;
		
		// TEXTS
		document.getElementById ("auctionDescription").value = main.current.auctiondescription;
		
		// VALUES
		document.getElementById ("commisionFeePercentage").value = main.current.commisionfeepercentage;
		document.getElementById ("commisionFeeMinimum").value = main.current.commisionfeeminimum;			
		
		// EMAIL
		document.getElementById ("emailSender").value = main.current.emailsender;
		document.getElementById ("emailTextBidWon").value = main.current.emailtextbidwon;
		document.getElementById ("emailTextBidLost").value = main.current.emailtextbidlost;
		document.getElementById ("emailTextInvoice").value = main.current.emailtextinvoice;
		document.getElementById ("emailTextSettlement").value = main.current.emailtextsettlement;
	},
	
	get : function ()
	{
		// COMPANY
		main.current.companyname = document.getElementById ("companyName").value;
		main.current.companyaddress = document.getElementById ("companyAddress").value;
		main.current.companypostcode = document.getElementById ("companyPostcode").value;
		main.current.companycity = document.getElementById ("companyCity").value;
		main.current.companyphone = document.getElementById ("companyPhone").value;
		main.current.companyemail = document.getElementById ("companyEmail").value;
		
		// TEXTS
		main.current.auctiondescription = document.getElementById ("auctionDescription").value;
		
		// VALUES		
		main.current.commisionfeepercentage = document.getElementById ("commisionFeePercentage").value;
		main.current.commisionfeeminimum = document.getElementById ("commisionFeeMinimum").value;			
		
		// EMAIL
		main.current.emailsender = document.getElementById ("emailSender").value;
		main.current.emailtextbidwon = document.getElementById ("emailTextBidWon").value;
		main.current.emailtextbidlost = document.getElementById ("emailTextBidLost").value;
		main.current.emailtextinvoice = document.getElementById ("emailTextInvoice").value;
		main.current.emailtextsettlement = document.getElementById ("emailTextSettlement").value;
	},
	
	onChange : function ()
	{		
		main.get ();
	
		if ((SNDK.tools.arrayChecksum (main.current) != main.checksum))
		{					
			document.getElementById ("close").disabled = false;
			document.getElementById ("save").disabled = false;			
		}
		else
		{				
			document.getElementById ("close").disabled = false;
			document.getElementById ("save").disabled = true;			
		}
							
		if (document.getElementById ("settingsMenu").selectedItem != null)
		{
			var page = document.getElementById ("settingsMenu").selectedItem.value;
			
			if (page != null)
			{
				main.setPage (page);
			}
		}
	},
	
	setPage : function (page)
	{		
		document.getElementById (page).setAttribute ("collapsed", false);
		
		if (main.currentPage != null && main.currentPage != page)
		{
			document.getElementById (main.currentPage).setAttribute ("collapsed", true);		
		}
		
		main.currentPage = page;
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
		app.events.onUserCreate.removeHandler (main.eventHandlers.onUserCreate);				
		app.events.onUserSave.removeHandler (main.eventHandlers.onUserSave);
		app.events.onUserDestroy.removeHandler (main.eventHandlers.onUserDestroy);
							
		// Close window.
		window.close ();
	},
	
	save : function ()
	{
		main.get ();
		
		didius.config.save (main.current);
		
		main.checksum = SNDK.tools.arrayChecksum (main.current);
		
		app.config = main.current;

		
		
		main.onChange ();
	},
	
	access :
	{
		usersTreeHelper : null,
		
		init : function ()
		{
			this.usersTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("users"), sort: "realname", sortDirection: "descending", onDoubleClick: main.access.userEdit});
			this.set ();
		},		
		
		set : function ()
		{
			var onDone = 	function (items)
							{															
								for (idx in items)
								{	
									main.access.usersTreeHelper.addRow ({data: items[idx]});
								}
								
								// Enable controls
								document.getElementById ("users").disabled = false;														
								main.access.onChange ();
							};

			// Disable controls
			document.getElementById ("users").disabled = true;					
			document.getElementById ("userCreate").disabled = true;			
			document.getElementById ("userEdit").disabled = true;
			document.getElementById ("userDestroy").disabled = true;
														
			didius.user.list ({async: true, onDone: onDone});
		},
		
		onChange : function ()
		{
			if (this.usersTreeHelper.getCurrentIndex () != -1)
			{					
				document.getElementById ("userCreate").disabled = false;
				document.getElementById ("userEdit").disabled = false;
				document.getElementById ("userDestroy").disabled = false;				
			}
			else
			{				
				document.getElementById ("userCreate").disabled = false;
				document.getElementById ("userEdit").disabled = true;
				document.getElementById ("userDestroy").disabled = true;				
			}
		},
		
		usersSort : function (attributes)
		{
			this.usersTreeHelper.sort (attributes);
		},
		
		userCreate : function ()
		{																													
			window.openDialog ("chrome://didius/content/settings/access/user/create.xul", "usercreate", "chrome,modal", null);
		},
		
		userEdit : function ()
		{
			var current = main.access.usersTreeHelper.getRow ();
																		
			window.openDialog ("chrome://didius/content/settings/access/user/edit.xul", current.id, "chrome,modal", {userId: current.id});
		},
		
		userDestroy : function ()
		{		
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			var result = prompts.confirm (null, "Slet bruger", "Er du sikker på du vil slette denne bruger ?");
			
			if (result)
			{
				try
				{									
					didius.user.delete (this.usersTreeHelper.getRow ().id);					
				}
				catch (error)
				{
					app.error ({exception: error})
				}								
			}		
		}		
	}
}