Components.utils.import("resource://didius/js/app.js");

var main = 
{
	current : {},
	checksum: null,

	init : function ()
	{				
		try
		{
			main.current = didius.user.load (window.arguments[0].userId);
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}								
	
		main.set ();
	},
	
	changePassword : function ()
	{
		window.openDialog ("chrome://didius/content/settings/access/user/changepassword.xul", "changepassword", "chrome", {userId: main.current.id});
	},
	
	save : function ()
	{				
		didius.user.save (main.current);
								
		main.checksum = SNDK.tools.arrayChecksum (main.current);
		main.onChange ();
		
		if (window.arguments[0].onSave != null)
		{
			window.arguments[0].onSave (main.current);
		}
	},
	
	close : function ()
	{
		// Close window.
		window.close ();
	},
				
	set : function ()
	{	
		main.checksum = SNDK.tools.arrayChecksum (main.current);
	
		document.getElementById ("realname").value = main.current.realname;
		document.getElementById ("username").value = main.current.username;
		
		document.getElementById ("status").value = main.current.status;
			
		main.onChange ();
	},
				
	get : function ()
	{
		main.current.realname = document.getElementById ("realname").value;				
		
		main.current.status = document.getElementById ("status").value;		
	},	
	
	onChange  : function ()
	{
		main.get ();
	
		if ((SNDK.tools.arrayChecksum (main.current) != main.checksum) && (main.current.realname != ""))
		{					
			document.getElementById ("save").disabled = false;
			document.getElementById ("close").disabled = false;
		}
		else
		{		
			document.getElementById ("save").disabled = true;
			document.getElementById ("close").disabled = false;
		}
	}
}
