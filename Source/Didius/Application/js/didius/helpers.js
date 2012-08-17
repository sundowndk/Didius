isCatalogNoTaken : function (attributes)
{
	var content = new Array ();
	
	if (attributes.auction)
	{
		content["auctionid"] = attributes.auction.id;
	}
	else if (attributes.auctionid)
	{
		content["auctionid"] = attributes.auctionId;
	}
	else
	{
		throw "didius.helpers.isCatalogNoTaken - missing auction or auctionId attribute.";
	}
	
	if (attributes.catalogNo)
	{
		content["catalogno"] = attributes.catalogNo;
	}
	else	
	{
		throw "didius.helpers.isCatalogNoTaken - missing catalogNo attribute.";
	}
	
	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Helpers.IsCatalogNoTaken", "data", "POST", false);	
	request.send (content);
	
	return request.respons ()["value"];
},

newCatalogNo : function (attributes)
{
	var content = new Array ();
	
	if (attributes.auction)
	{
		content["auctionid"] = attributes.auction.id;
	}
	else if (attributes.auctionid)
	{
		content["auctionid"] = attributes.auctionId;
	}
	else
	{
		throw "didius.helpers.isCatalogNoTaken - missing auction or auctionId attribute.";
	}
		
	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Helpers.NewCatalogNo", "data", "POST", false);	
	request.send (content);
	
	return request.respons ()["value"];
}


