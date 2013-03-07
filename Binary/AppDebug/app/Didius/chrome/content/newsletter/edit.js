Components.utils.import("resource://didius/js/app.js");

var main =
{
	checksum : null,
	newsletter : null,
	editor : null,
	mode: null,

	init : function ()
	{	 	
		try
		{	
			if (!window.arguments[0].newsletterId)
			{
				main.mode = "NEW";
				main.newsletter = didius.newsletter.create ();
				main.newsletter.content = sXUL.tools.fileToString ("chrome://didius/content/templates/newsletter.tpl");
			}
			else if (window.arguments[0].newsletterId)
			{
				main.mode = "EDIT";			
				main.newsletter = didius.newsletter.load (window.arguments[0].newsletterId);
			}																						
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}								
	
	
	
		main.set ();
		
		
		//documentModified
		
//		gSourceContentWindow = document.getElementById("content");	     
  //     var edit = gSourceContentWindow.getEditor(gSourceContentWindow.contentWindow);
		
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
		main.checksum = SNDK.tools.arrayChecksum (main.newsletter);
			
		document.getElementById ("createdate").dateValue = SNDK.tools.timestampToDate (main.newsletter.createtimestamp);		
	
		document.getElementById ("title").value = main.newsletter.title;		
		
		//XUL.tools.fileToString ("chrome://didius/content/templates/newsletter.tpl")
		
		
		
		//main.editor.content = sXUL.tools.fileToString ("chrome://didius/content/templates/newsletter.tpl");
		
		//document.getElementById ("editor").innerHTML = "fasdfsdfasdfasd";
		
		main.editor = new simpleEditor ({contentContainer: document.getElementById ("editor").contentDocument.documentElement, document: document.getElementById ("editor").contentDocument});
		
		
		
		//main.editor.content = sXUL.tools.fileToString ("chrome://didius/content/templates/newsletter.tpl");
		main.editor.content = main.newsletter.content;
		main.editor.onChange = main.onChange;
		
		
		//sXUL.console.log ("test:"+ document.getElementById ("editor").contentDocument.documentElement.innerHTML);
														
		main.onChange ();
	},
	
	get : function ()
	{
		main.newsletter.title = document.getElementById ("title").value;
		main.newsletter.content = main.editor.content;
	},
	
	save : function ()
	{			
		main.get ();
		
		didius.newsletter.save (main.newsletter);
				
		main.checksum = SNDK.tools.arrayChecksum (main.newsletter);
		main.onChange ();
		
//		if (window.arguments[0].onSave != null)
//		{
//			window.arguments[0].onSave (main.current);
//		}
	},
	
	send : function ()
	{			
		var progresswindow = app.window.open (window, "chrome://didius/content/invoice/progress.xul", "newsletter.send.progress."+ main.newsletter.id, "", {});	
										
		var workload = function ()
		{
			progresswindow.removeEventListener ("load", workload, false)
		
			var overallprogress = 0;
			var totalprogress = 1;
					
			var start =	function ()	
						{						
							worker1 ();
						};
								
			// Email invoice.
			var worker1 =	function ()
							{
								// Reset progressmeter #1.
								progresswindow.document.getElementById ("description1").textContent = "Sender e-mail ...";
								progresswindow.document.getElementById ("progressmeter1").mode = "undetermined"
								progresswindow.document.getElementById ("progressmeter1").value = 0;
																						
								var nextWorker =	function ()
													{
														// Update progressmeter #1
														overallprogress++;
														progresswindow.document.getElementById ("progressmeter1").mode = "determined"
														progresswindow.document.getElementById ("progressmeter1").value = (overallprogress / totalprogress) * 100;
																																				
														setTimeout (finish, 100);
													};
																							
								var onDone = 	function ()
												{
													nextWorker ();
												};
												
								didius.newsletter.send ({id: main.newsletter.id, onDone: onDone});												
							};
																
			var finish =	function ()	
							{															
								progresswindow.close ();
							};
			
			// Start worker1;				
			setTimeout (start, 100);
		}
		
		progresswindow.addEventListener ("load", workload);				
		
	},
	
	close : function (force)
	{			
		// If we are forced to close, then dont promt user about potential unsaved data.	
		if (!force)
		{
			// If checksums do not match, promt user about unsaved data.
			if ((SNDK.tools.arrayChecksum (main.newsletter) != main.checksum))
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
		main.get ();
	
		if ((SNDK.tools.arrayChecksum (main.newsletter) != main.checksum) && (main.newsletter.title != "")) 
		{
			document.title = "Nyhedsbrev: "+ main.newsletter.title +" *";
		
			document.getElementById ("save").disabled = false;
			document.getElementById ("close").disabled = false;
		}
		else
		{
			document.title = "Nyhedsbrev: "+ main.newsletter.title;
		
			document.getElementById ("save").disabled = true;
			document.getElementById ("close").disabled = false;
		}							
	}
}