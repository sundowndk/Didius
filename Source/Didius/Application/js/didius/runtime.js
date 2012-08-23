

ajaxUrlTest : "http://sorentotest.sundown.dk/",
ajaxUrl : "http://172.20.19.53/",

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



