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
		browserMode: false,
		
		initialize : function ()
		{
			try
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
				app.events.onItemDestroy = new sXUL.event ({id: "onItemDestroy", remotePropagation: true});
			
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
				
				app.events.onNewsletterCreate = new sXUL.event ({id: "onNewsletterCreate", remotePropagation: true});
				app.events.onNewsletterLoad = new sXUL.event ({id: "onNewsletterLoad", remotePropagation: true});
				app.events.onNewsletterSave = new sXUL.event ({id: "onNewsletterSave", remotePropagation: true});
				app.events.onNewsletterDestroy = new sXUL.event ({id: "onNewsletterDestroy", remotePropagation: true});			
				
				app.events.onAuctionControl = new sXUL.event ({id: "onAuctionControl", remotePropagation: true});			
			}
			catch (exception)
			{	
			}
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
				
		//	if (!didius.runtime.browserMode)			
		//		app.events.onCustomerCreate.execute (result);
			
			return result;
		},
			
		load : function (id)
		{
			var content = new Array ();
			content["id"] = id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Customer.Load", "data", "POST", false);		
			request.send (content);
		
			var result = request.respons ()["didius.customer"];
			
		//	if (!didius.runtime.browserMode)		
		//		app.events.onCustomerLoad.execute (result);
		
			return result;
		},
				
		save : function (customer)
		{	
			var content = new Array ();
			content["didius.customer"] = customer;
										
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Customer.Save", "data", "POST", false);		
			request.send (content);
			
		//	if (!didius.runtime.browserMode)	
		//		app.events.onCustomerSave.execute (customer);
		},		
		
		destroy : function (id)
		{	
			var content = new Array ();
			content["id"] = id;
			
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Customer.Destroy", "data", "POST", false);	
			request.send (content);
			
			var data = {};
			data.id = id;
			
		//	if (!didius.runtime.browserMode)	
		//		app.events.onCustomerDestroy.execute (data);
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
									setTimeout (function () { attributes.onDone (respons["didius.customers"]) }, 1);
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
			
		//	app.events.onCaseCreate.execute (result);
			
			return result;
		},
			
		load : function (id)
		{
			var content = new Array ();
			content.id = id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Case.Load", "data", "POST", false);		
			request.send (content);
		
			var result = request.respons ()["didius.case"];
			
		//	app.events.onCaseLoad.execute (result); 
		
			return result;
		},
				
		save : function (case_)
		{	
			var content = new Array ();
			content["didius.case"] = case_;
										
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Case.Save", "data", "POST", false);	
			request.send (content);
			
		//	app.events.onCaseSave.execute (case_);
		},		
		
		destroy : function (id)
		{
			var content = new Array ();
			content.id = id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Case.Destroy", "data", "POST", false);	
			request.send (content);				
			
			var data = {};
			data.id = id;
			
		//	app.events.onCaseDestroy.execute (data);
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
			
		//	if (!didius.runtime.browserMode)	
		//		app.events.onItemCreate.execute (result);
			
			return result;
		},
			
		load : function (id)
		{
			var content = new Array ();
			content.id = id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Item.Load", "data", "POST", false);		
			request.send (content);
		
			var result = request.respons ()["didius.item"];
			
		//	if (!didius.runtime.browserMode)	
		//		app.events.onItemLoad.execute (result);
		
			return result;
		},
				
		save : function (item)
		{	
			var content = new Array ();
			content["didius.item"] = item;
										
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Item.Save", "data", "POST", false);	
			request.send (content);
		
		//	if (!didius.runtime.browserMode)	
		//		app.events.onItemSave.execute (item);
		},		
		
		destroy : function (id)
		{
			var content = new Array ();
			content.id = id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Item.Destroy", "data", "POST", false);	
			request.send (content);
			
			var data = {}
			data.id = id;
				
		//	if (!didius.runtime.browserMode)		
		//		app.events.onItemDestroy.execute (data);
		},		
		
		bid : function (item, amount, onDone)
		{
			var content = new Array ();
			content.itemid = item.id;	
			
			if (amount != null)
			{
				content.amount = amount;	
			}
				
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Item.Bid", "data", "POST", true);		
			
			if (onDone != null)
			{	
				request.onLoaded (onDone);
			}
			
			request.send (content);
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
			
		//	app.events.onBidCreate.execute (result);
			
			return result;
		},
			
		load : function (id)
		{
			var content = new Array ();
			content.id = id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Bid.Load", "data", "POST", false);		
			request.send (content);
		
			var result = request.respons ()["didius.bid"];
			
		//	app.events.onBidLoad.execute (result);
		
			return result;
		},
				
		save : function (bid)
		{	
			var content = new Array ();
			content["didius.bid"] = bid;
										
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Bid.Save", "data", "POST", false);	
			request.send (content);
		
		//	app.events.onBidSave.execute (bid);
		},		
		
		destroy : function (id)
		{
			var content = new Array ();
			content.id = id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Bid.Destroy", "data", "POST", false);	
			request.send (content);
			
			var data = {}
			data.id = id;
					
		//	app.events.onBidDestroy.execute (data);
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
			
		//	app.events.onAuctionCreate.execute (result);
			
			return result;
		},
			
		load : function (id)
		{
			var content = new Array ();
			content["id"] = id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Auction.Load", "data", "POST", false);		
			request.send (content);
		
			var result = request.respons ()["didius.auction"];
			
		//	app.events.onAuctionLoad.execute (result);
		
			return result;
		},
				
		save : function (auction)
		{		
			var content = new Array ();
			content["didius.auction"] = auction;
										
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Auction.Save", "data", "POST", false);	
			request.send (content);
			
		//	app.events.onAuctionSave.execute (auction);
		},		
		
		destroy : function (id)
		{
			var content = new Array ();
			content["id"] = id;
			
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Auction.Destroy", "data", "POST", false);	
			request.send (content);
			
			var data = {};
			data.id = id;
			
		//	app.events.onAuctionDestroy.execute (data);
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
		
		createProfile : function (name, email, onDone)
		{
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Helpers.CreateProfile", "data", "POST", true);			
			
			var content = new Array ();
			content["name"] = name;	
			content["email"] = email;
			
			if (onDone != null)
			{	
				request.onLoaded (onDone);	
			}
			
			request.send (content);		
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
						
						case "#BEGINHASVATNO":
						{
							block = "hasvatno";
							result.hasvatno = "";
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
						
						case "#ENDHASVATNO":
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
					
					case "hasvatno":
					{
						result.hasvatno += data[idx] +"\n";
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
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=SorentoLib.User.IsUsernameInUse", "data", "POST", false);	
		
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
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=SorentoLib.User.IsEmailInUse", "data", "POST", false);	
		
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
		
		
		
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: invoice
	// ---------------------------------------------------------------------------------------------------------------
	invoice :
	{
		create : function (attributes)
		{
			var content = new Array ();
			
			if (attributes.auctionId)
				content.auctionid = attributes.auctionId;
				
			if (attributes.auction)
				content.auctionid = attributes.auction.id;
				
			if (attributes.customerId)
				content.customerid = attributes.customerId;		
			
			if (attributes.customer)
				content.customerid = attributes.customer.id;
				
			content.simulate = false;	
			
			if (attributes.simulate)
				content.simulate = attributes.simulate;
					
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Invoice.Create", "data", "POST", false);	
			request.send (content);
			
			var result = request.respons ()["didius.invoice"];
			
		//	app.events.onInvoiceCreate.execute (result);
			
			return result;
		},
			
		load : function (id)
		{
			var content = new Array ();
			content.id = id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Invoice.Load", "data", "POST", false);		
			request.send (content);
		
			var result = request.respons ()["didius.invoice"];
			
		//	app.events.onInvoiceLoad.execute (result);
		
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
		
		
		
		
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: config
	// ---------------------------------------------------------------------------------------------------------------
	config :
	{
		load : function ()
		{
			var result = new Array ();
			
			result.companyname = sXUL.config.get ({key: "companyname"});
			result.companyaddress = sXUL.config.get ({key: "companyaddress"});
			result.companypostcode = sXUL.config.get ({key: "companypostcode"});
			result.companycity = sXUL.config.get ({key: "companycity"});
			result.companyphone = sXUL.config.get ({key: "companyphone"});
			result.companyemail = sXUL.config.get ({key: "companyemail"});
			
			result.auctiondescription = sXUL.config.get ({key: "auctiondescription"});
			
			result.commisionfeepercentage = sXUL.config.get ({key: "commisionfeepercentage"});
			result.commisionfeeminimum = sXUL.config.get ({key: "commisionfeeminimum"});		
					
			result.emailsender = sXUL.config.get ({key: "emailsender"});
			result.emailtextbidwon = sXUL.config.get ({key: "emailtextbidwon"});
			result.emailtextbidlost = sXUL.config.get ({key: "emailtextbidlost"});
			result.emailtextinvoice = sXUL.config.get ({key: "emailtextinvoice"});
			result.emailtextsettlement = sXUL.config.get ({key: "emailtextsettlement"});	
			
			return result;
		},
		
		save : function (config)
		{
			for (idx in config)
			{		
				sXUL.console.log (idx +" "+ config[idx])
			
				sXUL.config.set ({key: idx, value: config[idx]});
			}
		}
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: settings
	// ---------------------------------------------------------------------------------------------------------------
	settings :
	{
		set : function (attributes)
		{					
			var keys = new Array ();
			
			if (attributes.keys != null)
			{
				for (key in attributes.keys)
				{
					var index = keys.length;			
					keys[index] = {};
					keys[index].key = key;
					keys[index].value = attributes.keys[key];
				}
			}							
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=SorentoLib.Services.Settings.Set", "data", "POST", false);	
		
			var content = new Array ();
			content["settings"] = keys;
		
			request.send (content);
		
			return true;
		},
		
		get : function (attributes)
		{
			var keys = new Array ();							
			if (attributes.key != null)
			{
				keys[0] = {};
				keys[0].value = attributes.key;
			}
									
			if (attributes.keys != null)
			{
				for (key in attributes.keys)
				{
					var index = keys.length;
					keys[index] = {};
					keys[index].value = attributes.keys[key];									
				}							
			}											
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=SorentoLib.Services.Settings.Get", "data", "POST", false);	
		
			var content = new Array();	
			content["settings"] = keys;
					
			request.send (content);
								
			var settings = request.respons ()["settings"];	
			if (keys.length > 1)
			{
				var result = {};
				for (index in settings)
				{
					for (key in settings[index])
					{
						result[key] = settings[index][key];
					}
				}
				
				return result;
			}
			else	
			{	
				return settings[0][keys[0].value];
			}
		}
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: newsletter
	// ---------------------------------------------------------------------------------------------------------------
	newsletter :
	{
		create : function ()
		{	
			var content = new Array ();
				
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Newsletter.Create", "data", "POST", false);	
			request.send (content);
			
			var result = request.respons ()["didius.newsletter"];
			
			app.events.onNewsletterCreate.execute (result);
			
			return result;
		},
			
		load : function (id)
		{
			var content = new Array ();
			content.id = id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Newsletter.Load", "data", "POST", false);		
			request.send (content);
		
			var result = request.respons ()["didius.newsletter"];
			
			app.events.onNewsletterLoad.execute (result);
		
			return result;
		},
				
		save : function (newsletter)
		{	
			var content = new Array ();
			content["didius.newsletter"] = newsletter;
										
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Newsletter.Save", "data", "POST", false);	
			request.send (content);
		
			app.events.onNewsletterSave.execute (newsletter);
		},		
		
		destroy : function (id)
		{
			var content = new Array ();
			content.id = id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Newsletter.Destroy", "data", "POST", false);	
			request.send (content);
			
			var data = {}
			data.id = id;
					
			app.events.onNewsletterDestroy.execute (data);
		},				
				
		list : function (attributes)
		{
			if (!attributes) attributes = new Array ();
			
			var content = new Array ();
					
			if (attributes.async)
			{
				var onDone = 	function (respons)
								{
									attributes.onDone (respons["didius.newsletters"]);
								};
				
				var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Newsletter.List", "data", "POST", true);
				request.onLoaded (onDone);
				request.send (content);
			}
			else
			{
				var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Newsletter.List", "data", "POST", false);		
				request.send (content);
		
				return request.respons ()["didius.newsletters"];
			}
		}	
		
		
		
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: common
	// ---------------------------------------------------------------------------------------------------------------
	common :
	{
		// ---------------------------------------------------------------------------------------------------------------
		// CLASS: print
		// ---------------------------------------------------------------------------------------------------------------
		print :
		{
			invoice : function (attributes)
			{	
				var Cc = Components.classes;
				var Ci = Components.interfaces;
				var Cu = Components.utils;
				var Cr = Components.results;
			
				var render = 	function (attributes)
								{
									var template = didius.helpers.parsePrintTemplate (sXUL.tools.fileToString ("chrome://didius/content/templates/invoice.tpl"));										
									var print = app.mainWindow.document.createElement ("iframe");
									app.mainWindow.document.getElementById ("PrintHolder").appendChild (print);
															
									var pageCount = 1;				
									var totalSale = 0;
									var totalCommissionFee = 0;							
									var totalTotal = 0;																																								
																																																						
									var page = function (from)
									{
										// Add styles.																		
										var styles = print.contentDocument.createElement ("style");					
										print.contentDocument.body.appendChild (styles);					
										styles.innerHTML = template.styles;
								
										// Create page.				
										var page = print.contentDocument.createElement ("div");
										page.className = "Page A4";
										print.contentDocument.body.appendChild (page);
																													
										// Add content holder.																						
										var content = print.contentDocument.createElement ("div")
										content.className = "PrintContent";
										page.appendChild (content);
																								
										// Add inital content.
										var render = template.page.replace ("%%PAGENUMBER%%", pageCount++);					
										content.innerHTML = render;
									
										// Caluculate page maxheight for printing.										
										var maxHeight = page.offsetHeight 
										var maxHeight2 = page.offsetHeight;
																					
										// Calculate DISCLAIMER height.														
										// DISCLAIMER
										{										
											content.innerHTML = template.disclaimer;										
											maxHeight2 -= content.offsetHeight;
										}
										
										// TOTAL
										{
											content.innerHTML = template.total;					
											maxHeight2 -= content.offsetHeight;
										}
										
							//			sXUL.console.log ("maxHeight: "+ maxHeight);
							//			sXUL.console.log ("maxHeight2: "+ maxHeight2);			
										
										// CUSTOMERNAME
										{
											render = render.replace ("%%CUSTOMERNAME%%", attributes.invoice.customer.name);
											content.innerHTML = render;
										}
								
										// CUSTOMERADDRESS
										{
											var customeraddress = attributes.invoice.customer.address1;
											
											if (attributes.invoice.customer.address2 != "")
											{
												address += "<br>"+ attributes.invoice.customer.address2;
											}
										
											render = render.replace ("%%CUSTOMERADDRESS%%", customeraddress);
											content.innerHTML = render;
										}
										
										// POSTCODE
										{
											render = render.replace ("%%CUSTOMERPOSTCODE%%", attributes.invoice.customer.postcode);
											content.innerHTML = render;
										}
										
										// CUSTOMERCITY
										{
											render = render.replace ("%%CUSTOMERCITY%%", attributes.invoice.customer.city);
											content.innerHTML = render;
										}
										
										// CUSTOMERCOUNTRY
										{
											render = render.replace ("%%CUSTOMERCOUNTRY%%", attributes.invoice.customer.country);
											content.innerHTML = render;
										}
										
										// CUSTOMERNO
										{
											render = render.replace ("%%CUSTOMERNO%%", attributes.invoice.customer.no);
											content.innerHTML = render;
										}
										
										// CUSTOMERPHONE
										{
											render = render.replace ("%%CUSTOMERPHONE%%", attributes.invoice.customer.phone);
											content.innerHTML = render;
										}
										
										// CUSTOMEREMAIL
										{
											render = render.replace ("%%CUSTOMEREMAIL%%", attributes.invoice.customer.email);
											content.innerHTML = render;
										}
										
										// AUCTIONNO
										{
											render = render.replace ("%%AUCTIONNO%%", attributes.invoice.auction.no);
											content.innerHTML = render;
										}
										
										// AUCTIONTITLE
										{
											render = render.replace ("%%AUCTIONTITLE%%", attributes.invoice.auction.title);
											content.innerHTML = render;
										}
																
										// INVOICENO
										{
											render = render.replace ("%%INVOICENO%%", attributes.invoice.no);
											content.innerHTML = render;
										}
										
										// INVOICEDATE
										{
											render = render.replace ("%%INVOICEDATE%%", attributes.invoice.createtimestamp);
											content.innerHTML = render;
										}
										
										// CUSTOMERBANKACCOUNT
										{
											render = render.replace ("%%CUSTOMERBANKACCOUNT%%", attributes.invoice.customer.bankregistrationno +" "+ attributes.invoice.customer.bankaccountno);
											content.innerHTML = render;
										}
								
										// ROWS
										{
											// Add data rows.
											var rows = "";	
											var count = 0;
																	
											for (var idx = from; idx < attributes.invoice.items.length; idx++)
											{							
												var row = template.row;
												
												// CATALOGNO						
												{
													row = row.replace ("%%CATALOGNO%%", attributes.invoice.items[idx].catalogno);
												}			
											
												// DESCRIPTION
												{
													row = row.replace ("%%DESCRIPTION%%", attributes.invoice.items[idx].description);
												}		
											
												// BIDAMOUNT
												{
													row = row.replace ("%%BIDAMOUNT%%", attributes.invoice.items[idx].bidamount);
												}
											
												// COMMISSIONFEE
												{
													row = row.replace ("%%COMMISSIONFEE%%", attributes.invoice.items[idx].commissionfee);
												}					
			
												content.innerHTML = render.replace ("%%ROWS%%", rows + row);
																																		
												if (content.offsetHeight > (maxHeight2))
												{						
													render = render.replace ("%%ROWS%%", rows);															
													render = render.replace ("%%TRANSFER%%", template.transfer)						
													render = render.replace ("%%TOTAL%%", "");		
													render = render.replace ("%%DISCLAIMER%%", "");							
													content.innerHTML = render;
													break;	
												}
																									
												rows += row;																	
												count++;						
											}																		
											
											render = render.replace ("%%ROWS%%", rows);
											render = render.replace ("%%TRANSFER%%", "");
											
											content.innerHTML = render;
										}
										
										// TOTAL
										{
											render = render.replace ("%%TOTAL%%", template.total);
											render = render.replace ("%%TOTALSALE%%", parseInt (attributes.invoice.sales).toFixed (2));
											render = render.replace ("%%TOTALCOMMISSIONFEE%%", parseInt (attributes.invoice.commissionfee).toFixed (2));
											render = render.replace ("%%TOTALVAT%%", parseInt (attributes.invoice.vat).toFixed (2));
											render = render.replace ("%%TOTALTOTAL%%", parseInt (attributes.invoice.total).toFixed (2));
											content.innerHTML = render;
										}				
																		
										// DISCLAIMER
										{
											render = render.replace ("%%DISCLAIMER%%", template.disclaimer);
											content.innerHTML = render;
										}
										
										return count;				
									}
																																																					
									var c = page (0);
									while (c < attributes.invoice.items.length)
									{							
									 	c += page (c);				 				
									}	
							
									var result = print.contentDocument.body.innerHTML;
									
									app.mainWindow.document.getElementById ("PrintHolder").removeChild (print);
									
									return result;
								};
			
				var data = "";
																						
				if (attributes.invoice)
				{
					data = render ({invoice: attributes.invoice});
				}
				else if (attributes.invoices)
				{
					for (index in attributes.invoices)
					{
						data += render ({invoice: attributes.invoices[index]});
					}			
				}
				
				//var template = didius.helpers.parsePrintTemplate (sXUL.tools.fileToString ("chrome://didius/content/templates/invoice.tpl"));										
				var print = app.mainWindow.document.createElement ("iframe");
				app.mainWindow.document.getElementById ("PrintHolder").appendChild (print);
					
				print.contentDocument.body.innerHTML = data;
								
				var settings = PrintUtils.getPrintSettings ();
																																											
				settings.marginLeft = 0.5;
				settings.marginRight = 0.5;
				settings.marginTop = 0.5;
				settings.marginBottom = 0.0;
				settings.shrinkToFit = true;
					
				settings.paperName =  "iso_a4";
				settings.paperWidth = 210;
				settings.paperHeight = 297
				settings.paperSizeUnit = Ci.nsIPrintSettings.kPaperSizeMillimeters;
					
				if (attributes.mail) 
				{
					var localDir = sXUL.tools.getLocalDirectory ();
					//var filename = localDir.path + app.session.pathSeperator +"temp"+ app.session.pathSeperator + main.current.id;
					var filename = localDir.path + app.session.pathSeperator + main.current.id +".pdf";
					//var filename = "F:\\test.pdf";
								
			    	settings.printSilent = true;
			    	settings.showPrintProgress = false;
				    settings.printToFile = true;    		
					    		    		    		   
			    	//settings.printFrameType = 1;
			    		
			    	settings.outputFormat = 2;
			    		
					settings.printSilent = true;
			    	settings.showPrintProgress = false;
			    	settings.printBGImages = true;
			    	settings.printBGColors = true;
			    	settings.printToFile = true;
			    
			    	settings.printFrameType = Ci.nsIPrintSettings.kFramesAsIs;
			    	settings.outputFormat = Ci.nsIPrintSettings.kOutputFormatPDF;
			    
			    	settings.footerStrCenter = "";
			    	settings.footerStrLeft = "";
			    	settings.footerStrRight = "";
			    	settings.headerStrCenter = "";
			    	settings.headerStrLeft = "";
			    	settings.headerStrRight = "";
			    	settings.printBGColors = true;
			    	settings.title = "Didius Invoice";    		
			
					settings.toFileName = filename;
						
					sXUL.console.log (filename)
						
					var onDone =	function ()
									{
										var onLoad = 		function (respons)
															{														
																var respons = respons.replace ("\n","").split (":");
																							
																switch (respons[0].toLowerCase ())
																{
																	case "success":
																	{	
																		try
																		{
																			sXUL.tools.fileDelete (filename);
																		}
																		catch (e)
																		{
																			sXUL.console.log (e);
																		}
																																		
																		break;
																	}
												
																	default:
																	{
																		app.error ({errorCode: "APP00001"});																
																		break;
																	}							
																}
																	
																onDone ();
															};
								
										var onProgress =	function (event)
															{															
															};
										
										var onError =		function (event)
															{														
																app.error ({errorCode: "APP00001"});
																onDone ();
															};
																
										var onDone = 		function ()							
															{
																sXUL.console.log ("ondone");
																if (attributes.onDone != null)
																{
																	setTimeout (attributes.onDone, 1);
																}
															}
															
										var worker = function ()
										{																
											sXUL.tools.fileUpload ({postUrl: didius.runtime.ajaxUrl, fieldName: "file", filePath: filename, additionalFields: {cmd: "function", "cmd.function": "Didius.Helpers.MailInvoice", invoiceid: attributes.invoice.id, customerid: attributes.invoice.customerid, auctionid: attributes.invoice.auctionid}, onLoad: onLoad, onProgress: onProgress, onError: onError});
											//sXUL.tools.fileUpload ({postUrl: didius.runtime.ajaxUrl, fieldName: "file", filePath: filename, additionalFields: {cmd: "function", "cmd.function": "Didius.Helpers.MailInvoice", invoiceid: attributes.invoice.id}, onLoad: onLoad, onProgress: onProgress, onError: onError});
										}
										
										setTimeout (worker, 5000);																																
									};
						
					sXUL.tools.print (print.contentWindow, settings, onDone);
				}
				else
				{
					var onDone =	function ()
									{
										if (attributes.onDone != null)
										{
											setTimeout (attributes.onDone, 1);
										}
									};
				
					sXUL.tools.print (print.contentWindow, settings, onDone);				
				}		
			}
			,
		
			salesAgreement : function (attributes)		
			{					
				if (!attributes.case)
					throw "DIDIUS.COMMON.PRINT.SALESAGREEMENT.PRINT: No CASE given, cannot print nothing.";
			
				var Cc = Components.classes;
				var Ci = Components.interfaces;
				var Cu = Components.utils;
				var Cr = Components.results;
			
				// ------------------------------------------------------------------------------------------------------
				// | RENDER																								|	
				// ------------------------------------------------------------------------------------------------------
				var render = 	function (attributes)
								{
									var _case = attributes.case;						
									var auction = didius.auction.load (_case.auctionid);
									var customer = didius.customer.load (_case.customerid);
									
									var items = didius.item.list ({case: _case});
									SNDK.tools.sortArrayHash (items, "catalogno", "numeric");		
								
									var template = didius.helpers.parsePrintTemplate (didius.settings.get ({key: "didius_template_salesagreement"}));						
									var print = app.mainWindow.document.createElement ("iframe");
									app.mainWindow.document.getElementById ("PrintHolder").appendChild (print);
															
									var pageCount = 1;				
								
									var page = function (from)
									{
										// Add styles.																		
										var styles = print.contentDocument.createElement ("style");					
										print.contentDocument.body.appendChild (styles);					
										styles.innerHTML = template.styles;
								
										// Create page.				
										var page = print.contentDocument.createElement ("div");
										page.className = "Page A4";
										print.contentDocument.body.appendChild (page);
																													
										// Add content holder.																						
										var content = print.contentDocument.createElement ("div")
										content.className = "PrintContent";
										page.appendChild (content);
																								
										// Add inital content.
										var render = template.page.replace ("%%PAGENUMBER%%", pageCount++);					
										content.innerHTML = render;
									
										// Caluculate page maxheight for printing.										
										var maxHeight = page.offsetHeight 
										var maxHeight2 = page.offsetHeight;
										
										// CUSTOMERNAME
										{
											render = render.replace ("%%CUSTOMERNAME%%", customer.name);
											content.innerHTML = render;
										}
									
										// CUSTOMERADDRESS
										{
											var customeraddress = customer.address1;
										
											if (customer.address2 != "")
											{
												address += "<br>"+ customer.address2;
											}
									
											render = render.replace ("%%CUSTOMERADDRESS%%", customeraddress);
											content.innerHTML = render;
										}
						
										// POSTCODE
										{
											render = render.replace ("%%CUSTOMERPOSTCODE%%", customer.postcode);
											content.innerHTML = render;
										}
										
										// CUSTOMERCITY
										{
											render = render.replace ("%%CUSTOMERCITY%%", customer.city);
											content.innerHTML = render;
										}
										
										// CUSTOMERCOUNTRY
										{
											render = render.replace ("%%CUSTOMERCOUNTRY%%", customer.country);
											content.innerHTML = render;
										}
										
										// CUSTOMERNO
										{
											render = render.replace ("%%CUSTOMERNO%%", customer.no);
											content.innerHTML = render;
										}
							
										// CUSTOMERPHONE
										{
											render = render.replace ("%%CUSTOMERPHONE%%", customer.phone);
											content.innerHTML = render;
										}
									
										// CUSTOMEREMAIL
										{
											render = render.replace ("%%CUSTOMEREMAIL%%", customer.email);
											content.innerHTML = render;
										}
										
										// CASENO
										{
											render = render.replace ("%%CASENO%%", _case.no);
											content.innerHTML = render;
										}
										
										// CASETITLE
										{
											render = render.replace ("%%CASETITLE%%", _case.title);
											content.innerHTML = render;
										}
																	
										// ROWS
										{
											// Add data rows.
											var rows = "";	
											var count = 0;				
											for (var idx = from; idx < items.length; idx++)
											{							
												var row = template.row;
											
												// CATALOGNO						
												{
													row = row.replace ("%%CATALOGNO%%", items[idx].catalogno);
												}			
											
												// DESCRIPTION
												{
													row = row.replace ("%%DESCRIPTION%%", items[idx].description);
												}		
											
												// MINIMUMBID
												{
													row = row.replace ("%%MINIMUMBID%%", items[idx].minimumbid.toFixed (2));
												}											
			
												content.innerHTML = render.replace ("%%ROWS%%", rows + row);
																																		
												if (content.offsetHeight > (maxHeight2))
												{						
													render = render.replace ("%%ROWS%%", rows);															
													render = render.replace ("%%DISCLAIMER%%", "");							
													content.innerHTML = render;
													break;	
												}
																																
												rows += row;
																								
												count++;						
											}																		
											
											render = render.replace ("%%ROWS%%", rows);											
											content.innerHTML = render;
										}
																							
										return count;				
									}	
																					
									var c = 0;				
									while (c < items.length)
									{							
						 				c += page (c);				 				
									}			
									
									// DISCLAIMERPAGE
									{
										// Add styles.																		
										var styles = print.contentDocument.createElement ("style");					
										print.contentDocument.body.appendChild (styles);					
										styles.innerHTML = template.styles;
								
										// Create page.				
										var page = print.contentDocument.createElement ("div");
										page.className = "Page A4";
										print.contentDocument.body.appendChild (page);
																													
										// Add content holder.																						
										var content = print.contentDocument.createElement ("div")
										content.className = "PrintContent";
										page.appendChild (content);
																								
										// Add inital content.
										var render = template.disclaimer;
										content.innerHTML = render;
												
										// DISCLAIMER
										{				
											// CASECOMMISIONFEEPERCENTAGE
											{
												render = render.replace ("%%CASECOMMISIONFEEPERCENTAGE%%", _case.commisionfeepercentage);
											}
											
											// CASECOMMISIONFEEMINIMUM
											{
												render = render.replace ("%%CASECOMMISIONFEEMINIMUM%%", _case.commisionfeeminimum.toFixed (2));
											}
								
											// CUSTOMERBANKACCOUNT
											{
												render = render.replace ("%%CUSTOMERBANKACCOUNT%%", customer.bankregistrationno +" - "+ customer.bankaccountno);
												content.innerHTML = render;
											}		
											
											// CUSTOMERNAME
											{
												render = render.replace ("%%CUSTOMERNAME%%", customer.name);
												content.innerHTML = render;
											}
						
											// CUSTOMERADDRESS
											{
												var customeraddress = customer.address1;
											
												if (customer.address2 != "")
												{
													address += "<br>"+ customer.address2;
												}
										
												render = render.replace ("%%CUSTOMERADDRESS%%", customeraddress);
												content.innerHTML = render;
											}
										
											// POSTCODE
											{
												render = render.replace ("%%CUSTOMERPOSTCODE%%", customer.postcode);
												content.innerHTML = render;
											}
											
											// CUSTOMERCITY
											{
												render = render.replace ("%%CUSTOMERCITY%%", customer.city);
												content.innerHTML = render;
											}
											
											// CUSTOMERCOUNTRY
											{
												render = render.replace ("%%CUSTOMERCOUNTRY%%", customer.country);
												content.innerHTML = render;
											}											
							
											// AUCTIONLOCATION
											{
												render = render.replace ("%%AUCTIONLOCATION%%", auction.location);
												content.innerHTML = render;
											}			
											
											// AUCTIONBEGIN
											{
												var begin = new Date (Date.parse (auction.begin));													
												render = render.replace ("%%AUCTIONBEGIN%%", begin.getDate () +"-"+ (begin.getMonth () + 1)  +"-"+ begin.getFullYear ());
												content.innerHTML = render;
											}			
											
											// AUCTIONBEGINTIME
											{
												var begin = new Date (Date.parse (auction.begin));																							
												render = render.replace ("%%AUCTIONBEGINTIME%%", SNDK.tools.padLeft (begin.getHours (), 2, "0") +":"+ SNDK.tools.padLeft (begin.getMinutes (), 2, "0"));
												content.innerHTML = render;
											}			
											
											// AUCTIONDEADLINE
											{
												var deadline = new Date (Date.parse (auction.deadline));	
												render = render.replace ("%%AUCTIONDEADLINE%%", deadline.getDate () +"-"+ (deadline.getMonth () + 1) +"-"+ deadline.getFullYear ());
												content.innerHTML = render;
											}			
											
											// AUCTIONDEADLINETIME
											{
												var deadline = new Date (Date.parse (auction.deadline));													
												render = render.replace ("%%AUCTIONDEADLINETIME%%", SNDK.tools.padLeft (deadline.getHours (), 2, "0") +":"+ SNDK.tools.padLeft (deadline.getMinutes (), 2, "0"));
												content.innerHTML = render;
											}			
							
											// DATE
											{					
												var now = new Date ();
												render = render.replace ("%%DATE%%", SNDK.tools.padLeft (now.getDate (), 2, "0") +"-"+ SNDK.tools.padLeft ((now.getMonth () + 1), 2, "0") +"-"+ now.getFullYear ());
												content.innerHTML = render;				
											}						
										
											// HASVATNO
											{
												if (customer.vat)
												{
													render = render.replace ("%%HASVATNO%%", template.hasvatno);
													render = render.replace ("%%VATNO%%", customer.vatno);
												}
												else
												{
													render = render.replace ("%%HASVATNO%%", "");						
												}
											}
								
											content.innerHTML = render;
										}
									}
									
									var result = print.contentDocument.body.innerHTML;
									
									app.mainWindow.document.getElementById ("PrintHolder").removeChild (print);
									
									return result;						
								};
								
				var data = render ({case: attributes.case});			
									
				var print = app.mainWindow.document.createElement ("iframe");
				app.mainWindow.document.getElementById ("PrintHolder").appendChild (print);		
				print.contentDocument.body.innerHTML = data;
								
				var settings = PrintUtils.getPrintSettings ();
																																											
				settings.marginLeft = 0.5;
				settings.marginRight = 0.5;
				settings.marginTop = 0.5;
				settings.marginBottom = 0.0;
				settings.shrinkToFit = true;
					
				settings.paperName =  "iso_a4";
				settings.paperWidth = 210;
				settings.paperHeight = 297
				settings.paperSizeUnit = Ci.nsIPrintSettings.kPaperSizeMillimeters;																					
				
				settings.printBGImages = true;
			    settings.printBGColors = true;    	
			    	
			    settings.printFrameType = Ci.nsIPrintSettings.kFramesAsIs;
			    settings.outputFormat = Ci.nsIPrintSettings.kOutputFormatPDF;
			    
			    settings.footerStrCenter = "";
			    settings.footerStrLeft = "";
			    settings.footerStrRight = "";
			    settings.headerStrCenter = "";
			    settings.headerStrLeft = "";
			    settings.headerStrRight = "";    	
				
				settings.title = "Didius Salesagreement";
			
				if (attributes.mail) 
				{
					var localDir = sXUL.tools.getLocalDirectory ();		
					var filename = localDir.path + app.session.pathSeperator + SNDK.tools.newGuid () +".pdf";		
							
					// Hide print dialog.
					settings.printToFile = true;    					
			    	settings.printSilent = true;
			  		settings.showPrintProgress = false;
				    		    		
				   	// Set output format to PDF.    		    		           	
			    	settings.outputFormat = 2;
			    				        	        	    
			  		// Set output filename.
					settings.toFileName = filename;
																
					var onDone =	function ()
									{
										var onLoad = 		function (respons)
															{														
																var respons = respons.replace ("\n","").split (":");
																							
																switch (respons[0].toLowerCase ())
																{
																	case "success":
																	{																
																		//sXUL.tools.fileDelete (filename);																														
																		break;
																	}
												
																	default:
																	{
																		onError ();
																		break;
																	}							
																}
																	
																onDone ();
															};
								
										var onProgress =	function (event)
															{															
															};
										
										var onError =		function (event)
															{																											
																if (attributes.onError != null)
																{
																	setTimeout (attributes.onError, 1);
																}
															};
																
										var onDone = 		function ()							
															{													
																if (attributes.onDone != null)
																{
																	setTimeout (attributes.onDone, 1);
																}
															}
															
										var worker = function ()
										{															
											sXUL.tools.fileUpload ({postUrl: didius.runtime.ajaxUrl, fieldName: "file", filePath: filename, additionalFields: {cmd: "function", "cmd.function": "Didius.Helpers.MailSalesAgreement", customerid: attributes.case.customerid}, onLoad: onLoad, onProgress: onProgress, onError: onError});
										}
										
										setTimeout (worker, 5000);																																
									};
										
					sXUL.tools.print ({contentWindow: print.contentWindow, settings: settings, onDone: onDone, onError: attributes.onError});
				}
				else
				{								
					sXUL.tools.print ({contentWindow: print.contentWindow, settings: settings, onDone: attributes.onDone, onError: attributes.onError});				
				}																																																							
			},
		
			settlement : function (attributes)		
			{					
				if (!attributes.settlement)
					throw "DIDIUS.COMMON.PRINT.SETTLEMENT.PRINT: No SETTLEMENT given, cannot print nothing.";
			
				var Cc = Components.classes;
				var Ci = Components.interfaces;
				var Cu = Components.utils;
				var Cr = Components.results;
			
				// ------------------------------------------------------------------------------------------------------
				// | RENDER																								|	
				// ------------------------------------------------------------------------------------------------------
				var render = 	function (attributes)
								{
									var settlement = attributes.settlement;
									var customer = didius.customer.load (settlement.id);						
									var items = didius.item.list ({case: _case});
									
									SNDK.tools.sortArrayHash (items, "catalogno", "numeric");		
								
									var template = didius.helpers.parsePrintTemplate (didius.settings.get ({key: "didius_template_settlement"}));						
									var print = app.mainWindow.document.createElement ("iframe");
									app.mainWindow.document.getElementById ("PrintHolder").appendChild (print);
															
									var pageCount = 1;				
								
									var page = function (from)
									{
										// Add styles.																		
										var styles = print.contentDocument.createElement ("style");					
										print.contentDocument.body.appendChild (styles);					
										styles.innerHTML = template.styles;
								
										// Create page.				
										var page = print.contentDocument.createElement ("div");
										page.className = "Page A4";
										print.contentDocument.body.appendChild (page);
																													
										// Add content holder.																						
										var content = print.contentDocument.createElement ("div")
										content.className = "PrintContent";
										page.appendChild (content);
																								
										// Add inital content.
										var render = template.page.replace ("%%PAGENUMBER%%", pageCount++);					
										content.innerHTML = render;
									
										// Caluculate page maxheight for printing.										
										var maxHeight = page.offsetHeight 
										var maxHeight2 = page.offsetHeight;
										
										// CUSTOMERINFO
										{
											var customerInfo = "";					
											customerInfo += customer.name +"<br>";
											customerInfo += customer.address1 +"<br>";
							
											if (customer.address2 != "")
											{
												customerInfo += customer.address1 +"<br>";					
											}
							
											customerInfo += customer.postcode +" "+ customer.city +"<br><br>";
											
											customerInfo += "Kunde nr. "+ customer.no +"<br><br>"
											
											customerInfo += "Tlf. "+ customer.phone +"<br>";
											customerInfo += "Email "+ customer.email +"<br><br>";
											
											customerInfo += "Sag: "+ _case.title +"<br><br>";
											
											render = render.replace ("%%CUSTOMERINFO%%", customerInfo);					
											content.innerHTML = render;
										}
						
										// CUSTOMERBANKACCOUNT
										{
											render = render.replace ("%%CUSTOMERBANKACCOUNT%%", customer.bankregistrationno +" "+ customer.bankaccountno);
											content.innerHTML = render;
										}
						
										// ROWS
										{
											// Add data rows.
											var rows = "";	
											var count = 0;				
											for (var idx = from; idx < items.length; idx++)
											{							
												var row = template.row;
												
												if (items[idx].bidamount != "0.00")
												{							
													// CATALOGNO						
													{
														row = row.replace ("%%CATALOGNO%%", items[idx].catalogno);
													}			
											
													// DESCRIPTION
													{
														row = row.replace ("%%DESCRIPTION%%", items[idx].description);
													}		
											
													// BIDAMOUNT
													{
														row = row.replace ("%%BIDAMOUNT%%", items[idx].bidamount);
													}
											
													// COMMISSIONFEE
													{
														row = row.replace ("%%COMMISSIONFEE%%", items[idx].commissionfee);
													}					
			
													content.innerHTML = render.replace ("%%ROWS%%", rows + row);
																																		
													if (content.offsetHeight > (maxHeight2))
													{						
														render = render.replace ("%%ROWS%%", rows);															
														render = render.replace ("%%TRANSFER%%", template.transfer)
														render = render.replace ("%%TOTAL%%", "");		
														render = render.replace ("%%DISCLAIMER%%", "");							
														content.innerHTML = render;
														break;	
													}
																					
													totalSale += parseInt (items[idx].bidamount);
													totalCommissionFee += parseInt (items[idx].commissionfee);
													totalTotal = totalSale + totalCommissionFee;				
												
													rows += row;
												}
																							
												count++;						
											}																		
										
											render = render.replace ("%%ROWS%%", rows);
											render = render.replace ("%%TRANSFER%%", "");
											
											content.innerHTML = render;
										}
						
										// TOTAL
										{
											render = render.replace ("%%TOTAL%%", template.total);
											render = render.replace ("%%TOTALSALE%%", totalSale.toFixed (2));
											render = render.replace ("%%TOTALCOMMISSIONFEE%%", totalCommissionFee.toFixed (2));
											render = render.replace ("%%TOTALTOTAL%%", (totalSale + totalCommissionFee).toFixed (2));
											content.innerHTML = render;
										}				
																	
										// DISCLAIMER
										{
											render = render.replace ("%%DISCLAIMER%%", template.disclaimer);
											content.innerHTML = render;
										}
																							
										return count;				
									}												
									
									var c = 0;				
									while (c < items.length)
									{							
						 				c += page (c);				 				
									}			
																					
									var result = print.contentDocument.body.innerHTML;						
									app.mainWindow.document.getElementById ("PrintHolder").removeChild (print);
									
									return result;						
								};
								
				var data = render ({case: attributes.case});
				
				var print = app.mainWindow.document.createElement ("iframe");
				app.mainWindow.document.getElementById ("PrintHolder").appendChild (print);		
				print.contentDocument.body.innerHTML = data;
								
				var settings = PrintUtils.getPrintSettings ();
																																											
				settings.marginLeft = 0.5;
				settings.marginRight = 0.5;
				settings.marginTop = 0.5;
				settings.marginBottom = 0.0;
				settings.shrinkToFit = true;
					
				settings.paperName =  "iso_a4";
				settings.paperWidth = 210;
				settings.paperHeight = 297
				settings.paperSizeUnit = Ci.nsIPrintSettings.kPaperSizeMillimeters;																					
				
				settings.printBGImages = true;
			    settings.printBGColors = true;    	
			    	
			    settings.printFrameType = Ci.nsIPrintSettings.kFramesAsIs;
			    settings.outputFormat = Ci.nsIPrintSettings.kOutputFormatPDF;
			    
			    settings.footerStrCenter = "";
			    settings.footerStrLeft = "";
			    settings.footerStrRight = "";
			    settings.headerStrCenter = "";
			    settings.headerStrLeft = "";
			    settings.headerStrRight = "";    	
				
				settings.title = "Didius Settlement";
				
				if (attributes.mail) 
				{
					var localDir = sXUL.tools.getLocalDirectory ();		
					var filename = localDir.path + app.session.pathSeperator + SNDK.tools.newGuid () +".pdf";		
							
					// Hide print dialog.
					settings.printToFile = true;    					
			    	settings.printSilent = true;
			  		settings.showPrintProgress = false;
				    		    		
				   	// Set output format to PDF.    		    		           	
			    	settings.outputFormat = 2;
			    				        	        	    
			  		// Set output filename.
					settings.toFileName = filename;
																
					var onDone =	function ()
									{
										var onLoad = 		function (respons)
															{														
																var respons = respons.replace ("\n","").split (":");
																							
																switch (respons[0].toLowerCase ())
																{
																	case "success":
																	{																
																		//sXUL.tools.fileDelete (filename);																														
																		break;
																	}
												
																	default:
																	{
																		onError ();
																		break;
																	}							
																}
																	
																onDone ();
															};
								
										var onProgress =	function (event)
															{															
															};
										
										var onError =		function (event)
															{																											
																if (attributes.onError != null)
																{
																	setTimeout (attributes.onError, 1);
																}
															};
																
										var onDone = 		function ()							
															{													
																if (attributes.onDone != null)
																{
																	setTimeout (attributes.onDone, 1);
																}
															}
															
										var worker = function ()
										{							
											sXUL.tools.fileUpload ({postUrl: didius.runtime.ajaxUrl, fieldName: "file", filePath: filename, additionalFields: {cmd: "function", "cmd.function": "Didius.Helpers.MailSettlement", customerid: attributes.settlement.customerid}, onLoad: onLoad, onProgress: onProgress, onError: onError});																
										}
										
										setTimeout (worker, 5000);																																
									};
										
					sXUL.tools.print ({contentWindow: print.contentWindow, settings: settings, onDone: onDone, onError: attributes.onError});
				}
				else
				{								
					sXUL.tools.print ({contentWindow: print.contentWindow, settings: settings, onDone: attributes.onDone, onError: attributes.onError});				
				}																											
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



