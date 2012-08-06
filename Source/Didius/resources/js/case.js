type : "didius.case",

create : function (Customer)
{
	var content = new Array ();
	content["customerid"] = Customer.id;

	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Case.Create", "data", "POST", false);	
	request.send (content);
	
	return request.respons ()[didius.case.type];
},
	
load : function (id)
{
	var content = new Array ();
	content["id"] = id;

	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Case.Load", "data", "POST", false);		
	request.send (content);

	return request.respons ()[didius.case.type];
},
		
save : function (template)
{	
	var content = new Array ();
	content[didius.case.type] = template;
								
	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Case.Save", "data", "POST", false);	
	request.send (content);

	return true;
},		

destory : function (id)
{
	var content = new Array ();
	content["id"] = id;

	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Case.Destroy", "data", "POST", false);	
	request.send (content);
			
	return true;
},				
		
list : function (attributes)
{
	if (!attributes) attributes = new Array ();
	
	if (attributes.async)
	{
		var onDone = 	function (respons)
						{
							attributes.onDone (respons[didius.customer.type +"s"]);
						};
		
		var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Customer.List", "data", "POST", true);
		request.onLoaded (onDone);
		request.send ();						
	}
	else
	{
		var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Customer.List", "data", "POST", false);		
		request.send ();

		return request.respons ()[didius.customer.type +"s"];		
	}
}	



