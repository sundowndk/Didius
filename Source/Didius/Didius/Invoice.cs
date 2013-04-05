// 
//  Invoice.cs
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
		private List<Guid> _auctionids;
		private Guid _customerid;

		private List<InvoiceLine> _lines;
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
				foreach (InvoiceLine line in this._lines)
				{
					result += line.Amount;
				}
				return Math.Round (result, 2);
			}
		}
		
		public decimal CommissionFee
		{
			get
			{
				decimal result = 0;
				foreach (InvoiceLine line in this._lines)
				{
					result += line.CommissionFee;
				}
				return Math.Round (result, 2);
			}
		}

		public decimal Vat
		{
			get
			{
				decimal result = 0;
				foreach (InvoiceLine line in this._lines)
				{
					result += line.VatTotal;
				}
				return Math.Round (result, 2);
			}
		}

		public decimal Total
		{
			get
			{
				decimal result = 0;
				foreach (InvoiceLine line in this._lines)
				{
					result += line.Total;
				}
				return Math.Round (result, 2);
			}
		}

		public List<InvoiceLine> Lines
		{
			get
			{
				return this._lines;
			}
		}
		#endregion
		
		#region Constructor
		public Invoice (Customer Customer)
		{
			this._id = Guid.NewGuid ();
			
			this._createtimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			
			this._no = 0;
			
			this._auctionids = new List<Guid> ();
			this._customerid = Customer.Id;
			
			this._lines = new List<InvoiceLine> ();
		}	
				
		private Invoice ()
		{
			this._createtimestamp = 0;
			this._updatetimestamp = 0;
			
			this._no = 0;
			
			this._auctionids = new List<Guid> ();
			this._customerid = Guid.Empty;
			
			this._lines = new List<InvoiceLine> ();
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
				
				item.Add ("auctionids", SNDK.Convert.ListToString<List<Guid>> (this._auctionids));
				item.Add ("customerid", this._customerid);
				
				item.Add ("lines", this._lines);
				
				SorentoLib.Services.Datastore.Meta meta = new SorentoLib.Services.Datastore.Meta ();
				meta.Add ("auctionids", SNDK.Convert.ListToString<List<Guid>> (this._auctionids));

				List<Guid> itemids = new List<Guid> ();
				foreach (InvoiceLine line in this._lines)
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
			result.Add ("auctionids", this._auctionids);
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
		public static Invoice Load (Guid Id)
		{
			Invoice result;
			
//			try
//			{
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
				
				if (item.ContainsKey ("auctionids"))
				{
					result._auctionids = SNDK.Convert.StringToList<Guid> ((string)item["auctionids"]);
				}				
				
				if (item.ContainsKey ("customerid"))
				{
					result._customerid = new Guid ((string)item["customerid"]);
				}				

				if (item.ContainsKey ("lines"))
				{
					foreach (XmlDocument invoiceline in (List<XmlDocument>)item["lines"])
					{
						result._lines.Add (InvoiceLine.FromXmlDocument (invoiceline));
					}
				}
//			}
//			catch (Exception exception)
//			{
				// LOG: LogDebug.ExceptionUnknown
//				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.INVOICE", exception.Message));
				
				// EXCEPTION: Excpetion.InvoiceLoadGuid
//				throw new Exception (string.Format (Strings.Exception.InvoiceLoadGuid, Id, exception.Message));
//			}	
			
			return result;
		}
		
		public static List<Invoice> List (Auction Auction)
		{
			List<Invoice> result = new List<Invoice> ();
			
			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("auctionids", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Contains, Auction.Id)))
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

		public static List<Invoice> List (Item Item)
		{
			List<Invoice> result = new List<Invoice> ();

			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("itemids", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Contains, Item.Id)))
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
//				try
//				{
					result.Add (Load (new Guid (id)));
//				}
//				catch (Exception exception)
//				{
					// LOG: LogDebug.ExceptionUnknown
//					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.INVOICE", exception.Message));
					
					// LOG: LogDebug.InvoiceList
//					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.InvoiceList, id));
//				}
			}
			
			return result;
		}

		public static Invoice Create (Customer Customer)
		{
			return Create (null, Customer, false);
		}

		public static Invoice Create (Customer Customer, bool Simulate)
		{
			return Create (null, Customer, Simulate);
		}

		public static Invoice Create (Auction Auction, Customer Customer)
		{
			return Create (Auction, Customer, false);
		}
		
		public static Invoice Create (Auction Auction, Customer Customer, bool Simulate)
		{
			Invoice result = new Invoice (Customer);

			List<Item> items;

			if (Auction != null)
			{
				items = Item.List (Auction);
			}
			else
			{
				items = Item.List ();
			}

			foreach (Item item in items)
			{
				if (item.AppovedForInvoice)
				{
					if (!item.Invoiced)
					{
						if (item.CurrentBid != null)
						{
							if (item.CurrentBid.CustomerId == Customer.Id)
							{
								Case _case = Case.Load (item.CaseId);
								result._auctionids.Add (_case.AuctionId);

								result.Lines.Add (new InvoiceLine (item));
							}
						}
					}
				}
			}

			if (result.Lines.Count == 0)
			{
				// EXCEPTION: Exception.InvoiceEmpty
				throw new Exception (string.Format (Strings.Exception.InvoiceEmpty));
			}
			
			if (!Simulate)
			{
				foreach (InvoiceLine line in result.Lines)
				{
					Item item = Item.Load (line.ItemId);
					item.Invoiced = true;
					item.Save ();
				}

				result.Save ();
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

