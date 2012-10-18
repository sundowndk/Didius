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
	
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Helpers.IsCatalogNoTaken", "data", "POST", false);	
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
		
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Helpers.NewCatalogNo", "data", "POST", false);	
	request.send (content);
	
	return request.respons ()["value"];
},

parsePrintTemplate : function (data)
{
	var result = {};
			
	result.page = "";	
			
	data = data.split ("\n");
				
	var block = "";	
	for (idx in data)
	{
		// Remove comments.
		if (data[idx].substring(0,2) == "//")
		{					
			continue;
		}
				
		// If we are not in a block we can start a new at anytime.
		if (block == "")
		{
			switch (data[idx])
			{
				case "#BEGINSTYLES":
				{
					block = "styles";
					result.styles = "";
					continue;
				}
				
				case "#BEGINROW":
				{
					block = "row";
					result.row = "";
					continue;
				}							
				
				case "#BEGINTOTAL":
				{
					block = "total";
					result.total = "";
					continue;
				}							
				
				case "#BEGINDISCLAIMER":
				{
					block = "disclaimer";
					result.disclaimer = "";
					continue;
				}							
			}					
		}
		else
		{
			switch (data[idx])
			{
				case "#ENDSTYLES":
				{
					block = "";
					continue;
				}
				
				case "#ENDROW":
				{
					block = "";
					continue;
				}
				
				case "#ENDTOTAL":
				{
					block = "";
					continue;
				}
				
				case "#ENDDISCLAIMER":
				{
					block = "";
					continue;
				}
			}
		}
											
		switch (block)
		{
			case "":
			{
				result.page += data[idx] +"\n";
				break;
			}
			
			case "styles":
			{
				result.styles += data[idx] +"\n";
				break;
			}
			
			case "row":
			{
				result.row += data[idx] +"\n";
				break;
			}
			
			case "total":
			{
				result.total += data[idx] +"\n";
				break;
			}
			
			case "disclaimer":
			{
				result.disclaimer += data[idx] +"\n";
				break;
			}
		}				
	}
	
	return result;
}


