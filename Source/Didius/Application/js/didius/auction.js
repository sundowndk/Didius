create : function ()
{
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Auction.Create", "data", "POST", false);	
	request.send ();
	
	var result = request.respons ()["didius.auction"];
	
	return result;
},
	
load : function (id)
{
	var content = new Array ();
	content["id"] = id;

	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Auction.Load", "data", "POST", false);		
	request.send (content);

	var result = request.respons ()["didius.auction"];
	
	if (!didius.runtime.browserMode)			
		app.events.onAuctionLoad.execute (result);

	return result;
},
		
save : function (auction)
{		
	var content = new Array ();
	content["didius.auction"] = auction;
								
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Auction.Save", "data", "POST", false);	
	request.send (content);
	
	if (!didius.runtime.browserMode)			
		app.events.onAuctionSave.execute (auction);
},		

destroy : function (id)
{
	var content = new Array ();
	content["id"] = id;
	
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Auction.Destroy", "data", "POST", false);	
	request.send (content);
	
	if (!didius.runtime.browserMode)
	{
		var data = {};
		data.id = id;
	
		app.events.onAuctionDestroy.execute (data);
	}
},				
		
list : function (attributes)
{
	if (!attributes) attributes = new Array ();
	
	if (attributes.async)
	{
		var onDone = 	function (respons)
						{
							attributes.onDone (respons["didius.auctions"]);
						};
			
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Auction.List", "data", "POST", true);
		request.onLoaded (onDone);
		request.send ();						
	}
	else
	{
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Auction.List", "data", "POST", false);		
		request.send ();

		return request.respons ()["didius.auctions"];		
	}
}	



