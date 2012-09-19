

ajaxUrlTest : "http://sorentotest.sundown.dk/",
ajaxUrl : "http://78.109.223.248/",

events :
{
	onCustomerCreate : new event (),
	onCustomerLoad : new event (),
	onCustomerSave : new event (),	
	onCustomerDestroy : new event ()
},

initialize : function ()
{
	 dump(didius.runtime.ajaxUrl);		
}



