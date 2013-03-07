  var simpleEditor = function (attributes)
	  {
		// --------------------------------------------------------------------------------------------------------------
		// | VARIABLES													|
		// --------------------------------------------------------------------------------------------------------------	  	
	  	var _attributes	= parseAttributes (attributes);
	  		  
		var _elements = {
					document: null,	
					content: null					
				};
								
		var _temp = 	{
	  				initialized: false,
	  				content: null,
	  				fields: {},
	  			};
			
		// --------------------------------------------------------------------------------------------------------------
		// | GETTER/SETTER												|
		// --------------------------------------------------------------------------------------------------------------
		this.__defineGetter__("content", functionGetContent);  	// CONTENT
		this.__defineSetter__("content", functionSetContent);	// CONTENT
		this.__defineGetter__("readOnly", functionGetReadOnly); // READONLY
		this.__defineSetter__("readOnly", functionSetReadOnly);	// READONLY		
		this.__defineGetter__("onChange", functionGetOnChange);	// ONCHANGE
		this.__defineSetter__("onChange", functionSetOnChange);	// ONCHANGE
				
		// --------------------------------------------------------------------------------------------------------------
		// | FUNCTIONS													|
		// --------------------------------------------------------------------------------------------------------------				
		this.command = functionCommand;
		
		// --------------------------------------------------------------------------------------------------------------
		// | GOTIME													|
		// --------------------------------------------------------------------------------------------------------------										
		window.onDomReady (initialize);
				
		// --------------------------------------------------------------------------------------------------------------
		// | INITIALIZE													|
		// --------------------------------------------------------------------------------------------------------------
		function initialize ()
		{
			// Find document we are being called from.
			if (_attributes.document)
			{
				_elements.document = attributes.document;
			}
			else
			{
				_elements.document = document;
			}						
			
			// Find content container.
			if (_attributes.contentContainerId)
			{
				_elements.content = document.getElementById (_attributes.contentContainerId);
			}
			else if (_attributes.contentContainer)
			{
				_elements.content = _attributes.contentContainer;		
			}
						
			// Set content.
			if (_temp.content != null)
			{
				setContent ();
			}
			else
			{
				parseContent ();
			}			
						
			// Hook events.			
			addEvent (_elements.content, 'copy', function (event) 			// COPY
			{
				onChange (event)
			});

			addEvent (_elements.content, 'paste', function (event) 			// PASTE
			{			
				onChange (event)
			});

			addEvent (_elements.content, 'cut', function (event) 			// CUT
			{			
				onChange (event)
			});

			addEvent (_elements.content, 'drop', function (event) 			// DROP
			{			
				onChange (event)
			});

			addEvent (_elements.content, 'focus', function (event) 			// FOCUS
			{			
				onChange (event)
			});

			addEvent (_elements.content, 'blur', function (event) 			// BLUR
			{			
				onChange (event)
			});

			addEvent (_elements.content, 'keypress', function (event) 		// KEYPRESS
			{			
				onChange (event)
			});

			addEvent (_elements.content, 'input', function (event) 			// INPUT
			{			
				onChange (event)
			});

			_elements.content.addEventListener ('textInput', function (event) 	// TEXTINPUT
			{			
				onChange (event)
			}, false);

			_elements.content.addEventListener ('DOMNodeInserted', function (event) // DOMNODEINSERTED
			{			
				onChange (event)
			}, false);	
								
			// All done, lets tell the rest.
			_temp.initialized = true;		
			
			// Refresh.
			refresh ();			
		}

		// --------------------------------------------------------------------------------------------------------------
		// | PARSEATTRIBUTES												|
		// --------------------------------------------------------------------------------------------------------------
		function parseAttributes (attributes)
		{
			var result = attributes;
			
			return result;
		}	  
		
		// --------------------------------------------------------------------------------------------------------------
		// | PARSECONTENT												|
		// --------------------------------------------------------------------------------------------------------------
		function parseContent ()
		{
			var elements = _elements.content.getElementsByTagName ("*");

			for (var index = 0, max = elements.length; index < max; index++) 
			{
				if (elements[index].getAttribute ("simpleeditor-id") != null)
				{
					_temp.fields[index] = elements[index];
				}
			}
		}

		// --------------------------------------------------------------------------------------------------------------
		// | setEdit													|
		// --------------------------------------------------------------------------------------------------------------		
		function setEdit (value)
		{							
			for (var index in _temp.fields)
			{			
				var field = _temp.fields[index];
				var type = field.getAttribute ("simpleeditor-type");									

				switch (type.toLowerCase ())
				{
					case "full":
					{
						if (value)
						{
							field.setAttribute ("contenteditable", "true");							
						}
						else
						{
							field.removeAttribute ("contenteditable");
						}
						break;
					}
						
					case "simple":
					{
						if (value)
						{
							field.setAttribute ("contenteditable", "true");
						}
						else
						{
							field.removeAttribute ("contenteditable");
						}
						break;
					}
						
					case "image":
					{
						if (value)
						{
							field.setAttribute ("tabIndex", 0)
						}
						else
						{
							field.removeAttribute ("tabIndex")
						}
						break;
					}						
				}
				
				if (value)
				{
					field.onfocus = focustest;
				}
				else
				{
					field.onfocus = null;
				}
			}
		}		



		// --------------------------------------------------------------------------------------------------------------
		// | SETCONTENT													|
		// --------------------------------------------------------------------------------------------------------------
		function setContent (content)
		{			
			if (content != null)
			{
				_elements.content.innerHTML = content;
			}

			parseContent ();

			refresh ();
		}
		
		// --------------------------------------------------------------------------------------------------------------
		// | GETCONTENT													|
		// --------------------------------------------------------------------------------------------------------------
		function getContent ()
		{					
			setEdit (false);			
			
			var result = "";			
			result = _elements.content.innerHTML;
			
			refresh ();
			
			return result;
		}
		
		
		function focustest (event)
		{					
			console.log (event.target.getAttribute ("simpleeditor-id") +" "+ event.target.getAttribute ("simpleeditor-type"));
		}
		
		// --------------------------------------------------------------------------------------------------------------
		// | ONCHANGE													|
		// --------------------------------------------------------------------------------------------------------------
		function onChange (event)
		{
			eventOnChange (event);
		}	  

		// --------------------------------------------------------------------------------------------------------------
		// | REFRESH													|
		// --------------------------------------------------------------------------------------------------------------		
		function refresh ()
		{
			// ReadOnly state.
			if (!_attributes.readOnly)
			{
				setEdit (true);
			}
			else
			{
				setEdit (false);
			}
		}

		// --------------------------------------------------------------------------------------------------------------
		// | COMMAND													|
		// --------------------------------------------------------------------------------------------------------------		
		function command (attributes)
		{
			switch (attributes.command)
			{
				// BACKCOLOR
				case "backcolor":
				{
					_elements.document.execCommand ('backcolor', false, attributes.value);	
					break;
				}
				
				// FORECOLOR
				case "forecolor":
				{
					_elements.document.execCommand ('forecolor', false, attributes.value);	
					break;
				}								
			
				// BOLD
				case "bold":
				{
					_elements.document.execCommand ('bold', false, null);	
					break;
				}
				
				// ITALIC
				case "italic":
				{
					_elements.document.execCommand ('italic', false, null);	
					break;
				}

				// UNDERLINE
				case "underline":
				{
					_elements.document.execCommand ('underline', false, null);	
					break;
				}
				
				
				// SUBSCRIPT
				case "subscript":
				{
					_elements.document.execCommand ('subscript', false, null);	
					break;
				}

				// SUPERSCRIPT
				case "superscript":
				{
					_elements.document.execCommand ('superscript', false, null);
					break;
				}
				
				// STRIKETHROUGH
				case "strikethrough":
				{
					_elements.document.execCommand ('strikethrough', false, null);
					break;
				}
				
				// CREATELINK
				case "createlink":
				{
					_elements.document.execCommand ('createlink', false, attributes.value);
					break;
				}
				
				// UNLINK
				case "unlink":
				{
					_elements.document.execCommand ('unlink', false, null);
					break;
				}
								
				// INSERTORDEREDLIST
				case "insertorderedlist":
				{
					_elements.document.execCommand ('insertorderedlist', false, null);
					break;
				}
				
				// INSERTUNORDEREDLIST
				case "insertunorderedlist":
				{
					_elements.document.execCommand ('insertunorderedlist', false, null);
					break;
				}
				
				// INSERTPARAGRAPH
				case "insertparagraph":
				{
					_elements.document.execCommand ('insertparagraph', false, null);
					break;
				}
				
				// INSERTHORIZONTALRULE
				case "inserthorizontalrule":
				{
					_elements.document.execCommand ('inserthorizontalrule', false, null);
					break;
				}
				
				// INSERTIMAGE
				case "insertimage":
				{
					_elements.document.execCommand ('insertimage', false, attributes.value);
					break;
				}

				// INSERTHTML
				case "inserthtml":
				{
					_elements.document.execCommand ('inserthtml', false, attributes.value);
					break;
				}				
									
				// INDENT
				case "indent":
				{
					_elements.document.execCommand ('indent', false, null);
					break;
				}
				
				// OUTDENT	
				case "outdent":
				{
					_elements.document.execCommand ('outdent', false, null);
					break;
				}
																		
				// JUSTIFYCENTER
				case "justifycenter":
				{
					_elements.document.execCommand ('justifycenter', false, null);
					break;
				}
				
				// JUSTIFYFULL
				case "justifyfull":
				{
					_elements.document.execCommand ('justifyfull', false, null);
					break;
				}
				
				// JUSTIFYLEFT
				case "justifyleft":
				{
					_elements.document.execCommand ('justifyleft', false, null);
					break;
				}
				
				// JUSTIFYRIGHT
				case "justifyright":
				{
					_elements.document.execCommand ('justifyright', false, null);
					break;
				}
				
				// FONTNAME
				case "fontname":
				{
					_elements.document.execCommand ("fontname", false, attributes.value);
					break;
				}
				
				// FONTSIZE
				case "fontsize":
				{
					_elements.document.execCommand ("fontsize", false, attributes.value);
					break;
				}
				
				// INCREASEFONTSIZE
				case "increasefontsize":
				{
					_elements.document.execCommand ('increasefontsize', false, null);
					break;
				}
				
				// DECREASEFONTSIZE
				case "decreasefontsize":
				{
					_elements.document.execCommand ('decreasefontsize', false, null);
					break;
				}
				
				// FORMATBLOCK
				case "formatblock":
				{
					_elements.document.execCommand ('formatblock', false, attributes.value);
					break;
				}
				
				// REMOVEFORMAT
				case "removeformat":
				{
					_elements.document.execCommand ('removeformat', false, null);
					break;
				}
								
				// CUT
				case "cut":
				{
					_elements.document.execCommand ('cut', false, null);
					break;
				}
				
				// COPY
				case "copy":
				{
					_elements.document.execCommand ('copy', false, null);
					break;
				}
				
				// PASTE
				case "paste":
				{
					_elements.document.execCommand ('paste', false, null);
					break;
				}
				
				// UNDO
				case "undo":
				{
					_elements.document.execCommand ('undo', false, null);
					break;
				}
				
				// REDO
				case "redo":
				{
					_elements.document.execCommand ('redo', false, null);
					break;
				}												
			}								
		}	  
		
		function addEvent (obj, type, fn) 
		{
		    if (obj) 
		    {
			if (obj.attachEvent) 
			{
			    obj['e' + type + fn] = fn;
			    obj[type + fn] = function () { obj['e' + type + fn](window.event); };
			    obj.attachEvent('on' + type, obj[type + fn]);
			} 
			else 
			{
			    obj.addEventListener(type, fn, false);
			}
		    }
		}		
		

		// --------------------------------------------------------------------------------------------------------------
		// | FUNCTIONS													|
		// --------------------------------------------------------------------------------------------------------------		
		// --------------------------------------------------------------------------------------------------------------
		// | FUNCTIONCOMMAND												|
		// --------------------------------------------------------------------------------------------------------------				
		function functionCommand (attributes)
		{
			return command (attributes)
		}
				
		
		// --------------------------------------------------------------------------------------------------------------
		// | GETTER/SETTER												|
		// --------------------------------------------------------------------------------------------------------------		
		// --------------------------------------------------------------------------------------------------------------
		// | VALUE													|
		// --------------------------------------------------------------------------------------------------------------		
		function functionGetContent ()
		{
			if (_temp.initialized)
			{
				return getContent ();		
			}
			else
			{
				return _temp.content;
			}
		}
		
		function functionSetContent (value)
		{
			if (_temp.initialized)
			{
				setContent (value);
			}
			else
			{
				_temp.content = value;
			}
		}

		// --------------------------------------------------------------------------------------------------------------
		// | ONCHANGE													|
		// --------------------------------------------------------------------------------------------------------------		
		function functionGetOnChange ()
		{
			return _attributes.onChange;
		}
		
		function functionSetOnChange (value)
		{
			_attributes.onChange = value;
		}
		
		// --------------------------------------------------------------------------------------------------------------
		// | READONLY													|
		// --------------------------------------------------------------------------------------------------------------		
		function functionGetReadOnly ()
		{
			return _attributes.readOnly;
		}
		
		function functionSetReadOnly (value)
		{
			_attributes.readOnly = value;
			refresh ();
		}
		
		// --------------------------------------------------------------------------------------------------------------
		// | EVENTS													|
		// --------------------------------------------------------------------------------------------------------------		
		// --------------------------------------------------------------------------------------------------------------
		// | ONCHANGE													|
		// --------------------------------------------------------------------------------------------------------------		
		function eventOnChange (event)
		{		
			if (_attributes.onChange != null)
			{
				setTimeout (_attributes.onChange, 0);
			}
		}
		
	  }