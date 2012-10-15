create : function (customer, item, amount)
{	
	var content = new Array ();
	content.customerid = customer.id;
	content.itemid = item.id;
	content.amount = amount;

	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Bid.Create", "data", "POST", false);	
	request.send (content);
	
	var result = request.respons ()["didius.bid"];
	
	app.events.onBidCreate.execute (result);
	
	return result;
},
	
load : function (id)
{
	var content = new Array ();
	content.id = id;

	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Bid.Load", "data", "POST", false);		
	request.send (content);

	var result = request.respons ()["didius.bid"];
	
	app.events.onBidLoad.execute (result);

	return result;
},
		
save : function (bid)
{	
	var content = new Array ();
	content["didius.bid"] = bid;
								
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Bid.Save", "data", "POST", false);	
	request.send (content);

	app.events.onBidSave.execute (bid);
},		

destroy : function (id)
{
	var content = new Array ();
	content.id = id;

	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Bid.Destroy", "data", "POST", false);	
	request.send (content);
	
	var data = {}
	data.id = id;
			
	app.events.onBidDestroy.execute (data);
},				
		
list : function (attributes)
{
	if (!attributes) attributes = new Array ();
	
	var content = new Array ();
	
	// ITEM
	if (attributes.item)
	{
		content.itemid = attributes.item.id;
	}	
	
	// CUSTOMER
	if (attributes.customer)
	{
		content.customerid = attributes.customer.id;
	}	
	
	if (attributes.async)
	{
		var onDone = 	function (respons)
						{
							attributes.onDone (respons["didius.bids"]);
						};
		
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Bid.List", "data", "POST", true);
		request.onLoaded (onDone);
		request.send (content);
	}
	else
	{
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Bid.List", "data", "POST", false);		
		request.send (content);

		return request.respons ()["didius.bids"];
	}
}	



