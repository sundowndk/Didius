type : "didius.customer",

create : function ()
{
	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Customer.Create", "data", "POST", false);	
	request.send ();

	return request.respons ()[type];
},
	
load : function (id)
{
	var content = new Array ();
	content["id"] = id;

	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Customer.Load", "data", "POST", false);		
	request.send (content);

	return request.respons ()[type];
},
		
save : function (template)
{	
	var content = new Array ();
	content["scms.template"] = template;
								
	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Customer.Save", "data", "POST", false);	
	request.send (content);

	return true;
},		

destory : function (id)
{
	var content = new Array ();
	content["id"] = id;

	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Customer.Destroy", "data", "POST", false);	
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
							attributes.onDone (respons[type +"s"]);
						};
		
		var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Customer.List", "data", "POST", true);
		request.onLoaded (onDone);
		request.send ();						
	}
	else
	{
		var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.Customer.List", "data", "POST", false);		
		request.send ();

		return request.respons ()[type +"s"];		
	}
}	


