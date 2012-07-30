// 
//  ItemContent.cs
//  
//  Author:
//      Rasmus Pedersen (rvp@qnax.net)
// 
//  Copyright (c) 2012 QNAX ApS
// 

using System;
using System.Xml;
using System.Collections;
using System.Collections.Generic;

namespace Didius
{
	public class ItemContent
	{
		#region Private Fields
		public string _name;
		public string _content;
		#endregion
		
		#region Public Fields
		public string Name
		{
			get
			{
				return this._name;
			}
			
			set
			{
				this._name = value;
			}
		}
		
		public string Content
		{
			get
			{
				return this._content;
			}
			
			set
			{
				this._content = value;
			}
		}
		#endregion
		
		#region Constructor
		public ItemContent ()
		{
			this._name = string.Empty;
			this._content = string.Empty;
		}
		#endregion
		
		#region Public Methods		
		public XmlDocument ToXmlDocument ()
		{
			Hashtable result = new Hashtable ();
			
			result.Add ("name", this._name);
			result.Add ("content", this._content);
			
			return SNDK.Convert.ToXmlDocument (result, this.GetType ().FullName.ToLower ());
		}
		#endregion
		
		#region Public Static Methods
		public static RootFilter FromXmlDocument (XmlDocument xmlDocument)
		{
			Hashtable item;
			RootFilter result;
			
			try
			{
				item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (xmlDocument.SelectSingleNode ("(//scms.rootfilter)[1]")));
			}
			catch
			{
				item = (Hashtable)SNDK.Convert.FromXmlDocument (xmlDocument);
			}
			
			try
			{				
				result = new RootFilter (SNDK.Convert.StringToEnum<Enums.RootFilterType> ((string)item["type"]));
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "SCMS.ROOTFILTER", exception.Message));
				
				// EXCEPTION: Exception.RootFilterFromXMLDocument
				throw new Exception (Strings.Exception.RootFilterFromXMLDocument);
			}
			
			if (item.ContainsKey ("data"))
			{
				result._data = (string)item["data"];
			}
			
			return result;
		}				
#endregion
	}
}

