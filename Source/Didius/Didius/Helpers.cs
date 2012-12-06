using System;
using System.Collections.Generic;

namespace Didius
{
	public class Helpers
	{
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

		public static void VerificationEmail (SorentoLib.User User)
		{
//			SorentoLib.Tools.Helpers.SendMail ("test@test.dk", User.Email, "Bla bla bla bla");
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

