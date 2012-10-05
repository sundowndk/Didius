

ajaxUrl : "http://sorentotest.sundown.dk/",
ajaxUrl1 : "http://78.109.223.248/",


events :
{
	onCustomerCreate : new event (),
	onCustomerLoad : new event (),
	onCustomerSave : new event (),	
	onCustomerDestroy : new event ()
},

initialize : function ()
{
	app.events.onCustomerCreate = new sXUL.event ({id: "onCustomerCreate", remotePropagation: true});
	app.events.onCustomerLoad = new sXUL.event ({id: "onCustomerLoad", remotePropagation: true});
	app.events.onCustomerSave = new sXUL.event ({id: "onCustomerSave", remotePropagation: true});
	app.events.onCustomerDestroy = new sXUL.event ({id: "onCustomerDestroy", remotePropagation: true});
	
	app.events.onUserCreate = new sXUL.event ({id: "onUserCreate", remotePropagation: true});
	app.events.onUserLoad = new sXUL.event ({id: "onUserLoad", remotePropagation: true});
	app.events.onUserSave = new sXUL.event ({id: "onUserSave", remotePropagation: true});
	app.events.onUserDestroy = new sXUL.event ({id: "onUserDestroy", remotePropagation: true});
			
//	var onCustomerCreate =	function (eventData)
//							{			
//								if (!eventData.SXULREMOTEEVENT)					
//									sXUL.eventListener.update ({id: app.session.eventListenerId, eventId: "onCustomerCreate", eventData: eventData});
//							};
//							
//	var onCustomerSave =	function (eventData)
//							{											
//								if (!eventData.SXULREMOTEEVENT)					
//									sXUL.eventListener.update ({id: app.session.eventListenerId, eventId: "onCustomerSave", eventData: eventData});
//							};
//	
//	var onCustomerDestroy =	function (eventData)
//							{
//								if (!eventData.SXULREMOTEEVENT)					
//									sXUL.eventListener.update ({id: app.session.eventListenerId, eventId: "onCustomerDestroy", eventData: eventData});
//							};
//	
//	app.events.onCustomerCreate.addHandler (onCustomerCreate);
//	app.events.onCustomerSave.addHandler (onCustomerSave);
//	app.events.onCustomerDestroy.addHandler (onCustomerDestroy);

	 
	 //	 	 dump(didius.runtime.ajaxUrl);		
}



