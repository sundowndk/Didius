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
		id : null,
		timer : null,
		
		
		attach : function ()
		{
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=sXUL.EventListener.Attach", "data", "POST", false);	
			request.send ();
			
			var result = request.respons ()["value"];
			
			sXUL.eventListener.id = result;
			
			setInterval (function () {sXUL.eventListener.update ({id: sXUL.eventListener.id}) }, 3000);			
		
			
			//var events = sXUL.eventListener.update ({id: app.session.eventListenerId, onDone: onDone});
										
			return result;
		},
			
		detach : function (id)
		{
			var content = new Array ();
			content["eventlistenerid"] = id;
		
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=sXUL.EventListener.Detach", "data", "POST", false);		
			request.send (content);			
		},
		
		update : function (attributes)
		{
			if (!attributes)
				attributes = new Array ();
			
			//if (!attributes.id)
				//throw "No ID given, cannot update eventListener";
				
			//attributes.id = sXUL.eventListener.id;
						
			var content = new Array ();			
									
			content["eventlistenerid"] = attributes.id;
			
			if (attributes.eventId != null)
			{
				content["eventid"] = attributes.eventId;
			}
			
			if (attributes.eventData != null)
			{
				var test = {};
			
				for (index in attributes.eventData)
				{
					test[index] = attributes.eventData[index];
				}
			
				content["eventdata"] = test;
			}		
		
			var onDone = 	function (respons)
							{	
								var events = respons["sxul.events"];
																	
								
									for (index in events)
									{
										events[index].data.SXULREMOTEEVENT = true;
									}
									
									for (index in events)
									{
										event = events[index]
									
										dump ("\n"+ event.name +"\n");
										dump (event.data +"\n");
											
									
										app.events[event.name].execute (event.data);
									}																																				
							};
				
			var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=sXUL.EventListener.Update", "data", "POST", true);			
			request.onLoaded (onDone);
			request.send (content);													
		}
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: console
	// ---------------------------------------------------------------------------------------------------------------
	console :
	{
		log : function (data)
		{
			dump (data +"\n");
		}
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: helpers
	// ---------------------------------------------------------------------------------------------------------------
	helpers :
	{
		tree : function (attributes)
		{
			var _attributes = attributes;				
			var _elements = Array ();
			var _rows = Array ();
			
			var _temp = {};			
			
			this.addRow = addRow;
			this.removeRow = removeRow;
			
			this.setRow = setRow;
			this.getRow = getRow;
									
			this.sort = sort;		
			this.filter = filter;							
			
			this.clear = clear;
			
			this.getCurrentIndex = getCurrentIndex;
			
			init ();
				
			function init ()
			{
				if (!_attributes)
					_attributes = new Array ();
							
				if (!_attributes.element)
					throw "Need an treeview element to attatch to.";
			
				_elements.tree = _attributes.element;				
				_elements.treeChildren = document.createElement ("treechildren");
				_elements.tree.appendChild (_elements.treeChildren);
															
				// Check if Id TreeColumn exists
				var treeColumns = _elements.tree.columns;
				if (!treeColumns.getNamedColumn ("id"))
				{
					throw "No Id column found.";
				}				
						
				_elements.tree.ondblclick = onDoubleClick;
				
				if (attributes.sort)
				{
					_temp.sortColumn = _attributes.sort;
					_temp.sortDirection = _attributes.sortDirection;
					
					// Set sortdirection on newly sorted column.	
					document.getElementById (_temp.sortColumn).setAttribute ("sortDirection", _temp.sortDirection);									
				}
																
				if (attributes.filter)
				{
					_temp.filterColumn = _attributes.filter;
					_temp.filterValue = _attributes.filterValue;
					_temp.filterDirection = _attributes.filterDirection;
				}																																														
			};
			
			function onDoubleClick (event)
			{
				var index = _elements.tree.treeBoxObject.getRowAt (event.clientX,event.clientY)
				
				if (_attributes.onDoubleClick != null && index != -1)
				{			
					_attributes.onDoubleClick (index);
				}
			}
								
			function refresh ()
			{									
				// Clear all rows.
				clear ();
				
				var compareFunc;
				if (_temp.sortDirection == "ascending") 
				{
				compareFunc = 	function (second, first) 
								{    									    							
									if (first.data[_temp.sortColumn].toLowerCase () < second.data[_temp.sortColumn].toLowerCase ())
									{
										return -1;	
									}
									
									if (first.data[_temp.sortColumn].toLowerCase () > second.data[_temp.sortColumn].toLowerCase ())
									{
										return 1;	
									}
								}
				} 
				else 
				{  				
				compareFunc = 	function (first, second) 
								{       									
									if (first.data[_temp.sortColumn].toLowerCase () < second.data[_temp.sortColumn].toLowerCase ())
									{
										return -1;	
									}
									
									if (first.data[_temp.sortColumn].toLowerCase () > second.data[_temp.sortColumn].toLowerCase ())
									{
										return 1;	
									}
									return 0;      								
								}
				}
				
				// Sort rows.
		//		if (_attributes.sortColumn != null)
		//		{
					_rows.sort (compareFunc);
		//		}
				
			
				for (var idx = 0; idx < 11; idx++) 
				{
					for (index in _rows)
					{	
						if (_temp.filterColumn != null)
						{
						
							if (_temp.filterDirection == "in")
							{							
								if (_rows[index].data[_temp.filterColumn].toLowerCase ().indexOf(_temp.filterValue.toLowerCase ()) == -1)
								{
									//dump (_temp.filterColumn +" "+ _temp.filterValue +"\n")
									continue;
								}
							}
							else if (_temp.filterDirection == "out")
							{							
								if (_rows[index].data[_temp.filterColumn].toLowerCase ().indexOf(_temp.filterValue.toLowerCase ()) != -1)
								{
									//dump (_temp.filterColumn +" "+ _temp.filterValue +"\n")
									continue;
								}
							}
						}
													
						if (_rows[index].level == idx)
						{
							try
							{
								drawRow (_rows[index]);
							}
							catch (Exception)
							{							
							}							
						}
					}
				}				
			}	
			
			function drawRow (attributes)
			{							
				// Create new TreeItem.
				var treeItem = document.createElement ('treeitem');				
				treeItem.setAttribute ("id", attributes.data.id +"-treeitem");
											
				// If isChildOfId is set, append TreeItem to correct TreeChildren.
				if (attributes.isChildOfId)
				{														
					if (!_elements[attributes.isChildOfId] +"-treeChildren")
					{						
						var treeChildren = document.createElement ("treechildren");
						treeChildren.setAttribute ("id", attributes.isChildOfId +"-treechildren");	
						
						document.getElementById (attributes.isChildOfId +"-treeitem").appendChild (treeChildren);
						document.getElementById (attributes.isChildOfId +"-treeitem").setAttribute ("container", true);						
					}
					
					document.getElementById (attributes.isChildOfId +"-treechildren").appendChild (treeItem);
				}
				else
				{		
					_elements.treeChildren.appendChild (treeItem)
				}		
				
				// Get treelevel.
				attributes.level = getLevel (treeItem);
												
				// Create TreeRow.
				var treeRow = document.createElement ('treerow');
				treeItem.appendChild (treeRow);
																		
				// Find TreeColumns and fill them with data.
				var treeColumns = _elements.tree.columns;											
				for (var idx = 0; idx < treeColumns.length; idx++)
				{
					var treeColumn = treeColumns.getColumnAt (idx);					
					
					if (attributes.data[treeColumn.id] != null)
					{
						var treeCell = document.createElement ('treecell');
						treeCell.setAttribute ('label', attributes.data[treeColumn.id]);
						treeRow.appendChild (treeCell);
					}
				}																			
			}	
			
			function clear ()
			{				
				while (_elements.treeChildren.firstChild) 
				{
					_elements.treeChildren.removeChild (_elements.treeChildren.firstChild);
				}
			}
					
			function sort (attributes)
			{
				if (!attributes)
					attributes = new Array ();
					
				if (!attributes.direction)
					attributes.direction = null;
										
				// Remove sortdirection on currently sorted column.
				if (_temp.sortColumn != null)
				{
					document.getElementById (_temp.sortColumn).removeAttribute ("sortDirection");
				}
																				 
				// Figure out sortdirection.
				// If its the same column we are sorting, just reverse sort direction.
				// If its not the same, we start with ascending.  							
				if (attributes.direction == null)
				{
					if (_temp.sortColumn == attributes.column)
					{
					if (_temp.sortDirection == "ascending")
					{
						attributes.direction = "descending";
					}
					else
					{
						attributes.direction = "ascending";
					}
				}
				else
				{
					attributes.direction = "ascending";
				}
				}  				
				
				_temp.sortColumn = attributes.column;
				_temp.sortDirection = attributes.direction; 
		  				  																		
				// Refresh rows.
				refresh ();
															
				// Set sortdirection on newly sorted column.	
				document.getElementById (attributes.column).setAttribute ("sortDirection", _temp.sortDirection);				 												
			}
			
			function filter (attributes)
			{
				if (!attributes)
					attributes = new Array ();
					
				if (!attributes.direction)
					attributes.direction = "in";
					
				_temp.filterColumn = attributes.column;
				_temp.filterValue = attributes.value;
				_temp.filterDirection = attributes.direction;
				
				refresh ();
			}
					
			function addRow (attributes)
			{
				// Set attributes.
				if (!attributes)
					attributes = new Array ();
					
				if (!attributes.id)
					attributes.id = SNDK.tools.newGuid ();
					
				if (!attributes.data)
					attributes.data = new Array ();
					
				if (!attributes.data.id)
					throw "Data does not container Id key.";
										
				if (!attributes.isOpen)
					attributes.isOpen = false;
					
				if (attributes.isChildOfId)
				{
					attributes.level = getLevel2 (attributes.isChildOfId);
					
					dump (attributes.level +"\n");
				}
				else
				{
					attributes.level = 0;
				}
				
				var checkforrow =	function (id)
									{
									    for (var idx = 0; idx < _rows.length; idx++) 
									    {
										if (_rows[idx].id == id) 
										{
										return true;
										}
									}    									
									return false;
									};		
						
				if (!checkforrow (attributes.id))
				{
			 		_rows[_rows.length] = attributes;
			 	}
			 		 		 				 
			 	refresh ();
			 	
			 	return attributes.id;
			}	
			
			function removeRow (attributes)
			{
				var row = -1;
		
				if (!attributes)
					attributes = new Array ();
									
				if (!attributes.data)
					attributes.data = new Array ();
				
				
																												
				if (!attributes.id)
				{
					row = _elements.tree.currentIndex;
				}
				else
				{				
					for (var idx in _rows)
					{
						if (_rows[idx].data.id == attributes.id)
						{			
							_rows.splice (idx, 1);
							break;										
						}
					}											
				//	for (var idx = 0; idx < _elements.tree.view.rowCount; idx++) 
				//	{
				//		if (_elements.tree.view.getCellText (idx, _elements.tree.columns.getNamedColumn ('id')) == attributes.id)
				//		{					
				//			row = idx;				
				//			break;
				//		}
				//	}
				}
				
				refresh ();
				//if (row != -1)
				//{
				//	_elements.tree.view.getItemAtIndex (row).parentNode.removeChild (_elements.tree.view.getItemAtIndex (row));
				//}
			}
					
			function setRow (attributes)
			{
				var row = -1;
			
				if (!attributes)
					attributes = new Array ();
						
				if (!attributes.data)
					attributes.data = new Array ();
										
				if (!attributes.data.id)
				{
				
				}
				else
				{
					for (idx in _rows)
					{
						if (_rows[idx].data.id == attributes.data.id)
						{
							// Find TreeColumns and change data.
							var treeColumns = _elements.tree.columns;											
							for (var idx2 = 0; idx2 < treeColumns.length; idx2++)
							{
								var treeColumn = treeColumns.getColumnAt (idx2);
								if (attributes.data[treeColumn.id] != null)
								{
									_rows[idx].data[treeColumn.id] = attributes.data[treeColumn.id];									
								}
							}		
							break;										
						}
					}
				}
				
				refresh ();				
			}		
			
			function getRow (attributes)
			{
				var result = new Array ();
				var row = -1;
				
				if (!attributes)
					attributes = new Array ();
					
				if (!attributes.id)
				{
					row = _elements.tree.currentIndex;
				}
				else
				{
					for (var idx = 0; idx < _elements.tree.view.rowCount; idx++) 
					{
						if (_elements.tree.view.getCellText (idx, _elements.tree.columns.getNamedColumn ('id')) == attributes.id)
						{					
							row = idx;
							break;
						}
					}	
				}
									
				if (row != -1)
				{	
					// Find TreeColumns and fill result with data.
					var treeColumns = _elements.tree.columns;											
					for (idx = 0; idx < treeColumns.length; idx++)
					{
						var treeColumn = treeColumns.getColumnAt (idx);																	
						result[treeColumn.id] = _elements.tree.view.getCellText (row, treeColumn);													
					}				
				}
				
				return result;
			}
					
					
					
					
					
			function getCurrentIndex ()
			{
				return _elements.tree.view.selection.currentIndex; //returns -1 if the tree is not focused
			}						
														
			function getLevel (element)
			{				
				var parser =	function (element, count)
								{
									//dump (element.parentNode.nodeName +" : "+ count +"\n");
									if (element.parentNode.nodeName != "tree")
									{
										if (element.parentNode.nodeName != "treechildren")
										{
											count++;
										}
										
										return parser (element.parentNode, count++)
									}
									return count;				
								};
			
				return parser (element, 0);				
			}
					
			function getLevel2 (id)
			{
				var parser =	function (id, count)
								{
									count++;
									for (index in _rows)
									{
										//dump (id +" "+ _rows[index].data.id +" "+ _rows[index].data.parentid +"\n")
										
										if ((_rows[index].data.id == id) && (_rows[index].data.parentid != SNDK.tools.emptyGuid))
										{																					
											return parser (_rows[index].data.parentid, count)
										}
									}
									return count;
								};
								
				return parser (id, 0)
			}
		}	
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: user
	// ---------------------------------------------------------------------------------------------------------------
	user :
	{
		create : function (username, email)
		{
			var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=SorentoLib.User.New", "data", "POST", false);			
			
			var content = new Array ();
			content["username"] = username;
			content["email"] = email;
			request.send (content);
			
			return request.respons ()["sorentolib.user"];		
		},
		
		load : function (id)
		{
			var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=SorentoLib.User.Load", "data", "POST", false);	
			
			var content = new Array ();
			content["id"] = id;
						
			request.send (content);
			
			return request.respons ()["sorentolib.user"];
		},
		
		save : function (user)
		{
			var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=SorentoLib.User.Save", "data", "POST", false);				
			
			var content = new Array ();
			content["sorentolib.user"] = user;
				
			request.send (content);		
			
			return true;
		},
		
		delete : function (id)
		{
			var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=SorentoLib.User.Delete", "data", "POST", false);	
			
			var content = new Array ();
			content["id"] = id;
			
			request.send (content);				
			
			return true;
		},
		
		list : function ()
		{
			var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=SorentoLib.User.List", "data", "POST", false);	
				
			request.send ();
													
			return request.respons ()["sorentolib.users"];
		},
		
		changePassword : function (userid, newPassword, oldPassword)
		{
			var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=SorentoLib.User.ChangePassword", "data", "POST", false);
			
			var content = new Array ();
			content["userid"] = userid;
			content["newpassword"] = newPassword;
			if (oldPassword != null)
			{
				content["oldpassword"] = oldPassword;
			}
				
			request.send (content);
			
			return request.respons ()["result"];	
		},
		
		isUsernameInUse : function (username, id)
		{
			var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=SorentoLib.User.IsUsernameInUse", "data", "POST", false);	
		
			var content = new Array ();	
			content['username'] = username;		
			if (id != null)
			{
				content['id'] = id;
			}
			
			request.send (content);
		
		 	return request.respons ()["result"];
		},
		
		isEmailInUse : function (email, id)
		{
			var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=SorentoLib.User.IsEmailInUse", "data", "POST", false);	
		
			var content = new Array ();
		
			content["email"] = email;
			if (id != null)
			{
				content["id"] = id;
			}
		
			request.send (content);
		
			return request.respons ()["result"];
		}		
		
	},

	// ---------------------------------------------------------------------------------------------------------------
	// CLASS: usergroup
	// ---------------------------------------------------------------------------------------------------------------
	usergroup :
	{
		create : function (usergroup)
		{
			var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=SorentoLib.Usergroup.New", "data", "POST", false);			
			request.send (usergroup);
			
			return request.respons ()["sorentolib.usergroup"];		
		},
		
		load : function (id)
		{
			var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=SorentoLib.Usergroup.Load", "data", "POST", false);	
			
			var content = new Array ();
			content["id"] = id;
						
			request.send (content);
			
			return request.respons ()["sorentolib.usergroup"];
		},
		
		save : function (usergroup)
		{
			var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=SorentoLib.Usergroup.Save", "data", "POST", false);				
			
			var content = new Array ();
			content["sorentolib.usergroup"] = usergroup;
			request.send (content);		
			
			return true;
		},
		
		delete : function (id)
		{
			var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=SorentoLib.Usergroup.Delete", "data", "POST", false);	
			
			var content = new Array ();
			content["id"] = id;
			
			request.send (content);				
			
			return true;
		},		
		
		list : function ()
		{
			var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=SorentoLib.Usergroup.List", "data", "POST", false);					
			request.send ();
													
			return request.respons ()["sorentolib.usergroups"];
		},
		
		accesslevels : function ()
		{
			var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=SorentoLib.Usergroup.Accesslevels", "data", "POST", false);					
			request.send ();
																															
			return request.respons ()["sorentolib.enums.accesslevels"];
		}
	},

	event : function (attributes)
	{
		var _attributes = attributes;
		var _eventHandlers = new Array ();
		
	
		init ();
	
		function init ()
		{
			if (!_attributes)
				_attributes = new Array ();
			
			if (_attributes.remotePropagation)
			{
				if (!_attributes.id)
				{
					throw "No ID specified for remote event.";
				}
				
				var remotePropagation =	function (eventData)
										{		
										//sXUL.eventListener.update ({id: app.session.eventListenerId, eventId: _attributes.id, eventData: eventData});	
											if (!eventData.SXULREMOTEEVENT)																
												sXUL.eventListener.update ({id: sXUL.eventListener.id, eventId: _attributes.id, eventData: eventData});
										};
									
				addHandler (remotePropagation);
			}
		}
	
		this.addHandler = addHandler;
		this.removeHandler = removeHandler;
		this.execute = execute;
				
		function addHandler (eventHandler)
		{
			_eventHandlers.push (eventHandler);
		}
		
		function removeHandler (eventHandler)
		{
			for (var idx in _eventHandlers) 
			{	
				if (_eventHandlers[idx] === eventHandler) 
				{			
					_eventHandlers.splice (idx, 1);
					return;
				}	
			}
		}
		
		function execute (eventData)
		{
			for (var idx = 0; idx < _eventHandlers.length; idx++)
			{
				_eventHandlers[idx] (eventData);
			}
		}
	}
}

