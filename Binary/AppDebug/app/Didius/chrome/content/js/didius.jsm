var EXPORTED_SYMBOLS = ["didius"];
// ---------------------------------------------------------------------------------------------------------------
// PROJECT: didius
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// CLASS: didius
// ---------------------------------------------------------------------------------------------------------------
var didius =
{
	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: runtime
	// ---------------------------------------------------------------------------------------------------------------
	runtime :
	{
		ajaxUrl1 : "http://sorentotest.sundown.dk/",
		ajaxUrl : "http://78.109.223.248/",
		
		initialize : function ()
		{
			app.events.onCustomerCreate = new sXUL.event ({id: "onCustomerCreate", remotePropagation: true});
			app.events.onCustomerLoad = new sXUL.event ({id: "onCustomerLoad", remotePropagation: true});
			app.events.onCustomerSave = new sXUL.event ({id: "onCustomerSave", remotePropagation: true});
			app.events.onCustomerDestroy = new sXUL.event ({id: "onCustomerDestroy", remotePropagation: true});
			
			app.events.onAuctionCreate = new sXUL.event ({id: "onAuctionCreate", remotePropagation: true});
			app.events.onAuctionLoad = new sXUL.event ({id: "onAuctionLoad", remotePropagation: true});
			app.events.onAuctionSave = new sXUL.event ({id: "onAuctionSave", remotePropagation: true});
			app.events.onAuctionDestroy = new sXUL.event ({id: "onAuctionDestroy", remotePropagation: true});
			
			app.events.onCaseCreate = new sXUL.event ({id: "onCaseCreate", remotePropagation: true});
			app.events.onCaseLoad = new sXUL.event ({id: "onCaseLoad", remotePropagation: true});
			app.events.onCaseSave = new sXUL.event ({id: "onCaseSave", remotePropagation: true});
			app.events.onCaseDestroy = new sXUL.event ({id: "onCaseDestroy", remotePropagation: true});
			
			app.events.onItemCreate = new sXUL.event ({id: "onItemCreate", remotePropagation: true});
			app.events.onItemLoad = new sXUL.event ({id: "onItemLoad", remotePropagation: true});
			app.events.onItemSave = new sXUL.event ({id: "onItemSave", remotePropagation: true});
			app.events.onItemDestory = new sXUL.event ({id: "onItemDestroy", remotePropagation: true});
			
			app.events.onBidCreate = new sXUL.event ({id: "onBidCreate", remotePropagation: true});
			app.events.onBidLoad = new sXUL.event ({id: "onBidLoad", remotePropagation: true});
			app.events.onBidSave = new sXUL.event ({id: "onBidSave", remotePropagation: true});
			app.events.onBidDestroy = new sXUL.event ({id: "onBidDestroy", remotePropagation: true});
			
			app.events.onSettlementCreate = new sXUL.event ({id: "onSettlementCreate", remotePropagation: true});
			app.events.onSettlementLoad = new sXUL.event ({id: "onSettlementLoad", remotePropagation: true});
			
			app.events.onInvoiceCreate = new sXUL.event ({id: "onInvoiceCreate", remotePropagation: true});
			app.events.onInvoiceLoad = new sXUL.event ({id: "onInvoiceLoad", remotePropagation: true});
			
			app.events.onUserCreate = new sXUL.event ({id: "onUserCreate", remotePropagation: true});
			app.events.onUserLoad = new sXUL.event ({id: "onUserLoad", remotePropagation: true});
			app.events.onUserSave = new sXUL.event ({id: "onUserSave", remotePropagation: true});
			app.events.onUserDestroy = new sXUL.event ({id: "onUserDestroy", remotePropagation: true});			
			
			app.events.onAuctionControl = new sXUL.event ({id: "onAuctionControl", remotePropagation: true});
		}
		
		
		
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: customer
	// ---------------------------------------------------------------------------------------------------------------
	customer :
	{
		create : function ()
		{
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Customer.Create", "data", "POST", false);	
			request.send ();
			
			var result = request.respons ()["didius.customer"];
				
			app.events.onCustomerCreate.execute (result);
			
			return result;
		},
			
		load : function (id)
		{
			var content = new Array ();
			content["id"] = id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Customer.Load", "data", "POST", false);		
			request.send (content);
		
			var result = request.respons ()["didius.customer"];
			
			app.events.onCustomerLoad.execute (result);
		
			return result;
		},
				
		save : function (customer)
		{	
			var content = new Array ();
			content["didius.customer"] = customer;
										
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Customer.Save", "data", "POST", false);		
			request.send (content);
			
			app.events.onCustomerSave.execute (customer);
		},		
		
		destroy : function (id)
		{	
			var content = new Array ();
			content["id"] = id;
			
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Customer.Destroy", "data", "POST", false);	
			request.send (content);
			
			var data = {};
			data.id = id;
			
			app.events.onCustomerDestroy.execute (data);
		},				
				
		list : function (attributes)
		{
			if (!attributes) attributes = new Array ();
			
			var content = new Array ();
			
			if (attributes.customergroup)
			{
				content.customergroupid = attributes.customergroup.id;
			}
				
			if (attributes.async)
			{
				var onDone = 	function (respons)
								{
									attributes.onDone (respons["didius.customers"]);
								};
				
				var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Customer.List", "data", "POST", true);
				request.onLoaded (onDone);
				request.send ();						
			}
			else
			{
				var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Customer.List", "data", "POST", false);		
				request.send ();
		
				return request.respons ()["didius.customers"];		
			}
		}	
		
		
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: customergroup
	// ---------------------------------------------------------------------------------------------------------------
	customergroup :
	{
		create : function ()
		{
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.CustomerGroup.Create", "data", "POST", false);	
			request.send ();
			
			return request.respons ()["didius.customergroup"];
		},
			
		load : function (id)
		{
			var content = new Array ();
			content["id"] = id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.CustomerGroup.Load", "data", "POST", false);		
			request.send (content);
		
			return request.respons ()["didius.customergroup"];
		},
				
		save : function (CustomerGroup)
		{	
			var content = new Array ();
			content["didius.customergroup"] = CustomerGroup;
										
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.CustomerGroup.Save", "data", "POST", false);	
			request.send (content);
		
			return true;
		},		
		
		destroy : function (id)
		{
			var content = new Array ();
			content["id"] = id;
		
			try
			{
				var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.CustomerGroup.Destroy", "data", "POST", false);	
				request.send (content);
			}
			catch (error)
			{						
				return [false, error.split ("|")];
			}
					
			return [true];
		},				
				
		list : function (attributes)
		{
			if (!attributes) attributes = new Array ();
			
			if (attributes.async)
			{
				var onDone = 	function (respons)
								{
									attributes.onDone (respons["didius.customergroups"]);
								};		
			
				var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.CustomerGroup.List", "data", "POST", true);
				request.onLoaded (onDone);
				request.send ();						
			}
			else
			{
				var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.CustomerGroup.List", "data", "POST", false);		
				request.send ();
		
				return request.respons ()["didius.customergroups"];		
			}
		}	
		
		
		
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: case
	// ---------------------------------------------------------------------------------------------------------------
	case :
	{
		create : function (Auction, Customer)
		{
			var content = new Array ();
			content.customerid = Customer.id;
			content.auctionid = Auction.id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Case.Create", "data", "POST", false);	
			request.send (content);
			
			var result = request.respons ()["didius.case"];
			
			app.events.onCaseCreate.execute (result);
			
			return result;
		},
			
		load : function (id)
		{
			var content = new Array ();
			content.id = id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Case.Load", "data", "POST", false);		
			request.send (content);
		
			var result = request.respons ()["didius.case"];
			
			app.events.onCaseLoad.execute (result); 
		
			return result;
		},
				
		save : function (case_)
		{	
			var content = new Array ();
			content["didius.case"] = case_;
										
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Case.Save", "data", "POST", false);	
			request.send (content);
			
			app.events.onCaseSave.execute (case_);
		},		
		
		destroy : function (id)
		{
			var content = new Array ();
			content.id = id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Case.Destroy", "data", "POST", false);	
			request.send (content);				
			
			var data = {};
			data.id = id;
			
			app.events.onCaseDestroy.execute (data);
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
		
		
		
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: item
	// ---------------------------------------------------------------------------------------------------------------
	item :
	{
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
		
		
		
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: bid
	// ---------------------------------------------------------------------------------------------------------------
	bid :
	{
		create : function (customer, item, amount)
		{	
			var content = new Array ();
			content.customerid = customer.id;
			content.itemid = item.id;
			content.amount = amount;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Bid.Create", "data", "POST", false);	
			request.send (content);
			
			var result = request.respons ()["didius.bid"];
			
			app.events.onBidCreate.execute (result);
			
			return result;
		},
			
		load : function (id)
		{
			var content = new Array ();
			content.id = id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Bid.Load", "data", "POST", false);		
			request.send (content);
		
			var result = request.respons ()["didius.bid"];
			
			app.events.onBidLoad.execute (result);
		
			return result;
		},
				
		save : function (bid)
		{	
			var content = new Array ();
			content["didius.bid"] = bid;
										
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Bid.Save", "data", "POST", false);	
			request.send (content);
		
			app.events.onBidSave.execute (bid);
		},		
		
		destroy : function (id)
		{
			var content = new Array ();
			content.id = id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Bid.Destroy", "data", "POST", false);	
			request.send (content);
			
			var data = {}
			data.id = id;
					
			app.events.onBidDestroy.execute (data);
		},				
				
		list : function (attributes)
		{
			if (!attributes) attributes = new Array ();
			
			var content = new Array ();
			
			// ITEM
			if (attributes.item)
			{
				content.itemid = attributes.item.id;
			}		
			
			// CUSTOMER
			if (attributes.customer)
			{
				content.customerid = attributes.customer.id;
			}	
			
			if (attributes.async)
			{
				var onDone = 	function (respons)
								{
									attributes.onDone (respons["didius.bids"]);
								};
				
				var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Bid.List", "data", "POST", true);
				request.onLoaded (onDone);
				request.send (content);
			}
			else
			{
				var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Bid.List", "data", "POST", false);		
				request.send (content);
		
				return request.respons ()["didius.bids"];
			}
		}	
		
		
		
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: auction
	// ---------------------------------------------------------------------------------------------------------------
	auction :
	{
		create : function ()
		{
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Auction.Create", "data", "POST", false);	
			request.send ();
			
			var result = request.respons ()["didius.auction"];
			
			app.events.onAuctionCreate.execute (result);
			
			return result;
		},
			
		load : function (id)
		{
			var content = new Array ();
			content["id"] = id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Auction.Load", "data", "POST", false);		
			request.send (content);
		
			var result = request.respons ()["didius.auction"];
			
			app.events.onAuctionLoad.execute (result);
		
			return result;
		},
				
		save : function (auction)
		{		
			var content = new Array ();
			content["didius.auction"] = auction;
										
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Auction.Save", "data", "POST", false);	
			request.send (content);
			
			app.events.onAuctionSave.execute (auction);
		},		
		
		destroy : function (id)
		{
			var content = new Array ();
			content["id"] = id;
			
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Auction.Destroy", "data", "POST", false);	
			request.send (content);
			
			var data = {};
			data.id = id;
			
			app.events.onAuctionDestroy.execute (data);
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
		
		
		
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: helpers
	// ---------------------------------------------------------------------------------------------------------------
	helpers :
	{
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
				}				
			}
			
			return result;
		}
		
		
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: user
	// ---------------------------------------------------------------------------------------------------------------
	user :
	{
		create : function (username)
		{
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=SorentoLib.User.New", "data", "POST", false);			
			
			var content = new Array ();
			content["username"] = username;	
			request.send (content);
			
			var result = request.respons ()["sorentolib.user"];
			
			app.events.onUserCreate.execute (result);
			
			return result;
		},
		
		load : function (id)
		{
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=SorentoLib.User.Load", "data", "POST", false);	
			
			var content = new Array ();
			content["id"] = id;
						
			request.send (content);
			
			var result = request.respons ()["sorentolib.user"];
			
			app.events.onUserLoad.execute (result);
			
			return result;
		},
		
		save : function (user)
		{
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=SorentoLib.User.Save", "data", "POST", false);				
			
			var content = new Array ();
			content["sorentolib.user"] = user;
				
			request.send (content);				
			
			app.events.onUserSave.execute (user);
		},
		
		delete : function (id)
		{
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=SorentoLib.User.Delete", "data", "POST", false);	
			
			var content = new Array ();
			content["id"] = id;
			
			request.send (content);		
			
			var data = {};
			data.id = id;
					
			app.events.onUserDestroy.execute (data)	
		},
		
		list : function (attributes)
		{	
			if (!attributes) 
				attributes = new Array ();
						
			if (attributes.async)
			{
				var onDone = 	function (respons)
								{
									attributes.onDone (respons["sorentolib.users"]);
								};
				
				var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=SorentoLib.User.List", "data", "POST", true);
				request.onLoaded (onDone);
				request.send ();						
			}
			else
			{
				var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=SorentoLib.User.List", "data", "POST", false);		
				request.send ();
		
				return request.respons ()["sorentolib.users"];		
			}
		},
		
		changePassword : function (userid, newPassword, oldPassword)
		{
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=SorentoLib.User.ChangePassword", "data", "POST", false);
			
			var content = new Array ();
			content["userid"] = userid;
			content["newpassword"] = newPassword;
			if (oldPassword != null)
			{
				content["oldpassword"] = oldPassword;
			}
				
			request.send (content);
			
			return request.respons ()["result"];	
		},
		
		isUsernameInUse : function (username, id)
		{
			var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=SorentoLib.User.IsUsernameInUse", "data", "POST", false);	
		
			var content = new Array ();	
			content['username'] = username;		
			if (id != null)
			{
				content['id'] = id;
			}
			
			request.send (content);
		
		 	return request.respons ()["result"];
		},
		
		isEmailInUse : function (email, id)
		{
			var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=SorentoLib.User.IsEmailInUse", "data", "POST", false);	
		
			var content = new Array ();
		
			content["email"] = email;
			if (id != null)
			{
				content["id"] = id;
			}
		
			request.send (content);
		
			return request.respons ()["result"];
		}		
		
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: session
	// ---------------------------------------------------------------------------------------------------------------
	session :
	{
		getCurrent : function ()
		{
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=SorentoLib.Session.GetCurrent", "data", "POST", false);
			request.send ();
		
			return request.respons ()["sorentolib.session"];
		},
		
		login : function (username, password)
		{
			var content = new Array ();
			content["username"] = username;
			content["password"] = password;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=SorentoLib.Session.Login", "data", "POST", false);				
			request.send (content);
		
			return request.respons ()["value"];
		},
		
		logout : function ()
		{
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=SorentoLib.Session.Logout", "data", "POST", false);				
			request.send ();
		
			return request.respons ();
		}		
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: settlement
	// ---------------------------------------------------------------------------------------------------------------
	settlement :
	{
		create : function (Case)
		{
			var content = new Array ();
			content.caseid = Case.id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Settlement.Create", "data", "POST", false);	
			request.send (content);
			
			var result = request.respons ()["didius.settlement"];
			
			app.events.onSettlementCreate.execute (result);
			
			return result;
		},
			
		load : function (id)
		{
			var content = new Array ();
			content.id = id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Settlement.Load", "data", "POST", false);		
			request.send (content);
		
			var result = request.respons ()["didius.settlement"];
			
			app.events.onSettlementLoad.execute (result);
		
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
		
		
		
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: invoice
	// ---------------------------------------------------------------------------------------------------------------
	invoice :
	{
		create : function (Auction, Customer)
		{
			var content = new Array ();
			content.auctionid = Auction.id;
			content.customerid = Customer.id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Invoice.Create", "data", "POST", false);	
			request.send (content);
			
			var result = request.respons ()["didius.invoice"];
			
			app.events.onInvoiceCreate.execute (result);
			
			return result;
		},
			
		load : function (id)
		{
			var content = new Array ();
			content.id = id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Invoice.Load", "data", "POST", false);		
			request.send (content);
		
			var result = request.respons ()["didius.invoice"];
			
			app.events.onInvoiceLoad.execute (result);
		
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
									attributes.onDone (respons["didius.invoices"]);
								};
				
				var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Invoice.List", "data", "POST", true);
				request.onLoaded (onDone);
				request.send (content);
			}
			else
			{
				var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Invoice.List", "data", "POST", false);		
				request.send (content);
		
				return request.respons ()["didius.invoices"];		
			}
		}	
		
		
		
	}
}

function event()
{
	this.eventHandlers = new Array ();
}

event.prototype.addHandler = function(eventHandler)
{
	this.eventHandlers.push(eventHandler);
}

event.prototype.execute = function(args)
{
	for(var i = 0; i < this.eventHandlers.length; i++)
	{
		this.eventHandlers[i](args);
	}
}



