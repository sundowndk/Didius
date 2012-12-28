Components.utils.import("resource://didius/js/app.js");

var main =
{
	checksum : null,
	current : null,

	init : function ()
	{	 	
		try
		{
			main.current = didius.newsletter.load (window.arguments[0].newsletterId);
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}								
	
		main.set ();
		
		
		//documentModified
		
		gSourceContentWindow = document.getElementById("content");	     
       var edit = gSourceContentWindow.getEditor(gSourceContentWindow.contentWindow);
		
		//document.getElementById ("content").attachEvent("keypress", main.onChange (), true);
		
		// Hook events.		
		app.events.onNewsletterDestroy.addHandler (main.eventHandlers.onNewsletterDestroy);				
	},
	
	eventHandlers :
	{			
		onNewsletterDestroy : function (eventData)
		{
			if (main.current.id == eventData.id)
			{
				main.close (true);
			}
		}			
	},
		
	set : function ()
	{
		main.checksum = SNDK.tools.arrayChecksum (main.current);
			
		document.getElementById ("createdate").dateValue = SNDK.tools.timestampToDate (main.current.createtimestamp);		
	
		document.getElementById ("title").value = main.current.title;		
														
		main.onChange ();
	},
	
	get : function ()
	{
		main.current.title = document.getElementById ("title").value;		
		main.current.content = document.getElementById ("content").value;			
	},
	
	save : function ()
	{			
		main.get ();
		
		didius.newsletter.save (main.current);
				
		main.checksum = SNDK.tools.arrayChecksum (main.current);
		main.onChange ();
		
		if (window.arguments[0].onSave != null)
		{
			window.arguments[0].onSave (main.current);
		}
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
					return;
				}			
			}
		}
		
		// Unhook events.
		app.events.onNewsletterDestroy.removeHandler (main.eventHandlers.onNewsletterDestroy);
			
		// Close window.
		window.close ();
	},
	
	onChange : function ()
	{
	sXUL.console.log ("onchange")
		main.get ();
	
		if ((SNDK.tools.arrayChecksum (main.current) != main.checksum))
		{
			document.title = "Nyhedsbrev: "+ main.current.title +" *";
		
			document.getElementById ("save").disabled = false;
			document.getElementById ("close").disabled = false;
		}
		else
		{
			document.title = "Nyhedsbrev: "+ main.current.title;
		
			document.getElementById ("save").disabled = true;
			document.getElementById ("close").disabled = false;
		}							
	}
}