using System;
using System.Xml;
using System.Collections.Generic;
using System.Collections;

namespace Didius
{
	public class CreditnoteLine
	{
		#region Private Fields
		private Guid _id;
		private int _no;
		private Guid _itemid;
		private string _text;
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

		public decimal Amount
		{
			get
			{
				return Math.Round (this._amount, 2);
			}
		}

		public decimal Vat
		{
			get
			{
				return Math.Round (this._vat, 2);
			}
		}

		public decimal Total
		{
			get
			{
				decimal result = 0;
				result += this._vat;
				result += this._amount;
				return Math.Round (result , 2);
				
			}
		}
		#endregion

		#region Constructor
		public CreditnoteLine (InvoiceLine InvoiceLine)
		{
			this._id = Guid.NewGuid ();
			this._no = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._itemid = InvoiceLine.ItemId;
			this._text = InvoiceLine.Text;
			this._amount = InvoiceLine.Amount;
			this._vat = InvoiceLine.Vat;
		}

		public CreditnoteLine (Item Item)
		{
			this._id = Guid.NewGuid ();
			this._no = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._itemid = Item.Id;
			this._text = Item.Title;
			this._amount = Item.BidAmount;
			this._amount += Item.CommissionFee;
			this._vat = (Item.CommissionFee * 0.25m);
			if (Item.Vat)
			{
				this._vat += (Item.BidAmount * 0.25m);
			}			
		}

		private CreditnoteLine ()
		{
			this._id = Guid.Empty;
			this._no = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._itemid = Guid.Empty;
			this._text = string.Empty;
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
			result.Add ("amount", this.Amount);
			result.Add ("vat", this.Vat);
			result.Add ("total", this.Total);

			return SNDK.Convert.ToXmlDocument (result, this.GetType ().FullName.ToLower ());
		}
		#endregion

		#region Public Static Methods
		public static CreditnoteLine FromXmlDocument (XmlDocument xmlDocument)
		{
			Hashtable item;
			CreditnoteLine result = new CreditnoteLine ();
			
			try
			{
				item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (xmlDocument.SelectSingleNode ("(//didius.creditnoteline)[1]")));
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
				throw new Exception (string.Format (Strings.Exception.CreditnoteLineFromXmlDocument, "ID"));
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
				throw new Exception (string.Format (Strings.Exception.CreditnoteLineFromXmlDocument, "ITEMID"));
			}
						
			if (item.ContainsKey ("text"))
			{
				result._text = (string)item["text"];
			}

			if (item.ContainsKey ("amount"))
			{
				result._amount = decimal.Parse ((string)item["amount"]);
			}

			if (item.ContainsKey ("vat"))
			{
				result._vat = decimal.Parse ((string)item["vat"]);
			}

			return result;
		}
		#endregion
	}
}

