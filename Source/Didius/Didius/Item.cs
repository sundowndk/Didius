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

		private string _no;
		private int _catalogno;

		private Guid _caseid;

		private string _title;
		private string _description;

		private bool _vat;

		private decimal _minimumbid;

		private decimal _appraisal1;
		private decimal _appraisal2;
		private decimal _appraisal3;

		private Hashtable _fields;

		private Guid _pictureid;
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

		public int CatalogNo
		{
			get
			{
				return this._catalogno;
			}

			set
			{
				this._catalogno = value;
			}
		}

		public Guid CaseId
		{
			get
			{
				return this._caseid;
			}
		}

		public Case Case
		{
			get
			{
				return Case.Load (this._caseid);
			}
		}

		public string Title
		{
			get
			{
				string result = string.Empty;

				try
				{
					result = this._description.Split ("\n".ToCharArray ())[0];
				}
				catch
				{
				}

				return result;
			}

//			set
//			{
//				this._title = value;
//			}
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

		public bool Vat
		{
			get 
			{
				return this._vat;
			}

			set
			{
				this._vat = value;
			}
		}

		public decimal MinimumBid
		{
			get
			{
				return this._minimumbid;
			}

			set
			{
				this._minimumbid = value;
			}
		}

		public decimal Appraisal1
		{
			get
			{
				return this._appraisal1;
			}

			set
			{
				this._appraisal1 = value;
			}
		}

		public decimal Appraisal2
		{
			get
			{
				return this._appraisal2;
			}
			
			set
			{
				this._appraisal2 = value;
			}
		}

		public decimal Appraisal3
		{
			get
			{
				return this._appraisal3;
			}
			
			set
			{
				this._appraisal3 = value;
			}
		}

		public Hashtable Fields
		{
			get
			{
				return this._fields;
			}
		}

		public Guid PictureId
		{
			get
			{
				return this._pictureid;
			}

			set
			{
				this._pictureid = value;
			}
		}

		public Bid CurrentBid
		{
			get
			{
				List<Bid> bids = Bid.List (this);
				
				if (bids.Count > 0)
				{
					return bids[0];
				}
				
				return null;
			}
		}

		public Guid CurrentBidId
		{
			get
			{
				List<Bid> bids = Bid.List (this);

				if (bids.Count > 0)
				{
					return bids[0].Id;
				}

				return Guid.Empty;
			}
		}
		#endregion
		
		#region Constructor
		public Item (Case Case)
		{
			this._id = Guid.NewGuid ();
						
			this._createtimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();

			this._no = Helpers.NewNo ();
			this._catalogno = Helpers.NewCatelogNo (Case.Auction);

			this._caseid = Case.Id;
			
			this._title = string.Empty;
			this._description = string.Empty;

			this._vat = false;

			this._minimumbid = 0;

			this._appraisal1 = 0;
			this._appraisal2 = 0;
			this._appraisal3 = 0;
			
			this._fields = new Hashtable ();		

			this._pictureid = Guid.Empty;
		}
				
		private Item ()
		{
			this._createtimestamp = 0;
			this._updatetimestamp = 0;

			this._no = Helpers.NewNo ();
			this._catalogno = 0;

			this._title = string.Empty;
			this._description = string.Empty;

			this._vat = false;

			this._minimumbid = 0;
			
			this._appraisal1 = 0;
			this._appraisal2 = 0;
			this._appraisal3 = 0;

			this._fields = new Hashtable ();

			this._pictureid = Guid.Empty;
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
				item.Add ("catalogno", this._catalogno);

				item.Add ("caseid", this._caseid);			
//				item.Add ("title", this._title);

				item.Add ("description", this._description);
				item.Add ("fields", this._fields);

				item.Add ("vat", this._vat);

				item.Add ("minimumbid", this._minimumbid);

				item.Add ("appraisal1", this._appraisal1);
				item.Add ("appraisal2", this._appraisal2);
				item.Add ("appraisal3", this._appraisal3);

				item.Add ("pictureid", this._pictureid);
								
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

			result.Add ("no", this._no);
			result.Add ("catalogno", this._catalogno);

			result.Add ("caseid", this._caseid);
			result.Add ("case", Case.Load (this._caseid));

//			result.Add ("title", this._title);
			result.Add ("title", this.Title);
			result.Add ("description", this._description);

			result.Add ("vat", this._vat);

			result.Add ("minimumbid", this._minimumbid);

			result.Add ("appraisal1", this._appraisal1);
			result.Add ("appraisal2", this._appraisal2);
			result.Add ("appraisal3", this._appraisal3);

			result.Add ("fields", this._fields);

			result.Add ("pictureid", this._pictureid);

			result.Add ("currentbidid", this.CurrentBidId);
			
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

				if (item.ContainsKey ("no"))
				{
					result._no = (string)item["no"];
				}

				if (item.ContainsKey ("catalogno"))
				{
					result._catalogno = int.Parse ((string)item["catalogno"]);
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

//				if (item.ContainsKey ("title"))
//				{					
//					result._title = (string)item["title"];
//				}

				if (item.ContainsKey ("description"))
				{					
					result._description = (string)item["description"];
				}

				if (item.ContainsKey ("vat"))
				{					
					result._vat = (bool)item["vat"];
				}

				if (item.ContainsKey ("minimumbid"))
				{					
					result._minimumbid = decimal.Parse ((string)item["minimumbid"]);
				}

				if (item.ContainsKey ("appraisal1"))
				{					
					result._appraisal1 = decimal.Parse ((string)item["appraisal1"]);
				}

				if (item.ContainsKey ("appraisal2"))
				{					
					result._appraisal2 = decimal.Parse ((string)item["appraisal2"]);
				}

				if (item.ContainsKey ("appraisal3"))
				{					
					result._appraisal3 = decimal.Parse ((string)item["appraisal3"]);
				}

				if (item.ContainsKey ("fields"))
				{					
					result._fields = (Hashtable)item["fields"];
				}

				if (item.ContainsKey ("pictureid"))
				{					
					result._pictureid = new Guid ((string)item["pictureid"]);
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
			// We can not delete if we have bids.
			if (Bid.List (Id).Count > 0)
			{
				// EXCEPTION: Exception.ItemDeleteHasBid
				throw new Exception (string.Format (Strings.Exception.ItemDeleteHasBid, Id.ToString ()));
			}

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

		public static List<Item> List (Auction Auction)
		{
			List<Item> result = new List<Item> ();

			foreach (Case c in Auction.Cases)
			{
				result.AddRange (Item.List (c));
			}

			result.Sort (delegate (Item item1, Item item2) { return item1._catalogno.CompareTo (item2._catalogno); });

			return result;
		}
 
		public static List<Item> List (Case Case)
		{
			return List (Case.Id);
		}
		
		public static List<Item> List (Guid CaseId)
		{
			List<Item> result = new List<Item> ();
			
			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("caseid", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Equal, CaseId)))
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

			result.Sort (delegate (Item item1, Item item2) { return item1._catalogno.CompareTo (item2._catalogno); });
			
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

			if (item.ContainsKey ("no"))
			{
				result._no = (string)item["no"];
			}

			if (item.ContainsKey ("catalogno"))
			{
				result._catalogno = int.Parse ((string)item["catalogno"]);
			}
			else
			{
				throw new Exception (string.Format (Strings.Exception.ItemFromXmlDocument, "CATALOGNO"));
			}

			if (item.ContainsKey ("caseid"))
			{					
				result._caseid = new Guid ((string)item["caseid"]);
			}	
			else
			{
				throw new Exception (string.Format (Strings.Exception.ItemFromXmlDocument, "ITEMID"));
			}

//			if (item.ContainsKey ("title"))
//			{					
//				result._title =(string)item["title"];
//			}	

			if (item.ContainsKey ("description"))
			{					
				result._description =(string)item["description"];
			}	

			if (item.ContainsKey ("vat"))
			{					
				result._vat = (bool)item["vat"];
			}
			
			if (item.ContainsKey ("minimumbid"))
			{					
				result._minimumbid = decimal.Parse ((string)item["minimumbid"]);
			}
			
			if (item.ContainsKey ("appraisal1"))
			{					
				result._appraisal1 = decimal.Parse ((string)item["appraisal1"]);
			}
			
			if (item.ContainsKey ("appraisal2"))
			{					
				result._appraisal2 = decimal.Parse ((string)item["appraisal2"]);
			}
			
			if (item.ContainsKey ("appraisal3"))
			{					
				result._appraisal3 = decimal.Parse ((string)item["appraisal3"]);
			}

			if (item.ContainsKey ("fields"))
			{					
				try
				{
					result._fields = (Hashtable)item["fields"];
				}
				catch
				{
					// This conversion will fail if its empty. No way of knowing if its a list or hash.
				}
			}	

			if (item.ContainsKey ("pictureid"))
			{					
				result._pictureid = new Guid ((string)item["pictureid"]);
			}
			
			return result;
		}
		#endregion

		#region Internal Static Methods
		internal static void ServiceGarbageCollector ()
		{
			List<Media> medias = SorentoLib.Media.List ("/media/didius/app");
			List<Item> items = List ();

			foreach (Media media in medias)
			{
				if ((SNDK.Date.CurrentDateTimeToTimestamp () - media.CreateTimestamp) > 86400)
				{
					bool delete = true;
					foreach (Item item in items)
					{
						if (item._pictureid != Guid.Empty)
						{
							if (media.Id == item._pictureid)
							{
								delete = false;
								break;
							}
						}
					}

					if (delete)
					{
						try
						{
							Media.Delete (media.Id);
						}
						catch (Exception exception)
						{
							// LOG: LogDebug.ExceptionUnknown
							SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.ITEM", exception.Message));
						}
					}
				}
			}

			// LOG: LogDebug.SessionGarbageCollector
			SorentoLib.Services.Logging.LogDebug (Strings.LogDebug.ItemGarbageCollector);
		}
		#endregion
	}
}

