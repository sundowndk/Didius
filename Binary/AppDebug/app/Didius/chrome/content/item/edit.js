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
		// Hook events.		
		app.events.onItemDestroy.addHandler (eventHandlers.onItemDestroy);		
		
		app.events.onBidSave.addHandler (eventHandlers.onBidSave);
		app.events.onBidDestroy.addHandler (eventHandlers.onBidDestroy);
		
		// onInit.
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
						
		setTimeout (onInit, 1);
	},	
			
	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------			
	set : function ()
	{					
		document.getElementById ("description").focus ();
										
		main.checksum = SNDK.tools.arrayChecksum (main.item);
		main.catalogNo = main.item.catalogno;
		
		// Enable UI.
		document.getElementById ("description").disabled = false;
		document.getElementById ("pictureUpload").disabled = false;
		document.getElementById ("vat").disabled = false;		
		document.getElementById ("minimumbid").disabled = false;
		document.getElementById ("appraisal1").disabled = false;
		document.getElementById ("appraisal2").disabled = false;
		document.getElementById ("appraisal3").disabled = false;				
																									
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
			document.title = "Effekt: "+ main.item.title +" ["+ main.item.no +"] *";
		
			document.getElementById ("save").disabled = false;
			document.getElementById ("close").disabled = false;
		}
		else
		{
			document.title = "Effekt: "+ main.item.title +" ["+ main.item.no +"]";
		
			document.getElementById ("save").disabled = true;
			document.getElementById ("close").disabled = false;
		}
		
		if (main.mode == "NEW")
		{
			document.getElementById ("tabdetails").disabled = false;
			document.getElementById ("tabbids").disabled = true;
		}
		else
		{
			document.getElementById ("tabdetails").disabled = false;
			document.getElementById ("tabbids").disabled = false;
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
				document.getElementById ("catalogno").value = didius.helpers.newCatalogNo ({auctionId: main.auction.id});
				return;
			}								
		}
				
		didius.item.save ({item: main.item});
		
		main.mode = "EDIT";
								
		main.checksum = SNDK.tools.arrayChecksum (main.item);
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
		document.getElementById ("no").value = main.item.no;
		document.getElementById ("createdate").dateValue = SNDK.tools.timestampToDate (main.item.createtimestamp);
				
		document.getElementById ("customername").value = main.customer.name;
		
		document.getElementById ("catalogno").value = main.item.catalogno;		
		document.getElementById ("description").value = main.item.description;						
						
		document.getElementById ("minimumbid").value = main.item.minimumbid;
		
		document.getElementById ("appraisal1").value = main.item.appraisal1;
		document.getElementById ("appraisal2").value = main.item.appraisal2;
		document.getElementById ("appraisal3").value = main.item.appraisal3;
		document.getElementById ("vat").checked = main.item.vat;
				
		if (main.item.pictureid != SNDK.tools.emptyGuid)
		{
			document.getElementById ("picture").src = didius.runtime.ajaxUrl +"getmedia/" + main.item.pictureid;
		}
				
		details.setDataFields ();
					
		details.onChange ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | GET																								|	
	// ------------------------------------------------------------------------------------------------------		
	get : function ()
	{			
		main.item.catalogno = document.getElementById ("catalogno").value;				
		main.item.description = document.getElementById ("description").value;	
		
		main.item.minimumbid = document.getElementById ("minimumbid").value;	
		
		main.item.appraisal1 = document.getElementById ("appraisal1").value;	
		main.item.appraisal2 = document.getElementById ("appraisal2").value;	
		main.item.appraisal3 = document.getElementById ("appraisal3").value;	
		main.item.vat = document.getElementById ("vat").checked;
		
		details.getDataFields ();
	},	
	
	// ------------------------------------------------------------------------------------------------------
	// | SETDATAFIELDS																						|	
	// ------------------------------------------------------------------------------------------------------		
	setDataFields : function ()
	{
		var pref = "stelnummer;Stelnummer|aargang;Årgang|regnr;Reg.nr";
		var keys = pref.split ("|");
		
		for (idx in keys)
		{
			var key = keys[idx].split (";")[0];
			var alias = keys[idx].split (";")[1];
		
			var hbox = document.createElement ("hbox");			
			hbox.setAttribute ("align", "center");	
			document.getElementById ("datafields").appendChild (hbox);		
			
			var label = document.createElement ("label");
			label.className = "Label";
			label.setAttribute ("value", alias +":");
			hbox.appendChild (label);
			
			var textbox = document.createElement ("textbox");
			textbox.setAttribute ("id", key);
			textbox.setAttribute ("flex", 1);
			textbox.setAttribute ("onkeyup", "details.onChange ();");				
			
			hbox.appendChild (textbox);
			if (main.item.fields[key] != null)
			{
				textbox.value = main.item.fields[key];
			}
		}						
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | GETDATAFIELDS																						|	
	// ------------------------------------------------------------------------------------------------------		
	getDataFields : function ()
	{
		var pref = "stelnummer;Stelnummer|aargang;Årgang|regnr;Reg.nr";
		var keys = pref.split ("|");
		for (idx in keys)
		{
			var key = keys[idx].split (";")[0];				
			main.item.fields[key] = document.getElementById (key).value;
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
									document.getElementById ("picture").src = didius.runtime.ajaxUrl +"getmedia/" + respons[1];
									
									main.onChange ();
									break;
								}
								
								default:
								{
									app.error ({errorCode: "APP00480"});
									break;
								}							
							}			
							
							document.getElementById ("pictureUpload").collapsed = false;
							document.getElementById ("pictureUploadProgressmeter").collapsed = true;
						}
						
		var onProgress =	function (event)
							{
								document.getElementById ("pictureUploadProgressmeter").value = (event.loaded / event.total) * 100;										
							};
							
		var onError =		function (event)
							{
								app.error ({errorCode: "APP00480"});
							};
				
		var filePicker = app.window.filePicker.open ({window: window, title: "Vælg et billede"});											
		if (filePicker.show () == app.window.filePicker.return.OK)
		{
  			document.getElementById ("pictureUpload").collapsed = true;
  			document.getElementById ("pictureUploadProgressmeter").collapsed = false;  			  			
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
		bids.bidsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("bids"), sortColumn: "createtimestamp", sortDirection: "ascending", onDoubleClick: bids.edit});
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
							document.getElementById ("bids").disabled = false;																
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
			document.getElementById ("bidCreate").disabled = false;	
			document.getElementById ("bidEdit").disabled = false;
			document.getElementById ("bidDestroy").disabled = false;				
		}
		else
		{								
			document.getElementById ("bidCreate").disabled = false;	
			document.getElementById ("bidEdit").disabled = true;
			document.getElementById ("bidDestroy").disabled = true;				
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
								window.openDialog ("chrome://didius/content/bid/create.xul", SNDK.tools.newGuid (), "chrome", {customerId: result.id, itemId: main.item.id});
							}
						};
													
		app.choose.customer ({parentWindow: window, onDone: onDone});
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | EDIT																						|	
	// ------------------------------------------------------------------------------------------------------		
	edit : function ()
	{		
		window.openDialog ("chrome://didius/content/bid/edit.xul", "didius.bid.edit."+ bids.bidsTreeHelper.getRow ().id, "chrome", {bidId: bids.bidsTreeHelper.getRow ().id});
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
			document.getElementById ("customername").value = eventdata.name;	
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
								
		bids.bidsTreeHelper.addRow ({data: data});
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | ONBIDDESTROY																						|	
	// ------------------------------------------------------------------------------------------------------				
	onBidDestroy : function (eventData)
	{
		bids.bidsTreeHelper.removeRow ({id: eventData.id});
	}
}
