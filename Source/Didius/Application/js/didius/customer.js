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


