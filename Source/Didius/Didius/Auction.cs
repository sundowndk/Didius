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

		private int _begin;
		private int _end;
		private int _deadline;
		private int _pickupbegin;
		private int _pickupend;
		private string _pickuptext;

		private string _location;

		private string _description;

		private string _buyernos;

		private List<LiveBider> _livebiders;

		private string _notes;

		private Enums.AuctionType _type;
		private Enums.AuctionStatus _status;
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

		public DateTime Begin
		{
			get
			{
				return SNDK.Date.TimestampToDateTime (this._begin);
			}
		}

		public DateTime End
		{
			get
			{
				return SNDK.Date.TimestampToDateTime (this._end);
			}
		}

		public DateTime Deadline
		{
			get
			{
				return SNDK.Date.TimestampToDateTime (this._deadline);
			}
		}

		public DateTime PickupBegin
		{
			get
			{
				return SNDK.Date.TimestampToDateTime (this._pickupbegin);
			}
		}

		public DateTime PickupEnd
		{
			get
			{
				return SNDK.Date.TimestampToDateTime (this._pickupend);
			}
		}

		public string PickupText
		{
			get
			{
				return this._pickuptext;
			}

			set
			{
				this._pickuptext = value;
			}
		}

		public string Location
		{
			get
			{
				return this._location;
			}

			set
			{
				this._location = value;
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

		public Enums.AuctionType Type
		{
			get
			{
				return this._type;
			}
			
			set
			{
				this._type = value;
			}
		}

		public Enums.AuctionStatus Status
		{
			get
			{
				return this._status;
			}

			set
			{
				this._status = value;
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

			this._begin = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._end = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._deadline = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._pickupbegin = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._pickupend = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._pickuptext = string.Empty;

			this._location = string.Empty;

			this._description = string.Empty;

			this._livebiders = new List<LiveBider> ();

			this._buyernos = string.Empty;

			this._notes = string.Empty;

			this._type = Enums.AuctionType.Live;
			this._status = Enums.AuctionStatus.Hidden;
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

				item.Add ("begin", this._begin);
				item.Add ("end", this._end);
				item.Add ("deadline", this._deadline);
				item.Add ("pickupbegin", this._pickupbegin);
				item.Add ("pickupend", this._pickupend);
				item.Add ("pickuptext", this._pickuptext);

				item.Add ("location", this._location);

				item.Add ("description", this._description);

				item.Add ("livebiders", this._livebiders);

				item.Add ("buyernos", this._buyernos);

				item.Add ("notes", this._notes);

				item.Add ("type", this._type);
				item.Add ("status", this._status);
								
				SorentoLib.Services.Datastore.Set (DatastoreAisle, this._id.ToString (), SNDK.Convert.ToXmlDocument (item, this.GetType ().FullName.ToLower ()));
			}
			catch (Exception exception)
			{
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

			result.Add ("begin", String.Format("{0:yyyy/MM/dd HH:mm}", SNDK.Date.TimestampToDateTime (this._begin)));
			result.Add ("end", String.Format("{0:yyyy/MM/dd HH:mm}", SNDK.Date.TimestampToDateTime (this._end)));
			result.Add ("deadline", String.Format("{0:yyyy/MM/dd HH:mm}", SNDK.Date.TimestampToDateTime (this._deadline)));

			result.Add ("pickupbegin", String.Format("{0:yyyy/MM/dd HH:mm}", SNDK.Date.TimestampToDateTime (this._pickupbegin)));
			result.Add ("pickupend", String.Format("{0:yyyy/MM/dd HH:mm}", SNDK.Date.TimestampToDateTime (this._pickupend)));
			result.Add ("pickuptext", this._pickuptext);

			result.Add ("location", this._location);

			result.Add ("description", this._description);

			result.Add ("livebiders", this._livebiders);

			result.Add ("buyernos", this._buyernos);

			result.Add ("notes", this._notes);

			result.Add ("type", this._type);
			result.Add ("status", this._status);

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

				if (item.ContainsKey ("begin"))
				{
					result._begin = int.Parse ((string)item["begin"]);
				}			

				if (item.ContainsKey ("end"))
				{
					result._end = int.Parse ((string)item["end"]);
				}			

				if (item.ContainsKey ("deadline"))
				{
					result._deadline = int.Parse ((string)item["deadline"]);
				}			

				if (item.ContainsKey ("pickupbegin"))
				{
					result._pickupbegin = int.Parse ((string)item["pickupbegin"]);
				}

				if (item.ContainsKey ("pickupend"))
				{
					result._pickupend = int.Parse ((string)item["pickupend"]);
				}

				if (item.ContainsKey ("pickuptext"))
				{
					result._pickuptext = (string)item["pickuptext"];
				}

				if (item.ContainsKey ("location"))
				{
					result._location = (string)item["location"];
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

				if (item.ContainsKey ("buyernos"))
				{
					result._buyernos = (string)item["buyernos"];
				}				

				if (item.ContainsKey ("notes"))
				{
					result._notes = (string)item["notes"];
				}				

				if (item.ContainsKey ("type"))
				{
					result._type = SNDK.Convert.StringToEnum<Enums.AuctionType> ((string)item["type"]);
				}

				if (item.ContainsKey ("status"))
				{
					result._status = SNDK.Convert.StringToEnum<Enums.AuctionStatus> ((string)item["status"]);
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

			if (item.ContainsKey ("begin"))
			{			
				result._begin = SNDK.Date.DateTimeToTimestamp (DateTime.ParseExact ((string)item["begin"], "yyyy/MM/dd HH:mm", null));
			}

			if (item.ContainsKey ("end"))
			{			
				result._end = SNDK.Date.DateTimeToTimestamp (DateTime.ParseExact ((string)item["end"], "yyyy/MM/dd HH:mm", null));
			}

			if (item.ContainsKey ("deadline"))
			{			
				result._deadline = SNDK.Date.DateTimeToTimestamp (DateTime.ParseExact ((string)item["deadline"], "yyyy/MM/dd HH:mm", null));
			}

			if (item.ContainsKey ("pickupbegin"))
			{			
				result._pickupbegin = SNDK.Date.DateTimeToTimestamp (DateTime.ParseExact ((string)item["pickupbegin"], "yyyy/MM/dd HH:mm", null));
			}

			if (item.ContainsKey ("pickupend"))
			{			
				result._pickupend = SNDK.Date.DateTimeToTimestamp (DateTime.ParseExact ((string)item["pickupend"], "yyyy/MM/dd HH:mm", null));
			}

			if (item.ContainsKey ("pickuptext"))
			{			
				result._pickuptext = (string)item["pickuptext"];
			}

			if (item.ContainsKey ("location"))
			{			
				result._location = (string)item["location"];
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

			if (item.ContainsKey ("buyernos"))
			{
				result._buyernos = (string)item["buyernos"];
			}				

			if (item.ContainsKey ("notes"))
			{
				result._notes = (string)item["notes"];
			}

			if (item.ContainsKey ("type"))
			{
				result._type = SNDK.Convert.StringToEnum<Enums.AuctionType> ((string)item["type"]);
			}	

			if (item.ContainsKey ("status"))
			{
				result._status = SNDK.Convert.StringToEnum<Enums.AuctionStatus> ((string)item["status"]);
			}	

			return result;
		}
		#endregion
	}
}

