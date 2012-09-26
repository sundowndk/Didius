

ajaxUrl : "http://sorentotest.sundown.dk/",
ajaxUrlREAL : "http://78.109.223.248/",


events :
{
	onCustomerCreate : new event (),
	onCustomerLoad : new event (),
	onCustomerSave : new event (),	
	onCustomerDestroy : new event ()
},

initialize : function ()
{
	app.events.onCustomerCreate = new event ();
	app.events.onCustomerLoad = new event ();
	app.events.onCustomerSave = new event ();
	app.events.onCustomerDestroy = new event ();
			
	var onCustomerCreate =	function (eventData)
							{
								//sXUL.eventListener.update ({id: app.session.eventListenerId, eventId: "onCustomerCreate", eventData: eventData});
							};
							
	var onCustomerSave =	function (eventData)
							{
								sXUL.eventListener.update ({id: app.session.eventListenerId, eventId: "onCustomerSave", eventData: eventData});
							};
	
	var onCustomerDestroy =	function (eventData)
							{
								sXUL.eventListener.update ({id: app.session.eventListenerId, eventId: "onCustomerDestroy", eventData: eventData});
							};
	
	app.events.onCustomerCreate.addHandler (onCustomerCreate);
	app.events.onCustomerSave.addHandler (onCustomerSave);
	app.events.onCustomerDestroy.addHandler (onCustomerDestroy);

	 
	 //	 	 dump(didius.runtime.ajaxUrl);		
}



