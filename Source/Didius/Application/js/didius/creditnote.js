create : function (attributes)
{
	var content = new Array ();
			
	if (attributes.customerId)
		content.customerid = attributes.customerId;		
	
	if (attributes.customer)
		content.customerid = attributes.customer.id;
		
	if (attributes.customerId)
		content.customerid = attributes.customerId;		
	
	if (attributes.invoice)
		content.invoiceid = attributes.invoice.id;
		
	if (attributes.invoiceId)
		content.invoiceid = attributes.invoiceId;
		
	if (attributes.item)
		content.item = attributes.item;
		
	if (attributes.items)
		content.items = attributes.items;
		
	content.simulate = false;	
	
	if (attributes.simulate)
		content.simulate = attributes.simulate;
			
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Creditnote.Create", "data", "POST", false);	
	request.send (content);
	
	var result = request.respons ()["didius.creditnote"];
	
	if (!content.simulate)
	{
		if (!didius.runtime.browserMode)		
			app.events.onCreditnoteCreate.execute (result);
	}
	
	return result;
},
	
load : function (attributes)
{
	var content = new Array ();
	content.id = attributes.id;

	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Creditnote.Load", "data", "POST", false);
	request.send (content);

	var result = request.respons ()["didius.creditnote"];
	
	if (!didius.runtime.browserMode)		
		app.events.onCreditnoteLoad.execute (result);

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
			
	if (attributes.async)
	{
		var onDone = 	function (respons)
						{
							attributes.onDone (respons["didius.creditnotes"]);
						};
		
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Creditnote.List", "data", "POST", true);
		request.onLoaded (onDone);
		request.send (content);
	}
	else
	{
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Creditnote.List", "data", "POST", false);		
		request.send (content);

		return request.respons ()["didius.creditnotes"];		
	}
}	
