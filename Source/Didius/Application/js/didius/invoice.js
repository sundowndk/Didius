create : function (attributes)
{
	var content = new Array ();
	
	if (attributes.auctionId)
		content.auctionid = attributes.auctionId;
		
	if (attributes.auction)
		content.auctionid = attributes.auction.id;
		
	if (attributes.customerId)
		content.customerid = attributes.customerId;		
	
	if (attributes.customer)
		content.customerid = attributes.customer.id;
		
	content.simulate = false;	
	
	if (attributes.simulate)
		content.simulate = attributes.simulate;
			
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Invoice.Create", "data", "POST", false);	
	request.send (content);
	
	var result = request.respons ()["didius.invoice"];

	if (!content.simulate)
	{
		if (!didius.runtime.browserMode)		
			app.events.onInvoiceCreate.execute (result);
	}
	
	return result;
},
	
load : function (id)
{
	var content = new Array ();
	content.id = id;

	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Invoice.Load", "data", "POST", false);		
	request.send (content);

	var result = request.respons ()["didius.invoice"];
	
	if (!didius.runtime.browserMode)		
		app.events.onInvoiceLoad.execute (result);

	return result;
},
				
list : function (attributes)
{
	if (!attributes) attributes = new Array ();
	
	var content = new Array ();
	
	// CUSTOMER
	if (attributes.customer)
	{
		content.customerid = attributes.customer.id;
	}
	else if (attributes.customerId)
	{
		content.customerid = attributes.customerId;
	}
	
	// AUCTION
	if (attributes.auction)
	{
		content.auctionid = attributes.auction.id;
	}
	else if (attributes.auctionId)
	{
		content.auctionId = attributes.auctionId;
	}
	
	if (attributes.async)
	{
		var onDone = 	function (respons)
						{
							attributes.onDone (respons["didius.invoices"]);
						};
		
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Invoice.List", "data", "POST", true);
		request.onLoaded (onDone);
		request.send (content);
	}
	else
	{
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Invoice.List", "data", "POST", false);		
		request.send (content);

		return request.respons ()["didius.invoices"];		
	}
}	




