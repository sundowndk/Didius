// 
//  Item.cs
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
	public class Item
	{
		#region Public Static Fields
		public static string DatastoreAisle = "didius_items";
		#endregion
		
		#region Private Fields
		private Guid _id;
		
		private int _createtimestamp;
		private int _updatetimestamp;

		private string _no;
		private int _catalogno;

		private Guid _caseid;
		private Guid _auctionid;

		private string _title;
		private string _description;

		private bool _vat;

		private decimal _minimumbid;

		private decimal _appraisal1;
		private decimal _appraisal2;
		private decimal _appraisal3;

		private Hashtable _fields;

		private bool _invoiced;
		private bool _approvedforinvoice;
		private bool _settled;	



		private Guid _pictureid;
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

		public int CatalogNo
		{
			get
			{
				return this._catalogno;
			}

			set
			{
				this._catalogno = value;
			}
		}

		public Guid CaseId
		{
			get
			{
				return this._caseid;
			}
		}

		public Guid AuctionId
		{
			get
			{
				return this._auctionid;
			}

			set
			{
				this._auctionid = value;
			}
		}

		public Case Case
		{
			get
			{
				return Case.Load (this._caseid);
			}
		}

		public string Title
		{
			get
			{
				string result = string.Empty;

				try
				{
					result = this._description.Split ("\n".ToCharArray ())[0];
				}
				catch
				{
				}

				return result;
			}

//			set
//			{
//				this._title = value;
//			}
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

		public bool Vat
		{
			get 
			{
				return this._vat;
			}

			set
			{
				this._vat = value;
			}
		}



		public decimal MinimumBid
		{
			get
			{
				return Math.Round (this._minimumbid, 2);
			}

			set
			{
				this._minimumbid = value;
			}
		}

		public decimal Appraisal1
		{
			get
			{
				return Math.Round (this._appraisal1, 2);
			}

			set
			{
				this._appraisal1 = value;
			}
		}

		public decimal Appraisal2
		{
			get
			{
				return Math.Round (this._appraisal2, 2);
			}
			
			set
			{
				this._appraisal2 = value;
			}
		}

		public decimal Appraisal3
		{
			get
			{
				return Math.Round (this._appraisal3, 2);
			}
			
			set
			{
				this._appraisal3 = value;
			}
		}

		public Hashtable Fields
		{
			get
			{
				return this._fields;
			}
		}

		public bool Invoiced
		{
			get
			{
				return this._invoiced;
			}

			set
			{
				this._invoiced = value;
			}
		}

		public bool AppovedForInvoice
		{
			get
			{
				return this._approvedforinvoice;
			}

			set
			{
				this._approvedforinvoice = value;
			}
		}


		public bool Settled
		{
			get
			{
				return this._settled;
			}

			set
			{
				this._settled = value;
			}
		}

		public Guid PictureId
		{
			get
			{
				return this._pictureid;
			}

			set
			{
				this._pictureid = value;
			}
		}

		public Bid CurrentBid
		{
			get
			{
				List<Bid> bids = Didius.Bid.List (this);
				
				if (bids.Count > 0)
				{
					return bids[0];
				}
				
				return null;
			}
		}

		public Guid CurrentBidId
		{
			get
			{
				List<Bid> bids = Didius.Bid.List (this);

				if (bids.Count > 0)
				{
					return bids[0].Id;
				}

				return Guid.Empty;
			}
		}

//		public decimal CurrentBidAmount
//		{
//			get
//			{
//				decimal result = 0;
//			
//				if (this.CurrentBidId != Guid.Empty)
//				{
//					result = Bid.Load (this.CurrentBidId).Amount;
//				}
//
//				return Math.Round (result, 2);		
//			}
//		}

		public decimal BidAmount 
		{
			get
			{
				decimal result = 0;

				Bid currentbid = this.CurrentBid;

				if (currentbid != null)
				{
					result = currentbid.Amount;
				}


//				if (this.CurrentBidId != Guid.Empty)
//				{
//					result = Didius.Bid.Load (this.CurrentBidId).Amount;
//				}

				return Math.Round (result, 2);
			}
		}

		public decimal NextBidAmount
		{
			get
			{
				decimal result = 0;
				decimal bidamount = this.BidAmount;
				
				if (bidamount >= 0 && bidamount < 2000)
				{
					result = 100;
				}
				else if (bidamount >= 2000 && bidamount < 5000)
				{
					result = 200;
				}
				else if (bidamount >= 5000)
				{
					result = 500;
				}

				return Math.Round (result + bidamount, 2);
			}
		}

		public decimal CommissionFee
		{
			get
			{
				decimal result = 0;

				decimal commissionfee = this.Case.CommisionFeePercentage;
				decimal commissionfeeminimum = this.Case.CommisionFeeMinimum;
				Bid currentbid = this.CurrentBid;

				if (currentbid != null)
				{
					result = (currentbid.Amount * commissionfee) / 100;

					if (result < commissionfeeminimum)
					{
						result = commissionfeeminimum;
					}
				}
				else
				{
					result = 0;
				}

				return Math.Round (result, 2);
			}
		}

		public decimal VatAmount
		{
			get
			{
				decimal result = 0;
				if (this._vat)
				{
					if (this.BidAmount > 0)
					{
						result = (this.BidAmount * 0.25m);
					}
				}
				return result;
			}
		}

		#endregion
		
		#region Constructor
		public Item (Case Case)
		{
			this._id = Guid.NewGuid ();
						
			this._createtimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();

			this._no = Helpers.NewNo ();
			this._catalogno = Helpers.NewCatalogNo (Case.Auction);

			this._caseid = Case.Id;
			this._auctionid = Case.AuctionId;
			
			this._title = string.Empty;
			this._description = string.Empty;

			this._vat = false;

			this._minimumbid = 0;

			this._appraisal1 = 0;
			this._appraisal2 = 0;
			this._appraisal3 = 0;
			
			this._fields = new Hashtable ();		

			this._invoiced = false;
			this._approvedforinvoice = false;
			this._settled = false;

			this._pictureid = Guid.Empty;
		}
				
		private Item ()
		{
			this._createtimestamp = 0;
			this._updatetimestamp = 0;

			this._no = Helpers.NewNo ();
			this._catalogno = 0;


			this._auctionid = Guid.Empty;
			this._title = string.Empty;
			this._description = string.Empty;

			this._vat = false;

			this._minimumbid = 0;
			
			this._appraisal1 = 0;
			this._appraisal2 = 0;
			this._appraisal3 = 0;

			this._fields = new Hashtable ();

			this._invoiced = false;
			this._approvedforinvoice = false;
			this._settled = false;

			this._pictureid = Guid.Empty;
		}
		#endregion

		#region Public Methods
		public Item Save ()
		{
			try
			{
				this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
				
				Hashtable item = new Hashtable ();
				
				item.Add ("id", this._id);
				item.Add ("createtimestamp", this._createtimestamp);
				item.Add ("updatetimestamp", this._updatetimestamp);		
								
				item.Add ("no", this._no);
				item.Add ("catalogno", this._catalogno);

				item.Add ("caseid", this._caseid);			
				item.Add ("auctionid", this._auctionid);


//				item.Add ("title", this._title);

				item.Add ("description", this._description);
				item.Add ("fields", this._fields);

				item.Add ("vat", this._vat);

				item.Add ("minimumbid", this._minimumbid);

				item.Add ("appraisal1", this._appraisal1);
				item.Add ("appraisal2", this._appraisal2);
				item.Add ("appraisal3", this._appraisal3);

				item.Add ("invoiced", this._invoiced);
				item.Add ("approvedforinvoice", this._approvedforinvoice);
				item.Add ("settled", this._settled);

				item.Add ("pictureid", this._pictureid);
								
				SorentoLib.Services.Datastore.Meta meta = new SorentoLib.Services.Datastore.Meta ();
				meta.Add ("caseid", this._caseid);
				meta.Add ("auctionid", this._auctionid);
				
				SorentoLib.Services.Datastore.Set (DatastoreAisle, this._id.ToString (), SNDK.Convert.ToXmlDocument (item, this.GetType ().FullName.ToLower ()), meta);
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.ITEM", exception.Message));
				
				// EXCEPTION: Exception.ItemSave
				throw new Exception (string.Format (Strings.Exception.ItemSave, this._id.ToString (), exception.Message));
			}					

			return this;
		}
		
		public XmlDocument ToXmlDocument ()
		{
			Hashtable result = new Hashtable ();
			
			result.Add ("id", this._id);
			result.Add ("createtimestamp", this._createtimestamp);
			result.Add ("updatetimestamp", this._updatetimestamp);				

			result.Add ("no", this._no);
			result.Add ("catalogno", this._catalogno);

			result.Add ("caseid", this._caseid);
			result.Add ("auctionid", this._auctionid);
			result.Add ("case", Case.Load (this._caseid));

//			result.Add ("title", this._title);
			result.Add ("title", this.Title);
			result.Add ("description", this._description);

			result.Add ("vat", this._vat);

			result.Add ("minimumbid", this._minimumbid);

			result.Add ("appraisal1", this._appraisal1);
			result.Add ("appraisal2", this._appraisal2);
			result.Add ("appraisal3", this._appraisal3);

			result.Add ("fields", this._fields);

			result.Add ("invoiced", this._invoiced);
			result.Add ("approvedforinvoice", this._approvedforinvoice);
			result.Add ("settled", this._settled);

			result.Add ("pictureid", this._pictureid);

			result.Add ("currentbidid", this.CurrentBidId);
			result.Add ("bidamount", this.BidAmount);
			result.Add ("nextbidamount", this.NextBidAmount);
			result.Add ("commissionfee", this.CommissionFee);
			result.Add ("vatamount", this.VatAmount);
			
			return SNDK.Convert.ToXmlDocument (result, this.GetType ().FullName.ToLower ());
		}
		#endregion
		
		#region Public Static Methods
		private static decimal CalculateNextBidAmount (decimal CurrentAmount)
		{
			decimal result = 0;
			decimal bidamount = CurrentAmount;
			
			if (bidamount >= 0 && bidamount < 2000)
			{
				result = 100;
			}
			else if (bidamount >= 2000 && bidamount < 5000)
			{
				result = 200;
			}
			else if (bidamount >= 5000)
			{
				result = 500;
			}
			
			return Math.Round (result + bidamount, 2);
		}

		public static void OnlineBid (Customer Customer, Item Item)
		{
			Bid bid = new Bid (Customer, Item, Item.NextBidAmount);
			bid.Save ();
		}

		public static void Bid (Customer Customer, Item Item)
		{
			Bid (Customer, Item, 0);
		}

		public static void Bid (Customer Customer, Item Item, decimal Amount)
		{
			if (Amount > 0 && Amount > Item.NextBidAmount)
			{
				// Create new AutoBud.
				AutoBid autobid = new AutoBid (Customer, Item, Amount);
				autobid.Save ();

//				Console.WriteLine ("[1]SENDMAIL: Autobid placed: "+ Amount);
				SorentoLib.Tools.Helpers.SendMail ("robot@york-auktion.dk", Customer.Email, "Autobud oprettet","Du har oprettet et autobud på effekt: "+ Item.Title +"\n\n"+"Autobud max: "+ Amount +" kr.\n\n");

				// If no other bids have been made, place the first one.
//				if (Item.BidAmount == 0)
//				{
//					decimal nextbidamount = Item.NextBidAmount;
//					Bid bid = new Bid (Customer, Item, nextbidamount);
//					bid.Save ();

//					Console.WriteLine ("[2]SENDMAIL: Autobid Bid placed: "+ nextbidamount);
//					SorentoLib.Tools.Helpers.SendMail ("robot@york-auktion.dk", Customer.Email, "Bud afgivet","Du har afgivet et autobud på effekt: "+ Item.Title +"\n\n"+"Bud sum: "+ nextbidamount +" kr.\n\n");
//				}

				SorentoLib.Services.Logging.LogDebug ("[DIDIUS.ITEM]: Autobid placed on item "+ Item.Id);
			}
			else if (Amount > 0 && Amount < Item.NextBidAmount)
			{
				Bid bid = new Bid (Customer, Item, Amount);
				bid.Save ();

//				Console.WriteLine ("[2]SENDMAIL: Bid placed: "+ Amount);
				SorentoLib.Tools.Helpers.SendMail ("robot@york-auktion.dk", Customer.Email, "Bud afgivet","Du har afgivet et bud på effekt: "+ Item.Title +"\n\n"+"Bud sum: "+ Amount +" kr.\n\n");
//				Console.WriteLine ("[3]SENDMAIL: Bid overbid: "+ Amount +" < "+ Item.NextBidAmount);
				SorentoLib.Tools.Helpers.SendMail ("robot@york-auktion.dk", Customer.Email, "Overbudt","Din bud sum på "+ Amount +" kr. på effekt: "+ Item.Title +" er blevet overbudt.\n\n");

				SorentoLib.Services.Logging.LogDebug ("[DIDIUS.ITEM]: Low bid placed on item "+ Item.Id);
			}
			else
			{
				decimal nextbidamount = Item.NextBidAmount;
				bool autobidplaced = false;

				// Place any AutoBids that equal the next bid amount.
				{
					List<AutoBid> autobids = AutoBid.List (Item);			
					foreach (AutoBid autobid in autobids)
					{
						if (autobid.Amount == nextbidamount)
						{
							Bid bid = new Bid (Customer.Load (autobid.CustomerId), Item, nextbidamount);
							bid.Save ();

							autobidplaced = true;

//							Console.WriteLine ("[4]SENDMAIL: Autobid Bid placed: "+ nextbidamount +" ("+ Customer.Load (autobid.CustomerId).Name +")");
							SorentoLib.Tools.Helpers.SendMail ("robot@york-auktion.dk", Customer.Load (autobid.CustomerId).Email, "Bud afgivet","Du har afgivet et autobud på effekt: "+ Item.Title +"\n\n"+"Bud sum: "+ nextbidamount +" kr.\n\n");
						}
					}
				}

				// Place single bid.
				{
					Bid bid = new Bid (Customer, Item, nextbidamount);
					bid.Save ();

//					Console.WriteLine ("[5]SENDMAIL: Bid placed: "+ nextbidamount);
					SorentoLib.Tools.Helpers.SendMail ("robot@york-auktion.dk", Customer.Email, "Bud afgivet","Du har afgivet et bud på effekt: "+ Item.Title +"\n\n"+"Bud sum: "+ nextbidamount +" kr.\n\n");

//					if (autobidplaced)
//					{
//						Console.WriteLine ("[7]SENDMAIL: Bid overbid: "+ nextbidamount +" < ???");
//						SorentoLib.Tools.Helpers.SendMail ("robot@york-auktion.dk", Customer.Email, "Overbudt","Din bud sum på "+ nextbidamount +" kr. på effekt: "+ Item.Title +" er blevet overbudt af et tidligere bud med samme sum.\n\n");
//					}
				}

				SorentoLib.Services.Logging.LogDebug ("[DIDIUS.ITEM]: High bid placed on item "+ Item.Id);
			}

			// Place AutoBids
			{
				decimal nextbidamount = Item.NextBidAmount;
				decimal currentbidamount = Item.BidAmount;
				List<AutoBid> autobids = AutoBid.List (Item);	




				// Place highest AutoBid.
				if (autobids.Count > 0)
				{
					AutoBid high = autobids[0];
					decimal low = currentbidamount;

					// See if we have more than one Autobid.
					if (autobids.Count > 1)
					{
						// Only AutoBids that are still above the current bid amount.
						if (autobids[1].Amount > currentbidamount)
						{
							low = autobids[1].Amount;
						}
					}
					
					if (high.Amount >= nextbidamount)
					{
						decimal bla = CalculateNextBidAmount (low);
//						Console.WriteLine (bla);
						if (bla > high.Amount)
						{
							bla = high.Amount;
						}

						Bid bid = new Bid (Customer.Load (high.CustomerId), Item, bla);
						bid.Save ();
//						Console.WriteLine ("[6]SENDMAIL: Autobid Bid placed: "+ bla +" ("+ Customer.Load (high.CustomerId).Name +")");
						SorentoLib.Tools.Helpers.SendMail ("robot@york-auktion.dk", Customer.Load (high.CustomerId).Email, "Bud afgivet","Du har afgivet et autobud på effekt: "+ Item.Title +"\n\n"+"Bud sum: "+ CalculateNextBidAmount (low) +" kr.\n\n");
					
						foreach (AutoBid autobid in autobids)
						{
							if (autobid.Id != high.Id && autobid.Amount == bla)
							{
								Bid bid2 = new Bid (Customer.Load (autobid.CustomerId), Item, bla);
								bid2.Save ();
//								Console.WriteLine ("[7]SENDMAIL: Autobid Bid placed: "+ bla +" ("+ Customer.Load (autobid.CustomerId).Name +")");
								SorentoLib.Tools.Helpers.SendMail ("robot@york-auktion.dk", Customer.Email, "Bud afgivet","Du har afgivet et autobud på effekt: "+ Item.Title +"\n\n"+"Bud sum: "+ nextbidamount +" kr.\n\n");

//								Console.WriteLine ("[9]SENDMAIL: Bid overbid by Autobid : "+ Amount +" < "+ bla +"("+ Customer.Load (autobid.CustomerId).Name +")");
								SorentoLib.Tools.Helpers.SendMail ("robot@york-auktion.dk", Customer.Load (autobid.CustomerId).Email, "Overbudt","Din bud sum på "+ Amount +" kr. på effekt: "+ Item.Title +" er blevet overbudt.\n\n");

							}
						}
					}
				}

				// Place any AutoBids that equal next bid amount.
				foreach (AutoBid autobid in autobids)
				{
					if (autobid.Amount > currentbidamount && autobid.Amount < Item.BidAmount)
					{
						Bid bid = new Bid (Customer.Load (autobid.CustomerId), Item, autobid.Amount);
						bid.Save ();
//						Console.WriteLine ("[8]SENDMAIL: Autobid Bid placed: "+ autobid.Amount +" ("+ Customer.Load (autobid.CustomerId).Name +")");
						SorentoLib.Tools.Helpers.SendMail ("robot@york-auktion.dk", Customer.Load (autobid.CustomerId).Email, "Bud afgivet","Du har afgivet et autobud på effekt: "+ Item.Title +"\n\n"+"Bud sum: "+ autobid.Amount +" kr.\n\n");

//						Console.WriteLine ("[9]SENDMAIL: Bid overbid: "+ Amount +" < "+ Item.NextBidAmount +"("+ Customer.Load (autobid.CustomerId).Name +")");
						SorentoLib.Tools.Helpers.SendMail ("robot@york-auktion.dk", Customer.Load (autobid.CustomerId).Email, "Overbudt","Din bud sum på "+ Amount +" kr. på effekt: "+ Item.Title +" er blevet overbudt.\n\n");
					}
				}
			}
		}

		public static Item Load (Guid Id)
		{
			Item result = null;
		
			try
			{
				Hashtable item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (SorentoLib.Services.Datastore.Get<XmlDocument> (DatastoreAisle, Id.ToString ()).SelectSingleNode ("(//didius.item)[1]")));
				result = new Item ();

				if (item.ContainsKey ("id"))
				{
					result._id = new Guid ((string)item["id"]);
				}
				else
				{
					// EXCEPTION: Excpetion.ItemFromXmlDocument
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

				if (item.ContainsKey ("catalogno"))
				{
					result._catalogno = int.Parse ((string)item["catalogno"]);
				}

				if (item.ContainsKey ("caseid"))
				{					
					result._caseid = new Guid ((string)item["caseid"]);
				}
				else
				{
					// EXCEPTION: Excpetion.ItemFromXmlDocument
					throw new Exception (string.Format (Strings.Exception.ItemFromXmlDocument, "CASEID"));
				}

				if (item.ContainsKey ("auctionid"))
				{					
					result._auctionid = new Guid ((string)item["auctionid"]);
				}

//				if (item.ContainsKey ("title"))
//				{					
//					result._title = (string)item["title"];
//				}

				if (item.ContainsKey ("description"))
				{					
					result._description = (string)item["description"];
				}

				if (item.ContainsKey ("vat"))
				{					
					result._vat = (bool)item["vat"];
				}

				if (item.ContainsKey ("minimumbid"))
				{					
					result._minimumbid = decimal.Parse ((string)item["minimumbid"]);
				}

				if (item.ContainsKey ("appraisal1"))
				{					
					result._appraisal1 = decimal.Parse ((string)item["appraisal1"]);
				}

				if (item.ContainsKey ("appraisal2"))
				{					
					result._appraisal2 = decimal.Parse ((string)item["appraisal2"]);
				}

				if (item.ContainsKey ("appraisal3"))
				{					
					result._appraisal3 = decimal.Parse ((string)item["appraisal3"]);
				}

				if (item.ContainsKey ("fields"))
				{					
					result._fields = (Hashtable)item["fields"];
				}

				if (item.ContainsKey ("invoiced"))
				{					
					result._invoiced = (bool)item["invoiced"];
				}

				if (item.ContainsKey ("approvedforinvoice"))
				{					
					result._approvedforinvoice = (bool)item["approvedforinvoice"];
				}

				if (item.ContainsKey ("settled"))
				{					
					result._settled = (bool)item["settled"];
				}

				if (item.ContainsKey ("pictureid"))
				{					
					result._pictureid = new Guid ((string)item["pictureid"]);
				}
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.ITEM", exception.Message));
				
				// EXCEPTION: Excpetion.ItemLoadGuid
				throw new Exception (string.Format (Strings.Exception.ItemLoadGuid, Id, exception.Message));
			}	
			
			return result;
		}

		public static void Delete (Item Item)
		{
			Delete (Item.Id);
		}

		public static void Delete (Guid Id)
		{
			// We can not delete if we have bids.
			if (Didius.Bid.List (Id).Count > 0)
			{
				// EXCEPTION: Exception.ItemDeleteHasBid
				throw new Exception (string.Format (Strings.Exception.ItemDeleteHasBid, Id.ToString ()));
			}

			try
			{
				SorentoLib.Services.Datastore.Delete (DatastoreAisle, Id.ToString ());
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.ITEM", exception.Message));
				
				// EXCEPTION: Exception.ItemDeleteGuid
				throw new Exception (string.Format (Strings.Exception.ItemDeleteGuid, Id.ToString (), exception.Message));
			}			
		}

		public static List<Item> List (Auction Auction, int Index, int Count)
		{
			List<Item> result = new List<Item> ();

			List<SorentoLib.Services.DatastoreItem> datastoreitems = SorentoLib.Services.Datastore.ListOfShelfsNew (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("auctionid", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Equal, Auction.Id));

			int counter = 0;

			List<Item> temp = new List<Item> ();

			foreach (SorentoLib.Services.DatastoreItem datastoreitem in datastoreitems)
			{
				try
				{



//					if (((dd*count) => counter) && ((dd*count) => counter))
//					{

//					}




			
					temp.Add (FromXmlDocument (datastoreitem.Get<XmlDocument> ()));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.ITEM", exception.Message));
					
					// LOG: LogDebug.ItemList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.ItemList, datastoreitem.Id));
				}

//				counter++;
			}

			temp.Sort (delegate (Item item1, Item item2) { return item1._catalogno.CompareTo (item2._catalogno); });

			foreach (Item item in temp)
			{
//				Console.WriteLine ((Index * Count) +" < "+ counter +"   "+ counter +"<"+ ((Index * Count)));

				if ((Index * Count) <= counter && counter < ((Index * Count) + Count))
				{
//					Item item = Item.FromXmlDocument (datastoreitem.Get<XmlDocument> ());
//					result.Add (FromXmlDocument (datastoreitem.Get<XmlDocument> ()));
					result.Add (item);

				}
				counter++;
			}




			return result;
		}

		public static List<Item> List (Auction Auction)
		{
			List<Item> result = new List<Item> ();

			foreach (SorentoLib.Services.DatastoreItem item in SorentoLib.Services.Datastore.ListOfShelfsNew (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("auctionid", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Equal, Auction.Id)))
			{
				try
				{
					result.Add (FromXmlDocument (item.Get<XmlDocument> ()));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.ITEM", exception.Message));
					
					// LOG: LogDebug.ItemList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.ItemList, item.Id));
				}
			}

			result.Sort (delegate (Item item1, Item item2) { return item1._catalogno.CompareTo (item2._catalogno); });

			return result;

//			List<Item> result = new List<Item> ();
//
//			foreach (Case c in Auction.Cases)
//			{
//				result.AddRange (Item.List (c));
//			}
//
//			result.Sort (delegate (Item item1, Item item2) { return item1._catalogno.CompareTo (item2._catalogno); });
//
//			return result;
		}
 
		public static List<Item> List (Case Case)
		{
			return List (Case.Id);
		}
		
		public static List<Item> List (Guid CaseId)
		{
			List<Item> result = new List<Item> ();
			
//			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("caseid", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Equal, CaseId)))
			foreach (SorentoLib.Services.DatastoreItem item in SorentoLib.Services.Datastore.ListOfShelfsNew (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("caseid", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Equal, CaseId)))
			{
				try
				{
//					result.Add (Load (new Guid (id)));
					result.Add (FromXmlDocument (item.Get<XmlDocument> ()));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.ITEM", exception.Message));
					
					// LOG: LogDebug.ItemList
//					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.ItemList, id));
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.ItemList, item.Id));
				}
			}

			result.Sort (delegate (Item item1, Item item2) { return item1._catalogno.CompareTo (item2._catalogno); });
			
			return result;
		}
		
		public static List<Item> List ()
		{
			List<Item> result = new List<Item> ();

			foreach (SorentoLib.Services.DatastoreItem item in SorentoLib.Services.Datastore.ListOfShelfsNew (DatastoreAisle))
			{
				try
				{
					result.Add (FromXmlDocument (item.Get<XmlDocument> ()));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.ITEM", exception.Message));
					
					// LOG: LogDebug.ItemList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.ItemList, item.Id));
				}
			}


			
			return result;
		}
		
		public static Item FromXmlDocument (XmlDocument xmlDocument)
		{
			Hashtable item;
			Item result = new Item ();
			
			try
			{
				item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (xmlDocument.SelectSingleNode ("(//didius.Item)[1]")));
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

			if (item.ContainsKey ("catalogno"))
			{
				result._catalogno = int.Parse ((string)item["catalogno"]);
			}
			else
			{
				throw new Exception (string.Format (Strings.Exception.ItemFromXmlDocument, "CATALOGNO"));
			}

			if (item.ContainsKey ("caseid"))
			{					
				result._caseid = new Guid ((string)item["caseid"]);
			}	
			else
			{
				throw new Exception (string.Format (Strings.Exception.ItemFromXmlDocument, "ITEMID"));
			}

			if (item.ContainsKey ("auctionid"))
			{					
				result._auctionid = new Guid ((string)item["auctionid"]);
			}

//			if (item.ContainsKey ("title"))
//			{					
//				result._title =(string)item["title"];
//			}	

			if (item.ContainsKey ("description"))
			{					
				result._description =(string)item["description"];
			}	

			if (item.ContainsKey ("vat"))
			{					
				result._vat = (bool)item["vat"];
			}
			
			if (item.ContainsKey ("minimumbid"))
			{					
				result._minimumbid = decimal.Parse ((string)item["minimumbid"]);
			}
			
			if (item.ContainsKey ("appraisal1"))
			{					
				result._appraisal1 = decimal.Parse ((string)item["appraisal1"]);
			}
			
			if (item.ContainsKey ("appraisal2"))
			{					
				result._appraisal2 = decimal.Parse ((string)item["appraisal2"]);
			}
			
			if (item.ContainsKey ("appraisal3"))
			{					
				result._appraisal3 = decimal.Parse ((string)item["appraisal3"]);
			}

			if (item.ContainsKey ("fields"))
			{					
				try
				{
					result._fields = (Hashtable)item["fields"];
				}
				catch
				{
					// This conversion will fail if its empty. No way of knowing if its a list or hash.
				}
			}	

			if (item.ContainsKey ("invoiced"))
			{					
				result._invoiced = (bool)item["invoiced"];
			}

			if (item.ContainsKey ("approvedforinvoice"))
			{					
				result._approvedforinvoice = (bool)item["approvedforinvoice"];
			}
			
			if (item.ContainsKey ("settled"))
			{					
				result._settled = (bool)item["settled"];
			}

			if (item.ContainsKey ("pictureid"))
			{					
				result._pictureid = new Guid ((string)item["pictureid"]);
			}
			
			return result;
		}
		#endregion

		#region Internal Static Methods
		internal static void ServiceGarbageCollector ()
		{
			List<Media> medias = SorentoLib.Media.List ("/media/didius/app");
			List<Item> items = List ();

			foreach (Media media in medias)
			{
				if ((SNDK.Date.CurrentDateTimeToTimestamp () - media.CreateTimestamp) > 86400)
				{
					bool delete = true;
					foreach (Item item in items)
					{
						if (item._pictureid != Guid.Empty)
						{
							if (media.Id == item._pictureid)
							{
								delete = false;
								break;
							}
						}
					}

					if (delete)
					{
						try
						{
							Media.Delete (media.Id);
						}
						catch (Exception exception)
						{
							// LOG: LogDebug.ExceptionUnknown
							SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.ITEM", exception.Message));
						}
					}
				}
			}

			// LOG: LogDebug.SessionGarbageCollector
			SorentoLib.Services.Logging.LogDebug (Strings.LogDebug.ItemGarbageCollector);
		}
		#endregion
	}
}

