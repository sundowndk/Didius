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
		var invoice = didius.invoice.create ({auction: main.auction, customer: main.customer, simulate: true});
	
		for (idx in invoice.items)
		{
			var item = invoice.items[idx];
			
			main.itemsTreeHelper.addRow ({data: item});
		}
	
		document.getElementById ("totalSale").value = invoice.sales;
		document.getElementById ("totalCommissionFee").value = invoice.commissionfee;
		document.getElementById ("totalVat").value = invoice.vat;
		document.getElementById ("totalTotal").value = invoice.total;
		
		if (invoice.total > 0)
		{
			document.getElementById ("approve").disabled = false;
		}
	},
		
	approve : function ()
	{					
		var current = didius.invoice.create ({auction: main.auction, customer: main.customer, simulate: false});
						
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