using System;
using System.Xml;
using System.Collections.Generic;
using System.Collections;

namespace Didius
{
	public class TurnoverReportNotSoldLine
	{
		#region Private Fields
		private Guid _id;
		private Guid _caseid;
		private Guid _itemid;
		private Guid _customerid;
		private int _catalogno;
		private string _text;
		private decimal _amount;
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
		#endregion

		#region Constructor
		public TurnoverReportNotSoldLine (Item Item)
		{
			this._id = Guid.NewGuid ();
			this._caseid = Item.CaseId;
			this._itemid = Item.Id;
			this._customerid = Case.Load (Item.CaseId).CustomerId;
			this._catalogno = Item.CatalogNo;
			this._text = Item.Description;
		}

		private TurnoverReportNotSoldLine ()
		{
			this._id = Guid.Empty;
			this._caseid = Guid.Empty;
			this._itemid = Guid.Empty;
			this._customerid = Guid.Empty;
			this._catalogno = 0;
			this._text = string.Empty;
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

			return SNDK.Convert.ToXmlDocument (result, this.GetType ().FullName.ToLower ());
		}
		#endregion
	}
}

