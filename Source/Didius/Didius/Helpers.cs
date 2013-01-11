using System;
using System.Collections.Generic;

namespace Didius
{
	public class Helpers
	{
		public static void BugReport (string Sender, string Description)
		{
			string _from = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_sender);			
			string to = "rasmus@akvaservice.dk";		
			string subject = "Bug report";
			string body = Sender +" reported a bug:\n\n"+ Description;
			
			SorentoLib.Tools.Helpers.SendMail (_from, to, subject, body, false);
		}

		public static void MailItemWon (Item Item)
		{
			if (Item.BidAmount > 0) {
				Bid bid = Item.CurrentBid;
				Customer customer = Customer.Load (bid.CustomerId);
			
				string _from = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_sender);

				string to = customer.Email;
//				string to = "rasmus@akvaservice.dk";

				string subject = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_template_itemwon_subject);
				subject = ReplacePlaceholders (customer, subject);
				subject = ReplacePlaceholders (Item, subject);

				string body = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_template_itemwon_body);
				body = ReplacePlaceholders (customer, body);
				body = ReplacePlaceholders (Item, body);
				body = ReplacePlaceholders (bid, body);

				bool isbodyhtml = SorentoLib.Services.Settings.Get<bool> (Enums.SettingsKey.didius_email_template_itemwon_isbodyhtml);

				SorentoLib.Tools.Helpers.SendMail (_from, to, subject, body, isbodyhtml);
			}
			else
			{

			}
		}

		public static void MailInvoice (Invoice Invoice, string PdfFilename)
		{
			Customer customer = Customer.Load (Invoice.CustomerId);
			
			string _from = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_sender);
			
			string to = customer.Email;
//			string to = "rasmus@akvaservice.dk";
			
			string subject = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_template_invoice_subject);
			subject = ReplacePlaceholders (customer, subject);
			subject = ReplacePlaceholders (Invoice, subject);
			
			string body = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_template_invoice_body);
			body = ReplacePlaceholders (customer, body);
			body = ReplacePlaceholders (Invoice, body);
			
			bool isbodyhtml = SorentoLib.Services.Settings.Get<bool> (Enums.SettingsKey.didius_email_template_invoice_isbodyhtml);
			
			List<SorentoLib.Tools.Helpers.SendMailAttatchment> attatchments = new List<SorentoLib.Tools.Helpers.SendMailAttatchment> ();
			attatchments.Add (new SorentoLib.Tools.Helpers.SendMailAttatchment (SNDK.IO.FileToByteArray (PdfFilename), "faktura"+ Invoice.No +".pdf", SNDK.IO.GetMimeType (PdfFilename)));
			
			SorentoLib.Tools.Helpers.SendMail (_from, to, subject, body, isbodyhtml, attatchments);
		}

		public static void MailSalesAgreement (Customer Customer, string PdfFilename)
		{		
			string _from = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_sender);
			
<<<<<<< HEAD
//			string to = Customer.Email;
			string to = "rasmus@akvaservice.dk";
=======
						string to = Customer.Email;
//			string to = "rasmus@akvaservice.dk";
>>>>>>> 232571e1b2d9ea3fffc617b529066aa28deb9a0c
			
			string subject = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_template_salesagreement_subject);
			subject = ReplacePlaceholders (Customer, subject);
			
			string body = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_template_salesagreement_body);
			body = ReplacePlaceholders (Customer, body);
			
			bool isbodyhtml = SorentoLib.Services.Settings.Get<bool> (Enums.SettingsKey.didius_email_template_salesagreement_isbodyhtml);
			
			List<SorentoLib.Tools.Helpers.SendMailAttatchment> attatchments = new List<SorentoLib.Tools.Helpers.SendMailAttatchment> ();
			attatchments.Add (new SorentoLib.Tools.Helpers.SendMailAttatchment (SNDK.IO.FileToByteArray (PdfFilename), "salgsaftale.pdf", SNDK.IO.GetMimeType (PdfFilename)));
			
			SorentoLib.Tools.Helpers.SendMail (_from, to, subject, body, isbodyhtml, attatchments);
		}

		public static string ReplacePlaceholders (object Source, string String)
		{
			string result = String;

			// CUSTOMER
			if (Source.GetType () == typeof (Didius.Customer))
			{
				result = result.Replace ("%%CUSTOMERNO%%", ((Didius.Customer)Source).No);
				result = result.Replace ("%%CUSTOMERNAME%%", ((Didius.Customer)Source).Name);
			}
			// ITEM
			else if (Source.GetType () == typeof (Didius.Item))
			{
				result = result.Replace ("%%ITEMNO%%", ((Didius.Item)Source).No);
				result = result.Replace ("%%ITEMCATALOGNO%%", ((Didius.Item)Source).CatalogNo.ToString ());
				result = result.Replace ("%%ITEMTITLE%%", ((Didius.Item)Source).Title);
			}
			// BID
			else if (Source.GetType () == typeof (Didius.Bid))
			{
				result = result.Replace ("%%BIDAMOUNT%%", ((Didius.Bid)Source).Amount.ToString ());
			}
			// INVOICE
			if (Source.GetType () == typeof (Didius.Invoice))
			{
				result = result.Replace ("%%INVOICENO%%", ((Didius.Invoice)Source).No.ToString ());
			}

			return result;
		}



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
			
			//SorentoLib.Tools.Helpers.SendMail ("robot@york-auktion.dk", Customer.Email, "Salgsaftale", "Salgs aftale er vedhæftet.\n\nMed venlig hilsen\nYork Auktion ApS", false, attatchments);
			SorentoLib.Tools.Helpers.SendMail ("robot@york-auktion.dk", "rasmus@akvaservice.dk", "Salgsaftale", "Salgs aftale er vedhæftet.\n\nMed venlig hilsen\nYork Auktion ApS", false, attatchments);
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

