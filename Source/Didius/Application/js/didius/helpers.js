bugReport : function (attributes)
{
	var content = new Array ();	
	content.sender = attributes.sender;
	content.description = attributes.description;
						
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Helpers.BugReport", "data", "POST", true);			
	request.send (content);		
},

mailBidWon : function (item)
{	
	var content = new Array ();	
	content.itemid = item.id;
						
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Helpers.MailBidWon", "data", "POST", true);			
	request.send (content);		
},

sendSMS : function (attributes)
{
	var cmd = "cmd=Ajax;cmd.function=Didius.Helpers.SendSMS";

	var content = new Array ();
	
	if (attributes.message)
		content.message = attributes.message
		
	if (attributes.onDone != null)
	{
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, cmd, "data", "POST", true);	
		
		var onDone = 	function (respons)
						{
							attributes.onDone ();
						};
						
		var onError = 	function (exception)
						{
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
	}

},

createTurnoverReport : function (attributes)
{
	var cmd = "cmd=Ajax;cmd.function=Didius.Helpers.CreateTurnoverReport";

	var content = new Array ();
	
	if (attributes.auction)
		content.auctionid = attributes.auction.id;
		
	if (attributes.auctionId)
		content.auctionid = attributes.auctionId;
		
	if (attributes.onDone != null)
	{
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, cmd, "data", "POST", true);	
		
		var onDone = 	function (respons)
						{
							attributes.onDone (respons["didius.turnoverreport"]);
						};
						
		var onError = 	function (exception)
						{
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
		
		var result = request.respons ()["didius.turnoverreport"];
			
		return result;
	}
},

createProfile : function (name, address, postcode, city, phone, mobile, email, password, onDone)
{
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Helpers.CreateProfile", "data", "POST", true);			
	
	var content = new Array ();
	content["name"] = name;	
	content["address1"] = address;
	content["postcode"] = postcode;
	content["city"] = city;
	content["phone"] = phone;
	content["mobile"] = mobile;
	content["email"] = email;
	content["password"] = password;
	
	if (onDone != null)
	{	
		request.onLoaded (onDone);	
	}
	
	request.send (content);		
},

parseBuyerNos : function (buyerNos)
{
	var nos = buyerNos.split ("|");
	var result = {};
	for (var index in nos)
	{
		try
		{			
			if (nos[index].split (":")[1] != null)
			{		
				result[nos[index].split (":")[0]] = nos[index].split (":")[1];
			}
		}
		catch (exception)
		{		
			sXUL.console.log (exception);
		}
	}	
	return result;
},

verifyProfile : function (id, onDone)
{
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Helpers.VerifyProfile", "data", "POST", true);			
	
	var content = new Array ();
	content["id"] = id;		
	
	if (onDone != null)
	{	
		var test = function (respons)
		{
			onDone (respons ()["value"]);			
		}
	
		request.onLoaded (onDone);	
	}
	
	
	
	request.send (content);				
},

sendNewPassword : function (email)
{
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Helpers.SendNewPassword", "data", "POST", false);			
	
	var content = new Array ();
	content["email"] = email;		
	request.send (content);		
	
	return request.respons ()["value"];
},

sendConsignment : function (data)
{
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Helpers.SendConsignment", "data", "POST", false);			
	
	var content = new Array ();
	content["data"] = data;
	request.send (content);		
	
	return request.respons ()["value"];
},

