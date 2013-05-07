using System;
using System.Xml;
using System.Collections.Generic;
using System.Collections;

namespace Didius
{
	public class SettlementLine
	{
		#region Private Fields
		private Guid _id;
		private int _no;
		private Guid _itemid;
		private string _text;
		private decimal _commissionfee;
		private decimal _amount;
		private decimal _vatamount;
		private decimal _vatcommissionfee;
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

		public decimal VatAmount
		{
			get
			{
				return this._vatamount;
			}
		}

		public decimal VatCommissionfee
		{
			get
			{
				return this._vatcommissionfee;
			}
		}

		public decimal VatTotal
		{
			get
			{
				return this._vatamount + this._vatcommissionfee;
			}
		}

		public decimal Total
		{
			get
			{
				decimal result = 0;
				result += this._commissionfee;
				result += this._amount;
				result += this.VatTotal;
				return result;
			}
		}
		#endregion

		#region Constructor
		public SettlementLine (Item Item)
		{
			this._id = Guid.NewGuid ();
			this._no = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._itemid = Item.Id;
			this._text = Auction.Load (Case.Load (Item.CaseId).AuctionId).No + "-" + Item.CatalogNo + " " + Item.Title;

			if (Item.Invoiced)
			{
				this._commissionfee = (Helpers.CalculateSellerCommissionFee (Item) * -1);
				this._amount = Item.BidAmount;

				this._vatamount = 0;
				if (Item.Vat)
				{
					this._vatamount += ((this._amount * SorentoLib.Services.Settings.Get<decimal> (Enums.SettingsKey.didius_value_vat_percentage) / 100));
				}

				this._vatcommissionfee = ((this._commissionfee * SorentoLib.Services.Settings.Get<decimal> (Enums.SettingsKey.didius_value_vat_percentage) / 100));
			}
			else
			{
				this._commissionfee = 0;
				this._amount = 0;
				this._vatamount = 0;
				this._vatcommissionfee = 0;
			}
		}

		private SettlementLine ()
		{
			this._id = Guid.Empty;
			this._no = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._itemid = Guid.Empty;
			this._text = string.Empty;
			this._commissionfee = 0;
			this._amount = 0;
			this._vatamount = 0;
			this._vatcommissionfee = 0;
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
			result.Add ("vatamount", this._vatamount);
			result.Add ("vatcommissionfee", this._vatcommissionfee);
			result.Add ("vattotal", this.VatTotal);
			result.Add ("total", this.Total);
				
			return SNDK.Convert.ToXmlDocument (result, this.GetType ().FullName.ToLower ());
		}
		#endregion

		#region Public Static Methods
		public static SettlementLine FromXmlDocument (XmlDocument xmlDocument)
		{
			Hashtable item;
			SettlementLine result = new SettlementLine ();
			
			try
			{
				item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (xmlDocument.SelectSingleNode ("(//didius.settlementline)[1]")));
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

			if (item.ContainsKey ("vatamount"))
			{
				result._vatamount = decimal.Parse ((string)item["vatamount"], System.Globalization.CultureInfo.InvariantCulture);
			}

			if (item.ContainsKey ("vatcommissionfee"))
			{
				result._vatcommissionfee = decimal.Parse ((string)item["vatcommissionfee"], System.Globalization.CultureInfo.InvariantCulture);
			}

			return result;
		}
		#endregion
	}
}

