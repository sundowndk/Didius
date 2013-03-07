// ----------------------------------------------------------------------------------------------------------
// | LOAD																									|
// ----------------------------------------------------------------------------------------------------------
load : function (attributes)
{
	var cmd = "cmd=Ajax;cmd.function=Didius.AutoBid.Load";

	var content = new Array ();
	content.id = attributes.id;
	
	if (attributes.onDone != null)
	{	
		var onDone = 	function (respons)
						{
							attributes.onDone (respons["didius.autobid"]);
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
		
		var result = request.respons ()["didius.autobid"];
					
		return result;
	}
},
			
// ----------------------------------------------------------------------------------------------------------
// | LIST																									|
// ----------------------------------------------------------------------------------------------------------			
list : function (attributes)
{
	var cmd = "cmd=Ajax;cmd.function=Didius.AutoBid.List";

	var content = new Array ();
	
	// ITEM
	if (attributes.itemId)
	{
		content.itemid = attributes.itemId;
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
							attributes.onDone (respons["didius.autobids"]);
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
		return request.respons ()["didius.autobids"];
	}
}	



