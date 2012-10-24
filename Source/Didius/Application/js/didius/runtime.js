ajaxUrl : "http://sorentotest.sundown.dk/",
ajaxUrl1 : "http://78.109.223.248/",

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
}



