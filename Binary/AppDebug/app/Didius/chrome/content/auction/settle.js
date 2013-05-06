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
									
									if (items[idx].settled)
									{
										data.settled = "Ja";
									}
									else
									{
										data.settled = "Nej";
									}
									
								
									main.itemsTreeHelper.addRow ({data: data});
								}
							}	
							main.itemsTreeHelper.enableRefresh ();
							
							document.getElementById ("checkbox.settlementprint").disabled = false;
							document.getElementById ("checkbox.settlementmail").disabled = false;							
							
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
		var progresswindow = app.window.open (window, "chrome://didius/content/auction/invoiceprogress.xul", "auction.invoice.progress."+ main.current.id, "dialog", {});	
										
		var workload = function ()
		{
			progresswindow.removeEventListener ("load", workload, false)
		
			var overallprogress = 0;
			var totalprogress = 5;
			
			var cases = new Array ();		
			var settlements = new Array ();
		
			var start =	function ()	
						{
							document.getElementById ("checkbox.settlementprint").disabled = true;
							document.getElementById ("checkbox.settlementmail").disabled = true;							
							
							document.getElementById ("button.close").disabled = true;
							document.getElementById ("button.settle").disabled = true;
							
							worker1 ();
						};
		
			// Find customers who needs a settlement. All none invoiced customers.								
			var worker1 = 	function ()
							{
								// Reset progressmeter #1.
								progresswindow.document.getElementById ("description1").textContent = "Scanner solgte effekter [0/"+ main.items.length +"] ...";
								progresswindow.document.getElementById ("progressmeter1").value = 0;
								
								// Reset progressmeter #2.
								progresswindow.document.getElementById ("description2").textContent = "Finder kunder der skal afregnes ...";								
												
								// Do work.				
								for (index in main.items)
								{																										
									var item = main.items[index];								
									if ((item.bidamount > 0) && (item.invoiced == true) && (item.settled == false))
									{									
										var case_ = didius.case.load ({id: item.caseid});																				
									
										var add = true;
										for (index2 in cases)
										{
											if (cases[index2].id == case_.id)
											{
												add = false;
												break;
											}
										}
									
										if (add)
										{
											cases[cases.length] = case_;
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
			
			// Create settlements.
			var worker2 =	function ()
							{
								// Reset progressmeter #1.
								progresswindow.document.getElementById ("description1").textContent = "Fremstiller afregninger [0/"+ cases.length +"] ...";
								progresswindow.document.getElementById ("progressmeter1").value = 0;
								
								// Reset progressmeter #2.
								progresswindow.document.getElementById ("description2").textContent = "Afregner ...";
								
								// Do work.
								for (index in cases)
								{
									try
									{																		
										var case_ = cases[index];																																		
										var settlement = didius.settlement.create ({case: case_});
										settlements[settlements.length] = settlement;																
									}
									catch (exception)
									{
										sXUL.console.log (exception);									
									}
									
									
									// Update progressmeter #1
									progresswindow.document.getElementById ("description1").textContent = "Fremstiller afregninger ["+ index +"/"+ cases.length +"] ...";
									progresswindow.document.getElementById ("progressmeter1").value = (index / cases.length) * 100;			
								}				
								
								// Update progressmeter #1
								progresswindow.document.getElementById ("progressmeter1").value = 100;
								
								// Update progressmeter #2
								overallprogress++;
								progresswindow.document.getElementById ("progressmeter2").value = (overallprogress / totalprogress) * 100;
								
								setTimeout (worker3, 100);
							};
							
			// Print settlements.
			var worker3 = 	function ()
							{
								// Reset progressmeter #1.
								progresswindow.document.getElementById ("description1").textContent = "Bygger print [0/1] ...";
								progresswindow.document.getElementById ("progressmeter1").value = 0;
								
								// Reset progressmeter #2.
								progresswindow.document.getElementById ("description2").textContent = "Printer afregninger ...";
															
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
																
								if (document.getElementById ("checkbox.settlementprint").checked)
								{	
									didius.common.print.settlement ({settlements: settlements, mail: false, onDone: nextWorker});
									
									// Update progressmeter #1
									progresswindow.document.getElementById ("description1").textContent = "Bygger print [1/1] ...";
									progresswindow.document.getElementById ("progressmeter1").value = 100;
								}				
								else
								{
									nextWorker ();
								}								
							};
					
//			// Email itemwon notifications.
//			var worker4 =	function ()
//							{
//								// Reset progressmeter #1.
//								progresswindow.document.getElementById ("description1").textContent = "Sender e-mail [0/"+ main.items.length +"] ...";
//								progresswindow.document.getElementById ("progressmeter1").value = 0;
//								
//								// Reset progressmeter #2.
//								progresswindow.document.getElementById ("description2").textContent = "Sender bud advisering ...";
//								
//								var nextWorker =	function ()
//													{
//														// Update progressmeter #1
//														progresswindow.document.getElementById ("progressmeter1").value = 100;
//																
//														// Update progressmeter #2
//														overallprogress++;
//														progresswindow.document.getElementById ("progressmeter2").value = (overallprogress / totalprogress) * 100;
//																				
//														setTimeout (worker5, 100);
//													};
//															
//								// Do work.
//								if (document.getElementById ("checkbox.itemwonnotifcationsmail").checked)
//								{
//									var subworker =	function (index)
//													{													
//														if (index < main.items.length)
//														{	
//															var onDone = 	function ()
//																			{
//																				// Update progressmeter #1
//																				progresswindow.document.getElementById ("description1").textContent = "Sender e-mail ["+ index +"/"+ main.items.length +"] ...";
//																				progresswindow.document.getElementById ("progressmeter1").value = (index / main.items.length) * 100;
//																				
//																				subworker (index + 1);
//																			};
//														
//															if (main.items[index].bidamount > 0 || (main.items[index].approvedforinvoice == true))
//															{
//																//sXUL.console.log ("SENDING BIDWON");																
//																didius.helpers.mailBidWon (main.items[index]);
//																
//																onDone ();
//															}
//															else
//															{
//																onDone ();
//															}																																																										
//														}
//														else
//														{		
//															nextWorker ();
//														}
//													}
//				
//									setTimeout (function () {subworker (0)}, 500);
//								}				
//								else
//								{
//									nextWorker ();
//								}							
//							};
							
			// Email settlements
			var worker4 =	function ()
							{
								// Reset progressmeter #1.
								progresswindow.document.getElementById ("description1").textContent = "Sender e-mail [0/"+ settlements.length +"] ...";
								progresswindow.document.getElementById ("progressmeter1").value = 0;
								
								// Reset progressmeter #2.
								progresswindow.document.getElementById ("description2").textContent = "Sender afregning ...";
							
								var nextWorker =	function ()
													{
														// Update progressmeter #1
														progresswindow.document.getElementById ("progressmeter1").value = 100;
																
														// Update progressmeter #2
														overallprogress++;
														progresswindow.document.getElementById ("progressmeter2").value = (overallprogress / totalprogress) * 100;
																				
														setTimeout (finish, 100);
													};
															
								if (document.getElementById ("checkbox.settlementmail").checked)
								{
									var subworker =	function (index)
													{
														if (index < settlements.length)
														{	
															var onDone = 	function ()
																			{
																				subworker (index + 1);
																			};
														
															didius.common.print.settlement ({settlement: settlements[index], mail: true, onDone: onDone});
														
															// Update progressmeter #1
															progresswindow.document.getElementById ("description1").textContent = "Sender e-mail ["+ index +"/"+ cases.length +"] ...";
															progresswindow.document.getElementById ("progressmeter1").value = (index / cases.length) * 100;
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
								document.getElementById ("checkbox.settlementprint").disabled = false;
								document.getElementById ("checkbox.settlementmail").disabled = false;								
							
								document.getElementById ("button.close").disabled = false;
								document.getElementById ("button.settle").disabled = false;
								
								main.set ();
							
								progresswindow.close ();
							};
			
			// Start worker1;				
			setTimeout (start, 100);
		}
		
		progresswindow.addEventListener ("load", workload);
	}
}