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
			},
			
			changeRow : function (case_)
			{
				var tree = document.getElementById('cases');
				
				for (var i = 0; i < tree.view.rowCount; i++) 
				{
					if (tree.view.getCellText (i, tree.columns.getNamedColumn('id')) == case_.id)					
					{					
						tree.view.setCellText (i, tree.columns.getNamedColumn('title'), case_.title);						
						break;
					}
				}
			},
			
			selectedRow : function ()
			{
				var result = new Array ();
				var tree = document.getElementById ('cases');
				
				result.id = tree.view.getCellText (tree.currentIndex, tree.columns.getNamedColumn('id'));
				result.no = tree.view.getCellText (tree.currentIndex, tree.columns.getNamedColumn('no'));
				result.title = tree.view.getCellText (tree.currentIndex, tree.columns.getNamedColumn('title'));				
				
				return result;
			},
		
		removeRow : function (row)
			{
				if (!row)
				{
					var tree = document.getElementById("customers");
 var rangeCount = tree.view.selection.getRangeCount();
 var start = {};
 var end   = {};
 for (var i=0; i<rangeCount; i++)  
 {  
 tree.view.selection.getRangeAt(i, start, end);
 for (var c=end.value; c>=start.value; c--)  
 {
 tree.view.getItemAtIndex(c).parentNode.removeChild(tree.view.getItemAtIndex(c));
 }
 }
  				}
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
	},
	
	cases :
	{
		init : function ()
		{
			main.controls.cases.refresh ();		
		},
									
		edit : function ()
		{		
			var current = main.controls.cases.selectedRow ();
						
			var onSave = function (result)
			{				
				if (result != null)
				{
					main.controls.cases.changeRow (result);					
				}													
			}
							
			window.openDialog ("chrome://didius/content/caseedit/caseedit.xul", current.id, "chrome", {caseId: current.id, onSave: onSave});
		},
		
		destroy : function ()
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			var result = prompts.confirm (null, "Slet sag", "Er du sikker på du vil slette denne saf ?");
			
			if (result)
			{
				try
				{
					didius.case.destroy (main.controls.cases.selectedRow ().id);
					main.controls.cases.removeRow ();
				}
				catch (error)
				{
					app.error ({exception: error})
				}								
			}
		}
	}		
}