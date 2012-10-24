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
	public class Invoice
	{
		#region Public Static Fields
		public static string DatastoreAisle = "didius_invoices";
		#endregion
		
		#region Private Fields
		private Guid _id;
		
		private int _createtimestamp;
		private int _updatetimestamp;
		
		private int _no;
		private Guid _auctionid;
		private Guid _customerid;
		
		private decimal _sales;
		private decimal _commissionfee;
		private decimal _vat;
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
		
		public Guid AuctionId
		{
			get
			{
				return this._auctionid;
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
		
		public decimal CommissionFee
		{
			get
			{
				return this._commissionfee;
			}
		}

		public decimal Vat
		{
			get
			{
				return this._vat;
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
		public Invoice (Auction Auction, Customer Customer)
		{
			this._id = Guid.NewGuid ();
			
			this._createtimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			
			this._no = 0;
			
			this._auctionid = Auction.Id;
			this._customerid = Customer.Id;
			
			this._sales = 0;
			this._commissionfee = 0;
			this._vat = 0;
			this._total = 0;
			
			this._itemids = new List<Guid> ();
			
			foreach (Item item in Item.List (Auction))
			{
				if (!item.Invoiced)
				{
					if (item.CurrentBid != null)
					{
						if (item.CurrentBid.CustomerId == Customer.Id)
						{
							this._sales += item.CurrentBid.Amount;
							this._commissionfee += item.CommissionFee;
							this._itemids.Add (item.Id);

							item.Invoiced = true;
							item.Save ();
						}
					}
				}
			}
				
			this._total = this._sales + this._commissionfee;
				
			if (this._total == 0)
			{
				// EXCEPTION: Exception.InvoiceEmpty
				throw new Exception (string.Format (Strings.Exception.InvoiceEmpty));
			}

			Save ();
		}	
		
		private Invoice ()
		{
			this._createtimestamp = 0;
			this._updatetimestamp = 0;
			
			this._no = 0;
			
			this._auctionid = Guid.Empty;
			this._customerid = Guid.Empty;
			
			this._sales = 0;
			this._commissionfee = 0;
			this._vat = 0;
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
					this._no = NewInvoiceNo ();
				}
				
				this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
				
				Hashtable item = new Hashtable ();
				
				item.Add ("id", this._id);
				item.Add ("createtimestamp", this._createtimestamp);
				item.Add ("updatetimestamp", this._updatetimestamp);		
				
				item.Add ("no", this._no);
				
				item.Add ("auctionid", this._auctionid);		
				item.Add ("customerid", this._customerid);
				
				item.Add ("sales", this._sales);
				item.Add ("commissionfee", this._commissionfee);
				item.Add ("vat", this._vat);
				item.Add ("total", this._total);
				
				item.Add ("itemids", SNDK.Convert.ListToString<List<Guid>> (this._itemids));
				
				SorentoLib.Services.Datastore.Meta meta = new SorentoLib.Services.Datastore.Meta ();
				meta.Add ("auctionid", this._auctionid);
				meta.Add ("customerid", this._customerid);
				
				SorentoLib.Services.Datastore.Set (DatastoreAisle, this._id.ToString (), SNDK.Convert.ToXmlDocument (item, this.GetType ().FullName.ToLower ()), meta);
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.INVOICE", exception.Message));
				
				// EXCEPTION: Exception.InvoiceSave
				throw new Exception (string.Format (Strings.Exception.InvoiceSave, this._id.ToString ()));
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
			result.Add ("auction", Auction.Load (this._auctionid));		
			result.Add ("customerid", this._customerid);
			result.Add ("customer", Customer.Load (this._customerid));
			result.Add ("sales", this._sales);
			result.Add ("commissionfee", this._commissionfee);
			result.Add ("vat", this._vat);
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
		public static Invoice Load (Guid Id)
		{
			Invoice result;
			
			try
			{
				Hashtable item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (SorentoLib.Services.Datastore.Get<XmlDocument> (DatastoreAisle, Id.ToString ()).SelectSingleNode ("(//didius.invoice)[1]")));
				result = new Invoice ();
				
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
				
				if (item.ContainsKey ("customerid"))
				{
					result._customerid = new Guid ((string)item["customerid"]);
				}				
				
				if (item.ContainsKey ("sales"))
				{
					result._sales = decimal.Parse ((string)item["sales"]);
				}				
				
				if (item.ContainsKey ("commissionfee"))
				{
					result._commissionfee = decimal.Parse ((string)item["commissionfee"]);
				}				
				
				if (item.ContainsKey ("total"))
				{
					result._total = decimal.Parse ((string)item["total"]);
				}				

				if (item.ContainsKey ("vat"))
				{
					result._vat = decimal.Parse ((string)item["vat"]);
				}				
				
				if (item.ContainsKey ("itemids"))
				{
					result._itemids = SNDK.Convert.StringToList<Guid> ((string)item["itemids"]);
				}				
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.INVOICE", exception.Message));
				
				// EXCEPTION: Excpetion.InvoiceLoadGuid
				throw new Exception (string.Format (Strings.Exception.InvoiceLoadGuid, Id));
			}	
			
			return result;
		}
		
		public static List<Invoice> List (Auction Auction)
		{
			List<Invoice> result = new List<Invoice> ();
			
			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("auctionid", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Equal, Auction.Id)))
			{
				try
				{
					result.Add (Load (new Guid (id)));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.INVOICE", exception.Message));
					
					// LOG: LogDebug.InvoiceList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.InvoiceList, id));
				}
			}
			
			return result;
		}
		
		public static List<Invoice> List (Customer Customer)
		{
			List<Invoice> result = new List<Invoice> ();
			
			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("customerid", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Equal, Customer.Id)))
			{
				try
				{
					result.Add (Load (new Guid (id)));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.INVOICE", exception.Message));
					
					// LOG: LogDebug.InvoiceList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.InvoiceList, id));
				}
			}
			
			return result;
		}
		
		public static List<Invoice> List ()
		{
			List<Invoice> result = new List<Invoice> ();
			
			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle))
			{
				try
				{
					result.Add (Load (new Guid (id)));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.INVOICE", exception.Message));
					
					// LOG: LogDebug.InvoiceList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.InvoiceList, id));
				}
			}
			
			return result;
		}
		#endregion
		
		#region Private Static Methods
		private static int NewInvoiceNo ()
		{
			int result = 1;
			
			List<Invoice> invoices = List ();
			
			if (invoices.Count > 0) 
			{
				invoices.Sort (delegate(Invoice i1, Invoice i2) { return i1.No.CompareTo (i2.No);});
				invoices.Reverse ();
				
				result = (invoices[0].No + 1);
			}
			
			return result;
		}
		#endregion
	}
}
