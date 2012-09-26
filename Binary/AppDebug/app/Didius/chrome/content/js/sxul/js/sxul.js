// ---------------------------------------------------------------------------------------------------------------
// PROJECT: sxul
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// CLASS: sXUL
// ---------------------------------------------------------------------------------------------------------------
var sXUL =
{
	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: eventListener
	// ---------------------------------------------------------------------------------------------------------------
	eventListener :
	{
		attach : function ()
		{
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=sXUL.EventListener.Attach", "data", "POST", false);	
			request.send ();
			
			var result = request.respons ()["value"];
					
			app.events.onAuctionCreate.execute (result);
			
			return result;
		},
			
		detach : function (eventListenerId)
		{
			var content = new Array ();
			content["eventlistenerid"] = eventListenerId;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=sXUL.EventListener.Detach", "data", "POST", false);		
			request.send (content);			
		},
		
		update : function (attributes)
		{
			if (!attributes)
				attributes = new Array ();
			
			if (!attributes.id)
				throw "No ID given, cannot update eventListener.1";
				
			if (!attributes.onDone)
				throw "This method runs async and needs a onDone callback function.";
			
			var content = new Array ();			
									
			content["eventlistenerid"] = attributes.eventListenerId;
			
			if (attributes.eventId != null)
			{
				content["eventid"] = attributes.eventId;
			}
			
			if (attributes.eventData != null)
			{
				content["eventdata"] = eventData;
			}		
		
			var onDone = 	function (respons)
							{						
								 attributes.onDone (respons["sxul.events"]);
							};
				
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=sXUL.EventListener.Update", "data", "POST", true);			
			request.onLoaded (onDone);
			request.send ();													
		}
	}
}

