Components.utils.import("resource://didius/js/app.js");

var main =
{
	checksum : null,
	current : null,

	init : function ()
	{
		try
		{
			main.current = didius.customer.load (window.arguments[0].customerId);
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}								
	
		main.set ();
		
		// Hook events.
		app.events.onCustomerDestroy.addHandler (main.eventHandlers.onCustomerDestroy);
		
		app.events.onCaseCreate.addHandler (main.eventHandlers.onCaseCreate);
		app.events.onCaseSave.addHandler (main.eventHandlers.onCaseSave);
		app.events.onCaseDestroy.addHandler (main.eventHandlers.onCaseDestroy);
	},
	
	eventHandlers :
	{
		onCustomerDestroy : function (id)
		{
			if (main.current.id == id)
			{
				main.close (true);
			}
		},
	
		onCaseCreate : function (case_)
		{
			if (main.current.id == case_.customerid)
			{
				main.controls.cases.addRow (case_);
			}
		},
		
		onCaseSave : function (case_)
		{
			if (main.current.id == case_.customerid)
			{
				main.controls.cases.setRow (case_);
			}
		},
		
		onCaseDestroy : function (id)
		{
			main.controls.cases.removeRow (id);
		}		
	},
	
	controls :
	{
		cases :
		{
			addRow : function (case_)
			{
				var treechildren = document.getElementById ('casesTreeChildren');		
	
				var treeitem = document.createElement('treeitem');	
				treechildren.appendChild (treeitem)

				var treerow = document.createElement('treerow');
				treeitem.appendChild (treerow);

				var columns = [case_["id"], case_["no"], case_["title"]];
										
				for (index in columns)
				{
					var treecell = document.createElement('treecell');
					treecell.setAttribute ('label', columns[index]);
					treerow.appendChild (treecell);
				}
			},
									
			removeRow : function (id)
			{
				var tree = document.getElementById ('cases');
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
			
			setRow : function (case_)
			{
				var tree = document.getElementById ('cases');
				var index = -1;
				
				if (!case_)
				{
					index = tree.currentIndex;
				}
				else
				{
					for (var i = 0; i < tree.view.rowCount; i++) 
					{	
						if (tree.view.getCellText (i, tree.columns.getNamedColumn ('id')) == case_.id)
						{					
							index = i;							
							break;
						}
					}
				}

				if (index != -1)
				{
					tree.view.setCellText (index, tree.columns.getNamedColumn ('id'), case_.id);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('no'), case_.no);
					tree.view.setCellText (index, tree.columns.getNamedColumn ('title'), case_.title);					
				}
			},
			
			getRow : function (id)
			{
				var result = new Array ();
				
				var tree = document.getElementById ('cases');
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
				var onDone = 	function (cases)
								{
									for (index in cases)
									{									
										main.controls.cases.addRow (cases[index]);
									}
								
								// Enable controls
								document.getElementById ("cases").disabled = false;																
								main.controls.cases.onChange ();
							};

				// Disable controls
				document.getElementById ("cases").disabled = true;					
				document.getElementById ("caseEdit").disabled = true;
				document.getElementById ("caseDestroy").disabled = true;
						
				didius.case.list ({async: true, onDone: onDone});				
			},
			
			onChange : function ()
			{
				var view = document.getElementById ("cases").view;
				var selection = view.selection.currentIndex; 
				
				if (selection != -1)
				{										
					document.getElementById ("caseEdit").disabled = false;
					document.getElementById ("caseDestroy").disabled = false;
				}
				else
				{									
					document.getElementById ("caseEdit").disabled = true;
					document.getElementById ("caseDestroy").disabled = true;
				}
			}		
		}		
	},
	
	set : function ()
	{
		main.checksum = SNDK.tools.arrayChecksum (main.current);
	
		document.getElementById ("no").value = main.current.no;
	
		document.getElementById ("name").value = main.current.name;
		document.getElementById ("address1").value = main.current.address1;
		document.getElementById ("address2").value = main.current.address2;
		document.getElementById ("postcode").value = main.current.postcode;
		document.getElementById ("city").value = main.current.city;
		document.getElementById ("country").value = main.current.country;
		
		document.getElementById ("att").value = main.current.att;
		document.getElementById ("phone").value = main.current.phone;
		document.getElementById ("mobile").value = main.current.mobile;
		document.getElementById ("email").value = main.current.email;		
		
		document.getElementById ("vat").checked = main.current.vat;
		document.getElementById ("vatno").value = main.current.vatno;
		
		document.getElementById ("bankname").value = main.current.bankname;
		document.getElementById ("bankregistrationno").value = main.current.bankregistrationno;
		document.getElementById ("bankaccountno").value = main.current.bankaccountno;
		
		document.getElementById ("notes").value = main.current.notes;
		
		main.cases.init ();
				
		main.onChange ();
	},
	
	get : function ()
	{
		main.current.name = document.getElementById ("name").value;
		main.current.address1 = document.getElementById ("address1").value;
		main.current.address2 = document.getElementById ("address2").value;
		main.current.postcode = document.getElementById ("postcode").value;
		main.current.city = document.getElementById ("city").value;
		main.current.country = document.getElementById ("country").value;						
		
		main.current.att = document.getElementById ("att").value;
		main.current.phone = document.getElementById ("phone").value;
		main.current.mobile = document.getElementById ("mobile").value;
		main.current.email = document.getElementById ("email").value;
		
		main.current.vat = document.getElementById ("vat").checked;
		main.current.vatno = document.getElementById ("vatno").value;
		
		main.current.bankname = document.getElementById ("bankname").value;
		main.current.bankregistrationno = document.getElementById ("bankregistrationno").value;
		main.current.bankaccountno = document.getElementById ("bankaccountno").value;				
		
		main.current.notes = document.getElementById ("notes").value;				
	},
	
	save : function ()
	{			
		main.get ();
		
		didius.customer.save (main.current);
				
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
		app.events.onCustomerDestroy.removeHandler (main.eventHandlers.onCustomerDestroy);		
		
		app.events.onCaseCreate.removeHandler (main.eventHandlers.onCaseCreate);
		app.events.onCaseSave.removeHandler (main.eventHandlers.onCaseSave);
		app.events.onCaseDestroy.removeHandler (main.eventHandlers.onCaseDestroy);
	
		// Close window.
		window.close ();
	},
	
	onChange : function ()
	{
		main.get ();
	
		if ((SNDK.tools.arrayChecksum (main.current) != main.checksum) && (main.current.name != ""))
		{
			document.title = "Kunde: "+ main.current.name +" ["+ main.current.no +"] *";
		
			document.getElementById ("save").disabled = false;
			document.getElementById ("close").disabled = false;
		}
		else
		{
			document.title = "Kunde: "+ main.current.name +" ["+ main.current.no +"]";
		
			document.getElementById ("save").disabled = true;
			document.getElementById ("close").disabled = false;
		}
	},
	
	cases :
	{
		init : function ()
		{
			main.controls.cases.refresh ();		
		},
									
		edit : function ()
		{		
			var current = main.controls.cases.getRow ();
															
			window.openDialog ("chrome://didius/content/caseedit/caseedit.xul", current.id, "chrome", {caseId: current.id});
		},
		
		destroy : function ()
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			var result = prompts.confirm (null, "Slet sag", "Er du sikker på du vil slette denne saf ?");
			
			if (result)
			{
				try
				{
					didius.case.destroy (main.controls.cases.getRow ().id);					
				}
				catch (error)
				{
					app.error ({exception: error})
				}								
			}
		}
	}		
}