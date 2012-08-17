create : function (Auction, Customer)
{
	var content = new Array ();
	content.customerid = Customer.id;
	content.auctionid = Auction.id;

	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Case.Create", "data", "POST", false);	
	request.send (content);
	
	return request.respons ()["didius.case"];
},
	
load : function (id)
{
	var content = new Array ();
	content.id = id;

	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Case.Load", "data", "POST", false);		
	request.send (content);

	return request.respons ()["didius.case"];
},
		
save : function (template)
{	
	var content = new Array ();
	content["didius.case"] = template;
								
	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Case.Save", "data", "POST", false);	
	request.send (content);
},		

destroy : function (id)
{
	var content = new Array ();
	content.id = id;

	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Case.Destroy", "data", "POST", false);	
	request.send (content);				
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
		
		var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Case.List", "data", "POST", true);
		request.onLoaded (onDone);
		request.send (content);
	}
	else
	{
		var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Case.List", "data", "POST", false);		
		request.send (content);

		return request.respons ()["didius.cases"];		
	}
}	



