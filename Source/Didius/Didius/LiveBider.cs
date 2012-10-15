//
//  LiveBider.cs
//
//  Author:
//       sundown <${AuthorEmail}>
//
//  Copyright (c) 2012 rvp
//
//  This program is free software; you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation; either version 2 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program; if not, write to the Free Software
//  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
//
using System;
using System.Xml;
using System.Collections;

namespace Didius
{
	public class LiveBider
	{
		Guid _customerid;
		string _buyerno;

		public Guid CustomerId
		{
			get
			{
				return this._customerid;
			}

			set
			{
				this._customerid = value;
			}
		}

		public string BuyerNo
		{
			get
			{
				return this._buyerno;
			}

			set
			{
				this._buyerno = value;
			}
		}

		public LiveBider ()
		{
			this._customerid = Guid.Empty;
			this._buyerno = string.Empty;
		}

		public XmlDocument ToXmlDocument ()
		{
			Hashtable result = new Hashtable ();
			
			result.Add ("customerid", this._customerid);
			result.Add ("buyerno", this._buyerno);
			
			return SNDK.Convert.ToXmlDocument (result, this.GetType ().FullName.ToLower ());
		}

		public static LiveBider FromXmlDocument (XmlDocument xmlDocument)
		{
			Hashtable item;
			LiveBider result = new LiveBider ();
			
			try
			{
				item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (xmlDocument.SelectSingleNode ("(//didius.LiveBider)[1]")));
			}
			catch
			{
				item = (Hashtable)SNDK.Convert.FromXmlDocument (xmlDocument);
			}
			
			if (item.ContainsKey ("customerid"))
			{
				result._customerid = new Guid ((string)item["customerid"]);
			}
			
			if (item.ContainsKey ("buyerno"))
			{
				result._buyerno = (string)item["buyerno"];
			}

			return result;
		}
	}
}

