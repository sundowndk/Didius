using System;

namespace Didius
{
	public class Helpers
	{
		public static string NewNo ()
		{
			return (DateTime.Now.Second.ToString () + DateTime.Now.Day.ToString () + DateTime.Now.Month.ToString () + DateTime.Now.Hour.ToString () + DateTime.Now.Minute.ToString () + DateTime.Now.Millisecond.ToString ()).PadLeft (10, '0');
		}
	}
}

