// 
//  CustomerGroup.cs
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
	public class Case
	{
		#region Public Static Fields
		public static string DatastoreAisle = "didius_cases";
		#endregion
		
		#region Private Fields
		private Guid _id;
		
		private int _createtimestamp;
		private int _updatetimestamp;

		private string _no;

		private Guid _customerid;
		private Guid _auctionid;

		private string _title;
		private string _customerreference;

		private decimal _preparationfee;
		private decimal _commisionfeepercentage;
		private decimal _commisionfeeminimum;
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

		public Guid CustomerId
		{
			get
			{
				return this._customerid;
			}
		}

		public Guid AuctionId
		{
			get
			{
				return this._auctionid;
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

		public string CustomerReference
		{
			get
			{
				return this._customerreference;
			}
			
			set
			{
				this._customerreference = value;
			}
		}

		public decimal PreparationFee
		{
			get
			{
				return this._preparationfee;
			}
			
			set 
			{
				this._preparationfee = value;
			}
		}

		public decimal CommisionFeePercentage
		{
			get
			{
				return this._commisionfeepercentage;
			}
			
			set 
			{
				this._commisionfeepercentage = value;
			}
		}

		public decimal CommisionFeeMinimum
		{
			get
			{
				return this._commisionfeeminimum;
			}
			
			set 
			{
				this._commisionfeeminimum = value;
			}
		}
		#endregion
		
		#region Constructor
		public Case (Customer Customer)
		{
			this._id = Guid.NewGuid ();
			
			this._createtimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			
			this._no = Helpers.NewNo ();

			this._customerid = Customer.Id;
			this._auctionid = Guid.Empty;

			this._title = string.Empty;
			this._customerreference = string.Empty;

			this._preparationfee = 0;
			this._commisionfeepercentage = 0;
			this._commisionfeeminimum = 0;
		}

		public Case (Guid Id)
		{
			this._id = Guid.NewGuid ();
			
			this._createtimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			
			this._no =	Helpers.NewNo ();
						
			this._customerid = Id;
			this._auctionid = Guid.Empty;

			this._title = string.Empty;
			this._customerreference = string.Empty;

			this._preparationfee = 0;
			this._commisionfeepercentage = 0;
			this._commisionfeeminimum = 0;
		}

		private Case ()
		{
			this._createtimestamp = 0;
			this._updatetimestamp = 0;

			this._no = Helpers.NewNo ();
			this._auctionid = Guid.Empty;

			this._title = string.Empty;
			this._customerreference = string.Empty;

			this._preparationfee = 0;
			this._commisionfeepercentage = 0;
			this._commisionfeeminimum = 0;
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

				item.Add ("customerid", this._customerid);			
				item.Add ("auctionid", this._auctionid);

				item.Add ("title", this._title);
				item.Add ("customerreference", this._customerreference);

				item.Add ("preparationfee", this._preparationfee);
				item.Add ("commisionfeepercentage", this._commisionfeepercentage);
				item.Add ("commisionfeeminimum", this._commisionfeeminimum);

				SorentoLib.Services.Datastore.Meta meta = new SorentoLib.Services.Datastore.Meta ();
				meta.Add ("customerid", this._customerid);
				meta.Add ("auctionid", this._auctionid);
				
				SorentoLib.Services.Datastore.Set (DatastoreAisle, this._id.ToString (), SNDK.Convert.ToXmlDocument (item, this.GetType ().FullName.ToLower ()), meta);				
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.CASE", exception.Message));
				
				// EXCEPTION: Exception.PageSave
				throw new Exception (string.Format (Strings.Exception.CaseSave, this._id.ToString ()));
			}					
		}
		
		public XmlDocument ToXmlDocument ()
		{
			Hashtable result = new Hashtable ();
			
			result.Add ("id", this._id);
			result.Add ("createtimestamp", this._createtimestamp);
			result.Add ("updatetimestamp", this._updatetimestamp);
			
			result.Add ("no", this._no);

			result.Add ("customerid", this._customerid);
			result.Add ("auctionid", this._auctionid);

			result.Add ("title", this._title);
			result.Add ("customerreference", this._customerreference);
			
			result.Add ("preparationfee", this._preparationfee);
			result.Add ("commisionfeepercentage", this._commisionfeepercentage);
			result.Add ("commisionfeeminimum", this._commisionfeeminimum);
			
			return SNDK.Convert.ToXmlDocument (result, this.GetType ().FullName.ToLower ());
		}
		#endregion
		
		#region Public Static Methods
		public static Case Load (Guid Id)
		{
			Case result;
			
			try
			{
				Hashtable item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (SorentoLib.Services.Datastore.Get<XmlDocument> (DatastoreAisle, Id.ToString ()).SelectSingleNode ("(//didius.case)[1]")));
				result = new Case ();
				
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

				if (item.ContainsKey ("customerid"))
				{					
					result._customerid = new Guid ((string)item["customerid"]);
				}				

				if (item.ContainsKey ("auctionid"))
				{					
					result._auctionid = new Guid ((string)item["auctionid"]);
				}				

				if (item.ContainsKey ("title"))
				{					
					result._title = (string)item["title"];
				}				

				if (item.ContainsKey ("customerreference"))
				{					
					result._customerreference = (string)item["customerreference"];
				}				

				if (item.ContainsKey ("preparationfee"))
				{					
					result._preparationfee = decimal.Parse ((string)item["preparationfee"]);
				}				

				if (item.ContainsKey ("commisionfeepercentage"))
				{					
					result._commisionfeepercentage = decimal.Parse ((string)item["commisionfeepercentage"]);
				}				

				if (item.ContainsKey ("commisionfeeminimum"))
				{					
					result._commisionfeeminimum = decimal.Parse ((string)item["commisionfeeminimum"]);
				}				
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.CASE", exception.Message));
				
				// EXCEPTION: Excpetion.PageLoadName
				throw new Exception (string.Format (Strings.Exception.CaseLoadGuid, Id));
			}	
			
			return result;
		}
		
		public static void Delete (Guid Id)
		{
			// We can not delete Customer with a Case related to it.
			if (Item.List (Id).Count == 0)
			{
				try
				{
					SorentoLib.Services.Datastore.Delete (DatastoreAisle, Id.ToString ());
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.CASE", exception.Message));
				
					// EXCEPTION: Exception.PageDelete
					throw new Exception (string.Format (Strings.Exception.CaseDeleteGuid, Id.ToString ()));
				}			
			}
			else
			{
				// EXCEPTION: Exception.CaseDeleteInUse
				throw new Exception (string.Format (Strings.Exception.CaseDeleteHasItem, Id.ToString ()));
			}
		}

		public static List<Case> List (Customer Customer)
		{
			return List (Customer.Id);
		}

		public static List<Case> List (Auction Auction)
		{
			return List (Auction.Id);
		}

		public static List<Case> List (Guid Id)
		{
			List<Case> result = new List<Case> ();
			
			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("customerid", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Equal, Id), new SorentoLib.Services.Datastore.MetaSearch (SorentoLib.Enums.DatastoreMetaSearchLogicOperator.Or), new SorentoLib.Services.Datastore.MetaSearch ("auctionid", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Equal, Id)))
			{
				try
				{
					result.Add (Load (new Guid (id)));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.CASE", exception.Message));
					
					// LOG: LogDebug.PageList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.CaseList, id));
				}
			}
			
			return result;
		}

		public static List<Case> List ()
		{
			List<Case> result = new List<Case> ();

			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle))
			{
				try
				{
					result.Add (Load (new Guid (id)));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.CASE", exception.Message));
					
					// LOG: LogDebug.PageList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.CaseList, id));
				}
			}
			
			return result;
		}
		
		public static Case FromXmlDocument (XmlDocument xmlDocument)
		{
			Hashtable item;
			Case result = new Case ();
			
			try
			{
				item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (xmlDocument.SelectSingleNode ("(//didius.Case)[1]")));
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
				throw new Exception (string.Format (Strings.Exception.CaseFromXmlDocument, "ID"));
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

			if (item.ContainsKey ("customerid"))
			{					
				result._customerid = new Guid ((string)item["customerid"]);
			}	
			else
			{
				throw new Exception (string.Format (Strings.Exception.CaseFromXmlDocument, "CUSTOMERID"));
			}

			if (item.ContainsKey ("auctionid"))
			{					
				result._auctionid = new Guid ((string)item["auctionid"]);
			}	

			if (item.ContainsKey ("title"))
			{					
				result._title = (string)item["title"];
			}				

			if (item.ContainsKey ("customerreference"))
			{					
				result._customerreference = (string)item["customerreference"];
			}				
			
			if (item.ContainsKey ("preparationfee"))
			{					
				result._preparationfee = decimal.Parse ((string)item["preparationfee"]);
			}				
			
			if (item.ContainsKey ("commisionfeepercentage"))
			{					
				result._commisionfeepercentage = decimal.Parse ((string)item["commisionfeepercentage"]);
			}				
			
			if (item.ContainsKey ("commisionfeeminimum"))
			{					
				result._commisionfeeminimum = decimal.Parse ((string)item["commisionfeeminimum"]);
			}
			
			return result;
		}
		#endregion
	}
}

