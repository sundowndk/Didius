create : function ()
{
	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Customer.Create", "data", "POST", false);	
	request.send ();
	
	return request.respons ()["didius.customer"];
},
	
load : function (id)
{
	var content = new Array ();
	content["id"] = id;

	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Customer.Load", "data", "POST", false);		
	request.send (content);

	return request.respons ()["didius.customer"];
},
		
save : function (Customer)
{	
	var content = new Array ();
	content["didius.customer"] = Customer;
								
	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Customer.Save", "data", "POST", false);	
	request.send (content);
},		

destroy : function (id)
{
	var content = new Array ();
	content["id"] = id;
	
	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Customer.Destroy", "data", "POST", false);	
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
		
		var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Customer.List", "data", "POST", true);
		request.onLoaded (onDone);
		request.send ();						
	}
	else
	{
		var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Customer.List", "data", "POST", false);		
		request.send ();

		return request.respons ()["didius.customers"];		
	}
}	


