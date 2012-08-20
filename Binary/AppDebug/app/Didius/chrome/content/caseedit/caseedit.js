var main =
{
	checksum : null,
	current : null,

	init : function ()
	{
		try
		{
			main.current = didius.case.load (window.arguments[0].caseId);
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}								
	
		main.set ();
	},
	
	controls :
	{
		cases :
		{
			addRow : function (case_)
			{
				var children = document.getElementById ('casesTreeChildren');		
	
				var item = document.createElement('treeitem');	
				children.appendChild (item)

				var row = document.createElement('treerow');
				item.appendChild (row);

				var columns = [case_["id"], case_["no"], case_["title"]];
									
				for (index in columns)
				{
					var cell = document.createElement('treecell');
					cell.setAttribute ('label', columns[index]);
					row.appendChild(cell);																		
				}
			},
		
			refresh : function ()
			{
				var onDone = 	function (cases)
								{
									for (index in cases)
									{									
										main.controls.cases.addRow (cases[index]);
									}
								
								// Enable controls
								document.getElementById ("cases").disabled = false;								
								
								//main.controls.customers.onChange ();
							};

				// Disable controls
				document.getElementById ("cases").disabled = true;
				//document.getElementById ("customerCreate").disabled = true;
				//document.getElementById ("customerEdit").disabled = true;
				//document.getElementById ("customerDestroy").disabled = true;
			
			
				didius.case.list ({customer: main.current, async: true, onDone: onDone});				
			}
		}
	},
	
	set : function ()
	{
		main.checksum = SNDK.tools.arrayChecksum (main.current);
	
		document.getElementById ("no").value = main.current.no;
	
		document.getElementById ("title").value = main.current.title;		
		
		document.getElementById ("customerreference").value = main.current.customerreference;		
		document.getElementById ("preparationfee").value = main.current.preparationfee;		
		document.getElementById ("commisionfeepercentage").value = main.current.commisionfeepercentage;		
		document.getElementById ("commisionfeeminimum").value = main.current.commisionfeeminimum;		
							
		main.onChange ();
	},
	
	get : function ()
	{
		main.current.title = document.getElementById ("title").value;		
		
		main.current.customerreference = document.getElementById ("customerreference").value;		
		main.current.preparationfee = document.getElementById ("preparationfee").value;		
		main.current.commisionfeepercentage = document.getElementById ("commisionfeepercentage").value;		
		main.current.commisionfeeminimum = document.getElementById ("commisionfeeminimum").value;		
	},
	
	save : function ()
	{			
		main.get ();
		
		didius.case.save (main.current);
				
		main.checksum = SNDK.tools.arrayChecksum (main.current);
		main.onChange ();
		
		if (window.arguments[0].onSave != null)
		{
			window.arguments[0].onSave (main.current);
		}
	},
	
	close : function ()
	{			
		if ((SNDK.tools.arrayChecksum (main.current) != main.checksum))
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			
			if (!prompts.confirm (null, "Ændringer ikke gemt", "Der er fortaget ændringer, der ikke er gemt, vil du forstætte ?"))
			{
				return;
			}			
		}
	
		window.close ();
	},
	
	onChange : function ()
	{
		main.get ();
	
		if ((SNDK.tools.arrayChecksum (main.current) != main.checksum) && (main.current.name != ""))
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