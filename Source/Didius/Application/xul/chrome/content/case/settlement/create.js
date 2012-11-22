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
		var settlement = didius.settlement.create (main.current, true);
		
		document.getElementById ("totalSale").value = settlement.sales;
		document.getElementById ("totalCommissionFee").value = settlement.commissionfee;
		document.getElementById ("totalVat").value = settlement.vat;
		document.getElementById ("totalTotal").value = settlement.total;
			
		for (idx in settlement.items)
		{
			var item = settlement.items[idx];
			main.itemsTreeHelper.addRow ({data: item});					
		}
		
		document.getElementById ("approve").disabled = false;
	},
		
	approve : function ()
	{			
		didius.settlement.create (main.current, false);
						
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