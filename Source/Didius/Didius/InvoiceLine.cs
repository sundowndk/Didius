using System;
using System.Xml;
using System.Collections.Generic;
using System.Collections;

namespace Didius
{
	public class InvoiceLine
	{
		#region Private Fields
		private Guid _id;
		private int _no;
		private Guid _itemid;
		private string _text;
		private decimal _commissionfee;
		private decimal _amount;
		private decimal _vat;
		#endregion

		#region Public Fields
		public Guid Id
		{
			get
			{
				return this._id;
			}
		}

		public int No 
		{
			get 
			{
				return this._no;
			}
		}

		public Guid ItemId
		{
			get
			{
				return this._itemid;
			}

		}

		public string Text
		{
			get
			{
				return this._text;
			}
		}

		public decimal CommissionFee
		{
			get
			{
				return this._commissionfee;
			}
		}

		public decimal Amount
		{
			get
			{
				return this._amount;
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
				decimal result = 0;
				result += this._commissionfee;
				result += this._amount;
				result += this._vat;
				return result;
			}
		}
		#endregion

		#region Constructor
		public InvoiceLine (Item Item)
		{
			this._id = Guid.NewGuid ();
			this._no = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._itemid = Item.Id;
			this._text = Item.Title;
			this._commissionfee = Item.CommissionFee;
			this._amount = Item.BidAmount;

			this._vat = (Item.CommissionFee * 0.25m);
			if (Item.Vat)
			{
				this._vat += (this._amount * 0.25m);
			}
		}

		private InvoiceLine ()
		{
			this._id = Guid.Empty;
			this._no = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._itemid = Guid.Empty;
			this._text = string.Empty;
			this._commissionfee = 0;
			this._amount = 0;
			this._vat = 0;
		}
		#endregion

		#region Public Methods
		public XmlDocument ToXmlDocument ()
		{
			Hashtable result = new Hashtable ();
			
			result.Add ("id", this._id);			
			result.Add ("no", this._no);
			result.Add ("itemid", this._itemid);
			result.Add ("text", this._text);
			result.Add ("commissionfee", this._commissionfee);
			result.Add ("amount", this._amount);
			result.Add ("vat", this._vat);
			result.Add ("total", this.Total);
				
			return SNDK.Convert.ToXmlDocument (result, this.GetType ().FullName.ToLower ());
		}
		#endregion

		#region Public Static Methods
		public static InvoiceLine FromXmlDocument (XmlDocument xmlDocument)
		{
			Hashtable item;
			InvoiceLine result = new InvoiceLine ();
			
			try
			{
				item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (xmlDocument.SelectSingleNode ("(//didius.invoiceline)[1]")));
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
				throw new Exception (string.Format (Strings.Exception.InvoiceLineFromXmlDocument, "ID"));
			}

			if (item.ContainsKey ("no"))
			{
				result._no = int.Parse ((string)item["no"]);
			}

			if (item.ContainsKey ("itemid"))
			{
				result._itemid = new Guid ((string)item["itemid"]);
			}
			else
			{
				throw new Exception (string.Format (Strings.Exception.InvoiceLineFromXmlDocument, "ITEMID"));
			}
						
			if (item.ContainsKey ("text"))
			{
				result._text = (string)item["text"];
			}

			if (item.ContainsKey ("commissionfee"))
			{
				result._commissionfee = decimal.Parse ((string)item["commissionfee"], System.Globalization.CultureInfo.InvariantCulture);
			}

			if (item.ContainsKey ("amount"))
			{
				result._amount = decimal.Parse ((string)item["amount"], System.Globalization.CultureInfo.InvariantCulture);
			}

			if (item.ContainsKey ("vat"))
			{
				result._vat = decimal.Parse ((string)item["vat"], System.Globalization.CultureInfo.InvariantCulture);
			}

			return result;
		}
		#endregion
	}
}
