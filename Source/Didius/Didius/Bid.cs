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
using System.Linq;
using System.Collections;
using System.Collections.Generic;

using SNDK;
using SorentoLib;

namespace Didius
{
	public class Bid
	{
		#region Private Fields
		private Guid _id;
		
		private int _createtimestamp;
		private int _updatetimestamp;

		private Guid _customerid;
		private Guid _itemid;

		private long _sort;

		private decimal _amount;
		#endregion
		
		#region Public Fields
		public static string DatastoreAisle
		{
			get
			{
				return "didius_bids";
			}
		}

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
				return this._amount;
			}
		}
		#endregion
		
		#region Constructor
		public Bid (Customer Customer, Item Item, decimal Amount)
		{
			this._id = Guid.NewGuid ();
			
			this._createtimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();

			this._customerid = Customer.Id;
			this._itemid = Item.Id;

			this._sort = DateTime.Now.Ticks;

			this._amount = Amount;

			if (Item.Invoiced)
			{
				// EXCEPTION: Exception.BidItemInvoiced
				throw new Exception (Strings.Exception.BidItemInvoiced);
			}

			if (Item.Settled)
			{
				// EXCEPTION: Exception.BidItemSettled
				throw new Exception (Strings.Exception.BidItemSettled);
			}
		}	

		private Bid ()
		{
			this._createtimestamp = 0;
			this._updatetimestamp = 0;
			this._customerid = Guid.Empty;
			this._itemid = Guid.Empty;
			this._sort = 0;
			this._amount = 0;
		}
		#endregion
		
		#region Public Methods
		public void Save ()
		{
			try
			{
				Item item = Item.Load (this._itemid);
				if (item.Invoiced)
				{
					// EXCEPTION: Exception.BidItemInvoiced
					throw new Exception (Strings.Exception.BidItemInvoiced);
				}

				if (item.Settled)
				{
					// EXCEPTION: Exception.BidItemSettled
					throw new Exception (Strings.Exception.BidItemSettled);
				}

				this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
				
				Hashtable hashtable = new Hashtable ();
				
				hashtable.Add ("id", this._id);
				hashtable.Add ("createtimestamp", this._createtimestamp);
				hashtable.Add ("updatetimestamp", this._updatetimestamp);		

				hashtable.Add ("customerid", this._customerid);		
				hashtable.Add ("itemid", this._itemid);		

				hashtable.Add ("sort", this._sort);		

				hashtable.Add ("amount", this._amount);

				SorentoLib.Services.Datastore.Meta meta = new SorentoLib.Services.Datastore.Meta ();
				meta.Add ("customerid", this._customerid);
				meta.Add ("itemid", this._itemid);
				
				SorentoLib.Services.Datastore.Set (DatastoreAisle, this._id.ToString (), SNDK.Convert.ToXmlDocument (hashtable, this.GetType ().FullName.ToLower ()), meta);
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.BID", exception.Message));
				
				// EXCEPTION: Exception.BidSave
				throw new Exception (string.Format (Strings.Exception.BidSave, this._id.ToString ()));
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
			result.Add ("amount", this._amount);
			
			return SNDK.Convert.ToXmlDocument (result, this.GetType ().FullName.ToLower ());
		}
		#endregion
		
		#region Public Static Methods
		public static Bid Load (Guid Id)
		{
			Bid result;
			
			try
			{
				Hashtable item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (SorentoLib.Services.Datastore.Get<XmlDocument> (DatastoreAisle, Id.ToString ()).SelectSingleNode ("(//didius.bid)[1]")));
				result = new Bid ();
				
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
					result._sort = long.Parse((string)item["sort"]);
				}				

				if (item.ContainsKey ("amount"))
				{
					result._amount = decimal.Parse ((string)item["amount"], System.Globalization.CultureInfo.InvariantCulture);
				}				
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.BID", exception.Message));
				
				// EXCEPTION: Excpetion.BidLoadGuid
				throw new Exception (string.Format (Strings.Exception.BidLoadGuid, Id));
			}	
			
			return result;
		}
		
		public static void Delete (Guid Id)
		{
			try
			{
				Bid bid = Bid.Load (Id);
				Item item = Item.Load (bid._itemid);
				if (item.Invoiced)
				{
					// EXCEPTION: Exception.BidItemInvoiced
					throw new Exception (Strings.Exception.BidItemInvoiced);
				}

				if (item.Settled)
				{
					// EXCEPTION: Exception.BidItemSettled
					throw new Exception (Strings.Exception.BidItemSettled);
				}

				SorentoLib.Services.Datastore.Delete (DatastoreAisle, Id.ToString ());
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.BID", exception.Message));
				
				// EXCEPTION: Exception.BidDeleteGuid
				throw new Exception (string.Format (Strings.Exception.BidDeleteGuid, Id.ToString ()));
			}			
		}

		public static List<Bid> List (Item Item)
		{
			return List (Item.Id);
		}
		
		public static List<Bid> List (Guid ItemId)
		{
			List<Bid> result = new List<Bid> ();
			
//			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("itemid", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Equal, ItemId)))
			foreach (SorentoLib.Services.DatastoreItem item in SorentoLib.Services.Datastore.ListOfShelfsNew (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("itemid", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Equal, ItemId)))
			{
				try
				{
					result.Add (FromXmlDocument (item.Get<XmlDocument> ()));
//					result.Add (Load (new Guid (id)));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.BID", exception.Message));
					
					// LOG: LogDebug.BidList
//					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.BidList, id));
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.BidList, item.Id));
				}
			}

			return  result.OrderByDescending (o => o._amount).ThenBy(o => o._sort).ToList<Bid> ();
		}

		public static List<Bid> List (Customer Customer)
		{
			List<Bid> result = new List<Bid> ();

//			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("customerid", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Equal, Customer.Id)))
			foreach (SorentoLib.Services.DatastoreItem item in SorentoLib.Services.Datastore.ListOfShelfsNew (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("customerid", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Equal, Customer.Id)))
			{
				try
				{
//					result.Add (Load (new Guid (id)));
					result.Add (FromXmlDocument (item.Get<XmlDocument> ()));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.BID", exception.Message));
					
					// LOG: LogDebug.BidList
//					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.BidList, id));
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.BidList, item.Id));
				}
			}
			
			return result.OrderByDescending (o => o._amount).ThenBy(o => o._sort).ToList<Bid> ();
		}
		
		public static List<Bid> List ()
		{
			List<Bid> result = new List<Bid> ();
			
			foreach (SorentoLib.Services.DatastoreItem item in SorentoLib.Services.Datastore.ListOfShelfsNew (DatastoreAisle))
			{
				try
				{
					result.Add (FromXmlDocument (item.Get<XmlDocument> ()));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.BID", exception.Message));
					
					// LOG: LogDebug.BidList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.BidList, item.Id));
				}
			}
			
			return result.OrderByDescending (o => o._amount).ThenBy(o => o._sort).ToList<Bid> ();
		}
		
		public static Bid FromXmlDocument (XmlDocument xmlDocument)
		{
			Hashtable item;
			Bid result = new Bid ();
			
			try
			{
				item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (xmlDocument.SelectSingleNode ("(//didius.Bid)[1]")));
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
				result._sort = long.Parse((string)item["sort"]);
			}

			if (item.ContainsKey ("amount"))
			{
				result._amount = decimal.Parse ((string)item["amount"], System.Globalization.CultureInfo.InvariantCulture);
			}

			return result;
		}
		#endregion
	}
}

