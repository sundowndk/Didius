Components.utils.import("resource://didius/js/app.js");

var main =
{
	checksum : null,
	current : null,

	init : function ()
	{	 	
		try
		{
			main.current = didius.case.load (window.arguments[0].caseId);
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
								var data = {};
								data["id"] = items[idx].id;
								data["catalogno"] = items[idx].catalogno;
								data["no"] = items[idx].no;
								data["title"] = items[idx].title;
								
								var bidAmount = 0;
								if (items[idx].currentbidid != SNDK.tools.emptyGuid)
								{
									bidAmount = didius.bid.load (items[idx].currentbidid).amount;
								}
								
								if (bidAmount == 0)
								{
									continue;
								}				
								data["bidamount"] = bidAmount;								
								data["commissionfee"] = items[idx].commissionfee;
																
								totalSale += parseInt (bidAmount);
								totalCommissionFee += parseInt (items[idx].commissionfee);
								totalTotal = totalSale + totalCommissionFee;																								
																							
								main.itemsTreeHelper.addRow ({data: data});
							}												
							
							document.getElementById ("totalSale").value = totalSale;
							document.getElementById ("totalCommissionFee").value = totalCommissionFee;
							document.getElementById ("totalTotal").value = totalTotal;
						};
					
		didius.item.list ({case: main.current, async: true, onDone: onDone});					
	},
		
	approve : function ()
	{			
		var onDone = 	function (items)
						{
//							var totalSale = 0;
//							var totalCommissionFee = 0;							
//							var totalTotal = 0;
						
							for (idx in items)
							{					
								
							
//								var data = {};
//								data["id"] = items[idx].id;
//								data["catalogno"] = items[idx].catalogno;
//								data["no"] = items[idx].no;
//								data["title"] = items[idx].title;
								
//								var bidAmount = 0;
//								if (items[idx].currentbidid != SNDK.tools.emptyGuid)
//								{
//									bidAmount = didius.bid.load (items[idx].currentbidid).amount;
//								}
								
//								if (bidAmount == 0)
//								{
//									continue;
//								}				
//								data["bidamount"] = bidAmount;								
//								data["commissionfee"] = items[idx].commissionfee;
																
//								totalSale += parseInt (bidAmount);
//								totalCommissionFee += parseInt (items[idx].commissionfee);
//								totalTotal = totalSale + totalCommissionFee;																								
																							
//								main.itemsTreeHelper.addRow ({data: data});
							}												
							
//							document.getElementById ("totalSale").value = totalSale;
//							document.getElementById ("totalCommissionFee").value = totalCommissionFee;
//							document.getElementById ("totalTotal").value = totalTotal;
						};
					
		//didius.item.list ({case: main.current, async: true, onDone: onDone});
	
		main.current.settled = true;
		
		didius.case.save (main.current);		
					
		if (window.arguments[0].onApprove != null)
		{
			window.arguments[0].onApprove (main.current);
		}
		
		main.close ();	
	},
	
	close : function (force)
	{									
		// Close window.
		window.close ();
	}
}