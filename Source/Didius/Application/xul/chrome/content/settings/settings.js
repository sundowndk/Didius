Components.utils.import("resource://didius/js/app.js");

var main =
{
	checksum : null,
	currentMenu : "access",	
		 
	init : function ()
	{
	
		
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
			main.access.usersTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("users"), sort: "realname", sortDirection: "descending", onDoubleClick: main.access.edit});
			this.set ();
		},
		
		set : function ()
		{
			var onDone = 	function (items)
							{
								for (idx in items)
								{	
									main.access.usersTreeHelper.addRow ({data: item[idx]});
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
						
				sXUL.user.list ({async: true, onDone: onDone});
		},
		
		onChange : function ()
		{
		
		},
		
		usersSort : function (attributes)
		{
			//main.access.usersTreeHelper.sort (attributes);
		},
		
		userCreate : function ()
		{
		
		},
		
		userEdit : function ()
		{
		
		},
		
		userDestroy : function ()
		{
		
		}		
	}
}