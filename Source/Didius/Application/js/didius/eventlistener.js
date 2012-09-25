attach : function ()
{
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.EventListener.Attach", "data", "POST", false);	
	request.send ();
	
	var result = request.respons ()["value"];
			
	app.events.onAuctionCreate.execute (result);
	
	return result;
},
	
detach : function (eventListenerId)
{
	var content = new Array ();
	content["eventlistenerid"] = eventListenerId;

	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.EventListener.Detach", "data", "POST", false);		
	request.send (content);			
},

update : function (eventListenerId, eventId, eventData)
{
	var content = new Array ();
	content["eventlistenerid"] = eventListenerId;
	
	if (eventId != null)
	{
		content["eventid"] = eventId;
	}
	
	if (eventData != null)
	{
		content["eventdata"] = eventData;
	}		
				
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=Didius.EventListener.Update", "data", "POST", false);		
	request.send (content);	
	
	return request.respons ()["didius.events"];
}