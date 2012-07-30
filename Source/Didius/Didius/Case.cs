// 
//  CustomerGroup.cs
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
	public class Case
	{
		#region Public Static Fields
		public static string DatastoreAisle = "didius_cases";
		#endregion
		
		#region Private Fields
		private Guid _id;
		
		private int _createtimestamp;
		private int _updatetimestamp;

		private string _no;

		private Guid _customerid;
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

		public string No
		{
			get
			{
				return this._no;
			}
		}

		public Guid CustomerId
		{
			get
			{
				return this._customerid;
			}
		}
		#endregion
		
		#region Constructor
		public Case (Customer Customer)
		{
			this._id = Guid.NewGuid ();
			
			this._createtimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			
			this._no = DateTime.Now.Month.ToString () + DateTime.Now.Day.ToString () + DateTime.Now.Hour.ToString () + DateTime.Now.Minute.ToString () + DateTime.Now.Second.ToString () + DateTime.Now.Millisecond.ToString ();

			this._customerid = Customer.Id;
		}

		private Case ()
		{
			this._createtimestamp = 0;
			this._updatetimestamp = 0;

			this._no = DateTime.Now.Month.ToString () + DateTime.Now.Day.ToString () + DateTime.Now.Hour.ToString () + DateTime.Now.Minute.ToString () + DateTime.Now.Second.ToString () + DateTime.Now.Millisecond.ToString ();
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

				item.Add ("no", this._no);

				item.Add ("customerid", this._customerid);

				SorentoLib.Services.Datastore.Meta meta = new SorentoLib.Services.Datastore.Meta ();
				meta.Add ("customerid", this._customerid);
				
				SorentoLib.Services.Datastore.Set (DatastoreAisle, this._id.ToString (), SNDK.Convert.ToXmlDocument (item, this.GetType ().FullName.ToLower ()), meta);				
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.CASE", exception.Message));
				
				// EXCEPTION: Exception.PageSave
				throw new Exception (string.Format (Strings.Exception.CaseSave, this._id.ToString ()));
			}					
		}
		
		public XmlDocument ToXmlDocument ()
		{
			Hashtable result = new Hashtable ();
			
			result.Add ("id", this._id);
			result.Add ("createtimestamp", this._createtimestamp);
			result.Add ("updatetimestamp", this._updatetimestamp);
			
			result.Add ("no", this._no);

			result.Add ("customerid", this._customerid);
			
			return SNDK.Convert.ToXmlDocument (result, this.GetType ().FullName.ToLower ());
		}
		#endregion
		
		#region Public Static Methods
		public static Case Load (Guid Id)
		{
			Case result;
			
			try
			{
				Hashtable item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (SorentoLib.Services.Datastore.Get<XmlDocument> (DatastoreAisle, Id.ToString ()).SelectSingleNode ("(//didius.case)[1]")));
				result = new Case ();
				
				result._id = new Guid ((string)item["id"]);
				
				if (item.ContainsKey ("createtimestamp"))
				{
					result._createtimestamp = int.Parse ((string)item["createtimestamp"]);
				}
				
				if (item.ContainsKey ("updatetimestamp"))
				{
					result._updatetimestamp = int.Parse ((string)item["updatetimestamp"]);
				}
				
				if (item.ContainsKey ("no"))
				{					
					result._no = (string)item["no"];
				}				

				if (item.ContainsKey ("customerid"))
				{					
					result._customerid = new Guid ((string)item["customerid"]);
				}				
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.CASE", exception.Message));
				
				// EXCEPTION: Excpetion.PageLoadName
				throw new Exception (string.Format (Strings.Exception.CaseLoadGuid, Id));
			}	
			
			return result;
		}
		
		public static void Delete (Guid Id)
		{
			// We can not delete Customer with a Case related to it.
			if (Item.List (Id).Count == 0)
			{
				try
				{
					SorentoLib.Services.Datastore.Delete (DatastoreAisle, Id.ToString ());
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.CASE", exception.Message));
				
					// EXCEPTION: Exception.PageDelete
					throw new Exception (string.Format (Strings.Exception.CaseDeleteGuid, Id.ToString ()));
				}			
			}
			else
			{
				// EXCEPTION: Exception.CaseDeleteInUse
				throw new Exception (string.Format (Strings.Exception.CAseDeleteInUse, Id.ToString ()));
			}
		}

		public static List<Case> List (Customer Customer)
		{
			return List (Customer.Id);
		}

		public static List<Case> List (Guid CustomerId)
		{
			List<Case> result = new List<Case> ();
			
			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("customerid", SorentoLib.Enums.DatastoreMetaSearchCondition.Equal, CustomerId)))
			{
				try
				{
					result.Add (Load (new Guid (id)));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.CASE", exception.Message));
					
					// LOG: LogDebug.PageList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.CaseList, id));
				}
			}
			
			return result;
		}

		public static List<Case> List ()
		{
			List<Case> result = new List<Case> ();

			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle))
			{
				try
				{
					result.Add (Load (new Guid (id)));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.CASE", exception.Message));
					
					// LOG: LogDebug.PageList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.CaseList, id));
				}
			}
			
			return result;
		}
		
		public static Case FromXmlDocument (XmlDocument xmlDocument)
		{
			Hashtable item;
			Case result = new Case ();
			
			try
			{
				item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (xmlDocument.SelectSingleNode ("(//didius.Case)[1]")));
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
				throw new Exception (string.Format (Strings.Exception.CaseFromXmlDocument, "ID"));
			}
			
			if (item.ContainsKey ("createtimestamp"))
			{
				result._createtimestamp = int.Parse ((string)item["createtimestamp"]);
			}
			
			if (item.ContainsKey ("updatetimestamp"))
			{
				result._updatetimestamp = int.Parse ((string)item["updatetimestamp"]);
			}
			
			if (item.ContainsKey ("no"))
			{
				result._no = (string)item["no"];
			}

			if (item.ContainsKey ("customerid"))
			{					
				result._customerid = new Guid ((string)item["customerid"]);
			}	
			else
			{
				throw new Exception (string.Format (Strings.Exception.CaseFromXmlDocument, "CUSTOMERID"));
			}
			
			return result;
		}
		#endregion
	}
}

