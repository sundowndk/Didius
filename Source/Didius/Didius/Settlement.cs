// 
//  Settlement.cs
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
		public static string DatastoreAisle = "didius_settlements";
		#endregion
		
		#region Private Fields
		private Guid _id;		
		private int _createtimestamp;
		private int _updatetimestamp;		
		private int _no;
		private Guid _auctionid;
		private Guid _caseid;
		private Guid _customerid;
		private List<SettlementLine> _lines;
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
		
		public int No
		{
			get
			{
				return this._no;
			}
		}

		public Guid AuctionId
		{
			get
			{
				return this._auctionid;
			}
		}

		public Guid CaseId
		{
			get
			{
				return this._caseid;
			}
		}

		public Guid CustomerId
		{
			get
			{
				return this._customerid;
			}
		}

		public decimal Sales
		{
			get
			{
				decimal result = 0;
				foreach (SettlementLine line in this._lines)
				{
					result += line.Amount;
				}
				return result;
			}
		}
		
		public decimal CommissionFee
		{
			get
			{
				decimal result = 0;
				foreach (SettlementLine line in this._lines)
				{
					result += line.CommissionFee;
				}
				return result;
			}
		}

		public decimal Vat
		{
			get
			{
				decimal result = 0;
				foreach (SettlementLine line in this._lines)
				{
					result += line.VatTotal;
				}
				return result;
			}
		}

		public decimal Total
		{
			get
			{
				decimal result = 0;
				foreach (SettlementLine line in this._lines)
				{
					result += line.Total;
				}
				return result;
			}
		}

		public List<SettlementLine> Lines
		{
			get
			{
				return this._lines;
			}
		}
		#endregion
		
		#region Constructor
		public Settlement (Case Case)
		{
			this._id = Guid.NewGuid ();			
			this._createtimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();			
			this._no = 0;
			this._auctionid = Case.AuctionId;
			this._caseid = Case.Id;			
			this._customerid = Case.CustomerId;
			this._lines = new List<SettlementLine> ();
		}	
				
		private Settlement ()
		{
			this._createtimestamp = 0;
			this._updatetimestamp = 0;			
			this._no = 0;
			this._auctionid = Guid.Empty;
			this._caseid = Guid.Empty;			
			this._customerid = Guid.Empty;
			this._lines = new List<SettlementLine> ();
		}
		#endregion
		
		#region Public Methods
		public void Save ()
		{
			try
			{
				if (this._no == 0)
				{
					this._no = NewSettlementNo ();
				}
				
				this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
				
				Hashtable item = new Hashtable ();
				
				item.Add ("id", this._id);
				item.Add ("createtimestamp", this._createtimestamp);
				item.Add ("updatetimestamp", this._updatetimestamp);						
				item.Add ("no", this._no);
				item.Add ("auctionid", this._auctionid);
				item.Add ("caseid", this._caseid);
				item.Add ("customerid", this._customerid);
				item.Add ("lines", this._lines);
				
				SorentoLib.Services.Datastore.Meta meta = new SorentoLib.Services.Datastore.Meta ();
				meta.Add ("auctionid", this._auctionid);
				meta.Add ("caseid", this._caseid);

				List<Guid> itemids = new List<Guid> ();
				foreach (SettlementLine line in this._lines)
				{
					itemids.Add (line.ItemId);
				}
				meta.Add ("itemids", SNDK.Convert.ListToString<List<Guid>> (itemids));
				meta.Add ("customerid", this._customerid);
				
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
			result.Add ("no", this._no);
			result.Add ("auctionid", this._auctionid);
			result.Add ("caseid", this._caseid);
			result.Add ("customerid", this._customerid);
			result.Add ("sales", this.Sales);
			result.Add ("commissionfee", this.CommissionFee);
			result.Add ("vat", this.Vat);
			result.Add ("total", this.Total);
			result.Add ("lines", this._lines);
			
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
				
				if (item.ContainsKey ("no"))
				{
					result._no = int.Parse ((string)item["no"]);
				}				

				if (item.ContainsKey ("auctionid"))
				{
					result._auctionid = new Guid ((string)item["auctionid"]);
				}

				if (item.ContainsKey ("caseid"))
				{
					result._caseid = new Guid ((string)item["caseid"]);
				}				
				
				if (item.ContainsKey ("customerid"))
				{
					result._customerid = new Guid ((string)item["customerid"]);
				}				

				if (item.ContainsKey ("lines"))
				{
					foreach (XmlDocument settlementline in (List<XmlDocument>)item["lines"])
					{
						result._lines.Add (SettlementLine.FromXmlDocument (settlementline));
					}
				}
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.SETTLEMENT", exception.Message));
				
				// EXCEPTION: Excpetion.InvoiceLoadGuid
				throw new Exception (string.Format (Strings.Exception.SettlementLoadGuid, Id, exception.Message));
			}	
			
			return result;
		}
		
		public static List<Settlement> List (Auction Auction)
		{
			List<Settlement> result = new List<Settlement> ();
			
			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("auctionid", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Equal, Auction.Id)))
			{
				try
				{
					result.Add (Load (new Guid (id)));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.SETTLEMENT", exception.Message));
					
					// LOG: LogDebug.SettlementList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.SettlementList, id));
				}
			}
			
			return result;
		}

		public static List<Settlement> List (Case Case)
		{
			List<Settlement> result = new List<Settlement> ();
			
			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("caseid", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Equal, Case.Id)))
			{
				try
				{
					result.Add (Load (new Guid (id)));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.SETTLEMENT", exception.Message));
					
					// LOG: LogDebug.SettlementList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.SettlementList, id));
				}
			}
			
			return result;
		}

		public static List<Settlement> List (Item Item)
		{
			List<Settlement> result = new List<Settlement> ();

			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("itemids", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Contains, Item.Id)))
			{
				try
				{
					result.Add (Load (new Guid (id)));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.SETTLEMENT", exception.Message));
					
					// LOG: LogDebug.SettlementList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.SettlementList, id));
				}
			}
			
			return result;
		}
		
		public static List<Settlement> List (Customer Customer)
		{
			List<Settlement> result = new List<Settlement> ();
			
			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("customerid", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Equal, Customer.Id)))
			{
				try
				{
					result.Add (Load (new Guid (id)));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.SETTLEMENT", exception.Message));
					
					// LOG: LogDebug.SettlementList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.SettlementList, id));
				}
			}
			
			return result;
		}
		
		public static List<Settlement> List ()
		{
			List<Settlement> result = new List<Settlement> ();
			
			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle))
			{
				try
				{
					result.Add (Load (new Guid (id)));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.SETTLEMENT", exception.Message));
					
					// LOG: LogDebug.SettlementList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.SettlementList, id));
				}
			}
			
			return result;
		}

		public static Settlement Create (Case Case)
		{
			return Create (Case, false);
		}
		
		public static Settlement Create (Case Case, bool Simulate)
		{
			Settlement result = new Settlement (Case);

			List<Item> items = Item.List (Case.Id);

			foreach (Item item in items)
			{
				if (!item.Settled)
				{
					if (item.CurrentBid != null)
					{
						result.Lines.Add (new SettlementLine (item));
					}
				}
			}

			if (result.Lines.Count == 0)
			{
				// EXCEPTION: Exception.SettlementEmpty
				throw new Exception (string.Format (Strings.Exception.SettlementEmpty));
			}
			
			if (!Simulate)
			{
				foreach (SettlementLine line in result.Lines)
				{
					Item item = Item.Load (line.ItemId);
					item.Settled = true;
					item.Save ();
				}

				result.Save ();
			}
			
			return result;
		}
		#endregion
		
		#region Private Static Methods
		private static int NewSettlementNo ()
		{
			int result = 1;
			
			List<Settlement> settlements = List ();
			
			if (settlements.Count > 0) 
			{
				settlements.Sort (delegate(Settlement t1, Settlement t2) { return t1.No.CompareTo (t2.No);});
				settlements.Reverse ();
				
				result = (settlements[0].No + 1);
			}
			
			return result;
		}
		#endregion
	}
}

