create : function (Case)
{
	var content = new Array ();
	content.caseid = Case.id;

	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Item.Create", "data", "POST", false);	
	request.send (content);
	
	var result = request.respons ()["didius.item"];
	
	app.events.onItemCreate.execute (result);
	
	return result;
},
	
load : function (id)
{
	var content = new Array ();
	content.id = id;

	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Item.Load", "data", "POST", false);		
	request.send (content);

	var result = request.respons ()["didius.item"];
	
	app.events.onItemLoad.execute (result);

	return result;
},
		
save : function (item)
{	
	var content = new Array ();
	content["didius.item"] = item;
								
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Item.Save", "data", "POST", false);	
	request.send (content);

	app.events.onItemSave.execute (item);
},		

destroy : function (id)
{
	var content = new Array ();
	content.id = id;

	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Item.Destroy", "data", "POST", false);	
	request.send (content);
	
	var data = {}
	data.id = id;
			
	app.events.onItemDestroy.execute (data);
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



