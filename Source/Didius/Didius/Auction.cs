// 
//  Auction.cs
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
	public class Auction
	{
		#region Public Static Fields
		public static string DatastoreAisle = "didius_auctions";
		#endregion
		
		#region Private Fields
		private Guid _id;
		
		private int _createtimestamp;
		private int _updatetimestamp;

		private string _no;

		private string _title;
		private int _auctiondate;
		private string _description;

		private List<LiveBider> _livebiders;

		private string _notes;
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

		public string No
		{
			get
			{
				return this._no;
			}
		}

		public string Title
		{
			get
			{
				return this._title;
			}

			set
			{
				this._title = value;
			}
		}

		public DateTime AuctionDate
		{
			get
			{
				return SNDK.Date.TimestampToDateTime (this._auctiondate);
			}
		}

		public string Description
		{
			get
			{
				return this._description;
			}

			set
			{
				this._description = value;
			}
		}

		public List<LiveBider> LiveBiders
		{
			get
			{
				return this._livebiders;
			}
		}

		public string Notes
		{
			get
			{
				return this._notes;
			}

			set
			{
				this._notes = value;
			}
		}

		public List<Case> Cases
		{
			get
			{
				return Case.List (this);
			}
		}
		#endregion
		
		#region Constructor
		public Auction ()
		{
			this._id = Guid.NewGuid ();
						
			this._createtimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();

			this._no = Helpers.NewNo ();

			this._title = string.Empty;
			this._auctiondate = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._description = string.Empty;

			this._livebiders = new List<LiveBider> ();

			this._notes = string.Empty;
		}		
		#endregion

		#region Public Methods
		public void Save ()
		{
			try
			{
				this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
				
				Hashtable item = new Hashtable ();
				
				item.Add ("id", this._id);
				item.Add ("createtimestamp", this._createtimestamp);
				item.Add ("updatetimestamp", this._updatetimestamp);		

				item.Add ("no", this._no);	

				item.Add ("title", this._title);
				item.Add ("auctiondate", this._auctiondate);
				item.Add ("description", this._description);

				item.Add ("livebiders", this._livebiders);

				item.Add ("notes", this._notes);
								
				SorentoLib.Services.Datastore.Set (DatastoreAisle, this._id.ToString (), SNDK.Convert.ToXmlDocument (item, this.GetType ().FullName.ToLower ()));
			}
			catch (Exception exception)
			{
				Console.WriteLine (exception);
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.AUCTION", exception.Message));
				
				// EXCEPTION: Exception.AuctionSave
				throw new Exception (string.Format (Strings.Exception.AuctionSave, this._id.ToString ()));
			}					
		}

//		public Bid AddBid (Customer Customer, Item Item, decimal Amount)
//		{
//			return AddBid (Customer.Id, Item.Id, Amount);
//		}
//
//		public Bid AddBid (Guid CustomerId, Guid ItemId, decimal Amount)
//		{
//			Bid result = new Bid ();
//
//
//		}
				
		public XmlDocument ToXmlDocument ()
		{
			Hashtable result = new Hashtable ();
			
			result.Add ("id", this._id);
			result.Add ("createtimestamp", this._createtimestamp);
			result.Add ("updatetimestamp", this._updatetimestamp);				

			result.Add ("no", this._no);

			result.Add ("title", this._title);
			result.Add ("auctiondate", String.Format("{0:yyyy/MM/dd}", SNDK.Date.TimestampToDateTime (this._auctiondate)));
			result.Add ("description", this._description);

			result.Add ("livebiders", this._livebiders);

			result.Add ("notes", this._notes);

			return SNDK.Convert.ToXmlDocument (result, this.GetType ().FullName.ToLower ());
		}
		#endregion
		
		#region Public Static Methods
		public static Auction Load (Guid Id)
		{
			Auction result;
			
			try
			{
				Hashtable item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (SorentoLib.Services.Datastore.Get<XmlDocument> (DatastoreAisle, Id.ToString ()).SelectSingleNode ("(//didius.auction)[1]")));
				result = new Auction ();
				
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
					result._no = (string)item["no"];
				}				

				if (item.ContainsKey ("title"))
				{
					result._title = (string)item["title"];
				}			

				if (item.ContainsKey ("auctiondate"))
				{
					result._auctiondate = int.Parse ((string)item["auctiondate"]);
				}			

				if (item.ContainsKey ("description"))
				{
					result._description = (string)item["description"];
				}				

				if (item.ContainsKey ("livebiders"))
				{				
					foreach (XmlDocument livebider in (List<XmlDocument>)item["livebiders"])
					{
						result._livebiders.Add (LiveBider.FromXmlDocument (livebider));
					}
				}

				if (item.ContainsKey ("notes"))
				{
					result._notes = (string)item["notes"];
				}				
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.AUCTION", exception.Message));
				
				// EXCEPTION: Excpetion.AuctionLoadGuid
				throw new Exception (string.Format (Strings.Exception.AuctionLoadGuid, Id));
			}	
			
			return result;
		}
		
		public static void Delete (Guid Id)
		{
			// We can not delete Auction with a Case related to it.
			if (Case.List (Auction.Load (Id)).Count > 0)
			{
				// EXCEPTION: Exception.AuctionHasCase
				throw new Exception (string.Format (Strings.Exception.AuctionDeleteHasCase, Id.ToString ()));
			}

			try
			{
				SorentoLib.Services.Datastore.Delete (DatastoreAisle, Id.ToString ());
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.AUCTION", exception.Message));
				
				// EXCEPTION: Exception.AuctionDeleteGuid
				throw new Exception (string.Format (Strings.Exception.AuctionDeleteGuid, Id.ToString ()));
			}			
		}

		public static List<Auction> List ()
		{
			List<Auction> result = new List<Auction> ();
			
			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle))
			{
				try
				{
					result.Add (Load (new Guid (id)));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.AUCTION", exception.Message));
					
					// LOG: LogDebug.AuctionList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.AuctionList, id));
				}
			}
			
			return result;
		}
		
		public static Auction FromXmlDocument (XmlDocument xmlDocument)
		{
			Hashtable item;
			Auction result = new Auction ();
			
			try
			{
				item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (xmlDocument.SelectSingleNode ("(//didius.Auction)[1]")));
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
				throw new Exception (string.Format (Strings.Exception.ItemFromXmlDocument, "ID"));
			}
			
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
				result._no = (string)item["no"];
			}

			if (item.ContainsKey ("title"))
			{
				result._title = (string)item["title"];
			}

			if (item.ContainsKey ("auctiondate"))
			{			
				result._auctiondate = SNDK.Date.DateTimeToTimestamp (DateTime.ParseExact ((string)item["auctiondate"], "yyyy/MM/dd", null));
			}

			if (item.ContainsKey ("description"))
			{
				result._description = (string)item["description"];
			}				

			if (item.ContainsKey ("livebiders"))
			{				
				foreach (XmlDocument livebider in (List<XmlDocument>)item["livebiders"])
				{
					result._livebiders.Add (LiveBider.FromXmlDocument (livebider));
				}
			}	

			if (item.ContainsKey ("notes"))
			{
				result._notes = (string)item["notes"];
			}

			return result;
		}
		#endregion
	}
}

