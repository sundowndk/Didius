create : function ()
{
	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.CustomerGroup.Create", "data", "POST", false);	
	request.send ();
	
	return request.respons ()["didius.customergroup"];
},
	
load : function (id)
{
	var content = new Array ();
	content["id"] = id;

	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.CustomerGroup.Load", "data", "POST", false);		
	request.send (content);

	return request.respons ()["didius.customergroup"];
},
		
save : function (CustomerGroup)
{	
	var content = new Array ();
	content["didius.customergroup"] = CustomerGroup;
								
	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.CustomerGroup.Save", "data", "POST", false);	
	request.send (content);

	return true;
},		

destroy : function (id)
{
	var content = new Array ();
	content["id"] = id;

	try
	{
		var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.CustomerGroup.Destroy", "data", "POST", false);	
		request.send (content);
	}
	catch (error)
	{						
		return [false, error.split ("|")];
	}
			
	return [true];
},				
		
list : function (attributes)
{
	if (!attributes) attributes = new Array ();
	
	if (attributes.async)
	{
		var onDone = 	function (respons)
						{
							attributes.onDone (respons["didius.customergroups"]);
						};		
	
		var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.CustomerGroup.List", "data", "POST", true);
		request.onLoaded (onDone);
		request.send ();						
	}
	else
	{
		var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=Didius.CustomerGroup.List", "data", "POST", false);		
		request.send ();

		return request.respons ()["didius.customergroups"];		
	}
}	



