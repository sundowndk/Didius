// 
//  Bid.cs
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
	public class AutoBid
	{
		#region Public Static Fields
		public static string DatastoreAisle = "didius_autobid";
		#endregion
		
		#region Private Fields
		private Guid _id;
		
		private int _createtimestamp;
		private int _updatetimestamp;
		
		private Guid _customerid;
		private Guid _itemid;

		private long _sort;

		private decimal _amount;

		private bool _active;
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
		
		public Guid CustomerId
		{
			get
			{
				return this._customerid;
			}
		}
		
		public Guid ItemId
		{
			get
			{
				return this._itemid;
			}
		}

		public long Sort
		{
			get
			{
				return this._sort;
			}
		}
		
		public decimal Amount
		{
			get
			{
				return Math.Round (this._amount, 2);
			}
		}

		public bool Active
		{
			get
			{
				return this._active;
			}

			set
			{
				this._active = value;
			}
		}
		#endregion
		
		#region Constructor
		public AutoBid (Customer Customer, Item Item, decimal Amount)
		{
			this._id = Guid.NewGuid ();
			
			this._createtimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			
			this._customerid = Customer.Id;
			this._itemid = Item.Id;

			this._sort = DateTime.Now.Ticks;

			this._amount = Amount;

			this._active = true;

			if (Item.Invoiced)
			{
				// EXCEPTION: Exception.BidItemInvoiced
				throw new Exception (Strings.Exception.BidItemInvoiced);
			}
			else if (Item.Settled)
			{
				// EXCEPTION: Exception.BidItemSettled
				throw new Exception (Strings.Exception.BidItemSettled);
			}
		}	
		
		private AutoBid ()
		{
			this._createtimestamp = 0;
			this._updatetimestamp = 0;
			this._amount = 0;
			this._active = true;
		}
		#endregion

//		private static bool Exist (Item item, decimal Amount)
//		{
//			bool result = false;
//
//			if (List (Item).Find (delegate (Autobid AutoBid) {if (AutoBid.Amount == Amount)	{return true;} return false;}) != null)
//			{
//				result = true;
//			}
//
//			return result;
//		}

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
				
				item.Add ("customerid", this._customerid);		
				item.Add ("itemid", this._itemid);		

				item.Add ("sort", this._sort);
				
				item.Add ("amount", this._amount);

				item.Add ("active", this._active);
				
				SorentoLib.Services.Datastore.Meta meta = new SorentoLib.Services.Datastore.Meta ();
				meta.Add ("customerid", this._customerid);
				meta.Add ("itemid", this._itemid);
				
				SorentoLib.Services.Datastore.Set (DatastoreAisle, this._id.ToString (), SNDK.Convert.ToXmlDocument (item, this.GetType ().FullName.ToLower ()), meta);
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.AUTOBID", exception.Message));
				
				// EXCEPTION: Exception.AutoBidSave
				throw new Exception (string.Format (Strings.Exception.AutoBidSave, this._id.ToString ()));
			}					
		}
		
		public XmlDocument ToXmlDocument ()
		{
			Hashtable result = new Hashtable ();
			
			result.Add ("id", this._id);
			result.Add ("createtimestamp", this._createtimestamp);
			result.Add ("updatetimestamp", this._updatetimestamp);				
			
			result.Add ("customerid", this._customerid);
			result.Add ("customer", Customer.Load (this._customerid));
			result.Add ("itemid", this._itemid);

			result.Add ("sort", this._sort);

			result.Add ("item", Item.Load (this._itemid));
			
			result.Add ("amount", this._amount);

			result.Add ("active", this._active);
			
			return SNDK.Convert.ToXmlDocument (result, this.GetType ().FullName.ToLower ());
		}
		#endregion
		
		#region Public Static Methods
		public static AutoBid Load (Guid Id)
		{
			AutoBid result;
			
			try
			{
				Hashtable item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (SorentoLib.Services.Datastore.Get<XmlDocument> (DatastoreAisle, Id.ToString ()).SelectSingleNode ("(//didius.autobid)[1]")));
				result = new AutoBid ();
				
				result._id = new Guid ((string)item["id"]);
				
				if (item.ContainsKey ("createtimestamp"))
				{
					result._createtimestamp = int.Parse ((string)item["createtimestamp"]);
				}
				
				if (item.ContainsKey ("updatetimestamp"))
				{
					result._updatetimestamp = int.Parse ((string)item["updatetimestamp"]);
				}				
				
				if (item.ContainsKey ("customerid"))
				{
					result._customerid = new Guid ((string)item["customerid"]);
				}				
				
				if (item.ContainsKey ("itemid"))
				{
					result._itemid = new Guid ((string)item["itemid"]);
				}				

				if (item.ContainsKey ("sort"))
				{
					result._sort = long.Parse ((string)item["sort"]);
				}				
								
				if (item.ContainsKey ("amount"))
				{
					result._amount = decimal.Parse ((string)item["amount"]);
				}				

				if (item.ContainsKey ("actibe"))
				{
					result._active = (bool)item["active"];
				}				

			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.AUTOBID", exception.Message));
				
				// EXCEPTION: Excpetion.AutoBidLoadGuid
				throw new Exception (string.Format (Strings.Exception.AutoBidLoadGuid, Id));
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
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.AUTOBID", exception.Message));
				
				// EXCEPTION: Exception.AutoBidDeleteGuid
				throw new Exception (string.Format (Strings.Exception.AutoBidDeleteGuid, Id.ToString ()));
			}			
		}
		
		public static List<AutoBid> List (Item Item)
		{
			return List (Item.Id);
		}
		
		public static List<AutoBid> List (Guid ItemId)
		{
			List<AutoBid> result = new List<AutoBid> ();
			
			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("itemid", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Equal, ItemId)))
			{
				try
				{

					result.Add (Load (new Guid (id)));


				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.AUTOBID", exception.Message));
					
					// LOG: LogDebug.AutoBidList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.AutoBidList, id));
				}
			}

			result = result.OrderByDescending (o => o._amount).ThenBy(o => o._sort).ToList<AutoBid> ();

