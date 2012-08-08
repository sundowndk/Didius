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
	public class Exception
	{
		#region CUSTOMER
		public static string CustomerSave = "00100|Could not save Customer with id: {0}";
		public static string CustomerLoadGuid = "00110|Could not load Customer with id: {0}";
		public static string CustomerDeleteGuid = "00120|Could not delete Customer with id: {0}";
		public static string CustomerDeleteHasCase = "00121|Can not delete Customer with id: {0}, since its related to a case.";
		public static string CustomerFromXmlDocument = "00130|Can not create Customer from XmlDocument, missing {0}";
		#endregion		

		#region CUSTOMERGROUP
		public static string CustomerGroupSave = "Could not save CustomerGroup with id: {0}";
		public static string CustomerGroupLoadGuid = "Could not load CustomerGroup with id: {0}";
		public static string CustomerGroupDeleteGuid = "Could not delete CustomerGroup with id: {0}";
		public static string CustomerGroupFromXmlDocument = "Cannot create CustomerGroup from XmlDocument, missing {0}";
		#endregion		

		#region CASE
		public static string CaseSave = "Could not save Case with id: {0}";
		public static string CaseLoadGuid = "Could not load Case with id: {0}";
		public static string CaseDeleteGuid = "Could not delete Case with id: {0}";
		public static string CAseDeleteInUse = "Cannot delete Case with id: {0}, since its related to another dataset.";
		public static string CaseFromXmlDocument = "Cannot create Case from XmlDocument, missing {0}";
		#endregion	

		#region ITEM
		public static string ItemSave = "00300|Could not save Item with id: {0}.\nInner Exception:\n {1}";
		public static string ItemLoadGuid = "00310|Could not load Item with id: {0}.\nInner Exception:\n {1}";
		public static string ItemDeleteGuid = "00320|Could not delete Item with id: {0}.\nInner Exception:\n {1}";
		public static string ItemDeleteHasBid = "00321|Can not delete Item with id: {0}, since its related to a bid.";
		public static string ItemFromXmlDocument = "00330|Cannot create Item from XmlDocument, missing {0}";
		#endregion

		#region AUCTION
		public static string AuctionSave = "Could not save Auction with id: {0}";
		public static string AuctionLoadGuid = "Could not load Auction with id: {0}.\nInner Exception:\n {1}";
		public static string AuctionDeleteGuid = "Could not delete Auction with id: {0}";
		public static string AuctionFromXmlDocument = "Cannot create Auction from XmlDocument, missing {0}";
		#endregion

		#region BID
		public static string BidSave = "Could not save Bid with id: {0}";
		public static string BidLoadGuid = "Could not load Bid with id: {0}";
		public static string BidDeleteGuid = "Could not delete Bid with id: {0}";
		public static string BidFromXmlDocument = "Cannot create Bid from XmlDocument, missing {0}";
		#endregion
	}
}

