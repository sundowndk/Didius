Components.utils.import("resource://didius/js/app.js");

var main = 
{
	init : function ()
	{		
		var splash =	function ()
						{
							main.splash ();				
						};
		
		didius.runtime.initialize ();																									
		app.startup (window);								
																									
		// Hook events.
		sXUL.eventListener.attach ();
								
		app.events.onCustomerSave.addHandler (main.eventHandlers.onCustomerSave);
		app.events.onCustomerDestroy.addHandler (main.eventHandlers.onCustomerDestroy);
		
		app.events.onAuctionSave.addHandler (main.eventHandlers.onAuctionSave);
		app.events.onAuctionDestroy.addHandler (main.eventHandlers.onAuctionDestroy);						
		
		app.events.onInvoiceCreate.addHandler (main.eventHandlers.onInvoiceCreate);
		app.events.onCreditnoteCreate.addHandler (main.eventHandlers.onCreditnoteCreate);
		
		app.events.onNewsletterSave.addHandler (main.eventHandlers.onNewsletterSave);
		app.events.onNewsletterDestroy.addHandler (main.eventHandlers.onNewsletterDestroy);								
		
		main.createTempFolder ();	
																
		document.title = "Didius v"+ app.session.appInfo.version +" - "+ didius.settings.get ({key: "didius_company_name"});
		var environment = Components.classes["@mozilla.org/process/environment;1"].getService(Components.interfaces.nsIEnvironment);
				
		setTimeout (splash, 200);
		
		return;
	
		
		
		//main.login.show ();													
												
		//var appInfo = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo);												
												
		
				
//		main.controls.statusbar.progressmeter.setMode ("undetermined");
//		main.controls.statusbar.progressmeter.setDescription ("Arbejder");
		
//		var initCustomerCache	=	function (attributes)
//									{
//										var onDone =	function (customers)
//														{							
//															for (var index in customers)											
//															{
//																app.data.customers[customers[index].id] = customers[index];								
//															}
//																
//															if (attributes.onDone != null)
//															{
//																setTimeout (attributes.onDone, 0);
//															}																														
//														};
//		
//										didius.customer.list ({async: true, onDone: onDone});
//									};						
//		
//																							
//		initCustomerCache ({onDone: function () 
//									{
//										main.customers.init ();							 
//										main.books.init ();																	
//									}});
		
//		main.auctions.init ();			
//		main.newsletters.init ();
				
		
				
		//sXUL.console.log (app.window.filePicker.result.OK)
				
	//	main.settings ();		
//		float test = 10.10;
		
//		sXUL.console.log (typeof(test))
		
		

//		var path = environment.get("TEMP");

		
//		sXUL.console.log ("BLA:"+ main.getLocalDirectory ());
		
	//	setTimeout('window.fullScreen = true;',1);
		
		//	main.settings ();	
					
		//sXUL.console.log (main.padLeft ("1", 5, "0"));
//		sXUL.console.log (main.padRight ("1", 5, "0"));
					
//		main.controls.statusbar.progressmeter.setMode ("determined");
//		main.controls.statusbar.progressmeter.setValue (100);
//		main.controls.statusbar.progressmeter.setDescription ("Færdig");
		
		
		

		
		
		//didius.common.print.salesAgreement ({case: c});	
		
		//didius.common.print.label ();
		
		
	},
		
	splash : function ()
	{	
		var progresswindow = app.window.open (window, "chrome://didius/content/splash/splash.xul", "didius.main.splash", "", {});	
						
		var workload =	function ()
						{
							progresswindow.removeEventListener ("load", workload, false)
							
							var totalprogress = 3;
							var currentprogress = 0;
											
							var start =	function ()	
										{		
											worker1 ();
										};
								
							
							var worker1 =	function ()
											{
												// Reset progressmeter #1.
												progresswindow.document.getElementById ("description1").textContent = "Henter kundedata ...";
												progresswindow.document.getElementById ("progressmeter1").mode = "undetermined"
												progresswindow.document.getElementById ("progressmeter1").value = 0;
																						
												var nextWorker =	function ()
																	{
																		// Update progressmeter #1
																		currentprogress++;
																		progresswindow.document.getElementById ("progressmeter1").mode = "determined";
																		progresswindow.document.getElementById ("progressmeter1").value = (currentprogress / totalprogress) * 100;
																																			
																		setTimeout (worker2, 100);
																	};
																							
												var onDone = 		function (customers)
																	{
																		for (var index in customers)											
																		{
																			app.data.customers[customers[index].id] = customers[index];
																		}																	
																	
																		nextWorker ();
																	};
																	
												didius.customer.list ({async: true, onDone: onDone});													
											};
											
							var worker2 =	function ()
											{
												// Reset progressmeter #1.
												progresswindow.document.getElementById ("description1").textContent = "Henter postnummer ...";												
																						
												var nextWorker =	function ()
																	{
																		// Update progressmeter #1
																		currentprogress++;
																		progresswindow.document.getElementById ("progressmeter1").mode = "determined";
																		progresswindow.document.getElementById ("progressmeter1").value = (currentprogress / totalprogress) * 100;
																																			
																		setTimeout (worker3, 100);
																	};
																							
												var onDone = 		function ()
																	{																		
																		nextWorker ();
																	};
																																
												var postcodes = sXUL.tools.fileToString ("chrome://didius/content/data/postcodes.dat").split ("\n");		
												for (var index in postcodes)
												{
													var postcode = postcodes[index].split (";")[0]; 
													var cityname = postcodes[index].split (";")[1];
				
													app.data.postcodes[postcode] = cityname;
												}						
												
												onDone ();
												
											};											
											
							var worker3 =	function ()
											{
												// Reset progressmeter #1.
												progresswindow.document.getElementById ("description1").textContent = "Opdatere brugerflade ...";												
																						
												var nextWorker =	function ()
																	{
																		// Update progressmeter #1
																		currentprogress++;
																		progresswindow.document.getElementById ("progressmeter1").mode = "determined";
																		progresswindow.document.getElementById ("progressmeter1").value = (currentprogress / totalprogress) * 100;
																																			
																		setTimeout (finish, 100);
																	};
																							
												var onDone = 		function ()
																	{																		
																		nextWorker ();
																	};
																	
												main.auctions.init ();
												main.customers.init ();							 
												main.books.init ();										
												main.newsletters.init ();
					
												onDone ();
												
											};
																
							var finish =	function ()	
											{	
												progresswindow.close ();
											};
			
							// Start worker1;				
							setTimeout (start, 100);																												
						};
				
		progresswindow.addEventListener ("load", workload);								
	},	
	
	
	createTempFolder : function ()
	{
		var localDir = sXUL.tools.getLocalDirectory ();
		
		sXUL.console.log (localDir.path);
		
		localDir.append ("temp");
		if (!localDir.exists() || !localDir.isDirectory())  
 			localDir.create (Components.interfaces.nsIFile.DIRECTORY_TYPE, 0774); 
 	
	},
	


	
	test : function ()
	{
		sXUL.config.set ({key: "url", value: 1});
		
		var test = sXUL.config.get ({key: "url"});
		
		sXUL.console.log (test);
	},
	
	test2 : function ()
	{
//		var fileupload = 	function (postUrl, fieldName, filePath, onDone)
							{
//								var formData = new FormData();
//  								formData.append (fieldName, new File(filePath));
//  								formData.append ("cmd", "Function");
//  								formData.append ("cmd.function", "Didius.Item.ImageUpload");  								
 
//  								var req = new XMLHttpRequest();
//  								req.open("POST", postUrl);
//  								req.onload = function(event) { onDone (event.target.responseText); };
  								
  //								var bla = function (event)
  	//							{
  	//								sXUL.console.log (event.loaded)
 	//								sXUL.console.log (event.total)
  	//							}
  								
  //								req.onprogress = req.upload.addEventListener("progress", bla, false);
  								
  								//req.onprogress = function (event) {sXUL.console.log (event.position);sXUL.console.log (event.totalSize); }
  								
//  								req.send(formData);
  								
//						var uploadform = SNDK.tools.newElement ("form", {id: "uploadform", method: "POST", enctype: "multipart/form-data", target: "uploadframe"})
//						SNDK.tools.newElement ("input", {type: "hidden", name: "cmd", value: "Function", appendTo: uploadform});
//						SNDK.tools.newElement ("input", {type: "hidden", name: "cmd.function", value: "SorentoLib.Media.Upload", appendTo: uploadform});
//						SNDK.tools.newElement ("input", {type: "hidden", name: "cmd.onsuccess", value: "/console/includes/upload", appendTo: uploadform});
//						SNDK.tools.newElement ("input", {type: "hidden", name: "cmd.onerror", value: "/console/includes/upload", appendTo: uploadform});
//						SNDK.tools.newElement ("input", {type: "hidden", name: "cmd.redirect", value: "False", appendTo: uploadform});
						
//						SNDK.tools.newElement ("input", {type: "hidden", name: "path", value: attributes.path, appendTo: uploadform});
//						SNDK.tools.newElement ("input", {type: "hidden", name: "mimetypes", value: attributes.mimetypes, appendTo: uploadform});
//						SNDK.tools.newElement ("input", {type: "hidden", name: "mediatype", value: "public", appendTo: uploadform});	
//						SNDK.tools.newElement ("input", {type: "hidden", name: "mediatransformations", value: attributes.mediatransformations, appendTo: uploadform});  								
  								
							};
							
		var onLoad =	function (text)
						{														
							sXUL.console.log ("response:"+ text.replace ("\n",""));																					
						};
						
		var onProgress = 	function (event)
							{
								sXUL.console.log ("loaded:"+ event.loaded);
								sXUL.console.log ("total:"+event.total);
							}
							
		var onError =	function (event)
						{
							sXUL.console.log ("An error occured during upload.");
						}
							
		sXUL.tools.fileUpload ({postUrl: "http://sorentotest.sundown.dk", fieldName: "image", filePath: "/home/rvp/Skrivebord/uploadtest.dat", additionalFields: {cmd: "function", "cmd.function": "Didius.Item.ImageUpload"}, onLoad: onLoad, onProgress: onProgress, onError: onError})
																	
		//fileupload ("http://sorentotest.sundown.dk/", "image", "/home/rvp/Skrivebord/uploadtest.dat", onDone );


//		var formData = new FormData();  		
  //		formData.append ("cmd", "Media");  		
 
  	//	var req = new XMLHttpRequest();
  	//	req.open("POST", "http://sorentotest.sundown.dk/");
  	//	req.onload = function(event) { alert (event.target.responseText); };
  								
  	//	req.send(formData);

	
	
	},
	
	eventHandlers :
	{
		onCustomerSave : function (eventData)
		{		
			main.customers.customersTreeHelper.setRow ({data: eventData});					
			
			var found = false;
			for (var index in app.data.customers)
			{
				if (app.data.customers[index].id == eventData.id)
				{
					app.data.customers[index] == eventData;
					found = true;
					break;
				}				
			}		
			
			if (!found)
			{
				app.data.customers[app.data.customers.length] = eventData;
			}
		},
		
		onCustomerDestroy : function (eventData)
		{				
			main.customers.customersTreeHelper.removeRow ({id: eventData.id});						
		},
				
		onAuctionSave : function (eventData)
		{
			main.auctions.auctionsTreeHelper.setRow ({data: eventData});
		},
		
		onAuctionDestroy : function (eventData)
		{
			main.auctions.auctionsTreeHelper.removeRow ({id: eventData.id});
		},
		
		onInvoiceCreate : function (eventData)
		{
			var data = {};
			data.id = eventData.id;
			data.createtimestamp = eventData.createtimestamp;
			data.no = eventData.no;	
										
			try											
			{	
				var customer = app.data.customers[eventData.customerid]
									
				data.customerno = customer.no;
				data.customername = customer.name;
			}
			catch (exception)
			{
				data.customerno = "";							
				data.customername = "";
			}
										
			var date = SNDK.tools.timestampToDate (eventData.createtimestamp);
			data.date = SNDK.tools.padLeft (date.getDate (), 2, "0") +"-"+ SNDK.tools.padLeft ((date.getMonth () + 1), 2, "0") +"-"+ date.getFullYear ();					
																				
			data.vat = eventData.vat.toFixed (2) +" kr."; 
			data.total = eventData.total.toFixed (2) +" kr.";			
										
			main.books.invoices.invoicesTreeHelper.addRow ({data: data});
		},
		
		onCreditnoteCreate : function (eventData)
		{																															
			var data = {};
			data.id = eventData.id;
			data.createtimestamp = eventData.createtimestamp;
			data.no = eventData.no;	
										
			try											
			{	
				var customer = app.data.customers[eventData.customerid]
			
				data.customerno = customer.no;
				data.customername = customer.name;
			}
			catch (exception)
			{
				data.customerno = "";							
				data.customername = "";
			}
			
			var date = SNDK.tools.timestampToDate (eventData.createtimestamp)										
			data.date = SNDK.tools.padLeft (date.getDate (), 2, "0") +"-"+ SNDK.tools.padLeft ((date.getMonth () + 1), 2, "0") +"-"+ date.getFullYear ();					
													
			data.vat = eventData.vat.toFixed (2) +" kr."; 
			data.total = eventData.total.toFixed (2) +" kr.";			
			
			main.books.creditnotes.creditnotesTreeHelper.addRow ({data: data});
		},
				
		onNewsletterSave : function (eventData)
		{
			main.newsletters.newslettersTreeHelper.setRow ({data: eventData});
		},
		
		onNewsletterDestroy : function (eventData)
		{
			main.newsletters.newslettersTreeHelper.removeRow ({id: eventData.id});
		}	
	},
	
	login : 
	{
		show : function ()
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
 
			var username = {value: ""};
			var password = {value: ""}; 
			var check = {value: true};
 
 			var getLogin = function ()	
 			{ 		
				var result = prompts.promptUsernameAndPassword (null, "Login", "Angiv brugernavn og adgangskode\nfor at logge på systemmet.", username, password, null, check);
													
				if (result)
				{
					if (!didius.session.login (username.value, password.value))
					{
						getLogin ();
					}										
				}
				else
				{
					app.shutdown (false);
				}
			}		
			
			getLogin ();
		}
	
	},
	
	settings : function ()
	{	
		window.openDialog ("chrome://didius/content/settings/settings.xul", "settings", "chrome", null);
	},
	
	search : function ()
	{
		document.getElementById ("customerSearch").focus ();
	},
	
	close : function ()
	{
//		var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
//		var result = prompts.confirm (null, "Afslut Didius", "Vil du afslutte Didius ?");
			
//		if (result)
//		{
			app.shutdown (false);	
//		}
	},
		
	controls : 
	{
		statusbar : 
		{
			progressmeter : 
			{
				setMode : function (value)
				{
					var progressmeter = document.getElementById ("statusbarProgressmeter");
					progressmeter.mode = value;
				},
			
				setValue : function (value)
				{
					var progressmeter = document.getElementById ("statusbarProgressmeter");
					progressmeter.value = value;
				},
				
				setDescription : function (value)
				{
					var description = document.getElementById ("statusbarProgressmeterDescription");
					description.value = value;
				}			
			}		
		}		
	},
	
	customers :
	{
		customersTreeHelper : null,
		
		init : function ()
		{							
			main.customers.customersTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("customers"), sortColumn: "name", sortDirection: "descending", onDoubleClick: main.customers.edit});		
			main.customers.set ();
		},
								
		set : function ()
		{
			document.getElementById ("customerSearch").focus ();
		
				var onDone = 	function (customers)
								{
									main.customers.customersTreeHelper.disableRefresh ();
									for (idx in customers)
									{	
										main.customers.customersTreeHelper.addRow ({data: customers[idx]});
									}
									main.customers.customersTreeHelper.enableRefresh ();
								
									// Enable controls
									document.getElementById ("customers").disabled = false;
									document.getElementById ("tab.customers").disabled = false;													
									main.customers.onChange ();
								};

				// Disable controls
				document.getElementById ("customers").disabled = true;	
				document.getElementById ("customerSearch").disabled = true;	
				document.getElementById ("customerCreate").disabled = true;			
				document.getElementById ("customerEdit").disabled = true;
				document.getElementById ("customerDestroy").disabled = true;
						
				//didius.customer.list ({async: true, onDone: onDone});										
				
				onDone (app.data.customers);
		},		
										
		onChange : function ()
		{
			if (main.customers.customersTreeHelper.getCurrentIndex () != -1)
			{					
				document.getElementById ("customerCreate").disabled = false;
				document.getElementById ("customerEdit").disabled = false;
				document.getElementById ("customerDestroy").disabled = false;				
			}
			else
			{				
				document.getElementById ("customerCreate").disabled = false;
				document.getElementById ("customerEdit").disabled = true;
				document.getElementById ("customerDestroy").disabled = true;				
			}
			
			document.getElementById ("customerSearch").disabled = false;
		},
				
		sort : function (attributes)
		{
			main.customers.customersTreeHelper.sort (attributes);
		},
		
		filter : function ()
		{
			var value = document.getElementById ("customerSearch").value;
			main.customers.customersTreeHelper.filter ({column: "name", columns: "no,name,address1,postcode,city,phone,mobile,email", value: value, direction: "in"});
		},
		
		create : function ()
		{		
			app.window.open (window, "chrome://didius/content/customer/edit.xul", "customer.edit."+ SNDK.tools.newGuid (), null, {});
		},
		
		
		edit : function ()
		{		
			app.window.open (window, "chrome://didius/content/customer/edit.xul", "customer.edit."+ main.customers.customersTreeHelper.getRow ().id, null, {customerId: main.customers.customersTreeHelper.getRow ().id});
		},
		
		destroy : function ()
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			var result = prompts.confirm (null, "Slet kunde", "Er du sikker på du vil slette denne kunde ?");
			
			if (result)
			{
				try
				{									
					didius.customer.destroy (main.customers.customersTreeHelper.getRow ().id);					
				}
				catch (error)
				{
					app.error ({exception: error})
				}								
			}
		}
	},
	
	auctions :
	{
		auctionsTreeHelper : null,
	
		init : function ()
		{
			main.auctions.auctionsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("auctions"), sortColumn: "createtimestamp", sortDirection: "ascending", onDoubleClick: main.auctions.edit});			
			main.auctions.set ();
		},
					
		set : function ()
		{
			var onDone = 	function (auctions)
							{
								main.auctions.auctionsTreeHelper.disableRefresh ();
								for (index in auctions)
								{									
									main.auctions.auctionsTreeHelper.addRow ({data: auctions[index]});
								}
								main.auctions.auctionsTreeHelper.enableRefresh ();
							
							// Enable controls
							document.getElementById ("auctions").disabled = false;
							document.getElementById ("tab.auctions").disabled = false;
							main.auctions.onChange ();
						};

			// Disable controls
			document.getElementById ("auctions").disabled = true;	
			document.getElementById ("auctionCreate").disabled = true;			
			document.getElementById ("auctionEdit").disabled = true;
			document.getElementById ("auctionDestroy").disabled = true;
					
			didius.auction.list ({async: true, onDone: onDone});				
		},	
		
		onChange : function ()
		{
			if (main.auctions.auctionsTreeHelper.getCurrentIndex () != -1)
			{					
				document.getElementById ("auctionCreate").disabled = false;
				document.getElementById ("auctionEdit").disabled = false;
				document.getElementById ("auctionDestroy").disabled = false;
				document.getElementById ("auctionSignin").disabled = false;
				document.getElementById ("auctionBidNotation").disabled = false;
				document.getElementById ("auctionRun").disabled = false;
				document.getElementById ("auctionDisplay").disabled = false;
			}
			else
			{				
				document.getElementById ("auctionCreate").disabled = false;
				document.getElementById ("auctionEdit").disabled = true;
				document.getElementById ("auctionDestroy").disabled = true;
				document.getElementById ("auctionSignin").disabled = true;
				document.getElementById ("auctionBidNotation").disabled = true;
				document.getElementById ("auctionRun").disabled = true;
				document.getElementById ("auctionDisplay").disabled = true;
			}
		},	
		
		sort : function (attributes)
		{
			main.auctions.auctionsTreeHelper.sort (attributes);
		},																					
			
		create : function ()
		{		
			app.window.open (window, "chrome://didius/content/auction/edit.xul", "didius.auction.edit."+ SNDK.tools.newGuid (), null, {});
		},
		
		edit : function ()
		{		
			app.window.open (window, "chrome://didius/content/auction/edit.xul", "didius.auction.edit."+ main.auctions.auctionsTreeHelper.getRow ().id, null, {auctionId: main.auctions.auctionsTreeHelper.getRow ().id});
		},
		
		destroy : function ()
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			var result = prompts.confirm (null, "Slet auktion", "Er du sikker på du vil slette denne auktion ?");
			
			if (result)
			{
				try
				{
					didius.auction.destroy (main.auctions.auctionsTreeHelper.getRow ().id);			
				}
				catch (error)
				{
					app.error ({exception: error})
				}								
			}
		},
		
		signin : function ()
		{
			app.window.open (window, "chrome://didius/content/auction/signin.xul", "didius.auction.signin."+ main.auctions.auctionsTreeHelper.getRow ().id, null, {auctionId: main.auctions.auctionsTreeHelper.getRow ().id});
		},
		
		run : function ()
		{
			app.window.open (window, "chrome://didius/content/auction/run.xul", "didius.auction.run."+ main.auctions.auctionsTreeHelper.getRow ().id, null, {auctionId: main.auctions.auctionsTreeHelper.getRow ().id});
		},
		
		bidNotation : function ()
		{
			app.window.open (window, "chrome://didius/content/auction/bidnotation.xul", "didius.auction.bidnotation."+ main.auctions.auctionsTreeHelper.getRow ().id, null, {auctionId: main.auctions.auctionsTreeHelper.getRow ().id});
		},
		
		display : function ()
		{
			app.window.open (window, "chrome://didius/content/auction/display.xul", "didius.auction.display."+ main.auctions.auctionsTreeHelper.getRow ().id, null, {auctionId: main.auctions.auctionsTreeHelper.getRow ().id});
		}				
	},
	
	books : 
	{	
		init : function ()
		{
			main.books.invoices.init ();
			main.books.creditnotes.init ();
			
			document.getElementById ("tab.books").disabled = false;
		},
		
		invoices : 
		{
			invoicesTreeHelper : null,
		
			init : function ()
			{
				main.books.invoices.invoicesTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("tree.booksinvoices"), sortColumn: "createtimestamp", sortDirection: "ascending", onDoubleClick: main.books.invoices.show});
				main.books.invoices.set ();
			},
			
			set : function ()
			{
				var onDone = 	function (invoices)
								{
									main.books.invoices.invoicesTreeHelper.disableRefresh ();
									for (index in invoices)
									{
										var item = invoices[index];
																														
										var data = {};
										data.id = item.id;
										data.createtimestamp = item.createtimestamp;
										data.no = item.no;	
										
										try											
										{	
											var customer = app.data.customers[item.customerid]
										
											data.customerno = customer.no;
											data.customername = customer.name;
										}
										catch (exception)
										{
											data.customerno = "";							
											data.customername = "";
										}
										
										var date = SNDK.tools.timestampToDate (item.createtimestamp)										
										data.date = SNDK.tools.padLeft (date.getDate (), 2, "0") +"-"+ SNDK.tools.padLeft ((date.getMonth () + 1), 2, "0") +"-"+ date.getFullYear ();					
																				
										data.vat = item.vat.toFixed (2) +" kr."; 
										data.total = item.total.toFixed (2) +" kr.";			
										
										main.books.invoices.invoicesTreeHelper.addRow ({data: data});
									}
									main.books.invoices.invoicesTreeHelper.enableRefresh ();
							
									// Enable controls
									document.getElementById ("tree.booksinvoices").disabled = false;									
									document.getElementById ("tab.booksinvoices").disabled = false;
									main.books.invoices.onChange ();
								};

				// Disable controls
				document.getElementById ("tree.booksinvoices").disabled = true;	
				document.getElementById ("button.booksinvoiceshow").disabled = true;							
					
				didius.invoice.list ({async: true, onDone: onDone});
			},
			
			onChange : function ()
			{
				if (main.books.invoices.invoicesTreeHelper.getCurrentIndex () != -1)
				{					
					document.getElementById ("button.booksinvoiceshow").disabled = false;					
				}
				else
				{												
					document.getElementById ("button.booksinvoiceshow").disabled = true;					
				}		
			},
			
			// ------------------------------------------------------------------------------------------------------
			// | SHOW																								|	
			// ------------------------------------------------------------------------------------------------------																																																				
			show : function ()
			{						
				app.window.open (window, "chrome://didius/content/invoice/show.xul", "didius.auction.invoice.show."+ main.books.invoices.invoicesTreeHelper.getRow ().id, null, {invoiceId: main.books.invoices.invoicesTreeHelper.getRow ().id});				
			}				
		},
		
		creditnotes : 
		{
			creditnotesTreeHelper : null,
		
			init : function ()
			{
				main.books.creditnotes.creditnotesTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("tree.bookscreditnotes"), sortColumn: "createtimestamp", sortDirection: "ascending", onDoubleClick: main.books.creditnotes.show});
				main.books.creditnotes.set ();
			},
			
			set : function ()
			{
				var onDone = 	function (creditnotes)
								{								
									main.books.creditnotes.creditnotesTreeHelper.disableRefresh ();
									for (index in creditnotes)
									{
										var item = creditnotes[index];
																														
										var data = {};
										data.id = item.id;
										data.createtimestamp = item.createtimestamp;
										data.no = item.no;	
										
										try											
										{	
											var customer = app.data.customers[item.customerid]
										
											data.customerno = customer.no;
											data.customername = customer.name;
										}
										catch (exception)
										{
											data.customerno = "";							
											data.customername = "";
										}
										
										var date = SNDK.tools.timestampToDate (item.createtimestamp)										
										data.date = SNDK.tools.padLeft (date.getDate (), 2, "0") +"-"+ SNDK.tools.padLeft ((date.getMonth () + 1), 2, "0") +"-"+ date.getFullYear ();					
																				
										data.vat = item.vat.toFixed (2) +" kr."; 
										data.total = item.total.toFixed (2) +" kr.";			
										
										main.books.creditnotes.creditnotesTreeHelper.addRow ({data: data});
									}
									main.books.creditnotes.creditnotesTreeHelper.enableRefresh ();
							
									// Enable controls									
									document.getElementById ("tree.bookscreditnotes").disabled = false;	
									document.getElementById ("tab.bookscreditnotes").disabled = false;								
									main.books.creditnotes.onChange ();
								};

				// Disable controls
				document.getElementById ("tree.bookscreditnotes").disabled = true;	
				document.getElementById ("button.bookscreditnoteshow").disabled = true;							
					
				didius.creditnote.list ({async: true, onDone: onDone});
			},
			
			onChange : function ()
			{
				if (main.books.creditnotes.creditnotesTreeHelper.getCurrentIndex () != -1)
				{					
					document.getElementById ("button.bookscreditnoteshow").disabled = false;					
				}
				else
				{												
					document.getElementById ("button.bookscreditnoteshow").disabled = true;					
				}		
			},
			
			// ------------------------------------------------------------------------------------------------------
			// | SHOW																								|	
			// ------------------------------------------------------------------------------------------------------																																																				
			show : function ()
			{									
				window.openDialog ("chrome://didius/content/creditnote/show.xul", "didius.creditnote.show."+ main.books.creditnotes.creditnotesTreeHelper.getRow ().id, "chrome", {creditnoteId: main.books.creditnotes.creditnotesTreeHelper.getRow ().id});
			}				
		}				
	},
	
	newsletters :
	{
		newslettersTreeHelper : null,
	
		init : function ()
		{
			main.newsletters.newslettersTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("newsletters"), sortColumn: "createtimestamp", sortDirection: "ascending", onDoubleClick: main.newsletters.edit});			
			main.newsletters.set ();
		},
					
		set : function ()
		{
			var onDone = 	function (newsletters)
							{
								main.newsletters.newslettersTreeHelper.disableRefresh ();
								for (index in newsletters)
								{						
									main.newsletters.newslettersTreeHelper.addRow ({data: newsletters[index]});
								}
								main.newsletters.newslettersTreeHelper.enableRefresh ();
							
							// Enable controls
							document.getElementById ("newsletters").disabled = false;
							document.getElementById ("tab.newsletters").disabled = false;
							main.newsletters.onChange ();
						};

			// Disable controls
			document.getElementById ("newsletters").disabled = true;	
			document.getElementById ("newsletterCreate").disabled = true;			
			document.getElementById ("newsletterEdit").disabled = true;
			document.getElementById ("newsletterDestroy").disabled = true;
					
			didius.newsletter.list ({async: true, onDone: onDone});				
			
			document.getElementById ("button.newslettersendsms").disabled = false;
		},	
		
		onChange : function ()
		{
			if (main.newsletters.newslettersTreeHelper.getCurrentIndex () != -1)
			{					
				document.getElementById ("newsletterCreate").disabled = false;
				document.getElementById ("newsletterEdit").disabled = false;
				document.getElementById ("newsletterDestroy").disabled = false;				
			}
			else
			{				
				document.getElementById ("newsletterCreate").disabled = false;
				document.getElementById ("newsletterEdit").disabled = true;
				document.getElementById ("newsletterDestroy").disabled = true;				
			}
		},	
		
		sort : function (attributes)
		{
			main.newsletters.newslettersTreeHelper.sort (attributes);
		},																					
			
		create : function ()
		{		
			app.window.open (window, "chrome://didius/content/newsletter/edit.xul", "didius.auction.edit."+ SNDK.tools.newGuid (), null, {});
		},
		
		edit : function ()
		{		
			app.window.open (window, "chrome://didius/content/newsletter/edit.xul", "didius.auction.edit."+ main.newsletters.newslettersTreeHelper.getRow ().id, null, {newsletterId: main.newsletters.newslettersTreeHelper.getRow ().id});													
		},
		
		destroy : function ()
		{
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			var result = prompts.confirm (null, "Slet nyhedsbrev", "Er du sikker på du vil slette dette nyhedsbrev ?");
			
			if (result)
			{
				try
				{
					didius.newsletter.destroy (main.newsletters.newslettersTreeHelper.getRow ().id);			
				}
				catch (error)
				{
					app.error ({exception: error})
				}								
			}
		},
		
		sendSMS : function ()
		{
			app.window.open (window, "chrome://didius/content/sms/send.xul", "didius.sms.send."+ SNDK.tools.newGuid (), null, {});
		}	
	},
	
	
	bugReport : function ()
	{
		window.openDialog ("chrome://didius/content/bug/report.xul", "blabla", "chrome", {});
	},
		
	about : function ()
	{
		window.openDialog ("chrome://didius/content/about/about.xul", "blabla", "chrome", {});
	}
		
}
