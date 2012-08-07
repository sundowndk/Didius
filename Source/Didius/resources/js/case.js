create : function (Customer)
{
	var content = new Array ();
	content.customerid = Customer.id;

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

	return true;
},		

destroy : function (id)
{
	var content = new Array ();
	content.id = id;

	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Case.Destroy", "data", "POST", false);	
	request.send (content);
			
	return true;
},				
		
list : function (attributes)
{
	if (!attributes) attributes = new Array ();
	
	var content = new Array ();
	
	if (attributes.customer)
	{
		content.customerid = attributes.customer.id;
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



