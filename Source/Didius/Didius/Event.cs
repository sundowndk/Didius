using System;
using System.Xml;
using System.Collections;
using System.Collections.Generic;

using SNDK;
using SorentoLib;

namespace Didius
{
	public class Event
	{
		#region Public Static Fields
		public static string DatastoreAisle = "didius_events";
		#endregion
		
		#region Private Fields
		private Guid _id;
		
		private int _createtimestamp;
		private int _updatetimestamp;

		private string _name;
		private Guid _ownerid;
		private string _data;
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

		public string Name
		{
			get
			{
				return this._name;
			}
		}
		
		public Guid OwnerId
		{
			get
			{
				return this._ownerid;
			}
		}
		
		public string Data
		{
			get
			{
				return this._data;
			}			
		}
		#endregion
		
		#region Constructor
		public Event (Guid OwnerId, string Name, string Data)
		{
			this._id = Guid.NewGuid ();
			this._createtimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._ownerid = OwnerId;
			this._name = Name;
			this._data = Data;
		}

		public Event ()
		{
			this._id = Guid.Empty;
			this._createtimestamp = 0;
			this._updatetimestamp = 0;
			this._ownerid = Guid.Empty;
			this._name = string.Empty;
			this._data = string.Empty;
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
				item.Add ("name", this._name);
				item.Add ("ownerid", this._ownerid);
				item.Add ("data", this._data);

				SorentoLib.Services.Datastore.Meta meta = new SorentoLib.Services.Datastore.Meta ();
				meta.Add ("updatetimestamp", this._updatetimestamp);
				meta.Add ("ownerid", this._ownerid);
				
				SorentoLib.Services.Datastore.Set (DatastoreAisle, this._id.ToString (), SNDK.Convert.ToXmlDocument (item, this.GetType ().FullName.ToLower ()), meta);
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.EVENTLISTENER", exception.Message));
				
				// EXCEPTION: Exception.EventListenerSave
				throw new Exception (string.Format (Strings.Exception.EventListenerSave, this._id.ToString ()));
			}					
		}

		public XmlDocument ToXmlDocument ()
		{
			Hashtable result = new Hashtable ();
			
			result.Add ("id", this._id);
			result.Add ("createtimestamp", this._createtimestamp);
			result.Add ("updatetimestamp", this._updatetimestamp);
			
			result.Add ("name", this._name);			
			result.Add ("ownerid", this._ownerid);			
			result.Add ("data", this._data);
			
			return SNDK.Convert.ToXmlDocument (result, this.GetType ().FullName.ToLower ());
		}
		#endregion
		
		#region Public Static Methods
		public static Event Load (Guid Id)
		{
			Event result;
			
			try
			{
				Hashtable item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (SorentoLib.Services.Datastore.Get<XmlDocument> (DatastoreAisle, Id.ToString ()).SelectSingleNode ("(//didius.event)[1]")));
				result = new Event ();
				
				result._id = new Guid ((string)item["id"]);
				
				if (item.ContainsKey ("createtimestamp"))
				{
					result._createtimestamp = int.Parse ((string)item["createtimestamp"]);
				}
				
				if (item.ContainsKey ("updatetimestamp"))
				{
					result._updatetimestamp = int.Parse ((string)item["updatetimestamp"]);
				}

				if (item.ContainsKey ("name"))
				{
					result._name = (string)item["name"];
				}

				if (item.ContainsKey ("ownerid"))
				{
					result._ownerid = new Guid ((string)item["ownerid"]);
				}

				if (item.ContainsKey ("data"))
				{
					result._data = (string)item["data"];
				}
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.EVENTLISTENER", exception.Message));
				
				// EXCEPTION: Excpetion.EventListenerLoadGuid
				throw new Exception (string.Format (Strings.Exception.EventListenerLoadGuid, Id));
			}	
			
			return result;
		}

		public static List<Event> List (EventListener EventListener)
		{
			List<Event> result = new List<Event> ();

//			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("ownerid", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.NotEqual, EventListener.Id)))
			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle))
			{
				try
				{
					Event e = Event.Load (new Guid (id));
					if (e._updatetimestamp > EventListener.UpdateTimestamp)
					{
						result.Add (e);
					}
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.CUSTOMER", exception.Message));
					
					// LOG: LogDebug.CustomerList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.CustomerList, id));
				}
			}

			result.Sort (delegate (Event e1, Event e2) { return e1.UpdateTimestamp.CompareTo (e2.UpdateTimestamp); });

			return result;
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
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.EVENTLISTENER", exception.Message));
				
				// EXCEPTION: Exception.EventListenerDeleteGuid
				throw new Exception (string.Format (Strings.Exception.EventListenerDeleteGuid, Id.ToString ()));
			}			
		}
		#endregion
	}
}

