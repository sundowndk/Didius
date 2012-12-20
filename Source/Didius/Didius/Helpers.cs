using System;
using System.Collections.Generic;

namespace Didius
{
	public class Helpers
	{
		public static List<Auction> GetAuctionsCustomerBidOn (Customer Customer)
		{
			List<Auction> result = new List<Auction> ();
			List<Guid> auctionids = new List<Guid> ();

			foreach (Bid bid in Bid.List (Customer))
			{
				Guid auctionid = Item.Load (bid.ItemId).Case.AuctionId;
				
				if (!auctionids.Contains (auctionid))
				{
					auctionids.Add (auctionid);
				}								
			}

			foreach (Guid id in auctionids)
			{
				result.Add (Auction.Load (id));
			}
			
			return result;
		}

		public static List<Item> GetItemsCustomerBidOn (Customer Customer, Auction Auction)
		{
			List<Item> result = new List<Item> ();
			List<Guid> itemids = new List<Guid> ();

			foreach (Bid bid in Bid.List (Customer))
			{
				if (!itemids.Contains (bid.ItemId))
				{
					Item item = Item.Load (bid.ItemId);
					if (item.Case.AuctionId == Auction.Id)
					{
						itemids.Add (bid.ItemId);
						result.Add (item);
					}
				}
			}

			return result;
		}

		public static Bid GetCustomersHighBidOnItem (Customer Customer, Item Item)
		{
			Bid result = null;

			foreach (Bid bid in Bid.List (Item))
			{
				if (bid.CustomerId == Customer.Id)
				{
					result = bid;
					break;
				}
			}

			return result;
		}


		public static Customer CreateProfile (string Name, string Email)
		{
			Customer customer = new Customer ();
			customer.Name = Name;
			customer.Email = Email;
			customer.Status = Didius.Enums.CustomerStatus.Disabled;
			customer.Save ();

			SorentoLib.User user = SorentoLib.User.Load (customer.UserId);
			user.Status = SorentoLib.Enums.UserStatus.NotVerified;
			user.Save ();

			SorentoLib.Tools.Helpers.SendMail ("robot@york-auktion.dk", customer.Email, "Bekræftigelse af email adresse på york-auktion.dk","Her er din bekræftigelses kode: "+ customer.User.Id +"\n\n" );

			return customer;
		}

		public static bool VerifiyProfile (Guid UserId)
		{
			bool result = false;

			try
			{
				SorentoLib.User user = SorentoLib.User.Load (UserId);

				if (user.Status == SorentoLib.Enums.UserStatus.NotVerified)
				{
					user.Status = SorentoLib.Enums.UserStatus.Enabled;
					user.Save ();

					SendNewPassword (UserId);

					result = true;
				}
			}
			catch
			{
			}

			return result;
		}

		public static bool SendNewPassword (Guid UserId)
		{
			bool result = false;

			try
			{
				string password = SorentoLib.Tools.Security.RandomPassword ();

				SorentoLib.User user = SorentoLib.User.Load (UserId);
				user.Password = password;
				user.Save ();



				SorentoLib.Tools.Helpers.SendMail ("robot@york-auktion.dk", user.Email, "Adgangskode til york-auktion.dk","Her er din nye adgangskode til york-auktion.dk \n\nBrugernavn: "+ user.Username +"\nAdgangskode: "+ password);
				result = true;
			}
			catch
			{
			}

			return result;
		}

		public static void SendConsignment (string Content)
		{
			SorentoLib.Tools.Helpers.SendMail ("robot@york-auktion.dk", "jm@york-auktion.dk", "Indleveringsaftale", Content, true);
		}

		public static void VerificationEmail (SorentoLib.User User)
		{
//			SorentoLib.Tools.Helpers.SendMail ("test@test.dk", User.Email, "Bla bla bla bla");
		}

		public static void MailFileToCustomer (Customer Customer, string Filename, string EmailTemplate)
		{
			List<SorentoLib.Tools.Helpers.SendMailAttatchment> attatchments = new List<SorentoLib.Tools.Helpers.SendMailAttatchment> ();
			attatchments.Add (new SorentoLib.Tools.Helpers.SendMailAttatchment (SNDK.IO.FileToByteArray (Filename), "salgsaftale.pdf", SNDK.IO.GetMimeType (Filename)));
			
			SorentoLib.Tools.Helpers.SendMail ("robot@york-auktion.dk", Customer.Email, "Salgsaftale", "Salgs aftale er vedhæftet.\n\nMed venlig hilsen\nYork Auktion ApS", false, attatchments);
		}

		public static string NewNo ()
		{
			return (DateTime.Now.Second.ToString () + DateTime.Now.Day.ToString () + DateTime.Now.Month.ToString () + DateTime.Now.Hour.ToString () + DateTime.Now.Minute.ToString ()).PadRight (10, '0');
		}

		public static int NewCatelogNo (Auction Auction)
		{
			int result = 1;

			List<int> used = new List<int> ();

			foreach (Case c in Case.List (Auction))
			{
				foreach (Item i in Item.List (c))
				{
					used.Add (i.CatalogNo);
				}
			}

			//used.Sort (delegate (int int1, int int2) { return int1.CompareTo (int2); });

			if (used.Count > 0)
			{							
				for (int i = 1; i <= (used.Count+1); i++) 
				{
					if (!used.Contains (i))
					{
						result = i;
						break;
					}
				}
			}		

			return result;
		}

		public static bool IsCatalogNoTaken (Auction Auction, int CatalogNo)
		{
			bool result = false;

			foreach (Case c in Case.List (Auction))
			{
				foreach (Item i in Item.List (c))
				{
					if (i.CatalogNo == CatalogNo)
					{
						result = true;
						break;
					}
				}

				if (result)
				{
					break;
				}
			}

			return result;
		}
	}
}

