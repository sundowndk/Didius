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
	report : null,

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
	
		main.sellerLinesTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("tree.sellerlines"), sortColumn: "customername", sortDirection: "descending"});
		
		main.buyerLinesTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("tree.buyerlines"), sortColumn: "id", sortDirection: "descending"});
	
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
							main.report = result;
						
//							for (var index in result.sellerlines)
//							{
//								var line = result.sellerlines[index];
//																	
//								var data = {};								
//								data.id = line.id;
//								data.customername = "";								
//								data.catalogno = line.catalogno;
//								data.text = line.text;	
//								data.amount = line.amount.toFixed (2) +" kr.";
//								data.vatamount = line.vatamount.toFixed (2) +" kr.";
//								data.commissionfee = line.commissionfee.toFixed (2) +" kr.";
//								data.vatcommissionfee = line.vatcommissionfee.toFixed (2) +" kr.";									
//								data.total = line.total.toFixed (2) +" kr.";

//								main.sellerLinesTreeHelper.addRow ({isChildOfId: line.customerid, data: data});

//								main.sellerLinesTreeHelper.addRow ({data: data});								
//							}
							
							try
							
							{
							
//							for (var index in result.sellers)
//							{
//								var seller = result.sellers[index];
//							
//								var data = {}
//								data.id = seller.id;
//								data.customername = seller.text;
//								data.catalogno = "";
//								data.text = "";
//								data.amount = seller.amount.toFixed (2) +" kr.";
//								data.vatamount = seller.vatamount.toFixed (2) +" kr.";
//								data.commissionfee = seller.commissionfee.toFixed (2) +" kr.";								
//								data.vatcommissionfee = seller.vatcommissionfee.toFixed (2) +" kr.";								
//								data.total = seller.total.toFixed (2) +" kr.";								
//							
//								main.sellerLinesTreeHelper.addRow ({data: data});
//							}
							
//							sXUL.console.log (result.sellercommissionfee)
							
							document.getElementById ("textbox.selleramount").value = result.selleramount;
							document.getElementById ("textbox.sellercommissionfee").value = result.sellercommissionfee;
							document.getElementById ("textbox.sellervat").value = result.sellervat;
							document.getElementById ("textbox.sellertotal").value = result.sellertotal;
																		
//							for (var index in result.buyerlines)
//							{
//								var line = result.buyerlines[index];
//																	
//								var data = {};								
//								data.id = line.id;
//								data.customername = "";								
//								data.catalogno = line.catalogno;
//								data.text = line.text;	
//								data.amount = line.amount.toFixed (2) +" kr.";
//								data.vatamount = line.vatamount.toFixed (2) +" kr.";
//								data.commissionfee = line.commissionfee.toFixed (2) +" kr.";
//								data.vatcommissionfee = line.vatcommissionfee.toFixed (2) +" kr.";									
//								data.total = line.total.toFixed (2) +" kr.";
//																																																																													
//								main.buyerLinesTreeHelper.addRow ({isChildOfId: line.customerid, data: data});
//								//main.buyerLinesTreeHelper.addRow ({data: data});
//							}
																					
//							for (var index in result.buyers)
//							{
//								var buyer = result.buyers[index];
//																
//							
//								var data = {}
//								data.id = buyer.id;
//								data.customername = buyer.text;
//								data.catalogno = "";
//								data.text = "";
//								data.amount = buyer.amount.toFixed (2) +" kr.";
//								data.vatamount = buyer.vatamount.toFixed (2) +" kr.";
//								data.commissionfee = buyer.commissionfee.toFixed (2) +" kr.";								
//								data.vatcommissionfee = buyer.vatcommissionfee.toFixed (2) +" kr.";								
//								data.total = buyer.total.toFixed (2) +" kr.";								
//								
//								main.buyerLinesTreeHelper.addRow ({data: data});
//								
//								sXUL.console.log (buyer.id)
//							}
							
							
							document.getElementById ("textbox.buyeramount").value = result.buyeramount;
							document.getElementById ("textbox.buyercommissionfee").value = result.buyercommissionfee;
							document.getElementById ("textbox.buyervat").value = result.buyervat;
							document.getElementById ("textbox.buyertotal").value = result.buyertotal;
							
							}
							catch (r)
							{
								sXUL.console.log (r)
							}
						};
		
		didius.helpers.createTurnoverReport ({auction: main.auction, async: true, onDone: onDone});
				
		document.title = "Omsætning : "+ main.auction.title;		
		
		document.getElementById ("button.print").disabled = false;		
		document.getElementById ("button.close").disabled = false;
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
	
	print : function ()
	{
		var progresswindow = app.window.open (window, "chrome://didius/content/settlement/progress.xul", "didius.auction.turnover.progress."+ main.auction.id, "", {});	
										
		var workload = function ()
		{
			progresswindow.removeEventListener ("load", workload, false)
		
			var overallprogress = 0;
			var totalprogress = 1;
			
			var customers = new Array ();		
			var invoices = new Array ();
		
			// Start.
			var start =	function ()	
						{						
							worker1 ();
						};
								
			// Email invoice.
			var worker1 =	function ()
							{
								// Reset progressmeter #1.
								progresswindow.document.getElementById ("description1").textContent = "Udskriver ...";
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
												
								var onError = 	function ()
												{
													app.error ({errorCode: "APP00150"});	
													finish ();
												}
													
								//didius.common.print.turnoverReport ({auction: main.auction, onDone: onDone, onError: onError});	
								didius.common.print.turnoverReport ({report: main.report, onDone: onDone, onError: onError});	
							};
																
			var finish =	function ()	
							{															
								progresswindow.close ();
							};
			
			// Start worker.
			setTimeout (start, 100);
		}
		
		progresswindow.addEventListener ("load", workload);		
	
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
		