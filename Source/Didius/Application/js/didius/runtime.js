

ajaxUrl : "http://sorentotest.sundown.dk/",

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



