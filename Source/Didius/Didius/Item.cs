// 
//  Item.cs
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

using SNDK;
using SorentoLib;

namespace Didius
{
	public class Item
	{
		#region Public Static Fields
		public static string DatastoreAisle = "didius_items";
		#endregion
		
		#region Private Fields
		private Guid _id;
		
		private int _createtimestamp;
		private int _updatetimestamp;

		private Guid _caseid;

		private string _title;
		private string _description;

		private Hashtable _fields;
		#endregion
		
		#region Public Fields
		public Guid Id
		{
			get
			{
				return this._id;
			}
		}
		
		public int CreateTimestamp
		{
			get
			{
				return this._createtimestamp;
			}
		}
		
		public int UpdateTimestamp
		{
			get
			{
				return this._updatetimestamp;
			}
		}

		public Guid CaseId
		{
			get
			{
				return this._caseid;
			}
		}

		public string Title
		{
			get
			{
				return this._title;
			}

			set
			{
				this._title = value;
			}
		}

		public string Description
		{
			get
			{
				return this._description;
			}
			
			set
			{
				this._description = value;
			}
		}

		public Hashtable Fields
		{
			get
			{
				return this._fields;
			}
		}
		#endregion
		
		#region Constructor
		public Item (Case Case)
		{
			this._id = Guid.NewGuid ();
			
			this._createtimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			
			this._caseid = Case.Id;

			this._title = string.Empty;
			this._description = string.Empty;

			this._fields = new Hashtable ();
		}
		
		private Item ()
		{
			this._createtimestamp = 0;
			this._updatetimestamp = 0;

			this._title = string.Empty;
			this._description = string.Empty;

			this._fields = new Hashtable ();
		}
		#endregion
		
		#region Public Methods
		public void Save ()
		{
			try
			{
				this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
				
				Hashtable item = new Hashtable ();
				
				item.Add ("id", this._id);
				item.Add ("createtimestamp", this._createtimestamp);
				item.Add ("updatetimestamp", this._updatetimestamp);		
								
				item.Add ("caseid", this._caseid);

				item.Add ("title", this._title);

				item.Add ("description", this._description);
				item.Add ("fields", this._fields);
				
				SorentoLib.Services.Datastore.Meta meta = new SorentoLib.Services.Datastore.Meta ();
				meta.Add ("caseid", this._caseid);
				
				SorentoLib.Services.Datastore.Set (DatastoreAisle, this._id.ToString (), SNDK.Convert.ToXmlDocument (item, this.GetType ().FullName.ToLower ()), meta);
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.ITEM", exception.Message));
				
				// EXCEPTION: Exception.ItemSave
				throw new Exception (string.Format (Strings.Exception.ItemSave, this._id.ToString (), exception.Message));
			}					
		}
		
		public XmlDocument ToXmlDocument ()
		{
			Hashtable result = new Hashtable ();
			
			result.Add ("id", this._id);
			result.Add ("createtimestamp", this._createtimestamp);
			result.Add ("updatetimestamp", this._updatetimestamp);				
			
			result.Add ("caseid", this._caseid);

			result.Add ("title", this._title);
			result.Add ("description", this._description);

			result.Add ("fields", this._fields);
			
			return SNDK.Convert.ToXmlDocument (result, this.GetType ().FullName.ToLower ());
		}
		#endregion
		
