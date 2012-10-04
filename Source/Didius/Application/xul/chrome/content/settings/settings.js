Components.utils.import("resource://didius/js/app.js");

var main =
{
	checksum : null,
	currentMenu : "access",	
		 
	init : function ()
	{
		this.access.init ();
		
	},			
			
	close : function (force)
	{				
		// Close window.
		window.close ();
	},
	
	onChange : function ()
	{
	
	},
	
	access :
	{
		usersTreeHelper : null,
		
		init : function ()
		{
			this.usersTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("users"), sort: "realname", sortDirection: "descending", onDoubleClick: main.access.userEdit});
			this.set ();
			
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
			sXUL.console.log ("blablabla")
				main.access.usersTreeHelper.setRow ({data: eventData});
			},
		
			onUserDestroy : function (eventData)
			{				
				main.access.usersTreeHelper.removeRow ({id: eventData.id});
			}		
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
			window.openDialog ("chrome://didius/content/settings/access/user/create.xul", "usercreate", "chrome", null);
		},
		
		userEdit : function ()
		{
			var current = main.access.usersTreeHelper.getRow ();
																		
			window.openDialog ("chrome://didius/content/settings/access/user/edit.xul", current.id, "chrome", {userId: current.id});
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