create : function (Case)
{
	var content = new Array ();
	content.caseid = Case.id;

	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Item.Create", "data", "POST", false);	
	request.send (content);
	
	return request.respons ()["didius.item"];
},
	
load : function (id)
{
	var content = new Array ();
	content.id = id;

	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Item.Load", "data", "POST", false);		
	request.send (content);

	return request.respons ()["didius.item"];
},
		
save : function (Item)
{	
	var content = new Array ();
	content["didius.item"] = Item;
								
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Item.Save", "data", "POST", false);	
	request.send (content);

	return true;
},		

destroy : function (id)
{
	var content = new Array ();
	content.id = id;

	try
	{
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Item.Destroy", "data", "POST", false);	
		request.send (content);
	}
	catch (error)
	{						
		return [false, error];
	}
			
	return true;
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
		content.auctionId = attributes.auctionId;
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



