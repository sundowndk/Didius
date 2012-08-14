using System;
using System.Collections.Generic;

namespace Didius
{
	public class Helpers
	{
		public static string NewNo ()
		{
			return (DateTime.Now.Second.ToString () + DateTime.Now.Day.ToString () + DateTime.Now.Month.ToString () + DateTime.Now.Hour.ToString () + DateTime.Now.Minute.ToString () + DateTime.Now.Millisecond.ToString ()).PadLeft (10, '0');
		}

		public static int NewCatelogNo (Auction Auction)
		{
			int result = 0;

			List<int> used = new List<int> ();

			foreach (Case c in Case.List (Auction))
			{
				foreach (Item i in Item.List (c))
				{
					used.Add (i.CatalogNo);
				}
			}

			if (used.Count > 0)
			{
				used.Sort (delegate (int int1, int int2) { return int1.CompareTo (int2); });

				for (int i = 0; i < used.Count; i++) 
				{
					if ((i + 1) < used.Count)
					{
						if ((used[i + 1]) != (used[i] + 1))
						{
							result = used[i];
							break;
						}
					}
					else
					{
						result = used[used.Count - 1];
					}
				}
			}

			result++;

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

