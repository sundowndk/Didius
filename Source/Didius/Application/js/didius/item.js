create : function (attributes)	
{
	var cmd = "cmd=Ajax;cmd.function=Didius.Item.Create";
	var content = new Array ();
	
	if (attributes.caseId)
		content.caseid = attributes.caseId;
	
	if (attributes.case)
		content.caseid = attributes.case.id;
		
		

	if (attributes.onDone != null)
	{
		var onDone = 	function (respons)
						{
							attributes.onDone (respons["didius.item"]);
						};
						
		var onError = 	function (exception)
						{
							if (attributes.onError != null)							
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
	
		var result = request.respons ()["didius.item"];
		return result;
	}		
},
	
load : function (attributes)
{
	var cmd = "cmd=Ajax;cmd.function=Didius.Item.Load";
	var content = new Array ();
	content.id = attributes.id;
	
	if (attributes.onDone != null)
	{
		var onDone = 	function (respons)
						{
							if (!didius.runtime.browserMode)	
								app.events.onItemLoad.execute (respons["didius.item"]);
						
							attributes.onDone (respons["didius.item"]);
						};
						
		var onError = 	function (exception)
						{
							if (attributes.onError != null)							
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
	
		var result = request.respons ()["didius.item"];
		
		if (!didius.runtime.browserMode)	
			app.events.onItemLoad.execute (result);
		
		return result;
	}
},
		
save : function (attributes)
{	
	var cmd = "cmd=Ajax;cmd.function=Didius.Item.Save";
	var content = new Array ();
	
	content["didius.item"] = attributes.item;
	
	if (attributes.onDone != null)
	{
		var onDone = 	function (respons)
						{
							if (!didius.runtime.browserMode)	
								app.events.onItemSave.execute (respons["didius.item"]);
						
							attributes.onDone (respons["didius.item"]);
						};
						
		var onError = 	function (exception)
						{
							if (attributes.onError != null)							
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
		
		var result = request.respons ()["didius.item"];
															
		if (!didius.runtime.browserMode)	
		{		
			app.events.onItemSave.execute (result);
		}
		
	}									
},		

destroy : function (attributes)
{
	var cmd = "cmd=Ajax;cmd.function=Didius.Item.Destroy";
	var content = new Array ();
	
	content.id = attributes.id;
	
	if (attributes.onDone != null)
	{
		var onDone = 	function (respons)
						{
							if (!didius.runtime.browserMode)			
							{
								var data = {}
								data.id = attributes.id;	
								app.events.onItemDestroy.execute (data);
							}
						
							attributes.onDone ();
						};
						
		var onError = 	function (exception)
						{
							if (attributes.onError != null)							
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
				
		if (!didius.runtime.browserMode)			
		{
			var data = {}
			data.id = attributes.id;	
			app.events.onItemDestroy.execute (data);
		}				
	}					
},		

bid : function (item, amount, onDone)
{
	var content = new Array ();
	content.itemid = item.id;	
	
	if (amount != null)
	{
		content.amount = amount;	
	}
		
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Item.Bid", "data", "POST", true);		
	
	if (onDone != null)
	{	
		request.onLoaded (onDone);
	}
	
	request.send (content);
},		
		
list : function (attributes)
{
	if (!attributes) attributes = new Array ();
	
	var content = new Array ();
	
	// CASE
	if (attributes.case)
	{
		content.caseid = attributes.case.id;
	}
	else if (attributes.caseId)
	{
		content.caseid = attributes.caseId;
	}
	
	// AUCTION
	if (attributes.auction)
	{
		content.auctionid = attributes.auction.id;
	}
	else if (attributes.auctionId)
	{
		content.auctionid = attributes.auctionId;
	}
	
	if (attributes.async)
	{
		var onDone = 	function (respons)
						{
							attributes.onDone (respons["didius.items"]);
						};
		
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Item.List", "data", "POST", true);
		request.onLoaded (onDone);
		request.send (content);
	}
	else
	{
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Item.List", "data", "POST", false);		
		request.send (content);

		return request.respons ()["didius.items"];		
	}
}	



