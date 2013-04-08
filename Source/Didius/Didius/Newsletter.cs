// 
//  Newsletter.cs
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
using System.Linq;

using SNDK;
using SorentoLib;

namespace Didius
{
	public class Newsletter
	{
		#region Public Static Fields
		public static string DatastoreAisle = "didius_newsletter";
		#endregion
		
		#region Private Fields
		private Guid _id;
		
		private int _createtimestamp;
		private int _updatetimestamp;

		private string _title;
		private string _content;
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
		public Newsletter ()
		{
			this._id = Guid.NewGuid ();
			
			this._createtimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();

			this._title = string.Empty;
			this._content = string.Empty;
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

				item.Add ("title", this._title);
				item.Add ("content", this._content);
				
				SorentoLib.Services.Datastore.Set (DatastoreAisle, this._id.ToString (), SNDK.Convert.ToXmlDocument (item, this.GetType ().FullName.ToLower ()));
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.NEWSLETTER", exception.Message));
				
				// EXCEPTION: Exception.NewsletterSave
				throw new Exception (string.Format (Strings.Exception.NewsletterSave, this._id.ToString ()));
			}					
		}

		public void Send ()
		{
			Paperboy.Subscription subscription = Paperboy.Subscription.Load (SorentoLib.Services.Settings.Get<Guid> (Enums.SettingsKey.didius_newsletter_paperboysubscriptionid));
//			subscription.Send (this._title, this._content);
		}
		
		public XmlDocument ToXmlDocument ()
		{
			Hashtable result = new Hashtable ();
			
			result.Add ("id", this._id);
			result.Add ("createtimestamp", this._createtimestamp);
			result.Add ("updatetimestamp", this._updatetimestamp);				

			result.Add ("title", this._title);
			result.Add ("content", this._content);
			
			return SNDK.Convert.ToXmlDocument (result, this.GetType ().FullName.ToLower ());
		}
		#endregion
		
		#region Public Static Methods
		public static Newsletter Load (Guid Id)
		{
			Newsletter result;
			
			try
			{
				Hashtable item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (SorentoLib.Services.Datastore.Get<XmlDocument> (DatastoreAisle, Id.ToString ()).SelectSingleNode ("(//didius.newsletter)[1]")));
				result = new Newsletter ();
				
				result._id = new Guid ((string)item["id"]);
				
				if (item.ContainsKey ("createtimestamp"))
				{
					result._createtimestamp = int.Parse ((string)item["createtimestamp"]);
				}
				
				if (item.ContainsKey ("updatetimestamp"))
				{
					result._updatetimestamp = int.Parse ((string)item["updatetimestamp"]);
				}				

				if (item.ContainsKey ("title"))
				{
					result._title = (string)item["title"];
				}				
				
				if (item.ContainsKey ("content"))
				{
					result._content = (string)item["content"];
				}				
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.NEWSLETTER", exception.Message));
				
				// EXCEPTION: Excpetion.NewsletterLoadGuid
				throw new Exception (string.Format (Strings.Exception.NewsletterLoadGuid, Id));
			}	
			
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
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.NEWSLETTER", exception.Message));
				
				// EXCEPTION: Exception.NewsletterDeleteGuid
				throw new Exception (string.Format (Strings.Exception.NewsletterDeleteGuid, Id.ToString ()));
			}			
		}
		
		public static List<Newsletter> List ()
		{
			List<Newsletter> result = new List<Newsletter> ();
			
			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle))
			{
				try
				{
					result.Add (Load (new Guid (id)));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.NEWSLETTER", exception.Message));
					
					// LOG: LogDebug.NewsletterList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.NewsletterList, id));
				}
			}
			
			return result;
		}
		
		public static Newsletter FromXmlDocument (XmlDocument xmlDocument)
		{
			Hashtable item;
			Newsletter result = new Newsletter ();
			
			try
			{
				item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (xmlDocument.SelectSingleNode ("(//didius.newsletter)[1]")));
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
				// EXCEPTION: Excpetion.NewsletterFromXmlDocument
				throw new Exception (string.Format (Strings.Exception.NewsletterFromXmlDocument, "ID"));
			}
			
			if (item.ContainsKey ("createtimestamp"))
			{
				result._createtimestamp = int.Parse ((string)item["createtimestamp"]);
			}
			
			if (item.ContainsKey ("updatetimestamp"))
			{
				result._updatetimestamp = int.Parse ((string)item["updatetimestamp"]);
			}

			if (item.ContainsKey ("title"))
			{
				result._title = (string)item["title"];
			}				

			if (item.ContainsKey ("content"))
			{
				result._content = (string)item["content"];
			}
			
			return result;
		}
		#endregion
	}
}

