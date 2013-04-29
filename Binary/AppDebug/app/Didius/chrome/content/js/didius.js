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
		ajaxUrl2 : "http://78.109.223.248/",
		ajaxUrl : "http://york.didius.qnax.net/",
		browserMode: false,
		
		initialize : function ()
		{
			try
			{		
				app.events.onCustomerLoad = new sXUL.event ({id: "onCustomerLoad", remotePropagation: true});
				app.events.onCustomerSave = new sXUL.event ({id: "onCustomerSave", remotePropagation: true});
				app.events.onCustomerDestroy = new sXUL.event ({id: "onCustomerDestroy", remotePropagation: true});
					
				app.events.onAuctionLoad = new sXUL.event ({id: "onAuctionLoad", remotePropagation: true});
				app.events.onAuctionSave = new sXUL.event ({id: "onAuctionSave", remotePropagation: true});
				app.events.onAuctionDestroy = new sXUL.event ({id: "onAuctionDestroy", remotePropagation: true});
			
				app.events.onCaseCreate = new sXUL.event ({id: "onCaseCreate", remotePropagation: true});
				app.events.onCaseLoad = new sXUL.event ({id: "onCaseLoad", remotePropagation: true});
				app.events.onCaseSave = new sXUL.event ({id: "onCaseSave", remotePropagation: true});
				app.events.onCaseDestroy = new sXUL.event ({id: "onCaseDestroy", remotePropagation: true});
					
				app.events.onItemLoad = new sXUL.event ({id: "onItemLoad", remotePropagation: true});
				app.events.onItemSave = new sXUL.event ({id: "onItemSave", remotePropagation: true});
				app.events.onItemDestroy = new sXUL.event ({id: "onItemDestroy", remotePropagation: true});
			
				app.events.onBidLoad = new sXUL.event ({id: "onBidLoad", remotePropagation: true});
				app.events.onBidSave = new sXUL.event ({id: "onBidSave", remotePropagation: true});
				app.events.onBidDestroy = new sXUL.event ({id: "onBidDestroy", remotePropagation: true});
			
				app.events.onSettlementCreate = new sXUL.event ({id: "onSettlementCreate", remotePropagation: true});
				app.events.onSettlementLoad = new sXUL.event ({id: "onSettlementLoad", remotePropagation: true});
			
				app.events.onInvoiceCreate = new sXUL.event ({id: "onInvoiceCreate", remotePropagation: true});
				app.events.onInvoiceLoad = new sXUL.event ({id: "onInvoiceLoad", remotePropagation: true});
				
				app.events.onCreditnoteCreate = new sXUL.event ({id: "onCreditnoteCreate", remotePropagation: true});
				app.events.onCreditnoteLoad = new sXUL.event ({id: "onCreditnoteLoad", remotePropagation: true});
			
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
			
			if (!didius.runtime.browserMode)	
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
			
			if (!didius.runtime.browserMode)	
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
		create : function (attributes)
		{
			var cmd = "cmd=Ajax;cmd.function=Didius.Case.Create";
			var content = new Array ();	
		
			if (attributes.customerId)
				content.customerid = attributes.customerId;	
		
			if (attributes.customer)
				content.customerid = attributes.customer.id;
				
			if (attributes.auctionId)
				content.auctionid = attributes.auctionId;	
		
			if (attributes.auction)
				content.auctionid = attributes.auction.id;			
				
			if (attributes.onDone != null)
			{
				var onDone = 	function (respons)
								{
									attributes.onDone (respons["didius.case"]);
								};
								
				var onError = 	function (exception)
								{
									if (attributes.onError != null)							
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
			
				var result = request.respons ()["didius.case"];
				return result;
			}	
		},
			
		load : function (attributes)
		{
			var cmd = "cmd=Ajax;cmd.function=Didius.Case.Load";
			
			var content = new Array ();
			content.id = attributes.id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Case.Load", "data", "POST", false);		
			request.send (content);
		
			var result = request.respons ()["didius.case"];
			
		//	if (!didius.runtime.browserMode)		
		//		app.events.onCaseLoad.execute (result); 
		
			return result;
		},
				
		save : function (attributes)
		{	
			var cmd = "cmd=Ajax;cmd.function=Didius.Case.Save";	
			var content = new Array ();
				
			content["didius.case"] = attributes.case;
		
			if (attributes.onDone != null)
			{
				var onDone = 	function ()
								{
									if (!didius.runtime.browserMode)	
										app.events.onCaseSave.execute (attributes.case);
								
									attributes.onDone ();
								};
								
				var onError = 	function (exception)
								{
									if (attributes.onError != null)							
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
				
				if (!didius.runtime.browserMode)	
					app.events.onCaseSave.execute (attributes.case);
			}	
		},		
		
		destroy : function (attributes)
		{
			var cmd = "cmd=Ajax;cmd.function=Didius.Case.Destroy";
			var content = new Array ();
			
			content.id = attributes.id;
			
			if (attributes.onDone != null)
			{
				var onDone = 	function ()
								{
									if (!didius.runtime.browserMode)	
									{	
										var data = {};
										data.id = attributes.id;
										app.events.onCaseDestroy.execute (data);		
									}
								
									attributes.onDone ();
								};
								
				var onError = 	function (exception)
								{
									if (attributes.onError != null)							
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
				
				if (!didius.runtime.browserMode)	
				{	
					var data = {};
					data.id = attributes.id;
					app.events.onCaseDestroy.execute (data);		
				}
			}				
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
		create : function (attributes)	
		{
			var cmd = "cmd=Ajax;cmd.function=Didius.Item.Create";
			var content = new Array ();
			
			if (attributes.caseId)
				content.caseid = attributes.caseId;
			
			if (attributes.case)
				content.caseid = attributes.case.id;
				
				
		
			if (attributes.onDone != null)
			{
				var onDone = 	function (respons)
								{
									attributes.onDone (respons["didius.item"]);
								};
								
				var onError = 	function (exception)
								{
									if (attributes.onError != null)							
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
			
				var result = request.respons ()["didius.item"];
				return result;
			}		
		},
			
		load : function (attributes)
		{
			var cmd = "cmd=Ajax;cmd.function=Didius.Item.Load";
			var content = new Array ();
			content.id = attributes.id;
			
			if (attributes.onDone != null)
			{
				var onDone = 	function (respons)
								{
		//							if (!didius.runtime.browserMode)	
		//								app.events.onItemLoad.execute (respons["didius.item"]);
								
									attributes.onDone (respons["didius.item"]);
								};
								
				var onError = 	function (exception)
								{
									if (attributes.onError != null)							
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
			
				var result = request.respons ()["didius.item"];
				
		//		if (!didius.runtime.browserMode)	
		//			app.events.onItemLoad.execute (result);
				
				return result;
			}
		},
				
		save : function (attributes)
		{	
			var cmd = "cmd=Ajax;cmd.function=Didius.Item.Save";
			var content = new Array ();
			
			content["didius.item"] = attributes.item;
			
			if (attributes.onDone != null)
			{
				var onDone = 	function (respons)
								{
									if (!didius.runtime.browserMode)	
										app.events.onItemSave.execute (respons["didius.item"]);
								
									attributes.onDone (respons["didius.item"]);
								};
								
				var onError = 	function (exception)
								{
									if (attributes.onError != null)							
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
				
				var result = request.respons ()["didius.item"];
																	
				if (!didius.runtime.browserMode)	
				{		
					app.events.onItemSave.execute (result);
				}
				
			}									
		},		
		
		destroy : function (attributes)
		{
			var cmd = "cmd=Ajax;cmd.function=Didius.Item.Destroy";
			var content = new Array ();
			
			content.id = attributes.id;
			
			if (attributes.onDone != null)
			{
				var onDone = 	function (respons)
								{
									if (!didius.runtime.browserMode)			
									{
										var data = {}
										data.id = attributes.id;	
										app.events.onItemDestroy.execute (data);
									}
								
									attributes.onDone ();
								};
								
				var onError = 	function (exception)
								{
									if (attributes.onError != null)							
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
						
				if (!didius.runtime.browserMode)			
				{
					var data = {}
					data.id = attributes.id;	
					app.events.onItemDestroy.execute (data);
				}				
			}					
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
				content.auctionid = attributes.auctionId;
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
		// ----------------------------------------------------------------------------------------------------------
		// | CREATE																									|
		// ----------------------------------------------------------------------------------------------------------
		create : function (attributes)
		{	
			var cmd = "cmd=Ajax;cmd.function=Didius.Bid.Create";
		
			var content = new Array ();
			
			if (attributes.customer)
				content.customerid = attributes.customer.id;
				
			if (attributes.customerId)
				content.customerid = attributes.customerId;
				
			if (attributes.item)
				content.itemid = attributes.item.id;
				
			if (attributes.itemId)
				content.itemid = attributes.itemId;
					
			content.amount = attributes.amount;
			
			if (attributes.onDone != null)
			{
				var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, cmd, "data", "POST", true);	
				
				var onDone = 	function (respons)
								{
		//							if (!didius.runtime.browserMode)		
		//								app.events.onBidLoad.execute (respons["didius.bid"]);
										
									attributes.onDone (respons["didius.bid"]);
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
				
				var result = request.respons ()["didius.bid"];
				
		//		if (!didius.runtime.browserMode)		
		//			app.events.onBidCreate.execute (result);
					
				return result;
			}
		},
			
		// ----------------------------------------------------------------------------------------------------------
		// | LOAD																									|
		// ----------------------------------------------------------------------------------------------------------
		load : function (attributes)
		{
			var cmd = "cmd=Ajax;cmd.function=Didius.Bid.Load";
		
			var content = new Array ();
			content.id = attributes.id;
			
			if (attributes.onDone != null)
			{	
				var onDone = 	function (respons)
								{
		//							if (!didius.runtime.browserMode)		
		//								app.events.onBidLoad.execute (respons["didius.bid"]);
										
									attributes.onDone (respons["didius.bid"]);
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
				
				var result = request.respons ()["didius.bid"];
				
		//		if (!didius.runtime.browserMode)		
		//			app.events.onBidLoad.execute (result);
					
				return result;
			}
		},
				
		// ----------------------------------------------------------------------------------------------------------
		// | SAVE																									|
		// ----------------------------------------------------------------------------------------------------------		
		save : function (attributes)
		{	
			var cmd = "cmd=Ajax;cmd.function=Didius.Bid.Save";
		
			var content = new Array ();
			content["didius.bid"] = attributes.bid;
										
			if (attributes.onDone != null)
			{	
				var onDone = 	function (respons)
								{
									if (!didius.runtime.browserMode)		
										app.events.onBidSave.execute (attributes.bid);						
										
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
				
				if (!didius.runtime.browserMode)		
					app.events.onBidSave.execute (attributes.bid);
			}		
		},		
		
		// ----------------------------------------------------------------------------------------------------------
		// | DESTROY																								|
		// ----------------------------------------------------------------------------------------------------------
		destroy : function (attributes)
		{
			var cmd = "cmd=Ajax;cmd.function=Didius.Bid.Destroy";
		
			var content = new Array ();
			content.id = attributes.id;
		
			if (attributes.onDone != null)
			{
				var onDone = 	function (respons)
								{
									var data = {}
									data.id = id;
									
									if (!didius.runtime.browserMode)		
										app.events.onBidDestroy.execute (data);
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
				var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, cmd , "data", "POST", false);	
				request.send (content);
				
				var data = {}
				data.id = attributes.id;
				
				if (!didius.runtime.browserMode)		
					app.events.onBidDestroy.execute (data);
			}
		},				
			
		// ----------------------------------------------------------------------------------------------------------
		// | LIST																									|
		// ----------------------------------------------------------------------------------------------------------			
		list : function (attributes)
		{
			var cmd = "cmd=Ajax;cmd.function=Didius.Bid.List";
		
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
			
			
			if (attributes.onDone)
			{
				var onDone = 	function (respons)
								{
									attributes.onDone (respons["didius.bids"]);
								};
								
				var onError =	function (exception)
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
				return request.respons ()["didius.bids"];
			}
		}	
		
		
		
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: autobid
	// ---------------------------------------------------------------------------------------------------------------
	autobid :
	{
		// ----------------------------------------------------------------------------------------------------------
		// | LOAD																									|
		// ----------------------------------------------------------------------------------------------------------
		load : function (attributes)
		{
			var cmd = "cmd=Ajax;cmd.function=Didius.AutoBid.Load";
		
			var content = new Array ();
			content.id = attributes.id;
			
			if (attributes.onDone != null)
			{	
				var onDone = 	function (respons)
								{
									attributes.onDone (respons["didius.autobid"]);
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
				
				var result = request.respons ()["didius.autobid"];
							
				return result;
			}
		},
					
		// ----------------------------------------------------------------------------------------------------------
		// | LIST																									|
		// ----------------------------------------------------------------------------------------------------------			
		list : function (attributes)
		{
			var cmd = "cmd=Ajax;cmd.function=Didius.AutoBid.List";
		
			var content = new Array ();
			
			// ITEM
			if (attributes.itemId)
			{
				content.itemid = attributes.itemId;
			}		
			
			// CUSTOMER
			if (attributes.customer)
			{
				content.customerid = attributes.customer.id;
			}	
			
			
			if (attributes.onDone)
			{
				var onDone = 	function (respons)
								{
									attributes.onDone (respons["didius.autobids"]);
								};
								
				var onError =	function (exception)
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
				return request.respons ()["didius.autobids"];
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
		create : function (attributes)
		{
			var content = new Array ();
			
			if (attributes.caseId)
				content.caseid = attributes.caseId;
				
			if (attributes.case)
				content.caseid = attributes.case.id;
				
			content.simulate = false;	
			
			if (attributes.simulate)
				content.simulate = attributes.simulate;
					
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Settlement.Create", "data", "POST", false);	
			request.send (content);
			
			var result = request.respons ()["didius.settlement"];
		
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
		
			if (!content.simulate)
			{
				if (!didius.runtime.browserMode)		
					app.events.onInvoiceCreate.execute (result);
			}
			
			return result;
		},
			
		load : function (id)
		{
			var content = new Array ();
			content.id = id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Invoice.Load", "data", "POST", false);		
			request.send (content);
		
			var result = request.respons ()["didius.invoice"];
			
			if (!didius.runtime.browserMode)		
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
		
		
		
		
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: creditnote
	// ---------------------------------------------------------------------------------------------------------------
	creditnote :
	{
		create : function (attributes)
		{
			var content = new Array ();
					
			if (attributes.customerId)
				content.customerid = attributes.customerId;		
			
			if (attributes.customer)
				content.customerid = attributes.customer.id;
				
			if (attributes.customerId)
				content.customerid = attributes.customerId;		
			
			if (attributes.invoice)
				content.invoiceid = attributes.invoice.id;
				
			if (attributes.invoiceId)
				content.invoiceid = attributes.invoiceId;
				
			if (attributes.item)
				content.item = attributes.item;
				
			if (attributes.items)
				content.items = attributes.items;
				
			content.simulate = false;	
			
			if (attributes.simulate)
				content.simulate = attributes.simulate;
					
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Creditnote.Create", "data", "POST", false);	
			request.send (content);
			
			var result = request.respons ()["didius.creditnote"];
			
			if (!content.simulate)
			{
				if (!didius.runtime.browserMode)		
					app.events.onCreditnoteCreate.execute (result);
			}
			
			return result;
		},
			
		load : function (attributes)
		{
			var content = new Array ();
			content.id = attributes.id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Creditnote.Load", "data", "POST", false);
			request.send (content);
		
			var result = request.respons ()["didius.creditnote"];
			
			if (!didius.runtime.browserMode)		
				app.events.onCreditnoteLoad.execute (result);
		
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
					
			if (attributes.async)
			{
				var onDone = 	function (respons)
								{
									attributes.onDone (respons["didius.creditnotes"]);
								};
				
				var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Creditnote.List", "data", "POST", true);
				request.onLoaded (onDone);
				request.send (content);
			}
			else
			{
				var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Creditnote.List", "data", "POST", false);		
				request.send (content);
		
				return request.respons ()["didius.creditnotes"];		
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
		
		send : function (attributes)
		{
			var content = new Array ();
			content.id = attributes.id;
			
			if (attributes.onDone)
			{
				var onDone = 	function ()
								{
									attributes.onDone ();
								};
				
				var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Newsletter.Send", "data", "POST", true);			
				request.onLoaded (onDone);
				request.send (content);
			}
			else
			{
				var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Newsletter.Send", "data", "POST", false);	
				request.send (content);		
			}	
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
									var customer = didius.customer.load (attributes.invoice.customerid)
									
									var auctions = {};
									
									for (index in attributes.invoice.auctionids)
									{
										auctions[auctions.length] = didius.auction.load (attributes.invoice.auctionids[index]);
									}
																								
									var template = didius.helpers.parsePrintTemplate (didius.settings.get ({key: "didius_template_invoice"}));
									
									var print = document.getElementById ("iframe.print");
									print.contentDocument.body.innerHTML = " ";
									
									var pageCount = 1;									
																										
									var contentType1 =	function ()
														{
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
																
																// Page
																{							
																	var render = "";
																	render += template.header;
																	render += template.footer;									
																
																	// PAGENUMBER
																	{				
																		render = render.replace ("%%PAGENUMBER%%", pageCount++);
																	}
																	
																	page.innerHTML = render;
																}
																
																// Add content holder.																						
																var content = print.contentDocument.createElement ("div")
																content.className = "PrintContent";
																content.style.top = print.contentDocument.getElementById ("PageHeader").offsetHeight;
																page.appendChild (content);
															
															
																var render = template.contenttype1.replace ("%%CONTENTTYPE1%%", template.contenttype1);
																// CUSTOMERNAME
																{
																	render = render.replace ("%%CUSTOMERNAME%%", customer.name);
																}
														
																// CUSTOMERADDRESS
																{
																	var customeraddress = customer.address1;
																	
																	if (customer.address2 != "")
																	{
																		customeraddress += "<br>"+ customer.address2;
																	}
																
																	render = render.replace ("%%CUSTOMERADDRESS%%", customeraddress);														
																}
																
																// POSTCODE
																{
																	render = render.replace ("%%CUSTOMERPOSTCODE%%", customer.postcode);														
																}
																
																// CUSTOMERCITY
																{
																	render = render.replace ("%%CUSTOMERCITY%%", customer.city);														
																}
																
																// CUSTOMERCOUNTRY
																{
																	render = render.replace ("%%CUSTOMERCOUNTRY%%", customer.country);														
																}
																
																// CUSTOMERNO
																{
																	render = render.replace ("%%CUSTOMERNO%%", customer.no);														
																}
																
																// CUSTOMERPHONE
																{
																	render = render.replace ("%%CUSTOMERPHONE%%", customer.phone);
																}
																
																// CUSTOMERMOBILE
																{
																	render = render.replace ("%%CUSTOMERMOBILE%%", customer.mobile);
																}
																
																// CUSTOMEREMAIL
																{
																	render = render.replace ("%%CUSTOMEREMAIL%%", customer.email);														
																}
																													
																// AUCTIONINFO
																{
																	var auctioninfo = template.auctioninfo;
																
																	for (index in auctions)
																	{															
																		var auction = auctions[index];
																		
																		// AUCTIONNO
																		{
																			auctioninfo = auctioninfo.replace ("%%AUCTIONNO%%", auction.no);
																		}
																		
																		// AUCTIONTITLE
																		{
																			auctioninfo = auctioninfo.replace ("%%AUCTIONTITLE%%", auction.title);
																		}
																		
																		// BUYERNO
																		{
																			var buyernos = didius.helpers.parseBuyerNos (auction.buyernos);
				
																			for (index in buyernos)
																			{
																				if (buyernos[index] == customer.id)
																				{																		
																					auctioninfo = auctioninfo.replace ("%%BUYERNO%%", index);
																				}																																
																			}
																			
																			auctioninfo = auctioninfo.replace ("%%BUYERNO%%", "");
																		}
																	}													
																
																	render = render.replace ("%%AUCTIONINFO%%", auctioninfo);
																}
																
																// AUCTIONTITLE
																{
									//								render = render.replace ("%%AUCTIONTITLE%%", attributes.invoice.auction.title);
																}
																						
																// INVOICENO
																{
																	render = render.replace ("%%INVOICENO%%", attributes.invoice.no);
																}
																
																// INVOICEDATE
																{															
																	var date = SNDK.tools.timestampToDate (attributes.invoice.createtimestamp)
																	render = render.replace ("%%INVOICEDATE%%", SNDK.tools.padLeft (date.getDate (), 2, "0") +"-"+ SNDK.tools.padLeft ((date.getMonth () + 1), 2, "0") +"-"+ date.getFullYear ());
																}
																
																// CUSTOMERBANKACCOUNT
																{
																	render = render.replace ("%%CUSTOMERBANKACCOUNT%%", customer.bankregistrationno +" "+ customer.bankaccountno);
																}
																
																content.innerHTML = render;	
																		
																// ROWS
																{
																	// Add data rows.
																	var rows = "";	
																	var count = 0;
																							
																	for (var idx = from; idx < attributes.invoice.lines.length; idx++)
																	{							
																		var row = template.row;
																		
																		// NO
																		{
																			row = row.replace ("%%NO%%", attributes.invoice.lines[idx].no);
																		}
																		
																		// TEXT
																		{
																			row = row.replace ("%%TEXT%%", attributes.invoice.lines[idx].text);
																		}		
																	
																		// AMOUNT
																		{
																			row = row.replace ("%%AMOUNT%%", attributes.invoice.lines[idx].amount.toFixed (2));
																		}
																																			
																		// VATAMOUNT
																		{
																			row = row.replace ("%%VATAMOUNT%%", attributes.invoice.lines[idx].vatamount.toFixed (2));
																		}
																		
																		// COMMISSIONFEE
																		{
																			row = row.replace ("%%COMMISSIONFEE%%", attributes.invoice.lines[idx].commissionfee.toFixed (2));
																		}					
																		
																		// VATCOMMISSIONFEE
																		{
																			row = row.replace ("%%VATCOMMISSIONFEE%%", attributes.invoice.lines[idx].vatcommissionfee.toFixed (2));
																		}					
																		
																		// TOTAL
																		{
																			row = row.replace ("%%TOTAL%%", attributes.invoice.lines[idx].total.toFixed (2));
																		}					
			
																		content.innerHTML = render.replace ("%%ROWS%%", rows + row);
																																								
																		if ((page.offsetHeight - print.contentDocument.getElementById ("PageFooter").offsetHeight - print.contentDocument.getElementById ("PageHeader").offsetHeight ) < (content.offsetHeight))
																		{   					
																			render = render.replace ("%%ROWS%%", rows);																															
																			content.innerHTML = render;
																			
																			{
																				var render = page.innerHTML;
																				render = render.replace ("%%TRANSFER%%", template.transfer)						
																				render = render.replace ("%%TOTAL%%", "");		
																				render = render.replace ("%%DISCLAIMER%%", "");							
																				page.innerHTML = render;																																
																			}
																			break;	
																		}
																									
																		rows += row;																	
																		count++;						
																	}
																	
																	render = render.replace ("%%ROWS%%", rows);													
																	content.innerHTML = render;
																	
																	{
																		var render = page.innerHTML;														
																		render = render.replace ("%%TRANSFER%%", "");
																		page.innerHTML = render;
																	}
																}
																
																// TOTAL
																{																										
																	var render = page.innerHTML;
																	render = render.replace ("%%TOTAL%%", template.total);
																	render = render.replace ("%%TOTALSALE%%", attributes.invoice.sales.toFixed (2));
																	render = render.replace ("%%TOTALCOMMISSIONFEE%%", attributes.invoice.commissionfee.toFixed (2));
																	render = render.replace ("%%TOTALVAT%%", attributes.invoice.vat.toFixed (2));
																	render = render.replace ("%%TOTALTOTAL%%", attributes.invoice.total.toFixed (2));
																	page.innerHTML = render;
																}				
																								
																// DISCLAIMER
																{
																	var render = page.innerHTML;
																	render = render.replace ("%%DISCLAIMER%%", template.disclaimer);
																	
																	var auction = didius.auction.load (attributes.invoice.auctionids[0]);														
																	render = render.replace ("%%PICKUPTEXT%%", auction.pickuptext.replace ("\n", "<br>"));
																	page.innerHTML = render;
																}		
																
																return count;				
															}
														
															var c = 0;				
															while (c < attributes.invoice.lines.length)
															{							
												 				c += page (c);				 				
															}												
														};
														
									contentType1 ();
									
									return print.contentDocument.body.innerHTML;						
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
				
				var print = document.getElementById ("iframe.print");
				print.contentDocument.body.innerHTML = data;		
										
				var settings = PrintUtils.getPrintSettings ();
																																											
				settings.marginLeft = 0.5;
				settings.marginRight = 0.5;
				settings.marginTop = 0.5;
				settings.marginBottom = 0.5;
				settings.shrinkToFit = true;		
				settings.paperName =  "iso_a4";
				settings.paperWidth = 210;
				settings.paperHeight = 297
				settings.paperSizeUnit = Ci.nsIPrintSettings.kPaperSizeMillimeters;																					
			   	settings.printFrameType = Ci.nsIPrintSettings.kFramesAsIs;	
				settings.printBGImages = true;
			    settings.printBGColors = true;    	    	   
			    settings.footerStrCenter = "";
			    settings.footerStrLeft = "";
			    settings.footerStrRight = "";
			    settings.headerStrCenter = "";
			    settings.headerStrLeft = "";
			    settings.headerStrRight = "";    	
				
				settings.title = "DidiusInvoice";
					
				if (attributes.mail) 
				{
					var localDir = sXUL.tools.getLocalDirectory ();
					//var filename = localDir.path + app.session.pathSeperator +"temp"+ app.session.pathSeperator + main.current.id;
					var filename = localDir.path + app.session.pathSeperator + attributes.invoice.id +".pdf";
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
						
					sXUL.tools.print ({contentWindow: print.contentWindow, settings: settings, onDone: onDone, onError: attributes.onError});
				}
				else
				{
					sXUL.tools.print ({contentWindow: print.contentWindow, settings: settings, onDone: attributes.onDone, onError: attributes.onError});							
				}		
			}
			,
		
			creditnote : function (attributes)
			{	
				var Cc = Components.classes;
				var Ci = Components.interfaces;
				var Cu = Components.utils;
				var Cr = Components.results;
			
				var render = 	function (attributes)
								{							
									var customer = didius.customer.load (attributes.creditnote.customerid)
																								
									var template = didius.helpers.parsePrintTemplate (didius.settings.get ({key: "didius_template_creditnote"}));
									
									var print = document.getElementById ("iframe.print");
									print.contentDocument.body.innerHTML = " ";
									
									var pageCount = 1;									
																										
									var contentType1 =	function ()
														{
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
																
																// Page
																{							
																	var render = "";
																	render += template.header;
																	render += template.footer;									
																
																	// PAGENUMBER
																	{				
																		render = render.replace ("%%PAGENUMBER%%", pageCount++);
																	}
																	
																	page.innerHTML = render;
																}
																
																// Add content holder.																						
																var content = print.contentDocument.createElement ("div")
																content.className = "PrintContent";
																content.style.top = print.contentDocument.getElementById ("PageHeader").offsetHeight;
																page.appendChild (content);
															
															
																var render = template.contenttype1.replace ("%%CONTENTTYPE1%%", template.contenttype1);
																// CUSTOMERNAME
																{
																	render = render.replace ("%%CUSTOMERNAME%%", customer.name);
																}
														
																// CUSTOMERADDRESS
																{
																	var customeraddress = customer.address1;
																	
																	if (customer.address2 != "")
																	{
																		customeraddress += "<br>"+ customer.address2;
																	}
																
																	render = render.replace ("%%CUSTOMERADDRESS%%", customeraddress);														
																}
																
																// POSTCODE
																{
																	render = render.replace ("%%CUSTOMERPOSTCODE%%", customer.postcode);														
																}
																
																// CUSTOMERCITY
																{
																	render = render.replace ("%%CUSTOMERCITY%%", customer.city);														
																}
																
																// CUSTOMERCOUNTRY
																{
																	render = render.replace ("%%CUSTOMERCOUNTRY%%", customer.country);														
																}
																
																// CUSTOMERNO
																{
																	render = render.replace ("%%CUSTOMERNO%%", customer.no);														
																}
																
																// CUSTOMERPHONE
																{
																	render = render.replace ("%%CUSTOMERPHONE%%", customer.phone);
																}
																
																// CUSTOMERMOBILE
																{
																	render = render.replace ("%%CUSTOMERMOBILE%%", customer.mobile);
																}
																
																// CUSTOMEREMAIL
																{
																	render = render.replace ("%%CUSTOMEREMAIL%%", customer.email);														
																}
																
																// AUCTIONNO
																{
									//								render = render.replace ("%%AUCTIONNO%%", attributes.invoice.auction.no);
																}
																
																// AUCTIONTITLE
																{
									//								render = render.replace ("%%AUCTIONTITLE%%", attributes.invoice.auction.title);
																}
																						
																// CREDITNOTENO
																{
																	render = render.replace ("%%CREDITNOTENO%%", attributes.creditnote.no);
																}
																
																// CREDITNOTEDATE
																{															
																	var date = SNDK.tools.timestampToDate (attributes.creditnote.createtimestamp)
																	render = render.replace ("%%CREDITNOTEDATE%%", SNDK.tools.padLeft (date.getDate (), 2, "0") +"-"+ SNDK.tools.padLeft ((date.getMonth () + 1), 2, "0") +"-"+ date.getFullYear ());
																}
																
																// CUSTOMERBANKACCOUNT
																{
																	render = render.replace ("%%CUSTOMERBANKACCOUNT%%", customer.bankregistrationno +" "+ customer.bankaccountno);
																}
																
																content.innerHTML = render;	
																		
																// ROWS
																{
																	// Add data rows.
																	var rows = "";	
																	var count = 0;
																							
																	for (var idx = from; idx < attributes.creditnote.lines.length; idx++)
																	{							
																		var row = template.row;
																		
																		// NO
																		{
																			row = row.replace ("%%NO%%", attributes.creditnote.lines[idx].no);
																		}
																		
																		// TEXT
																		{
																			row = row.replace ("%%TEXT%%", attributes.creditnote.lines[idx].text);
																		}		
																	
																		// AMOUNT
																		{
																			row = row.replace ("%%AMOUNT%%", attributes.creditnote.lines[idx].amount.toFixed (2));
																		}
																																			
																		// VATAMOUNT
																		{
																			row = row.replace ("%%VATAMOUNT%%", attributes.creditnote.lines[idx].vat.toFixed (2));
																		}																													
																		
																		// TOTAL
																		{
																			row = row.replace ("%%TOTAL%%", attributes.creditnote.lines[idx].total.toFixed (2));
																		}					
			
																		content.innerHTML = render.replace ("%%ROWS%%", rows + row);
																																								
																		if ((page.offsetHeight - print.contentDocument.getElementById ("PageFooter").offsetHeight - print.contentDocument.getElementById ("PageHeader").offsetHeight ) < (content.offsetHeight))
																		{   					
																			render = render.replace ("%%ROWS%%", rows);																															
																			content.innerHTML = render;
																			
																			{
																				var render = page.innerHTML;
																				render = render.replace ("%%TRANSFER%%", template.transfer)						
																				render = render.replace ("%%TOTAL%%", "");		
																				render = render.replace ("%%DISCLAIMER%%", "");							
																				page.innerHTML = render;																																
																			}
																			break;	
																		}
																									
																		rows += row;																	
																		count++;						
																	}
																	
																	render = render.replace ("%%ROWS%%", rows);													
																	content.innerHTML = render;
																	
																	{
																		var render = page.innerHTML;														
																		render = render.replace ("%%TRANSFER%%", "");
																		page.innerHTML = render;
																	}
																}
																
																// TOTAL
																{																										
																	var render = page.innerHTML;
																	render = render.replace ("%%TOTAL%%", template.total);
																	render = render.replace ("%%TOTALAMOUNT%%", attributes.creditnote.amount.toFixed (2));														
																	render = render.replace ("%%TOTALVAT%%", attributes.creditnote.vat.toFixed (2));
																	render = render.replace ("%%TOTALTOTAL%%", attributes.creditnote.total.toFixed (2));
																	page.innerHTML = render;
																}				
																								
																// DISCLAIMER
																{
																	var render = page.innerHTML;
																	render = render.replace ("%%DISCLAIMER%%", template.disclaimer);														
																}		
																
																return count;				
															}
														
															var c = 0;				
															while (c < attributes.creditnote.lines.length)
															{							
												 				c += page (c);				 				
															}												
														};
														
									contentType1 ();
									
									return print.contentDocument.body.innerHTML;						
								};
								
				var data = "";
																						
				if (attributes.creditnote)
				{
					data = render ({creditnote: attributes.creditnote});
				}
				else if (attributes.creditnotes)
				{
					for (index in attributes.creditnotes)
					{
						data += render ({creditnote: attributes.creditnotes[index]});
					}			
				}
				
				var print = document.getElementById ("iframe.print");
				print.contentDocument.body.innerHTML = data;		
										
				var settings = PrintUtils.getPrintSettings ();
																																											
				settings.marginLeft = 0.5;
				settings.marginRight = 0.5;
				settings.marginTop = 0.5;
				settings.marginBottom = 0.5;
				settings.shrinkToFit = true;		
				settings.paperName =  "iso_a4";
				settings.paperWidth = 210;
				settings.paperHeight = 297
				settings.paperSizeUnit = Ci.nsIPrintSettings.kPaperSizeMillimeters;																					
			   	settings.printFrameType = Ci.nsIPrintSettings.kFramesAsIs;	
				settings.printBGImages = true;
			    settings.printBGColors = true;    	    	   
			    settings.footerStrCenter = "";
			    settings.footerStrLeft = "";
			    settings.footerStrRight = "";
			    settings.headerStrCenter = "";
			    settings.headerStrLeft = "";
			    settings.headerStrRight = "";    	
				
				settings.title = "DidiusCreditnote";
					
				if (attributes.mail) 
				{
					var localDir = sXUL.tools.getLocalDirectory ();
					//var filename = localDir.path + app.session.pathSeperator +"temp"+ app.session.pathSeperator + main.current.id;
					var filename = localDir.path + app.session.pathSeperator + attributes.creditnote.id +".pdf";
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
											sXUL.tools.fileUpload ({postUrl: didius.runtime.ajaxUrl, fieldName: "file", filePath: filename, additionalFields: {cmd: "function", "cmd.function": "Didius.Helpers.MailCreditnote", creditnoteid: attributes.creditnote.id, customerid: attributes.creditnote.customerid}, onLoad: onLoad, onProgress: onProgress, onError: onError});
											//sXUL.tools.fileUpload ({postUrl: didius.runtime.ajaxUrl, fieldName: "file", filePath: filename, additionalFields: {cmd: "function", "cmd.function": "Didius.Helpers.MailInvoice", invoiceid: attributes.invoice.id}, onLoad: onLoad, onProgress: onProgress, onError: onError});
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
			,
		
			salesAgreement : function (attributes)		
			{					
				var Cc = Components.classes;
				var Ci = Components.interfaces;
				var Cu = Components.utils;
				var Cr = Components.results;
			
				var render = 	function (attributes)
								{
									var _case = attributes.case;						
									var auction = didius.auction.load (_case.auctionid);
									var customer = didius.customer.load (_case.customerid);
									
									var items = didius.item.list ({case: _case});
									SNDK.tools.sortArrayHash (items, "catalogno", "numeric");		
								
									var template = didius.helpers.parsePrintTemplate (didius.settings.get ({key: "didius_template_salesagreement"}));																	
									
									var print = document.getElementById ("iframe.print");
									print.contentDocument.body.innerHTML = " ";
									
									var pageCount = 1;
									
									var contentType1 = 	function ()
														{												
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
																
																// Page
																{							
																	var render = "";
																	render += template.header;
																	render += template.footer;									
																
																	// PAGENUMBER
																	{				
																		render = render.replace ("%%PAGENUMBER%%", pageCount++);
																	}
																	
																	page.innerHTML = render;
																}
																
																// Add content holder.																						
																var content = print.contentDocument.createElement ("div")
																content.className = "PrintContent";
																content.style.top = print.contentDocument.getElementById ("PageHeader").offsetHeight;
																page.appendChild (content);
			
																var render = template.contenttype1.replace ("%%CONTENTTYPE1%%", template.contenttype1).replace ("%%CONTENTTYPE2%%", "");
																// CUSTOMERNAME
																{
																	render = render.replace ("%%CUSTOMERNAME%%", customer.name);
																}
															
																// CUSTOMERADDRESS
																{
																	var customeraddress = customer.address1;
																
																	if (customer.address2 != "")
																	{
																		customeraddress += "<br>"+ customer.address2;
																	}
														
																	render = render.replace ("%%CUSTOMERADDRESS%%", customeraddress);
																}
											
																// POSTCODE
																{
																	render = render.replace ("%%CUSTOMERPOSTCODE%%", customer.postcode);
																}
															
																// CUSTOMERCITY
																{
																	render = render.replace ("%%CUSTOMERCITY%%", customer.city);
																}
															
																// CUSTOMERCOUNTRY
																{
																	render = render.replace ("%%CUSTOMERCOUNTRY%%", customer.country);
																}
															
																// CUSTOMERNO
																{
																	render = render.replace ("%%CUSTOMERNO%%", customer.no);						
																}
												
																// CUSTOMERPHONE
																{
																	render = render.replace ("%%CUSTOMERPHONE%%", customer.phone);						
																}
																
																// CUSTOMERMOBILE
																{
																	render = render.replace ("%%CUSTOMERMOBILE%%", customer.mobile);
																}
														
																// CUSTOMEREMAIL
																{
																	render = render.replace ("%%CUSTOMEREMAIL%%", customer.email);						
																}
															
																// CASENO
																{
																	render = render.replace ("%%CASENO%%", _case.no);						
																}
															
																// CASETITLE
																{
																	render = render.replace ("%%CASETITLE%%", _case.title);						
																}
																
																// DATE
																{					
																	var now = new Date ();
																	render = render.replace ("%%DATE%%", SNDK.tools.padLeft (now.getDate (), 2, "0") +"-"+ SNDK.tools.padLeft ((now.getMonth () + 1), 2, "0") +"-"+ now.getFullYear ());						
																}																
																																						
																content.innerHTML = render;
																
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
																		
																		// COMMISSIONFEE
																		{
																			row = row.replace ("%%COMMISSIONFEE%%", items[idx].commissionfee.toFixed (2));
																		}		
																		
																		// ITEMVAT
																		{
																			var vat = "";
																			if (items[idx].vat)
																			{					
																				row = row.replace ("%%ITEMVAT%%", "&#10004;");
																			}
																			else
																			{
																				row = row.replace ("%%ITEMVAT%%", "");
																			}
																		}			
																												
																		content.innerHTML = render.replace ("%%ROWS%%", rows + row);																									
																											
																		if ((page.offsetHeight - print.contentDocument.getElementById ("PageFooter").offsetHeight - print.contentDocument.getElementById ("PageHeader").offsetHeight ) < (content.offsetHeight))
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
														};
														
									var contentType2 =	function ()
														{																							
															// Add styles.																		
															var styles = print.contentDocument.createElement ("style");					
															print.contentDocument.body.appendChild (styles);					
															styles.innerHTML = template.styles;
													
															// Create page.				
															var page = print.contentDocument.createElement ("div");
															page.className = "Page A4";
															print.contentDocument.body.appendChild (page);
															
															// Page
															{							
																var render = "";
																render += template.header;
																render += template.footer;									
															
																// PAGENUMBER
																{				
																	render = render.replace ("%%PAGENUMBER%%", pageCount++);
																}
																
																page.innerHTML = render;
															}
															
															// Add content holder.																						
															var content = print.contentDocument.createElement ("div")
															content.className = "PrintContent";
															content.style.top = print.contentDocument.getElementById ("PageHeader").offsetHeight;
															page.appendChild (content);
																	
															// CONTENTTYPE2
															{		
																var render = template.contenttype2.replace ("%%CONTENTTYPE2%%", template.contenttype2).replace ("%%CONTENTTYPE1%%", "");
																
																				
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
																		customeraddress += "<br>"+ customer.address2;
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
														};										
									
									contentType1 ();
									contentType2 ();
									
									return print.contentDocument.body.innerHTML;						
								};
								
				var data = render ({case: attributes.case});				
				
				var print = document.getElementById ("iframe.print");
				print.contentDocument.body.innerHTML = data;		
								
				var settings = PrintUtils.getPrintSettings ();
																																											
				settings.marginLeft = 0.5;
				settings.marginRight = 0.5;
				settings.marginTop = 0.5;
				settings.marginBottom = 0.5;
				settings.shrinkToFit = true;		
				settings.paperName =  "iso_a4";
				settings.paperWidth = 210;
				settings.paperHeight = 297
				settings.paperSizeUnit = Ci.nsIPrintSettings.kPaperSizeMillimeters;																					
			   	settings.printFrameType = Ci.nsIPrintSettings.kFramesAsIs;	
				settings.printBGImages = true;
			    settings.printBGColors = true;    	    	   
			    settings.footerStrCenter = "";
			    settings.footerStrLeft = "";
			    settings.footerStrRight = "";
			    settings.headerStrCenter = "";
			    settings.headerStrLeft = "";
			    settings.headerStrRight = "";    	
				
				settings.title = "DidiusSalesagreement";
				
				if (attributes.mail) 
				{
					var localDir = sXUL.tools.getLocalDirectory ();		
					var filename = localDir.path + app.session.pathSeperator + SNDK.tools.newGuid () +".pdf";		
							
					// Hide print dialog.
					settings.printToFile = true;    					
			    	settings.printSilent = true;
			  		settings.showPrintProgress = false;  			
					settings.outputFormat = Ci.nsIPrintSettings.kOutputFormatPDF;
				    		    		
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
				var Cc = Components.classes;
				var Ci = Components.interfaces;
				var Cu = Components.utils;
				var Cr = Components.results;
			
				var render = 	function (attributes)
								{											
									attributes.customer = didius.customer.load (attributes.settlement.customerid);
								
									var template = didius.helpers.parsePrintTemplate (didius.settings.get ({key: "didius_template_settlement"}));						
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
											render = render.replace ("%%CUSTOMERNAME%%", attributes.customer.name);
											content.innerHTML = render;
										}
								
										// CUSTOMERADDRESS
										{
											var customeraddress = attributes.customer.address1;
											
											if (attributes.customer.address2 != "")
											{
												address += "<br>"+ attributes.customer.address2;
											}
										
											render = render.replace ("%%CUSTOMERADDRESS%%", customeraddress);
											content.innerHTML = render;
										}
										
										// POSTCODE
										{
											render = render.replace ("%%CUSTOMERPOSTCODE%%", attributes.customer.postcode);
											content.innerHTML = render;
										}
										
										// CUSTOMERCITY
										{
											render = render.replace ("%%CUSTOMERCITY%%", attributes.customer.city);
											content.innerHTML = render;
										}
										
										// CUSTOMERCOUNTRY
										{
											render = render.replace ("%%CUSTOMERCOUNTRY%%", attributes.customer.country);
											content.innerHTML = render;
										}
										
										// CUSTOMERNO
										{
											render = render.replace ("%%CUSTOMERNO%%", attributes.customer.no);
											content.innerHTML = render;
										}
										
										// CUSTOMERPHONE
										{
											render = render.replace ("%%CUSTOMERPHONE%%", attributes.customer.phone);
											content.innerHTML = render;
										}
										
										// CUSTOMEREMAIL
										{
											render = render.replace ("%%CUSTOMEREMAIL%%", attributes.customer.email);
											content.innerHTML = render;
										}
										
										// AUCTIONNO
										{
			//								render = render.replace ("%%AUCTIONNO%%", attributes.invoice.auction.no);
			//								content.innerHTML = render;
										}
										
										// AUCTIONTITLE
										{
			//								render = render.replace ("%%AUCTIONTITLE%%", attributes.invoice.auction.title);
			//								content.innerHTML = render;
										}
																
										// SETTLEMENTNO
										{
											render = render.replace ("%%SETTLEMENTNO%%", attributes.settlement.no);
											content.innerHTML = render;
										}
										
										// SETTLEMENTDATE
										{															
											var date = SNDK.tools.timestampToDate (attributes.settlement.createtimestamp)
											render = render.replace ("%%SETTLEMENTDATE%%", SNDK.tools.padLeft (date.getDate (), 2, "0") +"-"+ SNDK.tools.padLeft ((date.getMonth () + 1), 2, "0") +"-"+ date.getFullYear ());
											content.innerHTML = render;				
										}
										
										// CUSTOMERBANKACCOUNT
										{
											render = render.replace ("%%CUSTOMERBANKACCOUNT%%", attributes.customer.bankregistrationno +" "+ attributes.customer.bankaccountno);
											content.innerHTML = render;
										}
								
										// ROWS
										{
											// Add data rows.
											var rows = "";	
											var count = 0;
																	
											for (var idx = from; idx < attributes.settlement.lines.length; idx++)
											{							
												var row = template.row;
												
												// TEXT
												{
													row = row.replace ("%%TEXT%%", attributes.settlement.lines[idx].text);
												}		
											
												// AMOUNT
												{
													row = row.replace ("%%AMOUNT%%", attributes.settlement.lines[idx].amount.toFixed (2));
												}
																													
												// VATAMOUNT
												{
													row = row.replace ("%%VATAMOUNT%%", attributes.settlement.lines[idx].vatamount.toFixed (2));
												}
												
												// COMMISSIONFEE
												{
													row = row.replace ("%%COMMISSIONFEE%%", attributes.settlement.lines[idx].commissionfee.toFixed (2));
												}					
												
												// VATCOMMISSIONFEE
												{
													row = row.replace ("%%VATCOMMISSIONFEE%%", attributes.settlement.lines[idx].vatcommissionfee.toFixed (2));
												}					
												
												// TOTAL
												{
													row = row.replace ("%%TOTAL%%", attributes.settlement.lines[idx].total.toFixed (2));
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
											render = render.replace ("%%TOTALSALE%%", parseInt (attributes.settlement.sales).toFixed (2));
											render = render.replace ("%%TOTALCOMMISSIONFEE%%", parseInt (attributes.settlement.commissionfee).toFixed (2));
											render = render.replace ("%%TOTALVAT%%", parseInt (attributes.settlement.vat).toFixed (2));
											render = render.replace ("%%TOTALTOTAL%%", parseInt (attributes.settlement.total).toFixed (2));
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
									while (c < attributes.settlement.lines.length)
									{							
									 	c += page (c);				 				
									}	
							
									var result = print.contentDocument.body.innerHTML;
									
									app.mainWindow.document.getElementById ("PrintHolder").removeChild (print);
									
									return result;
								};
			
				var data = "";
																						
				if (attributes.settlement)
				{
					data = render ({settlement: attributes.settlement});
				}
				else if (attributes.settlement)
				{
					for (index in attributes.settlement)
					{
						data += render ({invoice: attributes.settlements[index]});
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
					var filename = localDir.path + app.session.pathSeperator + attributes.settlement.id +".pdf";
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
											sXUL.tools.fileUpload ({postUrl: didius.runtime.ajaxUrl, fieldName: "file", filePath: filename, additionalFields: {cmd: "function", "cmd.function": "Didius.Helpers.MailSettlement", settlementid: attributes.settlement.id, customerid: attributes.settlement.customerid, auctionid: attributes.settlement.auctionid}, onLoad: onLoad, onProgress: onProgress, onError: onError});
											//sXUL.tools.fileUpload ({postUrl: didius.runtime.ajaxUrl, fieldName: "file", filePath: filename, additionalFields: {cmd: "function", "cmd.function": "Didius.Helpers.MailInvoice", invoiceid: attributes.invoice.id}, onLoad: onLoad, onProgress: onProgress, onError: onError});
										}
										
										setTimeout (worker, 5000);																																
									};
						
					sXUL.tools.print ({contentWindow: print.contentWindow, settings: settings, onDone: onDone, onError: attributes.onError});
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
				
					sXUL.tools.print ({contentWindow: print.contentWindow, settings: settings, onDone: attributes.onDone, onError: attributes.onError});				
				}		
			}
			,
		
			catalog : function (attributes)
			{	
				var Cc = Components.classes;
				var Ci = Components.interfaces;
				var Cu = Components.utils;
				var Cr = Components.results;
			
				var render = 	function (attributes)
								{						
									var items = didius.item.list ({auction: attributes.auction});			
									SNDK.tools.sortArrayHash (items, "catalogno", "numeric");				
														
									var template;
									if (attributes.template == "large")
									{
										template = didius.helpers.parsePrintTemplate (didius.settings.get ({key: "didius_template_cataloglarge"}));							
									}
									else if (attributes.template == "small")
									{
										template = didius.helpers.parsePrintTemplate (didius.settings.get ({key: "didius_template_catalogsmall"}));
									}
																																																			
									
									var print = document.getElementById ("iframe.print");
									print.contentDocument.body.innerHTML = " ";
									
									var pageCount = 1;
									
									var cases = new Array ();
									var bids = new Array ();
									
									var contentType1 = 	function ()
														{												
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
																
																// Page
																{							
																	var render = "";
																	render += template.header;
																	render += template.footer;									
																
																	// PAGENUMBER
																	{				
																		render = render.replace ("%%PAGENUMBER%%", pageCount++);
																	}
																	
																	// AUCTIONBEGIN
																	{																											
																		var begin = new Date (Date.parse (main.auction.begin));
																		render = render.replace ("%%AUCTIONBEGIN%%", begin.getDate () +"-"+ (begin.getMonth () + 1)  +"-"+ begin.getFullYear ());				
																	}			
			
																	// AUCTIONBEGINTIME	
																	{															
																		var begin = new Date (Date.parse (main.auction.begin));																			
																		render = render.replace ("%%AUCTIONBEGINTIME%%", SNDK.tools.padLeft (begin.getHours (), 2, "0") +":"+ SNDK.tools.padLeft (begin.getMinutes (), 2, "0"));														
																	}	
																															
																	page.innerHTML = render;
																}
																
																// Add content holder.																						
																var content = print.contentDocument.createElement ("div")
																content.className = "PrintContent";
																content.style.top = print.contentDocument.getElementById ("PageHeader").offsetHeight;
																page.appendChild (content);
			
																var render = template.contenttype1.replace ("%%CONTENTTYPE1%%", template.contenttype1).replace ("%%CONTENTTYPE2%%", "");
										
																content.innerHTML = render;	
																
																// ROWS
																{
																	// Add data rows.
																	var rows = "";	
																	var count = 0;				
																	for (var idx = from; idx < items.length; idx++)
																	{							
																		var item = items[idx];				
																																
																		if (cases[item.caseid] == null)
																		{																
																			cases[item.caseid] = didius.case.load ({id: item.caseid});
																		}
																		
																		var case_ = cases[item.caseid];
																		
																		var customer = app.data.customers[case_.customerid];																													
																																																																									
																		var row = template.row;
																
																		// ITEMCATALOGNO
																		{
																			row = row.replace ("%%ITEMCATALOGNO%%", item.catalogno);
																		}
																
																		// ITEMNO
																		{
																			row = row.replace ("%%ITEMNO%%", item.no);
																		}
																
																		// ITEMDESCRIPTION
																		{
																			row = row.replace ("%%ITEMDESCRIPTION%%", item.description);
																		}
																
																		// ITEMVAT
																		{
																			var vat = "";
																			if (item.vat)
																			{					
																				row = row.replace ("%%ITEMVAT%%", "&#10004;");
																			}
																			else
																			{
																				row = row.replace ("%%ITEMVAT%%", "");
																			}
																		}
																
																		// ITEMAPPRAISAL1
																		{
																			row = row.replace ("%%ITEMAPPRAISAL1%%", item.appraisal1);
																		}
																		
																		// ITEMAPPRAISAL2
																		{
																			row = row.replace ("%%ITEMAPPRAISAL2%%", item.appraisal2);
																		}
																		
																		// ITEMAPPRAISAL3
																		{
																			row = row.replace ("%%ITEMAPPRAISAL3%%", item.appraisal3);
																		}
																		
																		// ITEMMINIMUMBID
																		{
																			row = row.replace ("%%ITEMMINIMUMBID%%", item.minimumbid);
																		}
																		
																		// CUSTOMERNAME
																		{
																			row = row.replace ("%%CUSTOMERNAME%%", customer.name);
																		}
																		
																		// CUSTOMERNO
																		{
																			row = row.replace ("%%CUSTOMERNO%%", customer.no);
																		}
																		
																		// CUSTOMERPHONE
																		{
																			row = row.replace ("%%CUSTOMERPHONE%%", customer.phone);
																		}
																		
																		// CUSTOMEREMAIL
																		{
																			row = row.replace ("%%CUSTOMEREMAIL%%", customer.email);
																		}
																				
																		// BID / BUYER								
																		{
																			var bidcustomername = "";
																			var bidcustomerno = "";
																			var bidamount = 0;
																		
																			if (item.currentbidid != SNDK.tools.emptyGuid)
																			{
																				if (bids[item.currentbidid] == null)
																				{																
																					bids[item.currentbidid] = didius.bid.load ({id: item.currentbidid});
																				}
																																																																
																				var bid = bids[item.currentbidid];
																				
																				bidcustomername = bid.customer.name;
																				bidcustomerno = bid.customer.no;
																				bidamount = bid.amount;
																			}																
																			
																			// BIDCUSTOMERNAME
																			{
																				row = row.replace ("%%BIDCUSTOMERNAME%%", bidcustomername);
																			}
																				
																			// BIDCUSTOMERNO
																			{						
																				row = row.replace ("%%BIDCUSTOMERNO%%", bidcustomerno);
																			}
																				
																			// BIDAMOUNT
																			{
																				row = row.replace ("%%BIDAMOUNT%%", bidamount);
																			}
																		}
																												
																		content.innerHTML = render.replace ("%%ROWS%%", rows + row);																									
																											
																		if ((page.offsetHeight - print.contentDocument.getElementById ("PageFooter").offsetHeight - print.contentDocument.getElementById ("PageHeader").offsetHeight ) < (content.offsetHeight))
																		{   
																			render = render.replace ("%%ROWS%%", rows);
																			content.innerHTML = render;
																			break;										
																		}												
																																															
																		rows += row;																										
																		count++;	
																		
																		app.thread.update ();						
																	}																		
																
																	render = render.replace ("%%ROWS%%", rows);											
																	content.innerHTML = render;
																}
																
																return count;	
															}		
																	
															var output = "";
															var c = 0;		
															while (c < items.length)
															{							
												 				c += page (c);	
												 				
												 				output += print.contentDocument.body.innerHTML;
									 							print.contentDocument.body.innerHTML = " ";
									 							
									 							app.thread.update ();							 	
									 							attributes.progressWindow.document.getElementById ("description1").textContent = "Generere sider ...";
									 							attributes.progressWindow.document.getElementById ("progressmeter1").mode = "determined";
																attributes.progressWindow.document.getElementById ("progressmeter1").value = (c / items.length) * 100;
															}	
															
															return output;
														};		
											
										return contentType1 ();			
								};
			
				var data = render ({auction: attributes.auction, template: attributes.template, progressWindow: attributes.progressWindow});		
				
				var print = document.getElementById ("iframe.print");
				print.contentDocument.body.innerHTML = data;		
								
				var settings = PrintUtils.getPrintSettings ();
																																											
				settings.marginLeft = 0.0;
				settings.marginRight = 0.0;
				settings.marginTop = 0.0;
				settings.marginBottom = 0.0;
				settings.shrinkToFit = true;		
				settings.paperName =  "iso_a4";
				settings.paperWidth = 210;
				settings.paperHeight = 297
				settings.paperSizeUnit = Ci.nsIPrintSettings.kPaperSizeMillimeters;																					
			   	settings.printFrameType = Ci.nsIPrintSettings.kFramesAsIs;	
				settings.printBGImages = true;
			    settings.printBGColors = true;    	    	   
			    settings.footerStrCenter = "";
			    settings.footerStrLeft = "";
			    settings.footerStrRight = "";
			    settings.headerStrCenter = "";
			    settings.headerStrLeft = "";
			    settings.headerStrRight = "";    	
				
				settings.title = "DidiusCatalog";
				
				attributes.progressWindow.document.getElementById ("description1").textContent = "Udskriver sider ...";
			 	attributes.progressWindow.document.getElementById ("progressmeter1").mode = "undetermined";
				attributes.progressWindow.document.getElementById ("progressmeter1").value = 0;
					
				if (attributes.mail) 
				{
					var localDir = sXUL.tools.getLocalDirectory ();
					//var filename = localDir.path + app.session.pathSeperator +"temp"+ app.session.pathSeperator + main.current.id;
					var filename = localDir.path + app.session.pathSeperator + attributes.creditnote.id +".pdf";
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
			    	settings.title = "Didius Catalog";    		
			
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
											sXUL.tools.fileUpload ({postUrl: didius.runtime.ajaxUrl, fieldName: "file", filePath: filename, additionalFields: {cmd: "function", "cmd.function": "Didius.Helpers.MailCreditnote", creditnoteid: attributes.creditnote.id, customerid: attributes.creditnote.customerid}, onLoad: onLoad, onProgress: onProgress, onError: onError});
											//sXUL.tools.fileUpload ({postUrl: didius.runtime.ajaxUrl, fieldName: "file", filePath: filename, additionalFields: {cmd: "function", "cmd.function": "Didius.Helpers.MailInvoice", invoiceid: attributes.invoice.id}, onLoad: onLoad, onProgress: onProgress, onError: onError});
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
		
			turnoverReport : function (attributes)
			{	
				var Cc = Components.classes;
				var Ci = Components.interfaces;
				var Cu = Components.utils;
				var Cr = Components.results;
			
				var render = 	function (attributes)
								{											
									var template = didius.helpers.parsePrintTemplate (didius.settings.get ({key: "didius_template_turnoverreport"}));
									
									var print = document.getElementById ("iframe.print");
									print.contentDocument.body.innerHTML = " ";
															
									var rows = new Array ();						
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
										var render = template.page.replace ("%%PAGENUMMER%%", pageCount++);					
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
										
										// ROWS
										{
											// Add data rows.
											var blabla = "";	
											var count = 0;
																	
											for (var index = from; index < rows.length; index++)
											{																	
												var row = rows[index];
												
												if (row == "NEWPAGE")
												{
													render = render.replace ("%%ROWS%%", blabla);															
													content.innerHTML = render;
													count++;
													break;
												}
																													
												content.innerHTML = render.replace ("%%ROWS%%", blabla + row);
												app.thread.update ();	
																																		
												if (content.offsetHeight > (maxHeight2))
												{						
													render = render.replace ("%%ROWS%%", blabla);															
													content.innerHTML = render;
													break;	
												}
																									
												blabla += row;																	
												count++;											
											}
										}
																
										return count;				
									}
																											
									for (var index in attributes.turnoverReport.buyers)
									{
										var buyer = attributes.turnoverReport.buyers[index];														
										
										// INFO
										{
											var row = template.buyerinforow;
											var customer = app.data.customers[buyer.id];								
											
											// CUSTOMERNO
											{
												row = row.replace ("%%CUSTOMERNO%%", customer.no);
											}
											
											// CUSTOMERNAME
											{
												row = row.replace ("%%CUSTOMERNAME%%", customer.name);
											}
											
											// CUSTOMERADDRESS
											{
												var address = customer.address1 +" "+ customer.address2
												row = row.replace ("%%CUSTOMERADDRESS%%", address);
											}
											
											// CUSTOMERPOSTCODE CUSTOMERCITY
											{
												row = row.replace ("%%CUSTOMERPOSTCODE%%", customer.postcode);
												row = row.replace ("%%CUSTOMERCITY%%", customer.city);
											}
											
											// CUSTOMERPHONE
											{
												row = row.replace ("%%CUSTOMERPHONE%%", customer.phone);
											}								
																							
											rows[rows.length] = row;
										}
										
										// ITEMS
										{							
											for (var index in attributes.turnoverReport.buyerlines)
											{
												var line = attributes.turnoverReport.buyerlines[index];
												
												if (line.customerid == buyer.id)
												{
													var row = template.buyeritemrow;
													
													// ITEM
													{
														// LINECATALOGNO
														{
															row = row.replace ("%%LINECATALOGNO%%", line.catalogno )
														}
														
														// LINETEXT
														{
															row = row.replace ("%%LINETEXT%%", line.text)
														}
														
														// LINEAMOUNT
														{
															row = row.replace ("%%LINEAMOUNT%%", line.amount.toFixed (2) +" kr.")
														}
														
														// LINEVATAMOUNT
														{
															row = row.replace ("%%LINEVATAMOUNT%%", line.vatamount.toFixed (2) +" kr.")
														}
														
														// LINECOMMISSIONFEE
														{
															row = row.replace ("%%LINECOMMISSIONFEE%%", line.commissionfee.toFixed (2) +" kr.")
														}
																																				
														// LINEVATCOMMISSIONFEE
														{
															row = row.replace ("%%LINEVATCOMMISSIONFEE%%", line.vatcommissionfee.toFixed (2) +" kr.")
														}										
														
														// LINETOTAL
														{
															row = row.replace ("%%LINETOTAL%%", line.total.toFixed (2) +" kr.")
														}										
													}
																
													rows[rows.length] = row;		
												}																																			
											}														
										}
										
										// TOTAL
										{							
											var row = template.buyertotalrow;
											
											// AMOUNT
											{
												row = row.replace ("%%BUYERAMOUNT%%", buyer.amount.toFixed (2) +" kr.");
											}
											
											// VATAMOUNT
											{
												row = row.replace ("%%BUYERVATAMOUNT%%", buyer.amount.toFixed (2) +" kr.");
											}
											
											// COMMISSIONFEE
											{
												row = row.replace ("%%BUYERCOMMISSFIONFEE%%", buyer.commissionfee.toFixed (2) +" kr.");
											}
											
											// VATCOMMISSIONFEE
											{
												row = row.replace ("%%BUYERVATCOMMISSFIONFEE%%", buyer.commissionfee.toFixed (2) +" kr.");
											}
											
											// TOTAL
											{
												row = row.replace ("%%BUYERTOTAL%%", buyer.total.toFixed (2) +" kr.");
											}								
																							
											rows[rows.length] = row;
										}														
									}
									
									rows[rows.length] = "NEWPAGE";
									
									for (var index in attributes.turnoverReport.sellers)
									{
										var seller = attributes.turnoverReport.sellers[index];
										
										// INFO
										{
											var row = template.sellerinforow;
											var customer = app.data.customers[seller.id];								
											
											// CUSTOMERNO
											{
												row = row.replace ("%%CUSTOMERNO%%", customer.no);
											}
											
											// CUSTOMERNAME
											{
												row = row.replace ("%%CUSTOMERNAME%%", customer.name);
											}
											
											// CUSTOMERADDRESS
											{
												var address = customer.address1 +" "+ customer.address2
												row = row.replace ("%%CUSTOMERADDRESS%%", address);
											}
											
											// CUSTOMERPOSTCODE CUSTOMERCITY
											{
												row = row.replace ("%%CUSTOMERPOSTCODE%%", customer.postcode);
												row = row.replace ("%%CUSTOMERCITY%%", customer.city);
											}
											
											// CUSTOMERPHONE
											{
												row = row.replace ("%%CUSTOMERPHONE%%", customer.phone);
											}								
																							
											rows[rows.length] = row;
										}
										
										// ITEMS
										{							
											for (var index in attributes.turnoverReport.sellerlines)
											{
												var line = attributes.turnoverReport.sellerlines[index];
												
												if (line.customerid == seller.id)
												{
													var row = template.selleritemrow;
													
													// ITEM
													{
														// LINECATALOGNO
														{
															row = row.replace ("%%LINECATALOGNO%%", line.catalogno )
														}
														
														// LINETEXT
														{
															row = row.replace ("%%LINETEXT%%", line.text)
														}
														
														// LINEAMOUNT
														{
															row = row.replace ("%%LINEAMOUNT%%", line.amount.toFixed (2) +" kr.")
														}
														
														// LINEVATAMOUNT
														{
															row = row.replace ("%%LINEVATAMOUNT%%", line.vatamount.toFixed (2) +" kr.")
														}
														
														// LINECOMMISSIONFEE
														{
															row = row.replace ("%%LINECOMMISSIONFEE%%", line.commissionfee.toFixed (2) +" kr.")
														}
																																				
														// LINEVATCOMMISSIONFEE
														{
															row = row.replace ("%%LINEVATCOMMISSIONFEE%%", line.vatcommissionfee.toFixed (2) +" kr.")
														}										
														
														// LINETOTAL
														{
															row = row.replace ("%%LINETOTAL%%", line.total.toFixed (2) +" kr.")
														}										
													}
																
													rows[rows.length] = row;									
												}																		
											}																
										}
										
										// TOTAL
										{							
											var row = template.sellertotalrow;
											
											// AMOUNT
											{
												row = row.replace ("%%SELLERAMOUNT%%", seller.amount.toFixed (2) +" kr.");
											}
											
											// VATAMOUNT
											{
												row = row.replace ("%%SELLERVATAMOUNT%%", seller.amount.toFixed (2) +" kr.");
											}
											
											// COMMISSIONFEE
											{
												row = row.replace ("%%SELLERCOMMISSFIONFEE%%", seller.commissionfee.toFixed (2) +" kr.");
											}
											
											// VATCOMMISSIONFEE
											{
												row = row.replace ("%%SELLERVATCOMMISSFIONFEE%%", seller.commissionfee.toFixed (2) +" kr.");
											}
											
											// TOTAL
											{
												row = row.replace ("%%SELLERTOTAL%%", seller.total.toFixed (2) +" kr.");
											}								
																							
											rows[rows.length] = row;
										}														
									}						
																
									rows[rows.length] = "NEWPAGE";
									
									// NOTSOLD
									{							
										for (var index in attributes.turnoverReport.notsoldlines)
										{
											var line = attributes.turnoverReport.notsoldlines[index];
												
											var row = template.notsoldrow;
													
											// LINECATALOGNO
											{
												row = row.replace ("%%LINECATALOGNO%%", line.catalogno);
											}
														
											// LINETEXT
											{
												row = row.replace ("%%LINETEXT%%", line.text);
											}
											
											// CUSTOMER
											{
												//var customer = didius.customer.load (line.customerid);
												var customer = app.data.customers[line.customerid];
												
												// CUSTOMERNAME
												{
													row = row.replace ("%%CUSTOMERNAME%%", customer.name);
												}
												
												// CUSTOMERPHONE
												{
													row = row.replace ("%%CUSTOMERPHONE%%", customer.phone);	
												}
											}
																										
											rows[rows.length] = row;																																	
										}
									}
																																		
									rows[rows.length] = "NEWPAGE";
									
									// TOTAL
									{
										var row = template.totalrow;
										
										// BUYERAMOUNT
										{
											row = row.replace ("%%BUYERAMOUNT%%", attributes.turnoverReport.buyeramount.toFixed (2) +" kr.");
										}
										
										// BUYERVATAMOUNT
										{
											row = row.replace ("%%BUYERVATAMOUNT%%", attributes.turnoverReport.buyervatamount.toFixed (2) +" kr.");
										}
										
										// BUYERCOMMISSIONFEE
										{
											row = row.replace ("%%BUYERCOMMISSIONFEE%%", attributes.turnoverReport.buyercommissionfee.toFixed (2) +" kr.");
										}
										
										// BUYERVATCOMMISSIONFEE
										{
											row = row.replace ("%%BUYERVATCOMMISSIONFEE%%", attributes.turnoverReport.buyervatcommissionfee.toFixed (2) +" kr.");
										}
										
										// BUYERTOTAL
										{
											row = row.replace ("%%BUYERTOTAL%%", attributes.turnoverReport.buyertotal.toFixed (2) +" kr.");
										}
										
										// SELLERAMOUNT
										{
											row = row.replace ("%%SELLERAMOUNT%%", attributes.turnoverReport.selleramount.toFixed (2) +" kr.");
										}
										
										// SELLERVATAMOUNT
										{
											row = row.replace ("%%SELLERVATAMOUNT%%", attributes.turnoverReport.sellervatamount.toFixed (2) +" kr.");
										}
										
										// SELLERCOMMISSIONFEE
										{
											row = row.replace ("%%SELLERCOMMISSIONFEE%%", attributes.turnoverReport.sellercommissionfee.toFixed (2) +" kr.");
										}
										
										// SELLERVATCOMMISSIONFEE
										{
											row = row.replace ("%%SELLERVATCOMMISSIONFEE%%", attributes.turnoverReport.sellervatcommissionfee.toFixed (2) +" kr.");
										}
										
										// SELLERTOTAL
										{
											row = row.replace ("%%SELLERTOTAL%%", attributes.turnoverReport.sellertotal.toFixed (2) +" kr.");
										}
										
										// NETTO
										{
											row = row.replace ("%%NETTO%%", attributes.turnoverReport.netto.toFixed (2) +" kr.");
										}
										
										rows[rows.length] = row;
									}
																																																														
									var output = "";																																																																																																																																				
									var c = page (0);
									while (c < rows.length)
									{							
									 	c += page (c);			
									 	
									 	output += print.contentDocument.body.innerHTML;						 	
									 	print.contentDocument.body.innerHTML = " ";
									 	app.thread.update ();	
									 	
									 	attributes.progressWindow.document.getElementById ("description1").textContent = "Generere sider ...";
									 	attributes.progressWindow.document.getElementById ("progressmeter1").mode = "determined";
										attributes.progressWindow.document.getElementById ("progressmeter1").value = (c / rows.length) * 100;
									}	
								
									return output;
								};
				
				var print = document.getElementById ("iframe.print");
				print.contentDocument.body.innerHTML = render ({turnoverReport: attributes.report, progressWindow: attributes.progressWindow});
										
				var settings = PrintUtils.getPrintSettings ();
																																											
				settings.marginLeft = 0.5;
				settings.marginRight = 0.5;
				settings.marginTop = 0.5;
				settings.marginBottom = 0.5;
				settings.shrinkToFit = true;		
				settings.paperName =  "iso_a4";
				settings.paperWidth = 210;
				settings.paperHeight = 297
				settings.paperSizeUnit = Ci.nsIPrintSettings.kPaperSizeMillimeters;																					
			   	settings.printFrameType = Ci.nsIPrintSettings.kFramesAsIs;	
				settings.printBGImages = true;
			    settings.printBGColors = true;    	    	   
			    settings.footerStrCenter = "";
			    settings.footerStrLeft = "";
			    settings.footerStrRight = "";
			    settings.headerStrCenter = "";
			    settings.headerStrLeft = "";
			    settings.headerStrRight = "";    	
				
				settings.title = "Omsætningsliste";
				
				attributes.progressWindow.document.getElementById ("description1").textContent = "Udskriver sider ...";
			 	attributes.progressWindow.document.getElementById ("progressmeter1").mode = "undetermined";
				attributes.progressWindow.document.getElementById ("progressmeter1").value = 0;
									
				if (attributes.mail) 
				{
					var localDir = sXUL.tools.getLocalDirectory ();
					//var filename = localDir.path + app.session.pathSeperator +"temp"+ app.session.pathSeperator + main.current.id;
					var filename = localDir.path + app.session.pathSeperator + attributes.auction.id +".pdf";
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
			    	settings.title = "DidiusTurnoverReport";    		
			
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
											sXUL.tools.fileUpload ({postUrl: didius.runtime.ajaxUrl, fieldName: "file", filePath: filename, additionalFields: {cmd: "function", "cmd.function": "Didius.Helpers.MailSettlement", settlementid: attributes.settlement.id, customerid: attributes.settlement.customerid, auctionid: attributes.settlement.auctionid}, onLoad: onLoad, onProgress: onProgress, onError: onError});
											//sXUL.tools.fileUpload ({postUrl: didius.runtime.ajaxUrl, fieldName: "file", filePath: filename, additionalFields: {cmd: "function", "cmd.function": "Didius.Helpers.MailInvoice", invoiceid: attributes.invoice.id}, onLoad: onLoad, onProgress: onProgress, onError: onError});
										}
										
										setTimeout (worker, 5000);																																
									};
						
					sXUL.tools.print ({contentWindow: print.contentWindow, settings: settings, onDone: onDone, onError: attributes.onError});
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
				
					sXUL.tools.print ({contentWindow: print.contentWindow, settings: settings, onDone: attributes.onDone, onError: attributes.onError});				
				}		
			}
			,
		
			label : function (attributes)
			{	
				var Cc = Components.classes;
				var Ci = Components.interfaces;
				var Cu = Components.utils;
				var Cr = Components.results;
			
				var render = 	function (attributes)
								{											
									//attributes.customer = didius.customer.load (attributes.invoice.customerid);
								
									var template = didius.helpers.parsePrintTemplate (didius.settings.get ({key: "didius_template_label"}));					
									//var template = didius.helpers.parsePrintTemplate (sXUL.tools.fileToString ("chrome://didius/content/templates/label.tpl"));
				
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
			//							var maxHeight = page.offsetHeight 
			//							var maxHeight2 = page.offsetHeight;
																												
										// ITEMNO
										{
											render = render.replace ("%%ITEMNO%%", attributes.item.no);
											content.innerHTML = render;
										}										
										
										// ITEMCATALOGNO
										{
											render = render.replace ("%%ITEMCATALOGNO%%", attributes.item.catalogno);
											content.innerHTML = render;
										}										
										
										// ITEMDESCRIPTION
										{
											render = render.replace ("%%ITEMDESCRIPTION%%", attributes.item.description);
											content.innerHTML = render;
										}																	
										
																								
									//	return count;				
									}
			
									page ();																																																			
																																																																																																																																																									
									var result = print.contentDocument.body.innerHTML;
									app.mainWindow.document.getElementById ("PrintHolder").removeChild (print);
									return result;
								};
			
				var data = "";
																						
			//	if (attributes.invoice)
			//	{
					//data = render ({invoice: attributes.invoice});
					
					for (var index in attributes.items)
					{		
						data += render ({item: attributes.items[index]});
					}
			//	}
			//	else if (attributes.invoices)
			//	{
			//		for (index in attributes.invoices)
			//		{
			//			data += render ({invoice: attributes.invoices[index]});
			//		}			
			//	}
				
				//var template = didius.helpers.parsePrintTemplate (sXUL.tools.fileToString ("chrome://didius/content/templates/invoice.tpl"));										
				var print = app.mainWindow.document.createElement ("iframe");
				app.mainWindow.document.getElementById ("PrintHolder").appendChild (print);
					
				print.contentDocument.body.innerHTML = data;
								
				var settings = PrintUtils.getPrintSettings ();
						
				//ppd_17x54					
				//ppd_17x87
				//ppd_23x23
				//ppd_29x42
				//ppd_29x90
				//ppd_38x90
				//ppd_39x48
				//ppd_52x29
				//ppd_62x29
				//ppd_62x100
				//ppd_12Dia
				//ppd_24Dia
				//ppd_12X1
				//ppd_29X1
				//ppd_62X1
				//ppd_12X2
				//ppd_29X2
				//ppd_62X2
				//ppd_12X3
				//ppd_29X3
				//ppd_62X3
				//ppd_12X4
				//ppd_29X4
				//ppd_62X4
				//ppd_50X1
				//ppd_54X1
				//ppd_54X1
				//ppd_38X1
				//ppd_23x23
				//ppd_39x48
				//ppd_52x29
				//ppd_38X2
				//ppd_50X2
				//ppd_54X2
				//ppd_38X3
				//ppd_50X3
				//ppd_54X3
				//ppd_38X4
				//ppd_50X4
				//ppd_54X4
				
																																																																																																											
			//	settings.marginLeft = 0.28;
			//	settings.marginRight = 0.29;
			//	settings.marginTop = 0.14;
			//	settings.marginBottom = 0.14;
				settings.shrinkToFit = true;
			
				settings.marginLeft = 0;
				settings.marginRight = 0;
				settings.marginTop = 0;
				settings.marginBottom = 0;
			
						
				settings.unwriteableMarginTop = 0;
			    settings.unwriteableMarginRight = 0;
			    settings.unwriteableMarginBottom = 0;
			    settings.unwriteableMarginLeft = 0;
			
					
				settings.orientation = Ci.nsIPrintSettings.kLandscapeOrientation;
				settings.paperSizeUnit = Ci.nsIPrintSettings.kPaperSizeMillimeters;
				//settings.paperName = "ppd_62x29";
				//settings.paperWidth = 62;
				//settings.paperHeight = 100;
				
				settings.paperWidth = 29;
				settings.paperHeight = 100;
				settings.orientation = 1;
				
				//settings.setPaperSizeType = Ci.nsIPrintSettings.kPaperSizeDefined;  	
			  	//settings.setPaperSize = Ci.nsIPrintSettings.kPaperSizeNativeData;
				
				
				
				
					
				//attributes = {};
					
				if (attributes.mail) 
				{
					var localDir = sXUL.tools.getLocalDirectory ();
					//var filename = localDir.path + app.session.pathSeperator +"temp"+ app.session.pathSeperator + main.current.id;
					var filename = localDir.path + app.session.pathSeperator + attributes.invoice.id +".pdf";
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
						
					sXUL.tools.print ({contentWindow: print.contentWindow, settings: settings, onDone: onDone, onError: attributes.onError});
				}
				else
				{
					var onDone =	function ()
									{																																																	
										if (attributes.onDone != null)
										{							
											setTimeout (attributes.onDone, 0);
										}
									};
											
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



