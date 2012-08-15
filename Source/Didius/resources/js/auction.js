create : function ()
{
	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Auction.Create", "data", "POST", false);	
	request.send ();
	
	return request.respons ()["didius.auction"];
},
	
load : function (id)
{
	var content = new Array ();
	content["id"] = id;

	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Auction.Load", "data", "POST", false);		
	request.send (content);

	return request.respons ()["didius.auction"];
},
		
save : function (Auction)
{		
	var content = new Array ();
	content["didius.auction"] = Auction;
								
	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Auction.Save", "data", "POST", false);	
	request.send (content);
},		

destroy : function (id)
{
	var content = new Array ();
	content["id"] = id;
	
	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Auction.Destroy", "data", "POST", false);	
	request.send (content);
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
			
		var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Auction.List", "data", "POST", true);
		request.onLoaded (onDone);
		request.send ();						
	}
	else
	{
		var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Auction.List", "data", "POST", false);		
		request.send ();

		return request.respons ()["didius.auctions"];		
	}
}	



