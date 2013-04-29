create : function (attributes)
{
	var cmd = "cmd=Ajax;cmd.function=Didius.Case.Create";
	var content = new Array ();	

	if (attributes.customerId)
		content.customerid = attributes.customerId;	

	if (attributes.customer)
		content.customerid = attributes.customer.id;
		
	if (attributes.auctionId)
		content.auctionid = attributes.auctionId;	

	if (attributes.auction)
		content.auctionid = attributes.auction.id;			
		
	if (attributes.onDone != null)
	{
		var onDone = 	function (respons)
						{
							attributes.onDone (respons["didius.case"]);
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
	
		var result = request.respons ()["didius.case"];
		return result;
	}	
},
	
load : function (attributes)
{
	var cmd = "cmd=Ajax;cmd.function=Didius.Case.Load";
	
	var content = new Array ();
	content.id = attributes.id;

	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Case.Load", "data", "POST", false);		
	request.send (content);

	var result = request.respons ()["didius.case"];
	
//	if (!didius.runtime.browserMode)		
//		app.events.onCaseLoad.execute (result); 

	return result;
},
		
save : function (attributes)
{	
	var cmd = "cmd=Ajax;cmd.function=Didius.Case.Save";	
	var content = new Array ();
		
	content["didius.case"] = attributes.case;

	if (attributes.onDone != null)
	{
		var onDone = 	function ()
						{
							if (!didius.runtime.browserMode)	
								app.events.onCaseSave.execute (attributes.case);
						
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
			app.events.onCaseSave.execute (attributes.case);
	}	
},		

destroy : function (attributes)
{
	var cmd = "cmd=Ajax;cmd.function=Didius.Case.Destroy";
	var content = new Array ();
	
	content.id = attributes.id;
	
	if (attributes.onDone != null)
	{
		var onDone = 	function ()
						{
							if (!didius.runtime.browserMode)	
							{	
								var data = {};
								data.id = attributes.id;
								app.events.onCaseDestroy.execute (data);		
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
			var data = {};
			data.id = attributes.id;
			app.events.onCaseDestroy.execute (data);		
		}
	}				
},				
		
list : function (attributes)
{
	if (!attributes) attributes = new Array ();
	
	var content = new Array ();
	
	if (attributes.customerId)
	{
		content.customerid = attributes.customerId;
	}
	else if (attributes.customer)
	{
		content.customerid = attributes.customer.id;
	}
	
	if (attributes.auctionId)
	{
		content.auctionid = attributes.auctionId;
	}
	else if (attributes.auction)
	{
		content.auctionid = attributes.auction.id;
	}
	
	
	if (attributes.async)
	{
		var onDone = 	function (respons)
						{
							attributes.onDone (respons["didius.cases"]);
						};
		
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Case.List", "data", "POST", true);
		request.onLoaded (onDone);
		request.send (content);
	}
	else
	{
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Case.List", "data", "POST", false);		
		request.send (content);

		return request.respons ()["didius.cases"];		
	}
}	



