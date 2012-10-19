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

using SNDK;
using SorentoLib;

namespace Didius
{
	public class Settlement
	{
		#region Public Static Fields
		public static string DatastoreAisle = "didius_settlement";
		#endregion
		
		#region Private Fields
		private Guid _id;
		
		private int _createtimestamp;
		private int _updatetimestamp;
		
		private Guid _caseid;
		
		private decimal _sales;
		private decimal _commissionfee;
		private decimal _total;
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
		
		public decimal Sales
		{
			get
			{
				return this._sales;
			}
		}

		public decimal CommissionFee
		{
			get
			{
				return this._commissionfee;
			}
		}

		public decimal Total
		{
			get
			{
				return this._total;
			}
		}
		#endregion
		
		#region Constructor
		public Settlement (Case Case)
		{
			this._id = Guid.NewGuid ();
			
			this._createtimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			
			this._caseid = Case.Id;
						
			this._sale = 0;
			this._commissionfee = 0;
			this._total = 0;
		}	
		
		private Settlement ()
		{
			this._createtimestamp = 0;
			this._updatetimestamp = 0;

			this._caseid = Guid.Empty;

			this._sale = 0;
			this._commissionfee = 0;
			this._total = 0;
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
				
				item.Add ("caseid", this._customerid);		

				item.Add ("sales", this._sales);
				item.Add ("commissionfee", this._commissionfee);
				item.Add ("total", this._total);
				
				SorentoLib.Services.Datastore.Meta meta = new SorentoLib.Services.Datastore.Meta ();
				meta.Add ("caseid", this._caseid);
				
				SorentoLib.Services.Datastore.Set (DatastoreAisle, this._id.ToString (), SNDK.Convert.ToXmlDocument (item, this.GetType ().FullName.ToLower ()), meta);
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.SETTLEMENT", exception.Message));
				
				// EXCEPTION: Exception.SettlementSave
				throw new Exception (string.Format (Strings.Exception.SettlementSave, this._id.ToString ()));
			}					
		}
		
		public XmlDocument ToXmlDocument ()
		{
			Hashtable result = new Hashtable ();
			
			result.Add ("id", this._id);
			result.Add ("createtimestamp", this._createtimestamp);
			result.Add ("updatetimestamp", this._updatetimestamp);				
			
			result.Add ("caseid", this._caseid);
			result.Add ("sale", this._sales);
			result.Add ("commissionfee", this._commissionfee);
			result.Add ("total", this._total);
			
			return SNDK.Convert.ToXmlDocument (result, this.GetType ().FullName.ToLower ());
		}
		#endregion
		
		#region Public Static Methods
		public static Settlement Load (Guid Id)
		{
			Settlement result;
			
			try
			{
				Hashtable item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (SorentoLib.Services.Datastore.Get<XmlDocument> (DatastoreAisle, Id.ToString ()).SelectSingleNode ("(//didius.settlement)[1]")));
				result = new Settlement ();
				
				result._id = new Guid ((string)item["id"]);
				
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
				
				if (item.ContainsKey ("sale"))
				{
					result._sale = decimal.Parse ((string)item["sale"]);
				}				

				if (item.ContainsKey ("commissionfee"))
				{
					result._commissionfee = decimal.Parse ((string)item["commissionfee"]);
				}				

				if (item.ContainsKey ("total"))
				{
					result._total = decimal.Parse ((string)item["total"]);
				}				
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.SETTLEMENT", exception.Message));
				
				// EXCEPTION: Excpetion.SettlementLoadGuid
				throw new Exception (string.Format (Strings.Exception.SettlementLoadGuid, Id));
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
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.SETTLEMENT", exception.Message));

				// EXCEPTION: Exception.SettlementDeleteGuid
				throw new Exception (string.Format (Strings.Exception.SettlementDeleteGuid, Id.ToString ()));
			}			
		}
		
		public static List<Settlement> List (Case Case)
		{
			List<Settlement> result = new List<Settlement> ();
			
			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("itemid", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Equal, ItemId)))
			{
				try
				{
					result.Add (Load (new Guid (id)));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.BID", exception.Message));
					
					// LOG: LogDebug.BidList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.BidList, id));
				}
			}
			
			result.Sort (delegate(Bid b1, Bid b2) { return b1.Amount.CompareTo (b2.Amount); });
			result.Reverse ();
			
			return result;
		}
		
		public static List<Bid> List (Customer Customer)
		{
			List<Bid> result = new List<Bid> ();
			
			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("customerid", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Equal, Customer.Id)))
			{
				try
				{
					result.Add (Load (new Guid (id)));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.BID", exception.Message));
					
					// LOG: LogDebug.BidList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.BidList, id));
				}
			}
			
			//			result.Sort (delegate(Bid b1, Bid b2) { return b1.Amount.CompareTo (b2.Amount); });
			//			result.Reverse ();
			
			return result;
		}
		
		public static List<Bid> List ()
		{
			List<Bid> result = new List<Bid> ();
			
			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle))
			{
				try
				{
					result.Add (Load (new Guid (id)));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.BID", exception.Message));
					
					// LOG: LogDebug.BidList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.BidList, id));
				}
			}
			
			result.Sort (delegate(Bid b1, Bid b2) { return b1.Amount.CompareTo (b2.Amount); });
			result.Reverse ();
			
			return result;
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
			
			if (item.ContainsKey ("amount"))
			{
				result._amount = decimal.Parse ((string)item["amount"]);
			}
			
			return result;
		}
#endregion
	}
}

