

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
			
	var onCustomerCreate =	function (data)
							{
								didius.eventListener.update (app.session.eventListenerId, "onCustomerCreate", data.id);
							};
							
	var onCustomerSave =	function (data)
							{
								didius.eventListener.update (app.session.eventListenerId, "onCustomerSave", data.id);
							};
	
	var onCustomerDestroy =	function (data)
							{
								didius.eventListener.update (app.session.eventListenerId, "onCustomerDestroy", data.id);
							};
	
	app.events.onCustomerCreate.addHandler (onCustomerCreate);
	app.events.onCustomerSave.addHandler (onCustomerSave);
	app.events.onCustomerDestroy.addHandler (onCustomerDestroy);

	 
	 //	 	 dump(didius.runtime.ajaxUrl);		
}



