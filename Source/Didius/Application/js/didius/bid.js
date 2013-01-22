// ----------------------------------------------------------------------------------------------------------
// | CREATE																									|
// ----------------------------------------------------------------------------------------------------------
create : function (attributes)
{	
	var cmd = "cmd=Ajax;cmd.function=Didius.Bid.Create";

	var content = new Array ();
	content.customerid = attributes.customer.id;
	content.itemid = attributes.item.id;
	content.amount = attributes.amount;
	
	if (attributes.onDone != null)
	{
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, cmd, "data", "POST", true);	
		
		var onDone = 	function (respons)
						{
//							app.events.onBidLoad.execute (respons["didius.bid"]);
							attributes.onDone (respons["didius.bid"]);
						};
						
		var onError = 	function (exception)
						{
							attributes.onError (exception);
						};
			
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, cmd, "data", "POST", true);		
		request.onLoaded (onDone);
		request.onError (onError);
		request.send (content);	
	}
	else
	{
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, cmd, "data", "POST", false);	
		request.send (content);	
		
		var result = request.respons ()["didius.bid"];
//		app.events.onBidCreate.execute (result);
		return result;
	}
},
	
// ----------------------------------------------------------------------------------------------------------
// | LOAD																									|
// ----------------------------------------------------------------------------------------------------------
load : function (attributes)
{
	var cmd = "cmd=Ajax;cmd.function=Didius.Bid.Load";

	var content = new Array ();
	content.id = attributes.id;
	
	if (attributes.onDone != null)
	{	
		var onDone = 	function (respons)
						{
//							app.events.onBidLoad.execute (respons["didius.bid"]);
							attributes.onDone (respons["didius.bid"]);
						};
						
		var onError = 	function (exception)
						{
							attributes.onError (exception);
						};
			
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, cmd, "data", "POST", true);		
		request.onLoaded (onDone);
		request.onError (onError);
		request.send (content);	
	}
	else
	{
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, cmd, "data", "POST", false);
		request.send (content);
		
		var result = request.respons ()["didius.bid"];
//		app.events.onBidLoad.execute (result);
		return result;
	}
},
		
// ----------------------------------------------------------------------------------------------------------
// | SAVE																									|
// ----------------------------------------------------------------------------------------------------------		
save : function (attributes)
{	
	var cmd = "cmd=Ajax;cmd.function=Didius.Bid.Save";

	var content = new Array ();
	content["didius.bid"] = attributes.bid;
								
	if (attributes.onDone != null)
	{	
		var onDone = 	function (respons)
						{
//							app.events.onBidSave.execute (attributes.bid);						
							attributes.onDone ();
						};
						
		var onError = 	function (exception)
						{
							attributes.onError (exception);
						};
	
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, cmd, "data", "POST", true);		
		request.onLoaded (onDone);
		request.onError (onError);
		request.send (content);	
	}
	else	
	{
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, cmd, "data", "POST", false);	
		request.send (content);
//		app.events.onBidSave.execute (attributes.bid);
	}		
},		

// ----------------------------------------------------------------------------------------------------------
// | DESTROY																								|
// ----------------------------------------------------------------------------------------------------------
destroy : function (attributes)
{
	var cmd = "cmd=Ajax;cmd.function=Didius.Bid.Destroy";

	var content = new Array ();
	content.id = attributes.id;

	if (attributes.onDone != null)
	{
		var onDone = 	function (respons)
						{
//							var data = {}
//							data.id = id;
//							app.events.onBidDestroy.execute (data);
						};
						
		var onError = 	function (exception)
						{
							attributes.onError (exception);
						};
			
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, cmd, "data", "POST", true);		
		request.onLoaded (onDone);
		request.onError (onError);
		request.send (content);	
	}
	else
	{
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, cmd , "data", "POST", false);	
		request.send (content);
		
//		var data = {}
//		data.id = id;
//		app.events.onBidDestroy.execute (data);
	}
},				
	
// ----------------------------------------------------------------------------------------------------------
// | LIST																									|
// ----------------------------------------------------------------------------------------------------------			
list : function (attributes)
{
	var cmd = "cmd=Ajax;cmd.function=Didius.Bid.List";

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
	
	if (attributes.onDone)
	{
		var onDone = 	function (respons)
						{
							attributes.onDone (respons["didius.bids"]);
						};
						
		var onError =	function (exception)
						{
							attributes.onError (exception);
						};
		
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, cmd, "data", "POST", true);
		request.onLoaded (onDone);
		request.onError (onError);
		request.send (content);
	}
	else
	{
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, cmd, "data", "POST", false);		
		request.send (content);
		return request.respons ()["didius.bids"];
	}
}	



