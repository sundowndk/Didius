Components.utils.import("resource://didius/js/app.js");

var main =
{
	current : null,	
	items : null,		
	itemsTreeHelper: null,

	init : function ()
	{
		try
		{
			main.current = didius.auction.load (window.arguments[0].auctionId);			
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}								
	
		main.itemsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("tree.items"), sortColumn: "catalogno", sortDirection: "descending"});
	
		main.set ();
		
		// Hook events.			
		app.events.onAuctionDestroy.addHandler (main.eventHandlers.onAuctionDestroy);				
	},
	
	eventHandlers : 
	{								
		onAuctionDestroy : function (eventData)
		{
			if (main.current.id == eventData.id)
			{
				main.close (true);
			}
		}
	},
		
	set : function ()
	{
		var onDone =	function (items)
						{
							main.items = items;
							
							main.itemsTreeHelper.clear ();
							main.itemsTreeHelper.disableRefresh ();
							for (idx in main.items)
							{									
								if (main.items[idx].bidamount > 0)
								{
									var data = {};
									data.id = main.items[idx].id;
									data.catalogno = main.items[idx].catalogno;
									data.no = main.items[idx].no;
									data.title = main.items[idx].title;
									data.bidamount = main.items[idx].bidamount.toFixed (2) +" kr.";;											
				
									var currentbid = didius.bid.load ({id: main.items[idx].currentbidid});
								
									data.customername = currentbid.customer.name;
									data.customerno = currentbid.customer.no;
									data.invoiced = main.items[idx].invoiced;
								
									main.itemsTreeHelper.addRow ({data: data});
								}
							}	
							main.itemsTreeHelper.enableRefresh ();
							
							document.getElementById ("checkbox.invoicesprint").disabled = false;
							document.getElementById ("checkbox.invoicesmail").disabled = false;
							document.getElementById ("checkbox.itemwonnotifcationsmail").disabled = false;																												
							
							document.getElementById ("button.close").disabled = false;
							document.getElementById ("button.settle").disabled = false;
						}
	
		document.title = "Auktion afregning: "+ main.current.title +" ["+ main.current.no +"]";		
		
		didius.item.list ({auction: main.current, async: true, onDone: onDone});
	},
	
	get : function ()
	{
	},
	
	onChange : function ()
	{
		
		if (main.itemsTreeHelper.getCurrentIndex () != -1)
		{										
			main.setItem (parseInt (main.itemsTreeHelper.getRow ().catalogno));
		}
		else
		{				
			
		}
	},
		
	close : function ()
	{
		window.close ();
	},
	
	settle : function ()
	{	
		var progresswindow = app.window.open (window, "chrome://didius/content/auction/settleprogress.xul", "auction.settle.progress."+ main.current.id, "", {});	
										
		var workload = function ()
		{
			progresswindow.removeEventListener ("load", workload, false)
		
			var overallprogress = 0;
			var totalprogress = 5;
			
			var customers = new Array ();		
			var invoices = new Array ();
		
			var start =	function ()	
						{
							document.getElementById ("checkbox.invoicesprint").disabled = true;
							document.getElementById ("checkbox.invoicesmail").disabled = true;
							document.getElementById ("checkbox.itemwonnotifcationsmail").disabled = true;
							
							document.getElementById ("button.close").disabled = true;
							document.getElementById ("button.settle").disabled = true;
							
							worker1 ();
						};
		
			// Find customers who needs an invoice. All none invoiced customers.								
			var worker1 = 	function ()
							{
								// Reset progressmeter #1.
								progresswindow.document.getElementById ("description1").textContent = "Scanner solgte effekter [0/"+ main.items.length +"] ...";
								progresswindow.document.getElementById ("progressmeter1").value = 0;
								
								// Reset progressmeter #2.
								progresswindow.document.getElementById ("description2").textContent = "Finder kunder der skal faktureres ...";								
												
								// Do work.				
								for (index in main.items)
								{																										
									var item = main.items[index];								
									if ((item.bidamount > 0) && (item.invoiced == false))
									{									
										var currentbid = didius.bid.load (item.currentbidid);
										var customer = didius.customer.load (currentbid.customerid);
									
										var add = true;
										for (index2 in customers)
										{
											if (customers[index2].id == customer.id)
											{
												add = false;
												break;
											}
										}
									
										if (add)
										{
											customers[customers.length] = customer;
										}			
									}
									
									// Update progressmeter #1
									progresswindow.document.getElementById ("description1").textContent = "Scanner solgte effekter ["+ index +"/"+ main.items.length +"] ...";
									progresswindow.document.getElementById ("progressmeter1").value = (index / main.items.length) * 100;
								}
								
								// Update progressmeter #1								
								progresswindow.document.getElementById ("progressmeter1").value = 100;
								
								// Update progressmeter #2
								overallprogress++;
								progresswindow.document.getElementById ("progressmeter2").value = (overallprogress / totalprogress) * 100;
								
								setTimeout (worker2, 100);
							};
			
			// Create invoices.
			var worker2 =	function ()
							{
								// Reset progressmeter #1.
								progresswindow.document.getElementById ("description1").textContent = "Fremstiller faktura [0/"+ customers.length +"] ...";
								progresswindow.document.getElementById ("progressmeter1").value = 0;
								
								// Reset progressmeter #2.
								progresswindow.document.getElementById ("description2").textContent = "Fakturere ...";
								
								// Do work.
								for (index in customers)
								{
									var customer = customers[index];								
									var invoice = didius.invoice.create ({auction: main.current, customer: customer, simulate: true});
									invoices[invoices.length] = invoice;
						
									sXUL.console.log (customer.name);																	
									
									// Update progressmeter #1
									progresswindow.document.getElementById ("description1").textContent = "Fremstiller faktura ["+ index +"/"+ customers.length +"] ...";
									progresswindow.document.getElementById ("progressmeter1").value = (index / customers.length) * 100;			
								}				
								
								// Update progressmeter #1
								progresswindow.document.getElementById ("progressmeter1").value = 100;
								
								// Update progressmeter #2
								overallprogress++;
								progresswindow.document.getElementById ("progressmeter2").value = (overallprogress / totalprogress) * 100;
								
								setTimeout (worker3, 100);
							};
							
			// Print invoices.
			var worker3 = 	function ()
							{
								// Reset progressmeter #1.
								progresswindow.document.getElementById ("description1").textContent = "Bygger print [0/1] ...";
								progresswindow.document.getElementById ("progressmeter1").value = 0;
								
								// Reset progressmeter #2.
								progresswindow.document.getElementById ("description2").textContent = "Printer faktura ...";
															
								// Do work.
								var nextWorker = 	function ()
													{									
														// Update progressmeter #1
														progresswindow.document.getElementById ("progressmeter1").value = 100;
																																												
														// Update progressmeter #2
														overallprogress++;
														progresswindow.document.getElementById ("progressmeter2").value = (overallprogress / totalprogress) * 100;					
												
														setTimeout (worker4, 100);
													};
								
								if (document.getElementById ("checkbox.invoicesprint").checked)
								{	
									didius.common.print.invoice ({invoices: invoices, mail: false, onDone: nextWorker});
									
									// Update progressmeter #1
									progresswindow.document.getElementById ("description1").textContent = "Bygger print [1/1] ...";
									progresswindow.document.getElementById ("progressmeter1").value = 100;
								}				
								else
								{
									nextWorker ();
								}								
							};
					
			// Email itemwon notifications.
			var worker4 =	function ()
							{
								// Reset progressmeter #1.
								progresswindow.document.getElementById ("description1").textContent = "Sender e-mail [0/"+ main.items.length +"] ...";
								progresswindow.document.getElementById ("progressmeter1").value = 0;
								
								// Reset progressmeter #2.
								progresswindow.document.getElementById ("description2").textContent = "Sender bud advisering ...";
								
								var nextWorker =	function ()
													{
														// Update progressmeter #1
														progresswindow.document.getElementById ("progressmeter1").value = 100;
																
														// Update progressmeter #2
														overallprogress++;
														progresswindow.document.getElementById ("progressmeter2").value = (overallprogress / totalprogress) * 100;
																				
														setTimeout (worker5, 100);
													};
															
								// Do work.
								if (document.getElementById ("checkbox.itemwonnotifcationsmail").checked)
								{
									var subworker =	function (index)
													{													
														if (index < main.items.length)
														{	
															var onDone = 	function ()
																			{
																				// Update progressmeter #1
																				progresswindow.document.getElementById ("description1").textContent = "Sender e-mail ["+ index +"/"+ main.items.length +"] ...";
																				progresswindow.document.getElementById ("progressmeter1").value = (index / main.items.length) * 100;
																				
																				subworker (index + 1);
																			};
														
															if (main.items[index].bidamount > 0)
															{
																didius.helpers.mailBidWon (main.items[index]);
																onDone ();
															}
															else
															{
																onDone ();
															}																																																										
														}
														else
														{		
															nextWorker ();
														}
													}
				
									setTimeout (function () {subworker (0)}, 500);
								}				
								else
								{
									nextWorker ();
								}							
							};
							
			// Email invoices
			var worker5 =	function ()
							{
								// Reset progressmeter #1.
								progresswindow.document.getElementById ("description1").textContent = "Sender e-mail [0/"+ invoices.length +"] ...";
								progresswindow.document.getElementById ("progressmeter1").value = 0;
								
								// Reset progressmeter #2.
								progresswindow.document.getElementById ("description2").textContent = "Sender faktura ...";
							
								var nextWorker =	function ()
													{
														// Update progressmeter #1
														progresswindow.document.getElementById ("progressmeter1").value = 100;
																
														// Update progressmeter #2
														overallprogress++;
														progresswindow.document.getElementById ("progressmeter2").value = (overallprogress / totalprogress) * 100;
																				
														setTimeout (finish, 100);
													};
															
								if (document.getElementById ("checkbox.invoicesmail").checked)
								{
									var subworker =	function (index)
													{
														if (index < invoices.length)
														{	
															var onDone = 	function ()
																			{
																				subworker (index + 1);
																			};
														
															didius.common.print.invoice ({invoice: invoices[index], mail: true, onDone: onDone});
														
															// Update progressmeter #1
															progresswindow.document.getElementById ("description1").textContent = "Sender e-mail ["+ index +"/"+ customers.length +"] ...";
															progresswindow.document.getElementById ("progressmeter1").value = (index / customers.length) * 100;
														}
														else
														{		
															nextWorker ();
														}
													}
				
									setTimeout (function () {subworker (0)}, 500);
								}				
								else
								{
									nextWorker ();
								}
							};
																
			var finish =	function ()	
							{
								document.getElementById ("printInvoices").disabled = false;
								document.getElementById ("sendInvoices").disabled = false;
								document.getElementById ("sendItemWonNotifications").disabled = false;
							
								document.getElementById ("close").disabled = false;
								document.getElementById ("settle").disabled = false;
								
								main.set ();
							
								progresswindow.close ();
							};
			
			// Start worker1;				
			setTimeout (start, 100);
		}
		
		progresswindow.addEventListener ("load", workload);
	}
}