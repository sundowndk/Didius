Components.utils.import("resource://didius/js/app.js");

var main =
{
	current : null,

	init : function ()
	{	 	
		try
		{
			main.current = didius.invoice.load (window.arguments[0].invoiceId);
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
		for (idx in main.current.items)
		{						
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
		
		if (main.current.customer.email != "")
		{
			document.getElementById ("mail").disabled = false;
		}
	},
	
	mail : function ()
	{
		window.openDialog ("chrome://didius/content/auction/invoice/print.xul", "invoiceprint-"+ main.current.id, "chrome, modal", {invoiceId: main.current.id, mailto: main.current.customer.email});
	},
	
	print : function ()
	{
		window.openDialog ("chrome://didius/content/auction/invoice/print.xul", "invoiceprint-"+ main.current.id, "chrome, modal", {invoiceId: main.current.id});
	},
		
	close : function (force)
	{									
		// Close window.
		window.close ();
	}
}