		#region Public Static Methods
		public static Item Load (Guid Id)
		{
			Item result;
			
			try
			{
				Hashtable item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (SorentoLib.Services.Datastore.Get<XmlDocument> (DatastoreAisle, Id.ToString ()).SelectSingleNode ("(//didius.item)[1]")));
				result = new Item ();

				if (item.ContainsKey ("id"))
				{
					result._id = new Guid ((string)item["id"]);
				}
				else
				{
					// EXCEPTION: Excpetion.ItemFromXmlDocument
					throw new Exception (string.Format (Strings.Exception.ItemFromXmlDocument, "ID"));
				}
				
				if (item.ContainsKey ("createtimestamp"))
				{
					result._createtimestamp = int.Parse ((string)item["createtimestamp"]);
				}
				
				if (item.ContainsKey ("updatetimestamp"))
				{
					result._updatetimestamp = int.Parse ((string)item["updatetimestamp"]);
				}
								
				if (item.ContainsKey ("caseid"))
				{					
					result._caseid = new Guid ((string)item["caseid"]);
				}
				else
				{
					// EXCEPTION: Excpetion.ItemFromXmlDocument
					throw new Exception (string.Format (Strings.Exception.ItemFromXmlDocument, "CASEID"));
				}

				if (item.ContainsKey ("title"))
				{					
					result._title = (string)item["title"];
				}

				if (item.ContainsKey ("description"))
				{					
					result._description = (string)item["description"];
				}

				if (item.ContainsKey ("fields"))
				{					
					result._fields = (Hashtable)item["fields"];
				}
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.ITEM", exception.Message));
				
				// EXCEPTION: Excpetion.ItemLoadGuid
				throw new Exception (string.Format (Strings.Exception.ItemLoadGuid, Id, exception.Message));
			}	
			
			return result;
		}

		public static void Delete (Item Item)
		{
			Delete (Item.Id);
		}

		public static void Delete (Guid Id)
		{
			try
			{
				SorentoLib.Services.Datastore.Delete (DatastoreAisle, Id.ToString ());
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.ITEM", exception.Message));
				
				// EXCEPTION: Exception.ItemDeleteGuid
				throw new Exception (string.Format (Strings.Exception.ItemDeleteGuid, Id.ToString (), exception.Message));
			}			
		}
		
		public static List<Item> List (Case Case)
		{
			return List (Case.Id);
		}
		
		public static List<Item> List (Guid CaseId)
		{
			List<Item> result = new List<Item> ();
			
			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("caseid", SorentoLib.Enums.DatastoreMetaSearchCondition.Equal, CaseId)))
			{
				try
				{
					result.Add (Load (new Guid (id)));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.ITEM", exception.Message));
					
					// LOG: LogDebug.ItemList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.ItemList, id));
				}
			}
			
			return result;
		}
		
		public static List<Item> List ()
		{
			List<Item> result = new List<Item> ();
			
			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle))
			{
				try
				{
					result.Add (Load (new Guid (id)));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.ITEM", exception.Message));
					
					// LOG: LogDebug.ItemList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.ItemList, id));
				}
			}
			
			return result;
		}
		
		public static Item FromXmlDocument (XmlDocument xmlDocument)
		{
			Hashtable item;
			Item result = new Item ();
			
			try
			{
				item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (xmlDocument.SelectSingleNode ("(//didius.Item)[1]")));
			}
			catch
			{
				item = (Hashtable)SNDK.Convert.FromXmlDocument (xmlDocument);
			}
			
			if (item.ContainsKey ("id"))
			{
				result._id = new Guid ((string)item["id"]);
			}
			else
			{
				throw new Exception (string.Format (Strings.Exception.ItemFromXmlDocument, "ID"));
			}
			
			if (item.ContainsKey ("createtimestamp"))
			{
				result._createtimestamp = int.Parse ((string)item["createtimestamp"]);
			}
			
			if (item.ContainsKey ("updatetimestamp"))
			{
				result._updatetimestamp = int.Parse ((string)item["updatetimestamp"]);
			}

			if (item.ContainsKey ("caseid"))
			{					
				result._caseid = new Guid ((string)item["caseid"]);
			}	
			else
			{
				throw new Exception (string.Format (Strings.Exception.ItemFromXmlDocument, "ITEMID"));
			}

			if (item.ContainsKey ("title"))
			{					
				result._title =(string)item["title"];
			}	

			if (item.ContainsKey ("description"))
			{					
				result._description =(string)item["description"];
			}	

			if (item.ContainsKey ("fields"))
			{					
				result._fields =(Hashtable)item["fields"];
			}	
			
			return result;
		}
		#endregion
	}
}

