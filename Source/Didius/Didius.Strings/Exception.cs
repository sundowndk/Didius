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
		public static string CustomerSave = "00110|Could not save Customer with id: {0}";
		public static string CustomerLoadGuid = "00120|Could not load Customer with id: {0}";
		public static string CustomerLoadUserId = "00121|Could not load Customer with userid: {0}";
		public static string CustomerDeleteGuid = "00130|Could not delete Customer with id: {0}";
		public static string CustomerDeleteHasCase = "00131|Can not delete Customer with id: {0}, since its related to a case.";
		public static string CustomerFromXmlDocument = "00140|Can not create Customer from XmlDocument, missing {0}";
		#endregion		

		#region CUSTOMERGROUP
		public static string CustomerGroupSave = "Could not save CustomerGroup with id: {0}";
		public static string CustomerGroupLoadGuid = "Could not load CustomerGroup with id: {0}";
		public static string CustomerGroupDeleteGuid = "Could not delete CustomerGroup with id: {0}";
		public static string CustomerGroupFromXmlDocument = "Cannot create CustomerGroup from XmlDocument, missing {0}";
		#endregion		

		#region CASE
		public static string CaseSave = "00310|Could not save Case with id: {0}";
		public static string CaseLoadGuid = "00320|Could not load Case with id: {0}";
		public static string CaseDeleteGuid = "00330|Could not delete Case with id: {0}";
		public static string CaseDeleteHasItem = "00331|Cannot delete Case with id: {0}, since its related to a item.";
		public static string CaseFromXmlDocument = "00340|Cannot create Case from XmlDocument, missing {0}";
		#endregion	

		#region ITEM
		public static string ItemSave = "00410|Could not save Item with id: {0}.\nInner Exception:\n {1}";
		public static string ItemLoadGuid = "00420|Could not load Item with id: {0}.\nInner Exception:\n {1}";
		public static string ItemDeleteGuid = "00430|Could not delete Item with id: {0}.\nInner Exception:\n {1}";
		public static string ItemDeleteHasBid = "00431|Can not delete Item with id: {0}, since its related to a bid.";
		public static string ItemFromXmlDocument = "00440|Cannot create Item from XmlDocument, missing {0}";
		#endregion

		#region AUCTION
		public static string AuctionSave = "00510|Could not save Auction with id: {0}";
		public static string AuctionLoadGuid = "00510|Could not load Auction with id: {0}.\nInner Exception:\n {1}";
		public static string AuctionDeleteGuid = "00510|Could not delete Auction with id: {0}";
		public static string AuctionDeleteHasCase = "00531|Can not delete Auction with id: {0}, since its related to a case.";
		public static string AuctionFromXmlDocument = "00510|Cannot create Auction from XmlDocument, missing {0}";
		#endregion

		public static string BidSave = "SRV00810|Could not save Bid with id: {0}";
		public static string BidLoadGuid = "SRV00820|Could not load Bid with id: {0}";
		public static string BidDeleteGuid = "SRV00830|Could not delete Bid with id: {0}";
		public static string BidFromXmlDocument = "SRV00840|Cannot create Bid from XmlDocument, missing {0}";
		public static string BidItemInvoiced = "SRV00880|Cannot append Bid on an Item that has been invoiced.";
		public static string BidItemSettled = "SRV00881|Cannot append Bid on an Item that has been settled.";

		public static string SettlementCaseSettled = "00601|Could not create Settlement, Case has allready been settled";
		public static string SettlementEmpty = "00602|Could not create Settlement, no Items to settle.";
		public static string SettlementSave = "00610|Could not save Settlement with id: {0}";
		public static string SettlementLoadGuid = "00610|Could not load Settlement with id: {0}.\nInner Exception:\n {1}";

		public static string InvoiceEmpty = "00702|Could not create Invoice, no Items to invoice.";
		public static string InvoiceSave = "00710|Could not save Invoice with id: {0}";
		public static string InvoiceLoadGuid = "00710|Could not load Invoice with id: {0}.\nInner Exception:\n {1}";

		#region EVENTLISTENER
		public static string EventListenerSave = "Could not save EventListener with id: {0}";
		public static string EventListenerLoadGuid = "Could not load EventListener with id: {0}";
		public static string EventListenerDeleteGuid = "Could not delete EventListener with id: {0}";
		#endregion


	}
}

