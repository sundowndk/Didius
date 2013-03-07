create : function ()
{	
	var content = new Array ();
		
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Newsletter.Create", "data", "POST", false);	
	request.send (content);
	
	var result = request.respons ()["didius.newsletter"];
		
	return result;
},
	
load : function (id)
{
	var content = new Array ();
	content.id = id;

	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Newsletter.Load", "data", "POST", false);		
	request.send (content);

	var result = request.respons ()["didius.newsletter"];
	
	app.events.onNewsletterLoad.execute (result);

	return result;
},
		
save : function (newsletter)
{	
	var content = new Array ();
	content["didius.newsletter"] = newsletter;
								
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Newsletter.Save", "data", "POST", false);	
	request.send (content);

	app.events.onNewsletterSave.execute (newsletter);
},		

destroy : function (id)
{
	var content = new Array ();
	content.id = id;

	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Newsletter.Destroy", "data", "POST", false);	
	request.send (content);
	
	var data = {}
	data.id = id;
			
	app.events.onNewsletterDestroy.execute (data);
},			

send : function (attributes)
{
	var content = new Array ();
	content.id = attributes.id;
	
	if (attributes.onDone)
	{
		var onDone = 	function ()
						{
							attributes.onDone ();
						};
		
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Newsletter.Send", "data", "POST", true);			
		request.onLoaded (onDone);
		request.send (content);
	}
	else
	{
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Newsletter.Send", "data", "POST", false);	
		request.send (content);		
	}	
},	
		
list : function (attributes)
{
	if (!attributes) attributes = new Array ();
	
	var content = new Array ();
			
	if (attributes.async)
	{
		var onDone = 	function (respons)
						{
							attributes.onDone (respons["didius.newsletters"]);
						};
		
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Newsletter.List", "data", "POST", true);
		request.onLoaded (onDone);
		request.send (content);
	}
	else
	{
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.Newsletter.List", "data", "POST", false);		
		request.send (content);

		return request.respons ()["didius.newsletters"];
	}
}	



