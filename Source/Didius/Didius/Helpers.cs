using System;
using System.Text;
using System.Net;
using System.IO;

using System.Collections.Generic;

namespace Didius
{
	public class Helpers
	{

		public static int GetNumberOfItemsInAuction (Auction Auction)
		{
			return SorentoLib.Services.Datastore.ListOfShelfsNew (Item.DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("auctionid", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Equal, Auction.Id)).Count;

//			foreach ()
//			{
//				try
//				{
//					result.Add (FromXmlDocument (item.Get<XmlDocument> ()));
//				}
//				catch (Exception exception)
//				{
//					// LOG: LogDebug.ExceptionUnknown
//					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.ITEM", exception.Message));
//					
//					// LOG: LogDebug.ItemList
//					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.ItemList, item.Id));
//				}
//			}
//
//			result.Sort (delegate (Item item1, Item item2) { return item1._catalogno.CompareTo (item2._catalogno); });
//
//			return result;

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



		public static void BugReport (string Sender, string Description)
		{
			{
				string _from = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_sender);			
				string to = "rvp@qnax.net";		
				string subject = "Bug report";
				string body = "'"+ Sender + "' reported a bug:\n\n" + Description;
			
				SorentoLib.Tools.Helpers.SendMail (_from, to, subject, body, false);
			}

			try
			{
				string _from = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_sender);			
				string to = Sender;		
				string subject = "Bug report";
				string body = "'"+ Sender + "' reported a bug:\n\n" + Description;
			
				SorentoLib.Tools.Helpers.SendMail (_from, to, subject, body, false);
			}
			catch
			{
			}
		}

		public static void SendSMS (string Message)
		{
			List<string> Recipients = new List<string> ();
			string From = "York Auktion";

			foreach (Customer customer in Customer.List ())
			{
				if (customer.NewsSMS)
				{
					if (customer.Mobile != string.Empty)
					{
						Recipients.Add ("45" + customer.Mobile);
					}
				}
			}

			string url = "http://sms-a.qnax.net/";

			ASCIIEncoding encoding = new ASCIIEncoding ();

			string data = string.Empty;
			data += "username=yorkauktion";
			data += "&password=qwerty";

			foreach (string recipient in Recipients)
			{
				data += "&recipient="+ recipient;
			}

			data += "&sender="+ From;
			data += "&message="+ Message;


			WebRequest r = WebRequest.Create(url +"?"+ data);
			WebResponse resp = r.GetResponse();

//			byte[] bytedata = encoding.GetBytes(data);

//			HttpWebRequest webrequest = (HttpWebRequest)WebRequest.Create (url+data);
//			webrequest.
//			webrequest.Method = "GET";

//			Stream stream = webrequest.GetRequestStream ();
//			stream.Close ();

//			webrequest.ContentType = "application/x-www-form-urlencoded";
//			webrequest.ContentLength = bytedata.Length;

//			using (Stream stream = webrequest.GetRequestStream ())
//			{
//				stream.Write (bytedata, 0, bytedata.Length);
//			}
		}


