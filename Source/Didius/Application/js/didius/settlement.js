create : function (Case, simulate)
{
	var content = new Array ();
	content.caseid = Case.id;
	
	if (simulate != null)
	{
		content.simulate = simulate;
	}
	else
	{
		content.simulate = false;
	}

	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Settlement.Create", "data", "POST", false);	
	request.send (content);
	
	var result = request.respons ()["didius.settlement"];
	
//	app.events.onSettlementCreate.execute (result);
	
	return result;
},
	
load : function (attributes)
{
	var content = new Array ();
	if (attributes.id)
		content.id = attributes.id;
	
	if (attributes.case)
		content.caseid = attributes.case.id;
		
	if (attributes.caseId)
		content.caseid = attributes.caseId;

	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Settlement.Load", "data", "POST", false);		
	request.send (content);

	var result = request.respons ()["didius.settlement"];
	
//	app.events.onSettlementLoad.execute (result);

	return result;
},
				
list : function (attributes)
{
	if (!attributes) attributes = new Array ();
	
	var content = new Array ();
	
	// CUSTOMER
	if (attributes.customer)
	{
		content.customerid = attributes.customer.id;
	}
	else if (attributes.customerId)
	{
		content.customerid = attributes.customerId;
	}
	
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
							attributes.onDone (respons["didius.settlements"]);
						};
		
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Settlement.List", "data", "POST", true);
		request.onLoaded (onDone);
		request.send (content);
	}
	else
	{
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Settlement.List", "data", "POST", false);		
		request.send (content);

		return request.respons ()["didius.settlements"];		
	}
}	



