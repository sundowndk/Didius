getCurrent : function ()
{
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=SorentoLib.Session.GetCurrent", "data", "POST", false);
	request.send ();

	return request.respons ()["sorentolib.session"];
},

login : function (username, password)
{
	var content = new Array ();
	content["username"] = username;
	content["password"] = password;

	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=SorentoLib.Session.Login", "data", "POST", false);				
	request.send (content);

	return request.respons ()["value"];
},

logout : function ()
{
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=SorentoLib.Session.Logout", "data", "POST", false);				
	request.send ();

	return request.respons ();
}		