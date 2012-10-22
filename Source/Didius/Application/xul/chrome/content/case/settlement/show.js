Components.utils.import("resource://didius/js/app.js");

var main =
{
	current : null,

	init : function ()
	{	 	
		try
		{
			main.current = didius.settlement.load (window.arguments[0].settlementId);
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
																
								main.itemsTreeHelper.addRow ({data: data});
							}																																	
						};
					
		//didius.item.list ({case: main.current, async: true, onDone: onDone});					
		
		for (idx in main.current.items)
		{					
	//		sXUL.console.log (idx);
			var item = main.current.items[idx];
		
			var data = {};
			data["id"] = item.id;
			data["catalogno"] = item.catalogno;
			data["no"] = item.no;
			data["title"] = item.title;
			data["bidamount"] = didius.bid.load (item.currentbidid).amount;								
			data["commissionfee"] = item.commissionfee;
											
			main.itemsTreeHelper.addRow ({data: data});
		}		
				
		document.getElementById ("sales").value = main.current.sales;
		document.getElementById ("commissionFee").value = main.current.commissionfee;
		document.getElementById ("total").value = main.current.total;
	},
	
	print : function ()
	{
		window.openDialog ("chrome://didius/content/case/settlement/print.xul", "settlementprint-"+ main.current.id, "chrome, modal", {settlementId: main.current.id});
	},
		
	close : function (force)
	{									
		// Close window.
		window.close ();
	}
}