Components.utils.import("resource://didius/js/app.js");

// ----------------------------------------------------------------------------------------------------------
// | MAIN																									|
// ---------------------------------------------------------------------------------------------------------
var main =
{
	// ------------------------------------------------------------------------------------------------------
	// | VARIABLES																							|	
	// ------------------------------------------------------------------------------------------------------
	auction : null,	
	items : null,
	cases : null,	
	casesTreeHelper: null,

	// ------------------------------------------------------------------------------------------------------
	// | INIT																								|	
	// ------------------------------------------------------------------------------------------------------
	init : function ()
	{
		try
		{
			main.auction = didius.auction.load (window.arguments[0].auctionId);
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}								
	
		main.casesTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("tree.cases"), sortColumn: "customername", sortDirection: "descending"});
		
		main.buyersTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("tree.buyers"), sortColumn: "id", sortDirection: "descending"});
	
		main.set ();
		
		// Hook events.			
		app.events.onAuctionDestroy.addHandler (eventHandlers.onAuctionDestroy);
	},

	// ------------------------------------------------------------------------------------------------------
	// | SET																								|	
	// ------------------------------------------------------------------------------------------------------		
	set : function ()
	{
		var onDone =	function (result)
						{																													
							main.casesTreeHelper.disableRefresh ();
							
							try
							{
								var totalsale = 0;
								var totalvat = 0;
								var totalcommissionfee = 0;
								var totalsettle = 0;
							
							for (var index in result)
							{	
								var case_ = result[index];	
																	
								var items = didius.item.list ({case: case_});
								SNDK.tools.sortArrayHash (items, "catalogno", "numeric");
							
								var sale = 0;						
								var vatamount = 0;
								var commissionfee = 0;
								var settle = 0;								
							
								for (var index in items)
								{
									var item = items[index];
								
									// SELLERS
									{																	
										var data = {};								
										data.id = item.id;
										data.customername = "";								
										data.itemcatalogno = item.catalogno;									
										data.title = item.title;									
																		
										data.sale = item.bidamount.toFixed (2) +" kr.";																																			
										data.commissionfee = item.commissionfee.toFixed (2) +" kr.";
										data.settlement = (item.bidamount - item.commissionfee).toFixed (2) +" kr."
										data.vat = item.vatamount.toFixed (2) +" kr.";
									
										data.settle = item.bidamount.toFixed (2) +" kr.";
																																																																													
										main.casesTreeHelper.addRow ({isChildOfId: item.caseid, data: data});								
								
										sale += item.bidamount;
									
										commissionfee += item.commissionfee;
								
										vatamount += item.vatamount;																		
									}
									
									// BUYER
									{
									//sXUL.console.log (SNDK.tools.newGuid ())
									
										if (item.currentbidid != SNDK.tools.emptyGuid)
										{
											var bid = didius.bid.load ({id: item.currentbidid});
											var customer = didius.customer.load (bid.customerid);
										
											var data1 = {};
											data1.id = customer.id;
											data1.catalogno = "";
											data1.title = customer.name;
											
											var data2 = {};
											data2.id = item.id;
											data2.catalogno = item.catalogno;
											data2.title = item.title;
											
											main.buyersTreeHelper.addRow ({data: data1});
											main.buyersTreeHelper.addRow ({isChildOfId: customer.id, data: data2});
										}
									}
								}
								
																																									
								var data = {};
								data.id = case_.id;								
								
								var customer = didius.customer.load (case_.customerid);								
								data.customername = customer.name;
								data.itemcatalogno = "";
								data.title = case_.title;								
								data.sale = sale.toFixed (2) +" kr.";
								data.commissionfee = commissionfee.toFixed (2) +" kr.";								
								data.vat = vatamount.toFixed (2) +" kr.";			
								data.settlement = (sale - commissionfee).toFixed (2) +" kr.";																													
								
								main.casesTreeHelper.addRow ({data: data});
							}
							}
							catch (e)
							{
								sXUL.console.log (e)
							}
							
							
							
							
							
							
							
							
							main.casesTreeHelper.enableRefresh ();
																					
							document.getElementById ("button.close").disabled = false;							
						}
	
		didius.case.list ({auction: main.auction, async: true, onDone: onDone});
		
		
	
		document.title = "Omsætning : "+ main.auction.title;		
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
		
		if (main.itemsTreeHelper.getCurrentIndex () != -1)
		{										
			main.setItem (parseInt (main.itemsTreeHelper.getRow ().catalogno));
		}
		else
		{				
			
		}
	},
		
	// ------------------------------------------------------------------------------------------------------
	// | CLOSE																								|	
	// ------------------------------------------------------------------------------------------------------		
	close : function ()
	{
		window.close ();
	},
	
	// ------------------------------------------------------------------------------------------------------
	// | SETTLE																								|	
	// ------------------------------------------------------------------------------------------------------	
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

// ----------------------------------------------------------------------------------------------------------
// | EVENTHANDLERS																							|
// ----------------------------------------------------------------------------------------------------------	
var	eventHandlers =
{								
	onAuctionDestroy : function (eventData)
	{
		if (main.auction.id == eventData.id)
		{
			main.close (true);
		}
	}
}
		