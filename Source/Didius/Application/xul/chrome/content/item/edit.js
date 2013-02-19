Components.utils.import("resource://didius/js/app.js");

// ----------------------------------------------------------------------------------------------------------
// | MAIN																									|
// ----------------------------------------------------------------------------------------------------------
var main =
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------		
	mode : null,
	checksum : null,
	item : null,
	case : null,
	customer : null,
	auction : null,
	catalogNo : null,
		
	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------		
	init : function ()
	{						
		var onInit = 	function ()
						{
							try	
							{
								if (!window.arguments[0].itemId)
								{
									main.mode = "NEW";
									main.item = didius.item.create ({caseId: window.arguments[0].caseId});
								}
								else if (window.arguments[0].itemId)
								{
									main.mode = "EDIT";			
									main.item = didius.item.load ({id: window.arguments[0].itemId});
								}
								
								main.case = didius.case.load ({id: main.item.caseid});
								main.auction = didius.auction.load (main.case.auctionid);
								main.customer = didius.customer.load (main.case.customerid);			
							}
							catch (error)
							{
								app.error ({exception: error})
								main.close ();
								return;
							}							
							
							main.set ();											
							
							// Init tabs.
							details.init ();
							bids.init ();
						};
						
		setTimeout (onInit, 0);
		
		// Hook events.		
		app.events.onCustomerSave.addHandler (eventHandlers.onCustomerSave);
		app.events.onItemDestroy.addHandler (eventHandlers.onItemDestroy);				
		app.events.onBidSave.addHandler (eventHandlers.onBidSave);
		app.events.onBidDestroy.addHandler (eventHandlers.onBidDestroy);
	},	
			
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------			
	set : function ()
	{																
		main.checksum = SNDK.tools.arrayChecksum (main.item);
		main.catalogNo = main.item.catalogno;
		
		// Enable UI.
		document.getElementById ("textbox.catalogno").disabled = false;
		document.getElementById ("textbox.description").disabled = false;
		document.getElementById ("textbox.description").focus ();
		document.getElementById ("button.picturechoose").disabled = false;
		document.getElementById ("checkbox.vat").disabled = false;		
		document.getElementById ("textbox.minimumbid").disabled = false;
		document.getElementById ("textbox.appraisal1").disabled = false;
		document.getElementById ("textbox.appraisal2").disabled = false;
		document.getElementById ("textbox.appraisal3").disabled = false;				
																									
		main.onChange ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | GET																								|	
	// ------------------------------------------------------------------------------------------------------		
	get : function ()
	{			
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------		
	onChange : function ()
	{
		main.get ();
			
		if ((SNDK.tools.arrayChecksum (main.item) != main.checksum))
		{
			document.title = "Effekt: "+ main.item.title +" [katalog nr.: "+ main.item.catalogno +"] *";
		
			document.getElementById ("button.save").disabled = false;
			document.getElementById ("button.close").disabled = false;
		}
		else
		{
			document.title = "Effekt: "+ main.item.title +" [katalog nr.: "+ main.item.catalogno +"]";
		
			document.getElementById ("button.save").disabled = true;
			document.getElementById ("button.close").disabled = false;
		}
		
		if (main.mode == "NEW")
		{
			document.getElementById ("tab.details").disabled = false;
			document.getElementById ("tab.bids").disabled = true;
		}
		else
		{
			document.getElementById ("tab.details").disabled = false;
			document.getElementById ("tab.bids").disabled = false;
		}
		
		if (main.customer.vat)
		{
			document.getElementById ("checkbox.vat").disabled = false;			
		}
		else
		{
			document.getElementById ("checkbox.vat").checked = false;
			document.getElementById ("checkbox.vat").disabled = true;
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SAVE																								|	
	// ------------------------------------------------------------------------------------------------------		
	save : function ()
	{			
		main.get ();
		
		// Check if CatalogNo has been changed.
		if (main.item.catalogno != main.catalogNo)
		{																				
			if (didius.helpers.isCatalogNoTaken ({auctionId: main.auction.id, catalogNo: main.item.catalogno}))
			{
				app.window.prompt.alert ("Der opstod en fejl", "Det angivet katalog nummer er i brug. Systemmet har derfor fundet det laveste ubrugte katalog nummer og angivet dette i stedet.");				
				document.getElementById ("textbox.catalogno").value = didius.helpers.newCatalogNo ({auctionId: main.auction.id});
				details.onChange ();				
				return;
			}								
		}
				
		didius.item.save ({item: main.item});
		
		main.mode = "EDIT";
									
		main.checksum = SNDK.tools.arrayChecksum (main.item);
		main.catalogNo = main.item.catalogno;
		main.onChange ();			
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | CLOSE																								|	
	// ------------------------------------------------------------------------------------------------------		
	close : function (force)
	{		
		// If we are forced to close, then dont promt user about potential unsaved data.		
		if (!force)
		{	
			// If checksums do not match, promt user about unsaved data.
			if ((SNDK.tools.arrayChecksum (main.item) != main.checksum))
			{
				if (!app.window.prompt.confirm ("Ændringer ikke gemt", "Der er fortaget ændringer, der ikke er gemt, vil du forsætte ?"))
				{
					return false;
				}			
			}
		}
		
		// Unhook events.		
		app.events.onCustomerSave.removeHandler (eventHandlers.onCustomerSave);
		app.events.onItemDestroy.removeHandler (eventHandlers.onItemDestroy);						
		app.events.onBidSave.removeHandler (eventHandlers.onBidSave);
		app.events.onBidDestroy.removeHandler (eventHandlers.onBidDestroy);
		
		// Close window.
		window.close ();
	}
}

// ----------------------------------------------------------------------------------------------------------
// | DETAILS																								|
// ----------------------------------------------------------------------------------------------------------
var details = 
{
	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------		
	init : function ()
	{
		details.set ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------			
	set : function ()
	{	
		document.getElementById ("textbox.no").value = main.item.no;
		document.getElementById ("datepicker.createdate").dateValue = SNDK.tools.timestampToDate (main.item.createtimestamp);
				
		document.getElementById ("textbox.customername").value = main.customer.name;
		
		document.getElementById ("textbox.catalogno").value = main.item.catalogno;		
		document.getElementById ("textbox.description").value = main.item.description;						
						
		document.getElementById ("textbox.minimumbid").value = main.item.minimumbid;
		
		document.getElementById ("textbox.appraisal1").value = main.item.appraisal1;
		document.getElementById ("textbox.appraisal2").value = main.item.appraisal2;
		document.getElementById ("textbox.appraisal3").value = main.item.appraisal3;
		document.getElementById ("checkbox.vat").checked = main.item.vat;
				
		if (main.item.pictureid != SNDK.tools.emptyGuid)
		{
			document.getElementById ("image.picture").src = didius.runtime.ajaxUrl +"getmedia/" + main.item.pictureid;
		}
				
		details.setDataFields ();
							
		details.onChange ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | GET																								|	
	// ------------------------------------------------------------------------------------------------------		
	get : function ()
	{			
		main.item.catalogno = document.getElementById ("textbox.catalogno").value;				
		main.item.description = document.getElementById ("textbox.description").value;			
		main.item.minimumbid = document.getElementById ("textbox.minimumbid").value;			
		main.item.appraisal1 = document.getElementById ("textbox.appraisal1").value;	
		main.item.appraisal2 = document.getElementById ("textbox.appraisal2").value;	
		main.item.appraisal3 = document.getElementById ("textbox.appraisal3").value;	
		main.item.vat = document.getElementById ("checkbox.vat").checked;
		
		details.getDataFields ();
	},	
	
	// ------------------------------------------------------------------------------------------------------
	// | SETDATAFIELDS																						|	
	// ------------------------------------------------------------------------------------------------------		
	setDataFields : function ()
	{		
		var fields = didius.settings.get ({key: "didius_item_datafields"}).split ("|");
		
		for (var index in fields)
		{
			var type = fields[index].split (";")[0];
			var name = fields[index].split (";")[1];
			var alias = fields[index].split (";")[2];
			var defaultvalue = fields[index].split (";")[3];

			var hbox = document.createElement ("hbox");			
			hbox.setAttribute ("align", "center");	
			document.getElementById ("groupbox.datafields").appendChild (hbox);
			
			var label = document.createElement ("label");
			label.className = "Label";
			label.setAttribute ("value", alias +":");
			hbox.appendChild (label);

			switch (type)
			{
				case "textbox":
				{
					var textbox = document.createElement ("textbox");
					textbox.setAttribute ("id", name);
					textbox.setAttribute ("flex", 1);
					textbox.setAttribute ("onkeyup", "details.onChange ();");							
					hbox.appendChild (textbox);
					
					if (main.item.fields[name] != null)
					{
						textbox.value = main.item.fields[name];
					}	
					else
					{
						textbox.value = defaultvalue;
					}			
					break;
				}
				
				case "textarea":
				{
					var textarea = document.createElement ("textbox");				
					textarea.setAttribute ("id", name);
					textarea.setAttribute ("flex", 1);
					textarea.setAttribute ("onkeyup", "details.onChange ();");							
					textarea.setAttribute ("multiline", true);
					hbox.appendChild (textarea);
					
					if (main.item.fields[name] != null)
					{
						textarea.value = main.item.fields[name];
					}		
					else
					{
						textarea.value = defaultvalue;
					}		
				
					break;
				}
				
				case "checkbox":
				{
					var checkbox = document.createElement ("checkbox");
					checkbox.setAttribute ("id", name);
					checkbox.setAttribute ("flex", 1);
					checkbox.setAttribute ("oncommand", "details.onChange ();");							
					hbox.appendChild (checkbox);
					
					if (main.item.fields[name] != null)
					{
						checkbox.checked = main.item.fields[name];						
					}				
					else
					{
						checkbox.checked = defaultvalue;
					}
				
					break;
				}
				
				case "optionbox":
				{
					var menulist = document.createElement ("menulist");
					menulist.setAttribute ("id", name);
					menulist.setAttribute ("flex", 1);
					menulist.setAttribute ("oncommand", "details.onChange ();");							
					hbox.appendChild (menulist);
					
					var menupopup = document.createElement ("menupopup");
					menulist.appendChild (menupopup);
					
					var options = fields[index].split (";")[4].split (",");
					for (var index2 in options)
					{
						var value = options[index2].split ("_")[0];
						var label = options[index2].split ("_")[1];						
					
						var menuitem = document.createElement ("menuitem");
						menuitem.setAttribute ("label", label);
						menuitem.setAttribute ("value", value);
						menupopup.appendChild (menuitem);										
					}
					
					if (main.item.fields[name] != null)
					{
						menulist.value = main.item.fields[name];
					}
					else
					{
						menulist.value = defaultvalue;
					}
					
					break;
				}
			}
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | GETDATAFIELDS																						|	
	// ------------------------------------------------------------------------------------------------------		
	getDataFields : function ()
	{
		var fields = didius.settings.get ({key: "didius_item_datafields"}).split ("|");
		
		for (var index in fields)
		{
			var type = fields[index].split (";")[0];
			var name = fields[index].split (";")[1];			
			
			switch (type)
			{
				case "textbox":
				{
					main.item.fields[name] = document.getElementById (name).value;
					break;
				}
				
				case "textarea":
				{
					main.item.fields[name] = document.getElementById (name).value;
					break;
				}
				
				case "checkbox":
				{
					main.item.fields[name] = document.getElementById (name).checked;
					break;
				}
				
				case "optionbox":
				{
					main.item.fields[name] = document.getElementById (name).value;
					break;
				}
			}
		}
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SETPICTURE																							|	
	// ------------------------------------------------------------------------------------------------------		
	setPicture : function ()
	{
		var onDone = 	function (respons)
						{
							var respons = respons.replace ("\n","").split (":");
						
							switch (respons[0].toLowerCase ())
							{
								case "success":
								{
									main.item.pictureid = respons[1];
									document.getElementById ("image.picture").src = didius.runtime.ajaxUrl +"getmedia/" + respons[1];
									
									main.onChange ();
									break;
								}
								
								default:
								{
									app.error ({errorCode: "APP00480"});
									break;
								}							
							}			
							
							document.getElementById ("button.picturechoose").collapsed = false;
							document.getElementById ("progressmeter.pictureupload").collapsed = true;
						}
						
		var onProgress =	function (event)
							{
								document.getElementById ("progressmeter.pictureupload").value = (event.loaded / event.total) * 100;										
							};
							
		var onError =		function (event)
							{
								app.error ({errorCode: "APP00480"});
							};
				
		var filePicker = app.window.filePicker.open ({window: window, title: "Vælg et billede"});											
		if (filePicker.show () == app.window.filePicker.return.OK)
		{
  			document.getElementById ("button.picturechoose").collapsed = true;
  			document.getElementById ("progressmeter.pictureupload").collapsed = false;  			  			
			sXUL.tools.fileUpload ({postUrl: didius.runtime.ajaxUrl, fieldName: "image", filePath: filePicker.file, additionalFields: {cmd: "function", "cmd.function": "Didius.Item.ImageUpload"}, onLoad: onDone, onProgress: onProgress, onError: onError})
		}
	},
	
	onChange : function ()
	{
		details.get ();
		main.onChange ();
	}
}

// ----------------------------------------------------------------------------------------------------------
// | BIDS																									|
// ----------------------------------------------------------------------------------------------------------
var bids =
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------		
	bidsTreeHelper : null,
	
	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------		
	init : function ()
	{
		bids.bidsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("tree.bids"), sortColumn: "createtimestamp", sortDirection: "ascending", onDoubleClick: bids.edit});
		bids.set ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------		
	set : function ()
	{
		var onDone = 	function (result)
						{
							bids.bidsTreeHelper.disableRefresh ();										
							for (idx in result)
							{				
								var bid = result[idx];
								var data = {};
								
								data.id = bid.id;
								data.createtimestamp = bid.createtimestamp;
								
								var customer = didius.customer.load (bid.customerid);
								data.customerno = customer.no;
								data.customername = customer.name;
								
								data.amount = bid.amount.toFixed (2) +" kr.";
								
								bids.bidsTreeHelper.addRow ({data: data});
							}
							bids.bidsTreeHelper.enableRefresh ();
							
							// Enable controls
							document.getElementById ("tree.bids").disabled = false;																
							bids.onChange ();
						};
								
			didius.bid.list ({item: main.item, async: true, onDone: onDone});				
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | ONCHANGE																							|	
	// ------------------------------------------------------------------------------------------------------		
	onChange : function ()
	{
		if (bids.bidsTreeHelper.getCurrentIndex () != -1)
		{									
			document.getElementById ("button.bidcreate").disabled = false;	
			document.getElementById ("button.bidedit").disabled = false;
			document.getElementById ("button.biddestroy").disabled = false;				
		}
		else
		{								
			document.getElementById ("button.bidcreate").disabled = false;	
			document.getElementById ("button.bidedit").disabled = true;
			document.getElementById ("button.biddestroy").disabled = true;				
		}						
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | CREATE																								|	
	// ------------------------------------------------------------------------------------------------------		
	create : function ()
	{											
		var onDone =	function (result)
						{
							if (result)
							{		
								app.window.open (window, "chrome://didius/content/bid/create.xul", "didius.bid.create."+ SNDK.tools.newGuid (), "modal", {customerId: result.id, itemId: main.item.id});	
							}
						};
													
		app.choose.customer ({parentWindow: window, onDone: onDone});
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | EDIT																						|	
	// ------------------------------------------------------------------------------------------------------		
	edit : function ()
	{		
		app.window.open (window, "chrome://didius/content/bid/edit.xul", "didius.bid.edit."+ bids.bidsTreeHelper.getRow ().id, "modal", {bidId: bids.bidsTreeHelper.getRow ().id});
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | DESTROY																							|	
	// ------------------------------------------------------------------------------------------------------		
	destroy : function ()
	{
		if (app.window.prompt.confirm ("Slet bud", "Er du sikker på du vil slette dette bud ?"))
		{
			try
			{
				var bid = didius.bid.load ({id: bids.bidsTreeHelper.getRow ().id});								
				var item = didius.item.load ({id: bid.itemid});
			
				if (item.invoiced == true)
				{
					if (app.window.prompt.confirm ("Bud er faktureret", "Før dette bud kan rettes, skal der laves en kreditnota. Vil du gøre dette ?"))
					{				
						var creditnote = didius.creditnote.create ({customer: main.customer, item: item, simulate: false});									
					}
					else
					{
						return;
					}
				}
			
				didius.bid.destroy ({id: bids.bidsTreeHelper.getRow ().id});
			}
			catch (error)
			{
				app.error ({exception: error})
			}								
		}
	}
}

// ----------------------------------------------------------------------------------------------------------
// | EVENTHANDLERS																							|
// ----------------------------------------------------------------------------------------------------------
var eventHandlers =
{
	// ------------------------------------------------------------------------------------------------------
	// | ONCUSTOMERSAVE																						|	
	// ------------------------------------------------------------------------------------------------------		
	onCustomerSave : function (eventData)
	{
		if (main.customer.id == eventData.id)
		{			
			document.getElementById ("textbox.customername").value = eventData.name;	
			main.customer = eventData;
			details.get ();
			main.onChange ();
		}
	},

	// ------------------------------------------------------------------------------------------------------
	// | ONITEMDESTROY																						|	
	// ------------------------------------------------------------------------------------------------------		
	onItemDestroy : function (eventData)
	{
		if (main.item.id == eventData.id)
		{
			main.close (true);
		}
	},		
					
	// ------------------------------------------------------------------------------------------------------
	// | ONBIDSAVE																							|	
	// ------------------------------------------------------------------------------------------------------		
	onBidSave : function (eventData)
	{		
		var data = {};
								
		data.id = eventData.id;
		data.createtimestamp = eventData.createtimestamp;
								
		var customer = didius.customer.load (eventData.customerid);
		data.customerno = customer.no;
		data.customername = customer.name;
								
		data.amount = eventData.amount.toFixed (2) +" kr.";
								
		bids.bidsTreeHelper.setRow ({data: data});
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | ONBIDDESTROY																						|	
	// ------------------------------------------------------------------------------------------------------				
	onBidDestroy : function (eventData)
	{
		bids.bidsTreeHelper.removeRow ({id: eventData.id});
	}
}