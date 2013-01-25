// 
//  Exception.cs
//  
//  Author:
//      Rasmus Pedersen (rvp@qnax.net)
// 
//  Copyright (c) 2012 QNAX ApS
// 

using System;

namespace Didius.Strings
{
	public class LogDebug
	{
		#region CUSTOMER
		public static string CustomerList = "[DIDIUS.CUSTOMER]: Cannot load Customer with id: {0}, will be excluded from list.";
		#endregion		

		#region CUSTOMERGROUP
		public static string CustomerGroupList = "[DIDIUS.CUSTOMERGROUP]: Cannot load CustomerGroup with id: {0}, will be excluded from list.";
		#endregion		
		
		#region CASE
		public static string CaseList = "[DIDIUS.CASE]: Cannot load Case with id: {0}, will be excluded from list.";
		#endregion		

		#region ITEM
		public static string ItemList = "[DIDIUS.ITEM]: Cannot load Item with id: {0}, will be excluded from list.";

		public static string ItemGarbageCollector = "[DIDIUS.ITEM]: Garbage collected for item.";
		#endregion

		#region AUCTION
		public static string AuctionList = "[DIDIUS.AUCTION]: Cannot load Auction with id: {0}, will be excluded from list.";
		#endregion

		#region AUCTION
		public static string BidList = "[DIDIUS.BID]: Cannot load Bid with id: {0}, will be excluded from list.";
		#endregion

		#region NEWSLETTER
		public static string NewsletterList = "[DIDIUS.NEWSLETTER]: Cannot load Newsletter with id: {0}, will be excluded from list.";
		#endregion

		public static string AutoBidList = "[DIDIUS.AUTOBID]: Cannot load AutoBid with id: {0}, will be excluded from list.";


		public static string SettlementList = "[DIDIUS.SETTLEMENT]: Cannot load Settlement with id: {0}, will be excluded from list.";	

		public static string InvoiceList = "[DIDIUS.INVOICE]: Cannot load Invoice with id: {0}, will be excluded from list.";	

		public static string CreditnoteList = "[DIDIUS.CREDITNOTE]: Cannot load Creditnote with id: {0}, will be excluded from list.";	

	}
}

