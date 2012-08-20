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
		
		
		ajaxUrl : "http://sorentotest.sundown.dk/",
		
		initialize : function ()
		{
			 dump(didius.runtime.ajaxUrl);
			 
			 
		
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
			
			return request.respons ()["didius.customer"];
		},
			
		load : function (id)
		{
			var content = new Array ();
			content["id"] = id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Customer.Load", "data", "POST", false);		
			request.send (content);
		
			return request.respons ()["didius.customer"];
		},
				
		save : function (Customer)
		{	
			var content = new Array ();
			content["didius.customer"] = Customer;
										
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Customer.Save", "data", "POST", false);	
			request.send (content);
		},		
		
		destroy : function (id)
		{
			var content = new Array ();
			content["id"] = id;
			
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Customer.Destroy", "data", "POST", false);	
			request.send (content);
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
			var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.CustomerGroup.Create", "data", "POST", false);	
			request.send ();
			
			return request.respons ()["didius.customergroup"];
		},
			
		load : function (id)
		{
			var content = new Array ();
			content["id"] = id;
		
			var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.CustomerGroup.Load", "data", "POST", false);		
			request.send (content);
		
			return request.respons ()["didius.customergroup"];
		},
				
		save : function (CustomerGroup)
		{	
			var content = new Array ();
			content["didius.customergroup"] = CustomerGroup;
										
			var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.CustomerGroup.Save", "data", "POST", false);	
			request.send (content);
		
			return true;
		},		
		
		destroy : function (id)
		{
			var content = new Array ();
			content["id"] = id;
		
			try
			{
				var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.CustomerGroup.Destroy", "data", "POST", false);	
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
			
				var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.CustomerGroup.List", "data", "POST", true);
				request.onLoaded (onDone);
				request.send ();						
			}
			else
			{
				var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.CustomerGroup.List", "data", "POST", false);		
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
		
			var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Item.Create", "data", "POST", false);	
			request.send (content);
			
			return request.respons ()["didius.item"];
		},
			
		load : function (id)
		{
			var content = new Array ();
			content.id = id;
		
			var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Item.Load", "data", "POST", false);		
			request.send (content);
		
			return request.respons ()["didius.item"];
		},
				
		save : function (Item)
		{	
			var content = new Array ();
			content["didius.item"] = Item;
										
			var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Item.Save", "data", "POST", false);	
			request.send (content);
		
			return true;
		},		
		
		destroy : function (id)
		{
			var content = new Array ();
			content.id = id;
		
			try
			{
				var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Item.Destroy", "data", "POST", false);	
				request.send (content);
			}
			catch (error)
			{						
				return [false, error];
			}
					
			return true;
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
				
				var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Item.List", "data", "POST", true);
				request.onLoaded (onDone);
				request.send (content);
			}
			else
			{
				var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Item.List", "data", "POST", false);		
				request.send (content);
		
				return request.respons ()["didius.items"];		
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
			
			return request.respons ()["didius.auction"];
		},
			
		load : function (id)
		{
			var content = new Array ();
			content["id"] = id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Auction.Load", "data", "POST", false);		
			request.send (content);
		
			return request.respons ()["didius.auction"];
		},
				
		save : function (Auction)
		{		
			var content = new Array ();
			content["didius.auction"] = Auction;
										
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Auction.Save", "data", "POST", false);	
			request.send (content);
		},		
		
		destroy : function (id)
		{
			var content = new Array ();
			content["id"] = id;
			
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Auction.Destroy", "data", "POST", false);	
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
		
		
	}
}