isCatalogNoTaken : function (attributes)
{
	var content = new Array ();
	
	if (attributes.auction)
	{
		content["auctionid"] = attributes.auction.id;
	}
	else if (attributes.auctionId)
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
	else if (attributes.auctionId)
	{
		content["auctionid"] = attributes.auctionId;
	}
	else
	{
		throw "didius.helpers.isCatalogNoTaken - missing auction or auctionId attribute.";
	}
		
	if (attributes.minCatalogNo)
	{
		content["mincatalogno"] = attributes.minCatalogNo;
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
				
				case "#BEGINCONTENTTYPE1":
				{
					block = "contenttype1";
					result.contenttype1 = "";
					continue;
				}
				
				case "#BEGINCONTENTTYPE2":
				{
					block = "contenttype2";
					result.contenttype2 = "";
					continue;
				}
				
				case "#BEGINROW":
				{
					block = "row";
					result.row = "";
					continue;
				}							
				
				case "#BEGINHEADER":
				{
					block = "header";
					result.header = "";
					continue;
				}
				
				case "#BEGINFOOTER":
				{
					block = "footer";
					result.footer = "";
					continue;
				}
				
				case "#BEGINBUYERINFOROW":
				{
					block = "buyerinforow";
					result.buyerinforow = "";
					continue;
				}
				
				case "#BEGINBUYERITEMROW":
				{
					block = "buyeritemrow";
					result.buyeritemrow = "";
					continue;
				}
				
				case "#BEGINBUYERTOTALROW":
				{
					block = "buyertotalrow";
					result.buyertotalrow = "";
					continue;
				}
				
				case "#BEGINSELLERINFOROW":
				{
					block = "sellerinforow";
					result.sellerinforow = "";
					continue;
				}
				
				case "#BEGINSELLERITEMROW":
				{
					block = "selleritemrow";
					result.selleritemrow = "";
					continue;
				}
				
				case "#BEGINSELLERTOTALROW":
				{
					block = "sellertotalrow";
					result.sellertotalrow = "";
					continue;
				}
				
				case "#BEGINTOTALROW":
				{
					block = "totalrow";
					result.totalrow = "";
					continue;
				}
				
				case "#BEGINNOTSOLDROW":
				{
					block = "notsoldrow";
					result.notsoldrow = "";
					continue;
				}
				
				case "#BEGINTRANFER":
				{
					block = "transfer";
					result.transfer = "";
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
				
				case "#BEGINHASVATNO":
				{
					block = "hasvatno";
					result.hasvatno = "";
					continue;
				}							
				
				case "#BEGINAUCTIONINFO":
				{
					block = "auctioninfo";
					result.auctioninfo = "";
					continue;
				}
				
				case "#BEGINCUSTOMERINFOROW":
				{
					block = "customerinforow";
					result.customerinforow = "";
					continue;
				}
				
				case "#BEGINITEMLISTHEADERROW":
				{
					block = "itemlistheaderrow";
					result.itemlistheaderrow = "";
					continue;
				}
				
				case "#BEGINITEMLISTROW":
				{
					block = "itemlistrow";
					result.itemlistrow = "";
					continue;
				}
				
				case "#BEGINDISCLAIMERROW":
				{
					block = "disclaimerrow";
					result.disclaimerrow = "";
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
				
				case "#ENDHEADER":
				{
					block = "";
					continue;
				}
				
				case "#ENDFOOTER":
				{
					block = "";
					continue;
				}
				
				case "#ENDCONTENTTYPE1":
				{
					block = "";
					continue;
				}
				
				case "#ENDCONTENTTYPE2":
				{
					block = "";
					continue;
				}
				
				case "#ENDROW":
				{
					block = "";
					continue;
				}
				
				case "#ENDBUYERINFOROW":
				{
					block = "";
					continue;
				}
				
				case "#ENDBUYERITEMROW":
				{
					block = "";
					continue;
				}
				
				case "#ENDBUYERTOTALROW":
				{
					block = "";
					continue;
				}
				
				case "#ENDSELLERINFOROW":
				{
					block = "";
					continue;
				}
				
				case "#ENDSELLERITEMROW":
				{
					block = "";
					continue;
				}
				
				case "#ENDSELLERTOTALROW":
				{
					block = "";
					continue;
				}				
				
				case "#ENDTOTALROW":
				{
					block = "";
					continue;
				}				
				
				case "#ENDNOTSOLDROW":
				{
					block = "";
					continue;
				}				
				
				case "#ENDTRANSFER":
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
				
				case "#ENDHASVATNO":
				{
					block = "";
					continue;
				}
				
				case "#ENDAUCTIONINFO":
				{
					block = "";
					continue;
				}
				
				case "#ENDCUSTOMERINFOROW":
				{
					block = "";
					continue;
				}
				
				case "#ENDITEMLISTHEADERROW":
				{
					block = "";
					continue;
				}
				
				case "#ENDITEMLISTROW":
				{
					block = "";
					continue;
				}
				
				case "#ENDDISCLAIMERROW":
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
			
			case "header":
			{
				result.header += data[idx] +"\n";
				break;
			}
			
			case "footer":
			{
				result.footer += data[idx] +"\n";
				break;
			}
			
			case "contenttype1":
			{
				result.contenttype1 += data[idx] +"\n";
				break;
			}
			
			case "contenttype2":
			{
				result.contenttype2 += data[idx] +"\n";
				break;
			}
			
			case "row":
			{
				result.row += data[idx] +"\n";
				break;
			}
			
			case "buyerinforow":
			{
				result.buyerinforow += data[idx] +"\n";
				break;
			}
			
			case "buyeritemrow":
			{
				result.buyeritemrow += data[idx] +"\n";
				break;
			}
			
			case "buyertotalrow":
			{
				result.buyertotalrow += data[idx] +"\n";
				break;
			}
			
			case "sellerinforow":
			{
				result.sellerinforow += data[idx] +"\n";
				break;
			}
			
			case "selleritemrow":
			{
				result.selleritemrow += data[idx] +"\n";
				break;
			}
			
			case "sellertotalrow":
			{
				result.sellertotalrow += data[idx] +"\n";
				break;
			}
			
			case "totalrow":
			{
				result.totalrow += data[idx] +"\n";
				break;
			}
			
			case "notsoldrow":
			{
				result.notsoldrow += data[idx] +"\n";
				break;
			}
			
			case "transfer":
			{
				result.transfer += data[idx] +"\n";
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
			
			case "hasvatno":
			{
				result.hasvatno += data[idx] +"\n";
				break;
			}
			
			case "auctioninfo":
			{
				result.auctioninfo += data[idx] +"\n";
				break;
			}
			
			case "customerinforow":
			{
				result.customerinforow += data[idx] +"\n";
				break;
			}
			
			case "itemlistheaderrow":
			{
				result.itemlistheaderrow += data[idx] +"\n";
				break;
			}
			
			case "itemlistrow":
			{
				result.itemlistrow += data[idx] +"\n";
				break;
			}
			
			case "disclaimerrow":
			{
				result.disclaimerrow += data[idx] +"\n";
				break;
			}
		}				
	}
	
	return result;
}