		public static void MailItemWon (Item Item)
		{
//			if (Item.CurrentBidId  > 0) {
			if (Item.CurrentBidId != Guid.Empty)
			{
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

		public static decimal CalculateBuyerCommissionFee (Item Item)
		{
			decimal result = 0;

			if (Item.BidAmount > 0)
			{
				result = ((Item.BidAmount * SorentoLib.Services.Settings.Get<Decimal> (Enums.SettingsKey.didius_value_buyer_commission_percentage) / 100));
				if (result < SorentoLib.Services.Settings.Get<decimal> (Enums.SettingsKey.didius_value_buyer_commission_minimum))
				{
					result = SorentoLib.Services.Settings.Get<decimal> (Enums.SettingsKey.didius_value_buyer_commission_minimum);
				}
			}

			return result ;
		}

		public static decimal CalculateSellerCommissionFee (Item Item)
		{
			decimal result = 0;

			Case case_ = Case.Load (Item.CaseId);

			if (case_.CommisionFeePercentage != 0)
			{
				result = ((Item.BidAmount * case_.CommisionFeePercentage) / 100);
			}
			else
			{
				result = ((Item.BidAmount * SorentoLib.Services.Settings.Get<Decimal> (Enums.SettingsKey.didius_value_seller_commission_percentage) / 100));
			}

			if (case_.CommisionFeeMinimum != 0)
			{
				if (result < case_.CommisionFeeMinimum)
				{
					result = case_.CommisionFeeMinimum;
				}
			}
			else
			{
				if (result < SorentoLib.Services.Settings.Get<decimal> (Enums.SettingsKey.didius_value_seller_commission_minimum))
				{
					result = SorentoLib.Services.Settings.Get<decimal> (Enums.SettingsKey.didius_value_seller_commission_minimum);
				}
			}

			return result;
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

		public static void MailSettlement (Settlement Settlement, string PdfFilename)
		{		
			Customer customer = Customer.Load (Settlement.CustomerId);
			if (customer.Email != string.Empty)
			{
			
				string _from = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_sender);
			
				string to = customer.Email;

//			string to = "rasmus@akvaservice.dk";
			
				string subject = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_template_settlement_subject);
				subject = ReplacePlaceholders (customer, subject);
				subject = ReplacePlaceholders (Settlement, subject);
			
				string body = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_template_settlement_body);
				body = ReplacePlaceholders (customer, body);
				body = ReplacePlaceholders (Settlement, body);
			
				bool isbodyhtml = SorentoLib.Services.Settings.Get<bool> (Enums.SettingsKey.didius_email_template_settlement_isbodyhtml);
			
				List<SorentoLib.Tools.Helpers.SendMailAttatchment> attatchments = new List<SorentoLib.Tools.Helpers.SendMailAttatchment> ();
				attatchments.Add (new SorentoLib.Tools.Helpers.SendMailAttatchment (SNDK.IO.FileToByteArray (PdfFilename), "afregning" + Settlement.No + ".pdf", SNDK.IO.GetMimeType (PdfFilename)));
			
				SorentoLib.Tools.Helpers.SendMail (_from, to, subject, body, isbodyhtml, attatchments);
			}
		}


		public static void MailCreditnote (Creditnote Creditnote, string PdfFilename)
		{
			Customer customer = Customer.Load (Creditnote.CustomerId);
			
			string _from = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_sender);
			
			string to = customer.Email;
//			string to = "rasmus@akvaservice.dk";
			
			string subject = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_template_creditnote_subject);
			subject = ReplacePlaceholders (customer, subject);
			subject = ReplacePlaceholders (Creditnote, subject);
			
			string body = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_template_creditnote_body);
			body = ReplacePlaceholders (customer, body);
			body = ReplacePlaceholders (Creditnote, body);
			
			bool isbodyhtml = SorentoLib.Services.Settings.Get<bool> (Enums.SettingsKey.didius_email_template_creditnote_isbodyhtml);
			
			List<SorentoLib.Tools.Helpers.SendMailAttatchment> attatchments = new List<SorentoLib.Tools.Helpers.SendMailAttatchment> ();
			attatchments.Add (new SorentoLib.Tools.Helpers.SendMailAttatchment (SNDK.IO.FileToByteArray (PdfFilename), "kreditnota"+ Creditnote.No +".pdf", SNDK.IO.GetMimeType (PdfFilename)));
			
			SorentoLib.Tools.Helpers.SendMail (_from, to, subject, body, isbodyhtml, attatchments);
		}

		public static void MailSalesAgreement (Customer Customer, string PdfFilename)
		{		
			string _from = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_sender);
			
			string to = Customer.Email;
//			string to = "rasmus@akvaservice.dk";

			string subject = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_template_salesagreement_subject);
			subject = ReplacePlaceholders (Customer, subject);
			
			string body = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_template_salesagreement_body);
			body = ReplacePlaceholders (Customer, body);
			
			bool isbodyhtml = SorentoLib.Services.Settings.Get<bool> (Enums.SettingsKey.didius_email_template_salesagreement_isbodyhtml);
			
			List<SorentoLib.Tools.Helpers.SendMailAttatchment> attatchments = new List<SorentoLib.Tools.Helpers.SendMailAttatchment> ();
			attatchments.Add (new SorentoLib.Tools.Helpers.SendMailAttatchment (SNDK.IO.FileToByteArray (PdfFilename), "salgsaftale.pdf", SNDK.IO.GetMimeType (PdfFilename)));
			
			SorentoLib.Tools.Helpers.SendMail (_from, to, subject, body, isbodyhtml, attatchments);
		}

		public static void MailSettlement (Customer Customer, string PdfFilename)
		{		
			string _from = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_sender);
			
			string to = Customer.Email;
