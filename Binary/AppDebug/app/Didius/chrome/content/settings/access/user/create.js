Components.utils.import("resource://didius/js/app.js");

var main = 
{
	current : {},

	init : function ()
	{				
		main.set ();
	},
	
	create : function ()
	{
		var current = didius.user.create (main.current.username, "test");
		current.realname = main.current.realname;
		current.password = main.current.password;
		
		didius.user.save (current);
		
		this.close ();
	},
	
	close : function ()
	{
		// Close window.
		window.close ();
	},
				
	set : function ()
	{	
		main.current.realname = "";
		main.current.username = "";
		main.current.password = "";
		
		main.onChange ();
	},
				
	get : function ()
	{
		main.current.realname = document.getElementById ("realname").value;		
		main.current.username = document.getElementById ("username").value;
		main.current.password = document.getElementById ("password").value;										
	},	
	
	onChange  : function ()
	{
		main.get ();
	
		if ((main.current.realname != "") && (main.current.username != "") && (main.current.password != ""))
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
