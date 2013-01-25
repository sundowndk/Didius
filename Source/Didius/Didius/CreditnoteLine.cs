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
			private Guid _itemid;
			private string _title;
			private decimal _commissionfee;
			private decimal _amount;
			private bool _vat;
			#endregion

			#region Public Fields
			public Guid Id
			{
				get
				{
					return this._id;
				}
			}

			public Guid ItemId
			{
				get
				{
					return this._itemid;
				}

			}

			public string Title
			{
				get
				{
					return this._title;
				}
			}

			public decimal CommessionFee
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

			public bool Vat
			{
				get
				{
					return this._vat;
				}
			}
			#endregion

			#region Constructor
			public CreditnoteLine (Item Item)
			{
				this._id = Guid.NewGuid ();
				this._itemid = Item.Id;
				this._commissionfee = Item.CommissionFee;
				this._amount = Item.BidAmount;
				this._vat = Item.Vat;
			}

			private CreditnoteLine ()
			{
				this._id = Guid.Empty;
				this._itemid = Guid.Empty;
				this._commissionfee = 0;
				this._amount = 0;
				this._vat = false;
			}
			#endregion

			#region Public Methods
			public XmlDocument ToXmlDocument ()
			{
				Hashtable result = new Hashtable ();
			
//				result.Add ("id", this._id);			
//				result.Add ("itemid", this._itemid);
//				result.Add ("commissionfee", this._commissionfee);
//				result.Add ("amount", this._amount);
//				result.Add ("vat", this._vat);
				
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
					item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (xmlDocument.SelectSingleNode ("(//didius.creditnote.creditnoteline)[1]")));
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

				if (item.ContainsKey ("itemid"))
				{
					result._itemid = new Guid ((string)item["itemid"]);
				}
				else
				{
					throw new Exception (string.Format (Strings.Exception.CreditnoteLineFromXmlDocument, "ITEMID"));
				}
						
				if (item.ContainsKey ("title"))
				{
					result._title = (string)item["title"];
				}

				if (item.ContainsKey ("commissionfee"))
				{
					result._commissionfee = decimal.Parse ((string)item["commissionfee"]);
				}

				if (item.ContainsKey ("amount"))
				{
					result._amount = decimal.Parse ((string)item["amount"]);
				}

				if (item.ContainsKey ("vat"))
				{
					result._vat = (bool)item["vat"];
				}

				return result;
			}
			#endregion
		}
}

