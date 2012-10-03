var EXPORTED_SYMBOLS = ["sndk"];
// ---------------------------------------------------------------------------------------------------------------
// PROJECT: sndk
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// CLASS: SNDK
// ---------------------------------------------------------------------------------------------------------------
var SNDK =
{
	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: cookie
	// ---------------------------------------------------------------------------------------------------------------
	cookie :
	{
		set : function (name, value, expires, path, domain, secure)
		{
			// set time, it's in milliseconds
			var today = new Date ();
			today.setTime (today.getTime ());
		
			/*
			if the expires variable is set, make the correct
			expires time, the current script below will set
			it for x number of days, to make it for hours,
			delete * 24, for minutes, delete * 60 * 24
			*/
			if (expires)
			{
				expires = expires * 1000 * 60 * 60 * 24;
			}
		
			var expires_date = new Date (today.getTime () + (expires));
		
			document.cookie = name + "=" +escape (value) +	
			((expires) ? ";expires=" + expires_date.toGMTString () : "") +
			((path) ? ";path=" + path : "") +
			((domain) ? ";domain=" + domain : "") +
			((secure) ? ";secure" : "");
		},
		
		get : function (check_name) 
		{
			// first we'll split this cookie up into name/value pairs
			// note: document.cookie only returns name=value, not the other components
			var a_all_cookies = document.cookie.split (';');
			var a_temp_cookie = '';
			var cookie_name = '';
			var cookie_value = '';
			var b_cookie_found = false; // set boolean t/f default f
		
			for (i = 0; i < a_all_cookies.length; i++)
			{
				// now we'll split apart each name=value pair
				a_temp_cookie = a_all_cookies[i].split ('=');
		
				// and trim left/right whitespace while we're at it
				cookie_name = a_temp_cookie[0].replace (/^\s+|\s+$/g, '');
		
				// if the extracted name matches passed check_name
				if (cookie_name == check_name)
				{
					b_cookie_found = true;
					// we need to handle case where cookie has no value but exists (no = sign, that is):
					if (a_temp_cookie.length > 1)
					{
						cookie_value = unescape (a_temp_cookie[1].replace (/^\s+|\s+$/g, ''));
					}
					// note that in cases where cookie is initialized but no value, null is returned
					return cookie_value;
					break;
				}
				
				a_temp_cookie = null;
				cookie_name = '';
			}
			if (!b_cookie_found)
			{
				return null;
			}
		},
		
		remove : function (name, path, domain) 
		{
			if (SNDK.cookie.get (name)) document.cookie = name + "=" +
			((path) ? ";path=" + path : "") +
			((domain) ? ";domain=" + domain : "") +
			";expires=Thu, 01-Jan-1970 00:00:01 GMT";
		}
			
			
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: tools
	// ---------------------------------------------------------------------------------------------------------------
	tools :
	{
		// ------------------------------------
		// arrayChecksum
		// ------------------------------------	
		arrayChecksum : function (value)
		{			
			var result = "";
		
			for (key in value)
				{	
				var segment = "";
				
				if (value[key] != null)
				{	
					if (typeof(value[key]) == "object")
					{								 
						segment = SNDK.tools.arrayChecksum (value[key]);
					}	
					else
					{
						segment = value[key];
					}
				}	
					
				result += segment;
			}				
				
			return result;			
			//return hex_md5 (result);	
		},
		
		
		
		setButtonLabel : function (element, text)
		{
			if (element)
			{
				if (element.childNodes[0])
				{
					element.childNodes[0].nodeValue = text;
				}
				else if (element.value)
				{
					element.value = text;
				}
				else
				{
					element.innerHTML = text;
				}
			}
		},
		
		dateToYMD : function (date)
		{
		    var d = date.getDate();
		    var m = date.getMonth()+1;
		    var y = date.getFullYear();
		    return '' + y +'/'+ (m<=9?'0'+m:m) +'/'+ (d<=9?'0'+d:d);
		},
		
		
		dateToTimestamp : function (date)
		{	
			return Math.round (date/1000);
		
			//return Math.floor( date.getTime ()/1000 );
		},
		
		// ***************************************************************************************************************************************************
		// ** getTicks																																		**
		// ***************************************************************************************************************************************************
		// ** Return ticks since epoch.																														**
		// ***************************************************************************************************************************************************
		getTicks : function ()
		{		
		    return new Date ().getTime ();
		},
		
		timestampToDate : function (timestamp)
		{	
			var timeZoneOffset = (new Date ().getTimezoneOffset () * 60000) ;
			
			return new Date((timestamp * 1000) + timeZoneOffset);
		},
		
		// ***************************************************************************************************************************************************
		// ** getStyle																																		**
		// ***************************************************************************************************************************************************
		// ** Returns value of the current style on the specifed element.																					**
		// ***************************************************************************************************************************************************	
		getStyle : function (element, property)
		{
			var result = null;
						
			if (client.browser == "Explorer" &&  parseInt (client.version) < 9)
			{
				// Internet Explore 8 and below does not work with getComputedStyle, 
				// so we use currentStyle instead.
				
				// Stylenames are abit differrent when using currentStyle, and only the
				// moste used are being altered here. Fell free to add more if need.
				
				// PADDING
				if (property == "padding-left") property = "paddingLeft";
				if (property == "padding-right") property = "paddingRight";
				if (property == "padding-top") property = "paddingTop";
				if (property == "padding-bottom") property = "paddingBottom";
				
				// MARGIN
				if (property == "margin-left") property = "marginLeft";
				if (property == "margin-right") property = "marginRight";		
				if (property == "margin-top") property = "marginTop";
				if (property == "margin-bottom") property = "marginBottom";	
				
				// BORDER
				if (property == "border-left-width") property = "borderLeftWidth";
				if (property == "border-right-width") property = "borderRightWidth";		
				if (property == "border-top-width") property = "borderTopWidth";
				if (property == "border-bottom-width") property = "borderBottomWidth";				
				
				result = element.currentStyle[property];
			}
			else	
			{
				// All moderen browsers work with getComputedStyle.
			
				//result = document.defaultView.getComputedStyle (element, null).getPropertyValue (property);
				result = window.getComputedStyle (element, null).getPropertyValue (property);
			}
			
			return result;
		},
		
		getStyle2 : function (element)
		{
		var result = null;
						
			if (client.browser == "Explorer" &&  parseInt (client.version) < 9)
			{
				result = element.currentStyle;
			}
			else	
			{
				// All moderen browsers work with getComputedStyle.
			
				result = window.getComputedStyle (element, null);
			}
			
			return result;
		},
		
		// ***************************************************************************************************************************************************
		// ** newGuid																																		**
		// ***************************************************************************************************************************************************
		// ** Create new GUID, that is compatible with C# and other popular languages.																		**
		// ***************************************************************************************************************************************************		
		
		emptyGuid : "00000000-0000-0000-0000-000000000000",
		
		newGuid : function ()
		{
			var chars = '0123456789abcdef'.split ('');
		
			var uuid = [], rnd = Math.random, r;
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			uuid[14] = '4'; // version 4
		
			for (var index = 0; index < 36; index++)
			{
				if (!uuid[index])
				{
					r = 0 | rnd ()*16;
					uuid[index] = chars[(index == 19) ? (r & 0x3) | 0x8 : r & 0xf];
				}
			}
		
			return uuid.join ('');
		},
		
		// ***************************************************************************************************************************************************
		// ** getXML																																		**
		// ***************************************************************************************************************************************************
		// ** Get XML document from URL.																													**
		// ***************************************************************************************************************************************************		
		getXML : function (URL)
		{
			var xmlhttp = SNDK.tools.getXmlHttpObject ();
			xmlhttp.open ("GET", URL + "?"+ Math.random(), false);
											
			xmlhttp.send (null);		
			xmldoc = xmlhttp.responseXML;
			
			return xmldoc;
		},
		
		// ***************************************************************************************************************************************************
		// ** randomNumber																																	**
		// ***************************************************************************************************************************************************
		// ** Returns a random number between two values.																									**
		// ***************************************************************************************************************************************************
		randomNumber : function (begin, end)
		{
			return Math.floor ((end-begin) * Math.random ()) + begin;		
		},
		
		// ***************************************************************************************************************************************************
		// ** reloadURL																																		**
		// ***************************************************************************************************************************************************
		// ** Reloads the current window.																													**
		// ***************************************************************************************************************************************************
		reloadURL : function ()
		{
			document.location.reload (true);
		},
		
		// ***************************************************************************************************************************************************
		// ** setURL																																		**
		// ***************************************************************************************************************************************************
		// ** Set given URL on the current window, if no frame is specified.																				**
		// ***************************************************************************************************************************************************
		setURL : function (url, frame)
		{
			if (frame == null)
			{
				if (url == document.location.href)
				{
					SNDK.tools.reloadURL ();
				}
				else
				{			
					document.location.href = url;
				}
			}
			else
			{
				parent.frames[frame].location = url;
			}		
		},
		
		
		
		
		derefItem : function (array)
		{
			var result;
		
		
		
			if (array.constructor == Array)
			{
				result = new Array ();
			}
			
			if (array.constructor == Object)
			{
				result = {};
			}
			
			for (index in array)
			{
				switch (typeof(array[index]))
				{
					case "object":
					{				
						if (array[index].constructor == Array)
						{					
							result[index] = SNDK.tools.derefItem (array[index]);
						}
						else if (array.constructor == Object)
						{					
							result[index] = SNDK.tools.derefItem (array[index]);
						}
						
						break;
					}
					
					default: 
					{
						result[index] = array[index];
						break;
					}
				}
			}
		
			return result;
		},	
		
		
		
		
		
		
		
		
		
		derefArray : function (array)
		{
			var temp = new Array ();
			for (index in array)
			{
				temp[index] = array[index];
			
		//		var index2 = temp.length;
		//		temp[index2] = new Array ();
		//		for (index3 in array[index])
		//	{
		//			temp[index2][index3] = array[index][index3];
		//		}			
			}
		
			return temp;		
		},
		
		
		stopPropogation : function (e) 
		{
			if (e)
			{
				e.cancelBubble = true;
			}
		//	if (e && e.stopPropogation)
		//	{
		 //		e.stopPropogation ();
		 //	} 
		//	else if (window.event && window.event.cancelBubble)
		//	{
		 // 		window.event.cancelBubble = true;
		  //	}  	
		},
		
		
		getXmlDocFromString : function (xml)
		{
			xmldoc = null;
			
			if (window.DOMParser)
			{
		 		parser = new DOMParser ();
				xmldoc = parser.parseFromString (xml, "text/xml");
			}
			else // Internet Explorer
			{
				xmldoc = new ActiveXObject ("Microsoft.XMLDOM");
				xmldoc.async = "false";		
				xmldoc.loadXML (xml);
			} 
			
			return xmldoc;
		},
		
		getXmlHttpObject : function ()
		{
			if (window.XMLHttpRequest)
			{
				// code for IE7+, Firefox, Chrome, Opera, Safari.
				return new XMLHttpRequest ();
			}
			
			if (window.ActiveXObject)
			{
				// code for IE6, IE5.
				return new ActiveXObject ("Microsoft.XMLHTTP");
			}	
			return null;
		},
		
		
		
		// ------------------------------------
		// getElementPosition
		// ------------------------------------	
		getElementPosition : function (obj, onlyparent)
		{
			var curleft = curtop = 0;
			if (obj.offsetParent) 
			{
				do 
				{
					curleft += obj.offsetLeft;
					curtop += obj.offsetTop;
					if (onlyparent)
					{
						break;
					}
				} while (obj = obj.offsetParent);
			}	
			return [curleft,curtop];
		},
		
		// ------------------------------------
		// trimEnd
		// ------------------------------------	
		trimEnd : function (string, character)
		{	
			try
			{
			if (string.substr (string.length - character.length, character.length) == character)
			{
				return string.substr (0, string.length - character.length);
			}
			}
			catch (error)
			{
			
			}
			
			return string;
		},
		
		arrayContains : function (array, contains)
		{
			var result = false;
		
			for (index in array)
			{
				if (array[index] == contains)	
				{
					result = true;
				}
			}
			
			return result;
		},
		
		// ------------------------------------
		// getQuery
		// ------------------------------------	
		getQuery : function ()
		{
			var url = window.location.toString();			
			url.match(/\?(.+)$/);
				
			var params = RegExp.$1;
			params = params.split("&");
			var queryStringList = {};
		 
			for(var i=0;i<params.length;i++)
			{
				var tmp = params[i].split("=");
				queryStringList[tmp[0]] = unescape(tmp[1]);
			} 
			
			return queryStringList;
		},
		
		// ------------------------------------
		// textSelectionDisable
		// ------------------------------------	
		textSelectionDisable : function (element)
		{
			if (typeof element.onselectstart != "undefined") 
			{
				element.onselectstart = function (){ return false; };
			}
			else if (typeof element.style.MozUserSelect != "undefined") 
			{
				element.style.MozUserSelect = "none";
			}
			else
			{
				element.onmousedown = function () { return false; };
			}
		},			
		
		// ------------------------------------
		// textSelectionEnable
		// ------------------------------------	
		textSelectionEnable : function (element)
		{
			if (typeof element.onselectstart != "undefined") 
			{
				element.onselectstart = "";
			}
			else if (typeof element.style.MozUserSelect != "undefined") 
			{
				element.style.MozUserSelect = "inherit";
			}
			else
			{
				element.onmousedown = "";
			}
		},
		
		setElementOpacity : function (element, opacity)
		{
			element.style.opacity = (opacity / 100);
			element.style.MozOpacity = (opacity / 100);
			element.style.KhtmlOpacity = (opacity / 100);
			element.style.filter = "alpha(opacity=" + opacity + ")";
		},
		
		// ------------------------------------
		// changeOpacityByObject
		// ------------------------------------	
		changeOpacityByObject : function (object, opacity) 
		{
			var style = object.style;
			style.opacity = (opacity / 100);
			style.MozOpacity = (opacity / 100);
			style.KhtmlOpacity = (opacity / 100);
			style.filter = "alpha(opacity=" + opacity + ")";
		},
		
		// ------------------------------------
		// setOpacityByObject
		// ------------------------------------	
		setOpacity : function (object, opacity) 
		{
		//	var style = object.style;
			object.style.opacity = (opacity / 100);
			object.style.MozOpacity = (opacity / 100);
			object.style.KhtmlOpacity = (opacity / 100);
			object.style.filter = "alpha(opacity=" + opacity + ")";
		},
		
		// ------------------------------------
		// getKey
		// ------------------------------------	
		getKey : function (event)
		{
			var key;
			if (!event && window.event) 
			{
				event = window.event;
			}
			
			if (event) 
			{
				key = event.keyCode;
			}
			else
			{
				key = event.which;	
			}
					
			return key;
		},
				
		
		
		// ------------------------------------
		// getStyledMargin
		// ------------------------------------	
		getStyleMargin : function (element)
		{
			var result = {top: 0, left: 0, right: 0, bottom: 0};
			
				result.top = parseInt (SNDK.tools.getStyle (element, "margin-top"));
				result.left = parseInt (SNDK.tools.getStyle (element, "margin-left"));
				result.right = parseInt (SNDK.tools.getStyle (element, "margin-right"));
				result.bottom = parseInt (SNDK.tools.getStyle (element, "margin-bottom"));
			
			return result;
		},
		
		// ------------------------------------
		// getStyledMargin
		// ------------------------------------	
		getElementStyledMargin : function (element)
		{
		
				var result = {top: 0, left: 0, right: 0, bottom: 0};
			
			result.top = parseInt (SNDK.tools.getStyle (element, "margin-top"));
			result.left = parseInt (SNDK.tools.getStyle (element, "margin-left"));
			result.right = parseInt (SNDK.tools.getStyle (element, "margin-right"));
			result.bottom = parseInt (SNDK.tools.getStyle (element, "margin-bottom"));
			
			return result;
		},
		
		
		getElementStyledPadding : function (element)
		{
			var styles = SNDK.tools.getStyle2 (element);
			
			var result = new Array ();
			result["vertical"] = 0;
			result["horizontal"] = 0;
		
			var dimensions = new Array ();
		//	var numberRe = new RegExp(/^\d+/);
		//	console.log (numberRe.exec (styles.getPropertyValue ("padding-left")[0][0]));
			
			dimensions["paddingLeft"] = parseInt (styles.getPropertyValue ("padding-left"));
			dimensions["paddingRight"] = parseInt (styles.getPropertyValue ("padding-right"));
			dimensions["paddingTop"] = parseInt (styles.getPropertyValue ("padding-top"));
			dimensions["paddingBottom"] = parseInt (styles.getPropertyValue ("padding-bottom"));
			dimensions["marginLeft"] = parseInt (styles.getPropertyValue ("margin-left"));
			dimensions["marginRight"] = parseInt (styles.getPropertyValue ("margin-right"));
			dimensions["marginTop"] = parseInt (styles.getPropertyValue ("margin-top"));
			dimensions["marginBottom"] = parseInt (styles.getPropertyValue ("margin-bottom"));				
			dimensions["borderLeft"] = parseInt (styles.getPropertyValue ("border-left-width"));
			dimensions["borderRight"] = parseInt (styles.getPropertyValue ("border-right-width"));
			dimensions["borderTop"] = parseInt (styles.getPropertyValue ("border-top-width"));
			dimensions["borderBottom"] = parseInt (styles.getPropertyValue ("border-bottom-width"));				
		
		//	dimensions["paddingLeft"] = parseInt (styles["paddingLeft"]);
		//	dimensions["paddingRight"] = parseInt (styles["paddingRight"]);
		//	dimensions["paddingTop"] = parseInt (styles["paddingTop"]);
		//	dimensions["paddingBottom"] = parseInt (styles["paddingBottom"]);
		//	dimensions["marginLeft"] = parseInt (styles["marginLeft"]);
		//	dimensions["marginRight"] = parseInt (styles["marginRight"]);
		//	dimensions["marginTop"] = parseInt (styles["marginTop"]);
		//	dimensions["marginBottom"] = parseInt (styles["marginBottom"]);				
		//	dimensions["borderLeft"] = parseInt (styles["borderLeftWidth"]);
		//	dimensions["borderRight"] = parseInt (styles["borderRightWidth"]);
		//	dimensions["borderTop"] = parseInt (styles["borderTopWidth"]);
		//	dimensions["borderBottom"] = parseInt (styles["borderBottomWidth"]);				
			
		
		
		//	console.log ("paddingleft"+ dimensions.paddingLeft);
		//	console.log ("paddingright"+ dimensions.paddingRight);
		//	console.log ("marginleft"+ dimensions.marginLeft);
		//	console.log ("marginright"+ dimensions.marginRight);
		//	console.log ("borderleft"+ dimensions.borderLeft);
		//	console.log ("borderright"+ dimensions.borderRight);	
			
		
			result["vertical"] = dimensions.paddingTop + dimensions.paddingBottom + dimensions.marginTop + dimensions.marginBottom + dimensions.borderTop + dimensions.borderBottom;
			result["horizontal"] = dimensions.paddingLeft + dimensions.paddingRight + dimensions.marginLeft + dimensions.marginRight + dimensions.borderLeft + dimensions.borderRight;
			
			return result;
		},
		
		
		getElementStyledBoxSize : function (element)
		{
			var result = new Array ();
			result["vertical"] = 0;
			result["horizontal"] = 0;
		
			var dimensions = new Array ();
			
			var styles = SNDK.tools.getStyle2 (element);
			
			// PADDING	
			//parseInt (styles.getPropertyValue (""));
			
			dimensions["paddingLeft"] = parseInt (styles["paddingLeft"]);
			dimensions["paddingRight"] = parseInt (styles["paddingRight"]);
			dimensions["paddingTop"] = parseInt (styles["paddingTop"]);
			dimensions["paddingBottom"] = parseInt (styles["paddingBottom"]);
			
			// MARGIN
		//	dimensions["marginLeft"] = Math.abs (parseInt (SNDK.tools.getStyle (element, "margin-left")));
		//	dimensions["marginRight"] = Math.abs (parseInt (SNDK.tools.getStyle (element, "margin-right")));
		//	dimensions["marginTop"] = Math.abs (parseInt (SNDK.tools.getStyle (element, "margin-top")));
		//	dimensions["marginBottom"] = Math.abs (parseInt (SNDK.tools.getStyle (element, "margin-bottom")));				
			
		 	dimensions["marginLeft"] = parseInt (styles["marginLeft"]);
			dimensions["marginRight"] = parseInt (styles["marginRight"]);
			dimensions["marginTop"] = parseInt (styles.getPropertyValue ("margin-top"));
			dimensions["marginBottom"] = parseInt (styles.getPropertyValue ("margin-bottom"));
			
			//BORDER
			dimensions["borderLeft"] = parseInt (styles.getPropertyValue ("border-left-width"))
			dimensions["borderRight"] = parseInt (styles.getPropertyValue ("border-right-width"));
			dimensions["borderTop"] = parseInt (styles.getPropertyValue ("border-top-width"));
			dimensions["borderBottom"] = parseInt (styles.getPropertyValue ("border-bottom-width"));
			
			//console.log (dimensions)	
			
			for (index in dimensions)
			{
				if (dimensions[index] < 0)
				{
					dimensions[index] = 0;
				}
			}
			
			
			result["vertical"] = (dimensions.paddingTop + dimensions.paddingBottom + dimensions.marginTop + dimensions.marginBottom + dimensions.borderTop + dimensions.borderBottom);
			result["horizontal"] = (dimensions.paddingLeft + dimensions.paddingRight + dimensions.marginLeft + dimensions.marginRight + dimensions.borderLeft + dimensions.borderRight);
			result["dimensions"] = dimensions;
			
			return result;
		},
		
		getElementStyledBoxSizeOLD : function (element)
		{
			var result = new Array ();
			result["vertical"] = 0;
			result["horizontal"] = 0;
		
			var dimensions = new Array ();
			
			// PADDING
			dimensions["paddingLeft"] = parseInt (SNDK.tools.getStyle (element, "padding-left"));
			dimensions["paddingRight"] = parseInt (SNDK.tools.getStyle (element, "padding-right"));
			dimensions["paddingTop"] = parseInt (SNDK.tools.getStyle (element, "padding-top"));
			dimensions["paddingBottom"] = parseInt (SNDK.tools.getStyle (element, "padding-bottom"));
			
			// MARGIN
		//	dimensions["marginLeft"] = Math.abs (parseInt (SNDK.tools.getStyle (element, "margin-left")));
		//	dimensions["marginRight"] = Math.abs (parseInt (SNDK.tools.getStyle (element, "margin-right")));
		//	dimensions["marginTop"] = Math.abs (parseInt (SNDK.tools.getStyle (element, "margin-top")));
		//	dimensions["marginBottom"] = Math.abs (parseInt (SNDK.tools.getStyle (element, "margin-bottom")));				
			
		 	dimensions["marginLeft"] = parseInt (SNDK.tools.getStyle (element, "margin-left"));
			dimensions["marginRight"] = parseInt (SNDK.tools.getStyle (element, "margin-right"));
			dimensions["marginTop"] = parseInt (SNDK.tools.getStyle (element, "margin-top"));
			dimensions["marginBottom"] = parseInt (SNDK.tools.getStyle (element, "margin-bottom"));				
			
			//BORDER
			dimensions["borderLeft"] = parseInt (SNDK.tools.getStyle (element, "border-left-width"));
			dimensions["borderRight"] = parseInt (SNDK.tools.getStyle (element, "border-right-width"));
			dimensions["borderTop"] = parseInt (SNDK.tools.getStyle (element, "border-top-width"));
			dimensions["borderBottom"] = parseInt (SNDK.tools.getStyle (element, "border-bottom-width"));	
			
			//console.log (dimensions)	
			
			for (index in dimensions)
			{
				if (dimensions[index] < 0)
				{
					dimensions[index] = 0;
				}
			}
			
			
			result["vertical"] = (dimensions.paddingTop + dimensions.paddingBottom + dimensions.marginTop + dimensions.marginBottom + dimensions.borderTop + dimensions.borderBottom);
			result["horizontal"] = (dimensions.paddingLeft + dimensions.paddingRight + dimensions.marginLeft + dimensions.marginRight + dimensions.borderLeft + dimensions.borderRight);
			result["dimensions"] = dimensions;
			
			return result;
		},
		
		
		
		// ------------------------------------
		// getElementStyleWidth
		// ------------------------------------	
		getElementStyledWidth : function (element)
		{
			var styles = SNDK.tools.getStyle2 (element);
			
			// LeftMargin
			//var leftmargin = SNDK.tools.getStyle (element, "margin-left");
			var leftmargin = styles.getPropertyValue ("margin-left");
			
			if (leftmargin != null && leftmargin != "auto")
			{
				leftmargin = parseInt (leftmargin, 10);
			}
			else
			{
				leftmargin = 0;
			}
				
			// RightMargin	
			//var rightmargin = SNDK.tools.getStyle (element, "margin-right");
			var rightmargin = styles.getPropertyValue ("margin-right");
				
			if (rightmargin != null && rightmargin != "auto")
			{
				rightmargin = parseInt (rightmargin, 10);
			}
			else
			{
				rightmargin = 0;
			}
			
			// LeftPadding
			//var leftpadding = parseInt (SNDK.tools.getStyle (element, "padding-left"), 10);
			var leftpadding = parseInt (styles.getPropertyValue ("padding-left"), 10);
			
			// RightPadding
			//var rightpadding = parseInt (SNDK.tools.getStyle (element, "padding-right"), 10);
			var rightpadding = parseInt (styles.getPropertyValue ("padding-right"), 10);
				
			// Width
			//var width = SNDK.tools.getStyle (element, "width");
			var width = styles.getPropertyValue ("width");
			if (width != null && width != "auto")
			{
				width = parseInt (width, 10);
			}
			else
			{
				width = 0;
			}
			
			// Done
			return width + leftmargin + rightmargin + leftpadding + rightpadding;		
		},
		
		// ------------------------------------
		// getElementStyleHeight
		// ------------------------------------	
		getElementStyledHeight : function (element)
		{
			// TopMargin
			var topmargin = SNDK.tools.getStyle (element, "margin-top");
			
			if (topmargin != null && topmargin != "auto")
			{
				topmargin = parseInt (topmargin, 10);
			}
			else
			{
				topmargin = 0;
			}
				
			// BottomMargin
			var bottommargin = SNDK.tools.getStyle (element, "margin-bottom");
				
			if (bottommargin != null && bottommargin != "auto")
			{
				bottommargin = parseInt (bottommargin, 10);
			}
			else
			{
				bottommargin = 0;
			}
			
			// TopPadding
			var toppadding = parseInt (SNDK.tools.getStyle (element, "padding-top"), 10);
			
			// BottomPadding
			var bottompadding = parseInt (SNDK.tools.getStyle (element, "padding-bottom"), 10);
				
			// Height
			var height = SNDK.tools.getStyle (element, "height");
		
			if (height != null && height != "auto")
			{
				height = parseInt (height, 10);
			}
			else
			{
				height = 0;
			}
		
			// Done	
			return height + topmargin + bottommargin + toppadding + bottompadding;	
		},
		
		// ------------------------------------
		// getElementInnerWidth
		// ------------------------------------	
		getElementInnerWidth : function (element)
		{
		
			// LeftMargin
		//	var leftmargin = SNDK.tools.getStyle (element, "margin-left");	
			
		//	if (leftmargin != null && leftmargin != "auto")
		//	{
		//		leftmargin = parseInt (leftmargin, 10);
		//	}
		//	else
		//	{
		//		leftmargin = 0;
		//	}
				
			// RightMargin	
		//	var rightmargin = SNDK.tools.getStyle (element, "margin-right");
				
		//	if (rightmargin != null && rightmargin != "auto")
		//	{
		//		rightmargin = parseInt (rightmargin, 10);
		//	}
		//	else
		//	{
		//		rightmargin = 0;
		//	}
			
			// LeftPadding
		//	var leftpadding = parseInt (SNDK.tools.getStyle (element, "padding-left"), 10);
			
			// RightPadding
		//	var rightpadding = parseInt (SNDK.tools.getStyle (element, "padding-right"), 10);
				
			// Width
			var width = element.offsetWidth;
				
			var box = SNDK.tools.getElementStyledBoxSize (element);
				
			// Done
		//	console.log (element)
		//	console.log (box)
		//	console.log (width)
			
			return width - box.dimensions.paddingLeft - box.dimensions.paddingRight - box.dimensions.borderLeft - box.dimensions.borderRight;
			//return width - 10
		//	return width - leftmargin - rightmargin - leftpadding - rightpadding;		
		//	return width - leftpadding - rightpadding;		
		},
		
		// ------------------------------------
		// getElementInnerHeight
		// ------------------------------------	
		getElementInnerHeight : function (element)
		{
			// TopMargin
		//	var topmargin = SNDK.tools.getStyle (element, "margin-top");
			
		//	if (topmargin != null && topmargin != "auto")
		//	{
		//		topmargin = parseInt (topmargin, 10);
		//	}
		//	else
		//	{
		//		topmargin = 0;
		//	}
				
			// BottomMargin
		//	var bottommargin = SNDK.tools.getStyle (element, "margin-bottom");
		//		
		//	if (bottommargin != null && bottommargin != "auto")
		//	{
		//		bottommargin = parseInt (bottommargin, 10);
		//	}
		//	else
		//	{
		//		bottommargin = 0;
		//	}
			
			// TopPadding
		//	var toppadding = parseInt (SNDK.tools.getStyle (element, "padding-top"), 10);
			
			// BottomPadding
		//	var bottompadding = parseInt (SNDK.tools.getStyle (element, "padding-bottom"), 10);
			
			var box = SNDK.tools.getElementStyledBoxSize (element);
						
			// Height
			var height = parseInt (element.offsetHeight, 10);
			
			return height - box.dimensions.paddingTop - box.dimensions.paddingBottom - box.dimensions.borderTop - box.dimensions.borderBottom;
			
			// Done
		//	return height - topmargin - bottommargin - toppadding - bottompadding;	
		},
		
		
		// ------------------------------------
		// opacityChange
		// ------------------------------------	
		opacityChange : function (element, opacity) 
		{
			var object;
			if (typeof element == "string")
			{
				object = document.getElementById (element);
			}
			else
			{
				object = element;
			}
		
			object.style.opacity = (opacity / 100);
			object.style.MozOpacity = (opacity / 100);
			object.style.KhtmlOpacity = (opacity / 100);
			object.style.filter = "alpha(opacity=" + opacity + ")";
		},
		
		// ------------------------------------
		// newElement
		// ------------------------------------	
			newElement : function (type, classname, id, parent)
			{		
			
			
				if (typeof classname == "object" && classname != null)
				{
					var element;
					var tempelement;		
					var options = classname;
					
					if (type != null)
					{
						if (type == "iframe")
						{
							tempelement = document.createElement ("div");
		//					tempelement.style.display = "none";	
							
							id = "";					
							if (options.name != null && options.id == null)
							{
								id = options.name;
							}
							else if (options.name == null && options.id != null)
							{
								id = options.id;
							}					
							else
							{
								id = SNDK.tools.newGuid ();
							}
							
							tempelement.innerHTML = "<iframe name='"+ id +"' id='"+ id +"' style='width: 100%; height: 100%; border: none;'></iframe>";
							document.body.appendChild (tempelement);
							element = document.getElementById (id);
						}
						else
						{
							element = document.createElement (type);
							
						}
					}
					else
					{
						throw "Cant create new element without a type.";
					}
					
					if (options.className != null)
					{
						element.className = options.className;	
					}
					
					if (options.id != null)
					{	
						if (type != "iframe")
						{
							element.setAttribute ("id", options.id);
						}
					}
					
		
					
					if (options.innerHTML != null)
					{
						element.innerHTML = options.innerHTML;
					}
					
					if (options.src != null)
					{
						if (type != "iframe")
						{
							element.src = options.src;
						}
					}
					
					if (options.scrolling != null)
					{
						element.scrolling = options.scrolling;
					}
					
					if (options.width != null)
					{
						if (type != "iframe")
						{						
							element.style.width = options.width;
						}
						else
						{
							tempelement.style.width = options.width;
						}
					}
					
					if (options.height != null)
					{
						if (type != "iframe")
						{						
							element.style.height = options.height;
						}
						else
						{	
							tempelement.style.height = options.height;
						} 
					}			
		
					if (options.onLoad != null)
					{
						element.onload = options.onLoad;
					}			
		
					if (options.name != null)
					{
						if (type != "iframe")
						{
							element.setAttribute ("name", options.name);
						}
						
					}
		
					if (options.href != null)
					{
						element.setAttribute ("href", options.href);
					}
					
					if (options.display != null)
					{
						element.style.display =  options.display;
					}
		
					if (options.method != null)
					{
						element.method =  options.method;
					}
					
					if (options.target != null)
					{
						if (typeof options.target == "string")
						{
							element.target =  options.target;
						}
						else
						{
							element.target =  options.target.id;
						}
					}
					
					if (options.encoding != null)
					{
						element.encoding =  options.encoding;
					}
					
		
					
					if (options.type != null)
					{
						element.type = options.type;
					}
		
					if (options.value != null)
					{
						element.value = options.value;
					}
					
					if (options.method != null)
					{
						element.method = options.method;
					}
					
					if (options.enctype != null)
					{
						element.enctype = options.enctype;
					}
					
		
					if (options.appendTo != null)
					{
						if (type == "iframe")
						{
							options.appendTo.appendChild (tempelement);
							if (options.src != null)
							{
								element.src = options.src;
							}
						}
						else
						{
							options.appendTo.appendChild (element);
						}
					}
		
					return element;
				}
				else
				{
					var element;
				
					if (type != null)
					{
						element = document.createElement (type);
					}
					else
					{
						throw "Cant create new element without a type.";
					}
				
					if (classname != null)
					{
						element.className = classname;	
					}
				
					if (id != null)
					{
						element.setAttribute ("id", id);
					}
				
					if (parent != null)
					{
						parent.appendChild (element);				
					}
					
					return element;	
				}	
			},
		
		// ------------------------------------
		// newElement
		// ------------------------------------	
		newElement2 : function (type, options)
		{			
			var element;
			var tempelement;
			
			if (type != null)
			{
				element = document.createElement (type);
			}
			else
			{
				throw "Cant create new element without a type.";
			}
		
			if (options.id != null)
			{	
				element.setAttribute ("id", options.id);
			}
			
			if (options.className != null)
			{
				element.className = options.className;	
			}
					
			if (options.appendTo != null)
			{
				options.appendTo.appendChild (element);
			}
			
			if (options.innerHTML != null)
			{
				element.innerHTML = options.innerHTML;
			}
			
			if (options.src != null)
			{
				element.src = options.src;
			}
			
			if (options.scrolling != null)
			{
				element.scrolling = options.scrolling;
			}
			
			if (options.width != null)
			{
				element.style.width = options.width;
			}
			
			if (options.height != null)
			{
				element.style.height = options.height;
			}			
						
			if (options.display != null)
			{
				element.style.display =  options.display;
			}
		
			if (options.method != null)
			{
				element.method =  options.method;
			}
		
			if (options.target != null)
			{
				if (typeof options.target == "string")
				{
					element.target =  options.target;
				}
				else
				{
					element.target =  options.target.id;
				}
			}
			
			if (options.encoding != null)
			{
				element.encoding =  options.encoding;
			}
			
			if (options.type != null)
			{
				element.type = options.type;
			}
		
			if (options.value != null)
			{
				element.value = options.value;
			}
		
			return element;
		},
		
		// ------------------------------------
		// getPageSize
		// ------------------------------------	
		getPageSize : function () 
		{	        
			var xScroll, yScroll;
		
			if (window.innerHeight && window.scrollMaxY) {	
				xScroll = window.innerWidth + window.scrollMaxX;
				yScroll = window.innerHeight + window.scrollMaxY;
			} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
				xScroll = document.body.scrollWidth;
				yScroll = document.body.scrollHeight;
			} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
				xScroll = document.body.offsetWidth;
				yScroll = document.body.offsetHeight;
			}
		
			var windowWidth, windowHeight;
		
			if (self.innerHeight) {	// all except Explorer
				if(document.documentElement.clientWidth){
					windowWidth = document.documentElement.clientWidth; 
				} else {
					windowWidth = self.innerWidth;
				}
				windowHeight = self.innerHeight;
			} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
				windowWidth = document.documentElement.clientWidth;
				windowHeight = document.documentElement.clientHeight;
			} else if (document.body) { // other Explorers
				windowWidth = document.body.clientWidth;
				windowHeight = document.body.clientHeight;
			}	
		
			// for small pages with total height less then height of the viewport
			if(yScroll < windowHeight){
				pageHeight = windowHeight;
			} else { 
				pageHeight = yScroll;
			}
		
			// for small pages with total width less then width of the viewport
			if(xScroll < windowWidth){	
				pageWidth = xScroll;		
			} else {
				pageWidth = windowWidth;
			}
		
			return [pageWidth,pageHeight];
		},
			
			
			
		// ------------------------------------
		// getScrollOffsets
		// ------------------------------------		
		getScrollOffsets : function () 
		{
			return [window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft, window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop ]
		//			alert (document.documentElement.scrollTop)
		//			return Element._returnOffset(
		//			      window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
		//			      window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop);
		},
		
		// ------------------------------------
		// getWindowSize
		// ------------------------------------	
		getWindowSize : function ()
		{
		  var myWidth = 0, myHeight = 0;
		  if( typeof( window.innerWidth ) == 'number' ) {
		    //Non-IE
		    myWidth = window.innerWidth;
		    myHeight = window.innerHeight;
			  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
			    //IE 6+ in 'standards compliant mode'
			    myWidth = document.documentElement.clientWidth;
			    myHeight = document.documentElement.clientHeight;
			  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
			    //IE 4 compatible
			    myWidth = document.body.clientWidth;
			    myHeight = document.body.clientHeight;
			  }
			  
			  return [myWidth, myHeight];
		}		
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: animation
	// ---------------------------------------------------------------------------------------------------------------
	animation :
	{
		// ---------------------------------------------------------------------------------------------------------------
		// CLASS: ease
		// ---------------------------------------------------------------------------------------------------------------
		ease :
		{
			// ------------------------------------
			// 
			// ------------------------------------	
			inquad: function (x, t, b, c, d) 
			{
				return c*(t/=d)*t + b;
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			outquad: function (x, t, b, c, d) 
			{
				return -c *(t/=d)*(t-2) + b;	
			},
							
			// ------------------------------------
			// 
			// ------------------------------------	
			inoutquad: function (x, t, b, c, d) 
			{
				if ((t/=d/2) < 1) return c/2*t*t + b;
				return -c/2 * ((--t)*(t-2) - 1) + b;
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			incubic: function (x, t, b, c, d) 
			{
				return c*(t/=d)*t*t + b;
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			outcubic: function (x, t, b, c, d) 
			{
				return c*((t=t/d-1)*t*t + 1) + b;
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			inoutcubic: function (x, t, b, c, d) 
			{
				if ((t/=d/2) < 1) return c/2*t*t*t + b;
				return c/2*((t-=2)*t*t + 2) + b;
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			inquart: function (x, t, b, c, d) 
			{
				return c*(t/=d)*t*t*t + b;
			},	
			
			// ------------------------------------
			// 
			// ------------------------------------	
			outquart: function (x, t, b, c, d) 
			{
				return -c * ((t=t/d-1)*t*t*t - 1) + b;
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			inoutquart: function (x, t, b, c, d) 
			{
				if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
				return -c/2 * ((t-=2)*t*t*t - 2) + b;
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			inquint: function (x, t, b, c, d) 
			{
				return c*(t/=d)*t*t*t*t + b;
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			outquint: function (x, t, b, c, d) 
			{
				return c*((t=t/d-1)*t*t*t*t + 1) + b;
			},
							
			// ------------------------------------
			// 
			// ------------------------------------	
			inoutquint: function (x, t, b, c, d) 
			{
				if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
				return c/2*((t-=2)*t*t*t*t + 2) + b;
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			insine: function (x, t, b, c, d) 
			{
				return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			outsine: function (x, t, b, c, d) 
			{
				return c * Math.sin(t/d * (Math.PI/2)) + b;
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			inoutsine: function (x, t, b, c, d) 
			{
				return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			inexpo: function (x, t, b, c, d) 
			{
				return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			outexpo: function (x, t, b, c, d) 
			{
				return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			inoutexpo: function (x, t, b, c, d) 
			{
				if (t==0) return b;
				if (t==d) return b+c;
				if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
				return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			incirc: function (x, t, b, c, d) 
			{
				return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			outcirc: function (x, t, b, c, d) 
			{
				return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			inoutcirc: function (x, t, b, c, d) 
			{
				if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
				return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			inelastic: function (x, t, b, c, d) 
			{
				var s=1.70158;var p=0;var a=c;
				if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
				if (a < Math.abs(c)) { a=c; var s=p/4; }
				else var s = p/(2*Math.PI) * Math.asin (c/a);
				return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			outelastic: function (x, t, b, c, d) 
			{
				var s=1.70158;var p=0;var a=c;
				if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
				if (a < Math.abs(c)) { a=c; var s=p/4; }
				else var s = p/(2*Math.PI) * Math.asin (c/a);
				return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			inoutelastic: function (x, t, b, c, d) 
			{
				var s=1.70158;var p=0;var a=c;
				if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
				if (a < Math.abs(c)) { a=c; var s=p/4; }
				else var s = p/(2*Math.PI) * Math.asin (c/a);
				if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
				return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			inback: function (x, t, b, c, d, s) 
			{
				if (s == undefined) s = 1.70158;
				return c*(t/=d)*t*((s+1)*t - s) + b;
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			outback: function (x, t, b, c, d, s) 
			{
				if (s == undefined) s = 1.70158;
				return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			inoutback: function (x, t, b, c, d, s) 
			{
				if (s == undefined) s = 1.70158;
				if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
				return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			inbounce: function (x, t, b, c, d) 
			{
				return c - SNDK.animation.ease.inbounce (x, d-t, 0, c, d) + b;
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			outbounce: function (x, t, b, c, d) 
			{
				if ((t/=d) < (1/2.75)) {
					return c*(7.5625*t*t) + b;
				} else if (t < (2/2.75)) {
					return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
				} else if (t < (2.5/2.75)) {
					return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
				} else {
					return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
				}					
			},
			
			// ------------------------------------
			// 
			// ------------------------------------	
			inoutbounce: function (x, t, b, c, d) 
			{
				if (t < d/2) return SNDK.animation.ease.inBounce (x, t*2, 0, c, d) * .5 + b;
				return SNDK.animation.ease.outbounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
			}			
		},
	
		// ------------------------------------------------------------------------------------------------------------------------
		// animate (options)
		// ------------------------------------------------------------------------------------------------------------------------
		// .play ()
		// .stop ()
		// .onPlay (function)
		// .onStop (function)
		// .onFinish (function)
		// ------------------------------------------------------------------------------------------------------------------------
		/**
		 * @constructor
		 */
		animate: function(options)
		{
			var _options = options;
			var _temp = { initialized: false,
				      timer: null,
				      element: null,
				      begin: 0,
				      end: 0,
				      duration: 0,
				      fps: 0,
				      frame: 0,
				      change: 0,
				      interval: 0,
				      totalframes: 0,
				      step: 0,
				      frame: 0,
				      animators: new Array(),
				      qued: false
				    };
		
			setOptions();
		
			this.dispose = functionDispose;
		
			this.play = functionPlay;
			this.stop = functionStop;
		
			this.onPlay = getsetOnPlay;
			this.onStop = getsetOnStop;
			this.onFinish = getsetOnFinish;
		
			// Initialize
			window.onDomReady(init);
		
			// -------------------------------------
			// Private functions
			// -------------------------------------
			// -------------------------------------
			// init
			// -------------------------------------
			function init()
			{
		
				if (typeof _options.element == 'string')
				{
					_temp.element = document.getElementById(_options.element);
				}
				else
				{
					_temp.element = _options.element;
				}
		
				setAnimators();
		
				_temp.duration = parseFloat(_options.duration);
				_temp.fps = parseFloat(_options.fps);
				_temp.interval = Math.ceil(1000 / _temp.fps);
				_temp.totalframes = Math.ceil(_temp.duration / _temp.interval);
		
				//_temp.step = _temp.change / _temp.totalframes;
		
				_temp.initalized = true;
		
				if (_temp.qued)
				{
					loop();
				}
			}
		
			// -------------------------------------
			// loop
			// -------------------------------------
			function loop()
			{
				_temp.frame++;
		
				for (index in _temp.animators)
				{
					// TODO: Fix for prototype, should be removed when SNDK.LightBox is ready.
			//		try
		//			{		
						var animator = _temp.animators[index];
						var increase = eval('SNDK.animation.ease.' + animator.ease.toLowerCase () + '(0,' + _temp.frame + ',' + animator.begin + ',' + animator.change + ',' + _temp.totalframes + ');');
		
						if (animator.dom != 'opacity')
						{
							_temp.element.style[animator.dom] = increase + animator.unit;
						}
						else
						{
			
							SNDK.tools.setOpacity(_temp.element, increase);
						}
				//	}
					//catch (error)
					//{}
				}
		
				if (_temp.frame <= _temp.totalframes)
				{
					_temp.timer = setTimeout(function() { loop() }, _temp.interval);
				}
				else
				{
					_temp.timer = null;
					eventOnFinish();
				}
			}
		
			// -------------------------------------
			// setOptions
			// -------------------------------------
			function setOptions()
			{
				if (!_options.duration) _options.duration = 1000;
				if (!_options.fps) _options.fps = 20;
		
			}
		
			// -------------------------------------
			// setAnimators
			// -------------------------------------
			function setAnimators()
			{
				// LEFT
				if (_options.left != null)
				{
					var animator = new Array();
		
					if (_options.left.begin != null)
					{
						animator.begin = parseFloat(_options.left.begin);
					}
					else
					{
						if (_temp.element.style.left != '')
						{
							animator.begin = parseInt(_temp.element.style.left);
						}
						else
						{
							animator.begin = parseInt (_temp.element.offsetLeft);
							animator.begin -= parseInt (SNDK.tools.getStyle (_temp.element, "margin-left"));
						}
					}
		
					animator.end = parseFloat(_options.left.end);
					animator.change = parseFloat(animator.end) - parseFloat(animator.begin);
					animator.ease = (_options.left.ease);
					animator.unit = 'px';
					animator.dom = 'left';
		
					_temp.animators[_temp.animators.length] = animator;
				}
				
				// RIGHT
				if (_options.right != null)
				{
					var animator = new Array();
		
					if (_options.right.begin != null)
					{
						animator.begin = parseFloat(_options.right.begin);
					}
					else
					{
						if (_temp.element.style.right != '')
						{
							animator.begin = parseInt(_temp.element.style.right);
						}
						else
						{
							animator.begin = parseInt (_temp.element.offsetRight);
							animator.begin -= parseInt (SNDK.tools.getStyle (_temp.element, "margin-right"));
						}
					}
		
					animator.end = parseFloat(_options.right.end);
					animator.change = parseFloat(animator.end) - parseFloat(animator.begin);
					animator.ease = (_options.right.ease);
					animator.unit = 'px';
					animator.dom = 'right';
		
					_temp.animators[_temp.animators.length] = animator;
				}		
				
				// MARGINLEFT
				if (_options.marginLeft != null)
				{
					var animator = new Array();
		
					if (_options.marginLeft.begin != null)
					{
						animator.begin = parseFloat(_options.marginLeft.begin);
					}
					else
					{
						if (_temp.element.style.marginLeft != '')
						{
							animator.begin = parseInt(_temp.element.style.marginLeft);
						}
						else
						{
							animator.begin = parseInt (_temp.element.offsetLeft);
							animator.begin -= parseInt (SNDK.tools.getStyle (_temp.element, "margin-left"));
						}
					}
		
					animator.end = parseFloat(_options.marginLeft.end);
					animator.change = parseFloat(animator.end) - parseFloat(animator.begin);
					animator.ease = (_options.marginLeft.ease);
					animator.unit = 'px';
					animator.dom = 'marginLeft';
		
					_temp.animators[_temp.animators.length] = animator;
				}		
				
				// MARGINRIGHT
				if (_options.marginRight != null)
				{
					var animator = new Array();
					
					if (_options.marginRight.begin != null)
					{
						animator.begin = parseFloat(_options.marginRight.begin);
					}
					else
					{
						
						if (_temp.element.style.marginRight != '')
						{
							animator.begin = parseInt(_temp.element.style.marginRight);
						}
						else
						{
							animator.begin = parseInt (_temp.element.offsetRight);
							animator.begin -= parseInt (SNDK.tools.getStyle (_temp.element, "margin-right"));
						}
					}
					
					
					animator.end = parseFloat(_options.marginRight.end);
					animator.change = parseFloat(animator.end) - parseFloat(animator.begin);
					animator.ease = (_options.marginRight.ease);
					animator.unit = 'px';
					animator.dom = 'marginRight';
		
					_temp.animators[_temp.animators.length] = animator;
				}			
				
				// PADDINGRIGHT
				if (_options.paddingRight != null)
				{
					var animator = new Array();
		
					if (_options.paddingRight.begin != null)
					{
						animator.begin = parseFloat(_options.paddingRight.begin);
					}
					else
					{
						if (_temp.element.style.paddingRight != '')
						{
							animator.begin = parseInt(_temp.element.style.paddingRight);
						}
						else
						{
							//animator.begin = 0;
							animator.begin = parseInt (SNDK.tools.getStyle (_temp.element, "padding-right"));
						}
					}
							
		
					animator.end = parseFloat(_options.paddingRight.end);
					animator.change = parseFloat(animator.end) - parseFloat(animator.begin);
					animator.ease = (_options.paddingRight.ease);
					animator.unit = 'px';
					animator.dom = 'paddingRight';
		
					_temp.animators[_temp.animators.length] = animator;
				}			
		
				// TOP
				if (_options.top != null)
				{
					var animator = new Array();
		
					if (_options.top.begin != null)
					{
						animator.begin = parseFloat(_options.top.begin);
					}
					else
					{
						if (_temp.element.style.top != '')
						{
							animator.begin = parseInt (_temp.element.style.top);
						}
						else
						{
							animator.begin = parseInt (_temp.element.offsetTop);
							animator.begin -= parseInt (SNDK.tools.getStyle (_temp.element, "margin-top"));
						}
					}
		
					animator.end = parseFloat(_options.top.end);
					animator.change = parseFloat(animator.end) - parseFloat(animator.begin);
					animator.ease = (_options.top.ease);
					animator.unit = 'px';
					animator.dom = 'top';
					
					if (animator.begin != animator.end)
					{
		
					_temp.animators[_temp.animators.length] = animator;
					}
				}
		
				// WIDTH
				if (_options.width != null)
				{
					var animator = new Array();
		
					if (_options.width.begin != null)
					{
						animator.begin = parseFloat(_options.width.begin);
					}
					else
					{
						if (_temp.element.style.width != '')
						{
							animator.begin = parseInt(_temp.element.style.width);
						}
						else
						{
							animator.begin = parseInt(_temp.element.offsetWidth);
						}
					}
		
					animator.end = parseFloat(_options.width.end);
					animator.change = parseFloat(animator.end) - parseFloat(animator.begin);
					animator.ease = (_options.width.ease);
					animator.unit = 'px';
					animator.dom = 'width';
		
					_temp.animators[_temp.animators.length] = animator;
				}
				
				// HEIGHT
				if (_options.height != null)
				{
					var animator = new Array();
		
					if (_options.height.begin != null)
					{
						animator.begin = parseFloat(_options.height.begin);
					}
					else
					{
						if (_temp.element.style.height != '')
						{
							animator.begin = parseInt(_temp.element.style.height);
						}
						else
						{
							animator.begin = parseInt(_temp.element.offsetHeight);
						}
					}
		
					animator.end = parseFloat(_options.height.end);
					animator.change = parseFloat(animator.end) - parseFloat(animator.begin);
					animator.ease = (_options.height.ease);
					animator.unit = 'px';
					animator.dom = 'height';
		
					_temp.animators[_temp.animators.length] = animator;
				}		
		
				// OPACITY
				if (_options.opacity != null)
				{
					var animator = new Array();
		
					if (_options.opacity.begin != null)
					{
						animator.begin = parseFloat(_options.opacity.begin);
					}
		      //			else
		      //			{
		      //				if (_temp.element.style.width != "")
		      //				{
		      //					animator.begin = parseInt (_temp.element.style.width);
		      //				}
		      //				else
		      //				{
		      //					animator.begin = parseInt (_temp.element.offsetWidth);
		      //				}
		      //			}
		
					animator.end = parseFloat(_options.opacity.end);
					animator.change = parseFloat(animator.end) - parseFloat(animator.begin);
					animator.ease = (_options.opacity.ease);
					animator.unit = '';
					animator.dom = 'opacity';
		
					_temp.animators[_temp.animators.length] = animator;
		
					console.log('Opacity created');
				}
			}
		
			// -------------------------------------
			// Public functions
			// -------------------------------------	
			function functionDispose ()
			{
				_options = null;
				_temp = null;		
			}	
			
			// -------------------------------------
			// play
			// -------------------------------------
			function functionPlay()
			{
				if (_temp.initalized)
				{
					loop();
				}
				else
				{
					_temp.qued = true;
				}
			}
		
			// -------------------------------------
			// stop
			// -------------------------------------
			function functionStop()
			{
				if (_temp.initalized)
				{
					clearTimeout(_temp.timer);
				}
				else
				{
					_temp.qued = false;
				}
			}
		
			// ------------------------------------
			// Events
			// ------------------------------------
			// ------------------------------------
			// eventOnPlay
			// ------------------------------------
			function eventOnPlay()
			{
				if (_temp.initalized)
				{
					if (_options.onPlay != null)
					{
						setTimeout(function() { _options.onPlay(); }, 1);
					}
				}
			}
		
			// ------------------------------------
			// eventOnStop
			// ------------------------------------
			function eventOnStop()
			{
				if (_temp.initalized)
				{
					if (_options.onStop != null)
					{
						setTimeout(function() { _options.onStop(); }, 1);
					}
				}
			}
		
			// ------------------------------------
			// eventOnComplete
			// ------------------------------------
			function eventOnFinish()
			{
				if (_temp.initalized)
				{
					if (_options.onFinish != null)
					{
						setTimeout(function() { _options.onFinish(); }, 1);
					}
				}
			}
		
			// ------------------------------------
			// GET/SET
			// ------------------------------------
			// ------------------------------------
			// onPlay
			// ------------------------------------
			function getsetOnPlay(value)
			{
				_options.onPlay = value;
			}
		
			// ------------------------------------
			// onStop
			// ------------------------------------
			function getsetOnStop(value)
			{
				_options.onStop = value;
			}
		
			// ------------------------------------
			// onFinish
			// ------------------------------------
			function getsetOnFinish(value)
			{
				_options.onFinish = value;
			}
		},
	
		// ------------------------------------------------------------------------------------------------------------------------
		// scene (options)
		// ------------------------------------------------------------------------------------------------------------------------
		// .play ()
		// .stop ()
		// .onPlay (function)
		// .onStop (function)
		// .onFinish (function)
		// ------------------------------------------------------------------------------------------------------------------------
		/**
		 * @constructor
		 */
		scene: function(options)
		{
			var _options = options;
			var _temp = { initialized: false
				    	};
				    
			var _animations = new Array ();
		
			setOptions();
		
			this.addAnimation = functionAddAnimation;
		
			this.play = functionPlay;
			this.stop = functionStop;
			
			this.dispose = functionDispose;
		
			this.onPlay = getsetOnPlay;
			this.onStop = getsetOnStop;
			this.onFinish = getsetOnFinish;
		
			// Initialize
			window.onDomReady(init);
		
			// -------------------------------------
			// Private functions
			// -------------------------------------
			// -------------------------------------
			// init
			// -------------------------------------
			function init()
			{
				// Ready
				_temp.initalized = true;
		
				// Play if qued.
				if (_temp.qued)
				{
					functionPlay ();
				}
				
			}
		
			// -------------------------------------
			// setOptions
			// -------------------------------------
			function setOptions()
			{
				if (!_options.duration) _options.duration = 1000;
				if (!_options.fps) _options.fps = 20;
			}
		
			// -------------------------------------
			// Public functions
			// -------------------------------------
			// -------------------------------------
			// addAnimation
			// -------------------------------------
			function functionAddAnimation (options)
			{
				options.duration = _options.duration;
				options.fps = _options.fps;
			
				var animation = new SNDK.animation.animate (options);
				
				_animations[_animations.length] = animation;
			}
		
		
			// -------------------------------------
			// play
			// -------------------------------------
			function functionPlay()
			{
				if (_temp.initalized)
				{
					for (index in _animations)
					{
						_animations[index].play ();
					}
				}
				else
				{
					_temp.qued = true;
				}
			}
		
			// -------------------------------------
			// stop
			// -------------------------------------
			function functionStop()
			{
				if (_temp.initalized)
				{
					//clearTimeout(_temp.timer);
					
					for (index in _animations)
					{
						// TODO: Fix for prototype, should be removed when SNDK.LightBox is ready.
						try
						{
							_animations[index].stop ();
						}
						catch (error)
						{}
					}
					
				}
				else
				{
					_temp.qued = false;
				}
			}
		
			function functionDispose ()
			{
				for (index in _animations)
				{
					_animations[index].dispose ();
					_animations[index] = null;
				}
				
				_animations = null;
				_options = null;
				_temp = null;
			}
		
			// ------------------------------------
			// Events
			// ------------------------------------
			// ------------------------------------
			// eventOnPlay
			// ------------------------------------
			function eventOnPlay()
			{
				if (_temp.initalized)
				{
					if (_options.onPlay != null)
					{
						setTimeout(function() { _options.onPlay(); }, 1);
					}
				}
			}
		
			// ------------------------------------
			// eventOnStop
			// ------------------------------------
			function eventOnStop()
			{
				if (_temp.initalized)
				{
					if (_options.onStop != null)
					{
						setTimeout(function() { _options.onStop(); }, 1);
					}
				}
			}
		
			// ------------------------------------
			// eventOnComplete
			// ------------------------------------
			function eventOnFinish()
			{
				if (_temp.initalized)
				{
					if (_options.onFinish != null)
					{
						setTimeout(function() { _options.onFinish(); }, 1);
					}
				}
			}
		
			// ------------------------------------
			// GET/SET
			// ------------------------------------
			// ------------------------------------
			// onPlay
			// ------------------------------------
			function getsetOnPlay(value)
			{
				_options.onPlay = value;
			}
		
			// ------------------------------------
			// onStop
			// ------------------------------------
			function getsetOnStop(value)
			{
				_options.onStop = value;
			}
		
			// ------------------------------------
			// onFinish
			// ------------------------------------
			function getsetOnFinish(value)
			{
				_options.onFinish = value;
			}
		},
	
		
		// ------------------------------------
		// opacityFade
		// ------------------------------------		
		opacityFade : function (element, opacitystart, opacityend, delay) 
		{
			var speed = Math.round (delay / 100);
			var timer = 0;
		
			if (opacitystart > opacityend) 
			{
		        	for (i = opacitystart; i >= opacityend; i--) 
		        	{		        	    	
		   					SNDK.animation.opacityFadeHelper (element, i, timer * speed)
		        	    	timer++;
		        	}
			} 
			else if (opacitystart < opacityend) 
			{
				for (i = opacitystart; i <= opacityend; i++)
				{
					SNDK.animation.opacityFadeHelper (element, i, timer * speed)			
					timer++;
				}
			}
		},		
		
		// ------------------------------------
		// opacityFadeHelper
		// ------------------------------------	
		opacityFadeHelper : function (element, opacity, timeout)
		{
		      	    setTimeout(	function () { SNDK.tools.opacityChange (element, opacity);} ,timeout);		
		}
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: page
	// ---------------------------------------------------------------------------------------------------------------
	page :
	{
		hasFocus : true,
				
		init : function ()
		{
			try
			{
			document.onkeypress = SNDK.page.onKeyDown;
			}
			catch (erorr)
			{}
		},
		
		keyHandler : function (event)
		{		
			var key = SNDK.tools.getKey (event);
		
			if (!SNDK.page.hasFocus)
			{
				if (key == 38)
				{
					return false;
				}
		
				if (key == 40)
				{
					return false;
				}			
			}
		
			if (key == 27)															// Esc
			{ 			
				return false;
			}				
		
			return true;
		},
						
		onKeyDown : function (event)
		{
			return SNDK.page.keyHandler (event);
		}
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: widgets
	// ---------------------------------------------------------------------------------------------------------------
	widgets :
	{
		// ------------------------------------
		// rotator
		// ------------------------------------		
		/**
		 * @constructor
		 */
		rotator : function (options)
		{
			var _initialized = false;
			var _id = SNDK.tools.newGuid ();
			var _elements = new Array ();
			var _options = options;	
			var _defaults = {	stylesheet: "SNDK-Rotator",
						fadeDelay: 500,
						fadeDouble: false,
						randomize: false,
						delay: 2000,
						width: "100px",
						height: "100px"
					};
					
			var _temp =	{	timer: null,
						currentImage: -1,
						nextRotation: null,
						inTransition: false,
						stopped: false
					}
													
			setOptions ();
		
			this.play = functionPlay;
			this.stop = functionStop;		
			this.prev = functionPrev;
			this.next = functionNext;
		
			// Initialize
			window.onDomReady (init);				
		
			function init ()
			{
				// Container
				_elements["container"] = SNDK.SUI.helpers.getContainer (_options);
			
		//		// Container
		//		if (options.appendTo)
		//		{
		//			
		//		}
		//		
		//		if (typeof options.element == "string")
		//		{
		//			_elements["container"] = document.getElementById (_options.element);
		//		}
		//		else
		//		{
		//			_elements["container"] = _options.element;
		//		}
		//						
		//		_elements["container"].setAttribute ("id", _id);
				_elements["container"].className = _options.stylesheet;
			
				switch (_options.type)
				{
					case "fade":
						_elements["image_from"] = SNDK.tools.newElement ("img", {appendTo: _elements["container"]});
						_elements["image_from"].style.position = "absolute";
						SNDK.tools.opacityChange (_elements["image_from"], 0);
		
						_elements["image_to"] = SNDK.tools.newElement ("img", {appendTo: _elements["container"]});
						_elements["image_to"].style.position = "absolute";
						SNDK.tools.opacityChange (_elements["image_to"], 0)
					
						break;									
				}	
						
				if (_options.randomize)
				{
					_options.images.sort(function() {return 0.5 - Math.random();})				
				}			
			
				rotate (false);		
			}
		
			function rotate (done)
			{			
				switch (_options.type)
				{
					case "fade":
				
							clearTimeout (_temp.nextRotation);
				
							if (done)
							{
								_elements["image_from"].src = _options.images[_temp.currentImage].src;
								SNDK.tools.opacityChange (_elements["image_from"], 100);
						
								_elements["image_to"].src = "";						
								SNDK.tools.opacityChange (_elements["image_to"], 0);
						
						
								_temp.nextRotation = setTimeout (function () {rotate (false)}, _options.delay);
								_temp.inTransition = false;
							}
							else
							{	
								_temp.inTransition = true;					
					
								if (_temp.currentImage == _options.images.length-1)
								{
									_temp.currentImage = 0;
							
									if (_options.randomize)
									{
										_options.images.sort(function() {return 0.5 - Math.random();})				
									}
								}				
								else
								{
									_temp.currentImage++;
								}
					
								_elements["image_to"].src = _options.images[_temp.currentImage].src;
		
								SNDK.animation.opacityFade (_elements["image_to"], 0, 100, _options.fadeDelay);
								if (_options.fadeDouble)
								{
									SNDK.animation.opacityFade (_elements["image_from"], 100, 0, _options.fadeDelay);
								}
						
		
								setTimeout (function () {rotate (true)}, _options.fadeDelay + 10);
							}
						break;
				}			
			}
				
			function setOptions ()
			{
				// stylesheet
				if (_options.stylesheet == null)
					_options.stylesheet = _defaults.stylesheet;			
		
				// fadeDelay
				if (_options.fadeDelay == null)
					_options.fadeDelay = _defaults.fadeDelay;		
		
				// fadeDelay
				if (_options.delay == null)
					_options.delay = _defaults.delay;
				
				// fadeDouble
				if (_options.fadeDouble == null)
					_options.fadeDouble = _defaults.fadeDouble;				
		
				// randomize
				if (_options.randomize == null)
					_options.randomize = _defaults.randomize;
				
				// images
				if (_options.images != null)
				{
					var temp = new Array ();
					for (var index in _options.images)
					{
						temp[index] = _options.images[index];
					}
				
					_options.images = temp;
				}												
			}
			
			function functionPrev ()
			{
				if (!_temp.inTransition)
				{
					rotate (true);
		
					_temp.currentImage--;
					if (_temp.currentImage == -1)
					{
						_temp.currentImage = _options.images.length-1;
					}			
					_temp.currentImage--;
			
					rotate (false);	
				}
			}
			
			function functionNext ()
			{
				if (!_temp.inTransition)
				{
					rotate (true);
					rotate (false);
				}			
			}
		
			function functionStop ()
			{
				clearTimeout (_temp.nextRotation);
				_temp.stopped = true;
			}
		
			function functionPlay ()
			{
				_temp.nextRotation = setTimeout (function () {rotate (false)}, _options.delay);
				_temp.stopped = false;
			}		
		}	,
	
		// ------------------------------------------------------------------------------------------------------------------------
		// blobMenu (options)
		// ------------------------------------------------------------------------------------------------------------------------
		// ------------------------------------------------------------------------------------------------------------------------
		/**
		 * @constructor
		 */
		blobMenu : function (options)
		{
			var _options = options;			
			var _elements = new Array ();
			var _temp = { initialized: false,
				      focusHover: null,
				      focusAnimation: null,
				      blurAnimation : null,
				      blurTimer: null,
				      blob: null,
				      lasthover: null,
				      home: null
				    };
								
			setOptions ();									
									
			// Initialize
			window.onDomReady (init);
		
			// -------------------------------------
			// Private functions
			// -------------------------------------	
			// -------------------------------------
			// init
			// -------------------------------------
			function init ()
			{															
				if (typeof _options.element == "string")
				{
					_elements["container"] = document.getElementById (_options.element);
				}
				else
				{
					_elements["container"] = _options.element;
				}
				
				var elements = _elements["container"].getElementsByTagName("*");
				for (var index = 0; index < elements.length; index++) 
				{
					var element = elements[index];
					if (element.tagName == "LI")
					{							
						element.setAttribute ("id", SNDK.tools.newGuid ());							
						element.onmouseover = eventOnMouseOver;
						element.onmouseout = eventOnMouseOut;
						
						if (element.className == "Selected")
						{
							_elements["selected"] = element;
						}
					}
				}
				
				_elements["blob"] = SNDK.tools.newElement ("li", {className: "Blob", appendTo: _elements["container"]});
				_elements["blob"].style.left = _elements["selected"].offsetLeft;
				_elements["blob"].style.top = _elements["selected"].offsetTop;		
		
		// TODO: Needed?
		//		if (!_options.blob.width)
		//		{
		//			_elements["blob"].style.width = _elements["selected"].offsetWidth;
		//		}
				
				// Hook events	
				window.addEvent (window, 'resize', eventOnResize);						
			}							
			
			// -------------------------------------
			// setOptions
			// -------------------------------------
			function setOptions ()
			{
				if (!_options.blob) _options.blob = new Array ();
									
				if (!_options.blob.speed) _options.blob.speed = 500;
				if (!_options.blob.reset) _options.blob.reset = 500;
				
				if (!_options.blob.left) _options.blob.left = new Array ();
				if (!_options.blob.left.ease) _options.blob.left.ease = "outQuad";
				
				if (!_options.blob.top) _options.blob.top = new Array ();
				if (!_options.blob.top.ease) _options.blob.top.ease = "outQuad";
				
				if (_options.blob.width)
				{
					if (!_options.blob.width.ease) _options.blob.width.ease = "outQuad";
				}																	
			}
		
			// -------------------------------------
			// Events
			// -------------------------------------
			function eventOnResize ()
			{
				clearTimeout (_temp.blurTimer)
				
				if (_temp.blurAnimation != null)
				{
					_temp.blurAnimation.stop ();
				}						
				
				if (_temp.focusAnimation != null)
				{
					_temp.focusAnimation.stop ();
				}
				
				console.log ("ff")
																				
				eventOnMouseOut ();
			}
			
			// -------------------------------------
			// OnMouseOver
			// -------------------------------------									
			function eventOnMouseOver ()
			{				
				clearTimeout (_temp.blurTimer)
				
				if (_temp.blurAnimation != null)
				{
					_temp.blurAnimation.stop ();
				}						
				
				if (_temp.focusHover == this.id)
				{
					return;
				}
		
				if (_temp.focusAnimation != null)
				{
					_temp.focusAnimation.stop ();
				}
														
				_temp.focusHover = this.id;
					
				var top = null;
				var left = null;
				var width = null;								
		
				if (_options.blob.top != null)
				{
					top = {end: this.offsetTop, ease: _options.blob.left.ease};
				}
		
				if (_options.blob.left != null)
				{
					left = {end: this.offsetLeft, ease: _options.blob.left.ease};
				}
				
				if (_options.blob.width != null)
				{
					width = {end: this.offsetWidth, ease: _options.blob.width.ease};
				}
															
				_temp.focusAnimation = new SNDK.animation.animate ({
										element: _elements["blob"], 
										duration: options.blob.speed, 
										fps: 60, 
										top: top,
										left: left,																																							
										width: width
									});
				_temp.focusAnimation.play ();
			}
		
			// -------------------------------------
			// onMouseOut
			// -------------------------------------														
			function eventOnMouseOut ()
			{
				if (_temp.blurAnimation != null)
				{
					_temp.blurAnimation.stop ();
				}					
			
				var top = null;
				var left = null;
				var width = null;					
			
				if (_options.blob.top != null)
				{
					top = {end: _elements["selected"].offsetTop, ease: _options.blob.left.ease};
				}
		
				if (_options.blob.left != null)
				{
					left = {end: _elements["selected"].offsetLeft, ease: _options.blob.left.ease};
				}
				
				if (_options.blob.width != null)
				{
					width = {end: _elements["selected"].offsetWidth, ease: _options.blob.width.ease};
				}					
			
				_temp.blurTimer = setTimeout ( function () {
									 	_temp.focusHover = null;
										_temp.blurAnimation = new SNDK.animation.animate ({
																element: _elements["blob"],
																duration: _options.blob.speed, 
																fps: 60, 
																top: top,																		
																left: left,								
																width: width
																});
									
				_temp.blurAnimation.play ();
				}, _options.blob.reset);
			}
		}				,
	
		simplaMenu : function (attributes)
		{
			var _elements = new Array ();
			var _attributes = attributes;
			var _temp = 	{ initialized: false,
					  id: SNDK.tools.newGuid (),
					  selectedCategory: null,
					  selectedItem: null,
					  expandedCategory: null,
					  lastid: "",
					  lastfocus: "",
					  animations: new Array (),
					  categoryheight: null			  
					};
		
			_attributes.id = SNDK.tools.newGuid ();
												
			// Construct
			construct ();
			
			// Initialize
			window.onDomReady (init);
		
			function init ()
			{
				if (typeof (_attributes.appendTo) == "string")
				{
					_attributes.appendTo = document.getElementById (_attributes.appendTo);
				}
		
				_attributes.appendTo.appendChild (_elements["container"]);		
				
				if (SNDK.cookie.get ("simplamenu-selected"))
				{						
					setSelected (SNDK.cookie.get ("simplamenu-selected").split (":")[0], SNDK.cookie.get ("simplamenu-selected").split (":")[1]);
				}
				
		//				if (_temp.selectedCategory)
		//				{
		//				_temp.selectedCategory.style.height = _temp.selectedCategory.scrollHeight + "px";
		//				_temp.lastid = _temp.selectedCategory.id;var attributes = parseAttributes (node.attributes);
		//				}
				
				_temp.initialized = true;	
			};
			
			function construct ()
			{
				if (_attributes.XML)
				{		
					var parseAttributes =	function (attributes)
					{
						var result = {};
						for (var i = 0; i < attributes.length; i++)
						{		
							var value = attributes[i].value;
							var attribute = attributes[i].name;
												
							if (value.toLowerCase () == "true")
							{
								value = true;
							}
							else if (value.toLowerCase () == "false")
							{
								value = false;
							}
												
							result[attribute] = value; 
						}
						
						return result;
					}
				
				
					var root = _attributes.XML.getElementsByTagName ("menu").item (0);	
				
					_attributes.items = new Array ();
				
					var parseXML = function (nodes)
					{
						for (var index = 0, len = nodes.length; index < len; index++)
						{
							var node = nodes.item (index);
							if (node == null)
							{
								continue;
							}
												
							switch (node.tagName)
							{
								case "category":
								{													
									var attributes = parseAttributes (node.attributes);
								
									_attributes.items[attributes.tag] = attributes;
									
									if (node.childNodes.length > 0)
									{
										_attributes.items[attributes.tag].items = new Array ();
										
										nodes2 = node.childNodes;
										
										for (var index2 = 0, len2 = nodes2.length; index2 < len2; index2++)
										{
											var node2 = nodes2.item (index2);
											if (node2 == null)
											{
												continue;
											}
											
											switch (node2.tagName)
											{
												case "item":
												{										
													var attributes2 = parseAttributes (node2.attributes);
													_attributes.items[attributes.tag].items[attributes2.tag] = attributes2;
																			
													break;												
												}
											}																						
										}															
									}
														
									break;
								}	
							}
						}
					}				
					
					parseXML (root.childNodes);
				}
			
				// Container
				_elements["container"] = SNDK.tools.newElement ("div", {});
				_elements["container"].setAttribute ("id", _attributes.id);
				_elements["container"].className = _attributes.stylesheet;
				
				// Items
				_elements["items"] = new Array ();
				_elements["items2"] = new Array ();
				_elements["items3"] = new Array ();
				for (index in _attributes.items)
				{									
					var category = new SNDK.tools.newElement ("div", {id: _temp.id +"/category/"+ index, className: "Category", appendTo: _elements["container"]});
					category.onclick = eventOnCategoryClick;
					SNDK.tools.textSelectionDisable (category);
		
					if (_temp.categoryheight == null)
					{
						_temp.categoryheight = parseInt (SNDK.tools.getStyle (category, "height"));
					}					
														
					var text = SNDK.tools.newElement ("div", {id: _temp.id +"/categorytext/"+ index, className: "Text", appendTo: category});
					text.innerHTML = _attributes.items[index].title;
					text.onmouseover = eventOnCategoryMouseover;
					text.onmouseout = eventOnCategoryMouseout;
					
					if (_attributes.items[index].items) 
					{
						for (index2 in _attributes.items[index].items)
						{						
							var item = new SNDK.tools.newElement ("div", {id: _temp.id +"/item/"+ index +"/"+ index2, className: "Item", appendTo: category});
							item.innerHTML = _attributes.items[index].items[index2].title;
							item.onclick = eventOnItemClick;
							
							if (_attributes.items[index].items[index2].selected)
							{
								item.className = "Item ItemSelected";
								_attributes.items[index].selected = true;
							}						
							
							_elements["items2"]["item/"+index+"/"+index2] = item;	
						}					
					}
					
					if (_attributes.items[index].selected)
					{
						category.className = "Category CategorySelected";						
						_temp.selectedCategory = category;
					}
					
					_elements["items3"]["category/"+index] = category;
					_elements["items"][index] = category;									
				}
			}
					
			function setAttributes ()
			{
				
			}
			
			function expandCategory (category)
			{
				if (_temp.animations["category:"+ category])
				{
					_temp.animations["category:"+ category].stop ();
				}
		
				if (_temp.animations["category:"+ _temp.expandedCategory])
				{
					_temp.animations["category:"+ _temp.expandedCategory].stop ();
				}
		
				if (category == _temp.expandedCategory)
				{							
					var element = document.getElementById (_temp.id +"/category/"+ category)
				
					_temp.expandedCategory = null;
					_temp.animations["category:"+ category] = new SNDK.animation.animate	({ 
													element: element, 
													duration: 800, 
													fps: 60, 
													height: {end: _temp.categoryheight +"px", ease: "outexpo"}
												});
					_temp.animations["category:"+ category].play ();	
				}
				else
				{
					if (_temp.expandedCategory)
					{
						var test = document.getElementById (_temp.id +"/category/"+ _temp.expandedCategory);
						_temp.animations["category:"+ _temp.expandedCategory] = new SNDK.animation.animate 	({ 
															element: test, 
														  	duration: 400, 
															fps: 60, 
															height: {end: _temp.categoryheight +"px", ease: "outexpo"}
														});
						_temp.animations["category:"+ _temp.expandedCategory].play ();
			
					}
		
					var element = document.getElementById (_temp.id +"/category/"+ category)
					
					_temp.expandedCategory = category;			
					_temp.animations["category:"+ category] = new SNDK.animation.animate	({	
													element: element, 
												  	duration: 400, 
												  	fps: 60, 
												  	height: {end: element.scrollHeight + "px", ease: "outexpo"}
												});
					_temp.animations["category:"+ category].play ();
				}						
			
			}
								
			function setSelected (category, item)
			{
				if (category)
				{
					if (_temp.selectedCategory)
					{
						document.getElementById (_temp.id +"/category/"+ _temp.selectedCategory).className = "Category";				
					}
					
					if (_temp.selectedItem)
					{
						document.getElementById (_temp.id +"/item/"+ _temp.selectedCategory +"/"+ _temp.selectedItem).className = "Item";	
						_temp.selectedItem = null;
					}
							
					//var element = document.getElementById (_temp.id +"/category/"+ category);								
					var element = _elements["items3"]["category/"+ category];
					element.className = "Category CategorySelected";			
					
					if (_temp.animations["category:"+ category] == null)					
					{
						element.style.height = element.scrollHeight + "px";
						_temp.expandedCategory = category;
					}
										
					_temp.selectedCategory = category;
				}
											
				if (typeof item != "undefined" && item != "undefined")
				{	
					//var element = document.getElementById (_temp.id +"/item/"+ category +"/"+ item);
					var element = _elements["items2"]["item/"+ category +"/"+ item]
					element.className = "Item ItemSelected";
					
					_temp.selectedItem = item;
				}
								
				SNDK.cookie.set ("simplamenu-selected", category +":"+ item, 0, "/", "", "");
			}	
			
		
			
			function eventOnItemClick (e)
			{
				SNDK.tools.stopPropogation (e);
			
				var category = this.id.split ("/")[2];
				var item = this.id.split ("/")[3];
		
				setSelected (category, item);								
				
				if (_attributes.items[category].items[item].href)
				{
				
					SNDK.tools.setURL (_attributes.items[category].items[item].href);
				}											
			}
			
			function eventOnCategoryMouseover ()
			{
				if (_temp.animations[this.id])
				{
					_temp.animations[this.id].stop ()
		
				}
		
				_temp.animations[this.id] = new SNDK.animation.animate ({ element: this, 
										  	  duration: 400, 
										  	  fps: 60, 
										  	  paddingRight: {end: "25px", ease: "outexpo"}
											});
				_temp.animations[this.id].play ();
			
			}
			
			function eventOnCategoryMouseout ()
			{
				if (_temp.animations[this.id])
				{
					_temp.animations[this.id].stop ()
				}
		
				_temp.animations[this.id] = new SNDK.animation.animate	({
												element: this, 
												duration: 400, 
												fps: 60, 
												paddingRight: {end: "15px", ease: "outexpo"}
											});
				_temp.animations[this.id].play ();
			}
			
			function eventOnCategoryClick ()
			{				
				var category = this.id.split ("/")[2];
																						
				expandCategory (category)
								
				if (_attributes.items[category].items == null)
				{
					setSelected (category);
				}
				
				if (_attributes.items[category].href)
				{
					setTimeout ( function () {					SNDK.tools.setURL (_attributes.items[category].href);}, 300)
		
				}																	
			}
		},
	
		shortcuts : function (attributes)
		{
			var _elements = new Array ();
			var _attributes = attributes;		
			var _temp = 	{ initialized: false,
					  id: SNDK.tools.newGuid (),
					  isDirty: false,
					  selected: null
					};
					
			setAttributes ();
																	
			// Functions
			this.type = "SHORTCUTS";
			this.refresh = functionRefresh;
			this.addItem = functionAddItem;
			this.removeItem = functionRemoveItem;
			this.getAttribute = functionGetAttribute;
			this.setAttribute = functionSetAttribute;
																									
			// Construct
			construct ();
		
			// Initialize
			window.onDomReady (init);
		
			// --------------------------------------------------------------------------------------------------------------------------------------
			// Private functions
			// --------------------------------------------------------------------------------------------------------------------------------------
			function init ()
			{			
				if (typeof (_attributes.appendTo) == "string")
				{
					_attributes.appendTo = document.getElementById (_attributes.appendTo);
				}
				
				_attributes.appendTo.appendChild (_elements["container"]);		
		
				_temp.initialized = true;	
			};			
							
			function construct ()
			{				
				// Container
				_elements["container"] = SNDK.tools.newElement ("ul", {});
				_elements["container"].setAttribute ("id", _attributes.id);
				_elements["container"].className = _attributes.stylesheet;
							
				// Items
				drawItems ();	
			}
				
			function drawItems ()
			{
				// Clear current items.
				_elements["container"].innerHTML = " ";
				
				// Create new items.
				_elements["items"] = new Array ();
				for (index in _attributes.items)
				{		
					var item = _attributes.items[index];							
					var element1 = new SNDK.tools.newElement ("li", {id: _temp.id +"+"+ item.tag, appendTo: _elements["container"]});
					var element2 = new SNDK.tools.newElement ("a", {appendTo: element1});								
					
					if (item.link)
					{
						element2.setAttribute ("href", item.link);
					}
					
					if (item.onClick)
					{
						element1.onclick = function () {eventOnClick (this)};				
					}				
					
					// This Item uses icons.
					if (item.icon)
					{
						var attributes = item.icon.split (",");
						
						var icon = attributes[0];
						var color1 = attributes[1];
						var color2 = attributes[2];
					
						var icon1 = new SNDK.tools.newElement ("span", {id: "icon1", className: "icon-"+ icon +" icon-size4 "+ color1, appendTo: element2});
						var icon2 = new SNDK.tools.newElement ("span", {id: "icon2", className: "icon-"+ icon +" icon-size4 "+ color2, appendTo: element2});
					}
					
					// This Item uses stylesheet.
					if (_attributes.stylesheet)
					{
						element2.className = item.stylesheet;	
					}	
					
					_elements["items"][index] = element1;
				}
			}
					
			function refresh ()
			{
				if (_temp.isDirty)
				{
					drawItems ();
					_temp.isDirty = false;
				}
			}
			
			function setAttributes ()
			{
				// Id
				_attributes.id = SNDK.tools.newGuid ();
			
				// Stylesheet
				if (!_attributes.stylesheet)
					_attributes.stylesheet = "shortcuts";			
		
				// Items
				if (!_attributes.items)
					_attributes.items = new Array ();
				
				// Tag
				if (!_attributes.tag)
					_attributes.tag = "";
				
				
				// XML
				if (_attributes.XML)
					parseXML ();					
			}
			
			function parseXML ()
			{
				if (_attributes.XML)
				{		
					var parseAttributes =	function (attributes)
					{
						var result = {};
						for (var i = 0; i < attributes.length; i++)
						{		
							var value = attributes[i].value;
							var attribute = attributes[i].name;
											
							if (value.toLowerCase () == "true")
							{
								value = true;
							}
							else if (value.toLowerCase () == "false")
							{
								value = false;
							}
											
							result[attribute] = value; 
						}
					
						return result;
					}
					
					var root = _attributes.XML.getElementsByTagName ("shortcuts").item (0);	
			
					var parseXML = function (nodes)
					{
						for (var index = 0, len = nodes.length; index < len; index++)
						{
							var node = nodes.item (index);
							if (node == null)
							{
								continue;
							}
											
							switch (node.tagName)
							{
								case "item":
								{													
									var attributes = parseAttributes (node.attributes);
							
									_attributes.items[attributes.tag] = attributes;
																			
									break;
								}	
							}
						}
					}				
				
					parseXML (root.childNodes);
				}
			}		
							
			function getAttribute (attribute)
			{
				switch (attribute)
				{
					case "id":
					{
						return _attributes[attribute];
					}
				
					case "selected":
					{
						return _temp.selected;
					}
									
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}
		
			function setAttribute (attribute, value)
			{
				switch (attribute)
				{
					case "id":
					{
						throw "Attribute with name ID is ready only.";
						break;
					}
		
					case "selected":
					{
						setSelected (value);
						break;;
					}
		
												
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}	
			
			function setSelected (tag)
			{
				if (_temp.selected != null)
				{
					try
					{
					_elements["items"][_temp.selected].className = "";
					}
					catch (e)
					{
					}
				}
				
				_temp.selected = tag;
			
				_elements["items"][tag].className = "current";		
			}		
			
			function addItem (item)
			{
				// If not tag has been set, make sure one is.
				if (!item.tag)
					item.tag = SNDK.tools.newGuid ();
			
				_attributes.items[item.tag] = item;
				
				// Refresh
				_temp.isDirty = true;
				refresh ();
							
				return item.tag;		
			}			
			
			function removeItem (tag)
			{
				for (index in _attributes.items)
				{				
					var item = _attributes.items[index];
										
					if (item.tag == tag)
					{
						// Remove item
						delete _attributes.items [index];
						
						// Refresh
						_temp.isDirty = true;
						refresh ();
						
						break;
					}
				}								
			}
			
		
			// --------------------------------------------------------------------------------------------------------------------------------------
			// Public functions
			// --------------------------------------------------------------------------------------------------------------------------------------
			function functionAddItem (item)
			{
				return addItem (item)
			}
			
			function functionRemoveItem (tag)
			{		
				removeItem (tag);
			}	
			
			function functionRefresh ()
			{
				refresh ();
			}	
			
			function functionGetAttribute (attribute)
			{
				return getAttribute (attribute);
			}
			
			function functionSetAttribute (attribute, value)
			{
				setAttribute (attribute, value);
			}
			
			
			// --------------------------------------------------------------------------------------------------------------------------------------
			// Events
			// --------------------------------------------------------------------------------------------------------------------------------------		
			function eventOnClick (element)
			{
				for (index in _attributes.items)
				{
					var item = _attributes.items[index];
					var id = element.id.split ("+")[1];
					
					if (item.tag == id)
					{
						if (item.onClick)
						{
							setSelected (id)
						
							switch (typeof (item.onClick))
							{
								case "string":
								{	
									setTimeout (function () {eval (item.onClick +"('"+id+"')")}, 1);
									break;
								}
								
								case "function":
								{
									setTimeout (function () {item.onClick (id)}, 1);								
									break;							
								}
							}					
						}
					
						break;
					}
				}			
			}		
		}	
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: SUI
	// ---------------------------------------------------------------------------------------------------------------
	SUI :
	{
		// ---------------------------------------------------------------------------------------------------------------
		// CLASS: modal
		// ---------------------------------------------------------------------------------------------------------------
		modal :
		{
			// ---------------------------------------------------------------------------------------------------------------
			// CLASS: dialog
			// ---------------------------------------------------------------------------------------------------------------
			dialog :
			{
				// ---------------------------------------------------------------------------------------------------------------
				// CLASS: alert
				// ---------------------------------------------------------------------------------------------------------------
				alert :
				{
					show : function (attributes)
					{
						var dialog;
							
						var onClick =	function ()
										{
											dialog.dispose ();
										};
						
						var buttons = [{label: attributes.buttonLabel, onClick: onClick}];
					
					
						dialog = new SNDK.SUI.modal.dialog.base ({text: attributes.text, width: "400px", height: "90px", buttons: buttons});
						
						dialog.open ();
					}
				},
			
				// ---------------------------------------------------------------------------------------------------------------
				// CLASS: confirm
				// ---------------------------------------------------------------------------------------------------------------
				confirm :
				{
					show : function (attributes)
					{
						var dialog;
							
						var onClick =	function (result)
										{											
											dialog.dispose ();
											
											if (attributes.onDone != null)
											{
												setTimeout (function () {attributes.onDone (result)}, 1);
											}
										};
						
						var buttons = [{label: attributes.buttonLabel1, onClick: function () {onClick (1)}}, {label: attributes.buttonLabel2, onClick: function () {onClick (2)}}];
					
						dialog = new SNDK.SUI.modal.dialog.base ({text: attributes.text, width: "400px", height: "90px", buttons: buttons});
						
						dialog.open ();
					}
					
				},
			
				/**
				* @constructor
				*/
				base : function (attributes)
				{
					var _initialized = false;
					var _attributes = attributes;	
					var _elements = new Array ();
						
					var _temp = 	{ 			  
							  controls: 0,
							  tabs: 0,
							  controlWidth: "533px",
							  controlWidthTabbed: "510px",
							  top: 0,
							  left: 0,
							  isBusy: false,
							  cache: Array (),
							  isOpen: false
							}
							
					setAttributes ();
					
					// Values
					var _valuehidden = true;
					
					// Methods		
					this.open = functionOpen;
					this.close = functionClose;	
					this.dispose = functionDispose;
					this.toggleBusy = functionToggleBusy;
						
					this.getUIElement = functionGetUIElement;
					this.addUIElement = functionAddUIElement;
					//	this.addUIElementsByXML = functionAddUIElementsByXML;
						
					// Construct
					construct ();
					
					// Init Control
					init ();
					
					// -----------------------------------------------------------------------------------------------------------------
					// Private functions
					// ----------------------------------------------------------------------------------------------------------------- 	
					// ------------------------------------
					// Init
					// ------------------------------------
					function init ()
					{
						updateCache ();
								
						refresh ();		
					}
					
					// ------------------------------------
					// Construct
					// ------------------------------------
					function construct ()
					{			
						SNDK.debugStopRefresh = true;
						
						// Blocker.
						_elements.blocker = SNDK.tools.newElement ("div", {appendTo: SNDK.SUI.modal.container});
						SNDK.tools.changeOpacityByObject (_elements.blocker, 0);	
					
						// Container.
						_elements.container = SNDK.tools.newElement ("div", {appendTo: SNDK.SUI.modal.container});
						_elements.container.className = "modal";
						_elements.container.style.display = "none";		
						SNDK.tools.changeOpacityByObject (_elements.container, 0);								
							
						// Content.
						_elements.content = SNDK.tools.newElement ("div", {appendTo: _elements.container});
						_elements.content.className = "modal-content align-center";	
						
						// Text.
						_elements.text = SNDK.tools.newElement ("div", {appendTo: _elements.content});		
						_elements.text.style = "valign: center;"
					
						// Buttons.
						_elements.buttons = SNDK.tools.newElement ("div", {appendTo: _elements.content});
						_elements.buttons.className = "modal-buttons align-center";
						
						var buttonWidth = 100 / _attributes.buttons.length;			
						for (index in _attributes.buttons)
						{									
							new SNDK.SUI.button ({label: _attributes.buttons[index].label, width: buttonWidth +"%", stylesheet: _attributes.buttons[index].stylesheet, appendTo: _elements.buttons, onClick: _attributes.buttons[index].onClick});
						}
						
						SNDK.SUI.init ();
									
						// Hook events.		
						window.addEvent (window, 'resize', refresh);				
						
						SNDK.debugStopRefresh = false;
					}
					
					// ------------------------------------
					// Refresh
					// ------------------------------------				
					function refresh ()
					{
						_elements.text.innerHTML = _attributes.text;
						
						setDimensions ();
					}	
						
					// ------------------------------------
					// updateCache
					// ------------------------------------
					function updateCache ()
					{
						_temp.cache["containerBoxDimensions"] = SNDK.tools.getElementStyledBoxSize (_elements["container"]);
					
					//	_temp.cache["barBoxSize"] = SNDK.tools.getElementStyledBoxSize (_elements["bar"]);
					//	_temp.cache["barHeight"] = SNDK.tools.getElementStyledHeight (_elements["bar"]);
											
						_temp.cache.containerHeight = _temp.cache.containerBoxDimensions.vertical;
						_temp.cache.containerWidth = _temp.cache.containerBoxDimensions.horizontal;
						
					//	_temp.cache["barBoxDimensions"] = SNDK.tools.getElementStyledBoxSize (_elements["bar"]);		
					}	
					
					// ------------------------------------
					// Refresh
					// ------------------------------------	
					function setAttributes ()
					{
						// Width
						if (!_attributes.width) 
							_attributes.width = "content";	
										
						if (_attributes.width != "content")
						{
							if (_attributes.width.substring (_attributes.width.length - 1) == "%")
							{	
								_attributes.widthType = "percent";
								_attributes.width = _attributes.width.substring (0, _attributes.width.length - 1)			
							}
							else
							{	
								_attributes.widthType = "pixel";
								_attributes.width = _attributes.width.substring (0, _attributes.width.length - 2)
							}
						}
						else
						{
							_attributes.widthType = "content";
						}
						
						// Height
						if (!_attributes.height) 
							_attributes.height = "content";
									
						if (_attributes.height != "content")
						{
							if (_attributes.height.substring (_attributes.height.length - 1) == "%")
							{
								_attributes.heightType = "percent";
								_attributes.height = _attributes.height.substring (0, _attributes.height.length - 1)			
							}
							else
							{
								_attributes.heightType = "pixel";
								_attributes.height = _attributes.height.substring (0, _attributes.height.length - 2)
							}	
						}
						else
						{
							_attributes.heightType = "content";		
						}
						
						// Buttons
						if (!_attributes.buttons) 
							_attributes.buttons = new Array ();
						
						// Title
						if (!_attributes.text) 
							_attributes.text = "";					
					}
						
					// ------------------------------------
					// SetDimensions
					// ------------------------------------			
					function setDimensions ()
					{
						var width = 0;
						var height = 0;
					
						if (_attributes.widthType != "pixel")
						{																										
							width = ((SNDK.tools.getElementInnerWidth (_elements["container"].parentNode) * _attributes.width) / 100);
						}
						else
						{	
							width = _attributes.width ;
						}	
							
						if (_attributes.heightType != "pixel")
						{																										
							height = ((SNDK.tools.getElementInnerHeight (_elements["container"].parentNode) * _attributes.height) / 100);
						}
						else
						{	
							height = _attributes.height ;
						}			
					
						_elements["content"].style.width = width - (_temp.cache.containerWidth) +"px";
						_elements["content"].style.height = height - (_temp.cache.containerHeight) +"px";
							
						_elements["text"].style.height = height - (_temp.cache.containerHeight) - 50 +"px";
						
					//	_elements["busy"].style.width = width - (_temp.cache.containerWidth) +"px";		
					//	_elements["busy"].style.height = height - (_temp.cache.containerHeight) +"px";
						
						
						
						
								
						var windowSize = SNDK.tools.getWindowSize ();							
						
					//		console.log (SNDK.tools.getElementInnerWidth (_elements["container"].parentNode))
					//		console.log (_temp.cache.containerWidth)
					//		console.log (_temp.cache.containerHeight)						
					//		console.log (windowSize)		
					//		console.log (width)
					
						var left = (windowSize[0] - width) / 2;				
						var top = (windowSize[1] - height) / 2;
						
						
						_temp.top = top;
						_temp.left = left;
						
					//		console.log (windowSize[0] - width)
					
						_elements["container"].style.left = left +"px";					
						_elements["container"].style.top = top +"px";				
					}				
					
					// ------------------------------------
					// open
					// ------------------------------------	
					function open ()
					{
						if (!_temp.isOpen)
						{
							// If no other windows are open, we need to setup the modal container.
							if (SNDK.SUI.modal.depth == 0)
							{			
								SNDK.SUI.modal.container.className =  "with-blocker";		
							}
							
							// Add modal depth.
							SNDK.SUI.modal.depth++;
							
							// Show blocker.
							_elements.blocker.className = "modal-blocker visible";
							_elements.blocker.style.display = "block";
							SNDK.animation.opacityFade (_elements.blocker, 0, 100, 150);
							
							// Show container.
							_elements.container.style.display = "block";			
							SNDK.animation.opacityFade (_elements.container, 0, 100, 200);		
							
							// Set Window dimensions.
							setDimensions ();	
					
							// Animate container.
							var anim = new SNDK.animation.animate ({ element: _elements["container"], 
												 duration: 350, 
												 fps: 60, 
												 top: {	begin: (_temp.top - 80) +"px", 
												 	end: _temp.top +"px", 
												 	ease: "outexpo"
												 	}
												});
							//anim.play ();	
							
							SNDK.SUI.refresh ();
							
							_temp.isOpen = true;		
						}
					}
					
					// ------------------------------------
					// close
					// ------------------------------------	
					function close ()
					{
						if (_temp.isOpen)
						{				
						
							// Hide blocker.
							SNDK.animation.opacityFade (_elements.container, 100, 0, 200);
										
							// Hide container.
							SNDK.animation.opacityFade (_elements.blocker, 100, 0, 200);
						
							// Animate container.		
							var anim = new SNDK.animation.animate ({ element: _elements.container, 
												 duration: 350, 
												 fps: 60, 
												 top: {	begin: _temp.top +"px", 
												 	end: (_temp.top - 80) +"px", 
												 	ease: "outexpo"
												 	}
												});
					//		anim.play ();
							
							// Unblock content underneath when done.
							var onDone = 	function ()
									{
										// Remove modal depth.
										SNDK.SUI.modal.depth--;
							
										// If no other windows are open, we need to remove the blocker.
										if (SNDK.SUI.modal.depth == 0)
										{			
											SNDK.SUI.modal.container.className =  "";		
										}		
										
										_elements.blocker.className = "";
										_elements.blocker.style.display = "none";			
									
										_temp.isOpen = false;
									};	
									
							setTimeout (onDone, 400);
						}
					}
					
					// ------------------------------------
					// dipose
					// ------------------------------------				
					function dispose ()
					{	
						close ();
						
						// When all is done, make sure to remove all traces of the modal window.
						var onDone =	function ()
								{		
									// Dispose all UI elements.																														
									for (index in _elements.ui)
									{
										try
										{
											_elements.ui[index].dispose ();
										}
										catch (e)
										{
											console.log (e);
											console.log ("CANNOT DISPOSE: ");
											console.log (_elements.ui[index]);
										}
									}								
					
									SNDK.SUI.modal.container.removeChild (_elements.blocker);
									SNDK.SUI.modal.container.removeChild (_elements.container);
								};
								
						// Unhook events.
						window.removeEvent (window, 'resize', refresh);					
										
						setTimeout (onDone, 400 + 10); 
					}	
					
					function toggleBusy ()
					{
						if (!_temp.isBusy)
						{
							_elements.busy.style.display = "block";
							SNDK.animation.opacityFade (_elements.busy, 0, 50, 150);	
							_temp.isBusy = true;
						}
						else
						{
							SNDK.animation.opacityFade (_elements.busy, 50, 0, 150);
							
							var onDone = 	function ()
									{
										_elements.busy.style.display = "none";
										_temp.isBusy = false;
									};
							
							setTimeout (onDone, 150);			
						}
					}
					// -----------------------------------------------------------------------------------------------------------------
					// Public functions
					// ----------------------------------------------------------------------------------------------------------------- 	
					// ------------------------------------
					// addUIElement
					// ------------------------------------			
					function functionAddUIElement (element)
					{		
						//_elements.ui[element.getAttribute ("tag")] = element;
						
						_elements.ui.canvas.addUIElement (element);
						
						//return element;
					
					}
					
					// ------------------------------------
					// addUIElementByXML
					// ------------------------------------	
					function functionAddUIElementsByXML (xml, appendTo)
					{
						var elements = SNDK.SUI.builder.construct ({XML: xml, appendTo: appendTo});
						
						for (i in elements)
						{		
							_elements["ui"][i] = elements[i];		
						}
					}
					
					// ------------------------------------
					// getUIElement
					// ------------------------------------	
					function functionGetUIElement (tag)
					{
					
						if (_elements.ui[tag] != null)
						{
							return _elements.ui[tag];
						}
						else
						{
							throw "No UI element with tag '"+ tag +"' was found.";
						}									
					}
					
					//	function showBusy ()
					//	{
					//		_elements["busy"].style.display = "block";
					//		SNDK.animation.opacityFade (_elements["busy"], 0, 100, 150);
					//	}
					
					//	function hideBusy ()
					//	{
					//		SNDK.animation.opacityFade (_elements["busy"], 100, 0, 150);
					//		
					//				setTimeout (	
					//		function () 
					//				{ 
					//					_elements["busy"].style.display = "none";	
					//				}, 150);
					//
					//	}
					
					
					
					function functionSetAttribute (attribute, value)
					{
					
					}
					
					function functionGetAttribute (attribute)
					{
					
					}
					
					// ------------------------------------
					// open
					// ------------------------------------		
					function functionOpen ()
					{
						open ();
						
					}
					
					// ------------------------------------
					// close
					// ------------------------------------		
					function functionClose ()
					{
						close ();
					}
					
					// ------------------------------------
					// dispose
					// ------------------------------------	
					function functionDispose ()
					{
						dispose ();
					}	
					
					// ------------------------------------
					// toggleBusy
					// ------------------------------------	
					function functionToggleBusy ()
					{
						toggleBusy ();
					}	
					
				}
			},
		
			// ---------------------------------------------------------------------------------------------------------------
			// CLASS: chooser
			// ---------------------------------------------------------------------------------------------------------------
			chooser :
			{
				/**
				* @constructor
				*/
				base : function (attributes)
				{
					var _initialized = false;
					var _attributes = attributes;	
					var _elements = new Array ();
						
					var _temp = 	{ 			  
							  controls: 0,
							  tabs: 0,
							  controlWidth: "533px",
							  controlWidthTabbed: "510px",
							  top: 0,
							  left: 0,
							  isBusy: false,
							  cache: Array (),
							  isOpen: false
							}
							
					setAttributes ();
					
					// Values
					var _valuehidden = true;
					
					// Methods		
					this.open = functionOpen;
					this.close = functionClose;	
					this.dispose = functionDispose;
					this.toggleBusy = functionToggleBusy;
						
					this.getUIElement = functionGetUIElement;
					this.addUIElement = functionAddUIElement;
					//	this.addUIElementsByXML = functionAddUIElementsByXML;
						
					// Construct
					construct ();
					
					// Init Control
					init ();
					
					
					// -----------------------------------------------------------------------------------------------------------------
					// Private functions
					// ----------------------------------------------------------------------------------------------------------------- 	
					// ------------------------------------
					// Init
					// ------------------------------------
					function init ()
					{
						updateCache ();
								
						refresh ();		
					}
					
					// ------------------------------------
					// Construct
					// ------------------------------------
					function construct ()
					{			
						SNDK.debugStopRefresh = true;
						
						// Blocker.
						_elements.blocker = SNDK.tools.newElement ("div", {appendTo: SNDK.SUI.modal.container});
						SNDK.tools.changeOpacityByObject (_elements.blocker, 0);	
					
						// Container.
						_elements.container = SNDK.tools.newElement ("div", {appendTo: SNDK.SUI.modal.container});
						_elements.container.className = "modal";
						_elements.container.style.display = "none";		
						SNDK.tools.changeOpacityByObject (_elements.container, 0);								
							
						// Content.
						_elements.content = SNDK.tools.newElement ("div", {appendTo: _elements.container});
						_elements.content.className = "modal-content align-center";	
						
						// Text.
					//	_elements.text = SNDK.tools.newElement ("div", {appendTo: _elements.content});		
					//	_elements.text.style.width = "100%";
					//	_elements.text.style.height = "100%";
						
						
						// Canvas.
						var canvas = new SNDK.SUI.canvas ({canScroll: false, appendTo: _elements.content,  width: "100%", height: "100%"});
									
						// UI.
						_elements.ui = {};
								
						// Process UI from xml document or url.
						if (_attributes.UIXML != null)
						{
							_elements.ui = SNDK.SUI.builder.construct ({XML: _attributes.UIXML, appendTo: canvas});	
						}
						else if (_attributes.UIURL != null)
						{				
							_elements.ui = SNDK.SUI.builder.construct ({URL: _attributes.UIURL, appendTo: canvas});	
						}
						
						_elements.ui.canvas = canvas;
					
						// Buttons.
						_elements.buttons = SNDK.tools.newElement ("div", {appendTo: _elements.content});
						_elements.buttons.className = "modal-buttons align-center";
						
						var buttonWidth = 100 / _attributes.buttons.length;			
						for (index in _attributes.buttons)
						{									
							new SNDK.SUI.button ({label: _attributes.buttons[index].label, width: buttonWidth +"%", stylesheet: _attributes.buttons[index].stylesheet, appendTo: _elements.buttons, onClick: _attributes.buttons[index].onClick});
						}
						
						SNDK.SUI.init ();
									
						// Hook events.		
						window.addEvent (window, 'resize', refresh);				
						
						SNDK.debugStopRefresh = false;
					}
					
					// ------------------------------------
					// Refresh
					// ------------------------------------				
					function refresh ()
					{
						//_elements.text.innerHTML = _attributes.text;
						
						setDimensions ();
					}	
						
					// ------------------------------------
					// updateCache
					// ------------------------------------
					function updateCache ()
					{
						_temp.cache["containerBoxDimensions"] = SNDK.tools.getElementStyledBoxSize (_elements["container"]);
					
					//	_temp.cache["barBoxSize"] = SNDK.tools.getElementStyledBoxSize (_elements["bar"]);
					//	_temp.cache["barHeight"] = SNDK.tools.getElementStyledHeight (_elements["bar"]);
											
						_temp.cache.containerHeight = _temp.cache.containerBoxDimensions.vertical;
						_temp.cache.containerWidth = _temp.cache.containerBoxDimensions.horizontal;
						
					//	_temp.cache["barBoxDimensions"] = SNDK.tools.getElementStyledBoxSize (_elements["bar"]);		
					}	
					
					// ------------------------------------
					// Refresh
					// ------------------------------------	
					function setAttributes ()
					{
						// Width
						if (!_attributes.width) 
							_attributes.width = "content";	
										
						if (_attributes.width != "content")
						{
							if (_attributes.width.substring (_attributes.width.length - 1) == "%")
							{	
								_attributes.widthType = "percent";
								_attributes.width = _attributes.width.substring (0, _attributes.width.length - 1)			
							}
							else
							{	
								_attributes.widthType = "pixel";
								_attributes.width = _attributes.width.substring (0, _attributes.width.length - 2)
							}
						}
						else
						{
							_attributes.widthType = "content";
						}
						
						// Height
						if (!_attributes.height) 
							_attributes.height = "content";
									
						if (_attributes.height != "content")
						{
							if (_attributes.height.substring (_attributes.height.length - 1) == "%")
							{
								_attributes.heightType = "percent";
								_attributes.height = _attributes.height.substring (0, _attributes.height.length - 1)			
							}
							else
							{
								_attributes.heightType = "pixel";
								_attributes.height = _attributes.height.substring (0, _attributes.height.length - 2)
							}	
						}
						else
						{
							_attributes.heightType = "content";		
						}
						
						// Buttons
						if (!_attributes.buttons) 
							_attributes.buttons = new Array ();
						
						// Title
						if (!_attributes.text) 
							_attributes.text = "";					
					}
						
					// ------------------------------------
					// SetDimensions
					// ------------------------------------			
					function setDimensions ()
					{
						var width = 0;
						var height = 0;
					
						if (_attributes.widthType != "pixel")
						{																										
							width = ((SNDK.tools.getElementInnerWidth (_elements["container"].parentNode) * _attributes.width) / 100);
						}
						else
						{	
							width = _attributes.width ;
						}	
							
						if (_attributes.heightType != "pixel")
						{																										
							height = ((SNDK.tools.getElementInnerHeight (_elements["container"].parentNode) * _attributes.height) / 100);
						}
						else
						{	
							height = _attributes.height ;
						}			
					
						_elements["content"].style.width = width - (_temp.cache.containerWidth) +"px";
						_elements["content"].style.height = height - (_temp.cache.containerHeight) +"px";
							
					//	_elements["text"].style.height = height - (_temp.cache.containerHeight) - 50 +"px";
						
					//	_elements["busy"].style.width = width - (_temp.cache.containerWidth) +"px";		
					//	_elements["busy"].style.height = height - (_temp.cache.containerHeight) +"px";
						
						
						
						
								
						var windowSize = SNDK.tools.getWindowSize ();							
						
					//		console.log (SNDK.tools.getElementInnerWidth (_elements["container"].parentNode))
					//		console.log (_temp.cache.containerWidth)
					//		console.log (_temp.cache.containerHeight)						
					//		console.log (windowSize)		
					//		console.log (width)
					
						var left = (windowSize[0] - width) / 2;				
						var top = (windowSize[1] - height) / 2;
						
						
						_temp.top = top;
						_temp.left = left;
						
					//		console.log (windowSize[0] - width)
					
						_elements["container"].style.left = left +"px";					
						_elements["container"].style.top = top +"px";				
					}				
					
					// ------------------------------------
					// open
					// ------------------------------------	
					function open ()
					{
						if (!_temp.isOpen)
						{
							// If no other windows are open, we need to setup the modal container.
							if (SNDK.SUI.modal.depth == 0)
							{			
								SNDK.SUI.modal.container.className =  "with-blocker";		
							}
							
							// Add modal depth.
							SNDK.SUI.modal.depth++;
							
							// Show blocker.
							_elements.blocker.className = "modal-blocker visible";
							_elements.blocker.style.display = "block";
							SNDK.animation.opacityFade (_elements.blocker, 0, 100, 150);
							
							// Show container.
							_elements.container.style.display = "block";			
							SNDK.animation.opacityFade (_elements.container, 0, 100, 200);		
							
							// Set Window dimensions.
							setDimensions ();	
					
							// Animate container.
							var anim = new SNDK.animation.animate ({ element: _elements["container"], 
												 duration: 350, 
												 fps: 60, 
												 top: {	begin: (_temp.top - 80) +"px", 
												 	end: _temp.top +"px", 
												 	ease: "outexpo"
												 	}
												});
							//anim.play ();	
							
							SNDK.SUI.refresh ();
							
							_temp.isOpen = true;		
						}
					}
					
					// ------------------------------------
					// close
					// ------------------------------------	
					function close ()
					{
						if (_temp.isOpen)
						{		
							// Hide blocker.
							SNDK.animation.opacityFade (_elements.container, 100, 0, 200);
										
							// Hide container.
							SNDK.animation.opacityFade (_elements.blocker, 100, 0, 200);
						
							// Animate container.		
							var anim = new SNDK.animation.animate ({ element: _elements.container, 
												 duration: 350, 
												 fps: 60, 
												 top: {	begin: _temp.top +"px", 
												 	end: (_temp.top - 80) +"px", 
												 	ease: "outexpo"
												 	}
												});
					//		anim.play ();
							
							// Unblock content underneath when done.
							var onDone = 	function ()
									{
										// Remove modal depth.
										SNDK.SUI.modal.depth--;
							
										// If no other windows are open, we need to remove the blocker.
										if (SNDK.SUI.modal.depth == 0)
										{			
											SNDK.SUI.modal.container.className =  "";		
										}		
										
										_elements.blocker.className = "";
										_elements.blocker.style.display = "none";			
									
										_temp.isOpen = false;
									};	
									
							setTimeout (onDone, 400);
						}
					}
					
					// ------------------------------------
					// dipose
					// ------------------------------------				
					function dispose ()
					{	
						close ();
						
						// When all is done, make sure to remove all traces of the modal window.
						var onDone =	function ()
								{		
									// Dispose all UI elements.																														
									for (index in _elements.ui)
									{
										try
										{
											_elements.ui[index].dispose ();
										}
										catch (e)
										{
											console.log (e);
											console.log ("CANNOT DISPOSE: ");
											console.log (_elements.ui[index]);
										}
									}								
					
									SNDK.SUI.modal.container.removeChild (_elements.blocker);
									SNDK.SUI.modal.container.removeChild (_elements.container);
								};
								
						// Unhook events.
						window.removeEvent (window, 'resize', refresh);					
										
						setTimeout (onDone, 400 + 10); 
					}	
					
					function toggleBusy ()
					{
						if (!_temp.isBusy)
						{
							_elements.busy.style.display = "block";
							SNDK.animation.opacityFade (_elements.busy, 0, 50, 150);	
							_temp.isBusy = true;
						}
						else
						{
							SNDK.animation.opacityFade (_elements.busy, 50, 0, 150);
							
							var onDone = 	function ()
									{
										_elements.busy.style.display = "none";
										_temp.isBusy = false;
									};
							
							setTimeout (onDone, 150);			
						}
					}
					
					
					// -----------------------------------------------------------------------------------------------------------------
					// Public functions
					// ----------------------------------------------------------------------------------------------------------------- 	
					// ------------------------------------
					// addUIElement
					// ------------------------------------			
					function functionAddUIElement (element)
					{		
						//_elements.ui[element.getAttribute ("tag")] = element;
						
						_elements.ui.canvas.addUIElement (element);
						
						//return element;
					
					}
					
					// ------------------------------------
					// addUIElementByXML
					// ------------------------------------	
					function functionAddUIElementsByXML (xml, appendTo)
					{
						var elements = SNDK.SUI.builder.construct ({XML: xml, appendTo: appendTo});
						
						for (i in elements)
						{		
							_elements["ui"][i] = elements[i];		
						}
					}
					
					// ------------------------------------
					// getUIElement
					// ------------------------------------	
					function functionGetUIElement (tag)
					{
					
						if (_elements.ui[tag] != null)
						{
							return _elements.ui[tag];
						}
						else
						{
							throw "No UI element with tag '"+ tag +"' was found.";
						}									
					}
					
					//	function showBusy ()
					//	{
					//		_elements["busy"].style.display = "block";
					//		SNDK.animation.opacityFade (_elements["busy"], 0, 100, 150);
					//	}
					
					//	function hideBusy ()
					//	{
					//		SNDK.animation.opacityFade (_elements["busy"], 100, 0, 150);
					//		
					//				setTimeout (	
					//		function () 
					//				{ 
					//					_elements["busy"].style.display = "none";	
					//				}, 150);
					//
					//	}
					
					
					
					
					// ------------------------------------
					// open
					// ------------------------------------		
					function functionOpen ()
					{
						open ();
						
					}
					
					// ------------------------------------
					// close
					// ------------------------------------		
					function functionClose ()
					{
						close ();
					}
					
					// ------------------------------------
					// dispose
					// ------------------------------------	
					function functionDispose ()
					{
						dispose ();
					}	
					
					// ------------------------------------
					// toggleBusy
					// ------------------------------------	
					function functionToggleBusy ()
					{
						toggleBusy ();
					}	
					
					
				}
			},
		
			/**
			* @constructor
			*/
			window : function (attributes)
			{
				var _initialized = false;
				var _attributes = attributes;	
				var _elements = new Array ();
					
				var _temp = 	{ 			  
						  controls: 0,
						  tabs: 0,
						  controlWidth: "533px",
						  controlWidthTabbed: "510px",
						  top: 0,
						  left: 0,
						  isBusy: false,
						  cache: Array (),
						  isOpen: false
						}
						
				setAttributes ();
				
				// Values
				var _valuehidden = true;
				
				// Methods		
				this.open = functionOpen;
				this.close = functionClose;	
				this.dispose = functionDispose;
				this.toggleBusy = functionToggleBusy;
					
				this.getUIElement = functionGetUIElement;
				this.addUIElement = functionAddUIElement;
				//	this.addUIElementsByXML = functionAddUIElementsByXML;
				
				this.setAttribute = functionSetAttribute;
				this.getAttribute = functionGetAttribute;
					
				// Construct
				construct ();
				
				// Init Control
				init ();
				// -----------------------------------------------------------------------------------------------------------------
				// Private functions
				// ----------------------------------------------------------------------------------------------------------------- 	
				// ------------------------------------
				// Init
				// ------------------------------------
				function init ()
				{
					updateCache ();
							
					refresh ();		
				}
				
				// ------------------------------------
				// Construct
				// ------------------------------------
				function construct ()
				{			
					SNDK.debugStopRefresh = true;
					
					// Blocker.
					_elements.blocker = SNDK.tools.newElement ("div", {appendTo: SNDK.SUI.modal.container});
					SNDK.tools.changeOpacityByObject (_elements.blocker, 0);	
				
					// Container.
					_elements.container = SNDK.tools.newElement ("div", {appendTo: SNDK.SUI.modal.container});
					_elements.container.className = "modal";
					_elements.container.style.display = "none";		
					SNDK.tools.changeOpacityByObject (_elements.container, 0);								
					
					// Bar.
					_elements.bar = SNDK.tools.newElement ("div", {appendTo: _elements.container});
					_elements.bar.className = "modal-bar";
					
					// Title.
					_elements.title = SNDK.tools.newElement ("h2", {appendTo: _elements.bar});
					
					// Content.
					_elements.content = SNDK.tools.newElement ("div", {appendTo: _elements.container});
					_elements.content.className = "modal-bg";		
				
					// Canvas.
					var canvas = new SNDK.SUI.canvas ({canScroll: false, appendTo: _elements.content,  width: "100%", height: "100%"});
								
					// UI.
					_elements.ui = {};
					
					
					
					
					// Process UI from xml document or url.
					if (_attributes.UIXML != null)
					{
						_elements.ui = SNDK.SUI.builder.construct ({XML: _attributes.UIXML, appendTo: canvas});	
					} 
					else if (_attributes.UIURL != null)
					{				
						_elements.ui = SNDK.SUI.builder.construct ({URL: _attributes.UIURL, appendTo: canvas});	
					}
					
					_elements.ui.canvas = canvas;
																			
					SNDK.SUI.init ();
							
					// Busy.
					_elements.busy = SNDK.tools.newElement ("div", {appendTo: _elements.content});
					_elements.busy.style.display = "none";
					_elements.busy.className = "modal-busy";
							
					// Hook events.		
					window.addEvent (window, 'resize', refresh);				
					
					SNDK.debugStopRefresh = false;
				}
				
				// ------------------------------------
				// Refresh
				// ------------------------------------				
				function refresh ()
				{
					_elements.title.innerHTML = _attributes.title;
					
					setDimensions ();
				}	
					
				// ------------------------------------
				// updateCache
				// ------------------------------------
				function updateCache ()
				{
					_temp.cache["containerBoxDimensions"] = SNDK.tools.getElementStyledBoxSize (_elements["container"]);
				
					_temp.cache["barBoxSize"] = SNDK.tools.getElementStyledBoxSize (_elements["bar"]);
					_temp.cache["barHeight"] = SNDK.tools.getElementStyledHeight (_elements["bar"]);
										
					_temp.cache.containerHeight = _temp.cache.containerBoxDimensions.vertical + _temp.cache.barHeight + _temp.cache.barBoxSize.vertical ;
					_temp.cache.containerWidth = _temp.cache.containerBoxDimensions.horizontal + _temp.cache.barBoxSize.horizontal;
					
					_temp.cache["barBoxDimensions"] = SNDK.tools.getElementStyledBoxSize (_elements["bar"]);		
				}	
				
				// ------------------------------------
				// Refresh
				// ------------------------------------	
				function setAttributes ()
				{
					// Width
					if (!_attributes.width) 
						_attributes.width = "content";	
									
					if (_attributes.width != "content")
					{
						if (_attributes.width.substring (_attributes.width.length - 1) == "%")
						{	
							_attributes.widthType = "percent";
							_attributes.width = _attributes.width.substring (0, _attributes.width.length - 1)			
						}
						else
						{	
							_attributes.widthType = "pixel";
							_attributes.width = _attributes.width.substring (0, _attributes.width.length - 2)
						}
					}
					else
					{
						_attributes.widthType = "content";
					}
					
					// Height
					if (!_attributes.height) 
						_attributes.height = "content";
								
					if (_attributes.height != "content")
					{
						if (_attributes.height.substring (_attributes.height.length - 1) == "%")
						{
							_attributes.heightType = "percent";
							_attributes.height = _attributes.height.substring (0, _attributes.height.length - 1)			
						}
						else
						{
							_attributes.heightType = "pixel";
							_attributes.height = _attributes.height.substring (0, _attributes.height.length - 2)
						}	
					}
					else
					{
						_attributes.heightType = "content";		
					}
					
					// Title
					if (!_attributes.title) 
						_attributes.title = "";					
				}
					
				// ------------------------------------
				// SetDimensions
				// ------------------------------------			
				function setDimensions ()
				{
					var width = 0;
					var height = 0;
				
					if (_attributes.widthType != "pixel")
					{																										
						width = ((SNDK.tools.getElementInnerWidth (_elements["container"].parentNode) * _attributes.width) / 100);
					}
					else
					{	
						width = _attributes.width ;
					}	
						
					if (_attributes.heightType != "pixel")
					{																										
						height = ((SNDK.tools.getElementInnerHeight (_elements["container"].parentNode) * _attributes.height) / 100);
					}
					else
					{	
						height = _attributes.height ;
					}			
				
					_elements["content"].style.width = width - (_temp.cache.containerWidth) +"px";
					_elements["content"].style.height = height - (_temp.cache.containerHeight) +"px";
					
					_elements["busy"].style.width = width - (_temp.cache.containerWidth) +"px";		
					_elements["busy"].style.height = height - (_temp.cache.containerHeight) +"px";
					
					
					
					
							
					var windowSize = SNDK.tools.getWindowSize ();							
					
				//		console.log (SNDK.tools.getElementInnerWidth (_elements["container"].parentNode))
				//		console.log (_temp.cache.containerWidth)
				//		console.log (_temp.cache.containerHeight)						
				//		console.log (windowSize)		
				//		console.log (width)
				
					var left = (windowSize[0] - width) / 2;				
					var top = (windowSize[1] - height) / 2;
					
					
					_temp.top = top;
					_temp.left = left;
					
				//		console.log (windowSize[0] - width)
				
					_elements["container"].style.left = left +"px";					
					_elements["container"].style.top = top +"px";				
				}				
				
				// ------------------------------------
				// open
				// ------------------------------------	
				function open ()
				{
					if (!_temp.isOpen)
					{
						// If no other windows are open, we need to setup the modal container.
						if (SNDK.SUI.modal.depth == 0)
						{			
							SNDK.SUI.modal.container.className =  "with-blocker";		
						}
						
						// Add modal depth.
						SNDK.SUI.modal.depth++;
						
						// Show blocker.
						_elements.blocker.className = "modal-blocker visible";
						_elements.blocker.style.display = "block";
						SNDK.animation.opacityFade (_elements.blocker, 0, 100, 150);
						
						// Show container.
						_elements.container.style.display = "block";			
						SNDK.animation.opacityFade (_elements.container, 0, 100, 200);		
						
						// Set Window dimensions.
						setDimensions ();	
				
						// Animate container.
						var anim = new SNDK.animation.animate ({ element: _elements["container"], 
											 duration: 350, 
											 fps: 60, 
											 top: {	begin: (_temp.top - 80) +"px", 
											 	end: _temp.top +"px", 
											 	ease: "outexpo"
											 	}
											});
						//anim.play ();	
						
						SNDK.SUI.refresh ();
						
						_temp.isOpen = true;		
					}
				}
				
				// ------------------------------------
				// close
				// ------------------------------------	
				function close ()
				{
					if (_temp.isOpen)
					{		
						// Hide blocker.
						SNDK.animation.opacityFade (_elements.container, 100, 0, 200);
									
						// Hide container.
						SNDK.animation.opacityFade (_elements.blocker, 100, 0, 200);
					
						// Animate container.		
						var anim = new SNDK.animation.animate ({ element: _elements.container, 
											 duration: 350, 
											 fps: 60, 
											 top: {	begin: _temp.top +"px", 
											 	end: (_temp.top - 80) +"px", 
											 	ease: "outexpo"
											 	}
											});
				//		anim.play ();
						
						// Unblock content underneath when done.
						var onDone = 	function ()
								{
									// Remove modal depth.
									SNDK.SUI.modal.depth--;
						
									// If no other windows are open, we need to remove the blocker.
									if (SNDK.SUI.modal.depth == 0)
									{			
										SNDK.SUI.modal.container.className =  "";		
									}		
									
									_elements.blocker.className = "";
									_elements.blocker.style.display = "none";			
								
									_temp.isOpen = false;
								};	
								
						setTimeout (onDone, 400);
					}
				}
				
				// ------------------------------------
				// dipose
				// ------------------------------------				
				function dispose ()
				{	
					close ();
					
					// When all is done, make sure to remove all traces of the modal window.
					var onDone =	function ()
							{		
								// Dispose all UI elements.																														
								for (index in _elements.ui)
								{
									try
									{
										_elements.ui[index].dispose ();
									}
									catch (e)
									{
										console.log (e);
										console.log ("CANNOT DISPOSE: ");
										console.log (_elements.ui[index]);
									}
								}								
				
								SNDK.SUI.modal.container.removeChild (_elements.blocker);
								SNDK.SUI.modal.container.removeChild (_elements.container);
							};
							
					// Unhook events.
					window.removeEvent (window, 'resize', refresh);					
									
					setTimeout (onDone, 400 + 10); 
				}	
				
				function toggleBusy ()
				{
					if (!_temp.isBusy)
					{
						_elements.busy.style.display = "block";
						SNDK.animation.opacityFade (_elements.busy, 0, 50, 150);	
						_temp.isBusy = true;
					}
					else
					{
						SNDK.animation.opacityFade (_elements.busy, 50, 0, 150);
						
						var onDone = 	function ()
								{
									_elements.busy.style.display = "none";
									_temp.isBusy = false;
								};
						
						setTimeout (onDone, 150);			
					}
				}
				
				
				
				// ------------------------------------
				// getAttribute
				// ------------------------------------						
				function getAttribute (attribute)
				{
					switch (attribute)
					{		
						case "title":
						{
							return _attributes[attribute];
						}
								
						default:
						{
							throw "No attribute with the name '"+ attribute +"' exist in this object";
						}
					}	
				}
				
				// ------------------------------------
				// setAttribute
				// ------------------------------------						
				function setAttribute (attribute, value)
				{
					switch (attribute)
					{
						case "title":
						{
							_attributes[attribute] = value;
							refresh ();
							break;
						}
								
						default:
						{
							throw "No attribute with the name '"+ attribute +"' exist in this object";
						}
					}	
				}
				// -----------------------------------------------------------------------------------------------------------------
				// Public functions
				// ----------------------------------------------------------------------------------------------------------------- 	
				// ------------------------------------
				// addUIElement
				// ------------------------------------			
				function functionAddUIElement (element)
				{		
					//_elements.ui[element.getAttribute ("tag")] = element;
					
					_elements.ui.canvas.addUIElement (element);
					
					//return element;
				
				}
				
				// ------------------------------------
				// addUIElementByXML
				// ------------------------------------	
				function functionAddUIElementsByXML (xml, appendTo)
				{
					var elements = SNDK.SUI.builder.construct ({XML: xml, appendTo: appendTo});
					
					for (i in elements)
					{		
						_elements["ui"][i] = elements[i];		
					}
				}
				
				// ------------------------------------
				// getUIElement
				// ------------------------------------	
				function functionGetUIElement (tag)
				{
				
					if (_elements.ui[tag] != null)
					{
						return _elements.ui[tag];
					}
					else
					{
						throw "No UI element with tag '"+ tag +"' was found.";
					}									
				}
				
				//	function showBusy ()
				//	{
				//		_elements["busy"].style.display = "block";
				//		SNDK.animation.opacityFade (_elements["busy"], 0, 100, 150);
				//	}
				
				//	function hideBusy ()
				//	{
				//		SNDK.animation.opacityFade (_elements["busy"], 100, 0, 150);
				//		
				//				setTimeout (	
				//		function () 
				//				{ 
				//					_elements["busy"].style.display = "none";	
				//				}, 150);
				//
				//	}
				
				
				function functionSetAttribute (attribute, value)
				{
					setAttribute (attribute, value);
				}
				
				function functionGetAttribute (attribute)
				{
					return getAttribute (attribute);
				}
				
				
				// ------------------------------------
				// open
				// ------------------------------------		
				function functionOpen ()
				{
					open ();
					
				}
				
				// ------------------------------------
				// close
				// ------------------------------------		
				function functionClose ()
				{
					close ();
				}
				
				// ------------------------------------
				// dispose
				// ------------------------------------	
				function functionDispose ()
				{
					dispose ();
				}	
				
				// ------------------------------------
				// toggleBusy
				// ------------------------------------	
				function functionToggleBusy ()
				{
					toggleBusy ();
				}	
			},
		
			depth: 0,		
			container: null
					,
		
			init: function (attributes)
			{
				SNDK.SUI.modal.container = SNDK.tools.newElement ("div", {id: "modals", appendTo: document.body}); ;
			}
		},
	
		// ---------------------------------------------------------------------------------------------------------------
		// CLASS: builder
		// ---------------------------------------------------------------------------------------------------------------
		builder :
		{
			construct : function (attributes)
			{
				
			
				var xmldoc;
			
				if (attributes.URL)
				{
					var xmlhttp = SNDK.tools.getXmlHttpObject ();
					var url;
					
					if (attributes.noCache || SNDK.debugMode)
					{
						url = attributes.URL + "?"+ Math.random ();
					}
					else
					{
						url = attributes.URL;
					}
						
					xmlhttp.open ("GET", url, false);
					
					xmlhttp.send (null);		
					xmldoc = xmlhttp.responseXML;
				}
				else if (attributes.XML)
				{
					xmldoc = SNDK.tools.getXmlDocFromString (attributes.XML)
				
			//		if (window.DOMParser)
			//  		{
			  			//var parser = new DOMParser ();
			  			//xmldoc = parser.parseFromString (attributes.xml, "text/xml");
			  		//}
					//else // Internet Explorer
			  		//{
			//  			xmldoc = new ActiveXObject ("Microsoft.XMLDOM");
			  			//xmldoc.async = "false";
			  			//xmldoc.loadXML (attributes.xml);
			  		//} 		
				}
				else
				{
					throw "Neither URL or xml was given.";
				}
				
				
			
				
				var root = xmldoc.getElementsByTagName ('sui').item(0);	
				
				if (root == null)
				{
					throw "No SUI definition was found in the xml.";
				}	
						
				var elements = new Array ();
			
				var bla = new Array ();
							
				var parseAttributes =	function (attributes)
							{
								var result = {};
								for (var i = 0; i < attributes.length; i++)
								{		
									var value = attributes[i].value;
									var attribute = attributes[i].name;
															
									if (value.toLowerCase () == "true")
									{
										value = true;
									}
									else if (value.toLowerCase () == "false")
									{
										value = false;
									}
									
									for (index in bla)
									{
										try
										{
											value = value.replace ("%"+ index +"%", bla[index])								
										}
										catch (e)
										{}
									}						
								
									result[attribute] = value; 
								}
								
								if (!result.tag)
								{
									result.tag = SNDK.tools.newGuid ();
								}
								
								return result;
							};
					
				var suiattributes = parseAttributes (root.attributes);					
				
				if (attributes.appendTo)
				{
					suiattributes.appendTo = attributes.appendTo;
				}
				
				for (index in suiattributes)
				{
					bla[index] =  suiattributes[index];
				}
				
				if (!suiattributes.appendTo)
				{
					suiattributes.appendTo = document.documentElement;
					//suiattributes.appendTo = document.body;
				}
								
				var parser =	function (Nodes, Parent, Expect)
						{			
							for (var index = 0, len = Nodes.length; index < len; index++)
							{
			
								var node = Nodes.item (index);
								if (node == null)
								{
									continue;
								}
								
								if (node.attributes != null)
								{
									var attributes = parseAttributes (node.attributes);
									if (!attributes.appendTo)
									{
										attributes.appendTo = Parent;
									}						
								}
								else
								{
									continue;
								}
			
												
								switch (node.tagName)
								{
									case "canvas":
									{						
										elements[attributes.tag] = new SNDK.SUI.canvas (attributes);
										parser (node.childNodes, elements[attributes.tag]);
										continue;
										break;
									}
			
									case "container":
									{
										elements[attributes.tag] = new SNDK.SUI.container (attributes);
										Parent.addUIElement (elements[attributes.tag]);
										parser (node.childNodes, elements[attributes.tag]);
										continue;
										break;						
									}
									
									case "layoutbox":
									{						
										elements[attributes.tag] = new SNDK.SUI.layoutbox (attributes);	
										Parent.addUIElement (elements[attributes.tag]);
										
										if (node.childNodes.length > 0)
										{
											var panels = new Array ();
			
											for (var index2 = 0; index2 < node.childNodes.length; index2++)
											{
												var child = node.childNodes.item (index2);
			
												if (child.tagName == "panel")
												{
													var childattributes = parseAttributes (child.attributes);
													elements[attributes.tag].addPanel (childattributes);
													parser (child.childNodes, elements[attributes.tag].getPanel (childattributes.tag))									
												}						
											}																
										}
										continue;
										break;
									}
															
									case "tabview":
									{						
										elements[attributes.tag] = new SNDK.SUI.tabview (attributes);													
										Parent.addUIElement (elements[attributes.tag]);
										
										if (node.childNodes.length > 0)
										{
											var tabs = new Array ();
			
											for (var index2 = 0; index2 < node.childNodes.length; index2++)
											{
												var child = node.childNodes.item (index2);
			
												if (child.tagName == "tab")
												{
													var childattributes = parseAttributes (child.attributes);
													elements[attributes.tag].addTab (childattributes);
													parser (child.childNodes, elements[attributes.tag].getTab (childattributes.tag))									
												}						
											}																
										}							
										continue;
										break;
									}
									
									case "button":
									{
										elements[attributes.tag] = new SNDK.SUI.button (attributes);
										Parent.addUIElement (elements[attributes.tag]);							
										continue;
										break;
									}
									
									case "textbox":
									{
										elements[attributes.tag] = new SNDK.SUI.textbox (attributes);
										Parent.addUIElement (elements[attributes.tag]);			
											continue;			
										break;
									}						
			
									case "label":
									{
										elements[attributes.tag] = new SNDK.SUI.label (attributes);
										Parent.addUIElement (elements[attributes.tag]);			
										continue;
										break;
									}						
									
									case "listview":
									{
										if (node.childNodes.length > 0)
										{							
											var columns = new Array ();
											var items = new Array ();
			
											for (var index2 = 0; index2 < node.childNodes.length; index2++)
											{
												var child = node.childNodes.item (index2);
												if (child.tagName == "item")
												{
													items[items.length] = parseAttributes (child.attributes);
												}										
												
												if (child.tagName == "column")
												{
													columns[columns.length] = parseAttributes (child.attributes);
												}						
											}																				
											
											attributes.columns = columns;
											attributes.items = items;
										}							
			
										elements[attributes.tag] = new SNDK.SUI.listview (attributes);
										Parent.addUIElement (elements[attributes.tag]);									
											continue;					
										break;
									}																	
			
									case "checkbox":
									{
										elements[attributes.tag] = new SNDK.SUI.checkbox (attributes);
										Parent.addUIElement (elements[attributes.tag]);									
			continue;
										break;
									}																	
			
									case "dropbox":
									{
										if (node.childNodes.length > 0)
										{							
											var items = new Array ();
											for (var item = 0, len = node.childNodes.length; item < len; item++)
											{
											}
			
											for (var index2 = 0; index2 < node.childNodes.length; index2++)
											{
												var child = node.childNodes.item (index2);
												if (child.tagName == "item")
												{
													items[items.length] = parseAttributes (child.attributes);
												}						
											}																				
											
											attributes.items = items;
										}						
			
										elements[attributes.tag] = new SNDK.SUI.dropbox (attributes);
										Parent.addUIElement (elements[attributes.tag]);									
											continue;						
										break;
									}																	
			
									case "upload":
									{
										elements[attributes.tag] = new SNDK.SUI.upload (attributes);
										Parent.addUIElement (elements[attributes.tag]);
										continue;
										break;
									}																	
			
			//						case "textarea":
			//						{							
			//							if (node.childNodes.length > 0)
			//							{
			//								attributes.provider = node.childNodes[1].tagName;
			//								attributes.providerConfig = parseAttributes (node.childNodes[1].attributes);
			//							}
			//	
			//							elements[attributes.tag] = new SNDK.SUI.textarea (attributes);
			//							break;
			//						}	
									
									case "iconview":
									{
										if (node.childNodes.length > 0)
										{							
											var items = new Array ();
			
											for (var index2 = 0; index2 < node.childNodes.length; index2++)
											{
												var child = node.childNodes.item (index2);
												if (child.tagName == "item")
												{
													items[items.length] = parseAttributes (child.attributes);
												}																			
											}																				
											
											attributes.items = items;
										}						
									
										elements[attributes.tag] = new SNDK.SUI.iconview (attributes);
										Parent.addUIElement (elements[attributes.tag]);
										continue;
										break;
									}	
									
									case "htmlview":
									{													
										elements[attributes.tag] = new SNDK.SUI.htmlview (attributes);
										Parent.addUIElement (elements[attributes.tag]);
										continue;
										break;
									}	
									
									case "image":
									{													
										elements[attributes.tag] = new SNDK.SUI.image (attributes);
										Parent.addUIElement (elements[attributes.tag]);
										continue;
										break;
									}							
															
									
									case "text":
									{						
										elements[attributes.tag] = new SNDK.SUI.text (attributes);
										Parent.addUIElement (elements[attributes.tag]);		
										continue;	
										break;
									}											
			
									case "textarea":
									{
										//console.log ("textarea")
										//if (node.childNodes.length > 0)
										//{
											//for (var index2 = 1; index2 < node.childNodes.length; index2++)
											//{
										//		var child = node.firstChild;
												//console.log (child)
												//if ((child.tagName.toLowerCase () == "codemirror") || (child.tagName.toLowerCase () == "tinymce"))
												//{
										//			attributes.provider = child.tagName;
													
										//			console.log (child)
													//attributes.provider = "codemirror";
										//			attributes.providerConfig = parseAttributes (child.attributes);
												//}																			
											//}		
										//}
										
										if (node.childNodes.length > 0)
										{							
											var items = new Array ();
			
											for (var index2 = 0; index2 < node.childNodes.length; index2++)
											{
												var child = node.childNodes.item (index2);
												if (child.tagName == "codemirror")
												{
													attributes.provider = "codemirror";									
													attributes.providerConfig = parseAttributes (child.attributes);
												}
												else if (child.tagName == "tinymce")
												{
													attributes.provider = "tinymce";
													attributes.providerConfig = parseAttributes (child.attributes);	
												}																																					
											}																				
											
											attributes.items = items;
										}							
										
			
										elements[attributes.tag] = new SNDK.SUI.textarea (attributes);
										Parent.addUIElement (elements[attributes.tag]);
										continue;
										break;
									}											
								}
							}
						};	
						
				if (attributes.parent)
				{
				
				
					parser (root.childNodes, attributes.parent);
				}
				else
				{
					parser (root.childNodes, suiattributes.appendTo);
				}
				
					
			
				
				return elements;
			}
			
			
		},
	
		// ---------------------------------------------------------------------------------------------------------------
		// CLASS: helpers
		// ---------------------------------------------------------------------------------------------------------------
		helpers :
		{
			
			
			// ------------------------------------
			// getContainer
			// ------------------------------------	
			getContainer : function (options)
			{
				var element;
			
				if (options.appendTo != null)
				{
					if (typeof (options.appendTo) == "string")
					{
						element = SNDK.tools.newElement ("div", {appendTo: document.getElementById (options.appendTo)});
					}
					else
					{
						element = SNDK.tools.newElement ("div", {appendTo: options.appendTo});
					}
				}
				else if (options.element != null)
				{
					if (typeof (options.element) == "string")
					{
						element = document.getElementById (options.element);
						options.name = options.element;
					}
					else
					{
						element = options.element;
						options.name = container.id;
					}
				}
				else
				{
					throw "Nowhere to park control.";
				}
				
				element.setAttribute ("id", options.id);
			
				// TODO: remove this.	
				element.className = options.stylesheet;	
				
				return element;
			}
		},
	
		/**
		* @constructor
		*/
		canvas : function (attributes)
		{
			var _elements = new Array ();
			var _attributes = attributes;				
			
			var _temp = 	{ 
								initialized: false,
					  			uiElements: new Array ()		  		
							};
			
			// Set attributes
			setAttributes ();	
			
			// Private functions
			this._attributes = _attributes;
			this._elements = _elements;
			this._temp = _temp;	
			this._init = init;
			
			this.type = "CANVAS";
			// Functions		
			this.refresh = functionRefresh;			
			this.dispose = functionDispose;
			this.addUIElement = functionAddUIElement;
			this.getUIElement = functionGetUIElement;
			this.setAttribute = functionSetAttribute;
			this.getAttribute = functionGetAttribute;	
			
			// Construct
			construct ();
										
			// Initialize
			SNDK.SUI.addInit (this);
			// ------------------------------------
			// Private functions
			// ------------------------------------
			// ------------------------------------
			// init
			// ------------------------------------	
			function init ()
			{
			}
			
			// ------------------------------------
			// construct
			// ------------------------------------	
			function construct ()
			{
				// Container
				_elements["container"] = SNDK.tools.newElement ("div", {});
				_elements["container"].setAttribute ("id", _attributes.id);
				
				if (_attributes.canScroll)
				{
					_elements["container"].style.overflow = "auto";		
				}		
				else
				{
					_elements["container"].style.overflow = "hidden";		
				}
																			
				// Hook Events
				window.addEvent (window, 'SUIREFRESH', refresh);	
			}	
				
			// ------------------------------------
			// refresh
			// ------------------------------------		
			function refresh ()
			{	
				// Only refresh if control has been initalized.	
				if (_temp.initialized)
				{
					_elements["container"].className = _attributes.stylesheet;
				}
				
				setDimensions ();
			}
			
			// ------------------------------------
			// refresh
			// ------------------------------------			
			function dispose ()
			{
				window.removeEvent (window, 'SUIREFRESH', refresh);				
			}
						
			// ------------------------------------
			// setDefaultAttributes
			// ------------------------------------					
			function setAttributes ()
			{
				// Id
				_attributes.id = SNDK.tools.newGuid ();
			
				// Stylesheet
				if (!_attributes.stylesheet) _attributes.stylesheet = "SUICanvas";	
				
				// Managed
				if (!_attributes.managed)
					_attributes.managed = false;				
			
				// Width
				if (!_attributes.width) 
					_attributes.width = "100%";				
				
				if (_attributes.width == "content")
				{
					_attributes.width = 0;
					_attributes.widthType = "content";
				}			
				else if (_attributes.width.substring (_attributes.width.length - 1) == "%")
				{
					_attributes.widthType = "percent";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 1)			
				}
				else
				{
					_attributes.widthType = "pixel";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 2)
				}		
				
				// Height
				if (!_attributes.height) 
					_attributes.height = "100%";
				
				if (_attributes.height == "content")
				{
					_attributes.height = 0;
					_attributes.heightType = "content";
				}
				else if (_attributes.height.substring (_attributes.height.length - 1) == "%")
				{
					_attributes.heightType = "percent";
					_attributes.height = _attributes.height.substring (0, _attributes.height.length - 1)			
				}
				else
				{
					_attributes.heightType = "pixel";
					_attributes.height = _attributes.height.substring (0, _attributes.height.length - 2)
				}
								
				if (!_attributes.canScroll) 
					_attributes.canScroll = false;			
			}		
								
			// ------------------------------------
			// setDimensions
			// ------------------------------------
			function setDimensions ()
			{		
				// Only set dimensions if control has been initalized.	
				if (_temp.initialized)
				{	
					var parent = _elements["container"].parentNode;			
					var width = 0;
					var height = 0;
					
					// Refresh all child elements.
					for (i in _temp.uiElements)
					{		
						_temp.uiElements[i].refresh ();
					}			
												
					// Find width.
					switch (_attributes.widthType.toLowerCase ())
					{
						// Width is content.
						case "content":
						{
							width = 0;			
							for (i in _temp.uiElements)
							{																		
								if ((_temp.uiElements[i]._attributes.widthType == "pixel") || (_temp.uiElements[i]._attributes.widthType == "content"))
								{	
									if (width < _temp.uiElements[i]._elements["container"].offsetWidth)
									{
										width = _temp.uiElements[i]._elements["container"].offsetWidth;
									}							
								}
							}																				
							break;
						}
						
						// Width is in pixels.
						case "pixel":
						{
							width = _attributes.width;
							break;
						}
						
						// Width is percent.
						case "percent":
						{
						//console.log ("CANVAS parent innerwidth: "+ SNDK.tools.getElementInnerWidth (parent) )
						
							width = (SNDK.tools.getElementInnerWidth (parent) * _attributes.width) / 100;
							//console.log ("canvas: "+ SNDK.tools.getElementInnerWidth (parent))	
							break;
						}
					}
			
					// Find height.
					switch (_attributes.heightType.toLowerCase ())
					{
						// Height is content.
						case "content":
						{
							height = 0;						
							for (i in _temp.uiElements)
							{							
								if ((_temp.uiElements[i]._attributes.heightType == "pixel") || (_temp.uiElements[i]._attributes.heightType == "content"))
								{						
									height += _temp.uiElements[i]._elements["container"].offsetHeight;
								}
							}									
							break;
						}
					
						// Height is in pixels.
						case "pixel":
						{
							height = _attributes.height;
							break;
						}
						
						// Height is in percent.
						case "percent":
						{
						//console.log ("CANVAS parent innerheight: "+ SNDK.tools.getElementInnerHeight (parent) )
						
							height = (SNDK.tools.getElementInnerHeight (parent) * _attributes.height) / 100;
							break;
						}
					}
							
					// Set width & height.
					_elements["container"].style.width = width +"px";
					_elements["container"].style.height = height +"px";
			
					// If canvas can scroll, we need to make room for the scrollbar.		
					if ((_attributes.canScroll) && (_attributes.heightType.toLowerCase () != "content"))
					{
						var contentheight = 0;			
						for (i in _temp.uiElements)
						{		
							if (_temp.uiElements[i]._attributes.heightType == "pixel" || _temp.uiElements[i]._attributes.heightType == "content")
							{									
								contentheight += parseInt (_temp.uiElements[i]._attributes.height);
							}
						}						
					
						if (contentheight > height)
						{
							width = width - window.scrollbarWidth;
						}			
					}						
					
					// All child elements that use percentage needs to have their width and height updated accordingly.
					for (i in _temp.uiElements)
					{
						var refresh = false;			
						if (_temp.uiElements[i]._attributes.widthType == "percent")
						{						
							_temp.uiElements[i]._attributes.managedWidth = (width * _temp.uiElements[i]._attributes.width) / 100;
							refresh = true;
						}
						
						if (_temp.uiElements[i]._attributes.heightType == "percent")
						{
							_temp.uiElements[i]._attributes.managedHeight = (height * _temp.uiElements[i]._attributes.height) / 100;
							refresh = true;
						}
						
						if (refresh)
						{
							_temp.uiElements[i].refresh ();
						}
					}
				}
			}	
			
			// ------------------------------------
			// addUIElement
			// ------------------------------------							
			function addUIElement (element)
			{
			 	_temp.uiElements[_temp.uiElements.length] = element;
			 		 	
			 	element.setAttribute ("managed", true);
			 	element.setAttribute ("appendTo", _elements["container"]);
			}
			
			// ------------------------------------
			// getUIElement
			// ------------------------------------							
			function getUIElement (tag)
			{
				for (i in _temp.uiElements)
				{
					if (_temp.uiElements[i].getAttribute ("tag") == tag)
					{
						return _temp.uiElements[i];	
					}
				}
				
				throw ("No element with tag '"+ tag +"' was found in this canvas.");
			}
			// ------------------------------------
			// Public functions
			// ------------------------------------
			// ------------------------------------
			// refresh
			// ------------------------------------				
			function functionRefresh ()
			{
				refresh ();
			}			
			
			// ------------------------------------
			// dispose
			// ------------------------------------				
			function functionDispose ()
			{
				dispose ();
			}			
							
			// ------------------------------------
			// addUIElement
			// ------------------------------------							
			function functionAddUIElement (element)
			{
				addUIElement (element);
			}
			
			// ------------------------------------
			// getUIElement
			// ------------------------------------							
			function functionGetUIElement (tag)
			{
				return getUIElement (tag)
			}
										
			// ------------------------------------
			// getAttribute
			// ------------------------------------								
			function functionGetAttribute (attribute)
			{
				switch (attribute)
				{
					case "id":
					{
						return _attributes[attribute];
					}
					
					case "tag":
					{
						return _attributes[attribute];
					}
					
					case "stylesheet":
					{
						return _attributes[attribute];
					}
					
					case "width":
					{
						switch (_attributes.widthType.toLowerCase ())
						{
							case "content":
							{
								return "content";
							}
							
							case "pixel":
							{
								return _attributes.width + "px";						
							}
							
							case "percent":
							{
								return _attributes.width + "%";						
							}
						}			
					}
					
					case "height":
					{
						switch (_attributes.heightType.toLowerCase ())
						{
							case "content":
							{
								return "content";
							}
							
							case "pixel":
							{
								return _attributes.height + "px";						
							}
							
							case "percent":
							{
								return _attributes.height + "%";						
							}
						}						
					}
					
					case "canScroll":
					{
						return _attributes[attribute];			
					}			
										
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}	
				
			// ------------------------------------
			// setAttribute
			// ------------------------------------						
			function functionSetAttribute (attribute, value)
			{
				switch (attribute)
				{
					case "id":
					{
						throw "Attribute with name ID is ready only.";
						break;
					}
					
					case "tag":
					{
						_attributes[attribute] = value;
						break;
					}
					
					case "stylesheet":
					{
						_attributes[attribute] = value;
						break;				
					}
					
					case "width":
					{
						if (value.toLowerCase () == "content")
						{
							_attributes.widthType = "content";
							_attributes.width = "content";
						}			
						else if (value.substring (value.length, 3) == "%")
						{
							_attributes.widthType = "percent";
							_attributes.width = value.substring (0, value.length - 1)			
						}
						else
						{
							_attributes.widthType = "pixel";
							_attributes.width = value.substring (0, value.length - 2)
						}	
						
						refresh ();
						
						break;			
					}
			
					case "height":
					{
						if (value.toLowerCase () == "content")
						{
							_attributes.heightType = "content";
							_attributes.height = "content";
						}
						else if (value.substring (value.length, 3) == "%")
						{
							_attributes.heightType = "percent";
							_attributes.height = value.substring (0, value.length - 1)			
						}
						else
						{
							_attributes.heightType = "pixel";
							_attributes.height = value.substring (0, value.length - 2)
						}	
						
						refresh ();
						
						break;			
					}
					
					case "canScroll":
					{
						_attributes[attribute] = value;					
						break;
					}			
										
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}					
		},
	
		/**
		* @constructor
		*/
		container : function (attributes)
		{
			var _elements = new Array ();
			var _attributes = attributes;				
			var _temp = 	{ initialized: false,
					  uiElements: new Array (),
					  cache: new Array (),
					  calculatedWidth: 0,
					  calculatedHeight: 0	 
					};
			
			_attributes.id = SNDK.tools.newGuid ();
			
			setAttributes ();	
			
			// Private functions
			this._attributes = _attributes;
			this._elements = _elements;
			this._temp = _temp;	
			this._init = init;
			
			// Functions				
			this.refresh = functionRefresh;
			this.dispose = functionDispose;
			this.addTitleBarUIElement = functionAddTitleBarUIElement;
			//this.getTitleBarUIElement = funcitonGetTitleBarUIElement;
			this.addUIElement = functionAddUIElement;
			this.setAttribute = functionSetAttribute;
			this.getAttribute = functionGetAttribute;
			
			// Construct
			construct ();
										
			// Initialize
			SNDK.SUI.addInit (this);
			// ------------------------------------
			// Private functions
			// ------------------------------------
			// ------------------------------------
			// init
			// ------------------------------------	
			function init ()
			{
				updateCache ();
			}
			
			// ------------------------------------
			// construct
			// ------------------------------------	
			function construct ()
			{
				// Container
				_elements["container"] = SNDK.tools.newElement ("div", {});
				_elements["container"].setAttribute ("id", _attributes.id);		
				_elements["container"].className = _attributes.stylesheet;		
															
				// Top
				_elements["top"] = SNDK.tools.newElement ("div", {appendTo: _elements["container"]});
			
				// TopLeft
				_elements["topleft"] = SNDK.tools.newElement ("div", {className: "TopLeft", appendTo: _elements["top"]});
					
				// TopCenter
				_elements["topcenter"] = SNDK.tools.newElement ("div", {className: "TopCenter", appendTo: _elements["top"]});
				_elements["topcenter"].style.overflow = "hidden";
				
				// Titlebar
				_elements["titlebar"] = SNDK.tools.newElement ("div", {className: "TitleBar", appendTo: _elements["topcenter"]});
									
				// TopRight
				_elements["topright"] = SNDK.tools.newElement ("div", {className: "TopRight", appendTo: _elements["top"]});
													
				// Content
				_elements["content"] = SNDK.tools.newElement ("div", {appendTo: _elements["container"]});
				_elements["content"].style.clear = "both";			
					
				// ContentLeft
				_elements["contentleft"] = SNDK.tools.newElement ("div", {className: "ContentLeft", appendTo: _elements["content"]});
							
				// ContentCenter
				_elements["contentcenter"] = SNDK.tools.newElement ("div", {className: "ContentCenter", appendTo: _elements["content"]});		
				if (_attributes.canScroll)
				{
					_elements["contentcenter"].style.overflow = "auto";		
				}		
				else
				{
					_elements["contentcenter"].style.overflow = "hidden";		
				}		
																														
				// ContentRight
				_elements["contentright"] = SNDK.tools.newElement ("div", {className: "ContentRight", appendTo: _elements["content"]});
				
				// Bottom	
				_elements["bottom"] = SNDK.tools.newElement ("div", {appendTo: _elements["container"]});
				_elements["bottom"].style.clear = "both";		
								
				// BottomLeft
				_elements["bottomleft"] = SNDK.tools.newElement ("div", {className: "BottomLeft", appendTo: _elements["bottom"]});	
			
				// BottomCenter
				_elements["bottomcenter"] = SNDK.tools.newElement ("div", {className: "BottomCenter", appendTo: _elements["bottom"]});
					
				// BottomRight
				_elements["bottomright"] = SNDK.tools.newElement ("div", {className: "BottomRight", appendTo: _elements["bottom"]});
			
				// Icon	
				_elements["icon"] = SNDK.tools.newElement ("div", {className: "Icon", appendTo: _elements["topcenter"]});
								
				// Title	
				_elements["title"] = SNDK.tools.newElement ("div", {className: "Title", appendTo: _elements["topcenter"]});	
				SNDK.tools.textSelectionDisable (_elements["title"]);													
				
				// Hook Events
				window.addEvent (window, 'SUIREFRESH', refresh);							
			}	
			
			// ------------------------------------
			// refresh
			// ------------------------------------		
			function refresh ()
			{	
				// Only refresh if control has been initalized.	
				if (_temp.initialized)
				{		
				
					_elements["container"].className = _attributes.stylesheet;
					if (_attributes.icon != "")
					{
						_elements["icon"].className = "Icon "+ _attributes.icon;
						_elements["icon"].style.display = "block";
					}
					else			
					{
						_elements["icon"].style.display = "none";
					}
					
					_elements["title"].innerHTML = _attributes.title;		
				}
								
				setDimensions ();
			}			
			
			// ------------------------------------
			// refresh
			// ------------------------------------			
			function dispose ()
			{
				window.removeEvent (window, 'SUIREFRESH', refresh);				
			}
			
			function addTitleBarUIElement (type, attributes)
			{
				if (!attributes)
					attributes = new Array ();
					
				attributes.appendTo = _elements["titlebar"];
			
				switch (type.toUpperCase ())
				{
					case "BUTTON":
					{
						var count = _temp.uiElements.length;
				
			 			_temp.uiElements[count] = new SNDK.SUI.button (attributes);
			 				 			
			 			return _temp.uiElements[count];
			 		 		 			
						break;
					}						
				}
			}
				
			function getTitleBarUIElement (tag)
			{
			
			}
			
			// ------------------------------------
			// updateCache
			// ------------------------------------		
			function updateCache ()
			{
				if (!_temp.cacheUpdated)
				{
					_temp.cache["containerPadding"] = SNDK.tools.getElementStyledPadding (_elements["container"]);
					_temp.cache["containerWidth"] = SNDK.tools.getElementStyledWidth (_elements["topleft"]) + SNDK.tools.getElementStyledWidth (_elements["topright"]);
					_temp.cache["containerHeight"] = SNDK.tools.getElementStyledHeight (_elements["topleft"]) + SNDK.tools.getElementStyledHeight (_elements["bottomleft"]);
				}
				
				_temp.cacheUpdated = true;	
			}			
						
			// ------------------------------------
			// setAttributes
			// ------------------------------------					
			function setAttributes ()
			{
				// Stylesheet
				if (!_attributes.stylesheet) 
					_attributes.stylesheet = "SUIContainer";	
					
				// Managed
				if (!_attributes.managed) 
					_attributes.managed = false;	
						
				// Width
				if (!_attributes.width) 
					_attributes.width = "100%";				
					
					
				if (_attributes.width == "content")
				{			
					_attributes.widthType = "content";			
				}
				else if (_attributes.width.substring (_attributes.width.length - 1) == "%")
				{
					_attributes.widthType = "percent";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 1)			
				}
				else
				{
					_attributes.widthType = "pixel";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 2)
				}				
						
				// Height
				if (!_attributes.height) 
					_attributes.height = "100%";				
					
				if (_attributes.height == "content")
				{			
					_attributes.heightType = "content";
				}
				else if (_attributes.height.substring (_attributes.height.length - 1) == "%")
				{
					_attributes.heightType = "percent";
					_attributes.height = _attributes.height.substring (0, _attributes.height.length - 1)			
				}
				else
				{
					_attributes.heightType = "pixel";
					_attributes.height = _attributes.height.substring (0, _attributes.height.length - 2)
				}				
				
				// canScroll
				if (!_attributes.canScroll) 
					_attributes.canScroll = false;
						
				// Icon
				if (!_attributes.icon) 
					_attributes.icon = "";
						
				// Title
				if (!_attributes.title) 
					_attributes.title = "";															
			
			}		
						
			// ------------------------------------	
			// setDimensions
			// ------------------------------------			
			function setDimensions ()
			{
				// Only set dimensions if control has been initalized.	
				if (_temp.initialized)
				{	
					var width = {};
					var height = {};
					var combinedheightofchildren = 0;
					
					// Refresh all child elements.
					for (index in _temp.uiElements)
					{							
						_temp.uiElements[index].refresh ();
					}			
			
					// Find width.
					switch (_attributes.widthType.toLowerCase ())
					{
						case "content":
						{
							width.container = 0;				
							for (i in _temp.uiElements)
							{								
								if ((_temp.uiElements[i]._attributes.widthType == "pixel") || (_temp.uiElements[i]._attributes.widthType == "content"))
								{											
									if (width.container < _temp.uiElements[i]._elements["container"].offsetWidth)					
									{
										width.container = _temp.uiElements[i]._elements["container"].offsetWidth + _temp.cache.containerWidth;
									}							
								}
							}													
							break;
						}
						
						case "pixel":
						{
							width.container = _attributes.width - _temp.cache.containerPadding["horizontal"];
							break;
						}
						
						case "percent":
						{
							if (_attributes.managed)
							{
								width.container = _attributes.managedWidth - _temp.cache.containerPadding["horizontal"];
							}
							else
							{
								swidth.container = ((SNDK.tools.getElementInnerWidth (_elements["container"].parentNode) * _attributes.width) / 100) - _temp.cache.containerPadding["horizontal"];
							}
							break;
						}
					}
			
					// Find height.
					switch (_attributes.heightType.toLowerCase ())
					{
						case "content":
						{
							height.container = 0;
						
							for (i in _temp.uiElements)
							{		
								if ((_temp.uiElements[i]._attributes.heightType == "pixel") || (_temp.uiElements[i]._attributes.heightType == "content") )
								{									
									height.container += _temp.uiElements[i]._elements["container"].offsetHeight + _temp.cache.containerHeight; 
								}
							}									
							break;
						}
					
						case "pixel":
						{
							height.container = _attributes.height - _temp.cache.containerPadding["vertical"];
							break;
						}
						
						case "percent":
						{
							if (_attributes.managed)
							{
								height.container = _attributes.managedHeight - _temp.cache.containerPadding["vertical"];				
							}
							else
							{
								height.container = ((SNDK.tools.getElementInnerHeight (_elements["container"].parentNode) * _attributes.height) / 100) - _temp.cache.containerPadding["vertical"];
							}
							break;
						}
					}
			
					// Set width & height.
					width.topCenter = width.container - _temp.cache.containerWidth;
					width.contentCenter = width.container - _temp.cache.containerWidth;
					width.bottomCenter = width.container - _temp.cache.containerWidth; 
					width.child = width.container - _temp.cache.containerWidth;
			
					height.contentLeft = height.container - _temp.cache.containerHeight;
					height.contentCenter = height.container - _temp.cache.containerHeight;
					height.contentRight = height.container - _temp.cache.containerHeight; 
					height.child = height.container - _temp.cache.containerHeight;
					
					_elements["container"].style.width = width.container + "px";
					_elements["topcenter"].style.width = width.topCenter + "px";
					_elements["contentcenter"].style.width = width.contentCenter + "px";
					_elements["bottomcenter"].style.width = width.bottomCenter +"px";							
					
					_elements["container"].style.height = height.container +"px";
					_elements["contentleft"].style.height = height.contentLeft +"px";
					_elements["contentcenter"].style.height = height.contentCenter +"px";			
					_elements["contentright"].style.height = height.contentRight +"px";			
								
					// If canvas can scroll, we need to make room for the scrollbar.		
					if ((_attributes.canScroll) && (_attributes.heightType.toLowerCase () != "content"))
					{
						var contentheight = 0;
						for (index in _temp.uiElements)
						{		
							if (_temp.uiElements[index]._attributes.heightType == "pixel")
							{									
								contentheight += parseInt (_temp.uiElements[index]._attributes.height);
							}
						}						
					
						if (contentheight > height.child)
						{
							width.child = width.child - window.scrollbarWidth;
						}			
					}	
							
					// All child elements that use percentage needs to have their width and height updated accordingly.
					for (index in _temp.uiElements)
					{
						var refresh = false;			
						if (_temp.uiElements[index]._attributes.widthType == "percent")
						{
							_temp.uiElements[index]._attributes.managedWidth = (width.child * _temp.uiElements[index]._attributes.width) / 100;
							refresh = true;
						}
						
						if (_temp.uiElements[index]._attributes.heightType == "percent")
						{
							_temp.uiElements[index]._attributes.managedHeight = (height.child * _temp.uiElements[index]._attributes.height) / 100;
							refresh = true;
						}
						
						if (refresh)
						{
							_temp.uiElements[index].refresh ();
						}
					}			
				}
			}			
			// ------------------------------------
			// Public functions
			// ------------------------------------		
			// ------------------------------------
			// refresh
			// ------------------------------------				
			function functionRefresh ()
			{
				refresh ();
			}		
			
			// ------------------------------------
			// dispose
			// ------------------------------------				
			function functionDispose ()
			{
				dispose ();
			}				
			
			function functionAddTitleBarUIElement (type, attributes)
			{
				return addTitleBarUIElement (type, attributes)
			}
			
			function functionGetTitleBarUIElement (tag)
			{
				return getTitleBarUIElement (tag);
			}
			
			// ------------------------------------
			// content
			// ------------------------------------				
			function functionContent ()
			{
				return _elements["contentcenter"];
			}
			
			// ------------------------------------
			// addUIElement
			// ------------------------------------							
			function functionAddUIElement (element)
			{
				var count = _temp.uiElements.length;
				
			 	_temp.uiElements[count] = element;
			 		 	
			 	element.setAttribute ("managed", true);
			 	element.setAttribute ("appendTo", _elements["contentcenter"]);
			}		
			
			// ------------------------------------
			// getAttribute
			// ------------------------------------						
			function functionGetAttribute (attribute)
			{
				switch (attribute)
				{
					case "id":
					{
						return _attributes[attribute];
					}
					
					case "tag":
					{
						return _attributes[attribute];
					}
					
					case "stylesheet":
					{
						return _attributes[attribute];
					}
					
					case "width":
					{
						if (_attributes.widthType == "percent")
						{
							return _attributes.width + "%";
						}
			
						if (_attributes.widthType == "pixel")
						{
							return _attributes.width + "px";
						}
					}
					
					case "height":
					{
						if (_attributes.heightType == "percent")
						{
							return _attributes.height + "%";
						}
			
						if (_attributes.heightType == "pixel")
						{
							return _attributes.height + "px";
						}
					}
					
					case "appendTo":
					{
						return _attributes[attribute];			
					}			
					
					case "managed":
					{
						return _attributes[attribute];			
					}
					
					case "canScroll":
					{
						return _attributes[attribute];
					}
			
					case "title":
					{
						return _attributes[attribute];			
					}
					
					case "icon":
					{
						return _attributes[attribute];			
					}
							
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}
			
			// ------------------------------------
			// setAttribute
			// ------------------------------------						
			function functionSetAttribute (attribute, value)
			{
				switch (attribute)
				{
					case "id":
					{
						throw "Attribute with name ID is ready only.";
						break;
					}
					
					case "tag":
					{
						_attributes[attribute] = value;
						break;
					}
					
					case "stylesheet":
					{
						_attributes[attribute] = value;
						break;				
					}
					
					case "width":
					{
						if (value.substring (value.width.length, 3) == "%")
						{
							_attributes.widthType = "percent";
							_attributes.width = value.width.substring (0, value.width.length - 1)			
						}
						else
						{
							_attributes.widthType = "pixel";
							_attributes.width = value.width.substring (0, value.width.length - 2)
						}	
						break;			
					}
					
					case "appendTo":
					{
						_attributes[attribute] = value;	
						_attributes.appendTo.appendChild (_elements["container"]);			
						break;
					}			
					
					case "managed":
					{
						_attributes[attribute] = value;
			
						if (value)
						{
							window.removeEvent (window, 'SUIREFRESH', refresh);		
						}
						else
						{
							window.addEvent (window, 'SUIREFRESH', refresh);
						}
			
						break;
					}
					
					case "canScroll":
					{
						_attributes[attribute] = value;
					}
			
					case "title":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
			
					case "icon":
					{
						_attributes[attribute] = value;
						break;
					}
							
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}										
		},
	
		/**
		* @constructor
		*/
		listview : function (attributes)
		{
			var _elements = new Array ();
			var _attributes = attributes;				
			var _temp =	{ 	initialized: false,
						  	id: SNDK.tools.newGuid (),
						  	selectedRow: -1,			  
							isDirty: true,
							cache: new Array (),
							bla: false,
							doubleClickTicks: 0,
							doubleClickRow: ""
						};
			
			_attributes.id = SNDK.tools.newGuid ();
			
			setAttributes ();	
			
			// Private functions
			this._attributes = _attributes;
			this._elements = _elements;
			this._temp = _temp;		
			this._init = init;
			
			this.type = "LISTVIEW";
			
			// Functions
			this.addItem = functionAddItem;
			this.addItems = functionAddItems;
			this.removeItem = functionRemoveItem;	
			this.clear = functionRemoveAllItems;
			this.count = functionCount;
			
			this.setItem = functionSetItem;
			this.getItem = functionGetItem;	
			this.setItems = functionSetItems;
			this.getItems = functionGetItems;
			this.getItemRow = functionGetItemRow;
			
			this.refresh = functionRefresh;
			this.dispose = functionDispose;
			
			this.setAttribute = functionSetAttribute;
			this.getAttribute = functionGetAttribute;
			
			
			
			//	this.removeAllItems = functionRemoveAllItems;
			this.moveItemUp = functionMoveItemUp;
			this.moveItemDown = functionMoveItemDown;
			this.canItemMove = functionCanItemMove;
			//	this.canItemMove = functionCanItemMove;
													
			// Construct
			construct ();
					
			// Initialize
			SNDK.SUI.addInit (this);
			// ------------------------------------
			// Private functions
			// ------------------------------------
			// ------------------------------------
			// init
			// ------------------------------------
			function init ()
			{	
				updateCache ();
			}
			
			// ------------------------------------
			// construct
			// ------------------------------------
			function construct ()
			{		
				// Container
				_elements["container"] = SNDK.tools.newElement ("div", {});
				_elements["container"].setAttribute ("id", _attributes.id);
				_elements["container"].className = _attributes.stylesheet;
															
				// Top
				_elements["top"] = SNDK.tools.newElement ("div", {appendTo: _elements["container"]});
			
				// TopLeft
				_elements["topleft"] = SNDK.tools.newElement ("div", {className: "TopLeft", appendTo: _elements["top"]});
					
				// TopCenter
				_elements["topcenter"] = SNDK.tools.newElement ("div", {className: "TopCenter", appendTo: _elements["top"]});
				_elements["topcenter"].style.overflow = "hidden";
								
				// TopRight
				_elements["topright"] = SNDK.tools.newElement ("div", {className: "TopRight", appendTo: _elements["top"]});
								
				// Headers
				_elements["header"] = SNDK.tools.newElement ("div", {appendTo: _elements["topcenter"]});
				_elements["header"].style.overflow = "hidden";
							
				// ColumnHeaders	
				_elements["columnheaders"] = new Array ();			
				for (index in _attributes.columns)
				{
					if (_attributes.columns[index].visible)
					{
						_elements["columnheaders"][index] = SNDK.tools.newElement ("div", {className: "Header", appendTo: _elements["header"]});
						_elements["columnheaders"][index].innerHTML = _attributes.columns[index].label;
						_elements["columnheaders"][index].style.overflow = "hidden";
						_elements["columnheaders"][index].style.whiteSpace = "nowrap";
					}
				}
			
				// Content
				_elements["content"] = SNDK.tools.newElement ("div", {appendTo: _elements["container"]});
				_elements["content"].style.clear = "both";			
					
				// ContentLeft
				_elements["contentleft"] = SNDK.tools.newElement ("div", {className: "ContentLeft", appendTo: _elements["content"]});
							
				// ContentCenter
				_elements["contentcenter"] = SNDK.tools.newElement ("div", {className: "ContentCenter", appendTo: _elements["content"]});		
				_elements["contentcenter"].style.overflow = "auto";
																												
				// ContentRight
				_elements["contentright"] = SNDK.tools.newElement ("div", {className: "ContentRight", appendTo: _elements["content"]});
				
				// Bottom	
				_elements["bottom"] = SNDK.tools.newElement ("div", {appendTo: _elements["container"]});
				_elements["bottom"].style.clear = "both";		
								
				// BottomLeft
				_elements["bottomleft"] = SNDK.tools.newElement ("div", {className: "BottomLeft", appendTo: _elements["bottom"]});	
			
				// BottomCenter
				_elements["bottomcenter"] = SNDK.tools.newElement ("div", {className: "BottomCenter", appendTo: _elements["bottom"]});
					
				// BottomRight
				_elements["bottomright"] = SNDK.tools.newElement ("div", {className: "BottomRight", appendTo: _elements["bottom"]});
					
				// Hook Events
				_elements["contentcenter"].onfocus = eventOnFocus;
				_elements["contentcenter"].onblur = eventOnBlur;		
				
				window.addEvent (window, 'SUIREFRESH', refresh);					
			}	
						
			// ------------------------------------
			// setAttributes
			// ------------------------------------					
			function setAttributes ()
			{
				// Stylesheet
				if (!_attributes.stylesheet) 
				_attributes.stylesheet = "SUIListview";	
				
				// Managed
				if (!_attributes.managed) 
					_attributes.managed = false;	
				
				// Width
				if (!_attributes.width) 
					_attributes.width = "100%";				
					
				if (_attributes.width.substring (_attributes.width.length - 1) == "%")
				{
					_attributes.widthType = "percent";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 1)			
				}
				else
				{
					_attributes.widthType = "pixel";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 2)
				}				
				
				// Height
				if (!_attributes.height) 
					_attributes.height = "100%";				
					
				if (_attributes.height.substring (_attributes.height.length - 1) == "%")
				{
					_attributes.heightType = "percent";
					_attributes.height = _attributes.height.substring (0, _attributes.height.length - 1)			
				}
				else
				{
					_attributes.heightType = "pixel";
					_attributes.height = _attributes.height.substring (0, _attributes.height.length - 2)
				}			
					
				// Disabled
				if (!_attributes.disabled) 
					_attributes.disabled = false;		
			
				// Items
				if (!_attributes.items) 
				{
					_attributes.items = new Array ();
				}
				else
				{
					_attributes.items = derefItems (_attributes.items);
				}
				
				// treeview
				if (!_attributes.treeview) 
					_attributes.treeview = false;		
					
				if (!_attributes.treeviewRootValue) 
					_attributes.treeviewRootValue = "";					
				
				// treeviewLinkColumns
				if (_attributes.treeviewLinkColumns)
				{				
					_temp.treeviewParentColumn = _attributes.treeviewLinkColumns.split (":")[0]; 
					_temp.treeviewChildColumn = _attributes.treeviewLinkColumns.split (":")[1];
					
					if (!isNaN (_temp.treeviewParentColumn))
					{
						_temp.treeviewParentColumn = _attributes.columns[parseInt (_temp.treeviewParentColumn)].tag;
					} 
					
					if (!isNaN (_temp.treeviewChildColumn))
					{
						_temp.treeviewChildColumn = _attributes.columns[parseInt (_temp.treeviewChildColumn)].tag;
					} 						
				}	
				else if (_attributes.treeview)
				{
					throw "When control is in treeview mode, treeviewLinkColumns needs to be specified.";
				}
			
				// unique
				if (!_attributes.unique) 
				{
					_attributes.unique = false;
				}
				else
				{
					_attributes.uniqueColumn = _attributes.unique;
					_attributes.unique = true;			
				}
				
				// selectedRow
				if (!_attributes.selectedRow) 
					_attributes.selectedRow = -1;
					
				// onClick
				if (!_attributes.onClick)
					_attributes.onClick = null;			
					
				// onDoubleClick
				if (!_attributes.onDoubleClick)
					_attributes.onDoubleClick = null;			
					
				// onFocus
				if (!_attributes.onFocus)
					_attributes.onFocus = null;	
					
				// onBlur
				if (!_attributes.onBlur)
					_attributes.onBlur = null;	
					
				// onChange
				if (!_attributes.onChange)
					_attributes.onChange = null;
					
				// columns
				if (!_attributes.columns)
					_attributes.columns = new Array ();
					
				for (index in _attributes.columns)
				{
					if (!_attributes.columns[index].width) 
						_attributes.columns[index].width = "*";	
			
					if (_attributes.columns[index].width != "*")
					{							
						if (_attributes.columns[index].width.substring (_attributes.columns[index].width.length - 1) == "%")
						{
							_attributes.columns[index].widthType = "percent";
							_attributes.columns[index].width = parseInt (_attributes.columns[index].width.substring (0, _attributes.columns[index].width.length - 1));	
						}
						else
						{
							_attributes.columns[index].widthType = "pixel";
							_attributes.columns[index].width = parseInt (_attributes.columns[index].width.substring (0, _attributes.columns[index].width.length - 2));
						}									
					}
					else
					{
						_attributes.columns[index].widthType = "dynamic";
					}
				}						
			}		
									
			// ------------------------------------
			// setDimensions
			// ------------------------------------
			function setDimensions ()
			{		
				if (_temp.initialized)	
				{
					var width = {};
					var height = {};
					var combinedheightofchildren = 0;
			
					if (!_attributes.managed && _attributes.widthType != "pixel")
					{					
						width.container = ((SNDK.tools.getElementInnerWidth (_elements["container"].parentNode) * _attributes.width) / 100) - _temp.cache.containerPadding["horizontal"];
					}
					else
					{			
						if (_attributes.managed && _attributes.widthType == "percent")
						{
			
							width.container = _attributes.managedWidth - _temp.cache.containerPadding["horizontal"];
						}
						else
						{
							width.container = _attributes.width - _temp.cache.containerPadding["horizontal"];
						}			
					}	
			
			
					if (!_attributes.managed && _attributes.heightType != "pixel")
					{					
						height.container = ((SNDK.tools.getElementInnerHeight (_elements["container"].parentNode) * _attributes.height) / 100) - _temp.cache.containerPadding["vertical"];
					}
					else
					{			
						if (_attributes.managed && _attributes.heightType == "percent")
						{
							height.container = _attributes.managedHeight - _temp.cache.containerPadding["vertical"];				
						}
						else
						{
							height.container = _attributes.height - _temp.cache.containerPadding["vertical"];
						}			
					}	
				
					width.topCenter = width.container - _temp.cache.containerWidth;
					width.contentCenter = width.container - _temp.cache.containerWidth;
					width.bottomCenter = width.container - _temp.cache.containerWidth;
					
					height.contentLeft = height.container - _temp.cache.containerHeight;
					height.contentCenter = height.container - _temp.cache.containerHeight;
					height.contentRight = height.container - _temp.cache.containerHeight;
			
					
					_elements["container"].style.width = width.container + "px";
					_elements["topcenter"].style.width = width.topCenter + "px";
					_elements["contentcenter"].style.width = width.contentCenter +"px";
					_elements["bottomcenter"].style.width = width.bottomCenter +"px";
								
					_elements["container"].style.height = height.container + "px";
					_elements["contentleft"].style.height = height.contentLeft + "px";
					_elements["contentcenter"].style.height = height.contentCenter +"px";
					_elements["contentright"].style.height = height.contentRight +"px";
			
			
					var totalheightofrows = 0;
			
			
					for (index in _attributes.items)
					{
						totalheightofrows += 25;
					}
					
					if (totalheightofrows > height.contentCenter)
					{
						width.topCenter = width.topCenter - window.scrollbarWidth;
					}				
			
					var totalwidth = 0;														
					var dynamics = new Array ();
						
					for (index in _attributes.columns)
					{
						if (_attributes.columns[index].visible)
						{
							var bla = 0;
							var column = _attributes.columns[index];
										
							switch (column.widthType)
							{
								case "percent":
								{					
									_attributes.columns[index].calculatedWidth = Math.floor ((width.topCenter * column.width) / 100);
									_elements["columnheaders"][index].style.width = _attributes.columns[index].calculatedWidth - 10 +"px";						
									totalwidth += _attributes.columns[index].calculatedWidth;	
									
									break;
								}
							
								case "pixel":
								{
									_attributes.columns[index].calculatedWidth = column.width;
									_elements["columnheaders"][index].style.width = _attributes.columns[index].calculatedWidth - 10 +"px";						
									totalwidth += _attributes.columns[index].calculatedWidth;	
									
									break;
								}				
							
								case "dynamic":
								{
									dynamics[dynamics.length] = index;
			
									break;
								}											
							}
							
							for (index in dynamics)
							{
								_attributes.columns[dynamics[index]].calculatedWidth = Math.floor ((width.topCenter - totalwidth) / (dynamics.length));
								_elements["columnheaders"][dynamics[index]].style.width = _attributes.columns[dynamics[index]].calculatedWidth - 10 +"px";
							}							
						}
					}						
				}
			}	
				
			// ------------------------------------
			// refresh
			// ------------------------------------		
			function refresh ()
			{	
				// Only refresh if control has been initalized.	
				if (_temp.initialized)
				{
					// If disabled, change to disabled stylesheet.
					if (_attributes.disabled)
					{
						_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"Disabled";
						_elements["contentcenter"].removeAttribute("tabIndex");
					} 
					else
					{			
						// Set tabindex, it might have been removed if the control was disabled.
						_elements["contentcenter"].setAttribute("tabIndex", 0);
						
						// See if control is in focus or blur, change stylesheet accoridingly.
						if (_attributes.focus)
						{
							_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"Focus";
							setFocus ();
						}
						else
						{
							_elements["container"].className = _attributes.stylesheet;
						}						
					}				
				}
					
				setDimensions ();
			
				if (_temp.initialized)
				{
					if (_temp.isDirty)
					{			
						var draw = 	function () 
									{
										// Remove all current rows.
										_elements["contentcenter"].innerHTML = " ";				
										_elements["rows"] = new Array ();
						
										// Redraw all rows.								
										_elements["contentcenter"].style.display ="none";
										drawRows ({treeviewMatchValue: null});		
										_elements["contentcenter"].style.display ="block";
										
										// Redraw selected row.
										setSelectedRow (_temp.selectedRow);
						
										_temp.isDirty = false;						 
									};
					
						setTimeout (draw, 0);				
					}			
				}
			}
										
			// ------------------------------------
			// dispose
			// ------------------------------------			
			function dispose ()
			{
				window.removeEvent (window, 'SUIREFRESH', refresh);				
			}		
			
			// ------------------------------------
			// updateCache
			// ------------------------------------		
			function updateCache ()
			{
				if (!_temp.cacheUpdated)
				{
					_temp.cache["containerPadding"] = SNDK.tools.getElementStyledPadding (_elements["container"]);
					_temp.cache["containerWidth"] = SNDK.tools.getElementStyledWidth (_elements["topleft"]) + SNDK.tools.getElementStyledWidth (_elements["topright"]);
					_temp.cache["containerHeight"] = SNDK.tools.getElementStyledHeight (_elements["topleft"]) + SNDK.tools.getElementStyledHeight (_elements["bottomleft"]);
				}
				
				_temp.cacheUpdated = true;	
			}		
				
			// ------------------------------------
			// drawRows
			// ------------------------------------			
			function drawRows (options)
			{
				if (!_attributes.treeview)
				{
					// Draw rows for normal view.			
					var length = _attributes.items.length;
					for (var index = 0; index < length; index++)			
					{
						drawRow ({itemIndex: index, indentDepth: indentdepth});
					}					
				}
				else
				{
					// Draw rows for treeview.		
					var indentdepth = -1;			
					if (options)
					{
						if (options.indentDepth != null)
						{
							indentdepth = options.indentDepth;
						}
					}
					
					indentdepth++;
			
					var length = _attributes.items.length;
					for (var index = 0; index < length; index++)			
					//for (index in _attributes.items)			
					{					
						var test =_attributes.items[index][_temp.treeviewChildColumn];
						
						if (test == _attributes.treeviewRootValue)
						{
							test = null;
						}
										
						if (test == options.treeviewMatchValue)
						{
							drawRow ({itemIndex: index, indentDepth: indentdepth});
							
							drawRows ({treeviewMatchValue: _attributes.items[index][_temp.treeviewParentColumn], indentDepth: indentdepth});
						}				
					}
				}	
			}	
				
			// ------------------------------------
			// drawRow
			// ------------------------------------	
			function drawRow (attributes)
			{
				var rowcount = _elements["rows"].length;
				var container = document.createDocumentFragment ()		
				var row = new Array ();
					
				row[0] = SNDK.tools.newElement ("div", {className: "ItemRow", id: _attributes.id +"_"+ rowcount, appendTo: container});
				row[0].style.overflow = "hidden";
				row[0].style.width = "100%";
				row[0].onmousedown = eventOnRowClick;
				row["itemIndex"] = attributes.itemIndex;
				row["indentDepth"] = attributes.indentDepth;
			
				SNDK.tools.textSelectionDisable (row[0]);
			
				for (columncount in _attributes.columns)
				{				
					if (_attributes.columns[columncount].visible)
					{	
						var content = "";			
						var column = SNDK.tools.newElement ("div", {className: "ItemColumn", id: _attributes.id +"_"+ rowcount +"_"+ columncount, appendTo: row[0]});				
			
						if (_attributes.treeview)
						{
							if (columncount == 1)
							{
								content += "<span style='padding-left: "+ (attributes.indentDepth * 20) +"px;'> </span>";
							}
						}
						
						if (_attributes.columns[columncount].tag != null)
						{
							content += _attributes.items[attributes.itemIndex][_attributes.columns[columncount].tag];
						}
						else
						{
							content += _attributes.items[attributes.itemIndex][columncount];					
						}
														
						column.innerHTML = content;							
						column.style.width = _attributes.columns[columncount].calculatedWidth - 10 +"px";
						column.style.overflow = "hidden";
						column.style.whiteSpace = "nowrap";
					}
				}
				
				_elements["rows"][rowcount] = row;		
				_elements["contentcenter"].appendChild (container);
			}			
			
			// ------------------------------------
			// setFocus
			// ------------------------------------				
			function setFocus ()
			{
				setTimeout ( function () { _attributes.focus = true;  _elements["contentcenter"].focus (); }, 20);	
			}		
				
			// ------------------------------------
			// setSelectedRow (row)
			// ------------------------------------		
			function setSelectedRow (row)
			{		
				if (_temp.selectedRow != -1)
				{
					_elements["rows"][_temp.selectedRow][0].className = "ItemRow";
				}
			
				_temp.selectedRow = parseInt (row);
			
				if (_temp.selectedRow != -1)
				{
					_elements["rows"][_temp.selectedRow][0].className = "ItemRow ItemRowSelected";			
				}	
			}	
				
			// ------------------------------------
			// removeItem ([itemindex])
			// ------------------------------------					
			function removeItem (itemIndex)
			{
				var row = _temp.selectedRow;
					
				if (itemIndex != null)
				{
					// Find row via itemindex.
					for (i in _elements["rows"])
					{				
						if (_elements["rows"][i].itemIndex == itemIndex)
						{					
							row = i;
							break;
						}			
					}			
					
					// If the itemindex was not found, then there is no need to continue.
					return;
				}		
					
				removeRow (row);		
			}
			
			// ------------------------------------
			// removeAllItems
			// ------------------------------------					
			function removeAllItems ()
			{
				_attributes.items = new Array ();
				refresh ();
				eventOnChange ();
			}
																																		
			// ------------------------------------
			// removeRow ([row])
			// ------------------------------------					
			function removeRow (row)
			{				
				// Check if row is valid.		
				if (row != -1 && row <= _elements.rows.length)
				{
					// Remove item from item list.
					var currentindentdepth = _elements["rows"][row].indentDepth;
					_attributes.items.splice (_elements["rows"][row].itemIndex, 1);
					_temp.isDirty = true;
								
					// If row was the selected one, we need to deal with that.
					if (row == _temp.selectedRow)
					{							
						_temp.selectedRow = -1;
					
						var currentindentdepth = _elements["rows"][row].indentDepth;
			
						if (!_attributes.treeview)
						{										
							// Top row removed with rows below.
							if (row == 0 && _elements.rows.length > 1)
							{
								_temp.selectedRow = 0;
							}
							// Bottom row removed with no rows below.
							else if (row == (_elements.rows.length - 1))
							{
								_temp.selectedRow = (row - 1);
							}
							// Middle row removed with rows below.				
							else if (row < _elements.rows.length)
							{
								_temp.selectedRow = row;
							}
						}
						else
						{					
							
							if ((row < _elements.rows.length - 1) && _elements.rows[row+1].indentDepth == currentindentdepth)
							{
								_temp.selectedRow = row;
							}
							// Bottom row removed with no rows below.
							else if (row == (_elements.rows.length - 1))
							{						
								_temp.selectedRow = (row - 1);					
							}
							// Bottom row removed with rows below that are not at the same depth.
							else if ((row < _elements.rows.length -1) && (_elements.rows[row+1].indentDepth != currentindentdepth))
							{
								_temp.selectedRow = (row - 1);
							}					
						}			
					}			
				
					refresh ();		
					eventOnChange ();				
				}
				else
				{
					throw "Cannot remove row "+ row +" of "+ (_elements.rows.length - 1) +"";	
				}
			}	
			
			// ------------------------------------
			// moveItem
			// ------------------------------------						
			function moveItem (row1, row2)
			{
				var index1 = _elements.rows[row1].itemIndex;
				var index2 = _elements.rows[row2].itemIndex;
			
				var temp1 = _attributes.items[index1];
				var temp2 = _attributes.items[index2];
				
				_attributes.items[index1] = temp2;
				_attributes.items[index2] = temp1;
			
				_temp.isDirty = true;
				refresh ();
				eventOnChange ();
			}
			
			
			// ------------------------------------
			// getNumberOfRowChildren (row)
			// ------------------------------------		
			function getNumberOfRowChildren (row)
			{
				var result = 0;
			
				if (_attributes.treeview)
				{
					for (i = (row + 1); i < _elements.rows.length; i++)
					{
						if (_elements.rows[i].indentDepth == _elements.rows[row].indentDepth || _elements.rows[i].indentDepth < _elements.rows[row].indentDepth)
						{				
							break;
						}
						result++;			
					}
				}
				
				return result;	
			}
			
			// ------------------------------------
			// addItem (item)
			// ------------------------------------				
			function addItem (item)
			{
				var result = 0;
			
				if (_attributes.unique)
				{					
					for (i in _attributes.items)
					{
						if (_attributes.items[i][_attributes.uniqueColumn] == item[_attributes.uniqueColumn])
						{					
							result = i;
							return i;
						}
					}				
				}
			
				result = _attributes.items.length;
				_attributes.items[result] = derefItem (item);			
					
				_temp.isDirty = true;
				
				return result
			}	
				
			// ------------------------------------
			// derefItem
			// ------------------------------------
			function derefItem (item)
			{
				var result = new Array ();
									
				for (key in item)
				{				
					var columnname = null;
					var condense;
					var value;
								
					for (index in _attributes.columns)			
					{
						var column = _attributes.columns[index];
			//				if (c.condense != null)
			//				{	
			//					if (c.tag == key)
			//					{
			//						column = c.tag;
			//						condense = c.condense;
			//						break;
			//					}
			//				}
						if (column.tag == key)
						{									
							columnname = column.tag;
							break;
						}				
					}
			
					if (columnname == null)
					{			
						continue;
					}
								
			//			if ((typeof(item[key]) == "object") && (column.visible == true))
			//			{
			//				value = "";
			//				for (index2 in item[key])
			//				{									
			//					value += item[key][index2]["value"] +", ";
			//				}				
			//					
			//				value = SNDK.string.trimEnd (value, ", ");							
			//			}
			//			else				
			//			{
						value = item[key];				
			//			}										
																
					result[columnname] = value;
				}
								
				return result;		
			}	
			
			// ------------------------------------
			// derefItems
			// ------------------------------------	
			function derefItems (array)
			{
				var result = new Array ();
				
				for (i in array)
				{			
					result[result.length] = derefItem (array[i]);
				}
					
				return result;				
			}		
					
			// ------------------------------------
			// getAttribute
			// ------------------------------------						
			function functionGetAttribute (attribute)
			{
				switch (attribute)
				{
					case "id":
					{
						return _attributes[attribute];
					}
					
					case "tag":
					{
						return _attributes[attribute];
					}
					
					case "stylesheet":
					{
						return _attributes[attribute];
					}
					
					case "width":
					{
						if (_attributes.widthType == "percent")
						{
							return _attributes.width + "%";
						}
			
						if (_attributes.widthType == "pixel")
						{
							return _attributes.width + "px";
						}
					}
					
					case "height":
					{
						if (_attributes.heightType == "percent")
						{
							return _attributes.height + "%";
						}
			
						if (_attributes.heightType == "pixel")
						{
							return _attributes.height + "px";
						}
					}
					
					case "appendTo":
					{
						return _attributes[attribute];			
					}			
					
					case "managed":
					{
						return _attributes[attribute];			
					}
					
					case "disabled":
					{
						return _attributes[attribute];			
					}			
			
					case "onClick":
					{
						return _attributes[attribute];			
					}			
			
					case "onDoubleClick":
					{
						return _attributes[attribute];			
					}			
			
					case "onFocus":
					{
						return _attributes[attribute];			
					}			
			
					case "onBlur":
					{
						return _attributes[attribute];			
					}			
			
					case "onChange":
					{
						return _attributes[attribute];			
					}			
					
					case "selectedRow":
					{		
						return _temp.selectedRow;
					}					
			
					case "treeview":
					{		
						return _attributes.treeview;				
					}					
										
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}
			
			// ------------------------------------
			// setAttribute
			// ------------------------------------						
			function functionSetAttribute (attribute, value)
			{
				switch (attribute)
				{
					case "id":
					{
						throw "Attribute with name ID is ready only.";
						break;
					}
					
					case "tag":
					{
						_attributes[attribute] = value;
						break;
					}
					
					case "stylesheet":
					{
						_attributes[attribute] = value;
						break;				
					}
					
					case "width":
					{
						if (value.substring (value.width.length, 3) == "%")
						{
							_attributes.widthType = "percent";
							_attributes.width = value.width.substring (0, value.width.length - 1)			
						}
						else
						{
							_attributes.widthType = "pixel";
							_attributes.width = value.width.substring (0, value.width.length - 2)
						}	
						break;			
					}
					
					case "appendTo":
					{
						_attributes[attribute] = value;	
						_attributes.appendTo.appendChild (_elements["container"]);			
						break;
					}			
					
					case "managed":
					{
						_attributes[attribute] = value;
			
						if (value)
						{
							window.removeEvent (window, 'SUIREFRESH', refresh);		
						}
						else
						{
							window.addEvent (window, 'SUIREFRESH', refresh);
						}
			
						break;
					}
					
					case "disabled":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}	
			
					case "onClick":
					{
						_attributes[attribute] = value;
						break;
					}			
			
					case "onDoubleClick":
					{
						_attributes[attribute] = value;
						break;
					}			
			
					case "onFocus":
					{
						_attributes[attribute] = value;
						break;
					}			
			
					case "onBlur":
					{
						_attributes[attribute] = value;
						break;
					}			
					
					case "onChange":
					{
						_attributes[attribute] = value;
						break;
					}			
					
					case "selectedRow":
					{
						setSelectedRow (value);
						break;
					}		
			
					case "treeview":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}		
													
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}						
			// ------------------------------------
			// Public functions
			// ------------------------------------						
			// ------------------------------------
			// refresh
			// ------------------------------------				
			function functionRefresh ()
			{
				refresh ();
			}			
			
			// ------------------------------------
			// dispose
			// ------------------------------------				
			function functionDispose ()
			{
				dispose ();
			}	
								
			// ------------------------------------
			// addItem
			// ------------------------------------						
			function functionAddItem (item)
			{					
				var result = addItem (item);
					
				if (_temp.initialized)
				{
					refresh ();
					eventOnChange ();		
				}
				
				return result;
			}	
			
			// ------------------------------------
			// getItem
			// ------------------------------------						
			function functionGetItem (row)
			{
				if (_temp.initialized)
				{
					if (row != null)
					{					
						return _attributes.items [_elements.rows[row].itemIndex];
					}
					else
					{
						try
						{
											
							return _attributes.items [_elements.rows[_temp.selectedRow].itemIndex];
						}
						catch (error)
						{			
							return null
						}
					}	
				}
			}	
			
			// ------------------------------------
			// setItem
			// ------------------------------------						
			function functionSetItem (item, row)
			{
				if (_temp.initialized)
				{					
					if (row != null)
					{	
						
			//				for (index in _elements.rows)
			//				{
			//					if (_element.rows[row].itemIndex == row)
			//					{
						_attributes.items [row] = derefItem (item);
			//					}				
			//				}
							
			//				_attributes.items [_element.rows[row].itemIndex] = derefItem (item);							
						
						_temp.isDirty = true;
						refresh ();								
					}
					else
					{		
						_attributes.items [_elements.rows[_temp.selectedRow].itemIndex] = derefItem(item);
						_temp.isDirty = true;
						refresh ();
					}		
					
					eventOnChange ();
				}
			}	
				
			// ------------------------------------
			// removeItem
			// ------------------------------------						
			function functionRemoveItem (itemIndex)
			{	
				removeItem (itemIndex);	
			}	
				
			// ------------------------------------
			// addItems
			// ------------------------------------								
			function functionAddItems (items)
			{
				for (i in items)
				{
					addItem (items[i]);
				}
			
				if (_temp.initialized)
				{
					refresh ();
					eventOnChange ();
				}		
			}	
			
			// ------------------------------------
			// getItems
			// ------------------------------------						
			function functionGetItems ()
			{
				return _attributes.items;
			}	
			
			// ------------------------------------
			// setItems
			// ------------------------------------						
			function functionSetItems (items)
			{
				if (items != null)
				{
					_attributes.items = derefItems (items);		
					
					if (_temp.initialized)
					{
			//			_attributes.items = items;
						_temp.isDirty = true;
						refresh ();			
						eventOnChange ();
					}
				}
			}	
			
			// ------------------------------------
			// removeAllItems
			// ------------------------------------						
			function functionRemoveAllItems ()
			{
				removeAllItems ();	
			}	
				
			function functionCount ()
			{
				return _attributes.items.length;
			
			}
				
				
			// ------------------------------------
			// removeRow
			// ------------------------------------						
			function functionRemoveRow (row)
			{
				if (row != null)
				{	
					removeRow (row);
				}
				else		
				{
					removeRow (_temp.selectedRow);
				}
			}		
			
			// ------------------------------------
			// canItemMove
			// ------------------------------------						
			function functionCanItemMove (row)
			{
				var result = {up: false, down: false};
			
				if (!row)
				{
					row = _temp.selectedRow;
				}
			
				// Figure out if item can move up.
				if (!_attributes.treeview)
				{
					if (row > 0)
					{
						result.up = true;
					}
				}
				else
				{
					if (row > 0)
					{	
						if (_elements.rows[row - 1].indentDepth == _elements.rows[row].indentDepth)
						{	
							result.up = true;
						}
						else
						{
							for (i = (row - 1); i >= 0; i--)
							{
								if (_elements.rows[i].indentDepth == _elements.rows[row].indentDepth)
								{
									result.up = true;
									break;				
								}
								else if (_elements.rows[i].indentDepth < _elements.rows[row].indentDepth)
								{
									break;
								}					
							}				
						}								
					}
				}
				
				// Figure out if item can move down.
				if (!_attributes.treeview)
				{
					if (row < _elements.rows.length - 1)
					{
						result.down = true;
					}
				}
				else
				{
					if (row < (_elements.rows.length - 1))
					{
						if (_elements.rows[row + 1].indentDepth == _elements.rows[row].indentDepth)
						{	
							result.down = true;
						}
						else
						{				
							for (i = (row + 1); i < _elements.rows.length; i++)
							{
								if (_elements.rows[i].indentDepth == _elements.rows[row].indentDepth)
								{	
									result.down = true;
								}
								else if (_elements.rows[i].indentDepth < _elements.rows[row].indentDepth)
								{
									break;
								}					
							}									
						}				
					}	
				}
			
				return result;
			}
			
			// ------------------------------------
			// moveItemUp
			// ------------------------------------						
			function functionMoveItemUp (row)
			{	
				var from;
				var to;
				var select;
				
				// If no row given, just use the currently selected one.
				if (!row )
				{		
					row = _temp.selectedRow;				
				}
				
				// Check if row is valid.
				if ((row >= _elements.rows.length) || (row == -1))
				{
					throw "Cannot move row '"+ row +"' of "+ (_elements.rows.length - 1) +"";
				}
				
				// If row is not the first, than lets continue.
				if (row > 0)
				{		
					if (!_attributes.treeview)
					{			
						from = row;
						to = (row -1);
						select = (row - 1);
					}				
					else
					{
						// If row above is of same depth, just move up.	
						if (_elements.rows[(row - 1)].indentDepth == _elements.rows[row].indentDepth)
						{	
							from = row;
							to = (row - 1);
							select = (row - 1);
						}			
						else
						{
							// Figure out how many rows we need to move up before we hit a row on the same depth, if it exists.
							for (i = (row - 1); i >= 0; i--)
							{
								if (_elements.rows[i].indentDepth == _elements.rows[row].indentDepth)
								{						
									from = row;
									to = i;
									select = i;
									
									break;				
								}
								else if (_elements.rows[i].indentDepth < _elements.rows[row].indentDepth)
								{
									break;
								}					
							}				
						}								
					}
				}	
					
				// Move rows around, but only if eveything is ok.
				if ((from != null) && (to != null) && (select != null))
				{
					moveItem (from, to);
					setSelectedRow (select);
				}
				else
				{
					throw "Cannot move row '"+ row +"' of "+ (_elements.rows.length - 1) +"";
				}
				
				// Create result.
				var result = new Array ();
				result[0] = from;
				result[1] = to;
				
				// All done.	
				return result;			
			}
			
			// ------------------------------------
			// moveItemDown
			// ------------------------------------								
			function functionMoveItemDown (row)
			{	
				var from;
				var to;
				var select;
			
				// If no row given, just use the currently selected one.
				if (!row)
				{
					row = _temp.selectedRow;
				}
				
				// Check if row is valid.
				if ((row >= _elements.rows.length) || (row == -1))
				{
					throw "Cannot move row '"+ row +"' of "+ (_elements.rows.length - 1) +"";
				}
				
				// If row is not the last one, than lets continue.
				if (row < (_elements.rows.length - 1))
				{		
					if (!_attributes.treeview)
					{					
						from = row;
						to = (row + 1);
						select = (row + 1);
					}
					else
					{
						// If row below i of same depth, just move down.
						if (_elements.rows[(row + 1)].indentDepth == _elements.rows[row].indentDepth)
						{												
							from = row;
							to = (row + 1);
							select = row + (getNumberOfRowChildren ((row + 1)) + 1)
						}
						else
						{										
							// Figure out how many rows we need to move down before we hit a row of the same depth, if it exists.
							for (i = (row + 1); i < _elements.rows.length; i++)
							{																		
								if (_elements.rows[i].indentDepth == _elements.rows[row].indentDepth)
								{
									to = i;
									break;
								}
							}
											
							from = row;								
							select = (from + getNumberOfRowChildren (to) + 1)
						}				
					}
				}
				
				// Move rows around, but only if eveything is ok.
				if ((from != null) && (to != null) && (select != null))
				{
					moveItem (from, to);
					setSelectedRow (select);
				}
				else
				{
					throw "Cannot move row '"+ row +"' of "+ (_elements.rows.length - 1) +"";
				}
				
				// Create result.
				var result = new Array ();
				result[0] = from;
				result[1] = to;
				
				// All done.
				return result;
			}
			
			// ------------------------------------
			// getItemRow
			// ------------------------------------		
			function functionGetItemRow ()
			{
				return _temp.selectedRow;
			
			}
			// ------------------------------------
			// Events
			// ------------------------------------					
			// ------------------------------------
			// onFocus
			// ------------------------------------					
			function eventOnFocus ()
			{
				if (!_attributes.disabled)
				{
					if (!_attributes.focus)
					{
						_attributes.focus = true;
						refresh ();
			
						if (_attributes.onFocus != null)
						{
							setTimeout( function ()	{ _attributes.onFocus (); }, 1);
						}			
					}				
				}
			}
			
			// ------------------------------------
			// onBlur
			// ------------------------------------							
			function eventOnBlur ()
			{
				if (!_attributes.disabled)
				{
					if (_attributes.focus)
					{	
						_attributes.focus = false;
						refresh ();
			
						if (_attributes.onBlur != null)
						{
							setTimeout( function ()	{ _attributes.onBlur (); }, 1);
						}			
					}	
				}
			}
			
			// ------------------------------------
			// onChange
			// ------------------------------------							
			function eventOnChange ()
			{
				if (!_attributes.disabled)
				{		
					if (_attributes.onChange != null)
					{
						setTimeout( function ()	{ _attributes.onChange (); }, 1);
					}			
				}
			}
			
			// ------------------------------------
			// onItemClick
			// ------------------------------------							
			function eventOnRowClick ()
			{
				if (!_attributes.disabled)
				{	
					var row = this.id.split("_")[1];	
					var doubleclick = false;
												
					if (((SNDK.tools.getTicks () - _temp.doubleClickTicks) < 500) && (row == _temp.doubleClickRow) )
					{			
						_temp.doubleClickTicks = 0;
						doubleclick = true;
					}
					else
					{
						_temp.doubleClickTicks = SNDK.tools.getTicks ();
						_temp.doubleClickRow = row;
					}
					
					if ((row == _temp.selectedRow) && (doubleclick == false))
					{
						row = -1;
					}
					
					setSelectedRow (row)
					
					eventOnChange ();
												
					if (doubleclick)
					{
						if (_attributes.onDoubleClick != null)
						{
							setTimeout( function ()	{ _attributes.onDoubleClick (); }, 1);
						}							
					}
					else
					{
						if (_attributes.onClick != null)
						{
							setTimeout( function ()	{ _attributes.onClick (); }, 1);
						}							
					}
				}
			}
						
		},
	
		/**
		* @constructor
		*/
		textbox : function (attributes)
		{
			var _elements = new Array ();
			var _attributes = attributes;
					
			var _temp = 	{ initialized: false,
				  	  cache: new Array ()
					};
										
			setAttributes ();		
			
			// Private functions
			this._attributes = _attributes;
			this._elements = _elements;
			this._temp = _temp;	
			this._init = init;		
			
			// Functions
			this.type = "TEXTBOX";
			this.refresh = functionRefresh;	
			this.dispose = functionDispose;
			this.getAttribute = functionGetAttribute;
			this.setAttribute = functionSetAttribute;	
				
			// Construct
			construct ();
			
			// Initialize	
			SNDK.SUI.addInit (this);
			
			// ------------------------------------
			// Private functions
			// ------------------------------------	
			// ------------------------------------
			// init
			// ------------------------------------			
			function init ()
			{
				updateCache ();		
				
				_attributes.heightType = "pixel";
				_attributes.height = _temp.cache["containerBoxDimensions"]["vertical"] + _temp.cache["containerHeight"];		
			}
			
			// ------------------------------------
			// construct
			// ------------------------------------			
			function construct ()
			{				
				// Container
				_elements["container"] = SNDK.tools.newElement ("span", {});
				_elements["container"].className = _attributes.stylesheet;
				
				// IconContainer
				_elements["iconcontainer"] = new SNDK.tools.newElement ("span", {appendTo: _elements["container"]})
			
				// Input
				var type = "text";
				if (_attributes.password)
				{
					type = "password";
				}
			
				_elements["input"] = SNDK.tools.newElement ("input", {type: type, appendTo: _elements["container"]});
				_elements["input"].className = "input-unstyled";
				
				if (_attributes.textTransform)
				{
					_elements["input"].style.textTransform = _attributes.textTransform;					
				}
				
				// InfoBubbleContainer
				_elements["infobubblecontainer"] = new SNDK.tools.newElement ("span", {appendTo: _elements["container"]})
			
				// Icon
				setIcon ();
			
				// InfoBubble
				setInfoBubble ();
																	
				// Hook Events
				_elements["input"].onfocus = eventOnFocus;
				_elements["input"].onblur = eventOnBlur;
				_elements["input"].onchange = eventOnChange;
				_elements["input"].onkeyup = eventOnKeyUp;	
				_elements["input"].onkeypress = eventOnKeyPress;
				
				window.addEvent (window, 'SUIREFRESH', refresh);						
			}		
					
			// ------------------------------------
			// refresh
			// ------------------------------------		
			function refresh ()
			{
				if (_temp.initialized)
				{					
					if (_attributes.disabled)
					{
						_elements["container"].className = _attributes.stylesheet +" disabled";														
						_elements["input"].disabled = true;
						_attributes.focus = false;
						eventOnBlur ();					
					}
					else
					{
						if (_attributes.focus)
						{	
							_elements["container"].className = _attributes.stylesheet +" focus";								
							//_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet+"Focus";					
							setFocus ();
						}
						else
						{				
							_elements["container"].className = _attributes.stylesheet;
						}
			
						_elements["input"].disabled = false;
					}
						
					if (_attributes.autoComplete)
					{
						_elements["input"].setAttribute ("autocomplete", "on");
					}
					else
					{
						_elements["input"].setAttribute ("autocomplete", "off");
					}	
					
					if (_attributes.readOnly)
					{
						_elements["input"].setAttribute ("readonly", "true");
					}
					else
					{
						_elements["input"].removeAttribute ("readonly");
					}						
					
					if (_attributes.value != null)
					{
						_elements["input"].value = _attributes.value;
					}				
					
					_elements["input"].tabIndex = _attributes.tabIndex;									
				}
						
				setDimensions ();	
			}	
			
			// ------------------------------------
			// updateCache
			// ------------------------------------		
			function updateCache ()
			{
				_temp.cache["containerBoxDimensions"] = SNDK.tools.getElementStyledBoxSize (_elements["container"]);
				_temp.cache["inputBoxDimensions"] = SNDK.tools.getElementStyledBoxSize (_elements["input"]);
				_temp.cache.containerBoxDimensions.horizontal += _temp.cache.inputBoxDimensions.horizontal;
					
				if (_attributes.icon)
				{
					_temp.cache["iconWidth"] = _elements["icon"].offsetWidth;
					_temp.cache.containerBoxDimensions.horizontal += _temp.cache.iconWidth;
				}
					
				if (_attributes.infoBubble)
				{
					_temp.cache["infoBubbleWidth"] = _elements["infospot"].offsetWidth;
					_temp.cache.containerBoxDimensions.horizontal += _temp.cache.infoBubbleWidth;
				}
				
				_temp.cache["containerHeight"] = SNDK.tools.getElementStyledHeight (_elements["container"]);
			}		
				
			// ------------------------------------
			// setAttributes
			// ------------------------------------		
			function setAttributes ()
			{
				// Id
				_attributes.id = SNDK.tools.newGuid ()	
			
				// Name
				if (!_attributes.name)		
					_attributes.name = "";	
			
				// Stylesheet
				if (!_attributes.stylesheet)
					_attributes.stylesheet = "input";
			
				// Managed
				if (!_attributes.managed)		
					_attributes.managed = false;	
			
				// Width
				if (!_attributes.width) 
					_attributes.width = "100px";				
					
				if (_attributes.width.substring (_attributes.width.length - 1) == "%")
				{
					_attributes.widthType = "percent";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 1)			
				}
				else
				{
					_attributes.widthType = "pixel";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 2)
				}			
			
				// Disabled
				if (!_attributes.disabled)		
					_attributes.disabled = false;				
															
				// AutoComplete
				if (!_attributes.autoComplete)
					_attributes.autoComplete = false;
			
				// ReadOnly
				if (!_attributes.readOnly)
					_attributes.readOnly = false;
			
				// Focus	
				if (!_attributes.focus)
					_attributes.focus = false;
						
				// Password
				if (!_attributes.password)
					_attributes.password = false;
					
				// textTransform
				if (!_attributes.textTransform)
					_attributes.textTransform = "none";
			
				// onFocus
				if (!_attributes.onFocus)
					_attributes.onFocus = null;	
					
				// onBlur
				if (!_attributes.onBlur)
					_attributes.onBlur = null;	
			
				// onChange
				if (!_attributes.onChange)
					_attributes.onChange = null;
					
				// onEnter
				if (!_attributes.onEnter)
					_attributes.onEnter = null;
										
				// Value
				if (!_attributes.value)
					_attributes.value = "";	
					
				// TabIndex
				if (!_attributes.tabIndex)
					_attributes.tabIndex = 0;
			}		
			
			// ------------------------------------	
			// setDimensions
			// ------------------------------------			
			function setDimensions ()
			{
				if (_temp.initialized)
				{	
					var width = 0;
					
					if (_attributes.widthType != "pixel")
					{								
						width = ((SNDK.tools.getElementInnerWidth (_elements["container"].parentNode) * _attributes.width) / 100)
					}
					else
					{			
						width = _attributes.width;
					}	
					
					_elements["input"].style.width = width - _temp.cache.containerBoxDimensions.horizontal +"px";
				}
			}	
			
			// ------------------------------------
			// keyHandler
			// ------------------------------------
			function keyHandler (event)
			{		
				var key;
				if (!event && window.event) 
				{
					event = window.event;
				}
					
				if (event) 
				{
					key = event.keyCode;
				}
				else
				{
					key = event.which;	
				}
				
				return key;
			}	
			
			// ------------------------------------
			// keyHandler
			// ------------------------------------
			function functionDispose ()
			{		
				window.removeEvent (window, 'SUIREFRESH', refresh);	
			}
						
			// ------------------------------------
			// setFocus
			// ------------------------------------				
			function setFocus ()
			{	
				setTimeout ( function () {  _attributes.focus = true; _elements["input"].focus (); }, 25);	
			}	
			
			// ------------------------------------
			// setIcon
			// ------------------------------------					
			function setIcon ()
			{
				if (_attributes.icon != null)
				{
					var icon = _attributes.icon.split (";")[0];
					var color =  _attributes.icon.split (";")[1];
				
					_elements["icon"] = SNDK.tools.newElement ("span", {appendTo: _elements["iconcontainer"]});
					_elements["icon"].className = "icon-"+ icon +" "+ color;
				}		
				else
				{
					_elements["icon"] = null;
					_elements["iconcontainer"].innerHTML = " ";
				}
			}
			
			// ------------------------------------
			// setInfoBubble
			// ------------------------------------				
			function setInfoBubble ()
			{
				if (_attributes.infoBubble != null)
				{		
					var icon = _attributes.infoBubble.split (";")[0];
					var color = _attributes.infoBubble.split (";")[1];
					var text = _attributes.infoBubble.split (";")[2];
			
					_elements["infospot"] = SNDK.tools.newElement ("span", {appendTo: _elements["infobubblecontainer"]});
					_elements["infospot"].className = "info-spot";
			
					_elements["infoicon"] = SNDK.tools.newElement ("span", {appendTo: _elements["infospot"]});
					_elements["infoicon"].className = "icon-"+ icon +" "+ color;
					
					_elements["infobubble"] = SNDK.tools.newElement ("span", {appendTo: _elements["infospot"]});
					_elements["infobubble"].className = "info-bubble";
					_elements["infobubble"].innerHTML = text;
				}
				else
				{
					_elements["infospot"] = null;
					_elements["infoicon"] = null;
					_elements["infobubble"] = null;
					_elements["infobubblecontainer"].innerHTML = " ";
				}
			}
			// ------------------------------------
			// Public functions
			// ------------------------------------		
			// ------------------------------------
			// refresh
			// ------------------------------------				
			function functionRefresh ()
			{	
				refresh ();
			}		
						
			// ------------------------------------
			// getAttribute
			// ------------------------------------						
			function functionGetAttribute (attribute)
			{
				switch (attribute)
				{
					case "id":
					{
						return _attributes[attribute];
					}
					
					case "tag":
					{
						return _attributes[attribute];
					}
					
					case "name":
					{
						return _attributes[attribute];
					}
			
					case "stylesheet":
					{
						return _attributes[attribute];
					}
					
					case "width":
					{
						if (_attributes.widthType == "percent")
						{
							return _attributes.width + "%";
						}
			
						if (_attributes.widthType == "pixel")
						{
							return _attributes.width + "px";
						}
					}
					
					case "height":
					{
						if (_attributes.heightType == "percent")
						{
							return _attributes.height + "%";
						}
			
						if (_attributes.heightType == "pixel")
						{
							return _attributes.height + "px";
						}
					}
					
					case "appendTo":
					{
						return _attributes[attribute];			
					}			
					
					case "managed":
					{
						return _attributes[attribute];			
					}
			
					case "disabled":
					{
						return _attributes[attribute];			
					}
			
					case "autocomplete":
					{
						return _attributes[attribute];			
					}
			
					case "readOnly":
					{
						return _attributes[attribute];			
					}
					
					case "focus":
					{
						return _attributes[attribute];			
					}
			
					case "password":
					{
						return _attributes[attribute];			
					}
					
					case "textTransform":
					{
						return _attributes[attribute];			
					}
			
					case "onFocus":
					{
						return _attributes[attribute];			
					}
			
					case "onBlur":
					{
						return _attributes[attribute];			
					}
			
					case "onChange":
					{
						return _attributes[attribute];			
					}
			
					case "onKeyUp":
					{
						return _attributes[attribute];			
					}
					
					case "onEnter":
					{
						return _attributes[attribute];
					}
			
					case "value":
					{
						return getValue ();
					}
					
					case "tabIndex":
					{
						return _attributes[attribute];
					}
							
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}
			
			// ------------------------------------
			// setAttribute
			// ------------------------------------						
			function functionSetAttribute (attribute, value)
			{
				switch (attribute)
				{
					case "id":
					{
						throw "Attribute with name ID is ready only.";
						break;
					}
					
					case "tag":
					{
						_attributes[attribute] = value;
						break;
					}
					
					case "name":
					{
						_attributes[attribute] = value;
						break;
					}
			
					case "stylesheet":
					{
						_attributes[attribute] = value;
						break;				
					}
					
					case "width":
					{
						if (value.substring (value.width.length, 3) == "%")
						{
							_attributes.widthType = "percent";
							_attributes.width = value.width.substring (0, value.width.length - 1)			
						}
						else
						{
							_attributes.widthType = "pixel";
							_attributes.width = value.width.substring (0, value.width.length - 2)
						}	
						break;			
					}
					
					case "height":
					{
						throw "Attribute with name HEIGHT is ready only.";
						break;			
					}			
					
					case "appendTo":
					{
						_attributes[attribute] = value;	
						_attributes.appendTo.appendChild (_elements["container"]);			
						break;
					}			
					
					case "managed":
					{
						_attributes[attribute] = value;
			
						if (value)
						{
							window.removeEvent (window, 'SUIREFRESH', refresh);		
						}
						else
						{
							window.addEvent (window, 'SUIREFRESH', refresh);
						}
			
						break;
					}
			
					case "disabled":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
			
					case "autocomplete":
					{
						_attributes[attribute] = value;
						break;
					}
			
					case "readOnly":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
					
					case "focus":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
			
					case "password":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
					
					case "textTransform":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
			
					case "onFocus":
					{
						_attributes[attribute] = value;
						break;
					}
			
					case "onBlur":
					{
						_attributes[attribute] = value;
						break;
					}
			
					case "onChange":
					{
						_attributes[attribute] = value;
						break;
					}
			
					case "onKeyUp":
					{
						_attributes[attribute] = value;
						break;
					}
					
					case "onEnter":
					{
						_attributes[attribute] = value;
						break;
					}
			
					case "value":
					{
						_attributes[attribute] = value;
						refresh ();
						if (_temp.initialized)
						{
							eventOnChange ();
						}
						break;
					}
					
					case "tabIndex":
					{
						_attributes[attribute] = value;
						refresh ();
					}
							
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}
			// ------------------------------------
			// Events
			// ------------------------------------
			// ------------------------------------	
			
			// ------------------------------------
			// eventOnKeyPress
			// ------------------------------------			
			function eventOnKeyPress (event)
			{
				_attributes.value = _elements["input"].value;			
										
				
			}
			
			function getValue ()
			{
				var result = _attributes.value;
			
				switch (_attributes.textTransform.toLowerCase ())
				{
					case "uppercase":
					{				
						result = result.toUpperCase ();
						break;
					}
				}				
				
				return result;
			}
			
			function transform ()
			{
			
				switch (_attributes.textTransform.toLowerCase ())
				{
					case "uppercase":
					{
						//_attributes.value = _attributes.value.toUpperCase ();
						return _attributes.value.toUpperCase ();
						//_elements["input"].value = _attributes.value.toUpperCase ();
						break;
					}
				}				
			}
			
			// ------------------------------------
			// onKeyUp
			// ------------------------------------	
			function eventOnKeyUp (event)
			{
				var result = true;
					
				var key = keyHandler (event);
				
				
			
				//_attributes.value = _elements["input"].value;				
							
				if (_attributes.onKeyUp != null)
				{
					setTimeout( function () { _attributes.onKeyUp (_attributes.tag); }, 1);
				}	
				
				// ONENTER
				if (key == 13)
				{
					if (_attributes.onEnter != null)
					{
						setTimeout( function () { _attributes.onEnter (_attributes.tag); }, 1);
					}	
				}
				
			
				
				eventOnChange ();
									
				return result;
			}	
				
			// ------------------------------------
			// onFocus
			// ------------------------------------		
			function eventOnFocus ()
			{
				if (!_attributes.disabled)
				{		
					if (!_attributes.focus)
					{
						_attributes.focus = true;				
						refresh ();
			
						if (_attributes.onFocus != null)
						{
							setTimeout( function () { _attributes.onFocus (_attributes.tag); }, 1);
						}
					}					
				}			
			}
			
			// ------------------------------------
			// onBlur
			// ------------------------------------		
			function eventOnBlur ()
			{
				if (!_attributes.disabled)
				{
					if (_attributes.focus)
					{
						_attributes.focus = false;
						refresh ();
						
						if (_attributes.onBlur != null)
						{
							setTimeout( function () { _attributes.onBlur (_attributes.tag); }, 1);
						}			
					}
				}
			}	
			
			// ------------------------------------
			// onChange
			// ------------------------------------			
			function eventOnChange ()
			{	
				_attributes.value = _elements["input"].value;
					
				if (_attributes.onChange != null)
				{	
					setTimeout( function () { _attributes.onChange (_attributes.tag); }, 1);
				}
			}
		},
	
		// -------------------------------------------------------------------------------------------------------------------------
		// checkbox ([attributes])
		// -------------------------------------------------------------------------------------------------------------------------
		//
		// .getAttribute (string)
		// .setAttribute (string, string)
		//	
		// 	id 		get
		//	tag		get/set
		//	name		get/set
		//	stylesheet	get/set
		//	appendTo	get/set
		//	managed		get/set
		//	disabled	get/set
		//	onFocus		get/set
		//	onBlur		get/set
		//	onChange	get/set
		//	value		get/set
		//
		// CHANGELOG:
		//
		// v1.02:
		//	- Added managed mode.
		//
		// v1.01:
		//	- Fixed width caluclation. Now works with percentage.
		//	- Code cleanup.
		//
		// v1.00:
		//	- Initial release.
		/**
		 * @constructor
		 */ 
		checkbox : function (attributes)
		{
			var _elements = new Array ();			
			var _attributes = attributes;	
								
			var _temp = 	{ initialized: false,
					  cache: new Array ()
					};
					
			_attributes.id = SNDK.tools.newGuid ();
		
			setAtrributes ();	
									
			// Private functions
			this._attributes = _attributes;
			this._elements = _elements;
			this._temp = _temp;	
			this._init = init;							
											
			// Functions
			this.refresh = functionRefresh;
			this.dispose = functionDispose;
			this.getAttribute = functionGetAttribute;
			this.setAttribute = functionSetAttribute;
						
			// Construct
			construct ();
																
			// Initialize
			SNDK.SUI.addInit (this);					
									
			// ------------------------------------
			// Private functions
			// ------------------------------------
			// ------------------------------------
			// init
			// ------------------------------------
			function init ()
			{
				updateCache ();
				
				_attributes.widthType = "pixel";
				_attributes.width = _temp.cache["containerPadding"]["horizontal"] + _temp.cache["containerWidth"] +"px";
						
				_attributes.heightType = "pixel";
				_attributes.height = _temp.cache["containerPadding"]["vertical"] + _temp.cache["containerHeight"] +"px";		
			}
		
			// ------------------------------------
			// construct
			// ------------------------------------	
			function construct ()
			{	
				// Container
				_elements["container"] = SNDK.tools.newElement ("div", {});
				_elements["container"].setAttribute ("id", _attributes.id);
				_elements["container"].className = _attributes.stylesheet;					
				
				// Control
				_elements["checkmark"] = SNDK.tools.newElement ("div", {className: "Checkmark", appendTo: _elements["container"]});
		
				// Hook events	
				_elements["container"].onfocus = eventOnFocus;
				_elements["container"].onblur = eventOnBlur;
				_elements["container"].onclick = eventOnClick;		
				_elements["container"].onkeyup = eventOnKeyUp;		
				
				window.addEvent (window, 'SUIREFRESH', refresh);																														
			}
					
			// ------------------------------------
			// refresh
			// ------------------------------------		
			function refresh ()
			{
				if (_temp.initialized)
				{			
					if (_attributes.disabled)
					{
						if (_attributes.checked)
						{
							_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"DisabledChecked";
						}
						else
						{
							_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"Disabled";
						}			
						
						_elements["container"].removeAttribute("tabIndex");
						_attributes.focus = false;
						eventOnBlur ();	
					}			
					else
					{
						_elements["container"].setAttribute("tabIndex", 0);	
						if (_attributes.focus)
						{
							if (_attributes.checked)
							{
								_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"Focus "+ _attributes.stylesheet +"Checked";
							}
							else
							{
								_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"Focus";
							}								
							
							setFocus ();			
						}
						else
						{
							if (_attributes.checked)
							{
								_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"Checked";
							}
							else
							{
								_elements["container"].className = _attributes.stylesheet;
							}									
						}
					}										
				}
			}
			
			function dispose ()
			{
				window.removeEvent (window, 'SUIREFRESH', refresh);	
			}
			
			function functionDispose ()
			{		
				dispose ();
			}
			
			// ------------------------------------
			// updateCache
			// ------------------------------------		
			function updateCache ()
			{
				if (!_temp.cacheUpdated)
				{
					_temp.cache["containerPadding"] = SNDK.tools.getElementStyledPadding (_elements["container"]);
					_temp.cache["containerWidth"] = (SNDK.tools.getElementStyledWidth (_elements["checkmark"]));
					_temp.cache["containerHeight"] = SNDK.tools.getElementStyledHeight (_elements["checkmark"]);
				}
				
				_temp.cacheUpdated = true;	
			}	
			
			// ------------------------------------
			// setOptions
			// ------------------------------------		
			function setAtrributes ()
			{
				// Stylesheet
				if (!_attributes.stylesheet)
					_attributes.stylesheet = "SUICheckbox";
							
				// Checked
				if (!_attributes.checked)
					_attributes.checked = false;	
								 									
				// Disabled
				if (!_attributes.disabled)
					_attributes.disabled = false;
												
				// Focus	
				if (!_attributes.focus)
					_attributes.focus = false;
			}	
				
			// ------------------------------------
			// setFocus
			// ------------------------------------				
			function setFocus ()
			{
				setTimeout ( function () { _elements["container"].focus (); }, 2);	
			}	
			
			// ------------------------------------
			// setBlur
			// ------------------------------------				
			function setBlur ()
			{
				setTimeout ( function () { _elements["container"].blur (); }, 2);	
			}				
			
			// ------------------------------------
			// keyHandler
			// ------------------------------------	
			function keyHandler(event)
			{		
				var key;
				if (!event && window.event) 
				{
					event = window.event;
				}
				
				if (event) 
				{
					key = event.keyCode;
				}
				else
				{
					key = event.which;	
				}
			
				if (key == 13)								// Enter			
				{
					eventOnKeyPressEnter ();
				}		
			 }	
			
			// ------------------------------------
			// Public functions
			// ------------------------------------		
			// ------------------------------------
			// refresh
			// ------------------------------------				
			function functionRefresh ()
			{
				refresh ();
			}
							
			// ------------------------------------
			// getAttribute
			// ------------------------------------						
			function functionGetAttribute (attribute)
			{
				switch (attribute)
				{
					case "id":
					{
						return _attributes[attribute];
					}
					
					case "tag":
					{
						return _attributes[attribute];
					}
					
					case "name":
					{
						return _attributes[attribute];
					}
		
					case "stylesheet":
					{
						return _attributes[attribute];
					}
					
					case "width":
					{
						if (_attributes.widthType == "percent")
						{
							return _attributes.width + "%";
						}
		
						if (_attributes.widthType == "pixel")
						{
							return _attributes.width + "px";
						}
					}
					
					case "height":
					{
						if (_attributes.heightType == "percent")
						{
							return _attributes.height + "%";
						}
		
						if (_attributes.heightType == "pixel")
						{
							return _attributes.height + "px";
						}
					}
					
					case "appendTo":
					{
						return _attributes[attribute];			
					}			
					
					case "managed":
					{
						return _attributes[attribute];			
					}
		
					case "disabled":
					{
						return _attributes[attribute];			
					}
					
					case "focus":
					{
						return _attributes[attribute];			
					}
		
					case "onFocus":
					{
						return _attributes[attribute];			
					}
		
					case "onBlur":
					{
						return _attributes[attribute];			
					}
		
					case "onChange":
					{
						return _attributes[attribute];			
					}
		
					case "value":
					{				
						return _attributes.checked;			
					}
							
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}		
			}
			
			// ------------------------------------
			// setAttribute
			// ------------------------------------						
			function functionSetAttribute (attribute, value)
			{
				switch (attribute)
				{
					case "id":
					{
						throw "Attribute with name ID is ready only.";
						break;
					}
					
					case "tag":
					{
						_attributes[attribute] = value;
						break;
					}
					
					case "name":
					{
						_attributes[attribute] = value;
						break;
					}
		
					case "stylesheet":
					{
						_attributes[attribute] = value;
						break;				
					}
					
					case "width":
					{
						throw "Attribute with name WIDTH is ready only.";
						break;			
					}
					
					case "height":
					{
						throw "Attribute with name HEIGHT is ready only.";
						break;			
					}			
					
					case "appendTo":
					{
						_attributes[attribute] = value;	
						_attributes.appendTo.appendChild (_elements["container"]);			
						break;
					}			
					
					case "managed":
					{
						_attributes[attribute] = value;
		
						if (value)
						{
							window.removeEvent (window, 'SUIREFRESH', refresh);		
						}
						else
						{
							window.addEvent (window, 'SUIREFRESH', refresh);
						}
		
						break;
					}
		
					case "disabled":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
					
					case "focus":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
		
					case "password":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
		
					case "onFocus":
					{
						_attributes[attribute] = value;
						break;
					}
		
					case "onBlur":
					{
						_attributes[attribute] = value;
						break;
					}
		
					case "onChange":
					{
						_attributes[attribute] = value;
						break;
					}
		
					case "value":
					{
						_attributes.checked = value;
						refresh ();
						break;
					}
							
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}		
			}		
			
			function functionDispose ()
			{
				dispose ();	
			}			
			
			// ------------------------------------
			// Events
			// ------------------------------------
			// ------------------------------------
			// eventOnKeyUp
			// ------------------------------------	
			function eventOnKeyUp (event)
			{
				keyHandler(event);
			}
				
			// ------------------------------------
			// onKeyPressEnter
			// ------------------------------------	
			function eventOnKeyPressEnter ()
			{	
				if (!attributes.disabled)
				{
					if (_attributes.checked)
					{
						_attributes.checked = false;
					}
					else
					{
						_attributes.checked = true;
					}	
								
					refresh ();	
					eventOnChange ();					
				}	
			}
					
			// ------------------------------------
			// onClick
			// ------------------------------------	
			function eventOnClick ()
			{
				if (!_attributes.disabled)
				{
					if (_attributes.checked)
					{
						_attributes.checked = false;
					}
					else
					{
						_attributes.checked = true;
					}
					
					refresh ();
					eventOnChange ();
			
					if (_attributes.onClick != null)
					{
						setTimeout( function () { _attributes.onClick (_name); }, 1);
					}
				}
			}
				
			// ------------------------------------
			// onFocus
			// ------------------------------------		
			function eventOnFocus ()
			{
				if (!_attributes.disabled)
				{
					if (!_attributes.focus)
					{
						_attributes.focus = true;
						refresh ();
		
						if (_attributes.onFocus != null)
						{
							setTimeout( function () { _attributes.onFocus (_name); }, 1);
						}
					}					
				}			
			}
			
			// ------------------------------------
			// onBlur
			// ------------------------------------		
			function eventOnBlur ()
			{
				if (!_attributes.disabled)
				{
					if (_attributes.focus)
					{
						_attributes.focus = false;
						refresh ();
						
						if (_attributes.onBlur != null)
						{
							setTimeout( function () { _attributes.onBlur (_name); }, 1);
						}			
					}
				}
			}	
					
			// ------------------------------------
			// onChange
			// ------------------------------------						
			function eventOnChange ()
			{
				if (_attributes.onChange != null)
				{
					setTimeout( function ()	{ _attributes.onChange (); }, 1);
				}
			}		
		},
	
		// -------------------------------------------------------------------------------------------------------------------------
		// layoutbox ([attributes])
		// -------------------------------------------------------------------------------------------------------------------------
		//
		// .addPanel ({tag, size})
		// .getPanel (tag)
		//
		//	.addUIElement (uielement)
		//	.getAttribute (string)
		//	.setAttribute (string, string)
		//
		//		tag		get/set
		//
		// .getAttribute (string)
		// .setAttribute (string, string)
		//	
		//	id		get
		//	tag		get/set
		//	stylesheet	get/set
		//	width		get/set
		//	height		get/set
		//	appendTo	get/set			
		//	managed		get/set
		//
		// CHANGELOG:
		//
		// v1.01:
		//	- Added managed mode.
		//	- Fixed panel render, should now be more accurate and faster.
		//
		// v1.00:
		//	- Initial release.
		
		/**
		 * @constructor
		 */
		layoutbox : function (attributes)
		{
			var _elements = new Array ();
			var _attributes = attributes;
			var _temp = 	{ initialized: false,
				 	  cache: new Array (),
				 	  contentHeight: 0
					};
		
			_attributes.id = SNDK.tools.newGuid ();
			
			setAttributes ();	
			
			// Private functions
			this._attributes = _attributes;
			this._elements = _elements;
			this._temp = _temp;	
			this._init = init;	
			
			this._height = getContainerHeight ();
			
			this.type = "LAYOUTBOX";
			
			// Functions		
			this.refresh = functionRefresh;	
			this.dispose = functionDispose;
			this.addPanel = functionAddPanel;
			this.getPanel = functionGetPanel;		
			this.setAttribute = functionSetAttribute;
			this.getAttribute = functionGetAttribute;
		
			// Construct
			construct ();
										
			// Initialize
			SNDK.SUI.addInit (this);
				
			// ------------------------------------
			// Private functions
			// ------------------------------------
			// ------------------------------------
			// init
			// ------------------------------------		
			function init ()
			{
				updateCache ();
			}
			
			// ------------------------------------
			// construct
			// ------------------------------------	
			function construct ()
			{
				// Container
				_elements["container"] = SNDK.tools.newElement ("div", {});
				_elements["container"].setAttribute ("id", _attributes.id);
																	
				// Hook Events
				window.addEvent (window, 'SUIREFRESH', refresh);				
			}	
				
			// ------------------------------------
			// refresh
			// ------------------------------------		
			function refresh ()
			{	
				if (!SNDK.debugStopRefresh)
				{
			
				// Only refresh if control has been initalized.	
				if (_temp.initialized)
				{		
					_elements["container"].className = _attributes.stylesheet;	
				}
				
				setDimensions ();
				}
				
			}
			
			// ------------------------------------
			// dispose
			// ------------------------------------			
			function dispose ()
			{
				window.removeEvent (window, 'SUIREFRESH', refresh);				
			}
			
			// ------------------------------------
			// updateCache
			// ------------------------------------		
			function updateCache ()
			{
				if (!_temp.cacheUpdated)
				{
					_temp.cache["containerPadding"] = SNDK.tools.getElementStyledPadding (_elements["container"]);
					//_temp.cache["panelPadding"] = SNDK.tools.getElementStyledPadding (_elements["container"]);
				}
				
				_temp.cacheUpdated = true;	
			}	
						
						
			function getContainerHeight ()
			{
				if (_temp.initialized)
				{
					return _elements["container"].style.container;
				}
				else
				{
					return 0;		
				}
			}
						
			// ------------------------------------
			// setDefaultAttributes
			// ------------------------------------					
			function setAttributes ()
			{
				// Stylesheet
				if (!_attributes.stylesheet) 
					_attributes.stylesheet = "SUILayoutbox";	
		
				// Managed
				if (!_attributes.managed)
					_attributes.managed = false;				
			
				// Width
				if (!_attributes.width) 
					_attributes.width = "100%";				
					
				if (_attributes.width.substring (_attributes.width.length - 1) == "%")
				{
					_attributes.widthType = "percent";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 1)			
				}
				else
				{
					_attributes.widthType = "pixel";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 2)
				}		
				
				// Height
				if (!_attributes.height) 
					_attributes.height = "100%";
					
				if (_attributes.height == "content")
				{
					_attributes.heightType = "content";
				}
				else if (_attributes.height.substring (_attributes.height.length - 1) == "%")
				{
					_attributes.heightType = "percent";
					_attributes.height = _attributes.height.substring (0, _attributes.height.length - 1)			
				}
				else
				{
					_attributes.heightType = "pixel";
					_attributes.height = _attributes.height.substring (0, _attributes.height.length - 2)
				}								
								
				_attributes.panels = new Array ();							
			}		
								
			// ------------------------------------
			// setDimensions
			// ------------------------------------
			function setDimensions ()
			{		
				if (_temp.initialized)
				{			
					var width = {};	
					var height = {};
					var combinedheightofchildren = 0;
		
					if (!_attributes.managed && _attributes.widthType != "pixel")
					{					
						width.container = ((SNDK.tools.getElementInnerWidth (_elements["container"].parentNode) * _attributes.width) / 100) - _temp.cache.containerPadding["horizontal"];
					}
					else
					{			
						if (_attributes.managed && _attributes.widthType == "percent")
						{
							width.container = _attributes.managedWidth - _temp.cache.containerPadding["horizontal"];
							//console.log ("managed: "+ _attributes.managedWidth);
						}
						else
						{
							width.container = _attributes.width - _temp.cache.containerPadding["horizontal"];
						}			
					}	
		
					if (!_attributes.managed && _attributes.heightType != "pixel")
					{					
						height.container = ((SNDK.tools.getElementInnerHeight (_elements["container"].parentNode) * _attributes.height) / 100) - _temp.cache.containerPadding["vertical"];
					}
					else
					{									
						if (_attributes.managed && _attributes.heightType == "content")
						{
							height.container = 200;
						}
						else if (_attributes.managed && _attributes.heightType == "percent")
						{
							height.container = _attributes.managedHeight - _temp.cache.containerPadding["vertical"];				
							
						}
						else
						{
							height.container = _attributes.height - _temp.cache.containerPadding["vertical"];
						}			
					}	
					
					_elements["container"].style.width = width.container +"px";				
					_elements["container"].style.height = height.container +"px"; 				
					
					//console.log ("layoutbox: "+ width.container +" x "+ height.container);
					
					var dynamics = new Array ();
					var combinedsize = 0;						
		
					for (index in _attributes.panels)
					{
						if (_attributes.panels[index]._attributes.hidden)
						{
							continue;
						}
						
						var size = 0;
						var panel = _attributes.panels[index];
										
						switch (_attributes.panels[index]._attributes.sizeType)
						{
							case "percent":
							{					
								if (_attributes.type == "horizontal")
								{
									size =  Math.floor ((height.container * panel._attributes.size) / 100);
								}
								else if (_attributes.type == "vertical")
								{
									size =  Math.floor ((width.container * panel._attributes.size) / 100);
								}											
								combinedsize += size;							
								break;
							}
							
							case "pixel":
							{
								size = panel._attributes.size;					
								combinedsize += size;					
								break;
							}				
							
							case "dynamic":
							{
								dynamics[dynamics.length] = index;
		
								continue;
							}						
						}
		
						_attributes.panels[index]._attributes.calculatedSize = size;											
					}
					
					if (_attributes.type == "horizontal")
					{	
						dynamicsize = Math.floor ((height.container - combinedsize) / dynamics.length);
					}
					else if (_attributes.type == "vertical")
					{
						dynamicsize = Math.floor ((width.container - combinedsize) / dynamics.length);
					}				
													
					for (index in dynamics)
					{
						_attributes.panels[dynamics[index]]._attributes.calculatedSize = dynamicsize;	
					}		
								
					for (index in _attributes.panels)
					{
						if (_attributes.panels[index]._attributes.hidden)
						{
							continue;
						}
					
						var panel = _attributes.panels[index];
						var dimensions = {};
						
						var e = _attributes.panels[index]._elements["container"];
		
		
						if (_attributes.type == "horizontal")
						{
							dimensions.width = width.container - SNDK.tools.getElementStyledPadding (e)["horizontal"];
							dimensions.height = _attributes.panels[index]._attributes.calculatedSize - SNDK.tools.getElementStyledPadding (e)["vertical"];
							dimensions.cssfloat = "none";
						}
						else if (_attributes.type == "vertical")
						{
							dimensions.width = _attributes.panels[index]._attributes.calculatedSize - SNDK.tools.getElementStyledPadding (e)["horizontal"];
							dimensions.height = height.container - SNDK.tools.getElementStyledPadding (e)["vertical"];
							dimensions.cssfloat = "left";				
						}	
						
						e.style.width = dimensions.width +"px";
						e.style.height = dimensions.height +"px";
						e.style.cssFloat = dimensions.cssfloat;
						
						var combinedheightofchildren = 0;
								
						if (panel._attributes.canScroll)
						{
							for (index in panel._temp.uiElements)
							{		
								if (panel._temp.uiElements[index]._attributes.heightType == "pixel")
								{									
									combinedheightofchildren += parseInt (panel._temp.uiElements[index]._attributes.height);
								}
							}						
						
							if (combinedheightofchildren > dimensions.height)
							{
								dimensions.width = dimensions.width - window.scrollbarWidth;
							}													
						}					
													
						for (index in panel._temp.uiElements)
						{
							//console.log (panel._elements["container"].scrollTop)
											
							var scroll = panel._elements["container"].scrollTop;
						
							if (panel._temp.uiElements[index]._attributes.widthType == "percent")
							{
								panel._temp.uiElements[index]._attributes.managedWidth = (dimensions.width * panel._temp.uiElements[index]._attributes.width) / 100;
							}
					
							if (panel._temp.uiElements[index]._attributes.heightType == "percent")
							{
								panel._temp.uiElements[index]._attributes.managedHeight = (dimensions.height * panel._temp.uiElements[index]._attributes.height) / 100;
							}
						
							panel._temp.uiElements[index].refresh ();
							
							panel._elements["container"].scrollTop = scroll;
						}								
					}		
				}
			}				
								
			// ------------------------------------
			// Public functions
			// ------------------------------------		
			// ------------------------------------
			// refresh
			// ------------------------------------				
			function functionRefresh ()
			{
				refresh ();
			}		
			
			// ------------------------------------
			// dispose
			// ------------------------------------				
			function functionDispose ()
			{
				dispose ();
			}	
			
			function newPanel (attributes)
			{
				var _attributes = attributes;
				var _elements = new Array ();
				var _temp =	{ uiElements: new Array (),
							contentHeight: 0
						}
		
				setAttributes ();
				
				// Private functions		
				this._attributes = _attributes;
				this._elements = _elements;
				this._temp = _temp;
		
				// Functions						
				this.addUIElement = functionAddUIElement;
				this.getContentElement = functionGetContentElement;	
				this.setAttribute = functionSetAttribute;
				this.getAttribute = functionGetAttribute;
				this.refresh = functionRefresh ();
		
				// Initialize
				construct ();
				
				// ------------------------------------
				// Private functions
				// ------------------------------------
				function construct ()
				{
					_elements["container"] = SNDK.tools.newElement ("div", {className: "Panel", appendTo: _attributes.appendTo});
					
					
					if (_attributes.hidden)
					{
						_elements["container"].style.display = "none";
					}
											
					if (_attributes.canScroll)
					{
					
						_elements["container"].style.overflow = "auto";		
					}		
					else
					{
						//_elements["container"].style.overflow = "hidden";		
					}
				}
				
				function refresh ()
				{
					if (_attributes.hidden)
					{
						_elements["container"].style.display = "none";
					}
					else
					{
						_elements["container"].style.display = "block";							
					}	
				}
				
				// ------------------------------------
				// setAttributes
				// ------------------------------------																
				function setAttributes ()
				{
					if (!_attributes.hidden) 
						_attributes.hidden = false;
						
					if (!_attributes.size) 
						_attributes.size = "*";	
		
					if (_attributes.size != "*")
					{							
						if (_attributes.size.substring (_attributes.size.length - 1) == "%")
						{
							_attributes.sizeType = "percent";
							_attributes.size = parseInt (_attributes.size.substring (0, _attributes.size.length - 1));	
						}
						else
						{
							_attributes.sizeType = "pixel";
							_attributes.size = parseInt (_attributes.size.substring (0, _attributes.size.length - 2));
						}									
					}
					else
					{
						_attributes.sizeType = "dynamic";
					}
				}
		
				// ------------------------------------
				// Public functions
				// ------------------------------------				
				// ------------------------------------
				// addUIElement
				// ------------------------------------																
				function functionAddUIElement (element)
				{
					var count = _temp.uiElements.length;
		
				 	_temp.uiElements[count] = element;
		 	
				 	element.setAttribute ("managed", true);
				 	element.setAttribute ("appendTo", _elements["container"]);
				 	
				 	_temp.contentHeight += parseInt (element.height); 		 	
									 	
				//  SNDK.SUI.refresh ();		 			 	 
				}	
				
				function functionGetContentElement ()
				{
					return _elements["container"];		
				}
				
				// ------------------------------------
				// getAttribute
				// ------------------------------------						
				function functionGetAttribute (attribute)
				{
					switch (attribute)
					{			
						case "tag":
						{
							return _attributes[attribute];
						}
						
						case "hidden":
						{
							return _attributes[attribute];				
						}
				
						default:
						{
							throw "No attribute with the name '"+ attribute +"' exist in this object";
						}
					}	
				}
		
				// ------------------------------------
				// setAttribute
				// ------------------------------------						
				function functionSetAttribute (attribute, value)
				{
					switch (attribute)
					{			
						case "tag":
						{
							_attributes[attribute] = value;
							break;
						}
						
						case "hidden":
						{
							_attributes[attribute] = value;				
							refresh ();
							break;
						}
				
						default:
						{
							throw "No attribute with the name '"+ attribute +"' exist in this object";
						}
					}	
				}								
			}
			
			// ------------------------------------
			// addPanel
			// ------------------------------------						
			function functionAddPanel (attributes)
			{
				var count = _attributes.panels.length;
				attributes.appendTo = _elements["container"];
				attributes.parent = this;
		
				_attributes.panels[count] = new newPanel (attributes);
											
				refresh ();	
				
				return _attributes.panels[count];
			}
			
			// ------------------------------------
			// getPanel
			// ------------------------------------						
			function functionGetPanel (tag)
			{
				for (index in _attributes.panels)
				{		
					if (_attributes.panels[index].getAttribute ("tag") == tag)
					{
						return _attributes.panels[index];
					}
				}
			}
			
			// ------------------------------------
			// getAttribute
			// ------------------------------------						
			function functionGetAttribute (attribute)
			{
				switch (attribute)
				{
					case "id":
					{
						return _attributes[attribute];
					}			
		
					case "tag":
					{
						return _attributes[attribute];
					}			
					
					case "width":
					{
						if (_attributes.widthType == "percent")
						{
							return _attributes.width + "%";
						}
		
						if (_attributes.widthType == "pixel")
						{
							return _attributes.width + "px";
						}
					}
					
					case "height":
					{
						if (_attributes.heightType == "percent")
						{
							return _attributes.height + "%";
						}
		
						if (_attributes.heightType == "pixel")
						{
							return _attributes.height + "px";
						}
					}	
					
					case "appendTo":
					{
						return _attributes[attribute];			
					}			
					
					case "managed":
					{
						return _attributes[attribute];			
					}
				
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}
			}
			
			// ------------------------------------
			// setAttribute
			// ------------------------------------						
			function functionSetAttribute (attribute, value)
			{
				switch (attribute)
				{
					case "id":
					{
						throw "Attribute with name ID is ready only.";
						break;
					}
					
					case "tag":
					{
						_attributes[attribute] = value;
						break;
					}
					
					case "stylesheet":
					{
						_attributes[attribute] = value;
						break;				
					}
					
					case "width":
					{
						if (value.substring (value.width.length, 3) == "%")
						{
							_attributes.widthType = "percent";
							_attributes.width = value.width.substring (0, value.width.length - 1)			
						}
						else
						{
							_attributes.widthType = "pixel";
							_attributes.width = value.width.substring (0, value.width.length - 2)
						}	
						break;			
					}
		
					case "height":
					{
						if (value.substring (value.height.length, 3) == "%")
						{
							_attributes.heightType = "percent";
							_attributes.height = value.height.substring (0, value.height.length - 1)			
						}
						else
						{
							_attributes.heightType = "pixel";
							_attributes.height = value.height.substring (0, value.height.length - 2)
						}	
						break;			
					}
					
					case "appendTo":
					{
						_attributes[attribute] = value;	
						_attributes.appendTo.appendChild (_elements["container"]);			
						break;
					}			
					
					case "managed":
					{
						_attributes[attribute] = value;
						
						if (value)
						{
							window.removeEvent (window, 'SUIREFRESH', refresh);		
						}
						else
						{
							window.addEvent (window, 'SUIREFRESH', refresh);
						}
						
						break;
					}
										
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}										
							
			// ------------------------------------
			// Events
			// ------------------------------------					
		},
	
		// -------------------------------------------------------------------------------------------------------------------------
		// button ([attributes])
		// -------------------------------------------------------------------------------------------------------------------------
		//
		// .refresh ()
		// .dispose ()
		// .getAttribute (string)
		// .setAttribute (string, string)
		//	
		// 	id 			get
		//	tag			get/set
		//	stylesheet	get/set
		//	width		get/set
		//	height		get
		//	appendTo	get/set
		//	managed		get/set
		//	disabled	get/set
		//	focus		get/set
		//	onFocus		get/set
		//	onBlur		get/set
		//	onClick		get/set
		//	label		get/set
		//	tabIndex	get/set
		//
		/**
		 * @constructor
		 */
		button : function (attributes)
		{	
			var _elements = new Array ();			
			var _attributes = attributes;				
		
			var _temp = 	{ 
								initialized: false,
					  			mouseDown: false,
					  			mouseOver: false,
					  			enterDown: false,
					  			cache: new Array ()
							};
			
			_attributes.id = SNDK.tools.newGuid ();				
			
			setAttributes ();	
					
			// Private functions
			this._attributes = _attributes;
			this._elements = _elements;
			this._temp = _temp;	
			this._init = init;			
						
			// Functions
			this.type = "BUTTON";
			this.refresh = functionRefresh;
			this.dispose = functionDispose;
			this.getAttribute = functionGetAttribute;
			this.setAttribute = functionSetAttribute;	
											
			// Construct
			construct ();
						
			// Init Control
			SNDK.SUI.addInit (this);		
			
			// ------------------------------------
			// Private functions
			// ------------------------------------
			function init ()
			{
				updateCache ();
		
				_attributes.heightType = "pixel";
				_attributes.height = _temp.cache["containerBoxSize"]["vertical"] + _temp.cache["containerHeight"] +"px";
			}
			
			// ------------------------------------
			// construct
			// ------------------------------------	
			function construct ()
			{					
				// Container					
				_elements["container"] = SNDK.tools.newElement ("button", {});
				_elements["container"].className = _attributes.stylesheet;
				
				// Icon
				if (_attributes.icon)
				{						
					_elements["button-icon"] = SNDK.tools.newElement ("span", {appendTo: _elements["container"]});
					
					_elements["button-icon"].className = "button-icon "+ _attributes.iconColor;
					_elements["button-icon"].style.cssFloat = "left";
				
					_elements["icon"] = SNDK.tools.newElement ("span", {appendTo: _elements["button-icon"]});
					_elements["icon"].className = "icon-"+ _attributes.iconName;
				}	
																					
				// Hook events	
				_elements["container"].onfocus = eventOnFocus;
				_elements["container"].onblur = eventOnBlur;
				_elements["container"].onclick = eventOnClick;				
				_elements["container"].onkeydown = eventOnKeyDown;
				
				window.addEvent (window, 'SUIREFRESH', refresh);			
			}		
				
			// ------------------------------------
			// refresh
			// ------------------------------------	
			function refresh ()
			{
				if (_temp.initialized)
				{
					var style = _attributes.stylesheet;
							
					if (_attributes.disabled)
					{
						_elements["container"].disabled = true;
						_attributes.focus = false;
						eventOnBlur ();				
					}
					else
					{				
						_elements["container"].disabled = false;
					
						if (_attributes.active)
						{	
							style += " active";						
							_attributes.active = false;
							setTimeout (refresh, 100);					
						}				
														
						if (_attributes.focus)
						{	
							style += " focus";								
							setFocus ();			
						}
						
						_elements["container"].tabIndex = _attributes.tabIndex;
					}	
								
					SNDK.tools.setButtonLabel (_elements["container"], _attributes.label);						
					
					_elements["container"].className = style;
				
					setDimensions ();
				}		
			}	
			
			// ------------------------------------
			// dispose
			// ------------------------------------			
			function dispose ()
			{
				window.removeEvent (window, 'SUIREFRESH', refresh);				
			}	
			
			// ------------------------------------
			// updateCache
			// ------------------------------------		
			function updateCache ()
			{
				if (!_temp.cacheUpdated)
				{
					_temp.cache["containerBoxSize"] = SNDK.tools.getElementStyledBoxSize (_elements["container"]);			
					_temp.cache["containerHeight"] = SNDK.tools.getElementStyledHeight (_elements["container"]);
				}
				
				_temp.cacheUpdated = true;	
			}	
		
			// -------------------------------------
			// setAttributes
			// -------------------------------------
			function setAttributes ()
			{					
				// Stylesheet
				if (!_attributes.stylesheet)
					_attributes.stylesheet = "button";			
					
				// Managed
				if (!_attributes.managed)
					_attributes.managed = false;								
							
				// Width
				if (!_attributes.width) 
					_attributes.width = "100%";				
					
				if (_attributes.width.substring (_attributes.width.length - 1) == "%")
				{
					_attributes.widthType = "percent";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 1)			
				}
				else
				{
					_attributes.widthType = "pixel";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 2)
				}						
										
				// Icon
				if (!_attributes.icon)
				{
					_attributes.icon = false;
				}
				else
				{
					_attributes.iconName = _attributes.icon;
					_attributes.icon = true;
				}	
					
				// IconColor
				if (!_attributes.iconColor)
					_attributes.iconColor = "";	
										
				// Label
				if (!_attributes.label)
					_attributes.label = "BUTTON";	
			
				// Disabled
				if (!_attributes.disabled)
					_attributes.disabled = false;		
					
				// Focus	
				if (!_attributes.focus)
					_attributes.focus = false;
					
				// Active
				if (!_attributes.active)
					_attributes.active = false;
					
				// TabIndex
				if (!_attributes.tabIndex)
					_attributes.tabIndex = 0;
			}
					
			// -------------------------------------
			// setDimensions
			// -------------------------------------
			function setDimensions ()
			{
				if (_temp.initialized)
				{
					var width = 0;
				
					//if (!_attributes.managed && _attributes.widthType != "pixel")
					if (_attributes.widthType != "pixel")
					{
					//	console.log (SNDK.tools.getElementInnerWidth (_elements["container"].parentNode))
						
																													
						width = ((SNDK.tools.getElementInnerWidth (_elements["container"].parentNode) * _attributes.width) / 100);
						
					//	console.log (width)
					}
					else
					{	
						width = _attributes.width ;
					}	
					
					_elements["container"].style.width = width - _temp.cache.containerBoxSize["horizontal"] +"px";
					
					//console.log (_temp.cache.containerBoxSize["horizontal"])
					
				}
			}
			
			// ------------------------------------
			// setFocus
			// ------------------------------------				
			function setFocus ()
			{
				_elements["container"].focus ()
				//setTimeout ( function () { _elements["container"].focus (); }, 2);	
			}	
			
			// ------------------------------------
			// setBlur
			// ------------------------------------				
			function setBlur ()
			{
				setTimeout ( function () { _elements["container"].blur (); }, 2);	
			}		
					
			// -------------------------------------
			// keyHandler
			// -------------------------------------
			function keyHandler (event)
			{		
				var key;
				if (!event && window.event) 
				{
					event = window.event;
				}
					
				if (event) 
				{
					key = event.keyCode;
				}
				else
				{
					key = event.which;	
				}
				
				if (key == 13)						// Enter			
				{
					eventOnKeyPressEnter ();
				}		
			 }
		
			// ------------------------------------
			// Public functions
			// ------------------------------------
			// ------------------------------------
			// refresh
			// ------------------------------------				
			function functionRefresh ()
			{
				refresh ();
			}		
			
			// ------------------------------------
			// dispose
			// ------------------------------------				
			function functionDispose ()
			{
				dispose ();
			}	
				
			// ------------------------------------
			// getAttribute
			// ------------------------------------						
			function functionGetAttribute (attribute)
			{
				switch (attribute)
				{
					case "id":
					{
						return _attributes[attribute];
					}
					
					case "tag":
					{
						return _attributes[attribute];
					}
					
					case "stylesheet":
					{
						return _attributes[attribute];
					}
					
					case "width":
					{
						if (_attributes.widthType == "percent")
						{
							return _attributes.width + "%";
						}
		
						if (_attributes.widthType == "pixel")
						{
							return _attributes.width + "px";
						}
					}
					
					case "height":
					{
						if (_attributes.heightType == "percent")
						{
							return _attributes.height + "%";
						}
		
						if (_attributes.heightType == "pixel")
						{
							return _attributes.height + "px";
						}
					}
					
					case "appendTo":
					{
						return _attributes[attribute];			
					}			
					
					case "managed":
					{
						return _attributes[attribute];			
					}
		
					case "disabled":
					{
						return _attributes[attribute];			
					}
					
					case "focus":
					{
						return _attributes[attribute];			
					}
		
					case "onFocus":
					{
						return _attributes[attribute];			
					}
		
					case "onBlur":
					{
						return _attributes[attribute];			
					}
		
					case "onClick":
					{
						return _attributes[attribute];			
					}
		
					case "label":
					{
						return _attributes[attribute];			
					}
					
					case "tabIndex":
					{
						return _attributes[attribute];
					}
							
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}
			
			// ------------------------------------
			// setAttribute
			// ------------------------------------						
			function functionSetAttribute (attribute, value)
			{
				switch (attribute)
				{
					case "id":
					{
						throw "Attribute with name ID is ready only.";
						break;
					}
					
					case "tag":
					{
						_attributes[attribute] = value;
						break;
					}
					
					case "stylesheet":
					{
						_attributes[attribute] = value;
						break;				
					}
					
					case "width":
					{
						if (value.substring (value.width.length, 3) == "%")
						{
							_attributes.widthType = "percent";
							_attributes.width = value.width.substring (0, value.width.length - 1)			
						}
						else
						{
							_attributes.widthType = "pixel";
							_attributes.width = value.width.substring (0, value.width.length - 2)
						}	
						break;			
					}
		
					case "height":
					{
						throw "Attribute with name HEIGHT is ready only.";
						break;			
					}
		
					
					case "appendTo":
					{
						_attributes[attribute] = value;	
						_attributes.appendTo.appendChild (_elements["container"]);			
						break;
					}			
					
					case "managed":
					{
						_attributes[attribute] = value;
		
						if (value)
						{
							window.removeEvent (window, 'SUIREFRESH', refresh);		
						}
						else
						{
							window.addEvent (window, 'SUIREFRESH', refresh);
						}
		
						break;
					}
		
					case "disabled":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
					
					case "focus":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
		
					case "onFocus":
					{
						_attributes[attribute] = value;
						break;
					}
		
					case "onBlur":
					{
						_attributes[attribute] = value;
						break;
					}
		
					case "onClick":
					{
						_attributes[attribute] = value;
						break;
					}
		
					case "label":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
					
					case "tabIndex":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}			
							
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}				
										
			// ------------------------------------
			// Events
			// ------------------------------------
			// ------------------------------------
			// eventOnKeyUp
			// ------------------------------------	
			function eventOnKeyUp (event)
			{
				keyHandler(event);
			}
		
			// ------------------------------------
			// eventOnKeyDown
			// ------------------------------------	
			function eventOnKeyDown (event)
			{
				keyHandler (event);
			}
				
			// ------------------------------------
			// eventOnEnter
			// ------------------------------------	
			function eventOnKeyPressEnter ()
			{	
				if (!attributes.disabled)
				{
					_attributes.active = true;
					refresh ();		
				}	
			}
		
			// ------------------------------------
			// onFocus
			// ------------------------------------		
			function eventOnFocus ()
			{
				if (!_attributes.disabled)
				{
					if (!_attributes.focus)
					{
						_attributes.focus = true;
						refresh ();
						
						if (_attributes.onFocus != null)
						{
							setTimeout( function () { _attributes.onFocus (_attributes.name); }, 1);
						}					
					}		
				}
			}
			
			// ------------------------------------
			// onBlur
			// ------------------------------------		
			function eventOnBlur ()
			{
				if (!_attributes.disabled)
				{
					if (_attributes.focus)
					{				
						_attributes.focus = false;
						refresh ();
		
						if (_attributes.onBlur != null)
						{
							setTimeout( function () { _attributes.onBlur (_attributes.name); }, 1);
						}									
					}
				}
			}
			
			// ------------------------------------
			// onMouseOver
			// ------------------------------------	
			function eventOnMouseOver ()
			{
				if (!_attributes.disabled)
				{		
					_temp.mouseOver = true;
					refresh ();
				}
			}	
			
			// ------------------------------------
			// onMouseOut
			// ------------------------------------	
			function eventOnMouseOut ()
			{
				if (!_attributes.disabled)
				{
					if (_temp.mouseDown)
					{		
						_temp.mouseOver = false;
						_temp.mouseDown = false;				
						refresh ();
					}	
				}
			}	
			
			// ------------------------------------
			// onMouseDown
			// ------------------------------------		
			function eventOnMouseDown ()
			{
				if (!_attributes.disabled)
				{
					_attributes.focus = true;
					_temp.mouseDown = true;				
					refresh ();
				}
			}				
			
			// ------------------------------------
			// onMouseUp
			// ------------------------------------	
			function eventOnMouseUp ()
			{
				if (!_attributes.disabled)
				{
					if (_temp.mouseDown)
					{
						_temp.mouseDown = false;
						refresh ();
						
						eventOnClick ();
					}						
				}
			}
			
			// ------------------------------------
			// onClick
			// ------------------------------------	
			function eventOnClick ()
			{		
				if (_attributes.onClick != null)
				{
					setTimeout( function () { _attributes.onClick (_attributes.name); }, 1);
				}
			}
			
			// ------------------------------------
			// onDrag
			// ------------------------------------		
			function eventOnDrag ()
			{
				return false;
			}			
		},
	
		// -------------------------------------------------------------------------------------------------------------------------
		// dropbox ([attributes])
		// -------------------------------------------------------------------------------------------------------------------------
		//
		// .dispose ()
		
		// .addItem ({label, value})
		//
		// .getAttribute (string)
		// .setAttribute (string, string)
		//	
		// 	id 		get
		//	tag		get/set
		//	stylesheet	get/set
		//	managed		get/set
		//	appendTo	get/set
		//	width		get/set
		//	height		set
		//	disabled	get/set
		//	onFocus		get/set
		//	onBlur		get/set
		//	onChange	get/set
		//	selectedItem	get/set
		//
		//
		// CHANGELOG:
		//
		// v1.02:
		//	- Fixed so that itemlist is drawn not to the document but the actual parent element.
		//	- Fixed dimension calculations, should be ok now.
		//	- Added managed mode.
		//
		// v1.01: 
		//	- Fixed width caluclation. Now works with percentage.
		//	- Added a way to tell if default value is still selected.
		//	- Itemlist is now rendered in the page document, and ontop of every other element.
		//	- Code cleanup.
		//
		// v1.00:
		//	- Initial release.
		/**
		 * @constructor
		 */ 
		dropbox : function (attributes)
		{
			var _elements = new  Array ();
			var _attributes = attributes;
					
			var _temp = 	{ initialized: false,		
					  selectedItem: -1,	  
			 	 	  itemListVisible: false,
					  noPrevSelection: true,
					  cache: new Array ()
					};
		
			_attributes.id = SNDK.tools.newGuid ()
		
			setAttributes ();
		
			// Private functions
			this._attributes = _attributes;
			this._elements = _elements;
			this._temp = _temp;	
			this._init = init;
		
		
			// Functions		
			this.type = "DROPBOX";
			this.refresh = functionRefresh;
			this.dispose = functionDispose;
			this.addItem = functionAddItem;	
			this.selectItemByTitle = functionSelectItemByTitle;
			this.selectItemByValue = functionSelectItemByValue;
			this.getAttribute = functionGetAttribute;
			this.setAttribute = functionSetAttribute;	
			
			this.setSelectedItemByTitle = functionSelectItemByTitle;
			this.setSelectedItemByValue = functionSelectItemByValue;
		
			// Construct
			construct ();
			
			// Initialize
			SNDK.SUI.addInit (this);	
		
			// ------------------------------------
			// Private functions
			// ------------------------------------
			function init ()
			{
				updateCache ();
		
				_attributes.heightType = "pixel";
				_attributes.height = _temp.cache["containerPadding"]["vertical"] + _temp.cache["containerHeight"] +"px";		
				
				_attributes.appendTo.appendChild (_elements["itemlistcontainer"])
			}
			
			// ------------------------------------
			// construct
			// ------------------------------------
			function construct ()
			{	
				// Container
				_elements["container"] = SNDK.tools.newElement ("div", {});
				_elements["container"].setAttribute ("id", _attributes.id);	
				_elements["container"].className = _attributes.stylesheet;
				//_elements["container"].style.position = "relative";		
			
				// Control Left
				_elements["left"] = SNDK.tools.newElement ("div", "Left", null, _elements["container"]);
		
				// Control Center
				_elements["center"] = SNDK.tools.newElement ("div", "Center", null, _elements["container"]);
		
				// Control Right
				_elements["right"] = SNDK.tools.newElement ("div", "Right", null, _elements["container"]);
		
				// Control Input
				_elements["legacy"] = SNDK.tools.newElement ("input", {className: "Input", type: "hidden", appendTo: _elements["container"]});		
				_elements["legacy"].setAttribute ("name", _attributes.name);
		
				// Control Text
				_elements["text"] = SNDK.tools.newElement ("div", "Text", null, _elements["center"]);
				_elements["text"].style.overflow = "hidden";
				_elements["text"].style.whiteSpace = "nowrap";
				SNDK.tools.textSelectionDisable (_elements["text"]);
		
				// Itemlist Container
				_elements["itemlistcontainer"] = SNDK.tools.newElement ("div", {className: "SUIDropbox"});
				_elements["itemlistcontainer"].style.position = "absolute";
				_elements["itemlistcontainer"].style.display = "none";
				_elements["itemlistcontainer"].style.zIndex = 1000;
				_elements["itemlistcontainer"].style.border = "none";		
		
				// Control Itemlist
				_elements["itemlist"] = SNDK.tools.newElement ("div", {className: "SUIDropbox ItemList", appendTo: _elements["itemlistcontainer"]});
				//_elements["itemlist"].style.display = "none";
		
				// Control Arrow
				_elements["arrow"] = SNDK.tools.newElement ("div", "Arrow", null, _elements["center"]);
		
				// Hook Events
				_elements["container"].onfocus = eventOnFocus;
				_elements["container"].onblur = eventOnBlur;
				_elements["container"].onkeypress = eventOnKeyPress;
				_elements["container"].onclick = eventOnClick;
				
				window.addEvent (window, 'SUIREFRESH', refresh);	
			}
		
			// ------------------------------------
			// refresh
			// ------------------------------------
			function refresh ()
			{
				if (_temp.initialized)
				{
					if (_attributes.disabled)
					{				
						_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet+"Disabled";
						_elements["container"].removeAttribute("tabIndex");
						_attributes.focus = false;
						eventOnBlur ();				
					}
					else
					{
						_elements["container"].setAttribute("tabIndex", 0);
					
						if (_attributes.focus)
						{
							_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet+"Focus";
							setFocus ();
						}
						else
						{
							if (_temp.itemListVisible)
							{
								toggleItemList ();
							}
						
							_elements["container"].className = _attributes.stylesheet;
						}
					}
		
					_elements["items"] = new Array ();
					_elements["itemlist"].innerHTML = "";
					for (index in _attributes.items)
					{
						_elements["items"][index] = SNDK.tools.newElement ("div", "Item", _attributes.id +"_"+ index, _elements["itemlist"]);
						_elements["items"][index].innerHTML = _attributes.items[index].label;
						_elements["items"][index].onmouseover = eventOnMouseOverItem;
						_elements["items"][index].onmouseout = eventOnMouseOutItem;
						_elements["items"][index].onmousedown = eventOnClickItem;
					}					
					
					if (_attributes.selectedItem != -1)
					{
						_elements["text"].innerHTML = _attributes.items[_attributes.selectedItem].label;
						_elements["legacy"].value = _attributes.items[_attributes.selectedItem].value;
						_elements["items"][_attributes.selectedItem].className = "Item ItemSelected";
					}			
				}
					
				setDimensions ();
			}
			
			function dispose ()
			{
				window.removeEvent (window, 'SUIREFRESH', refresh)
			}
			
			function functionDispose ()
			{		
				dispose ();
			}
			
			// ------------------------------------
			// updateCache
			// ------------------------------------		
			function updateCache ()
			{
				if (!_temp.cacheUpdated)
				{
					_temp.cache["containerMargin"] = SNDK.tools.getElementStyledMargin (_elements["container"]);
					
					_temp.cache["containerPadding"] = SNDK.tools.getElementStyledPadding (_elements["container"]);
					_temp.cache["containerWidth"] = (SNDK.tools.getElementStyledWidth (_elements["left"]) + SNDK.tools.getElementStyledWidth (_elements["right"]));
					_temp.cache["containerHeight"] = SNDK.tools.getElementStyledHeight (_elements["center"]);
					
					_temp.cache["itemlistPadding"] = SNDK.tools.getElementStyledPadding (_elements["itemlist"]);
				}
				
				_temp.cacheUpdated = true;	
			}		
		
			// ------------------------------------
			// setAttributes
			// ------------------------------------
			function setAttributes ()
			{	
				// Stylesheet
				if (!_attributes.stylesheet)
					_attributes.stylesheet = "SUIDropbox"
		
				if (!_attributes.name)
					_attributes.name = ""
		
				// Managed
				if (!_attributes.managed)		
					_attributes.managed = false;	
			
				// Width
				if (!_attributes.width) 
					_attributes.width = "100px";				
					
				if (_attributes.width.substring (_attributes.width.length - 1) == "%")
				{
					_attributes.widthType = "percent";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 1)			
				}
				else
				{
					_attributes.widthType = "pixel";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 2)
				}
						
				// Disabled
				if (!_attributes.disabled)
					_attributes.disabled = false
			
				// Focus
				if (!_attributes.focus)
					_attributes.focus = false;
					
				// onFocus
				if (!_attributes.onFocus)
					_attributes.onFocus = null;	
					
				// onBlur
				if (!_attributes.onBlur)
					_attributes.onBlur = null;	
		
				// onChange
				if (!_attributes.onChange)
					_attributes.onChange = null;		
					
				// Items
				if (!_attributes.items)
				{
					_attributes.items = new Array ();
				}		
				// SelectedItem
				if (!_attributes.selectedItem)
					_attributes.selectedItem = -1;
			}
		
			// ------------------------------------
			// setDimensions
			// ------------------------------------
			function setDimensions ()
			{
				if (_temp.initialized)
				{					
					var width = {};
					
					if (!_attributes.managed && _attributes.widthType != "pixel")
					{					
						width.container = ((SNDK.tools.getElementInnerWidth (_elements["container"].parentNode) * _attributes.width) / 100) - _temp.cache.containerPadding["horizontal"];
					}
					else
					{			
						if (_attributes.managed && _attributes.widthType == "percent")
						{
							width.container = _attributes.managedWidth - _temp.cache.containerPadding["horizontal"];
						}
						else
						{
							width.container = _attributes.width - _temp.cache.containerPadding["horizontal"];
						}			
					}	
					
					width.center = width.container - _temp.cache.containerWidth;
					width.itemlist = width.container - _temp.cache.itemlistPadding["horizontal"];
		
					_elements["container"].style.width = width.container +"px";
					_elements["center"].style.width = width.center +"px";
					_elements["itemlist"].style.width = width.itemlist  +"px";
					
					var pos = SNDK.tools.getElementPosition (_elements["container"], true)
		
					_elements["itemlistcontainer"].style.left = pos[0] - _temp.cache.containerMargin.left + "px";
					_elements["itemlistcontainer"].style.top = pos[1] + _temp.cache["containerHeight"] - _temp.cache.containerMargin.top + "px";
				}
			}
					
			// ------------------------------------
			// setFocus
			// ------------------------------------
			function setFocus ()
			{
				setTimeout ( function () { _elements["container"].focus (); }, 2);					
			}		
			
			// ------------------------------------	
			// setItemListFocus 
			// ------------------------------------
			function setItemListFocus (index)
			{
				if (_temp.selectedItem != -1)
				{
					if (_temp.selectedItem != _attributes.selectedItem)
					{
						_elements["items"][_temp.selectedItem].className = "Item";
					}
					else
					{
						_elements["items"][_temp.selectedItem].className = "Item ItemSelected";
					}
				}
				
				if (index != -1 && index != null)
				{
					_elements["items"][index].className = "Item ItemFocus";
					_temp.selectedItem = parseInt (index);
				}						
			}		
				
				
			// ------------------------------------
			// setSelectedItem
			// ------------------------------------
			function setSelectedItem (index)
			{
				if (_temp.initialized)
				{
					if (_attributes.selectedItem != index)
					{
						if ((index >= 0) || (index < _attributes.items.length))
						{
							_elements["items"][index].className = "Item ItemSelected";
							if (_attributes.selectedItem != -1)
							{
								_elements["items"][_attributes.selectedItem].className = "Item";
							}
			
							_attributes.selectedItem = parseInt (index);
							
							refresh ();
								
							eventOnChange ();
						}
					}
				}
				else
				{		
					_attributes.selectedItem = index;
				}
			}	
			
			// ------------------------------------
			// toggleItemList
			// ------------------------------------
			function toggleItemList ()
			{
				if (_temp.itemListVisible == false)
				{
		
					SNDK.page.hasFocus = false;
		
					_elements["itemlistcontainer"].style.display = "block";
					_temp.itemListVisible = true;
					
					if (_attributes.selectedItem != -1)
					{
						_temp.selectedItem = _attributes.selectedItem;			
						_temp.noPrevSelection = false;
					}
					else
					{
						_temp.selectedItem = -1;
						_temp.noPrevSelection = true;
					}			
				}
				else
				{
					_elements["itemlistcontainer"].style.display = "none";
					_temp.itemListVisible = false;
		
					SNDK.page.hasFocus = true;
				}
			}
		
			// -------------------------------------
			// keyhandler
			// -------------------------------------
			function keyHandler (event)
			{
				var key;
				if (!event && window.event)
				{
					event = window.event;
				}
		
				if (event)
				{
					key = event.keyCode;
				}
				else
				{
					key = event.which;
				}
		
				if (key == 13)						// Enter
				{
					eventOnKeyPressEnter ();
				}
				else if (key == 27)					// ESC
				{
					eventOnKeyPressEsc ();
				}
				else if (key == 38)					// ArrowUp
				{
					eventOnKeyPressArrowUp ();
				}
				else if (key == 40)					// ArrowDown
				{
					eventOnKeyPressArrowDown ();
				}
			 }	
			
			// ------------------------------------
			// Public functions
			// ------------------------------------		
			// ------------------------------------
			// refresh
			// ------------------------------------				
			function functionRefresh ()
			{
				refresh ();
			}	
			
			function functionDispose ()
			{
				dispose ();
			}
				
			// ------------------------------------
			// addItem
			// ------------------------------------
			function functionAddItem (item)
			{
				_attributes.items[_attributes.items.length] = item;
				refresh ()
			}
			
			// ------------------------------------
			// selectItemByTitle
			// ------------------------------------
			function functionSelectItemByTitle (title)
			{
				for (index in _attributes.items)
				{
					if (_attributes.items[index][1] == title)
					{
						setSelectedItem (index)
					}
				}
			}
		
			// ------------------------------------
			// selectItemByValue
			// ------------------------------------
			function functionSelectItemByValue (value)
			{
				for (index in _attributes.items)
				{
					if (_attributes.items[index][0] == value)
					{
						setSelectedItem (index);
					}
				}
			}
			
			// ------------------------------------
			// getAttribute
			// ------------------------------------						
			function functionGetAttribute (attribute)
			{
				switch (attribute)
				{
					case "id":
					{
						return _attributes[attribute];
					}
					
					case "tag":
					{
						return _attributes[attribute];
					}
					
					case "name":
					{
						return _attributes[attribute];
					}
		
					case "stylesheet":
					{
						return _attributes[attribute];
					}
					
					case "width":
					{
						if (_attributes.widthType == "percent")
						{
							return _attributes.width + "%";
						}
		
						if (_attributes.widthType == "pixel")
						{
							return _attributes.width + "px";
						}
					}
					
					case "height":
					{
						if (_attributes.heightType == "percent")
						{
							return _attributes.height + "%";
						}
		
						if (_attributes.heightType == "pixel")
						{
							return _attributes.height + "px";
						}
					}
					
					case "appendTo":
					{
						return _attributes[attribute];			
					}			
					
					case "managed":
					{
						return _attributes[attribute];			
					}
		
					case "disabled":
					{
						return _attributes[attribute];			
					}
					
					case "focus":
					{
						return _attributes[attribute];			
					}
		
					case "onFocus":
					{
						return _attributes[attribute];			
					}
		
					case "onBlur":
					{
						return _attributes[attribute];			
					}
		
					case "onChange":
					{
						return _attributes[attribute];			
					}
		
					case "selectedItem":
					{
						return _attributes.items[_attributes.selectedItem];
					}
							
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}
			}
			
			// ------------------------------------
			// setAttribute
			// ------------------------------------						
			function functionSetAttribute (attribute, value)
			{
				switch (attribute)
				{
					case "id":
					{
						throw "Attribute with name ID is ready only.";
						break;
					}
					
					case "tag":
					{
						_attributes[attribute] = value;
						break;
					}
					
					case "name":
					{
						_attributes[attribute] = value;
						break;
					}
		
					case "stylesheet":
					{
						_attributes[attribute] = value;
						break;				
					}
					
					case "width":
					{
						if (value.substring (value.width.length, 3) == "%")
						{
							_attributes.widthType = "percent";
							_attributes.width = value.width.substring (0, value.width.length - 1)			
						}
						else
						{
							_attributes.widthType = "pixel";
							_attributes.width = value.width.substring (0, value.width.length - 2)
						}	
						break;			
					}
					
					case "height":
					{
						throw "Attribute with name HEIGHT is ready only.";
						break;			
					}			
					
					case "appendTo":
					{
						_attributes[attribute] = value;	
						_attributes.appendTo.appendChild (_elements["container"]);			
						break;
					}			
					
					case "managed":
					{
						_attributes[attribute] = value;
		
						if (value)
						{
							window.removeEvent (window, 'SUIREFRESH', refresh);		
						}
						else
						{
							window.addEvent (window, 'SUIREFRESH', refresh);
						}
		
						break;
					}
		
					case "disabled":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
					
					case "focus":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
		
					case "onFocus":
					{
						_attributes[attribute] = value;
						break;
					}
		
					case "onBlur":
					{
						_attributes[attribute] = value;
						break;
					}
		
					case "onChange":
					{
						_attributes[attribute] = value;
						break;
					}
		
					case "selectedItemByValue":
					{							
						for (index in _attributes.items)
						{				
							if (_attributes.items[index].value == value)
							{
								setSelectedItem (index);
								break;
							}
						}
						break;
					}			
							
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}				
		
			// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
			// Events				
			// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
			// ------------------------------------
			// onKeyPress
			// ------------------------------------
			function eventOnKeyPress (event)
			{
				keyHandler(event);
			}
		
			// ------------------------------------
			// onKeyPressEnter
			// ------------------------------------
			function eventOnKeyPressEnter ()
			{
				if (_temp.itemListVisible)
				{
					setSelectedItem (_temp.selectedItem);
				}
				
				toggleItemList ();
			}
		
			// ------------------------------------
			// onKeyUp
			// ------------------------------------
			function eventOnKeyPressArrowUp ()
			{
				if (_temp.itemListVisible)
				{
					var index = _attributes.items.length - 1;
				
					if (_temp.selectedItem > 0)
					{
						index = _temp.selectedItem - 1; 			
					}					
		
					setItemListFocus (index);
				}
				else
				{
					var index = _attributes.items.length - 1;
				
					if (_attributes.selectedItem > 0)
					{
						index = _attributes.selectedItem - 1; 			
					}					
		
					setSelectedItem (index);
				}
				
			}
		
			// ------------------------------------
			// onKeyDown
			// ------------------------------------
			function eventOnKeyPressArrowDown ()
			{
				if (_temp.itemListVisible)
				{
					var index = 0;
		
					if (_temp.selectedItem < _attributes.items.length-1)
					{
						index = (_temp.selectedItem + 1); 
					}
					
					setItemListFocus (index);
				}
				else
				{
					var index = 0;
					
					if (_attributes.selectedItem < _attributes.items.length-1)
					{
						index = _attributes.selectedItem + 1; 
					}
					
					setSelectedItem (index);		
				}	
			}
		
			// ------------------------------------
			// onKeyPressEsc
			// ------------------------------------
			function eventOnKeyPressEsc ()
			{
				if (_temp.itemListVisible)
				{			
					if (_temp.selectedItem != -1)		
					{
						_elements["items"][_temp.selectedItem].className = "Item";
					}
					
					if (_attributes.selectedItem != -1)
					{
						_elements["items"][_attributes.selectedItem].className = "Item ItemSelected";
					}
							
					toggleItemList ();
				}
			}
		
			// ------------------------------------
			// onFocus
			// ------------------------------------
			function eventOnFocus ()
			{
				if (!_attributes.disabled)
				{
					if (!_attributes.focus)
					{
						_attributes.focus = true;
						refresh ();
					
						if (_attributes.onFocus != null)
						{
							setTimeout( function ()	{ _attributes.onFocus (_name); }, 1);
						}
					}
				}
			}
		
			// ------------------------------------
			// onBlur
			// ------------------------------------
			function eventOnBlur ()
			{
				if (!_attributes.disabled)
				{
					if (_attributes.focus)
					{
						_attributes.focus = false;
						refresh ();
		
						if (_attributes.onBlur != null)
						{
							setTimeout( function ()	{ _attributes.onBlur (_name); }, 1);
						}
					}
				}
			}
		
			// ------------------------------------
			// onClick
			// ------------------------------------
			function eventOnClick ()
			{
				if (!_attributes.disabled)
				{
					toggleItemList ();
				}
			}
		
			// ------------------------------------
			// onClickItem
			// ------------------------------------
			function eventOnClickItem (event)
			{
				if (!_attributes.disabled)
				{	
		
					if (client.browser == "Explorer")
					{
						window.event.cancelBubble = true
					}
					else
					{
						event.stopPropagation ();
					}
		
					var split = this.id.split("_");
					var index = split[split.length-1];		
					
					setSelectedItem (index);
					toggleItemList ();
				}
			}
		
			// ------------------------------------
			// onChange
			// ------------------------------------
			function eventOnChange ()
			{
				if (_attributes.onChange != null)
				{
					setTimeout( function ()	{ _attributes.onChange (); }, 0);
				}
			}
					
			// ------------------------------------
			// onMouseOverItem
			// ------------------------------------
			function eventOnMouseOverItem ()
			{
				var split = this.id.split("_");
				var index = split[split.length-1];
		
				setItemListFocus (index);
			}
		
			// ------------------------------------
			// onMouseOutItem
			// ------------------------------------
			function eventOnMouseOutItem ()
			{
				var split = this.id.split("_");
				var index = split[split.length-1];
				
				setItemListFocus ();
			}
		},
	
		// -------------------------------------------------------------------------------------------------------------------------
		// iconview ([attributes])
		// -------------------------------------------------------------------------------------------------------------------------
		//
		//	.addItem (item) 
		//
		//	.refresh ()
		//	.getAttribute (key)
		//	.setAttribute (key, value)
		//
		//		id		get
		//		tag		get/set
		//		stylesheet	get/set
		//		width		get/set
		//		height		get/set
		//		managed		get/set
		//		appendTo	get/set
		//		disabled	get/set
		//		readOnly	get/set
		//		focus		get/set
		//		onFocus		get/set
		//		onBlur		get/set
		//		onChange	get/set
		//
		//
		//
		//
		// .addItem (array)
		// .removeItem (int)
		// .moveItemUp ([int])
		// .moveItemDowm ([int])
		// .moveItemTo (int, int)
		//
		// .id ()
		// .tag (string)
		//
		// .stylesheet (string)
		// .widthType (string)
		// .width (int)
		// .heightType (string)
		// .height (int)
		//
		// .focus (bool)
		// .disabled (bool)
		// .readOnly (bool)
		//
		// .items (array)
		// .selectedIndex (int)
		// .selectedItem ()
		// .count ()
		// .clear ()
		//
		// .onFocus (function)
		// .onBlur (function)
		// .onChange (function)
		// -------------------------------------------------------------------------------------------------------------------------
		/**
		 * @constructor
		 */
		iconview : function (attributes)
		{
			var _elements = new Array ();
			var _attributes = attributes;	
			var _temp = 	{ initialized: false,
					  cache: new Array ()
					};
		
			_attributes.id = SNDK.tools.newGuid ();
			
			setAttributes ();	
			
			// Private functions
			this._attributes = _attributes;
			this._elements = _elements;
			this._temp = _temp;	
			this._init = init;
			
			// Functions
			this.refresh = functionRefresh;
			this.dispose = functionDispose;
			this.getAttribute = functionGetAttribute;
			this.setAttribute = functionSetAttribute;
			
			// Construct
			construct ();
										
			// Initialize
			SNDK.SUI.addInit (this);	
			
			// Functions
		//	this.addItem = functionAddItem;
		//	this.removeItem = functionRemoveItem;
		//	this.moveItemUp = functionMoveItemUp;
		//	this.moveItemDown = functionMoveItemDown;
		//	this.moveItemTo = functionMoveItemTo;
							
			// Set/Get		
		//	this.id = getsetId;
		//	this.tag = getsetTag;
							
		//	this.stylesheet = getsetStylesheet;
		//	this.widthType = getsetWidthType;	
		//	this.width = getsetWidth;
		//	this.heightType = getsetHeightType;		
		//	this.height = getsetHeight;
		
		//	this.focus = getsetFocus;
		//	this.disabled = getsetDisabled;		
		//	this.readOnly = getsetReadOnly;
			
		//	this.items = getsetItems;
		//	this.selectedIndex = getsetSelectedIndex;
		//	this.selectedItem = getsetSelectedItem;
		//	this.count = getsetCount;
		//	this.clear = getsetClear;
		
		//	this.onFocus = getsetOnFocus;
		//	this.onBlur = getsetOnBlur;
		//	this.onChange = getsetOnChange;
					
			// Initialize
			
				
			// ------------------------------------
			// Private functions
			// ------------------------------------
			// ------------------------------------
			// init
			// ------------------------------------
			function init ()
			{
				updateCache ();
			}
			
			// ------------------------------------
			// contruct
			// ------------------------------------
			function construct ()
			{
				// Container
				_elements["container"] = SNDK.tools.newElement ("div", {});
				_elements["container"].setAttribute ("id", _attributes.id);		
				_elements["container"].className = _attributes.stylesheet;		
															
				// Top
				_elements["top"] = SNDK.tools.newElement ("div", null, null, _elements["container"]);
		
				// TopLeft
				_elements["topleft"] = SNDK.tools.newElement ("div", "TopLeft", null, _elements["top"]);
					
				// TopCenter
				_elements["topcenter"] = SNDK.tools.newElement ("div", "TopCenter", null, _elements["top"]);
				_elements["topcenter"].style.overflow = "hidden";
								
				// TopRight
				_elements["topright"] = SNDK.tools.newElement ("div", "TopRight", null, _elements["top"]);
							// Disabled
				if (_attributes.disabled == null)
					_attributes.disabled = _defaults.disabled;					
				// Content
				_elements["content"] = SNDK.tools.newElement ("div", null, null, _elements["container"]);
				_elements["content"].style.clear = "both";			
					
				// ContentLeft
				_elements["contentleft"] = SNDK.tools.newElement ("div", "ContentLeft", null, _elements["content"]);
							
				// ContentCenter
				_elements["contentcenter"] = SNDK.tools.newElement ("div", "ContentCenter", null, _elements["content"]);		
				_elements["contentcenter"].style.overflow = "auto";
																												
				// ContentRight
				_elements["contentright"] = SNDK.tools.newElement ("div", "ContentRight", null, _elements["content"]);
				
				// Bottom	
				_elements["bottom"] = SNDK.tools.newElement ("div", null, null, _elements["container"]);
				_elements["bottom"].style.clear = "both";		
								
				// BottomLeft
				_elements["bottomleft"] = SNDK.tools.newElement ("div", "BottomLeft", null, _elements["bottom"]);	
		
				// BottomCenter
				_elements["bottomcenter"] = SNDK.tools.newElement ("div", "BottomCenter", null, _elements["bottom"]);
					
				// BottomRight
				_elements["bottomright"] = SNDK.tools.newElement ("div", "BottomRight", null, _elements["bottom"]);
					
				// Hook Events
				_elements["contentcenter"].onfocus = eventOnFocus;
				_elements["contentcenter"].onblur = eventOnBlur;
						
				window.addEvent (window, 'SUIREFRESH', refresh);			
			}	
				
			// ------------------------------------
			// refresh
			// ------------------------------------		
			function refresh ()
			{		
				if (_temp.initialized)
				{
					if (_attributes.disabled)
					{
						_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"Disabled";
						_elements["contentcenter"].removeAttribute("tabIndex");
						
						for (index in _elements["items"])
						{
							SNDK.tools.opacityChange (_elements["items"][index], 40);
						}				
					} 
					else
					{			
						_elements["contentcenter"].setAttribute("tabIndex", 0);
						
						if (_attributes.focus)
						{
							_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"Focus";
							setFocus ();
						}
						else
						{
							_elements["container"].className = _attributes.stylesheet;
						}						
					}	
				}		
		
				setDimensions ();
				
				if (_temp.initialized)
				{
					drawItems ();
				}
			}
			
			function functionDispose ()
			{		
				window.removeEvent (window, 'SUIREFRESH', refresh);	
			}
				
			// ------------------------------------
			// updateCache
			// ------------------------------------		
			function updateCache ()
			{
				if (!_temp.cacheUpdated)
				{
					_temp.cache["containerPadding"] = SNDK.tools.getElementStyledPadding (_elements["container"]);
					_temp.cache["containerWidth"] = SNDK.tools.getElementStyledWidth (_elements["topleft"]) + SNDK.tools.getElementStyledWidth (_elements["topright"]);
					_temp.cache["containerHeight"] = SNDK.tools.getElementStyledHeight (_elements["topleft"]) + SNDK.tools.getElementStyledHeight (_elements["bottomleft"]);
				}
				
				_temp.cacheUpdated = true;	
			}	
		
		
			// ------------------------------------
			// drawItems
			// ------------------------------------							
			function drawItems ()
			{
				if (_temp.initialized)
				{
					_elements["contentcenter"].innerHTML = " ";
					_elements["items"] = new Array ();
		
					for (index in _attributes.items)
					{
						_elements["items"][index] = new SNDK.tools.newElement ("div", {className: "Item", id: _attributes.id +"_"+ index, appendTo: _elements["contentcenter"]});
						SNDK.tools.newElement ("img", {src: _attributes.items[index]["imageURL"], className: "Image", appendTo: _elements["items"][index]});
						
						if (!_attributes.readOnly)
						{
							_elements["items"][index].onclick = eventOnItemClick;
						}				
					}
								
				}
			}
						
			// ------------------------------------
			// setattributes
			// ------------------------------------		
			function setAttributes ()
			{				
				// Stylesheet
				if (!_attributes.stylesheet)
					_attributes.stylesheet = "SUIIconview";			
						
				// Managed
				if (!_attributes.managed) 
					_attributes.managed = false;					
						
				// Width		
				if (!_attributes.width) 
					_attributes.width = "100%";				
					
				if (_attributes.width.substring (_attributes.width.length - 1) == "%")
				{
					_attributes.widthType = "percent";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 1)			
				}
				else
				{
					_attributes.widthType = "pixel";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 2)
				}				
				
				// Height
				if (!_attributes.height) 
					_attributes.height = "100%";				
					
				if (_attributes.height.substring (_attributes.height.length - 1) == "%")
				{
					_attributes.heightType = "percent";
					_attributes.height = _attributes.height.substring (0, _attributes.height.length - 1)			
				}
				else
				{
					_attributes.heightType = "pixel";
					_attributes.height = _attributes.height.substring (0, _attributes.height.length - 2)
				}								
						
				// Disabled
				if (!_attributes.disabled)
					_attributes.disabled = false;
					
				// ReadOnly
				if (!_attributes.readOnly)
					_attributes.readOnly = false;	
					
				// Focus	
				if (!_attributes.focus)
					_attributes.focus = false;
				
				// Items
		//		if (!_attributes.items) 
		//		{
		//			_attributes.items = new Array ();
		//		}
		//		else
		//		{
		//			_attributes.items = derefArray (_attributes.items);
		//		}			
			}	
			
			function derefArray (array)
			{
				var temp = new Array ();
				for (index in array)
				{
					var index2 = temp.length;
					temp[index2] = new Array ();
					for (index3 in array[index])
					{
						temp[index2][index3] = array[index][index3];
					}			
				}
		
				return temp;		
			}		
								
			// ------------------------------------
			// setDimensions
			// ------------------------------------
			function setDimensions ()
			{
				if (_temp.initialized)
				{		
					var width = {};
					var height = {};
					var combinedheightofchildren = 0;
		
					if (!_attributes.managed && _attributes.widthType != "pixel")
					{					
						width.container = ((SNDK.tools.getElementInnerWidth (_elements["container"].parentNode) * _attributes.width) / 100) - _temp.cache.containerPadding["horizontal"];
					}
					else
					{			
						if (_attributes.managed && _attributes.widthType == "percent")
						{
		
							width.container = _attributes.managedWidth - _temp.cache.containerPadding["horizontal"];
						}
						else
						{
							width.container = _attributes.width - _temp.cache.containerPadding["horizontal"];
						}			
					}	
		
		
					if (!_attributes.managed && _attributes.heightType != "pixel")
					{					
						height.container = ((SNDK.tools.getElementInnerHeight (_elements["container"].parentNode) * _attributes.height) / 100) - _temp.cache.containerPadding["vertical"];
					}
					else
					{			
						if (_attributes.managed && _attributes.heightType == "percent")
						{
							height.container = _attributes.managedHeight - _temp.cache.containerPadding["vertical"];				
						}
						else
						{
							height.container = _attributes.height - _temp.cache.containerPadding["vertical"];
						}			
					}	
								
					width.topCenter = width.container - _temp.cache.containerWidth;
					width.contentCenter = width.container - _temp.cache.containerWidth;
					width.bottomCenter = width.container - _temp.cache.containerWidth;
					
					height.contentLeft = height.container - _temp.cache.containerHeight;
					height.contentCenter = height.container - _temp.cache.containerHeight;
					height.contentRight = height.container - _temp.cache.containerHeight;
		
					
					_elements["container"].style.width = width.container + "px";
					_elements["topcenter"].style.width = width.topCenter + "px";
					_elements["contentcenter"].style.width = width.contentCenter +"px";
					_elements["bottomcenter"].style.width = width.bottomCenter +"px";
								
					_elements["container"].style.height = height.container + "px";
					_elements["contentleft"].style.height = height.contentLeft + "px";
					_elements["contentcenter"].style.height = height.contentCenter +"px";
					_elements["contentright"].style.height = height.contentRight +"px";				
				}		
			}
			
			function setDimensions2 ()
			{		
				// Set width		
				var topleftwidth = SNDK.tools.getStyle (_elements["topleft"], "width");
				var topleftmarginleft = SNDK.tools.getStyle (_elements["topleft"], "margin-left");
				var toprightwidth = SNDK.tools.getStyle (_elements["topright"], "width");		
				var toprightmarginright = SNDK.tools.getStyle (_elements["topright"], "margin-right");			
		
				var headermarginleft = 0;
				var headermarginright = 0;			
				for (index in _attributes.columns)
				{
					if (_attributes.columns[index][2])
					{
						headermarginleft = SNDK.tools.getStyle (_elements["columnheaders"][index], "margin-left");
				 		headermarginright = SNDK.tools.getStyle (_elements["columnheaders"][index], "margin-right"); 
					}
				}
									
				var containerwidth = (parseInt (topleftwidth)) + (parseInt (topleftmarginleft)) + (parseInt (toprightwidth)) + (parseInt (toprightmarginright)); 
					
				if (_attributes.widthType == "percent")
				{
					_elements["container"].style.width = "100%";
					_elements["container"].style.height = "100%";				
		
					var pagesize = SNDK.tools.getPageSize ();
					if (_temp.pageSizeX == null || _temp.pageSizeY == null)
					{
						_temp.pageSizeX = pagesize[0];
						_temp.pageSizeY = pagesize[1];
					}
		
		
						
					setTimeout (	function () 
							{	
		
							if (_temp.pageSizeX != pagesize[0] || _temp.pageSizeY != pagesize[1])
							{
								_elements["topcenter"].style.width = 0 +"px";
								_elements["contentcenter"].style.width = 0 +"px";
								_elements["bottomcenter"].style.width = 0 +"px";
						
								_temp.pageSizeX = pagesize[0];
								_temp.pageSizeY = pagesize[1];				
							}	
							
										
								var h = _elements["container"].offsetHeight
								var w = _elements["container"].offsetWidth
								w = w - containerwidth;
		
								_elements["topcenter"].style.width = w +"px";
								_elements["contentcenter"].style.width = w +"px";
								_elements["bottomcenter"].style.width = w +"px";			
		
								_elements["contentleft"].style.height = _attributes.height +"px";
								_elements["contentcenter"].style.height = _attributes.height +"px";
								_elements["contentright"].style.height = _attributes.height +"px";	
								
												
							}, 0);						
				}
				else
				{
					_elements["topcenter"].style.width = _attributes.width - containerwidth +"px";
					_elements["contentcenter"].style.width = _attributes.width - containerwidth +"px";
					_elements["bottomcenter"].style.width = _attributes.width - containerwidth +"px";			
					_elements["container"].style.width = _attributes.width +"px";
				
		//			var headertotalwidth = 0;
		//			for (index in _attributes.columns)
		//			{
		//				if (_attributes.columns[index][2])
		//				if (_attributes.columns[index].visible)
		//				{
		//					var columnwidth = parseInt (_attributes.columns[index].width);
		//				
		//					headertotalwidth = headertotalwidth + columnwidth + (parseInt (headermarginleft)) + (parseInt (headermarginright));
		//				}
		//			}
							
					_elements["contentleft"].style.height = _attributes.height +"px";
					_elements["contentcenter"].style.height = _attributes.height +"px";
					_elements["contentright"].style.height = _attributes.height +"px";						
				}
			}	
				
			// ------------------------------------
			// setFocus
			// ------------------------------------				
			function setFocus ()
			{
				setTimeout ( function () { _elements["contentcenter"].focus (); }, 2);	
			}		
				
			// ------------------------------------
			// setSelectedItem
			// ------------------------------------		
			function setSelectedItem (index)
			{
				if (_attributes.selectedIndex != -1)
				{
					_elements["items"][_attributes.selectedIndex].className = "Item";
				}
		
				_attributes.selectedIndex = parseInt (index);
		
				if (index != -1)
				{
					_elements["items"][index].className = "Item ItemSelected";
				}
		
				eventOnChange ();
			}	
			
			// ------------------------------------
			// removeItem
			// ------------------------------------					
			function removeItem (index)
			{
				_attributes.items.splice (index, 1);
				_attributes.selectedIndex = -1;
		
				refreshItems ();		
				
				if (index < _attributes.items.length)
				{
					setSelectedItem (index);
				}
				else
				{
					if (index > 0)
					{
						setSelectedItem (index - 1);
					}
					else
					{
						setSelectedItem (-1);
					}
				}
				
				eventOnChange ();
			}	
			
			// ------------------------------------
			// moveItem
			// ------------------------------------						
			function moveItem (index1, index2)
			{
				var temp1 = _attributes.items[index1];
				var temp2 = _attributes.items[index2];
				
				_attributes.items[index1] = temp2;
				_attributes.items[index2] = temp1;
		
				refreshItems ();
				setSelectedItem (index2);
			}
				
			// ------------------------------------
			// Public functions
			// ------------------------------------
			function functionRefresh ()
			{
				refresh ();
			}
			
			// ------------------------------------
			// getAttribute
			// ------------------------------------						
			function functionGetAttribute (attribute)
			{
				switch (attribute)
				{
					case "id":
					{
						return _attributes[attribute];
					}
					
					case "tag":
					{
						return _attributes[attribute];
					}
					
					case "stylesheet":
					{
						return _attributes[attribute];
					}
					
					case "width":
					{
						if (_attributes.widthType == "percent")
						{
							return _attributes.width + "%";
						}
		
						if (_attributes.widthType == "pixel")
						{
							return _attributes.width + "px";
						}
					}
					
					case "height":
					{
						if (_attributes.heightType == "percent")
						{
							return _attributes.height + "%";
						}
		
						if (_attributes.heightType == "pixel")
						{
							return _attributes.height + "px";
						}
					}
					
					case "appendTo":
					{
						return _attributes[attribute];			
					}			
					
					case "managed":
					{
						return _attributes[attribute];			
					}
										
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}
			
			// ------------------------------------
			// setAttribute
			// ------------------------------------						
			function functionSetAttribute (attribute, value)
			{
				switch (attribute)
				{
					case "id":
					{
						throw "Attribute with name ID is ready only.";
						break;
					}
					
					case "tag":
					{
						_attributes[attribute] = value;
						break;
					}
					
					case "stylesheet":
					{
						_attributes[attribute] = value;
						break;				
					}
					
					case "width":
					{
						if (value.substring (value.width.length, 3) == "%")
						{
							_attributes.widthType = "percent";
							_attributes.width = value.width.substring (0, value.width.length - 1)			
						}
						else
						{
							_attributes.widthType = "pixel";
							_attributes.width = value.width.substring (0, value.width.length - 2)
						}	
						break;			
					}
					
					case "appendTo":
					{
						_attributes[attribute] = value;	
						_attributes.appendTo.appendChild (_elements["container"]);			
						break;
					}			
					
					case "managed":
					{
						_attributes[attribute] = value;
		
						if (value)
						{
							window.removeEvent (window, 'SUIREFRESH', refresh);		
						}
						else
						{
							window.addEvent (window, 'SUIREFRESH', refresh);
						}
		
						break;
					}
										
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}										
									
			// ------------------------------------
			// addItem
			// ------------------------------------						
			function functionAddItem (item)
			{
				_attributes.items[_attributes.items.length] = item;
				refreshItems ();
				eventOnChange ();				
			}	
				
			// ------------------------------------
			// removeItem
			// ------------------------------------						
			function functionRemoveItem (index)
			{
				if (index != null)
				{
					removeItem (index);				
				}
				else if (_attributes.selectedIndex >= 0)
				{				
					removeItem (_attributes.selectedIndex);
				}
			}	
		
			// ------------------------------------
			// moveItem
			// ------------------------------------						
			function functionMoveItemTo (index1, index2)
			{		
			}
			
			// ------------------------------------
			// moveItemUp
			// ------------------------------------						
			function functionMoveItemUp (index)
			{
				if (index == null)
				{
					index = attributes.selectedIndex
				}
			
				if (index > 0)
				{
					moveItem (index, index-1);
				}		
			}
			
			// ------------------------------------
			// moveItemDown
			// ------------------------------------						
			function functionMoveItemDown (index)
			{
				if (index == null)
				{
					index = attributes.selectedIndex
				}
		
				if (index < (_attributes.items.length -1))
				{
					moveItem (index, index+1);
				}	
			}		
									
									
			function functionDispose ()
			{
				dispose ();
			}
									
			// ------------------------------------
			// Events
			// ------------------------------------					
			// ------------------------------------
			// onFocus
			// ------------------------------------					
			function eventOnFocus ()
			{
				if (!_attributes.disabled)
				{
					if (!_attributes.focus)
					{
						_attributes.focus = true;
						refresh ();
		
						if (_attributes.onFocus != null)
						{
							setTimeout( function ()	{ _attributes.onFocus (); }, 1);
						}			
					}				
				}
			}
		
			// ------------------------------------
			// onBlur
			// ------------------------------------							
			function eventOnBlur ()
			{
				if (!_attributes.disabled)
				{
					if (_attributes.focus)
					{	
						_attributes.focus = false;
						refresh ();
		
						if (_attributes.onBlur != null)
						{
							setTimeout( function ()	{ _attributes.onBlur (); }, 1);
						}			
					}	
				}
			}
		
			// ------------------------------------
			// onChange
			// ------------------------------------							
			function eventOnChange ()
			{
				if (!_attributes.disabled)
				{		
					if (_attributes.onChange != null)
					{
						setTimeout( function ()	{ _attributes.onChange (); }, 1);
					}			
				}
			}
		
			// ------------------------------------
			// onItemClick
			// ------------------------------------							
			function eventOnItemClick ()
			{
				if (!_attributes.disabled)
				{
					var index = this.id.split("_")[1];
						
					setSelectedItem (index)
									
					if (_attributes.onClick != null)
					{
						setTimeout( function ()	{ _attributes.onClick (); }, 1);
					}							
				}
			}
		
			// ------------------------------------
			// GETSET
			// ------------------------------------
			// ------------------------------------
			// id
			// ------------------------------------					
			function getsetId (value)
			{
				return _id;
			}
		
			// ------------------------------------
			// tag
			// ------------------------------------					
			function getsetTag (value)
			{
				if (value != null)
				{
					_attributes.tag = value
				}
				else
				{
					return _attributes.tag;
				}
			}
									
			// ------------------------------------
			// stylesheeet
			// ------------------------------------					
			function getsetStylesheet (value)
			{
				if (value != null)
				{
					_attributes.stylesheet = value
					refresh ();
				}
				else
				{
					return _attributes.stylesheet;
				}
			}
						
			// ------------------------------------
			// widthType
			// ------------------------------------
			function getsetWidthType (value)
			{
				if (value != null)
				{
					if (value == "percent" || value == "%")
					{
						_attributes.widthType = "percent";
					}
					else if (value == "pixel" || value == "px")
					{
						_attributes.widthType = "pixel";
					}
		
					setattributes ();
					refresh ();
				}
				else
				{
					return _attributes.width;
				}
			}		
				
			// ------------------------------------
			// width
			// ------------------------------------			
			function getsetWidth (value)
			{
				if (value != null)
				{
					_attributes.width = value;
					setattributes ();
					refresh ();
				}
				else			
				{
					return _attributes.widthType;
				}
			}
					
			// ------------------------------------
			// heightType
			// ------------------------------------
			function getsetHeightType (value)
			{
				if (value != null)
				{
					if (value == "percent" || value == "%")
					{
						_attributes.heightType = "percent";
					}
					else if (value == "pixel" || value == "px")
					{
						_attributes.heightType = "pixel";
					}
		
					setattributes ();
					refresh ();
				}
				else
				{
					return _attributes.heightType;
				}
			}		
				
			// ------------------------------------
			// height
			// ------------------------------------			
			function getsetHeight (value)
			{
				if (value != null)
				{
					_attributes.height = value;
					setattributes ();
					refresh ();
				}
				else			
				{
					return _attributes.height;
				}
			}			
			
			// ------------------------------------
			// focus
			// ------------------------------------			
			function getsetFocus (value)
			{
				if (value != null)
				{
					_attributes.focus = value;
					refresh ();
				}
				else
				{
					return _attributes.focus;
				}	
			}																
				
			// ------------------------------------
			// disabled
			// ------------------------------------			
			function getsetDisabled (value)
			{
				if (value != null)
				{
					_attributes.disabled = value;
					refresh ();
				}
				else
				{
					return _attributes.disabled;
				}	
			}	
			
			// ------------------------------------
			// readOnly
			// ------------------------------------			
			function getsetReadOnly (value)
			{
				if (value != null)
				{
					_attributes.readOnly = value;
					refreshItems ();
				}
				else
				{
					return _attributes.readOnly;
				}	
			}		
					
			// ------------------------------------
			// items
			// ------------------------------------			
			function getsetItems (value)
			{
				if (value != null)
				{
					_attributes.items = value;
					refreshItems ();
				}
				else
				{
					return _attributes.items;
				}
			}	
			
			// ------------------------------------
			// selectedIndex
			// ------------------------------------			
			function getsetSelectedIndex (value)
			{
				if (value != null)
				{
					setSelectedItem (value);
				}
				else
				{
					return _attributes.selectedIndex;
				}
			}											
						
			// ------------------------------------
			// selectedItem
			// ------------------------------------			
			function getsetSelectedItem (value)
			{
				if (value != null)
				{
					_attributes.items [_attributes.selectedIndex] = value;
					refreshItems ();
				}
				else
				{
					return _attributes.items [_attributes.selectedIndex];
				}
			}	
			
			// ------------------------------------
			// count
			// ------------------------------------			
			function getsetCount ()
			{	
				return _attributes.items.length;
			}	
			
			// ------------------------------------
			// clear
			// ------------------------------------			
			function getsetClear ()
			{			
				_attributes.items = new Array ();
				_attributes.selectedIndex = -1;
				refreshItems ();
				eventOnChange ();
			}																						
				
			// ------------------------------------
			// onFocus
			// ------------------------------------			
			function getsetOnFocus (value)
			{
				_attributes.onFocus = value;
			}														
		
			// ------------------------------------
			// onBlur
			// ------------------------------------			
			function getsetOnBlur (value)
			{
				_attributes.onBlur = value;
			}				
				
			// ------------------------------------
			// onChange
			// ------------------------------------			
			function getsetOnChange (value)
			{	
				if (value != null)
				{
					_attributes.onChange = value;
				}
				else
				{
					return _attributes.onChange;
				}
			}																								
		},
	
		// -------------------------------------------------------------------------------------------------------------------------
		// textarea ([attributes])
		// -------------------------------------------------------------------------------------------------------------------------
		//
		// .refresh ()
		// .getAttribute (string)
		// .setAttribute (string, string)
		//	
		//	id		get
		//	tag		get/set
		//	stylesheet	get/set
		//	width		get/set
		//	height		get/set
		//	appendTo	get/set			
		//	managed		get/set
		//	value		get/set
		//
		/**
		 * @constructor
		 */
		textarea : function (attributes)
		{
		
			var _elements = new Array ();			
			var _attributes = attributes;	
		
			var _temp =	{ 	initialized: false,
					  		providerInitialized: false,
					  		pageSizeX: 0,
					  		pageSizeY: 0,
					  		cache: new Array ()
						};
																
			_attributes.id = SNDK.tools.newGuid ()	
							
			setAttributes ();
			
			// Private functions
			this._attributes = _attributes;
			this._elements = _elements;
			this._temp = _temp;	
			this._init = init;	
				
			// Functions
			this.refresh = functionRefresh;	
			this.getAttribute = functionGetAttribute;
			this.setAttribute = functionSetAttribute;
			this.dispose = functionDispose;
			
			// Construct
			construct ();
			
			// Initialize	
			SNDK.SUI.addInit (this);
									
			// ------------------------------------
			// Private functions
			// ------------------------------------
			// ------------------------------------
			// init
			// ------------------------------------
			function init ()
			{
				updateCache ();
				
				switch (_attributes.provider)
				{
					case "default":
					{				
						break;
					}
					
					case "codemirror":
					{
						break;
					}
					
					case "tinymce":
					{		
						if (SNDK.SUI.domReady)
						{
						
							_elements["provider"].render ();		
							
							refresh ();
						}
					}
				}
			}
			
			// ------------------------------------
			// construct
			// ------------------------------------
			function construct ()
			{	
				// Container
				_elements["container"] = SNDK.tools.newElement ("div", {});
				_elements["container"].setAttribute ("id", _attributes.id);	
				_elements["container"].className = _attributes.stylesheet;	
				
				// TOP
				_elements["top"] = SNDK.tools.newElement ("div", {appendTo: _elements["container"]});
				_elements["topleft"] = SNDK.tools.newElement ("div", {className: "TopLeft", appendTo: _elements["top"]});
				_elements["topcenter"] = SNDK.tools.newElement ("div", {className: "TopCenter", appendTo: _elements["top"]});
				_elements["topright"] = SNDK.tools.newElement ("div", {className: "TopRight", appendTo: _elements["top"]});		
						
				// CENTER
				_elements["center"] = SNDK.tools.newElement ("div", {appendTo: _elements["container"]});
				_elements["centerleft"] = SNDK.tools.newElement ("div", {className: "CenterLeft", appendTo: _elements["center"]});
				_elements["centercenter"] = SNDK.tools.newElement ("div", {className: "CenterCenter", appendTo: _elements["center"]});
				_elements["centerright"] = SNDK.tools.newElement ("div", {className: "CenterRight", appendTo: _elements["center"]});				
		
				// BOTTOM
				_elements["bottom"] = SNDK.tools.newElement ("div", {appendTo: _elements["container"]});
				_elements["bottomleft"] = SNDK.tools.newElement ("div", {className: "BottomLeft", appendTo: _elements["bottom"]});
				_elements["bottomcenter"] = SNDK.tools.newElement ("div", {className: "BottomCenter", appendTo: _elements["bottom"]});
				_elements["bottomright"] = SNDK.tools.newElement ("div", {className: "BottomRight", appendTo: _elements["bottom"]});
				
				// AREA
				switch (_attributes.provider)
				{
					case "default":
					{
						_elements["area"] = SNDK.tools.newElement ("div", {className: "Area", appendTo: _elements["centercenter"]});
						_elements["provider"] = SNDK.tools.newElement ("textarea", {className: "Provider", appendTo: _elements["area"]});
						_elements["provider"].style.resize = "none";
						_elements["provider"].name = _attributes.name;				
						_elements["provider"].style.width = "100%";
						_elements["provider"].style.height = "100%";
						
						_elements["provider"].onfocus = eventOnFocus;
						_elements["provider"].onblur = eventOnBlur;
						_elements["provider"].onkeyup = eventOnChange;
						_elements["provider"].onchange = eventOnChange;
						_elements["provider"].value = _attributes.value;
						
						break;
					}
					
					case "codemirror":
					{
						_elements["area"] = SNDK.tools.newElement ("div", {appendTo: _elements["centercenter"]});
						
						_attributes.providerConfig.onFocus = eventOnFocus;
						_attributes.providerConfig.onBlur = eventOnBlur;
						_attributes.providerConfig.onChange = eventOnChange;
						
						_attributes.providerConfig.onKeyEvent = 	function (editor, event) 
																	{
																		eventOnKeyUp (event);
																	}
						
						_attributes.providerConfig.value = _attributes.value;
					
						_elements["provider"] = new CodeMirror(_elements["area"], _attributes.providerConfig);					
						
						_temp.providerInitialized = true;
						break;
					}
					
					case "tinymce":
					{
						_temp.tinymceId = SNDK.tools.newGuid ();
						_elements["area"] = SNDK.tools.newElement ("div", {appendTo: _elements["centercenter"], id: _temp.tinymceId});
				
		//				_attributes.providerConfig.width = "100%";
		//				_attributes.providerConfig.height = "100%";
						_attributes.providerConfig.init_instance_callback =	function (editor) 
																			{
																				tinymce.dom.Event.add (editor.getWin (), 'focus', eventOnFocus); 																	
																				tinymce.dom.Event.add (editor.getWin (), 'blur', eventOnBlur);
																			};							
																							
						_elements["provider"] = new tinymce.Editor(_temp.tinymceId, _attributes.providerConfig);
						
						//tinyMCE.execCommand('mceAddControl', false, _temp.tinymceId);
						//console.log (tinyMCE.get (_temp.tinymceId))
						
						//_elements["provider"] =  tinyMCE.getInstanceById (_temp.tinymceId);
						
						//console.log (_elements["provider"]);
						
						_elements["provider"].render ();
						_elements["provider"].onInit.add (	function () 
															{ 
																_elements["provider"].setContent (_attributes.value);
																_temp.providerInitialized = true;
															});
										
						_elements["provider"].onChange.add (eventOnChange);
						_elements["provider"].onKeyUp.add (	function (editor, event) 
															{
																eventOnKeyUp (event);										
															});
													
						break;
					}
				}		
				
				// Hook events		
				window.addEvent (window, 'SUIREFRESH', refresh);																																			
			}
					
			function dispose ()
			{	
				//tinyMCE.execCommand('mceRemoveControl', true, _temp.tinymceId);			
				window.removeEvent (window, 'SUIREFRESH', refresh);		
			}
					
			// ------------------------------------
			// refresh
			// ------------------------------------		
			function refresh ()
			{
				if (_temp.initialized)
				{			
					if (_attributes.disabled)
					{			
						_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet+"Disabled";			
					
						switch (_attributes.provider)
						{
							case "default":
							{
								_elements["provider"].disabled = true;
								break;
							}
						
							case "codemirror":
							{					
								_elements["provider"].setOption ("readOnly", true);
								break;
							}
				
							case "tinymce":
							{
								break;
							}
						}				
					}			
					else
					{
						switch (_attributes.provider)
						{
							case "default":
							{
								_elements["provider"].disabled = false;
								break;
							}
						
							case "codemirror":
							{					
								_elements["provider"].setOption ("readOnly", false);
								break;
							}
				
							case "tinymce":
							{						
								break;
							}
						}				
										
						if (_attributes.focus)
						{
							_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"Focus";
						}
						else
						{
							_elements["container"].className = _attributes.stylesheet;
						}
					}						
				}
				
				setDimensions ();
			}
		
			// ------------------------------------
			// updateCache
			// ------------------------------------		
			function updateCache ()
			{
				if (!_temp.cacheUpdated)
				{
					_temp.cache["containerPadding"] = SNDK.tools.getElementStyledPadding (_elements["container"]);
					_temp.cache["containerWidth"] = (SNDK.tools.getElementStyledWidth (_elements["topleft"]) + SNDK.tools.getElementStyledWidth (_elements["topright"]));
					_temp.cache["containerHeight"] = (SNDK.tools.getElementStyledWidth (_elements["topleft"]) + SNDK.tools.getElementStyledWidth (_elements["bottomleft"]));
				}
				
				_temp.cacheUpdated = true;	
			}	
			
			// ------------------------------------
			// setAttributes
			// ------------------------------------		
			function setAttributes ()
			{	
				// Name
				if (!_attributes.name)		
					_attributes.name = "";	
				
				// Stylesheet
				if (!_attributes.stylesheet)
				{
					_attributes.stylesheet = "SUITextarea";
				}
								 		
				// Managed
				if (!_attributes.managed)		
					_attributes.managed = false;	
			
				// Width
				if (!_attributes.width) 
					_attributes.width = "100%";				
					
				if (_attributes.width.substring (_attributes.width.length - 1) == "%")
				{
					_attributes.widthType = "percent";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 1)			
				}
				else
				{
					_attributes.widthType = "pixel";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 2)
				}			
		
				// Height
				if (!_attributes.height) 
					_attributes.height = "100%";
					
				if (_attributes.height.substring (_attributes.height.length - 1) == "%")
				{
					_attributes.heightType = "percent";
					_attributes.height = _attributes.height.substring (0, _attributes.height.length - 1)			
				}
				else
				{
					_attributes.heightType = "pixel";
					_attributes.height = _attributes.height.substring (0, _attributes.height.length - 2)
				}						 		
								 									
				// Disabled
				if (!_attributes.disabled)
					_attributes.disabled = false;		
												
				// Focus	
				if (!_attributes.focus)
					_attributes.focus = false
				
				// Disabled
				if (!_attributes.disabled)		
					_attributes.disabled = false;				
																
				// Focus	
				if (!_attributes.focus)
					_attributes.focus = false;
						
				// onFocus
				if (!_attributes.onFocus)
					_attributes.onFocus = null;	
					
				// onBlur
				if (!_attributes.onBlur)
					_attributes.onBlur = null;	
		
				// onChange
				if (!_attributes.onChange)
					_attributes.onChange = null;
										
				// Value
				if (!_attributes.value)
					_attributes.value = "";	
				
				// Provider
				if (_attributes.provider == null)
				{
					_attributes.provider = "default";	
				}		
			}	
			
			// ------------------------------------
			// setDimensions
			// ------------------------------------
			function setDimensions ()
			{
				if (_temp.initialized)
				{	
			
					var width = {};	
					var height = {};
					var combinedheightofchildren = 0;
		
					if (!_attributes.managed && _attributes.widthType != "pixel")
					{					
						width.container = ((SNDK.tools.getElementInnerWidth (_elements["container"].parentNode) * _attributes.width) / 100) - _temp.cache.containerPadding["horizontal"];
					}
					else
					{			
						if (_attributes.managed && _attributes.widthType == "percent")
						{
			
							width.container = _attributes.managedWidth - _temp.cache.containerPadding["horizontal"];
						}
						else
						{
							width.container = _attributes.width - _temp.cache.containerPadding["horizontal"];
						}			
					}	
			
					if (!_attributes.managed && _attributes.heightType != "pixel")
					{					
						height.container = ((SNDK.tools.getElementInnerHeight (_elements["container"].parentNode) * _attributes.height) / 100) - _temp.cache.containerPadding["vertical"];
					}
					else
					{			
						if (_attributes.managed && _attributes.heightType == "percent")
						{
							height.container = _attributes.managedHeight - _temp.cache.containerPadding["vertical"];				
						}
						else
						{
							height.container = _attributes.height - _temp.cache.containerPadding["vertical"];
						}			
					}	
					
					width.topCenter = width.container - _temp.cache.containerWidth;
					width.centerCenter = width.container - _temp.cache.containerWidth;
					width.bottomCenter = width.container - _temp.cache.containerWidth;
					width.area = width.container - _temp.cache.containerWidth;
					
					height.centerLeft = height.container - _temp.cache.containerHeight;
					height.centerCenter = height.container - _temp.cache.containerHeight;
					height.centerRight = height.container - _temp.cache.containerHeight;
					height.area = height.container - _temp.cache.containerHeight;
					
					_elements["container"].style.width = width.container +"px";				
					
					_elements["topcenter"].style.width = width.topCenter +"px";
					_elements["centercenter"].style.width = width.centerCenter +"px";
					_elements["bottomcenter"].style.width = width.bottomCenter +"px";	
			
					_elements["container"].style.height = height.container +"px"; 	
					
					_elements["centerleft"].style.height = height.centerLeft +"px";
					_elements["centercenter"].style.height = height.centerCenter +"px";
					_elements["centerright"].style.height = height.centerRight +"px";									
					
					_elements["area"].style.width = width.area +"px";
					_elements["area"].style.height = height.area +"px";
					
					if (_temp.providerInitialized)
					{
						switch (_attributes.provider)
						{
							case "codemirror":
							{
								_elements["provider"].getScrollerElement().style.height = height.area +"px";
								_elements["provider"].refresh ();			
								break;
							}
					
							case "tinymce":
							{
								document.getElementById(_temp.tinymceId +'_tbl').style.width = width.area + "px";
								document.getElementById(_temp.tinymceId +'_tbl').style.height = height.area +"px";	
								
								document.getElementById(_temp.tinymceId +'_ifr').style.width = width.area + "px";
								document.getElementById(_temp.tinymceId +'_ifr').style.height = height.area - 28 +"px";	
								
								
								
																			
								_elements["provider"].execCommand ("mceRepaint");
								break;
							}
						}
					}									
				}
			}
				
			function setDimensions2 ()
			{		
				// Get padding dimensions of container.
				var containerpadding = SNDK.tools.getElementStyledPadding (_elements["container"]);
		
				// If either width or height is in percent, we also need parent padding dimensions.
				var parentpadding;
				if (_attributes.widthType == "percent" || _attributes.heightType == "percent")
				{
					parentpadding = SNDK.tools.getElementStyledPadding (_elements["container"].parentNode);
				}
				
				// Get all corners styled widths.										
				var topleftwidth = SNDK.tools.getElementStyledWidth (_elements["topleft"]); 
				var toprightwidth = SNDK.tools.getElementStyledWidth (_elements["topright"]); 		
				var topleftheight = SNDK.tools.getElementStyledHeight (_elements["topleft"]); 
				var bottomleftheight = SNDK.tools.getElementStyledHeight (_elements["bottomright"]); 	
				
				
				if (_attributes.widthType == "percent")
				{				
					containerwidth = topleftwidth + toprightwidth + containerpadding.horizontal;
				}
				else
				{
					 containerwidth = topleftwidth + toprightwidth;
				}
				
				if (_attributes.heightType == "percent")		
				{	
					containerheight = topleftheight + bottomleftheight + containerpadding.vertical;
				}
				else
				{
					containerheight = topleftheight + bottomleftheight;		
				}
									
				// TODO: this needs to be calculated right.
				var areawidth = parseInt (SNDK.tools.getStyle (_elements["area"], "margin-left")) + parseInt (SNDK.tools.getStyle (_elements["area"], "margin-right"));
				var areaheight = parseInt (SNDK.tools.getStyle (_elements["area"], "margin-top")) + parseInt (SNDK.tools.getStyle (_elements["area"], "margin-bottom"));
		
				// WIDTH			
				if (_attributes.widthType == "percent")
				{
					var parentnode = _elements["container"].parentNode;
					
					_elements["container"].style.width = parentnode.offsetWidth - containerpadding.horizontal - parentpadding.horizontal +"px";
					
					var pagesize = SNDK.tools.getPageSize ();
					if (_temp.pageSizeX == 0)
					{
						_temp.pageSizeX = pagesize[0];
					}			
					
					setTimeout (	function () 
							{	
								if (_temp.pageSizeX != pagesize[0])
								{
									_elements["topcenter"].style.width = 0 +"px";
									_elements["centercenter"].style.width = 0 +"px";
									_elements["bottomcenter"].style.width = 0 +"px";
									_elements["area"].style.width = 0 +"px";
						
									_temp.pageSizeX = pagesize[0];
								}	
															
								var width = _elements["container"].offsetWidth
								width = width - containerwidth;
								
								_elements["topcenter"].style.width = width +"px";
								_elements["centercenter"].style.width = width +"px";
								_elements["bottomcenter"].style.width = width +"px";			
					
								_elements["area"].style.width = width - areawidth +"px";	
							}, 0);						
				}
				else
				{
				
					_elements["container"].style.width = _attributes.width +"px";
					_elements["topcenter"].style.width = _attributes.width - containerwidth +"px";
					_elements["centercenter"].style.width = _attributes.width - containerwidth +"px";
					_elements["bottomcenter"].style.width = _attributes.width - containerwidth +"px";	
		
				// TODO: areawidth needs to be calculated.
		//			_elements["area"].style.width = _attributes.width - containerwidth - areawidth +"px";
					_elements["area"].style.width = _attributes.width - containerwidth +"px";
				}
		
				// HEIGHT
				if (_attributes.heightType == "percent")
				{
					var parentnode = _elements["container"].parentNode;
								
					_elements["container"].style.height = parentnode.offsetHeight - containerpadding.vertical - parentpadding.vertical +"px";
					
					
					var pagesize = SNDK.tools.getPageSize ();
					if (_temp.pageSizeY == 0)
					{
						_temp.pageSizeY = pagesize[1];
					}			
					
					setTimeout (	function () 
							{	
		
								if (_temp.pageSizeX != pagesize[0])
								{
									_elements["centerleft"].style.height = 0 +"px";
									_elements["centercenter"].style.height = 0 +"px";
									_elements["centerright"].style.height = 0 +"px";
									_elements["area"].style.height = 0 +"px";
						
									_temp.pageSizeY = pagesize[1];				
								}	
															
								var height = _elements["container"].offsetHeight
								
								_elements["centerleft"].style.height = height - containerheight +"px";
								_elements["centercenter"].style.height = height - containerheight +"px";
								_elements["centerright"].style.height = height - containerheight +"px";						
								
								_elements["area"].style.height = height - containerheight +"px";
							}, 0);	
				}
				else
				{
					_elements["centerleft"].style.height = _attributes.height +"px";
					_elements["centercenter"].style.height = _attributes.height +"px";
					_elements["centerright"].style.height = _attributes.height +"px";		
			
					// TODO: area height needs to be calculated.
		//			_elements["area"].style.height = _attributes.height - areaheight +"px";			
					_elements["area"].style.height = _attributes.height  +"px";
				}
				
				if (_temp.providerInitialized)
				{
				switch (_attributes.provider)
				{
					case "codemirror":
					{
						setTimeout (	function () 
						{
						_elements["provider"].refresh ();			
						}, 10);
						break;
					}
					
					case "tinymce":
					{
		//				document.getElementById(_temp.tinymceId +'_tbl').style.width = "200px"
		//				document.getElementById(_temp.tinymceId +'_tbl').style.height = "200px"
						
						//alert ("test"+ document.getElementById(_temp.tinymceId +'_tbl'))
					
		//				_elements["provider"].execCommand ("mceRepaint");
						break;
					}
				}
				}
				//alert (_temp.providerInitialized)
			}	
				
			// ------------------------------------
			// setFocus
			// ------------------------------------				
			function setFocus ()
			{
				setTimeout ( function () { _elements["container"].focus (); }, 2);	
			}	
			
			// ------------------------------------
			// setBlur
			// ------------------------------------				
			function setBlur ()
			{
				setTimeout ( function () { _elements["container"].blur (); }, 2);	
			}				
			
			// ------------------------------------
			// keyHandler
			// ------------------------------------	
			function keyHandler(event)
			{		
				var key;
				if (!event && window.event) 
				{
					event = window.event;
				}
				
				if (event) 
				{
					key = event.keyCode;
				}
				else
				{
					key = event.which;	
				}	
			}	
			
			function getValue ()
			{		
				switch (_attributes.provider)
				{
					case "default":
					{
						_attributes.value = _elements["provider"].value;
						break;
					}
					
					case "codemirror":
					{
						_attributes.value = _elements["provider"].getValue ();
						break;
					}
					
					case "tinymce":
					{
						if (_temp.providerInitialized)
						{
							_attributes.value = _elements["provider"].getContent ();
						}
						break;
					}
				}
			}
			
			function setValue ()
			{
				switch (_attributes.provider)
				{
					case "default":
					{
						_elements["provider"].value = _attributes.value;
						break;
					}
					
					case "codemirror":
					{
						_elements["provider"].setValue (_attributes.value);
						break;
					}
					
					case "tinymce":
					{
						if (_temp.providerInitialized)
						{
							_elements["provider"].setContent (_attributes.value);
						}
						break;
					}
				}	
			}
			
			// ------------------------------------
			// Public functions
			// ------------------------------------			
			// ------------------------------------
			// refresh
			// ------------------------------------				
			function functionRefresh ()
			{
				refresh ();
			}	
			
			function functionDispose ()
			{
				dispose ();
			}
				
			// ------------------------------------
			// getAttribute
			// ------------------------------------						
			function functionGetAttribute (attribute)
			{
				switch (attribute)
				{
					case "id":
					{
						return _attributes[attribute];
					}
					
					case "tag":
					{
						return _attributes[attribute];
					}
					
					case "name":
					{
						return _attributes[attribute];
					}
		
					case "stylesheet":
					{
						return _attributes[attribute];
					}
					
					case "width":
					{
						if (_attributes.widthType == "percent")
						{
							return _attributes.width + "%";
						}
		
						if (_attributes.widthType == "pixel")
						{
							return _attributes.width + "px";
						}
					}
					
					case "height":
					{
						if (_attributes.heightType == "percent")
						{
							return _attributes.height + "%";
						}
		
						if (_attributes.heightType == "pixel")
						{
							return _attributes.height + "px";
						}
					}
					
					case "appendTo":
					{
						return _attributes[attribute];			
					}			
					
					case "managed":
					{
						return _attributes[attribute];			
					}
		
					case "disabled":
					{
						return _attributes[attribute];			
					}
		
					case "autocomplete":
					{
						return _attributes[attribute];			
					}
		
					case "readOnly":
					{
						return _attributes[attribute];			
					}
					
					case "focus":
					{
						return _attributes[attribute];			
					}
		
					case "password":
					{
						return _attributes[attribute];			
					}
		
					case "onFocus":
					{
						return _attributes[attribute];			
					}
		
					case "onBlur":
					{
						return _attributes[attribute];			
					}
		
					case "onChange":
					{
						return _attributes[attribute];			
					}
		
					case "onKeyUp":
					{
						return _attributes[attribute];			
					}
		
					case "value":
					{
						getValue ();
						return _attributes[attribute];			
					}
							
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}
			
			// ------------------------------------
			// setAttribute
			// ------------------------------------						
			function functionSetAttribute (attribute, value)
			{
				switch (attribute)
				{
					case "id":
					{
						throw "Attribute with name ID is ready only.";
						break;
					}
					
					case "tag":
					{
						_attributes[attribute] = value;
						break;
					}
					
					case "name":
					{
						_attributes[attribute] = value;
						break;
					}
		
					case "stylesheet":
					{
						_attributes[attribute] = value;
						break;				
					}
					
					case "width":
					{
						if (value.substring (value.width.length, 3) == "%")
						{
							_attributes.widthType = "percent";
							_attributes.width = value.width.substring (0, value.width.length - 1)			
						}
						else
						{
							_attributes.widthType = "pixel";
							_attributes.width = value.width.substring (0, value.width.length - 2)
						}	
						break;			
					}
					
					case "height":
					{
						throw "Attribute with name HEIGHT is ready only.";
						break;			
					}			
					
					case "appendTo":
					{
						_attributes[attribute] = value;	
						_attributes.appendTo.appendChild (_elements["container"]);			
						break;
					}			
					
					case "managed":
					{
						_attributes[attribute] = value;
		
						if (value)
						{
							window.removeEvent (window, 'SUIREFRESH', refresh);		
						}
						else
						{
							window.addEvent (window, 'SUIREFRESH', refresh);
						}
		
						break;
					}
		
					case "disabled":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
		
					case "autocomplete":
					{
						_attributes[attribute] = value;
						break;
					}
		
					case "readOnly":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
					
					case "focus":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
		
					case "password":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
		
					case "onFocus":
					{
						_attributes[attribute] = value;
						break;
					}
		
					case "onBlur":
					{
						_attributes[attribute] = value;
						break;
					}
		
					case "onChange":
					{
						_attributes[attribute] = value;
						break;
					}
		
					case "onKeyUp":
					{
						_attributes[attribute] = value;
						break;
					}
		
					case "value":
					{		
						_attributes[attribute] = value;
						setValue ();
						break;
					}
							
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}								
						
			// ------------------------------------
			// Events
			// ------------------------------------
			// ------------------------------------
			// eventOnKeyUp
			// ------------------------------------	
			function eventOnKeyUp (event)
			{
				var result = true;
					
				result = keyHandler (event);		
				
				getValue ();				
				
				if (_attributes.onKeyUp != null)
				{
					setTimeout( function () { _attributes.onKeyUp (_attributes.name); }, 1);
				}		
							
				return result;				
			}
		
			// ------------------------------------
			// onFocus
			// ------------------------------------		
			function eventOnFocus ()
			{
				if (!_attributes.disabled)
				{
					if (!_attributes.focus)
					{
						_attributes.focus = true;
						refresh ();
						
						if (_attributes.onFocus != null)
						{
							setTimeout( function () { _attributes.onFocus (_name); }, 1);
						}					
					}		
				}
			}
			
			// ------------------------------------
			// onBlur
			// ------------------------------------		
			function eventOnBlur ()
			{
				if (!_attributes.disabled)
				{
					if (_attributes.focus)
					{				
						_attributes.focus = false;
						refresh ();
		
						if (_attributes.onBlur != null)
						{
							setTimeout( function () { _attributes.onBlur (_name); }, 1);
						}									
					}
				}
			}
							
			// ------------------------------------
			// onFocus
			// ------------------------------------		
			function eventOnFocus ()
			{
				if (!_attributes.disabled)
				{
					if (!_attributes.focus)
					{
						_attributes.focus = true;
						refresh ();
		
						if (_attributes.onFocus != null)
						{
							setTimeout( function () { _attributes.onFocus (_name); }, 1);
						}
					}					
				}			
			}
			
			// ------------------------------------
			// onBlur
			// ------------------------------------		
			function eventOnBlur ()
			{
				if (!_attributes.disabled)
				{
					if (_attributes.focus)
					{
						_attributes.focus = false;
						refresh ();
						
						if (_attributes.onBlur != null)
						{
							setTimeout( function () { _attributes.onBlur (_name); }, 1);
						}			
					}
				}
			}	
					
			// ------------------------------------
			// onChange
			// ------------------------------------						
			function eventOnChange ()
			{
				if (_temp.initialized)
				{		
					getValue ();
					
					if (_attributes.onChange != null)
					{
						setTimeout( function ()	{ _attributes.onChange (); }, 1);
					}
				}
			}	
		},
	
		// -------------------------------------------------------------------------------------------------------------------------
		// upload ([attributes])
		// -------------------------------------------------------------------------------------------------------------------------
		//
		// .getAttribute (string)
		// .setAttribute (string, string)
		//	
		// 	id 		get
		//	tag		get/set
		//	name		get/set
		//	stylesheet	get/set
		//	managed		get/set
		//	appendTo	get/set
		//	width		get/set
		//	height		get
		//	disabled	get/set
		//	onFocus		get/set
		//	onBlur		get/set
		//	onClick		get/set
		//	label		get/set
		//	value		get
		//
		// CHANGELOG:
		//
		// v1.03:
		//	- Fixed dimension calculations, percentage should now be correct.
		//	- Added managed mode.
		//
		// v1.02:
		//	- Fixed width caluclation. Now works with percentage.
		//	- Code cleanup.
		//
		// v1.01: 
		//	- Changed the way legacy input is handled underneath. This makes for a more convicing button experience.
		//
		// v1.00:
		//	- Initial release.
		/**
		 * @constructor
		 */ 
		upload : function (attributes)
		{
			var _elements = new Array ();		
			var _attributes = attributes;	
						
			var _temp = 	{ initialized: false,
					  mouseDown: false,
					  mouseOver: false,
					  enterDown: false,
					  cache: new Array ()
					}
					
			_attributes.id = SNDK.tools.newGuid ();
		
			setAttributes ();		
								
			// Private functions
			this._attributes = _attributes;
			this._elements = _elements;
			this._temp = _temp;			
			this._init = init;
			
			// Public functions
			this.refresh = functionRefresh;
			this.dispose = functionDispose;
			this.getAttribute = functionGetAttribute;
			this.setAttribute = functionSetAttribute;	
									
			// Construct
			construct ();	
			
			// Init Control
			SNDK.SUI.addInit (this);
		
			// ------------------------------------
			// Private functions
			// ------------------------------------					
			// ------------------------------------
			// init
			// ------------------------------------					
			function init ()
			{
		
				updateCache ();
				
				_attributes.heightType = "pixel";
				_attributes.height = _temp.cache["containerPadding"]["vertical"] + _temp.cache["containerHeight"] +"px";				
			}
			
			// ------------------------------------
			// construct
			// ------------------------------------					
			function construct ()
			{
				// Container
				_elements["container"] = SNDK.tools.newElement ("div", {});
				_elements["container"].setAttribute ("id", _attributes.id);
				_elements["container"].className = _attributes.stylesheet;
				_elements["container"].style.position = "relative";
											
				// TextLeft
				_elements["textleft"] = SNDK.tools.newElement ("div", {className: "TextLeft", appendTo: _elements["container"]});
				
				// TextCenter
				_elements["textcenter"] = SNDK.tools.newElement ("div", {className: "TextCenter", appendTo: _elements["container"]});
				SNDK.tools.textSelectionDisable (_elements["textcenter"]);
		
				// TextRight
				_elements["textright"] = SNDK.tools.newElement ("div", {className: "TextRight", appendTo: _elements["container"]});
							
				// ButtonLeft
				_elements["buttonleft"] = SNDK.tools.newElement ("div", {className: "ButtonLeft", appendTo: _elements["container"]});
		
				// ButtonCenter
				_elements["buttoncenter"] = SNDK.tools.newElement ("div", {className: "ButtonCenter", appendTo: _elements["container"]});
				SNDK.tools.textSelectionDisable (_elements["buttoncenter"]);
		
				// ButtonRight
				_elements["buttonright"] = SNDK.tools.newElement ("div", {className: "ButtonRight", appendTo: _elements["container"]});
						
				// LEGACY
				_elements["legacy"] = SNDK.tools.newElement ("div", {appendTo: _elements["container"]});		
				_elements["legacy"].style.overflow = "hidden";
				_elements["legacy"].style.position = "absolute";		
				_elements["legacy"].style.height = "32px";
				_elements["legacy"].style.right = "0px";
		
				// Input
				_elements["input"] = SNDK.tools.newElement ("input", {name: attributes.name, type: "file", appendTo: _elements["legacy"]});
				_elements["input"].style.position = "absolute";		
				_elements["input"].style.fontSize = "23px";	
				//_elements["input"].accept =  "image/jpeg,image/gif";
				
				SNDK.tools.changeOpacityByObject (_elements["input"], 0);
		
				if ( client.browser == "Firefox" || client.browser == "Opera" ) 
				{
					_elements["input"].style.right = '0px';
				}
			//	else if ( client.ie ) 
			//	{			
					//_elements["input"].style.width = '0';
			//	}							
																			
				// Hook events	
				_elements["input"].onfocus = eventOnFocus;
				_elements["input"].onblur = eventOnBlur;
				_elements["input"].onchange = eventOnChange;			
				_elements["input"].onmousedown = eventOnMouseDown;
				_elements["input"].onmouseup = eventOnMouseUp;		
				_elements["input"].onmouseover = eventOnMouseOver;
				_elements["input"].onmouseout = eventOnMouseOut;
		
				window.addEvent (window, 'SUIREFRESH', refresh);
			}		
				
			// ------------------------------------
			// refresh
			// ------------------------------------		
			function refresh ()
			{
				if (_temp.initialized)
				{			
					if (_attributes.disabled)
					{
						_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet+"Disabled";
						_elements["legacy"].style.display = "none";
						_attributes.focus = false;
						eventOnBlur ();						
					}
					else
					{				
						if (_attributes.focus)
						{
							if (_temp.mouseDown)
							{
								_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet+"Focus "+ _attributes.stylesheet +"LeftClicked";
							}
							else
							{
								_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet+"Focus";					
							}
							setFocus ();					
						}
						else
						{
							_elements["container"].className = _attributes.stylesheet;
						}
						
						_elements["legacy"].style.display = "block";
					}
										
					_elements["textcenter"].innerHTML = _attributes.value;	
					_elements["buttoncenter"].innerHTML = _attributes.label;
				}
				
				setDimensions ();
			}	
			
			function dispose ()
			{		
				window.removeEvent (window, 'SUIREFRESH', refresh);	
			}
			
			// ------------------------------------
			// updateCache
			// ------------------------------------		
			function updateCache ()
			{
				if (!_temp.cacheUpdated)
				{
					_temp.cache["containerPadding"] = SNDK.tools.getElementStyledPadding (_elements["container"]);
					_temp.cache["containerWidth"] = SNDK.tools.getElementStyledWidth (_elements["textleft"]) + SNDK.tools.getElementStyledWidth (_elements["textright"]) + SNDK.tools.getElementStyledWidth (_elements["buttonleft"]) + SNDK.tools.getElementStyledWidth (_elements["buttoncenter"]) + SNDK.tools.getElementStyledWidth (_elements["buttonright"]);
					_temp.cache["containerHeight"] = SNDK.tools.getElementStyledHeight (_elements["textcenter"]);
				
					_temp.cache["buttonWidth"] = SNDK.tools.getElementStyledWidth (_elements["buttonleft"]) + SNDK.tools.getElementStyledWidth (_elements["buttoncenter"]) + SNDK.tools.getElementStyledWidth (_elements["buttonright"]);
		
				}
				
				_temp.cacheUpdated = true;	
			}		
				
			// ------------------------------------	
			// setDimensions
			// ------------------------------------		
			function setDimensions ()
			{			
				if (_temp.initialized)
				{
					var width = {};
					
					if (!_attributes.managed && _attributes.widthType != "pixel")
					{					
						width.container = ((SNDK.tools.getElementInnerWidth (_elements["container"].parentNode) * _attributes.width) / 100) - _temp.cache.containerPadding["horizontal"];
					}
					else
					{			
						if (_attributes.managed && _attributes.widthType == "percent")
						{
							width.container = _attributes.managedWidth - _temp.cache.containerPadding["horizontal"];
						}
						else
						{
							width.container = _attributes.width - _temp.cache.containerPadding["horizontal"];
						}			
					}			
					
					width.textCenter = width.container - _temp.cache.containerWidth;
					width.legacy = _temp.cache.buttonWidth;
		
					//SNDK.tools.getElementStyledWidth (_elements["buttonleft"]) + SNDK.tools.getElementStyledWidth (_elements["buttoncenter"]) + SNDK.tools.getElementStyledWidth (_elements["buttonright"]) +"px";
		
					_elements["container"].style.width = width.container +"px";
					_elements["textcenter"].style.width = width.textCenter +"px";
					_elements["legacy"].style.width = width.legacy +"px";				
				}	
			}		
			
			// ------------------------------------
			// refresh
			// ------------------------------------				
			function functionRefresh ()
			{
				refresh ();
			}	
							
			// ------------------------------------
			// setAttributes
			// ------------------------------------		
			function setAttributes ()
			{
				// Managed
				if (!_attributes.managed)		
					_attributes.managed = false;				
			
				// Name
				if (!_attributes.name)		
					_attributes.name = "";		
			
				// Stylesheet
				if (!_attributes.stylesheet)
					_attributes.stylesheet = "SUIUpload";			
							
				// Width
				if (!_attributes.width) 
					_attributes.width = "100px";				
					
				if (_attributes.width.substring (_attributes.width.length - 1) == "%")
				{
					_attributes.widthType = "percent";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 1)			
				}
				else
				{
					_attributes.widthType = "pixel";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 2)
				}											
					
				// Disabled
				if (!_attributes.disabled)
					_attributes.disabled = false;		
								
				// Focus	
				if (!_attributes.focus)
					_attributes.focus = false;
					
				// onFocus
				if (!_attributes.onFocus)
					_attributes.onFocus = null;	
					
				// onBlur
				if (!_attributes.onBlur)
					_attributes.onBlur = null;	
		
				// onChange
				if (!_attributes.onChange)
					_attributes.onChange = null;										
		
				// Value
				_attributes.value = "";						
			}	
			
			// ------------------------------------
			// setFocus
			// ------------------------------------				
			function setFocus ()
			{
				setTimeout ( function () { _elements["input"].focus ();	}, 1);	
			}			
				
			// ------------------------------------
			// Public functions
			// ------------------------------------				
			// ------------------------------------
			// getAttribute
			// ------------------------------------						
			function functionGetAttribute (attribute)
			{
				switch (attribute)
				{
					case "id":
					{
						return _attributes[attribute];
					}
					
					case "tag":
					{
						return _attributes[attribute];
					}
					
					case "name":
					{
						return _attributes[attribute];
					}
		
					case "stylesheet":
					{
						return _attributes[attribute];
					}
					
					case "width":
					{
						if (_attributes.widthType == "percent")
						{
							return _attributes.width + "%";
						}
		
						if (_attributes.widthType == "pixel")
						{
							return _attributes.width + "px";
						}
					}
					
					case "height":
					{
						if (_attributes.heightType == "percent")
						{
							return _attributes.height + "%";
						}
		
						if (_attributes.heightType == "pixel")
						{
							return _attributes.height + "px";
						}
					}
					
					case "appendTo":
					{
						return _attributes[attribute];			
					}			
					
					case "managed":
					{
						return _attributes[attribute];			
					}
		
					case "disabled":
					{
						return _attributes[attribute];			
					}
					
					case "focus":
					{
						return _attributes[attribute];			
					}
		
					case "onFocus":
					{
						return _attributes[attribute];			
					}
		
					case "onBlur":
					{
						return _attributes[attribute];			
					}
		
					case "onChange":
					{
						return _attributes[attribute];			
					}
		
					case "label":
					{
						return _attributes[attribute];			
					}
		
					case "value":
					{
						return _attributes[attribute];			
					}
							
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}		
			}
			
			// ------------------------------------
			// setAttribute
			// ------------------------------------						
			function functionSetAttribute (attribute, value)
			{
				switch (attribute)
				{
					case "id":
					{
						throw "Attribute with name ID is ready only.";
						break;
					}
					
					case "tag":
					{
						_attributes[attribute] = value;
						break;
					}
					
					case "name":
					{
						_attributes[attribute] = value;
						break;
					}
		
					case "stylesheet":
					{
						_attributes[attribute] = value;
						break;				
					}
					
					case "width":
					{
						if (value.substring (value.width.length, 3) == "%")
						{
							_attributes.widthType = "percent";
							_attributes.width = value.width.substring (0, value.width.length - 1)			
						}
						else
						{
							_attributes.widthType = "pixel";
							_attributes.width = value.width.substring (0, value.width.length - 2)
						}	
						break;			
					}
					
					case "height":
					{
						throw "Attribute with name HEIGHT is ready only.";
						break;			
					}			
					
					case "appendTo":
					{
						_attributes[attribute] = value;	
						_attributes.appendTo.appendChild (_elements["container"]);			
						break;
					}			
					
					case "managed":
					{
						_attributes[attribute] = value;
		
						if (value)
						{
							window.removeEvent (window, 'SUIREFRESH', refresh);		
						}
						else
						{
							window.addEvent (window, 'SUIREFRESH', refresh);
						}
		
						break;
					}
		
					case "disabled":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
					
					case "focus":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
		
					case "onFocus":
					{
						_attributes[attribute] = value;
						break;
					}
		
					case "onBlur":
					{
						_attributes[attribute] = value;
						break;
					}
		
					case "onChange":
					{
						_attributes[attribute] = value;
						break;
					}
		
					case "label":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
		
					case "value":
					{
						throw "Attribute with name VALUE is ready only.";
						break;
					}
							
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}		
			}			
			
			function functionDispose ()
			{
				dispose ();
			}		
								
			// ------------------------------------
			// Events
			// ------------------------------------
			// ------------------------------------
			// onFocus
			// ------------------------------------				
			function eventOnFocus ()
			{		
				if (!_attributes.disabled)
				{
					if (!_attributes.focus)
					{
						_attributes.focus = true;
						refresh ();				
						
						if (_attributes.onFocus != null)
						{
							setTimeout( function ()	{ _attributes.onFocus (); }, 1);
						}			
					}			
				}
			}
		
			// ------------------------------------
			// onBlur
			// ------------------------------------						
			function eventOnBlur ()
			{
				if (!_attributes.disabled)
				{
					if (_attributes.focus)
					{
						_attributes.focus = false;
						refresh ();
						
						if (_attributes.onBlur != null)
						{
							setTimeout( function ()	{ _attributes.onBlur (); }, 1);
						}			
					}	
				}
			}
						
			// ------------------------------------
			// onMouseDown
			// ------------------------------------						
			function eventOnMouseDown ()
			{
				if (!_attributes.disabled)
				{
					_temp.mouseDown = true;
					_attributes.focus = true;
					refresh ();
				}
			}
			
			// ------------------------------------
			// onMouseUp
			// ------------------------------------						
			function eventOnMouseUp ()
			{
				if (_attributes.disabled)
				{
					_temp.mouseDown = false;
					refresh ();
				}		
			}
				
			// ------------------------------------
			// onMouseOver
			// ------------------------------------	
			function eventOnMouseOver ()
			{
				if (!_attributes.disabled)
				{		
					_temp.mouseOver = true;
					refresh ();
				}
			}	
			
			// ------------------------------------
			// onMouseOut
			// ------------------------------------	
			function eventOnMouseOut ()
			{
				if (!_attributes.disabled)
				{
					if (_temp.mouseDown)
					{		
						_temp.mouseOver = false;
						_temp.mouseDown = false;				
						refresh ();
					}	
				}
			}	
						
			// ------------------------------------
			// onChange
			// ------------------------------------						
			function eventOnChange ()
			{	
				_attributes.value = _elements["input"].value;
				refresh ();
					
				if (_attributes.onChange != null)
				{
					setTimeout( function ()	{ _attributes.onChange (); }, 1);
				}
			}			
		},
	
		// -------------------------------------------------------------------------------------------------------------------------
		// label ([attributes])
		// -------------------------------------------------------------------------------------------------------------------------
		//
		// .getAttribute (string)
		// .setAttribute (string, string)
		//	
		// 		id 				get
		//		tag				get/set
		//		name			get/set
		//		stylesheet		get/set
		//		appendTo		get/set
		//		managed			get/set
		//		width			get/set
		//		height			get
		//		disabled		get/set
		//		text			get/set
		//
		/**
		 * @constructor
		 */
		label : function (attributes)
		{	
			var _elements = new Array ();
			var _attributes = attributes;
					
			var _temp = { initialized: false,
					  	  cache: new Array ()
						};
					
			_attributes.id = SNDK.tools.newGuid ()	
							
			setAttributes ();		
			
			// Private functions
			this._attributes = _attributes;
			this._elements = _elements;
			this._temp = _temp;	
			this._init = init;	
			this.type = "LABEL";
			// Functions
			this.refresh = functionRefresh;	
			this.dispose = functionDispose;
			this.getAttribute = functionGetAttribute;
			this.setAttribute = functionSetAttribute;
				
			// Construct
			construct ();
			
			// Initialize	
			SNDK.SUI.addInit (this);			
			
			// ------------------------------------
			// Private functions
			// ------------------------------------
			// ------------------------------------
			// init
			// ------------------------------------
			function init ()
			{
				updateCache ();
				
			//	_attributes.heightType = "pixel";
			//	_attributes.height = _temp.cache["containerPadding"]["vertical"] + _temp.cache["containerHeight"] +"px";
			}
		
			// ------------------------------------
			// construct
			// ------------------------------------	
			function construct ()
			{								
				// Container
				_elements["container"] = SNDK.tools.newElement ("div", {});
				_elements["container"].setAttribute ("id", _attributes.id);		
					
				// Text
				_elements["text"] = SNDK.tools.newElement ("div", {className: "Text", appendTo: _elements["container"]});
																				
				// Hook Events
				window.addEvent (window, 'SUIREFRESH', refresh);				
			}		
				
			// ------------------------------------
			// refresh
			// ------------------------------------	
			function refresh ()
			{
			if (!SNDK.debugStopRefresh)
				{
				if (_temp.initialized)
				{
					if (_attributes.disabled)
					{
						_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"Disabled";
					}
					else
					{
						_elements["container"].className = _attributes.stylesheet;
					}	
						
					_elements["text"].innerHTML = _attributes.text;
				}
				
				setDimensions ();
				}
			}	
		
			// ------------------------------------
			// dispose
			// ------------------------------------			
			function dispose ()
			{
				window.removeEvent (window, 'SUIREFRESH', refresh);				
			}	
		
			// ------------------------------------
			// updateCache
			// ------------------------------------		
			function updateCache ()
			{
		//		if (!_temp.cacheUpdated)
				
		//		{
		//			_temp.cache["containerPadding"] = SNDK.tools.getElementStyledPadding (_elements["container"]);
		//			_temp.cache["containerWidth"] = (SNDK.tools.getElementStyledWidth (_elements["left"]) + SNDK.tools.getElementStyledWidth (_elements["right"]));
		//			_temp.cache["containerHeight"] = SNDK.tools.getElementStyledHeight (_elements["center"]);			
		//		}
				
				_temp.cacheUpdated = true;	
			}
		
			// -------------------------------------
			// setAttributes
			// -------------------------------------
			function setAttributes ()
			{								
				// Name
				if (!_attributes.name)		
					_attributes.name = "";	
		
				// Stylesheet
				if (!_attributes.stylesheet)
					_attributes.stylesheet = "SUILabel";		
		
				// Managed
				if (!_attributes.managed)		
					_attributes.managed = false;	
			
				// Width
				if (!_attributes.width) 
					_attributes.width = "100px";				
					
				if (_attributes.width.substring (_attributes.width.length - 1) == "%")
				{
					_attributes.widthType = "percent";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 1)			
				}
				else
				{
					_attributes.widthType = "pixel";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 2)
				}			
		
				// Disabled
				if (!_attributes.disabled)		
					_attributes.disabled = false;				
															
				// Text
				if (!_attributes.text)
					_attributes.text = "";						
			}
				
			// -------------------------------------
			// setDimensions
			// -------------------------------------
			function setDimensions ()
			{
				if (_temp.initialized)
				{
					var containerwidth = 0;
				
					if (_attributes.widthType == "percent")
					{								
						setTimeout (	function () 
								{	
									var parentwidth = SNDK.tools.getElementInnerWidth (_elements["container"].parentNode);	
									var width = parentwidth - SNDK.tools.getElementStyledPadding (_elements["container"])["horizontal"] - containerwidth +"px";
															
									_elements["text"].style.width = width;
								}, 0);						
					}
					else
					{
						var width = _attributes.width  - containerwidth +"px";
		
						_elements["container"].style.width = _attributes.width +"px";
						_elements["text"].style.width = width;
					}		
				}
			}
			
			// ------------------------------------
			// Public functions
			// ------------------------------------
			// ------------------------------------
			// refresh
			// ------------------------------------				
			function functionRefresh ()
			{
				refresh ();
			}	
				
			// ------------------------------------
			// dispose
			// ------------------------------------				
			function functionDispose ()
			{
				dispose ();
			}		
				
			// ------------------------------------
			// getAttribute
			// ------------------------------------						
			function functionGetAttribute (attribute)
			{
				switch (attribute)
				{
					case "id":
					{
						return _attributes[attribute];
					}
					
					case "tag":
					{
						return _attributes[attribute];
					}
					
					case "name":
					{
						return _attributes[attribute];
					}
		
					case "stylesheet":
					{
						return _attributes[attribute];
					}
					
					case "width":
					{
						if (_attributes.widthType == "percent")
						{
							return _attributes.width + "%";
						}
		
						if (_attributes.widthType == "pixel")
						{
							return _attributes.width + "px";
						}
					}
					
					case "height":
					{
						if (_attributes.heightType == "percent")
						{
							return _attributes.height + "%";
						}
		
						if (_attributes.heightType == "pixel")
						{
							return _attributes.height + "px";
						}
					}
					
					case "appendTo":
					{
						return _attributes[attribute];			
					}			
					
					case "managed":
					{
						return _attributes[attribute];			
					}
		
					case "text":
					{
						return _attributes[attribute];
					}
							
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}
			
			// ------------------------------------
			// setAttribute
			// ------------------------------------						
			function functionSetAttribute (attribute, value)
			{
				switch (attribute)
				{
					case "id":
					{
						throw "Attribute with name ID is ready only.";
						break;
					}
					
					case "tag":
					{
						_attributes[attribute] = value;
						break;
					}
					
					case "name":
					{
						_attributes[attribute] = value;
						break;
					}
		
					case "stylesheet":
					{
						_attributes[attribute] = value;
						break;				
					}
					
					case "width":
					{
						if (value.substring (value.width.length, 3) == "%")
						{
							_attributes.widthType = "percent";
							_attributes.width = value.width.substring (0, value.width.length - 1)			
						}
						else
						{
							_attributes.widthType = "pixel";
							_attributes.width = value.width.substring (0, value.width.length - 2)
						}	
						break;			
					}
					
					case "height":
					{
						throw "Attribute with name HEIGHT is ready only.";
						break;			
					}			
					
					case "appendTo":
					{
						_attributes[attribute] = value;	
						_attributes.appendTo.appendChild (_elements["container"]);			
						break;
					}			
					
					case "managed":
					{
						_attributes[attribute] = value;
		
						if (value)
						{
							window.removeEvent (window, 'SUIREFRESH', refresh);		
						}
						else
						{
							window.addEvent (window, 'SUIREFRESH', refresh);
						}
		
						break;
					}
		
					case "disabled":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
		
					case "text":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
							
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}								
			
			// ------------------------------------
			// Events
			// ------------------------------------
		},
	
		// -------------------------------------------------------------------------------------------------------------------------
		// tabview ([attributes])
		// -------------------------------------------------------------------------------------------------------------------------
		//
		// .addTab ()
		// .getTab ()
		//
		//	.addUIElement (uielement)
		//	.getAttribute (string)
		//	.setAttribute (string, string)
		//
		//		tag		get/set
		//		selected	get/set
		//
		// .getAttribute (string)
		// .setAttribute (string, string)
		//	
		// 	id 		get
		//	tag		get/set
		//	stylesheet	get/set
		//	width		get/set
		//	height		get/set
		//	appendTo	get/set
		//	managed		get/set
		//
		// CHANGELOG:
		//
		// v1.01:
		//	- Fixed tab render, should be faster and work correctly on mobile devices.
		//	- Fixed dimension calculation, now works correctly with percentage.
		//	- Added managed mode.
		//
		// v1.00:
		//	- Initial release.
		
		/**
		 * @constructor
		 */
		tabview : function (attributes)
		{
			var _elements = new Array ();
			var _attributes = attributes;				
			var _temp = 	{ initialized: false,
					  selectedTab: -1,
					  cache: new Array ()		 
					};
			
			_attributes.id = SNDK.tools.newGuid ();
			
			setAttributes ();	
			
			// Private functions
			this._attributes = _attributes;
			this._elements = _elements;
			this._temp = _temp;	
			this._init = init;
			this.type = "TABVIEW";
			// Functions		
			this.refresh = functionRefresh;		
			this.dispose = functionDispose;
			this.addTab = functionAddTab;
			this.getTab = functionGetTab;		
			this.setAttribute = functionSetAttribute;
			this.getAttribute = functionGetAttribute;
		
			// Construct
			construct ();
										
			// Initialize
			SNDK.SUI.addInit (this);
				
			// ------------------------------------
			// Private functions
			// ------------------------------------
			// ------------------------------------
			// init
			// ------------------------------------	
			function init ()
			{
				updateCache ();
			}
			
			// ------------------------------------
			// construct
			// ------------------------------------	
			function construct ()
			{
				// Container
				_elements["container"] = SNDK.tools.newElement ("div", {});
				_elements["container"].setAttribute ("id", _attributes.id);
				_elements["container"].className = _attributes.stylesheet;
				
				// Tabs
				_elements["tabcontainer"] = SNDK.tools.newElement ("div", {className: "Tabs", appendTo: _elements["container"]});
		
				// Top
				_elements["top"] = SNDK.tools.newElement ("div", {appendTo: _elements["container"]});
		
				// TopLeft
				_elements["topleft"] = SNDK.tools.newElement ("div", {className: "TopLeft", appendTo: _elements["top"]});
					
				// TopCenter
				_elements["topcenter"] = SNDK.tools.newElement ("div", {className: "TopCenter", appendTo: _elements["top"]});
				_elements["topcenter"].style.overflow = "hidden";
									
				// TopRight
				_elements["topright"] = SNDK.tools.newElement ("div", {className: "TopRight", appendTo: _elements["top"]});
													
				// Content
				_elements["content"] = SNDK.tools.newElement ("div", {appendTo: _elements["container"]});
				_elements["content"].style.clear = "both";			
					
				// ContentLeft
				_elements["contentleft"] = SNDK.tools.newElement ("div", {className: "ContentLeft", appendTo: _elements["content"]});
							
				// ContentCenter
				_elements["contentcenter"] = SNDK.tools.newElement ("div", {className: "ContentCenter", appendTo: _elements["content"]});		
				_elements["contentcenter"].style.overflow = "hidden";
																												
				// ContentRight
				_elements["contentright"] = SNDK.tools.newElement ("div", {className: "ContentRight", appendTo: _elements["content"]});
				
				// Bottom	
				_elements["bottom"] = SNDK.tools.newElement ("div", {appendTo: _elements["container"]});
				_elements["bottom"].style.clear = "both";		
								
				// BottomLeft
				_elements["bottomleft"] = SNDK.tools.newElement ("div", {className: "BottomLeft", appendTo: _elements["bottom"]});	
		
				// BottomCenter
				_elements["bottomcenter"] = SNDK.tools.newElement ("div", {className: "BottomCenter", appendTo: _elements["bottom"]});
					
				// BottomRight
				_elements["bottomright"] = SNDK.tools.newElement ("div", {className: "BottomRight", appendTo: _elements["bottom"]});
		
				// TabButtons
				_elements["tabbuttons"] = new Array ();
																	
				// Hook Events
				window.addEvent (window, 'SUIREFRESH', refresh);	
			}	
				
			// ------------------------------------
			// refresh
			// ------------------------------------		
			function refresh ()
			{	
				if (!SNDK.debugStopRefresh)
				{
				// Only refresh if control has been initalized.	
				if (_temp.initialized)
				{
					_elements["container"].className = _attributes.stylesheet;
				}
				
				changeTab (_temp.selectedTab);
				setDimensions ();
				}
			}
			
			// ------------------------------------
			// dispose
			// ------------------------------------			
			function dispose ()
			{
				window.removeEvent (window, 'SUIREFRESH', refresh);				
			}	
			
			// ------------------------------------
			// updateCache
			// ------------------------------------		
			function updateCache ()
			{
				if (!_temp.cacheUpdated)
				{		
					_temp.cache["containerPadding"] = SNDK.tools.getElementStyledPadding (_elements["container"]);
					_temp.cache["containerWidth"] = (SNDK.tools.getElementStyledWidth (_elements["topleft"]) + SNDK.tools.getElementStyledWidth (_elements["topright"]));
					_temp.cache["containerHeight"] = (SNDK.tools.getElementStyledHeight (_elements["tabcontainer"]) + SNDK.tools.getElementStyledHeight (_elements["topleft"]) + SNDK.tools.getElementStyledHeight (_elements["bottomleft"]));
				}
				
				_temp.cacheUpdated = true;	
			}	
						
			// ------------------------------------
			// setDefaultAttributes
			// ------------------------------------					
			function setAttributes ()
			{
				// Stylesheet
				if (!_attributes.stylesheet) 
					_attributes.stylesheet = "SUITabview";	
			
				// Managed
				if (!_attributes.managed)
					_attributes.managed = false;				
			
				// Width
				if (!_attributes.width) 
					_attributes.width = "100%";				
					
				if (_attributes.width.substring (_attributes.width.length - 1) == "%")
				{
					_attributes.widthType = "percent";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 1)			
				}
				else
				{
					_attributes.widthType = "pixel";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 2)
				}		
				
				// Height
				if (!_attributes.height) 
					_attributes.height = "100%";
					
				if (_attributes.height.substring (_attributes.height.length - 1) == "%")
				{
					_attributes.heightType = "percent";
					_attributes.height = _attributes.height.substring (0, _attributes.height.length - 1)			
				}
				else
				{
					_attributes.heightType = "pixel";
					_attributes.height = _attributes.height.substring (0, _attributes.height.length - 2)
				}								
						
				_attributes.tabs = new Array ();
			}		
								
			// ------------------------------------
			// setDimensions
			// ------------------------------------
			function setDimensions ()
			{		
				// Only set dimensions if control has been initalized.	
				if (_temp.initialized)
				{	
					var width = {};
					var height = {};
		
					if (!_attributes.managed && _attributes.widthType != "pixel")
					{					
						width.container = ((SNDK.tools.getElementInnerWidth (_elements["container"].parentNode) * _attributes.width) / 100) - _temp.cache.containerPadding["horizontal"];
					}
					else
					{			
						if (_attributes.managed && _attributes.widthType == "percent")
						{
		
							width.container = _attributes.managedWidth - _temp.cache.containerPadding["horizontal"];
						}
						else
						{
							width.container = _attributes.width - _temp.cache.containerPadding["horizontal"];
						}			
					}	
		
					if (!_attributes.managed && _attributes.heightType != "pixel")
					{					
						height.container = ((SNDK.tools.getElementInnerHeight (_elements["container"].parentNode) * _attributes.height) / 100) - _temp.cache.containerPadding["vertical"];
					}
					else
					{			
						if (_attributes.managed && _attributes.heightType == "percent")
						{
							height.container = _attributes.managedHeight - _temp.cache.containerPadding["vertical"];				
						}
						else
						{
							height.container = _attributes.height - _temp.cache.containerPadding["vertical"];
						}			
					}
					
					width.topCenter = width.container - _temp.cache.containerWidth;
					width.contentCenter = width.container - _temp.cache.containerWidth;
					width.bottomCenter = width.container - _temp.cache.containerWidth;
				
					height.contentLeft = height.container - _temp.cache.containerHeight;
					height.contentCenter = height.container - _temp.cache.containerHeight;
					height.contentRight = height.container - _temp.cache.containerHeight;
							
					_elements["container"].style.width = width.container +"px";
					_elements["topcenter"].style.width = width.topCenter +"px";
					_elements["contentcenter"].style.width = width.contentCenter +"px";		
					_elements["bottomcenter"].style.width = width.bottomCenter +"px";				
		
					_elements["container"].style.height = height.container +"px";
					_elements["contentleft"].style.height = height.contentLeft +"px";
					_elements["contentcenter"].style.height = height.contentCenter +"px";			
					_elements["contentright"].style.height = height.contentRight +"px";		
											
					for (index in _attributes.tabs)
					{
						var tab = _attributes.tabs[index];
						var e = _attributes.tabs[index]._elements["container"];
						
						var dimensions = {};
						
						dimensions.width = width.contentCenter - SNDK.tools.getElementStyledPadding (e)["horizontal"];
						dimensions.height = height.contentCenter - SNDK.tools.getElementStyledPadding (e)["vertical"];
						
						e.style.width = dimensions.width +"px";
						e.style.height = dimensions.height +"px";
						
						var combinedheightofchildren = 0;
								
						if (tab._attributes.canScroll)
						{
							for (index in tab._temp.uiElements)
							{		
								if (tab._temp.uiElements[index]._attributes.heightType == "pixel")
								{									
									combinedheightofchildren += parseInt (tab._temp.uiElements[index]._attributes.height);
								}
							}						
						
							if (combinedheightofchildren > dimensions.height)
							{
								dimensions.width = dimensions.width - window.scrollbarWidth;
							}			
						}											
									
						for (index in tab._temp.uiElements)
						{
							if (tab._temp.uiElements[index]._attributes.widthType == "percent")
							{
								tab._temp.uiElements[index]._attributes.managedWidth = (dimensions.width * tab._temp.uiElements[index]._attributes.width) / 100;
							}
					
							if (tab._temp.uiElements[index]._attributes.heightType == "percent")
							{
								tab._temp.uiElements[index]._attributes.managedHeight = (dimensions.height * tab. _temp.uiElements[index]._attributes.height) / 100;
							}
						
							tab._temp.uiElements[index].refresh ();
						}								
					}					
				}
			}	
						
			function changeTab (tab)
			{
				if (tab != _temp.selectedTab)
				{
					if (_temp.selectedTab > -1)
					{
						_elements["tabbuttons"][_temp.selectedTab].className = "TabButton";
						_attributes.tabs[_temp.selectedTab]._elements["container"].style.display = "none";
						
						//SNDK.tools. changeOpacityByObject (_attributes.tabs[_temp.selectedTab]._elements["container"], 0);
					}
								
					_elements["tabbuttons"][tab].className = "TabButton TabButtonSelected";
					_attributes.tabs[tab]._elements["container"].style.display = "block";
					//SNDK.tools. changeOpacityByObject (_attributes.tabs[tab]._elements["container"], 100);
								
					_temp.selectedTab = tab;									
					
					for (index in _attributes.tabs[_temp.selectedTab]._temp.uiElements)
					{		
						_attributes.tabs[_temp.selectedTab]._temp.uiElements[index].refresh ();
					}	
				}
			}	
								
			// ------------------------------------
			// Public functions
			// ------------------------------------
			// ------------------------------------
			// refresh
			// ------------------------------------				
			function functionRefresh ()
			{
				refresh ();
			}	
			
			// ------------------------------------
			// dispose
			// ------------------------------------				
			function functionDispose ()
			{
				dispose ();
			}					
			
			function newTab (attributes)
			{
				var _attributes = attributes;
				var _elements = new Array ();
				var _temp =	{ uiElements: new Array ()
						}
		
				setAttributes ();
				
				// Private functions		
				this._attributes = _attributes;
				this._elements = _elements;
				this._temp = _temp;
		
				// Functions						
				this.addUIElement = functionAddUIElement;
				this.setAttribute = functionSetAttribute;
				this.getAttribute = functionGetAttribute;
		
				// Initialize
				construct ();
				
				// ------------------------------------
				// Private functions
				// ------------------------------------
				function construct ()
				{
					_elements["container"] = SNDK.tools.newElement ("div", {className: "Tab", id: _attributes.id, appendTo: _attributes.appendTo});
					_elements["container"].style.position = "absolute";
					_elements["container"].style.zIndex = 0;		
					_elements["container"].style.display = "none";
					
					if (_attributes.canScroll)
					{
						_elements["container"].style.overflow = "auto";		
					}		
					else
					{
						_elements["container"].style.overflow = "hidden";		
					}			
				}
				
				// ------------------------------------
				// setAttributes
				// ------------------------------------																
				function setAttributes ()
				{
				}
		
				// ------------------------------------
				// Public functions
				// ------------------------------------				
				// ------------------------------------
				// addUIElement
				// ------------------------------------																
				function functionAddUIElement (element)
				{
					var count = _temp.uiElements.length;
		
				 	_temp.uiElements[count] = element;
		 	
				 	element.setAttribute ("managed", true);
				 	element.setAttribute ("appendTo", _elements["container"]);		 
				}	
				
				// ------------------------------------
				// getAttribute
				// ------------------------------------						
				function functionGetAttribute (attribute)
				{
					switch (attribute)
					{			
						case "tag":
						{
							return _attributes[attribute];
						}
						
						case "selected":
						{
							return _attributes[attribute];
						}
								
						default:
						{
							throw "No attribute with the name '"+ attribute +"' exist in this object";
						}
					}	
				}
		
				// ------------------------------------
				// setAttribute
				// ------------------------------------						
				function functionSetAttribute (attribute, value)
				{
					switch (attribute)
					{			
						case "tag":
						{
							_attributes[attribute] = value;
							break;
						}
				
						case "selected":
						{
							_attributes[attribute] = value;
							break;
						}
				
						default:
						{
							throw "No attribute with the name '"+ attribute +"' exist in this object";
						}
					}	
				}							
			}
				
			// ------------------------------------
			// addTab
			// ------------------------------------						
			function functionAddTab (attributes)
			{
				var count = _attributes.tabs.length;
				attributes.appendTo = _elements["contentcenter"];
				attributes.id = _attributes.id +"-tab-"+ count;
				
				_attributes.tabs[count] = new newTab (attributes);
		
				_elements["tabbuttons"][count] = SNDK.tools.newElement ("div", {className: "TabButton", id: _attributes.id +"-button-"+ count ,appendTo: _elements["tabcontainer"]});
				_elements["tabbuttons"][count].onmousedown = eventOnClickTab;
				SNDK.tools.textSelectionDisable (_elements["tabbuttons"][count]);
		
				SNDK.tools.newElement ("div", {className: "Left", appendTo: _elements["tabbuttons"][count]});
				SNDK.tools.newElement ("div", {className: "Center", appendTo: _elements["tabbuttons"][count], innerHTML: attributes.label});	
				SNDK.tools.newElement ("div", {className: "Right", appendTo: _elements["tabbuttons"][count]});			
							
				if (attributes.selected)
				{
					changeTab (count)
				}						
												
				refresh ();	
			}	
			
			// ------------------------------------
			// getTab
			// ------------------------------------						
			function functionGetTab (tag)
			{
				for (index in _attributes.tabs)
				{		
					if (_attributes.tabs[index].getAttribute ("tag") == tag)
					{
						return _attributes.tabs[index];
					}
				}
				
				throw "No tab with tag '"+ tag +"' exist in this tabview";
			}
				
			// ------------------------------------
			// getAttribute
			// ------------------------------------						
			function functionGetAttribute (attribute)
			{
				switch (attribute)
				{
					case "id":
					{
						return _attributes[attribute];
					}
					
					case "tag":
					{
						return _attributes[attribute];
					}
					
					case "stylesheet":
					{
						return _attributes[attribute];
					}
					
					case "width":
					{
						if (_attributes.widthType == "percent")
						{
							return _attributes.width + "%";
						}
		
						if (_attributes.widthType == "pixel")
						{
							return _attributes.width + "px";
						}
					}
					
					case "height":
					{
						if (_attributes.heightType == "percent")
						{
							return _attributes.height + "%";
						}
		
						if (_attributes.heightType == "pixel")
						{
							return _attributes.height + "px";
						}
					}
					
					case "appendTo":
					{
						return _attributes[attribute];			
					}			
					
					case "managed":
					{
						return _attributes[attribute];			
					}
						
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}
			
			// ------------------------------------
			// setAttribute
			// ------------------------------------						
			function functionSetAttribute (attribute, value)
			{
				switch (attribute)
				{
					case "id":
					{
						throw "Attribute with name ID is ready only.";
						break;
					}
					
					case "tag":
					{
						_attributes[attribute] = value;
						break;
					}
					
					case "stylesheet":
					{
						_attributes[attribute] = value;
						break;				
					}
					
					case "width":
					{
						if (value.substring (value.width.length, 3) == "%")
						{
							_attributes.widthType = "percent";
							_attributes.width = value.width.substring (0, value.width.length - 1)			
						}
						else
						{
							_attributes.widthType = "pixel";
							_attributes.width = value.width.substring (0, value.width.length - 2)
						}	
						break;			
					}
					
					case "appendTo":
					{
						_attributes[attribute] = value;	
						_attributes.appendTo.appendChild (_elements["container"]);			
						break;
					}			
					
					case "managed":
					{
						_attributes[attribute] = value;
		
						if (value)
						{
							window.removeEvent (window, 'SUIREFRESH', refresh);		
						}
						else
						{
							window.addEvent (window, 'SUIREFRESH', refresh);
						}
		
						break;
					}
							
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}																	
							
			// ------------------------------------
			// Events
			// ------------------------------------		
			function eventOnClickTab ()
			{
				changeTab (this.id.split ("-")[6]);
			}			
		},
	
		// -------------------------------------------------------------------------------------------------------------------------
		// text ([attributes])
		// -------------------------------------------------------------------------------------------------------------------------
		//
		// .getAttribute (string)
		// .setAttribute (string, string)
		//	
		// 		id 				get
		//		tag				get/set
		//		name			get/set
		//		stylesheet		get/set
		//		appendTo		get/set
		//		managed			get/set
		//		width			get/set
		//		height			get
		//		disabled		get/set
		//		text			get/set
		//
		/**
		 * @constructor
		 */
		text : function (attributes)
		{	
			var _elements = new Array ();
			var _attributes = attributes;
					
			var _temp = { initialized: false,
					  	  cache: new Array ()
						};
					
			_attributes.id = SNDK.tools.newGuid ()	
							
			setAttributes ();		
			
			// Private functions
			this._attributes = _attributes;
			this._elements = _elements;
			this._temp = _temp;	
			this._init = init;	
			
			// Functions
			this.refresh = functionRefresh;	
			this.dispose = functionDispose;
			this.getAttribute = functionGetAttribute;
			this.setAttribute = functionSetAttribute;
				
			// Construct
			construct ();
			
			// Initialize	
			SNDK.SUI.addInit (this);			
			
			// ------------------------------------
			// Private functions
			// ------------------------------------
			// ------------------------------------
			// init
			// ------------------------------------
			function init ()
			{
				updateCache ();
				
			//	_attributes.heightType = "pixel";
			//	_attributes.height = _temp.cache["containerPadding"]["vertical"] + _temp.cache["containerHeight"] +"px";
			}
		
			// ------------------------------------
			// construct
			// ------------------------------------	
			function construct ()
			{								
				// Container
				_elements["container"] = SNDK.tools.newElement ("div", {});
				_elements["container"].setAttribute ("id", _attributes.id);		
					
				// Text
				_elements["text"] = SNDK.tools.newElement ("div", {className: "Text", appendTo: _elements["container"]});
																				
				// Hook Events
				window.addEvent (window, 'SUIREFRESH', refresh);				
			}		
				
			// ------------------------------------
			// refresh
			// ------------------------------------	
			function refresh ()
			{
				if (_temp.initialized)
				{
					if (_attributes.disabled)
					{
						_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"Disabled";
					}
					else
					{
						_elements["container"].className = _attributes.stylesheet;
					}	
						
					_elements["text"].innerHTML = _attributes.text;
				}
				
				setDimensions ();
			}	
			
			function functionDispose ()
			{		
				window.removeEvent (window, 'SUIREFRESH', refresh);	
			}
		
			// ------------------------------------
			// updateCache
			// ------------------------------------		
			function updateCache ()
			{
		//		if (!_temp.cacheUpdated)
		//		{
		//			_temp.cache["containerPadding"] = SNDK.tools.getElementStyledPadding (_elements["container"]);
		//			_temp.cache["containerWidth"] = (SNDK.tools.getElementStyledWidth (_elements["left"]) + SNDK.tools.getElementStyledWidth (_elements["right"]));
		//			_temp.cache["containerHeight"] = SNDK.tools.getElementStyledHeight (_elements["center"]);			
		//		}
				
				_temp.cacheUpdated = true;	
			}
		
			// -------------------------------------
			// setAttributes
			// -------------------------------------
			function setAttributes ()
			{								
				// Name
				if (!_attributes.name)		
					_attributes.name = "";	
		
				// Stylesheet
				if (!_attributes.stylesheet)
					_attributes.stylesheet = "SUIText";		
		
				// Managed
				if (!_attributes.managed)		
					_attributes.managed = false;	
			
				// Width
				if (!_attributes.width) 
					_attributes.width = "100%";
					
				if (_attributes.width.substring (_attributes.width.length - 1) == "%")
				{
					_attributes.widthType = "percent";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 1)			
				}
				else
				{
					_attributes.widthType = "pixel";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 2)
				}			
		
				// Disabled
				if (!_attributes.disabled)		
					_attributes.disabled = false;				
															
				// Text
				if (!_attributes.text)
					_attributes.text = "";						
			}
				
			// -------------------------------------
			// setDimensions
			// -------------------------------------
			function setDimensions ()
			{
				if (_temp.initialized)
				{
					var containerwidth = 0;
				
					if (_attributes.widthType == "percent")
					{								
						setTimeout (	function () 
								{	
									var parentwidth = SNDK.tools.getElementInnerWidth (_elements["container"].parentNode);	
									var width = parentwidth - SNDK.tools.getElementStyledPadding (_elements["container"])["horizontal"] - containerwidth +"px";
															
									_elements["text"].style.width = width;
								}, 0);						
					}
					else
					{
						var width = _attributes.width  - containerwidth +"px";
		
						_elements["container"].style.width = _attributes.width +"px";
						_elements["text"].style.width = width;
					}		
				}
			}
			
			// ------------------------------------
			// Public functions
			// ------------------------------------
			// ------------------------------------
			// refresh
			// ------------------------------------				
			function functionRefresh ()
			{
				refresh ();
			}	
				
			// ------------------------------------
			// getAttribute
			// ------------------------------------						
			function functionGetAttribute (attribute)
			{
				switch (attribute)
				{
					case "id":
					{
						return _attributes[attribute];
					}
					
					case "tag":
					{
						return _attributes[attribute];
					}
					
					case "name":
					{
						return _attributes[attribute];
					}
		
					case "stylesheet":
					{
						return _attributes[attribute];
					}
					
					case "width":
					{
						if (_attributes.widthType == "percent")
						{
							return _attributes.width + "%";
						}
		
						if (_attributes.widthType == "pixel")
						{
							return _attributes.width + "px";
						}
					}
					
					case "height":
					{
						if (_attributes.heightType == "percent")
						{
							return _attributes.height + "%";
						}
		
						if (_attributes.heightType == "pixel")
						{
							return _attributes.height + "px";
						}
					}
					
					case "appendTo":
					{
						return _attributes[attribute];			
					}			
					
					case "managed":
					{
						return _attributes[attribute];			
					}
		
					case "text":
					{
						return _attributes[attribute];
					}
							
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}
			
			// ------------------------------------
			// setAttribute
			// ------------------------------------						
			function functionSetAttribute (attribute, value)
			{
				switch (attribute)
				{
					case "id":
					{
						throw "Attribute with name ID is ready only.";
						break;
					}
					
					case "tag":
					{
						_attributes[attribute] = value;
						break;
					}
					
					case "name":
					{
						_attributes[attribute] = value;
						break;
					}
		
					case "stylesheet":
					{
						_attributes[attribute] = value;
						break;				
					}
					
					case "width":
					{
						if (value.substring (value.width.length, 3) == "%")
						{
							_attributes.widthType = "percent";
							_attributes.width = value.width.substring (0, value.width.length - 1)			
						}
						else
						{
							_attributes.widthType = "pixel";
							_attributes.width = value.width.substring (0, value.width.length - 2)
						}	
						break;			
					}
					
					case "height":
					{
						throw "Attribute with name HEIGHT is ready only.";
						break;			
					}			
					
					case "appendTo":
					{
						_attributes[attribute] = value;	
						_attributes.appendTo.appendChild (_elements["container"]);			
						break;
					}			
					
					case "managed":
					{
						_attributes[attribute] = value;
		
						if (value)
						{
							window.removeEvent (window, 'SUIREFRESH', refresh);		
						}
						else
						{
							window.addEvent (window, 'SUIREFRESH', refresh);
						}
		
						break;
					}
		
					case "disabled":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
		
					case "text":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
							
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}								
			
			function functionDispose ()
			{
				dispose ();
			}
			
			// ------------------------------------
			// Events
			// ------------------------------------
		},
	
		// -------------------------------------------------------------------------------------------------------------------------
		// htmlview ([attributes])
		// -------------------------------------------------------------------------------------------------------------------------
		//
		//	.addItem (item) 
		//
		//	.refresh ()
		//	.getAttribute (key)
		//	.setAttribute (key, value)
		//
		//		id		get
		//		tag		get/set
		//		stylesheet	get/set
		//		width		get/set
		//		height		get/set
		//		managed		get/set
		//		appendTo	get/set
		//		disabled	get/set
		//		readOnly	get/set
		//		focus		get/set
		//		onFocus		get/set
		//		onBlur		get/set
		//		onChange	get/set
		//
		//
		//
		//
		// .addItem (array)
		// .removeItem (int)
		// .moveItemUp ([int])
		// .moveItemDowm ([int])
		// .moveItemTo (int, int)
		//
		// .id ()
		// .tag (string)
		//
		// .stylesheet (string)
		// .widthType (string)
		// .width (int)
		// .heightType (string)
		// .height (int)
		//
		// .focus (bool)
		// .disabled (bool)
		// .readOnly (bool)
		//
		// .items (array)
		// .selectedIndex (int)
		// .selectedItem ()
		// .count ()
		// .clear ()
		//
		// .onFocus (function)
		// .onBlur (function)
		// .onChange (function)
		// -------------------------------------------------------------------------------------------------------------------------
		/**
		 * @constructor
		 */
		htmlview : function (attributes)
		{
			var _elements = new Array ();
			var _attributes = attributes;	
			var _temp = 	{ initialized: false,
					  cache: new Array ()
					};
		
			_attributes.id = SNDK.tools.newGuid ();
			
			setAttributes ();	
			
			// Private functions
			this._attributes = _attributes;
			this._elements = _elements;
			this._temp = _temp;	
			this._init = init;
			
			// Functions
			this.refresh = functionRefresh;
			this.dispose = functionDispose;
			this.getAttribute = functionGetAttribute;
			this.setAttribute = functionSetAttribute;
			
			// Construct
			construct ();
										
			// Initialize
			SNDK.SUI.addInit (this);	
			
			// ------------------------------------
			// Private functions
			// ------------------------------------
			// ------------------------------------
			// init
			// ------------------------------------
			function init ()
			{	
				updateCache ();
				
				if (_attributes.url != null)
				{
					//var test = '<object width="100%" height="100%" id="foo" name="foo" type="text/html" data="http://www.w3schools.com/"></object>';
				
					_elements["render"].data = _attributes.url;
				}
				else
				{
					_elements["render"].data = _attributes.content;
				}
			}
			
			// ------------------------------------
			// contruct
			// ------------------------------------
			function construct ()
			{
				// Container
				_elements["container"] = SNDK.tools.newElement ("div", {});
				_elements["container"].setAttribute ("id", _attributes.id);		
				_elements["container"].className = _attributes.stylesheet;		
															
				// Top
				_elements["top"] = SNDK.tools.newElement ("div", null, null, _elements["container"]);
		
				// TopLeft
				_elements["topleft"] = SNDK.tools.newElement ("div", "TopLeft", null, _elements["top"]);
					
				// TopCenter
				_elements["topcenter"] = SNDK.tools.newElement ("div", "TopCenter", null, _elements["top"]);
				_elements["topcenter"].style.overflow = "hidden";
								
				// TopRight
				_elements["topright"] = SNDK.tools.newElement ("div", "TopRight", null, _elements["top"]);
				
				// Content
				_elements["content"] = SNDK.tools.newElement ("div", null, null, _elements["container"]);
				_elements["content"].style.clear = "both";			
					
				// ContentLeft
				_elements["contentleft"] = SNDK.tools.newElement ("div", "ContentLeft", null, _elements["content"]);
							
				// ContentCenter
				_elements["contentcenter"] = SNDK.tools.newElement ("div", "ContentCenter", null, _elements["content"]);		
				_elements["contentcenter"].style.overflow = "hidden";
				
				// Content
				_elements["render"] = SNDK.tools.newElement ("iframe", {name: _attributes.name, width: "100%", height: "100%", appendTo: _elements["contentcenter"]});		
																												
				// ContentRight
				_elements["contentright"] = SNDK.tools.newElement ("div", "ContentRight", null, _elements["content"]);
				
				// Bottom	
				_elements["bottom"] = SNDK.tools.newElement ("div", null, null, _elements["container"]);
				_elements["bottom"].style.clear = "both";		
								
				// BottomLeft
				_elements["bottomleft"] = SNDK.tools.newElement ("div", "BottomLeft", null, _elements["bottom"]);	
		
				// BottomCenter
				_elements["bottomcenter"] = SNDK.tools.newElement ("div", "BottomCenter", null, _elements["bottom"]);
					
				// BottomRight
				_elements["bottomright"] = SNDK.tools.newElement ("div", "BottomRight", null, _elements["bottom"]);
					
				// Hook Events
				_elements["contentcenter"].onfocus = eventOnFocus;
				_elements["contentcenter"].onblur = eventOnBlur;
				_elements["render"].onload = eventOnLoad;
								
				window.addEvent (window, 'SUIREFRESH', refresh);			
			}	
				
			// ------------------------------------
			// refresh
			// ------------------------------------		
			function refresh ()
			{		
				if (_temp.initialized)
				{
					if (_attributes.disabled)
					{
						_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"Disabled";
						_elements["contentcenter"].removeAttribute("tabIndex");
						
						for (index in _elements["items"])
						{
							SNDK.tools.opacityChange (_elements["items"][index], 40);
						}				
					} 
					else
					{			
						_elements["contentcenter"].setAttribute("tabIndex", 0);
						
						if (_attributes.focus)
						{
							_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"Focus";
							setFocus ();
						}
						else
						{
							_elements["container"].className = _attributes.stylesheet;
						}						
					}	
				}		
		
				setDimensions ();
			}
			
			function dispose ()
			{
				window.removeEvent (window, 'SUIREFRESH', refresh);	
			}
			
			function functionDispose ()
			{		
				dispose ();
			}
				
			// ------------------------------------
			// updateCache
			// ------------------------------------		
			function updateCache ()
			{
				if (!_temp.cacheUpdated)
				{
					_temp.cache["containerPadding"] = SNDK.tools.getElementStyledPadding (_elements["container"]);
					_temp.cache["containerWidth"] = SNDK.tools.getElementStyledWidth (_elements["topleft"]) + SNDK.tools.getElementStyledWidth (_elements["topright"]);
					_temp.cache["containerHeight"] = SNDK.tools.getElementStyledHeight (_elements["topleft"]) + SNDK.tools.getElementStyledHeight (_elements["bottomleft"]);
				}
				
				_temp.cacheUpdated = true;	
			}	
		
			// ------------------------------------
			// setattributes
			// ------------------------------------		
			function setAttributes ()
			{				
				// Stylesheet
				if (!_attributes.stylesheet)
					_attributes.stylesheet = "SUIHTMLView";
						
				// Name
				if (!_attributes.name) 
					_attributes.name = "";									
						
				// Managed
				if (!_attributes.managed) 
					_attributes.managed = false;					
						
				// Width		
				if (!_attributes.width) 
					_attributes.width = "100%";				
					
				if (_attributes.width.substring (_attributes.width.length - 1) == "%")
				{
					_attributes.widthType = "percent";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 1)			
				}
				else
				{
					_attributes.widthType = "pixel";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 2)
				}				
				
				// Height
				if (!_attributes.height) 
					_attributes.height = "100%";				
					
				if (_attributes.height.substring (_attributes.height.length - 1) == "%")
				{
					_attributes.heightType = "percent";
					_attributes.height = _attributes.height.substring (0, _attributes.height.length - 1)			
				}
				else
				{
					_attributes.heightType = "pixel";
					_attributes.height = _attributes.height.substring (0, _attributes.height.length - 2)
				}								
						
				// Focus	
				if (!_attributes.focus)
					_attributes.focus = false;
					
				// Content
				if (!_attributes.content)
					_attributes.content = "";			
			}	
			
			// ------------------------------------
			// setDimensions
			// ------------------------------------
			function setDimensions ()
			{
				if (_temp.initialized)
				{		
					var width = {};
					var height = {};
					var combinedheightofchildren = 0;
		
					if (!_attributes.managed && _attributes.widthType != "pixel")
					{					
						width.container = ((SNDK.tools.getElementInnerWidth (_elements["container"].parentNode) * _attributes.width) / 100) - _temp.cache.containerPadding["horizontal"];
					}
					else
					{			
						if (_attributes.managed && _attributes.widthType == "percent")
						{
		
							width.container = _attributes.managedWidth - _temp.cache.containerPadding["horizontal"];
						}
						else
						{
							width.container = _attributes.width - _temp.cache.containerPadding["horizontal"];
						}			
					}	
		
		
					if (!_attributes.managed && _attributes.heightType != "pixel")
					{					
						height.container = ((SNDK.tools.getElementInnerHeight (_elements["container"].parentNode) * _attributes.height) / 100) - _temp.cache.containerPadding["vertical"];
					}
					else
					{			
						if (_attributes.managed && _attributes.heightType == "percent")
						{
							height.container = _attributes.managedHeight - _temp.cache.containerPadding["vertical"];				
						}
						else
						{
							height.container = _attributes.height - _temp.cache.containerPadding["vertical"];
						}			
					}	
								
					width.topCenter = width.container - _temp.cache.containerWidth;
					width.contentCenter = width.container - _temp.cache.containerWidth;
					width.bottomCenter = width.container - _temp.cache.containerWidth;
					
					height.contentLeft = height.container - _temp.cache.containerHeight;
					height.contentCenter = height.container - _temp.cache.containerHeight;
					height.contentRight = height.container - _temp.cache.containerHeight;
		
					
					_elements["container"].style.width = width.container + "px";
					_elements["topcenter"].style.width = width.topCenter + "px";
					_elements["contentcenter"].style.width = width.contentCenter +"px";
					_elements["bottomcenter"].style.width = width.bottomCenter +"px";
								
					_elements["container"].style.height = height.container + "px";
					_elements["contentleft"].style.height = height.contentLeft + "px";
					_elements["contentcenter"].style.height = height.contentCenter +"px";
					_elements["contentright"].style.height = height.contentRight +"px";				
				}		
			}
			
			// ------------------------------------
			// setFocus
			// ------------------------------------				
			function setFocus ()
			{
				setTimeout ( function () { _elements["contentcenter"].focus (); }, 2);	
			}		
			
			// ------------------------------------
			// setContent
			// ------------------------------------				
			function setContent (content)
			{
				if (_temp.initialized)
				{
					_elements["contentcenter"].innerHTML = content;
				}
				else
				{
					_attributes.content = content;
				}
			}		
			
			// ------------------------------------
			// getContent
			// ------------------------------------				
			function getContent ()
			{
				//return _elements["render"];
				return document.getElementById (_attributes.name).contentWindow;
			}		
				
			// ------------------------------------
			// Public functions
			// ------------------------------------
			function functionRefresh ()
			{
				refresh ();
			}
			
			// ------------------------------------
			// getAttribute
			// ------------------------------------						
			function functionGetAttribute (attribute)
			{
				switch (attribute)
				{
					case "id":
					{
						return _attributes[attribute];
					}
					
					case "tag":
					{
						return _attributes[attribute];
					}
					
					case "stylesheet":
					{
						return _attributes[attribute];
					}
					
					case "width":
					{
						if (_attributes.widthType == "percent")
						{
							return _attributes.width + "%";
						}
		
						if (_attributes.widthType == "pixel")
						{
							return _attributes.width + "px";
						}
					}
					
					case "height":
					{
						if (_attributes.heightType == "percent")
						{
							return _attributes.height + "%";
						}
		
						if (_attributes.heightType == "pixel")
						{
							return _attributes.height + "px";
						}
					}
					
					case "appendTo":
					{
						return _attributes[attribute];			
					}			
					
					case "managed":
					{
						return _attributes[attribute];			
					}
					
					case "content":
					{
						return getContent ();
					}
										
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}
			
			// ------------------------------------
			// setAttribute
			// ------------------------------------						
			function functionSetAttribute (attribute, value)
			{
				switch (attribute)
				{
					case "id":
					{
						throw "Attribute with name ID is ready only.";
						break;
					}
					
					case "tag":
					{
						_attributes[attribute] = value;
						break;
					}
					
					case "stylesheet":
					{
						_attributes[attribute] = value;
						break;				
					}
					
					case "width":
					{
						if (value.substring (value.width.length, 3) == "%")
						{
							_attributes.widthType = "percent";
							_attributes.width = value.width.substring (0, value.width.length - 1)			
						}
						else
						{
							_attributes.widthType = "pixel";
							_attributes.width = value.width.substring (0, value.width.length - 2)
						}	
						break;			
					}
					
					case "appendTo":
					{
						_attributes[attribute] = value;	
						_attributes.appendTo.appendChild (_elements["container"]);			
						break;
					}			
					
					case "managed":
					{
						_attributes[attribute] = value;
		
						if (value)
						{
							window.removeEvent (window, 'SUIREFRESH', refresh);		
						}
						else
						{
							window.addEvent (window, 'SUIREFRESH', refresh);
						}
		
						break;
					}
					
					case "content":
					{
						setContent (value);
						break;
					}
					
					case "onLoad":
					{
						_attributes[attribute] = value;
						break;
					}
										
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}									
			
				
			function functionDispose ()
			{
				dispose ();
			}	
									
			// ------------------------------------
			// Events
			// ------------------------------------					
			// ------------------------------------
			// onFocus
			// ------------------------------------					
			function eventOnFocus ()
			{
				if (!_attributes.disabled)
				{
					if (!_attributes.focus)
					{
						_attributes.focus = true;
						refresh ();
		
						if (_attributes.onFocus != null)
						{
							setTimeout( function ()	{ _attributes.onFocus (); }, 1);
						}			
					}				
				}
			}
		
			// ------------------------------------
			// onBlur
			// ------------------------------------							
			function eventOnBlur ()
			{
				if (!_attributes.disabled)
				{
					if (_attributes.focus)
					{	
						_attributes.focus = false;
						refresh ();
		
						if (_attributes.onBlur != null)
						{
							setTimeout( function ()	{ _attributes.onBlur (); }, 1);
						}			
					}	
				}
			}
			
			// ------------------------------------
			// onLoad
			// ------------------------------------							
			function eventOnLoad ()
			{
				if (_attributes.onLoad != null)
				{
					setTimeout( function ()	{ _attributes.onLoad (); }, 1);
				}			
			}	
		},
	
		// -------------------------------------------------------------------------------------------------------------------------
		// image ([attributes])
		// -------------------------------------------------------------------------------------------------------------------------
		//
		//	.addItem (item) 
		//
		//	.refresh ()
		//	.getAttribute (key)
		//	.setAttribute (key, value)
		//
		//		id		get
		//		tag		get/set
		//		stylesheet	get/set
		//		width		get/set
		//		height		get/set
		//		managed		get/set
		//		appendTo	get/set
		//		disabled	get/set
		//		readOnly	get/set
		//		focus		get/set
		//		onFocus		get/set
		//		onBlur		get/set
		//		onChange	get/set
		//
		//
		//
		//
		// .addItem (array)
		// .removeItem (int)
		// .moveItemUp ([int])
		// .moveItemDowm ([int])
		// .moveItemTo (int, int)
		//
		// .id ()
		// .tag (string)
		//
		// .stylesheet (string)
		// .widthType (string)
		// .width (int)
		// .heightType (string)
		// .height (int)
		//
		// .focus (bool)
		// .disabled (bool)
		// .readOnly (bool)
		//
		// .items (array)
		// .selectedIndex (int)
		// .selectedItem ()
		// .count ()
		// .clear ()
		//
		// .onFocus (function)
		// .onBlur (function)
		// .onChange (function)
		// -------------------------------------------------------------------------------------------------------------------------
		/**
		 * @constructor
		 */
		image : function (attributes)
		{
			var _elements = new Array ();
			var _attributes = attributes;	
			var _temp = 	{ initialized: false,
					  cache: new Array ()
					};
		
			_attributes.id = SNDK.tools.newGuid ();
			
			setAttributes ();	
			
			// Private functions
			this._attributes = _attributes;
			this._elements = _elements;
			this._temp = _temp;	
			this._init = init;
			
			// Functions
			this.refresh = functionRefresh;
			this.dispose = functionDispose;
			this.getAttribute = functionGetAttribute;
			this.setAttribute = functionSetAttribute;
			
			// Construct
			construct ();
										
			// Initialize
			SNDK.SUI.addInit (this);	
			
			// ------------------------------------
			// Private functions
			// ------------------------------------
			// ------------------------------------
			// init
			// ------------------------------------
			function init ()
			{	
				updateCache ();
				
		//		if (_attributes.url != null)
		//		{
		//			var test = '<object width="100%" height="100%" id="foo" name="foo" type="text/html" data="http://www.w3schools.com/"></object>';
		//		
		//			_elements["contentcenter"].innerHTML = test;
		//		}
		//		else
		//		{
		//			_elements["contentcenter"].innerHTML = _attributes.content;
		//		}
			}
			
			// ------------------------------------
			// contruct
			// ------------------------------------
			function construct ()
			{
				// Container
				_elements["container"] = SNDK.tools.newElement ("div", {});
				_elements["container"].setAttribute ("id", _attributes.id);		
				_elements["container"].className = _attributes.stylesheet;		
															
				// Top
				_elements["top"] = SNDK.tools.newElement ("div", null, null, _elements["container"]);
		
				// TopLeft
				_elements["topleft"] = SNDK.tools.newElement ("div", "TopLeft", null, _elements["top"]);
					
				// TopCenter
				_elements["topcenter"] = SNDK.tools.newElement ("div", "TopCenter", null, _elements["top"]);
				_elements["topcenter"].style.overflow = "hidden";
								
				// TopRight
				_elements["topright"] = SNDK.tools.newElement ("div", "TopRight", null, _elements["top"]);
				
				// Content
				_elements["content"] = SNDK.tools.newElement ("div", null, null, _elements["container"]);
				_elements["content"].style.clear = "both";			
								
				// ContentLeft
				_elements["contentleft"] = SNDK.tools.newElement ("div", "ContentLeft", null, _elements["content"]);
							
				// ContentCenter
				_elements["contentcenter"] = SNDK.tools.newElement ("div", "ContentCenter", null, _elements["content"]);		
				_elements["contentcenter"].style.overflow = "hidden";
				
				// Render
				_elements["render"] = SNDK.tools.newElement ("img", {className: "Render", width: "100%", appendTo: _elements["contentcenter"]});						
				_elements["render"].src = _attributes.source;
				
				// ContentRight
				_elements["contentright"] = SNDK.tools.newElement ("div", "ContentRight", null, _elements["content"]);
				
				// Bottom	
				_elements["bottom"] = SNDK.tools.newElement ("div", null, null, _elements["container"]);
				_elements["bottom"].style.clear = "both";		
								
				// BottomLeft
				_elements["bottomleft"] = SNDK.tools.newElement ("div", "BottomLeft", null, _elements["bottom"]);	
		
				// BottomCenter
				_elements["bottomcenter"] = SNDK.tools.newElement ("div", "BottomCenter", null, _elements["bottom"]);
					
				// BottomRight
				_elements["bottomright"] = SNDK.tools.newElement ("div", "BottomRight", null, _elements["bottom"]);
					
				// Hook Events
				_elements["contentcenter"].onfocus = eventOnFocus;
				_elements["contentcenter"].onblur = eventOnBlur;
						
				window.addEvent (window, 'SUIREFRESH', refresh);			
			}	
				
			// ------------------------------------
			// refresh
			// ------------------------------------		
			function refresh ()
			{		
				if (_temp.initialized)
				{
					if (_attributes.disabled)
					{
						_elements["container"].className = _attributes.stylesheet +" "+ _attributes.stylesheet +"Disabled";
						_elements["contentcenter"].removeAttribute("tabIndex");
						
						for (index in _elements["items"])
						{
							SNDK.tools.opacityChange (_elements["items"][index], 40);
						}				
					} 
					else
					{			
						_elements["container"].className = _attributes.stylesheet;
					}	
				}		
		
				setDimensions ();
			}
			
			function dispose ()
			{
				window.removeEvent (window, 'SUIREFRESH', refresh);	
			}
			
			function functionDispose ()
			{		
				dispose ();
			}
				
			// ------------------------------------
			// updateCache
			// ------------------------------------		
			function updateCache ()
			{
				if (!_temp.cacheUpdated)
				{
					_temp.cache["containerPadding"] = SNDK.tools.getElementStyledPadding (_elements["container"]);
					_temp.cache["containerWidth"] = SNDK.tools.getElementStyledWidth (_elements["topleft"]) + SNDK.tools.getElementStyledWidth (_elements["topright"]);
					_temp.cache["containerHeight"] = SNDK.tools.getElementStyledHeight (_elements["topleft"]) + SNDK.tools.getElementStyledHeight (_elements["bottomleft"]);
				}
				
				_temp.cacheUpdated = true;	
			}	
		
			// ------------------------------------
			// setattributes
			// ------------------------------------		
			function setAttributes ()
			{				
				// Stylesheet
				if (!_attributes.stylesheet)
					_attributes.stylesheet = "SUIImage";
						
				// Managed
				if (!_attributes.managed) 
					_attributes.managed = false;					
						
				// Width		
				if (!_attributes.width) 
					_attributes.width = "100%";				
					
				if (_attributes.width.substring (_attributes.width.length - 1) == "%")
				{
					_attributes.widthType = "percent";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 1)			
				}
				else
				{
					_attributes.widthType = "pixel";
					_attributes.width = _attributes.width.substring (0, _attributes.width.length - 2)
				}				
				
				// Height
				if (!_attributes.height) 
					_attributes.height = "100%";				
					
				if (_attributes.height.substring (_attributes.height.length - 1) == "%")
				{
					_attributes.heightType = "percent";
					_attributes.height = _attributes.height.substring (0, _attributes.height.length - 1)			
				}
				else
				{
					_attributes.heightType = "pixel";
					_attributes.height = _attributes.height.substring (0, _attributes.height.length - 2)
				}								
						
				// Focus	
				if (!_attributes.focus)
					_attributes.focus = false;
					
				// Content
				if (!_attributes.content)
					_attributes.content = "";			
					
				// Source
				if (!_attributes.source)
					_attributes.source = "";
			}	
			
			// ------------------------------------
			// setDimensions
			// ------------------------------------
			function setDimensions ()
			{
				if (_temp.initialized)
				{		
					var width = {};
					var height = {};
					var combinedheightofchildren = 0;
		
					if (!_attributes.managed && _attributes.widthType != "pixel")
					{					
						width.container = ((SNDK.tools.getElementInnerWidth (_elements["container"].parentNode) * _attributes.width) / 100) - _temp.cache.containerPadding["horizontal"];
					}
					else
					{			
						if (_attributes.managed && _attributes.widthType == "percent")
						{
		
							width.container = _attributes.managedWidth - _temp.cache.containerPadding["horizontal"];
						}
						else
						{
							width.container = _attributes.width - _temp.cache.containerPadding["horizontal"];
						}			
					}	
		
		
					if (!_attributes.managed && _attributes.heightType != "pixel")
					{					
						height.container = ((SNDK.tools.getElementInnerHeight (_elements["container"].parentNode) * _attributes.height) / 100) - _temp.cache.containerPadding["vertical"];
					}
					else
					{			
						if (_attributes.managed && _attributes.heightType == "percent")
						{
							height.container = _attributes.managedHeight - _temp.cache.containerPadding["vertical"];				
						}
						else
						{
							height.container = _attributes.height - _temp.cache.containerPadding["vertical"];
						}			
					}	
								
					width.topCenter = width.container - _temp.cache.containerWidth;
					width.contentCenter = width.container - _temp.cache.containerWidth;
					width.bottomCenter = width.container - _temp.cache.containerWidth;
					
					height.contentLeft = height.container - _temp.cache.containerHeight;
					height.contentCenter = height.container - _temp.cache.containerHeight;
					height.contentRight = height.container - _temp.cache.containerHeight;
		
					
					_elements["container"].style.width = width.container + "px";
					_elements["topcenter"].style.width = width.topCenter + "px";
					_elements["contentcenter"].style.width = width.contentCenter +"px";
					_elements["bottomcenter"].style.width = width.bottomCenter +"px";
								
					_elements["container"].style.height = height.container + "px";
					_elements["contentleft"].style.height = height.contentLeft + "px";
					_elements["contentcenter"].style.height = height.contentCenter +"px";
					_elements["contentright"].style.height = height.contentRight +"px";				
				}		
			}
			
			// ------------------------------------
			// setFocus
			// ------------------------------------				
			function setFocus ()
			{
				setTimeout ( function () { _elements["contentcenter"].focus (); }, 2);	
			}		
			
			
			
			
			// ------------------------------------
			// setSource
			// ------------------------------------				
			function setSource (source)
			{
				if (_temp.initialized)
				{
					_elements["render"].src = source;
				}
				else
				{
					_attributes.source = source;
				}
			}		
			
			// ------------------------------------
			// getSource
			// ------------------------------------				
			function getSource ()
			{
				if (_temp.initialized)
				{
					return _elements["render"].src;
				}
				else
				{
					return _attributes.source;
				}
			}		
				
			// ------------------------------------
			// Public functions
			// ------------------------------------
			function functionRefresh ()
			{
				refresh ();
			}
			
			// ------------------------------------
			// getAttribute
			// ------------------------------------						
			function functionGetAttribute (attribute)
			{
				switch (attribute)
				{
					case "id":
					{
						return _attributes[attribute];
					}
					
					case "tag":
					{
						return _attributes[attribute];
					}
					
					case "stylesheet":
					{
						return _attributes[attribute];
					}
					
					case "width":
					{
						if (_attributes.widthType == "percent")
						{
							return _attributes.width + "%";
						}
		
						if (_attributes.widthType == "pixel")
						{
							return _attributes.width + "px";
						}
					}
					
					case "height":
					{
						if (_attributes.heightType == "percent")
						{
							return _attributes.height + "%";
						}
		
						if (_attributes.heightType == "pixel")
						{
							return _attributes.height + "px";
						}
					}
					
					case "appendTo":
					{
						return _attributes[attribute];			
					}			
					
					case "managed":
					{
						return _attributes[attribute];			
					}
					
					case "source":
					{
						return getSource ();
					}
										
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}
			
			// ------------------------------------
			// setAttribute
			// ------------------------------------						
			function functionSetAttribute (attribute, value)
			{
				switch (attribute)
				{
					case "id":
					{
						throw "Attribute with name ID is ready only.";
						break;
					}
					
					case "tag":
					{
						_attributes[attribute] = value;
						break;
					}
					
					case "stylesheet":
					{
						_attributes[attribute] = value;
						break;				
					}
					
					case "width":
					{
						if (value.substring (value.width.length, 3) == "%")
						{
							_attributes.widthType = "percent";
							_attributes.width = value.width.substring (0, value.width.length - 1)			
						}
						else
						{
							_attributes.widthType = "pixel";
							_attributes.width = value.width.substring (0, value.width.length - 2)
						}	
						break;			
					}
					
					case "appendTo":
					{
						_attributes[attribute] = value;	
						_attributes.appendTo.appendChild (_elements["container"]);			
						break;
					}			
					
					case "managed":
					{
						_attributes[attribute] = value;
		
						if (value)
						{
							window.removeEvent (window, 'SUIREFRESH', refresh);		
						}
						else
						{
							window.addEvent (window, 'SUIREFRESH', refresh);
						}
		
						break;
					}
					
					case "source":
					{
						setSource (value);
						break;
					}
										
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object";
					}
				}	
			}										
							
			function functionDispose ()
			{
				dispose ();
			}							
													
			// ------------------------------------
			// Events
			// ------------------------------------					
			// ------------------------------------
			// onFocus
			// ------------------------------------					
			function eventOnFocus ()
			{
				if (!_attributes.disabled)
				{
					if (!_attributes.focus)
					{
						_attributes.focus = true;
						refresh ();
		
						if (_attributes.onFocus != null)
						{
							setTimeout( function ()	{ _attributes.onFocus (); }, 1);
						}			
					}				
				}
			}
		
			// ------------------------------------
			// onBlur
			// ------------------------------------							
			function eventOnBlur ()
			{
				if (!_attributes.disabled)
				{
					if (_attributes.focus)
					{	
						_attributes.focus = false;
						refresh ();
		
						if (_attributes.onBlur != null)
						{
							setTimeout( function ()	{ _attributes.onBlur (); }, 1);
						}			
					}	
				}
			}
		},
	
		// -------------------------------------------------------------------------------------------------------------------------
		// field ([attributes])
		// -------------------------------------------------------------------------------------------------------------------------
		//
		// Methods:
		//
		//	refresh ()
		//	getAttribute (attribute)
		//	setAttribute (attribute, value)
		//
		// Attributes:
		//		
		//	id			get
		//	tag 		get/set
		//	name 		get/set
		//	width		get/set
		//	height		get/set
		//	appendTo	get/set
		//	managed		get/set
		//	disabled	get/set
		//	focus		get/set
		//	onFocus		get/set
		//	onBlur		get/set
		//	onChange	get/set
		//	onKeyUp		get/set
		//	value		get/set
		
		/**
		 * @constructor
		 */
		field : function (attributes)
		{
			var _elements = new Array ();
			var _attributes = attributes;
			var _elements = new Array ();	
			var _temp = 	{ initialized: false
							};
							
			setAttributes ();
			
			// Functions		
			this.refresh = functionRefresh;	
			this.setAttribute = functionSetAttribute;
			this.getAttribute = functionGetAttribute;
			this.dispose = functionDispose;
			
			// ------------------------------------
			// STRING
			// ------------------------------------		
			var string =
			{
				onChange : function ()
				{
					if (_attributes.onChange != null)
					{
						setTimeout( function ()	{ _attributes.onChange (); }, 1);
					}
				}	
			}
			
			// ------------------------------------
			// LISTSTRING
			// ------------------------------------		
			var liststring =
			{
				add : function ()
				{
					var onDone =	function (string)
									{
										if (string != null)
										{
											_elements["content"].addItem (string);
											
										}
									};
									
					sCMS.modal.edit.fieldString ({onDone: onDone});			
				},
				
				edit : function ()
				{
					var onDone =	function (string)
									{
										if (string != null)
										{
											_elements["content"].setItem (string);
											
										}
									};
									
					sCMS.modal.edit.fieldString ({string: _elements["content"].getItem (), onDone: onDone});
				},
				
				remove : function ()
				{
					_elements["content"].removeItem ();
				},
				
				onChange : function ()
				{
					if (_elements["content"].getItem () != null)
					{
						_elements["edit"].setAttribute ("disabled", false);
						_elements["remove"].setAttribute ("disabled", false);
					}
					else
					{
						_elements["edit"].setAttribute ("disabled", true);
						_elements["remove"].setAttribute ("disabled", true);
					}
					
					if (_attributes.onChange != null)
					{
						setTimeout( function ()	{ _attributes.onChange (); }, 1);
					}
				}
			};	
			
			// ------------------------------------
			// TEXT
			// ------------------------------------		
			var text =
			{
				onChange : function ()
				{
					if (_attributes.onChange != null)
					{
						setTimeout( function ()	{ _attributes.onChange (); }, 1);
					}
				}
			}
			
			// ------------------------------------
			// LINK
			// ------------------------------------		
			var link =
			{
				choose : function ()
				{
					var onDone =	function (result)
									{							
										if (result != null)
										{																					
											var page = sCMS.page.load (result.id);													
											_elements["content"].setAttribute ("value", page.path);
										}
									};
			
					sCMS.modal.chooser.page ({onDone: onDone});									
				},
				
				onChange : function ()
				{
					if (_attributes.onChange != null)
					{
						setTimeout( function ()	{ _attributes.onChange (); }, 1);
					}
				}
			}
			
			// ------------------------------------
			// IMAGE
			// ------------------------------------		
			var image = 
			{
				value : null,		
				
				set : function (value)
				{
					if (value != "00000000-0000-0000-0000-000000000000")
					{
						image.value = sorentoLib.media.load (value);				
						_elements["content"].setAttribute ("source", "/console/cache/thumbnails/"+ image.value.id +"_large.jpg");
					}
					else
					{			
						image.value = null;
						_elements["content"].setAttribute ("source", "");
					}
					
					image.onChange ();
				},
				
				get : function ()
				{
					var result = "00000000-0000-0000-0000-000000000000";
				
					if (image.value != null)
					{
						result = image.value.id;
					}
					
					return result;
				},
				
				clear : function ()
				{
					image.set ("00000000-0000-0000-0000-000000000000");
				},
			
				upload : function ()
				{
					var onDone =	function (media)
									{
										if (media != null)
										{		
											image.set (media.id);																																											
											
										};
									};
						
					sConsole.modal.chooser.media ({type: "image", subType: "upload", path: "/media/scms/%%FILENAME%%%%EXTENSION%%", mediatransformations: _attributes.options.mediatransformations, onDone: onDone});
				},
				
				onChange : function ()
				{		
					if (_attributes.onChange != null)
					{
						setTimeout( function ()	{ _attributes.onChange (); }, 1);
					}
				}
			}
		
			// Construct
			construct ();
			
			// Private functions
			this._attributes = _elements["container"]._attributes;
			this._elements = _elements["container"]._elements;
			this._temp = _elements["container"]._temp;	
			this._init = _elements["container"]._init;	
			
				
			// ------------------------------------
			// Private functions
			// ------------------------------------
			// ------------------------------------
			// init
			// ------------------------------------		
			function init ()
			{
				_elements["container"]._init ();
			}
			
			// ------------------------------------
			// construct
			// ------------------------------------	
			function construct ()
			{		
				_elements["container"] = new SNDK.SUI.layoutbox ({width: _attributes.width, height: _attributes.height, type: "vertical", stylesheet: "SUILayoutboxNoBorder", appendTo: _attributes.appendTo});		
				_elements["container"].addPanel ({tag: "containerpanel", size: "*"});
					
				switch (_attributes.type)
				{
					case "string":
					{
						_elements["content"] = new SNDK.SUI.textbox ({tag: _attributes.tag, width: "100%"});
						_elements["content"].setAttribute ("value", _attributes.value);
						_elements["content"].setAttribute ("onChange", string.onChange);
						_elements["content"].setAttribute ("onKeyUp", string.onChange);
						
						_elements["container"].getPanel ("containerpanel").addUIElement (_elements["content"]);		
						
						_elements["content"].setAttribute ("onKeyUp", string.onChange);
						break;
					}		
					
					case "liststring":
					{
						// LAYOUT1
						_elements["layout1"] = new SNDK.SUI.layoutbox ({width: _attributes.width, height: _attributes.height, type: "vertical", stylesheet: "SUILayoutboxNoBorder"});
						_elements["layout1"].addPanel ({tag: "panel1", size: "*"});
						_elements["layout1"].addPanel ({tag: "panel2", size: "100px"});				
						_elements["container"].getPanel ("containerpanel").addUIElement (_elements["layout1"]);		
						
						// CONTENT
						var columns = new Array ();
						columns[0] = {tag: "value", label: "", width: "250px", visible: "true"};
		
						_elements["content"] = new SNDK.SUI.listview ({tag: _attributes.tag, width: "100%", height: "100%", columns: columns});
						_elements["content"].setAttribute ("onChange", liststring.onChange);																				
						_elements["layout1"].getPanel ("panel1").addUIElement (_elements["content"]);	
						
						// ADD
						_elements["add"] = new SNDK.SUI.button ({label: "Add", stylesheet: "SUIButtonSmall"});
						_elements["add"].setAttribute ("onClick", liststring.add)				
						_elements["layout1"].getPanel ("panel2").addUIElement (_elements["add"]);
						
						// EDIT
						_elements["edit"] = new SNDK.SUI.button ({label: "Edit", stylesheet: "SUIButtonSmall", disabled: true});
						_elements["edit"].setAttribute ("onClick", liststring.edit)
						_elements["layout1"].getPanel ("panel2").addUIElement (_elements["edit"]);
						
						// REMOVE
						_elements["remove"] = new SNDK.SUI.button ({label: "Remove", stylesheet: "SUIButtonSmall", disabled: true});
						_elements["remove"].setAttribute ("onClick", liststring.remove)
						_elements["layout1"].getPanel ("panel2").addUIElement (_elements["remove"]);
						
						break;
					}
					
					case "text":
					{
						var providerconfig = {};			
						providerconfig.theme = "advanced";
						providerconfig.plugins = "table,paste";
						providerconfig.theme_advanced_toolbar_location = "top";
						providerconfig.theme_advanced_toolbar_align = "left";
						providerconfig.theme_advanced_buttons1 = "bold,italic,underline,|,justifyleft, justifycenter, justifyright, justifyfull,|,formatselect,removeformat,|,numlist,bullist,|,undo,|,link,unlink";
						providerconfig.theme_advanced_buttons2 = "";
						providerconfig.theme_advanced_buttons3 = "";
						providerconfig.theme_advanced_blockformats = "h1,h2,h3,h4,h5,h6,blockquote";
						providerconfig.paste_auto_cleanup_on_paste = true;
						providerconfig.paste_remove_spans = true;
						providerconfig.paste_remove_styles = true;
						providerconfig.paste_remove_styles_if_webkit = true;
						providerconfig.paste_strip_class_attributes = "mso";		
						providerconfig.convert_urls = false;
										
						providerconfig.execcommand_callback = 	function (id, element, command, ui, value) 
																{   
																	return sConsole.tinymce.execcommand_callback ({id: id, element: element, command: command, ui: ui, value: value, callback: sCMS.modal.tinymce.link});
																};
						
					
						_elements["content"] = new SNDK.SUI.textarea ({tag: _attributes.tag, width: "100%", height: "100%", provider: "tinymce", providerConfig: providerconfig})				
						_elements["content"].setAttribute ("value", _attributes.value);
						_elements["content"].setAttribute ("onChange", text.onChange);
						_elements["content"].setAttribute ("onKeyUp", text.onChange);
						
						_elements["container"].getPanel ("containerpanel").addUIElement (_elements["content"]);		
						break;
					}		
					
					case "link":
					{
						_elements["content"] = new SNDK.SUI.textbox ({tag: _attributes.tag, width: "90%"});
						_elements["content"].setAttribute ("value", _attributes.value);
						_elements["content"].setAttribute ("onChange", link.onChange);
						_elements["content"].setAttribute ("onKeyUp", link.onChange);
										
						_elements["container"].getPanel ("containerpanel").addUIElement (_elements["content"]);		
						
						_elements["choose"] = new SNDK.SUI.button ({label: "Select", width: "10%"});
						_elements["choose"].setAttribute ("onClick", link.choose);				
						_elements["container"].getPanel ("containerpanel").addUIElement (_elements["choose"]);		
						
						break;
					}
					
					case "image":
					{
						// LAYOUT1
						_elements["layout1"] = new SNDK.SUI.layoutbox ({width: _attributes.width, height: _attributes.height, type: "horizontal", stylesheet: "SUILayoutboxNoBorder"});
						_elements["layout1"].addPanel ({tag: "panel1", size: "190px"});
						_elements["layout1"].addPanel ({tag: "panel2", size: "*"});				
						_elements["container"].getPanel ("containerpanel").addUIElement (_elements["layout1"]);		
										
						// CONTENT
						_elements["content"] = new SNDK.SUI.image ({tag: _attributes.tag, width: "190px", height: "190px", columns: columns});
						//_elements["content"].setAttribute ("onChange", image.onChange);				
						_elements["layout1"].getPanel ("panel1").addUIElement (_elements["content"]);	
						
						// CLEAR
						_elements["clear"] = new SNDK.SUI.button ({label: "Clear", width: "95px", stylesheet: "SUIButtonSmall"});
						_elements["clear"].setAttribute ("onClick", image.clear)
						_elements["layout1"].getPanel ("panel2").addUIElement (_elements["clear"]);
						
						// UPLOAD
						_elements["upload"] = new SNDK.SUI.button ({label: "Upload", width: "95px", stylesheet: "SUIButtonSmall"});
						_elements["upload"].setAttribute ("onClick", image.upload)
						_elements["layout1"].getPanel ("panel2").addUIElement (_elements["upload"]);
									
						break;
					}
				}					
			}	
				
			function functionDispose ()
			{
				switch (_attributes.type)
				{
					case "string":
					{
						break;
					}		
					
					case "text":
					{
						_elements["content"].dispose ();
						break;
					}		
				}					
			
			}
				
			// ------------------------------------
			// refresh
			// ------------------------------------		
			function refresh ()
			{
				if (_attributes.disabled)
				{
					switch (_attributes.type)
					{
						case "string":
						{
							_elements["content"].setAttribute ("disabled", true);
							break;
						}
						
						case "liststring":
						{
							return
							break;
						}
						
						case "text":
						{
							_elements["content"].setAttribute ("disabled", true);
							break;	
						}
					}		
				}
				else
				{
					switch (_attributes.type)
					{
						case "string":
						{
							_elements["content"].setAttribute ("disabled", false);
							break;
						}
						
						case "liststring":
						{
							return
							break;
						}
						
						case "text":
						{
							_elements["content"].setAttribute ("disabled", false);
							break;					
						}
						
						case "image":
						{
							return
							break;
						}
					}
				}
			}
			
			// ------------------------------------
			// setAttributes
			// ------------------------------------		
			function setAttributes ()
			{	
				// VALUE
				if (!_attributes.value)
					_attributes.value = "";	
					
				// OPTIONS
				if (!_attributes.options)
					_attributes.options = new Array ();
					
				// OPTIONS.MEDIATRANSFORMATIONS
				if (!_attributes.options.mediatransformations)
					_attributes.options.mediatransformations = "";
			}	
			
			// ------------------------------------
			// Public functions
			// ------------------------------------		
			// ------------------------------------
			// refresh
			// ------------------------------------				
			function functionRefresh ()
			{		
				_elements["container"].refresh ();	
			}		
				
			// ------------------------------------
			// getAttribute
			// ------------------------------------						
			function functionGetAttribute (attribute)
			{			
				switch (attribute)
				{
					case "id":
					{
						return _elements["content"].getAttribute ("id");
					}			
		
					case "tag":
					{
						return _elements["content"].getAttribute ("tag");
					}			
					
					case "width":
					{
						return _elements["container"].getAttribute ("width")
					}
					
					case "height":
					{
						return _elements["container"].getAttribute ("height")
					}	
					
					case "appendTo":
					{
						return _elements["container"].getAttribute ("appendTo");
					}			
					
					case "managed":
					{
						return _elements["container"].getAttribute ("managed");
					}
					
					case "focus":
					{
						return _elements["content"].getAttribute ("focus");
					}
		
					case "onFocus":
					{
						return _elements["content"].getAttribute ("onFocus");
					}
		
					case "onBlur":
					{
						return _elements["content"].getAttribute ("onBlur");
					}
		
					case "onChange":
					{
						return _attributes[attribute];
					}
		
					case "value":
					{
						switch (_attributes.type)
						{
							case "string":
							{
								return _elements["content"].getAttribute ("value");
								break;
							}
							
							case "liststring":
							{						
								var items = _elements["content"].getItems ();
								var result = "";
								for (index in items)
								{
									result += items[index].value +"\n";
								}
							
								return result;						
							}
							
							case "text":
							{
								return _elements["content"].getAttribute ("value");						
							}
							
							case "link":
							{
								return _elements["content"].getAttribute ("value");						
							}
							
							case "image":
							{				
								return image.get ();								
							}
						}				
					}			
		
					default:
					{			
						throw "No attribute with the name '"+ attribute +"' exist in this object. (GET)";
					}
				}
			}
			
			// ------------------------------------
			// setAttribute
			// ------------------------------------						
			function functionSetAttribute (attribute, value)
			{
				switch (attribute)
				{
					case "id":
					{
						throw "Attribute with name ID is ready only.";
						break;
					}
					
					case "tag":
					{
						_elements["content"].setAttribute ("tag", value);				
						break;
					}
					
					case "name":
					{
						_elements["content"].setAttribute ("name", value);				
						break;
					}
								
					case "width":
					{
						_elements["container"].setAttribute ("width", value);
						break;			
					}
		
					case "height":
					{
						_elements["container"].setAttribute ("height", value);
						break;			
					}
					
					case "appendTo":
					{
						_elements["container"].setAttribute ("appendTo", value);
						break;
					}			
					
					case "managed":
					{
						_elements["container"].setAttribute ("managed", value);
						break;
					}
					
					case "disabled":
					{
						_attributes[attribute] = value;
						refresh ();
						break;
					}
					
					case "focus":
					{
						_elements["content"].setAttribute ("focus", value);
						break;
					}
		
					case "onFocus":
					{
						_elements["content"].setAttribute ("onFocus", value);
						break;
					}
		
					case "onBlur":
					{
						_elements["content"].setAttribute ("onBlur", value);
						break;
					}
		
					case "onChange":
					{
		//				switch (_attributes.type)
		//				{
		//					case "string":
		//					{						
		//						_attributes[attribute] = value;
		//						_elements["content"].setAttribute ("onKeyUp", value);
		//						break;					
			//				}
							
		//					case "liststring":
		//					{
		//						_attributes[attribute] = value;
		//						break;
		//					}
							
		//					case "text":
		//					{
		//						_attributes[attribute] = value;
		//						_elements["content"].setAttribute ("onChange", value);
		//						_elements["content"].setAttribute ("onKeyUp", value);
		//						break;
		//					}
							
		//					case "link":
		//					{						
								//_elements["content"].setAttribute ("onKeyUp", value);
		//						_attributes[attribute] = value;
		//						break;					
		//					}
							
		//					case "image":
		//					{
		//						image.onChangeValue = value;
		//						break;
		//					}
		//				}								
		
						_attributes[attribute] = value;						
						break;
					}
		
					case "value":
					{
						switch (_attributes.type)
						{
							case "string":
							{
								_elements["content"].setAttribute ("value", value);
								break;
							}
							
							case "liststring":
							{
								var split = value.split ("\n");
								for (index in split)
								{
									if (split[index] != "")
									{
										var item = {};
										item.value = split[index];
										_elements["content"].addItem (item);
									}						
								}
								break;
							}
							
							case "text":
							{
								_elements["content"].setAttribute ("value", value);
								break;
							}
							
							case "link":
							{
								_elements["content"].setAttribute ("value", value);
								break;
							}
							
							case "image":
							{
								image.set (value);
								break;
							}
						}
						
						break;
					}			
							
					default:
					{
						throw "No attribute with the name '"+ attribute +"' exist in this object. (SET)";
					}
				}	
			}										
							
			// ------------------------------------
			// Events
			// ------------------------------------
		},
	
		initalized : false,
		
		
		initialized : false,
		strapped : false,
		domReady : false,
		
		previousOrientation : 0,
		
		// ------------------------------------
		// init
		// ------------------------------------	
		init : function ()
		{
			var init = 	function ()
						{
							window.triggerEvent ("SUIINIT");
							SNDK.SUI.refresh ();
						
							window.addEvent (window, 'orientationchange', SNDK.SUI.checkOrientation)			
							window.addEvent (window, 'resize', SNDK.SUI.refresh);	
						
							SNDK.SUI.initialized = true;
							SNDK.SUI.domReady = true;
						};
			
			if (!SNDK.SUI.strapped)
			{
				window.onDomReady (init);
				SNDK.SUI.strapped = true;
			}						
			else
			{
				if (SNDK.SUI.domReady)
				{
					init ();
				}
			}
		},
		
		// ------------------------------------
		// addInit
		// ------------------------------------	
		addInit : function (obj)
		{
			var init = 	function ()
						{				
							try
							{
								
								if (obj._temp.initialized != true)
								{
								
		//	try
		//	{
		
		//								if (obj._attributes.appendTo == null)
		//								{
		//									obj._attributes.appendTo = document.getElementById ("suistageing");
		//								}
			
										if (typeof (obj._attributes.appendTo) == "string")
										{
											obj._attributes.appendTo = document.getElementById (obj._attributes.appendTo);
										}
		
													
										obj._attributes.appendTo.appendChild (obj._elements["container"])
									
									//console.log (obj._attributes.appendTo)
		//	}
		//	catch (e)
		//	{}
							
		
									obj._init ();
							
									obj._temp.initialized = true;			
									
									window.removeEvent (window, 'SUIINIT', init);
							
								}
							}
							catch (e)
							{
								console.log (e)
							}
						}
		
				window.addEvent (window, 'SUIINIT', init);
		},
		
		// ------------------------------------
		// redraw
		// ------------------------------------	
		redraw : function ()
		{
			if (SNDK.SUI.initialized)
			{
				window.triggerEvent ("SUIINIT");	
				SNDK.SUI.refresh ();	
			}
		},
		
		// ------------------------------------
		// refresh
		// ------------------------------------	
		refresh : function ()
		{
			var refresh = 	function ()
							{
								window.triggerEvent ("SUIREFRESH");
							};
		
			try
			{
				refresh ();
			}
			catch (error)
			{	
				window.onDomReady (refresh);
			}	
		},
		
		// ------------------------------------
		// checkOrientation
		// ------------------------------------	
		checkOrientation : function ()
		{
		    if (window.orientation !== SNDK.SUI.previousOrientation)
		    {
				SNDK.SUI.previousOrientation = window.orientation;
		    }
		}
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: ajax
	// ---------------------------------------------------------------------------------------------------------------
	ajax :
	{
		// -------------------------------------------------------------------------------------------------------------------------
		// Ajax (application, applicationparam, applicationdatafield, requestmethod, asynchronous)
		// -------------------------------------------------------------------------------------------------------------------------
		// -------------------------------------------------------------------------------------------------------------------------
		request : function (application, applicationparam, applicationdatafield, requestmethod, asynchronous)
		{
			var _initialized = false;
		
			var _xmlhttp = null;	
				
			var _application = application;	
			var _applicationdatafield = applicationdatafield;		
			var _applicationparam = applicationparam;
			var _requestmethod = requestmethod;
			var _asynchronous = asynchronous;
		
			var _seed = Math.random();			
			var _data = null;	
		
			// Event handlers.
			var _event_onsent = null;
			var _event_onreceiving = null;
			var _event_onloaded = null;			
		
			// Methods
			this.send = send;		
				
			// Properties
			this.respons = valueRespons;		
			this.onSent = valueOnSent;
			this.onReceiving = valueOnReceiving;		
			this.onLoaded = valueOnLoaded;
		
			// Init object.
			init ();
		
			function init ()
			{
				// Create new xmlhttp object.
				_xmlhttp = getXmlHttpObject();
		
				// Check if browser supports AJAX
				if (_xmlhttp == null)
				{
					alert ("Your browser does not support AJAX!");
					return;
				}
							
				_xmlhttp.onreadystatechange = function ()
				{			
					if (_xmlhttp.readyState == 2 && _event_onsent != null)
					{
						_onsent ();
					}
		
					if (_xmlhttp.readyState == 3 && _event_onreceiving != null)
					{
						_onreceiving ();
					}			
		
					if (_xmlhttp.readyState == 4 && _event_onloaded != null)
					{														
						if (_asynchronous)
						{				
							parseRespons ();
						}
						
						if (_event_onloaded != null)
						{						
							_event_onloaded (_data);
						}
					}						
				};			
				
				// Finished
				_initialized = true;	
			}
		
			function parseRespons ()
			{
				_data = new Array();						
			
				var xmldoc = _xmlhttp.responseXML;
				var root = xmldoc.getElementsByTagName ('ajax').item(0);				
				
				
				
				parseResponsRecursive (root.childNodes, _data);
				
				
				if (_data["success"] == false)
				{
					//throw _data["exception"].split ("|")[0];
					throw _data["exception"];
				}			
			}
			
			function parseResponsRecursive (Nodes, Data)
			{		
				var len = Nodes.length;		
				for (var index = 0; index < len; index++)
				{
					var node = Nodes.item(index);
								
					//console.log (node.tagName)
					switch (node.attributes.getNamedItem ("type").value)
					{
						case "object":
						{
						
							//var list = {};
						
							//for (var index2 = 0, len2 = node.childNodes.length; index2 < len2; index2++)
							//{
							
							var hashtable = {};
							//var node2 = node.childNodes[index2];
							//console.log (node2)
								
							parseResponsRecursive (node.childNodes, hashtable);
								
							//list[list.length] = hashtable;
							//} 
								
																						
							Data[node.tagName] = hashtable;					
							break;
						}
										
					
						case "string":
						{
							if (node.firstChild != null)
							{
								Data[node.tagName] = node.childNodes[0].nodeValue;
							}
							else
							{
								Data[node.tagName] = "";
							}
		
							break;
						}
						
						case "boolean":
						{				
							if (node.firstChild != null)
							{
								if (node.childNodes[0].nodeValue == "1")
								{						
									Data[node.tagName] = true;
								}
								else
								{
									Data[node.tagName] = false;
								}
							}
							else
							{
								Data[node.tagName] = false;
							}
						
							break;
						}
						
						case "hashtable":
						{
							var hashtable = new Array ();
							
							parseResponsRecursive (node.childNodes, hashtable);
							
							Data[node.tagName] = hashtable;
							
							break;
						}
						
						case "list":
						{
							var list = new Array();
							var len2 = node.childNodes.length;
							for (var index2 = 0; index2 < len2; index2++)
							{
								var hashtable = {};
								var node2 = node.childNodes[index2];
								
								//console.log (node2.childNodes)
								
								parseResponsRecursive (node2.childNodes, hashtable);
								//parseResponsRecursive (node2, hashtable);
								
								
								
								list[index2] = hashtable;
								//list[list.length] = hashtable;
								//list[index2] = hashtable;
							} 
							
																										
							Data[node.tagName] = list;
											
							break;
						}
					}
				}
			}
			
			function send (data)
			{
				var success = false;
			
				if (_initialized)			
				{
					// Create XML document.
					var xmldata = "";					
					//xmldata += "<?xml version='1.0' encoding='ISO-8859-1'?>";
					xmldata += "<ajax>\n";			
											
					xmldata = parseRequestRecursive (xmldata, data);			
								
					xmldata += "</ajax>\n";			
		
					// We can eithet request by using GET or POST.			
					if (_requestmethod == "GET")
					{
						var dtmNow = new Date();
						var strMS = dtmNow.valueOf;
					
						// Create request URL.
						var url = "";
						url += _application +"?";		
						url += _applicationdatafield +"=";
						url += xmldata;
						url += "&seed="+ Math.floor(Math.random()*1000000);
						url += "&cachescrambler="+ strMS;
			
						if (_applicationparam)
						{									
							var params = _applicationparam.split(";");
							for (var param = 0; param < params.length; param++)
							{
								url += "&";					
								url += params[param];
							}
						}
						
						// Open request.
						_xmlhttp.open("GET", url, _asynchronous);
						
						// Send request.
						_xmlhttp.send(null);
						
					}
					else if (_requestmethod == "POST")
					{
						// Create request URL.
						var url = "";
						url += _application;
						
						// Open request.
						_xmlhttp.open("POST", url, _asynchronous);							
						
						// Then we encode the XML data into multipart/form-data.
						var boundaryseed = Math.floor(Math.random()*100001) +''+  Math.floor(Math.random()*100001) +''+ Math.floor(Math.random()*100001);
						var boundary = '--' + boundaryseed;
						var requestbody = boundary + '\r\n';
		
						var dtmNow = new Date();
						var strMS = dtmNow.valueOf
						var seed = Math.floor(Math.random()*1000000);
		
						
						// Add applicationparams.
						var params = _applicationparam.split(";");
						
						requestbody += 'Content-Disposition: form-data; name="random1"\r\n';
						requestbody += '\r\n';
						requestbody += seed + '\r\n' 					
						requestbody += boundary + '\r\n' 
						
						requestbody += 'Content-Disposition: form-data; name="random2"\r\n';
						requestbody += '\r\n';
						requestbody += strMS + '\r\n' 					
						requestbody += boundary + '\r\n' 
						
		
						for (var param = 0; param < params.length; param++)
						{
							var values = params[param].split("=");
							requestbody += 'Content-Disposition: form-data; name="'+ values[0] +'"' + '\r\n';
							requestbody += '\r\n';
							requestbody += values[1] + '\r\n' 					
							requestbody += boundary + '\r\n' 
						}
						
						// Add xmldata.									
						requestbody += 'Content-Disposition: form-data; name="'+ _applicationdatafield +'"' + '\r\n' 
						requestbody += '\r\n' 
						requestbody += xmldata + '\r\n' 
						requestbody += boundary +'--\r\n';
		
						// Prepare header information.	
						_xmlhttp.setRequestHeader("Content-type", "multipart/form-data; boundary=" + boundaryseed);
						_xmlhttp.setRequestHeader("Content-length", requestbody.length);
														
						// Send request.
						_xmlhttp.send(requestbody);
					}
						
					// If not asynchronous we need to parse respons manually.
					if (!_asynchronous)
					{
						parseRespons ();
					}
						
					success = true;
				}
				return success;
			}
			
			function parseRequestRecursive (document, data)
			{				
				for (var index in data)
				{
				 
					switch (typeof(data[index]))
					{
						case "string":
						{
							document += "<"+ index +" type=\"string\">\n";
							document += "<![CDATA[";
							document += data[index];
							document += "]]>\n";
							document += "</"+ index +">\n";				
							
							break;
						}
						
						case "number":
						{
							document += "<"+ index +" type=\"string\">\n";
							document += "<![CDATA[";
							document += data[index];
							document += "]]>\n";
							document += "</"+ index +">\n";				
							
							break;
						}
						
										
						case "boolean":
						{								
							document += "<"+ index +" type=\"boolean\">\n";
							document += "<![CDATA[";
							if (data[index] == true)
							{
								document += "1";
							}
							else
							{
								document += "0";
							}
							
							document += "]]>\n";
							document += "</"+ index +">\n";				
		
							break;
						}
						
						case "object":
						{				
							if (data[index].constructor == Array)
							{
								
								var islist = true;
								for (index2 in data[index])
								{
									if (isNaN (index2))
									{
										islist = false;
									}
								}
		
								if (islist)
								{
										document += "<"+ index +" type=\"list\">\n";	
										for (var index2 in data[index]) 
										{
											document += "<item>\n";						
											document = parseRequestRecursive (document, data[index][index2]);
											document += "</item>\n";						
										}
										document += "</"+ index +">\n";											
								
								}
								else
								{
									document += "<"+ index +" type=\"hashtable\">\n";	
																		
										
										//for (var index2 in data[index]) 
										//{
										//console.log (data[index])
											
											document = parseRequestRecursive (document, data[index]);
										//}
										document += "</"+ index +">\n";																											
								
								}
							}
							else if (data[index].constructor == Object)
							{
								document += "<"+ index +" type=\"object\">\n";
								document = parseRequestRecursive (document, data[index]);
								document += "</"+ index +">\n";	
							}
										
							break;
						}				
					}			
				}
				
				return document;	
			}	
			
			function valueRespons ()
			{
				return _data;
			}
			
			function valueOnSent (value)
			{
				_event_onsent = value;
			}
			
			function valueOnReceiving (value)
			{
				_event_onreceiving = value;
			}
			
				
			function valueOnLoaded (value)
			{	
				_event_onloaded = value;
			}
		
			function getXmlHttpObject ()
			{
				if (window.XMLHttpRequest)
				{
					// code for IE7+, Firefox, Chrome, Opera, Safari.
					return new XMLHttpRequest ();
				}
				
				if (window.ActiveXObject)
				{
					// code for IE6, IE5.
					return new ActiveXObject ("Microsoft.XMLHTTP");
				}	
				return null;
			}		
		}
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: string
	// ---------------------------------------------------------------------------------------------------------------
	string :
	{
		
		
		// ------------------------------------
		// format
		// ------------------------------------	
		format : function (format,args)
		{
		    var result = format;
		    for(var i = 1 ; i < arguments.length ; i++) 
		    {
		        result = result.replace (new RegExp( '\\{' + (i-1) + '\\}', 'g' ),arguments[i]);
		    }
		    return result;
		},
		
		// ------------------------------------
		// isNullOrEmpty
		// ------------------------------------	
		isNullOrEmpty : function (value)
		{
		    if(value)
		    {
		        if( typeof (value) == 'string' )
		        {
		             if (value.length > 0)
		             return false;
		        }
			if (value != null)
		        return false;
		    }
		    return true;
		},
		
		/**
		 * Checks whether a string contains a given character.
		 * @param {string} s The string to test.
		 * @param {string} ss The substring to test for.
		 * @return {boolean} True if {@code s} contains {@code ss}.
		 */
		contains : function (s, ss) 
		{
			return s.indexOf(ss) != -1;
		},
		
		trimEnd : function (s, ss)
		{	
			if (s.substr (s.length - ss.length, ss.length) == ss)
			{
				return s.substr (0, s.length - ss.length);
			}
			
			return s;
		}
		
	},

	debugMode: false,
	debugStopRefresh: false
	,

	includeJS : function (attributes)
	{
		var xmlhttp = SNDK.tools.getXmlHttpObject ();
		xmlhttp.open ("GET", attributes.url, false);								
		xmlhttp.send (null);		
		
		var head = document.getElementsByTagName ("HEAD").item (0);
		var script = document.createElement ("script");
		var text = xmlhttp.responseText + attributes.appendText;
		
		
		script.language = "javascript";
		script.type = "text/javascript";
		
		script.defer = true;	
		script.text = text;
		head.appendChild (script);	
	}
}

// ------------------------------------
// startsWith
// ------------------------------------	
String.prototype.startsWith = function (prefix, ignoreCase) 
{
    if (!prefix) return false;
    if (prefix.length > this.length ) return false;
    if (ignoreCase) 
    {
        if (ignoreCase == true) 
        {
            return (this.substr (0, prefix.length).toUpperCase () == prefix.toUpperCase ());
        }
    }
    return (this.substr (0, prefix.length) === prefix);
}

// ------------------------------------
// endsWidth
// ------------------------------------	
String.prototype.endsWith = function (suffix,ignoreCase) 
{
    if (!suffix) return false;
    if (suffix.length > this.length) return false;
    if (ignoreCase) 
    {
        if (ignoreCase == true)
        {
            return (this.substr (this.length - suffix.length).toUpperCase () == suffix.toUpperCase ());
        }
    }
    return (this.substr (this.length - suffix.length) === suffix);
}

// ------------------------------------
// trim
// ------------------------------------	
String.prototype.trim = function () 
{
    return this.replace (/^\s+|\s+$/g, '');
}

// ------------------------------------
// trimEnd
// ------------------------------------	
String.prototype.trimEnd = function (character)
{	
	if (this.substr (this.length-1, 1) == character)
	{
		return this.substr (0, this.length - character.length);
	}
	
	return this;
}
// -------------------------------------------------------------------------------------------------------------------------
// Client
// -------------------------------------------------------------------------------------------------------------------------
try
{

var client = 
{
	init: function () 
	{
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)	|| this.searchVersion(navigator.appVersion)	 || "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	
	searchString: function (data) 
	{
		for (var i=0;i<data.length;i++)	
		{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) 
			{
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	
	searchVersion: function (dataString) 
	{
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};

client.init();
}
catch (error)
{}

try
{
/*********************************************************************
 * No onMouseOut event if the mouse pointer hovers a child element 
 * *** Please do not remove this header. ***
 * This code is working on my IE7, IE6, FireFox, Opera and Safari
 * 
 * Usage: 
 * <div onMouseOut="fixOnMouseOut(this, event, 'JavaScript Code');"> 
 *		So many childs 
 *	</div>
 *
 * @Author Hamid Alipour Codehead @ webmaster-forums.code-head.com		
**/
function is_child_of (parent, child) 
{
	if (child != null) 
	{			
		while (child.parentNode) 
		{
			if ((child = child.parentNode) == parent) 
			{
				return true;
			}
		}
	}
	return false;
}

function fixOnMouseOut (element, event, JavaScript_code) 
{
	var current_mouse_target = null;
	if (event.toElement) 
	{				
		current_mouse_target = event.toElement;
	} 
	else if (event.relatedTarget) 
	{				
		current_mouse_target = event.relatedTarget;
	}

	if (!is_child_of(element, current_mouse_target) && element != current_mouse_target) 
	{
		eval (JavaScript_code);
	}
}
/*********************************************************************/
// -------------------------------------------------------------------------------------------------------------------------
// Event handling
// -------------------------------------------------------------------------------------------------------------------------
function addEvent (element, type, handler) 
{
	if ((type === "DOMContentLoaded" || type === "domload")) 
	{
		if(typeof domReady === "function") 
		{
			domReady(handler);
			return;
		} 
		else 
		{
			type = "load";
		}
	}
	
	if (element.addEventListener) 
	{
		element.addEventListener(type, handler, false);
	} 
	else 
	{
		// assign each event handler a unique ID
		if (!handler.$$guid) 
		{
			handler.$$guid = addEvent.guid++;
		}
		
		// create a hash table of event types for the element
		if (!element.events) 
		{
			element.events = {};
		}
		
		// create a hash table of event handlers for each element/event pair
		var handlers = element.events[type];
		if (!handlers) 
		{
			handlers = element.events[type] = {};
			// store the existing event handler (if there is one)
			if (element["on" + type]) 
			{
				handlers[0] = element["on" + type];
			}
		}
		
		// store the event handler in the hash table
		handlers[handler.$$guid] = handler;
		
		// assign a global event handler to do all the work
		element["on" + type] = handleEvent;
	}
	
	return  addEvent.guid;
}

// a counter used to create unique IDs
addEvent.guid = 1;

function removeEvent (element, type, handler) 
{
	if (element.removeEventListener) 
	{
		element.removeEventListener(type, handler, false);
	} 
	else 
	{
		// delete the event handler from the hash table
		if (element.events && element.events[type]) 
		{
			delete element.events[type][handler.$$guid];
		}
	}
}

function handleEvent (event) 
{
	var returnValue = true;

	// grab the event object (IE uses a global event object)
	event = event || fixEvent(((this.ownerDocument || this.document || this).parentWindow || window).event);

	// get a reference to the hash table of event handlers
	var handlers = this.events[event.type];

	// execute each event handler
	for (var i in handlers) 
	{
		this.$$handleEvent = handlers[i];
		if (this.$$handleEvent(event) === false) 
		{
			returnValue = false;
		}
	}
	
	return returnValue;
}

function fixEvent (event) 
{
	// add W3C standard event methods
	event.preventDefault = fixEvent.preventDefault;
	event.stopPropagation = fixEvent.stopPropagation;
	return event;
}

fixEvent.preventDefault = function() 
{
	this.returnValue = false;
};

fixEvent.stopPropagation = function() 
{
	this.cancelBubble = true;
};

if (!window.addEventListener) 
{
	document.onreadystatechange = function()
	{
		if (window.onload && window.onload !== handleEvent) 
		{
			addEvent(window, 'load', window.onload);
			window.onload = handleEvent;
		}
	};
}

function triggerEvent (event)
{
	if (document.createEvent) 
	{
		var e = document.createEvent('HTMLEvents');
		e.initEvent(event, true, false);
		document.body.dispatchEvent(e);
	} 
	else if (document.createEventObject) 
	{
		document.body.fireEvent("on"+ event);
	}
}

var domReadyEvent = 
{
	name: "domReadyEvent",
	// Array of DOMContentLoaded event handlers.
	events: {},
	domReadyID: 1,
	bDone: false,
	DOMContentLoadedCustom: null,

	// Function that adds DOMContentLoaded listeners to the array.
	add: function (handler) 
	{
		// Assign each event handler a unique ID. If the handler has an ID, it
		// has already been added to the events object or been run.
		if (!handler.$$domReadyID) 
		{
			handler.$$domReadyID = this.domReadyID++;

			// If the DOMContentLoaded event has happened, run the function.
			if(this.bDone)
			{
				handler();
			}

			// store the event handler in the hash table
			this.events[handler.$$domReadyID] = handler;
		}
	},

	remove: function (handler) 
	{
		// Delete the event handler from the hash table
		if (handler.$$domReadyID) 
		{
			delete this.events[handler.$$domReadyID];
		}
	},

	// Function to process the DOMContentLoaded events array.
	run: function () 
	{
		// quit if this function has already been called
		if (this.bDone) 
		{
			return;
		}

		// Flag this function so we don't do the same thing twice
		this.bDone = true;

		// iterates through array of registered functions 
		for (var i in this.events) 
		{
			this.events[i]();
		}
	},

	schedule: function () 
	{
		// Quit if the init function has already been called
		if (this.bDone) 
		{
			return;
		}
	
		// First, check for Safari or KHTML.
		if (/KHTML|WebKit/i.test(navigator.userAgent)) 
		{
			if (/loaded|complete/.test(document.readyState)) 
			{
				this.run();
			} 
			else 
			{
				// Not ready yet, wait a little more.
				setTimeout(this.name + ".schedule()", 100);
			}
		} 
		else if (document.getElementById("__ie_onload")) 
		{
			// Second, check for IE.
			return true;
		}

		// Check for custom developer provided function.
		if (typeof this.DOMContentLoadedCustom === "function") 
		{
			//if DOM methods are supported, and the body element exists
			//(using a double-check including document.body, for the benefit of older moz builds [eg ns7.1] 
			//in which getElementsByTagName('body')[0] is undefined, unless this script is in the body section)
			if (typeof document.getElementsByTagName !== 'undefined' && (document.getElementsByTagName('body')[0] !== null || document.body !== null)) 
			{
				// Call custom function.
				if (this.DOMContentLoadedCustom()) 
				{
					this.run();
				} 
				else 
				{
					// Not ready yet, wait a little more.
					setTimeout(this.name + ".schedule()", 250);
				}
			}
		}

		return true;
	},

	init: function() 
	{
		// If addEventListener supports the DOMContentLoaded event.
		if(document.addEventListener) 
		{
			document.addEventListener("DOMContentLoaded", function() { domReadyEvent.run(); }, false);
		}

		// Schedule to run the init function.
		setTimeout("domReadyEvent.schedule()", 100);

		function run() 
		{
			domReadyEvent.run();
		}
		
		// Just in case window.onload happens first, add it to onload using an available method.
		if(typeof addEvent !== "undefined") 
		{
			addEvent(window, "load", run);
		} 
		else if (document.addEventListener) 
		{
			document.addEventListener("load", run, false);
		} 
		else if (typeof window.onload === "function") 
		{
			var oldonload = window.onload;
			window.onload = function() 
					{
						domReadyEvent.run();
						oldonload();
					};
		} 
		else 
		{
			window.onload = run;
		}

		/* for Internet Explorer */
		/*@cc_on
			@if (@_win32 || @_win64)
			document.write("<script id=__ie_onload defer src=\"//:\"><\/script>");
			var script = document.getElementById("__ie_onload");
			script.onreadystatechange = function() {
				if (this.readyState == "complete") {
					domReadyEvent.run(); // call the onload handler
				}
			};
			@end
		@*/
	}
};

var onDomReady = function (handler) { domReadyEvent.add(handler); };

domReadyEvent.init ();


function bla ()
{

/*
This function calculates window.scrollbarWidth and window.scrollbarHeight

This must be called
?onload? to work correctly (or on ?DOM ready?, if you?re using
a framework that provides such an event)
*/

try
{
var i = document.createElement("p");
i.style.width = "100%";

i.style.height = "200px";

var o = document.createElement("div");
o.style.position = "absolute";
o.style.top = "0px";
o.style.left = "0px";
o.style.visibility = "hidden";
o.style.width = "200px";
o.style.height = "150px";
o.style.overflow = "hidden";
o.appendChild(i);

document.body.appendChild(o);
var w1 = i.offsetWidth;
var h1 = i.offsetHeight;
o.style.overflow = "scroll";
var w2 = i.offsetWidth;
var h2 = i.offsetHeight;
if (w1 == w2) w2 = o.clientWidth;
if (h1 == h2) h2 = o.clientWidth;

document.body.removeChild(o);

window.scrollbarWidth = w1-w2;
window.scrollbarHeight = h1-h2;
}
catch (error)
{

}

};


window.onDomReady (bla);



}
catch (error)
{

}


//var test = function ()
//{
	

//}


//window.onDomReady (test);


SNDK.page.init ();

