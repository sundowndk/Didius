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
	public class Creditnote
	{
		#region Public Static Fields
		public static string DatastoreAisle = "didius_creditnotes";
		#endregion
		
		#region Private Fields
		private Guid _id;
		
		private int _createtimestamp;
		private int _updatetimestamp;
		
		private int _no;	
		private Guid _customerid;
		
		private decimal _sales;
		private decimal _commissionfee;
		private decimal _vat;
		private decimal _total;
		
		private List<CreditnoteLine> _lines;
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

		public List<CreditnoteLine> Lines
		{
			get
			{
				return this._lines;
			}
		}
		
		public decimal Sales
		{
			get
			{
				decimal result = 0;
				foreach (CreditnoteLine line in this._lines)
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
				foreach (CreditnoteLine line in this._lines)
				{
					result += line.CommessionFee;
				}
				return Math.Round (result, 2);
			}
		}

		public decimal Vat
		{
			get
			{
				decimal result = 0;
				foreach (CreditnoteLine line in this._lines)
				{
					if (line.Vat)
					{
						result += (line.Amount * 0.25m);
					}
				}
							
				result += (this.CommissionFee * 0.25m);

				return Math.Round (result, 2);
			}
		}

		public decimal Total
		{
			get
			{
				decimal result = 0;
				result += this.Sales;
				result += this.CommissionFee;
				result += this.Vat;

				return Math.Round (result, 2);
			}
		}
		#endregion
		
		#region Constructor
		public Creditnote (Customer Customer, List<CreditnoteLine> Lines)
		{
			this._id = Guid.NewGuid ();
			
			this._createtimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			
			this._no = 0;

			this._customerid = Customer.Id;
			
			this._sales = 0;
			this._commissionfee = 0;
			this._vat = 0;
			this._total = 0;

			this._lines = Lines;
		}	
				
		private Creditnote ()
		{
			this._createtimestamp = 0;
			this._updatetimestamp = 0;
			
			this._no = 0;

			this._customerid = Guid.Empty;
			
			this._sales = 0;
			this._commissionfee = 0;
			this._vat = 0;
			this._total = 0;
			
			this._lines = new List<CreditnoteLine> ();
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

				item.Add ("customerid", this._customerid);
				
				item.Add ("sales", this._sales);
				item.Add ("commissionfee", this._commissionfee);
				item.Add ("vat", this._vat);
				item.Add ("total", this._total);

				item.Add ("lines", this._lines);
				
				SorentoLib.Services.Datastore.Meta meta = new SorentoLib.Services.Datastore.Meta ();
				meta.Add ("customerid", this._customerid);
				
				SorentoLib.Services.Datastore.Set (DatastoreAisle, this._id.ToString (), SNDK.Convert.ToXmlDocument (item, this.GetType ().FullName.ToLower ()), meta);
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.CREDITNOTE", exception.Message));

				Console.WriteLine (exception);

				// EXCEPTION: Exception.CreditnoteSave
				throw new Exception (string.Format (Strings.Exception.CreditnoteSave, this._id.ToString ()));
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
			result.Add ("sales", this.Sales);
			result.Add ("commissionfee", this.CommissionFee);
			result.Add ("vat", this.Vat);
			result.Add ("total", this.Total);

			result.Add ("lines", this._lines);

			return SNDK.Convert.ToXmlDocument (result, this.GetType ().FullName.ToLower ());
		}
		#endregion
		
		#region Public Static Methods
		public static Creditnote Load (Guid Id)
		{
			Creditnote result;
			
			try
			{
				Hashtable item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (SorentoLib.Services.Datastore.Get<XmlDocument> (DatastoreAisle, Id.ToString ()).SelectSingleNode ("(//didius.creditnote)[1]")));
				result = new Creditnote ();
				
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
		
				if (item.ContainsKey ("lines"))
				{
					foreach (XmlDocument creditnoteline in (List<XmlDocument>)item["lines"])
					{
						result._lines.Add (CreditnoteLine.FromXmlDocument (creditnoteline));
					}
				}
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.CREDITNOTE", exception.Message));
				
				// EXCEPTION: Excpetion.CreditnoteLoadGuid
				throw new Exception (string.Format (Strings.Exception.CreditnoteLoadGuid, Id));
			}	
			
			return result;
		}

		public static List<Creditnote> List (Customer Customer)
		{
			List<Creditnote> result = new List<Creditnote> ();
			
			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("customerid", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Equal, Customer.Id)))
			{
				try
				{
					result.Add (Load (new Guid (id)));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.CREDITNOTE", exception.Message));
					
					// LOG: LogDebug.CreditnoteList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.CreditnoteList, id));
				}
			}
			
			return result;
		}
		
		public static List<Creditnote> List ()
		{
			List<Creditnote> result = new List<Creditnote> ();
			
			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle))
			{
				try
				{
					result.Add (Load (new Guid (id)));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.CREDITNOTE", exception.Message));
					
					// LOG: LogDebug.CreditnoteList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.CreditnoteList, id));
				}
			}
			
			return result;
		}

		public static Creditnote Create (Invoice Invoice)
		{
			return Create (Invoice, false);
		}

		public static Creditnote Create (Invoice Invoice, bool Simulate)
		{
			List<Item> items = new List<Item> ();

			foreach (Guid itemid in Invoice.ItemIds)
			{
				items.Add (Item.Load (itemid));
			}

			return Create (Customer.Load (Invoice.CustomerId), items, Simulate);
		}

		public static Creditnote Create (Customer Customer, Item Item)
		{
			return Create (Customer, Item, false);
		}

		public static Creditnote Create (Customer Customer, Item Item, bool Simulate)
		{
			List<Item> items = new List<Didius.Item> ();
			items.Add (Item);
			return Create (Customer, items, Simulate);
		}

		public static Creditnote Create (Customer Customer, List<Item> Items)
		{
			return Create (Customer, Items, false);
		}

		public static Creditnote Create (Customer Customer, List<Item> Items, bool Simulate)
		{
			List<CreditnoteLine> lines = new List<CreditnoteLine> ();
			foreach (Item item in Items)
			{
				if (item.Invoiced)
				{
					lines.Add (new CreditnoteLine (item));

					if (!Simulate)
					{
						item.Invoiced = false;
						item.Save ();
					}
				}
			}

			Creditnote result = new Creditnote (Customer, lines);

			if (result.Total == 0)
			{
				// EXCEPTION: Exception.CreditnoteEmpty
				throw new Exception (string.Format (Strings.Exception.CreditnoteEmpty));
			}

			if (!Simulate)
			{
				result.Save ();
			}
			
			return result;
		}
		#endregion
		
		#region Private Static Methods
		private static int NewInvoiceNo ()
		{
			int result = 1;
			
			List<Creditnote> creditnotes = List ();
			
			if (creditnotes.Count > 0) 
			{
				creditnotes.Sort (delegate(Creditnote c1, Creditnote c2) { return c1.No.CompareTo (c2.No);});
				creditnotes.Reverse ();
				
				result = (creditnotes[0].No + 1);
			}
			
			return result;
		}
		#endregion
	}
}

