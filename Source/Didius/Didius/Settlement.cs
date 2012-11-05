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

		private int _no;
		private Guid _caseid;
		private Guid _customerid;
		
		private decimal _sales;
		private decimal _vat;
		private decimal _commissionfee;
		private decimal _total;

		private List<Guid> _itemids;
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
				return this._sales;
			}
		}

		public decimal Vat
		{
			get
			{
				return this._vat;
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

			this._no = 0;
			
			this._caseid = Case.Id;
			this._customerid = Case.CustomerId;
						
			this._sales = 0;
			this._vat = 0;
			this._commissionfee = 0;
			this._total = 0;

			this._itemids = new List<Guid> ();

		}	

//		private static Settlement Simulate (Case Case)
//		{
//			Settlement result = new Settlement (Case);
//
//			if (!Case.Settled)
//			{
//				foreach (Item item in Item.List (Case))
//				{
//					if (!item.Settled)
//					{
//						if (item.CurrentBid != null)
//						{
//							if (item.Vat)
//							{
//								this._vat += (item.CurrentBid.Amount * 0.25m);
//							}
//							
//							this._sales += item.CurrentBid.Amount;
//							this._commissionfee += item.CommissionFee;
//
//							this._itemids.Add (item.Id);
//						}
//					}
//				}
//				
//				this._vat = this._vat - (this._commissionfee * 0.25m);
//				this._total = this._sales + this._commissionfee + this._vat;
//				
//				if (this._total == 0)
//				{
//					// EXCEPTION: Exception.SettlementEmpty
//					throw new Exception (string.Format (Strings.Exception.SettlementEmpty));
//				}
//			}
//			else
//			{
//				// EXCEPTION: Exception.SettlementCaseSettled
//				throw new Exception (string.Format (Strings.Exception.SettlementCaseSettled));
//			}
//
//			return result;
//		}

//		private static Settlement Create (Case Case)
//		{
//			Settlement result = new Settlement (Case);
//
//			if (!Case.Settled)
//			{
//				foreach (Item item in Item.List (Case))
//				{
//					if (!item.Settled)
//					{
//						if (item.CurrentBid != null)
//						{
//							if (item.Vat)
//							{
//								this._vat += (item.CurrentBid.Amount * 0.25m);
//							}
//							
//							this._sales += item.CurrentBid.Amount;
//							this._commissionfee += item.CommissionFee;
//							this._itemids.Add (item.Id);
//
//							item.Settled = true;
//							item.Save ();
//						}
//					}
//				}
//				
//				this._vat = this._vat - (this._commissionfee * 0.25m);
//				this._total = this._sales + this._commissionfee + this._vat;
//				
//				if (this._total == 0)
//				{
//					// EXCEPTION: Exception.SettlementEmpty
//					throw new Exception (string.Format (Strings.Exception.SettlementEmpty));
//				}
//				
//				Case.Settled = true;
//				Case.Save ();				
//				Save ();
//			}
//			else
//			{
//				// EXCEPTION: Exception.SettlementCaseSettled
//				throw new Exception (string.Format (Strings.Exception.SettlementCaseSettled));
//			}
//
//			return result;
//		}
		
		private Settlement ()
		{
			this._createtimestamp = 0;
			this._updatetimestamp = 0;

			this._no = 0;

			this._caseid = Guid.Empty;

			this._sales = 0;
			this._vat = 0;
			this._commissionfee = 0;
			this._total = 0;

			this._itemids = new List<Guid> ();
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

				item.Add ("caseid", this._caseid);		
				item.Add ("customerid", this._customerid);

				item.Add ("sales", this._sales);
				item.Add ("vat", this._vat);
				item.Add ("commissionfee", this._commissionfee);
				item.Add ("total", this._total);

				item.Add ("itemids", SNDK.Convert.ListToString<List<Guid>> (this._itemids));

				SorentoLib.Services.Datastore.Meta meta = new SorentoLib.Services.Datastore.Meta ();
				meta.Add ("caseid", this._caseid);
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
			result.Add ("caseid", this._caseid);
			result.Add ("case", Case.Load (this._caseid));		
			result.Add ("customerid", this._customerid);
			result.Add ("customer", Customer.Load (this._customerid));
			result.Add ("sales", this._sales);
			result.Add ("vat", this._vat);
			result.Add ("commissionfee", this._commissionfee);
			result.Add ("total", this._total);

			List<Item> items = new List<Item> ();
			foreach (Guid itemid in this._itemids)
			{
				items.Add (Item.Load (itemid));
			}

			result.Add ("items", items);
			
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

				if (item.ContainsKey ("caseid"))
				{
					result._caseid = new Guid ((string)item["caseid"]);
				}				

				if (item.ContainsKey ("customerid"))
				{
					result._customerid = new Guid ((string)item["customerid"]);
				}				
				
				if (item.ContainsKey ("sales"))
				{
					result._sales = decimal.Parse ((string)item["sales"]);
				}				

				if (item.ContainsKey ("vat"))
				{
					result._vat = decimal.Parse ((string)item["vat"]);
				}				

				if (item.ContainsKey ("commissionfee"))
				{
					result._commissionfee = decimal.Parse ((string)item["commissionfee"]);
				}				

				if (item.ContainsKey ("total"))
				{
					result._total = decimal.Parse ((string)item["total"]);
				}				

				if (item.ContainsKey ("itemids"))
				{
					result._itemids = SNDK.Convert.StringToList<Guid> ((string)item["itemids"]);
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
		#endregion

		#region Private Static Methods
		private static int NewSettlementNo ()
		{
			int result = 1;

			List<Settlement> settlements = List ();

			if (settlements.Count > 0) 
			{
				settlements.Sort (delegate(Settlement s1, Settlement s2) { return s1.No.CompareTo (s2.No);});
				settlements.Reverse ();

				result = (settlements[0].No + 1);
			}

			return result;
		}
		#endregion
	}
}

