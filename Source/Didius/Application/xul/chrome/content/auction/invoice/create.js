Components.utils.import("resource://didius/js/app.js");

var main =
{	
	auction : null,
	customer : null,
	current : null,
	
	

	init : function ()
	{	 	
		try
		{
			main.auction = didius.auction.load (window.arguments[0].auctionId);
			main.customer = didius.customer.load (window.arguments[0].customerId);
		}
		catch (error)
		{
			app.error ({exception: error})
			main.close ();
			return;
		}								
	
		main.itemsTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("items"), sortColumn: "catalogno", sortDirection: "descending"});
	
		main.set ();		
	},
			
	set : function ()
	{		
		var onDone = 	function (items)
						{
							var totalSale = 0;
							var totalCommissionFee = 0;							
							var totalTotal = 0;
						
							for (idx in items)
							{	
								if (items[idx].currentbidid != SNDK.tools.emptyGuid)
								{
									var bid = didius.bid.load (items[idx].currentbidid);
									
									if ((bid.customerid == main.customer.id) && (items[idx].invoiced == false))
									{
									sXUL.console.log ("customerid1:"+ bid.customerid);
									sXUL.console.log ("customerid2:"+ main.customer.id);
									sXUL.console.log ("invoiced:"+ items[idx].invoiced);
										var data = {};
										data["id"] = items[idx].id;
										data["catalogno"] = items[idx].catalogno;
										data["no"] = items[idx].no;
										data["title"] = items[idx].title;
										
										data["bidamount"] = bid.amount;
										data["commissionfee"] = items[idx].commissionfee;
																				
										main.itemsTreeHelper.addRow ({data: data});																														
																																																		
										totalSale += parseInt (bid.amount);
										totalCommissionFee += parseInt (items[idx].commissionfee);
										totalTotal = totalSale + totalCommissionFee;
									}									
								}
							}												
							
							document.getElementById ("totalSale").value = totalSale;
							document.getElementById ("totalCommissionFee").value = totalCommissionFee;
							document.getElementById ("totalTotal").value = totalTotal;
							
							if (totalTotal > 0)
							{
								document.getElementById ("approve").disabled = false;
							}
						};
					
		didius.item.list ({auction: main.auction, async: true, onDone: onDone});
	},
		
	approve : function ()
	{					
		var current = didius.invoice.create (main.auction, main.customer);
						
		if (window.arguments[0].onApprove != null)
		{
			window.arguments[0].onApprove (current);
		}
		
		main.close ();	
	},
	
	close : function (force)
	{									
		// Close window.
		window.close ();
	}
}