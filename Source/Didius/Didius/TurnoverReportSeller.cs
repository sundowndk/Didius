using System;
using System.Xml;
using System.Collections.Generic;
using System.Collections;

namespace Didius
{
	public class TurnoverReportSeller
	{
		#region Private Fields
		private Guid _id;
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

			set
			{
				this._amount = value;
			}
		}

		public decimal VatAmount
		{
			get
			{
				return this._vatamount;
			}

			set
			{
				this._vatamount = value;
			}
		}

		public decimal CommissionFee
		{
			get
			{
				return this._commissionfee;
			}

			set
			{
				this._commissionfee = value;
			}
		}

		public decimal VatCommissionFee
		{
			get
			{
				return this._vatcommissionfee;
			}

			set
			{
				this._vatcommissionfee = value;
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
		public TurnoverReportSeller (Customer Customer)
		{
			this._id = Customer.Id;
			this._text = Customer.Name;
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