//			result.Sort (delegate(AutoBid b1, AutoBid b2) { return b1.CreateTimestamp.CompareTo (b2.CreateTimestamp); });
//			result.Reverse ();
			
			return result;
		}
		
		public static List<AutoBid> List (Customer Customer)
		{
			List<AutoBid> result = new List<AutoBid> ();
			
			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("customerid", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Equal, Customer.Id)))
			{
				try
				{
					result.Add (Load (new Guid (id)));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.AUTOBID", exception.Message));
					
					// LOG: LogDebug.AutoBidList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.AutoBidList, id));
				}
			}

			result = result.OrderByDescending (o => o._amount).ThenBy(o => o._sort).ToList<AutoBid> ();

//			result.Sort (delegate(AutoBid b1, AutoBid b2) { return b1.CreateTimestamp.CompareTo (b2.CreateTimestamp); });
			//			result.Reverse ();
			
			return result;
		}
		
		public static List<AutoBid> List ()
		{
			List<AutoBid> result = new List<AutoBid> ();
			
			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle))
			{
				try
				{
					result.Add (Load (new Guid (id)));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.AUTOBID", exception.Message));
					
					// LOG: LogDebug.AutoBidList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.AutoBidList, id));
				}
			}

			result = result.OrderByDescending (o => o._amount).ThenBy(o => o._sort).ToList<AutoBid> ();
			
//			result.Sort (delegate(AutoBid b1, AutoBid b2) { return b1.CreateTimestamp.CompareTo (b2.CreateTimestamp); });
//			result.Reverse ();
			
			return result;
		}
		
		public static AutoBid FromXmlDocument (XmlDocument xmlDocument)
		{
			Hashtable item;
			AutoBid result = new AutoBid ();
			
			try
			{
				item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (xmlDocument.SelectSingleNode ("(//didius.autobid)[1]")));
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
			
			if (item.ContainsKey ("customerid"))
			{
				result._customerid = new Guid ((string)item["customerid"]);
			}
			else
			{
				throw new Exception (string.Format (Strings.Exception.BidFromXmlDocument, "CUSTOMERID"));
			}
			
			if (item.ContainsKey ("itemid"))
			{
				result._itemid = new Guid ((string)item["itemid"]);
			}				
			else
			{
				throw new Exception (string.Format (Strings.Exception.BidFromXmlDocument, "ITEMID"));
			}

			if (item.ContainsKey ("sort"))
			{
				result._sort = long.Parse ((string)item["sort"]);
			}

			if (item.ContainsKey ("amount"))
			{
				result._amount = decimal.Parse ((string)item["amount"]);
			}

			if (item.ContainsKey ("active"))
			{
				result._active = (bool)item["active"];
			}				
			
			return result;
		}
		#endregion
	}
}

