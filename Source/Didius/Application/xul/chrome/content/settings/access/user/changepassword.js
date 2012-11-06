Components.utils.import("resource://didius/js/app.js");

var main = 
{
	current : {},
	checksum: null,

	init : function ()
	{				
		main.current.userid = window.arguments[0].userId;
																
		main.set ();
	},
			
	change : function ()
	{	
		main.get ();
			
		if (!didius.user.changePassword (main.current.userid, main.current.passwordnew, main.current.passwordold))
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			prompts.alert(null, "Ændring af adgangskode", "Der skete en fejl under ændring af adgangskode, forsøg igen.");
			return;
		}
		
		if (window.arguments[0].onSave != null)
		{
			window.arguments[0].onSave (main.current);
		}
		
		main.close ();
	},
	
	close : function ()
	{
		// Close window.
		window.close ();
	},
				
	set : function ()
	{	
		main.current.passwordold = "";
		main.current.passwordnew = "";
						
		main.onChange ();
	},
				
	get : function ()
	{
		main.current.passwordold = document.getElementById ("passwordold").value;						
		main.current.passwordnew = document.getElementById ("passwordnew").value;
	},	
	
	onChange  : function ()
	{
		main.get ();
	
		if ((main.current.passwordnew != ""))
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