//			string to = "rasmus@akvaservice.dk";
			
			string subject = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_template_settlement_subject);
			subject = ReplacePlaceholders (Customer, subject);
			
			string body = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_template_settlement_body);
			body = ReplacePlaceholders (Customer, body);
			
			bool isbodyhtml = SorentoLib.Services.Settings.Get<bool> (Enums.SettingsKey.didius_email_template_settlement_isbodyhtml);
			
			List<SorentoLib.Tools.Helpers.SendMailAttatchment> attatchments = new List<SorentoLib.Tools.Helpers.SendMailAttatchment> ();
			attatchments.Add (new SorentoLib.Tools.Helpers.SendMailAttatchment (SNDK.IO.FileToByteArray (PdfFilename), "afregning.pdf", SNDK.IO.GetMimeType (PdfFilename)));
			
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
			// AUCTION
			else if (Source.GetType () == typeof (Didius.Auction))
			{
				result = result.Replace ("%%AUCTIONNO%%", ((Didius.Auction)Source).No);
				result = result.Replace ("%%AUCTIONTITLE%%", ((Didius.Auction)Source).Title);
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
			// CREDITNOTE
			if (Source.GetType () == typeof (Didius.Creditnote))
			{
				result = result.Replace ("%%CREDITNOTENO%%", ((Didius.Creditnote)Source).No.ToString ());
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

			string subject = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_template_profile_confirm_subject);
			string body = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_template_profile_confirm_body);

			body = body.Replace ("%%NAME%%", customer.Name);
			body = body.Replace ("%%VERIFICATIONCODE%%", customer.User.Id.ToString ());

			SorentoLib.Tools.Helpers.SendMail ("robot@york-auktion.dk", customer.Email, subject, body, SorentoLib.Services.Settings.Get<bool> (Enums.SettingsKey.didius_email_template_profile_confirm_isbodyhtml));

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

					Customer customer = Customer.Load (user);			

					string subject = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_template_profile_confirmed_subject);
					string body = SorentoLib.Services.Settings.Get<string> (Enums.SettingsKey.didius_email_template_profile_confirmed_body);

					body = body.Replace ("%%NAME%%", customer.Name);
					body = body.Replace ("%%VERIFICATIONCODE%%", customer.User.Id.ToString ());

					SorentoLib.Tools.Helpers.SendMail ("robot@york-auktion.dk", customer.Email, subject, body, SorentoLib.Services.Settings.Get<bool> (Enums.SettingsKey.didius_email_template_profile_confirmed_isbodyhtml));

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

		public static int NewCatalogNo (Auction Auction)
		{
			return NewCatalogNo (Auction, 1);
		}

		public static int NewCatalogNo (Auction Auction, int MinCatalogNo)
		{
			int result = MinCatalogNo;



			List<int> used = new List<int> ();

			foreach (Case c in Case.List (Auction))
			{
				foreach (Item i in Item.List (c))
				{

//					Console.WriteLine (i.CatalogNo);
					used.Add (i.CatalogNo);
				}
			}

			//used.Sort (delegate (int int1, int int2) { return int1.CompareTo (int2); });

			Console.WriteLine (used.Contains (MinCatalogNo));

			while (used.Contains (result))
			{
				result++;
			}

			Console.WriteLine ("BLALB"+ result);

//			{
//				if (!used.Find (19));
//				{
//					Console.WriteLine ("FOUND");
//					result = MinCatalogNo;
//					break;
//				}

//				MinCatalogNo++;
//			}

//			if (used.Count > 0)
//			{							
//				for (int i = MinCatalogNo; i <= (used.Count+1); i++) 
//				{
//					if (!used.Contains (i))
//					{
//						result = i;
//						break;
//					}
//				}
//			}		

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

