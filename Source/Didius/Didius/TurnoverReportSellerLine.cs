using System;
using System.Xml;
using System.Collections.Generic;
using System.Collections;

namespace Didius
{
	public class TurnoverReportSellerLine
	{
		#region Private Fields
		private Guid _id;
		private Guid _caseid;
		private Guid _itemid;
		private Guid _customerid;
		private int _catalogno;
		private string _text;
		private decimal _amount;
		private decimal _vatamount;
		private decimal _commissionfee;
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

		public Guid CaseId
		{
			get
			{
				return this._caseid;
			}
		}

		public Guid ItemId
		{
			get
			{
				return this._itemid;
			}

		}

		public Guid CustomerId
		{
			get
			{
				return this._customerid;
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

		public decimal CommissionFee
		{
			get
			{
				return this._commissionfee;
			}
		}

		public decimal VatCommissionFee
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
		public TurnoverReportSellerLine (Item Item)
		{
			this._id = Guid.NewGuid ();
			this._caseid = Item.CaseId;
			this._itemid = Item.Id;
			this._customerid = Case.Load (Item.CaseId).CustomerId;
			this._catalogno = Item.CatalogNo;
			this._text = Item.Title;

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

		private TurnoverReportSellerLine ()
		{
			this._id = Guid.Empty;
			this._caseid = Guid.Empty;
			this._itemid = Guid.Empty;
			this._customerid = Guid.Empty;
			this._catalogno = 0;
			this._text = string.Empty;
			this._amount = 0;
			this._vatamount = 0;
			this._commissionfee = 0;
			this._vatcommissionfee = 0;
		}
		#endregion

		#region Public Methods
		public XmlDocument ToXmlDocument ()
		{
			Hashtable result = new Hashtable ();
			
			result.Add ("id", this._id);			
			result.Add ("caseid", this._caseid);
			result.Add ("itemid", this._itemid);
			result.Add ("customerid", this._customerid);
			result.Add ("catalogno", this._catalogno);
			result.Add ("text", this._text);
			result.Add ("amount", this._amount);
			result.Add ("vatamount", this._vatamount);
			result.Add ("commissionfee", this._commissionfee);
			result.Add ("vatcommissionfee", this._vatcommissionfee);
			result.Add ("vattotal", this.VatTotal);
			result.Add ("total", this.Total);

			return SNDK.Convert.ToXmlDocument (result, this.GetType ().FullName.ToLower ());
		}
		#endregion
	}
}

