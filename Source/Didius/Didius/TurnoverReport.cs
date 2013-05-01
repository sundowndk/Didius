using System;
using System.Xml;
using System.Collections;
using System.Collections.Generic;

namespace Didius
{
	public class TurnoverReport
	{
		private List<TurnoverReportSeller> _sellers;
		private List<TurnoverReportBuyer> _buyers;
		private List<TurnoverReportSellerLine> _sellerlines;
		private List<TurnoverReportBuyerLine> _buyerlines;
		private List<TurnoverReportNotSoldLine> _notsoldlines;

		public decimal SellerAmount
		{
			get
			{
				decimal result = 0;

				foreach (TurnoverReportSellerLine line in this._sellerlines)
				{
					result += line.Amount;
				}

				return result;
			}
		}

		public decimal SellerVatAmount
		{
			get
			{
				decimal result = 0;

				foreach (TurnoverReportSellerLine line in this._sellerlines)
				{
					result += line.VatAmount;
				}

				return result;
			}
		}

		public decimal SellerCommissionFee
		{
			get
			{
				decimal result = 0;

				foreach (TurnoverReportSellerLine line in this._sellerlines)
				{
					result += line.CommissionFee;
				}

				return result;
			}
		}

		public decimal SellerVatCommissionFee
		{
			get
			{
				decimal result = 0;

				foreach (TurnoverReportSellerLine line in this._sellerlines)
				{
					result += line.VatCommissionFee;
				}

				return result;
			}
		}


		public decimal SellerVat
		{
			get
			{
				decimal result = 0;

				foreach (TurnoverReportSellerLine line in this._sellerlines)
				{
					result += line.VatTotal;
				}

				return result;
			}
		}

		public decimal SellerTotal
		{
			get
			{
				decimal result = 0;

				foreach (TurnoverReportSellerLine line in this._sellerlines)
				{
					result += line.Total;
				}

				return result;
			}
		}

		public decimal BuyerAmount
		{
			get
			{
				decimal result = 0;

				foreach (TurnoverReportBuyerLine line in this._buyerlines)
				{
					result += line.Amount;
				}

				return result;
			}
		}

		public decimal BuyerVatAmount
		{
			get
			{
				decimal result = 0;

				foreach (TurnoverReportBuyerLine line in this._buyerlines)
				{
					result += line.VatAmount;
				}

				return result;
			}
		}

		public decimal BuyerCommissionFee
		{
			get
			{
				decimal result = 0;

				foreach (TurnoverReportBuyerLine line in this._buyerlines)
				{
					result += line.CommissionFee;
				}

				return result;
			}
		}

		public decimal BuyerVatCommissionFee
		{
			get
			{
				decimal result = 0;

				foreach (TurnoverReportBuyerLine line in this._buyerlines)
				{
					result += line.VatCommissionFee;
				}

				return result;
			}
		}

		public decimal BuyerVat
		{
			get
			{
				decimal result = 0;

				foreach (TurnoverReportBuyerLine line in this._buyerlines)
				{
					result += line.VatTotal;
				}

				return result;
			}
		}

		public decimal BuyerTotal
		{
			get
			{
				decimal result = 0;

				foreach (TurnoverReportBuyerLine line in this._buyerlines)
				{
					result += line.Total;
				}

				return result;
			}
		}

		public decimal Netto
		{
			get
			{
				return this.BuyerTotal - this.SellerTotal;
			}
		}

		private TurnoverReport ()
		{
			this._buyers = new List<TurnoverReportBuyer> ();
			this._sellers = new List<TurnoverReportSeller> ();
			this._sellerlines = new List<TurnoverReportSellerLine> ();
			this._buyerlines = new List<TurnoverReportBuyerLine> ();
			this._notsoldlines = new List<TurnoverReportNotSoldLine> ();
		}

		static public TurnoverReport Create (Auction Auction)
		{
			TurnoverReport result = new TurnoverReport ();

			foreach (Item item in Item.List (Auction))
			{
//				if (item.CurrentBidId != Guid.Empty)
				if (item.Invoiced)
				{
					Case case_ = Case.Load (item.CaseId);
					Bid bid = Bid.Load (item.CurrentBidId);

					TurnoverReportSellerLine sellerline = new TurnoverReportSellerLine (item);
					TurnoverReportSeller seller = result._sellers.Find(TurnoverReportSeller => TurnoverReportSeller.Id == case_.CustomerId);

					if (seller == null)
					{
						seller = new TurnoverReportSeller (Customer.Load (case_.CustomerId));
						result._sellers.Add (seller);
					}

					seller.Amount += sellerline.Amount;
					seller.VatAmount += sellerline.VatAmount;
					seller.CommissionFee += sellerline.CommissionFee;
					seller.VatCommissionFee += sellerline.VatCommissionFee;

					result._sellerlines.Add (sellerline);

					TurnoverReportBuyerLine buyerline = new TurnoverReportBuyerLine (item);
					TurnoverReportBuyer buyer = result._buyers.Find(TurnoverReportBuyer => TurnoverReportBuyer.Id == bid.CustomerId);

					if (buyer == null)
					{
						buyer = new TurnoverReportBuyer (Customer.Load (bid.CustomerId));
						result._buyers.Add (buyer);
					}

					buyer.Amount += buyerline.Amount;
					buyer.VatAmount += buyerline.VatAmount;
					buyer.CommissionFee += buyerline.CommissionFee;
					buyer.VatCommissionFee += buyerline.VatCommissionFee;

					result._buyerlines.Add (buyerline);
				}
				else
				{
					result._notsoldlines.Add (new TurnoverReportNotSoldLine (item));
				}
			}

			return result;
		}

		public XmlDocument ToXmlDocument ()
		{
			Hashtable result = new Hashtable ();

			result.Add ("sellers", this._sellers);
			result.Add ("buyers", this._buyers);

			result.Add ("sellerlines", this._sellerlines);
			result.Add ("buyerlines", this._buyerlines);
			result.Add ("notsoldlines", this._notsoldlines);

			result.Add ("selleramount", this.SellerAmount);
			result.Add ("sellervatamount", this.SellerVatAmount);
			result.Add ("sellercommissionfee", this.SellerCommissionFee);
			result.Add ("sellervatcommissionfee", this.SellerVatCommissionFee);
			result.Add ("sellervat", this.SellerVat);
			result.Add ("sellertotal", this.SellerTotal);

			result.Add ("buyeramount", this.BuyerAmount);
			result.Add ("buyervatamount", this.BuyerVatAmount);
			result.Add ("buyercommissionfee", this.BuyerCommissionFee);
			result.Add ("buyervatcommissionfee", this.BuyerVatCommissionFee);
			result.Add ("buyervat", this.BuyerVat);
			result.Add ("buyertotal", this.BuyerTotal);

			result.Add ("netto", this.Netto);

			return SNDK.Convert.ToXmlDocument (result, this.GetType ().FullName.ToLower ());
		}
	}
}

