//
// Ajax.cs
//

using System;
using System.Collections.Generic;
using System.Collections;
using System.Xml;

using SorentoLib;

namespace Didius.Addin
{
	public class Ajax : SorentoLib.Addins.IAjaxBaseClass, SorentoLib.Addins.IAjax		
	{
		#region Constructor
		public Ajax ()
		{
			base.NameSpaces.Add ("didius");
		}
		#endregion
		
		#region Public Methods
		new public SorentoLib.Ajax.Respons Process (SorentoLib.Session Session, string Fullname, string Method)
		{
			SorentoLib.Ajax.Respons result = new SorentoLib.Ajax.Respons ();
			SorentoLib.Ajax.Request request = new SorentoLib.Ajax.Request (Session.Request.QueryJar.Get ("data").Value);
			
			switch (Fullname.ToLower ())
			{
				#region Didius.Customer
				case "didius.customer":
				{	
					switch (Method.ToLower ())
					{						
						case "create":
						{
							result.Add (new Customer ());
							break;
						}		

						case "load":
						{
							if (request.ContainsXPath ("id"))
							{
								result.Add (Customer.Load (request.getValue<Guid>("id")));
							}
							else if (request.ContainsXPath ("userid"))
							{
								result.Add (Customer.Load (SorentoLib.User.Load (request.getValue<Guid>("userid"))));
							}

							break;
						}

						case "save":
						{
							request.getValue<Customer> ("didius.customer").Save ();
							break;
						}

						case "destroy":
						{
							Customer.Delete (request.getValue<Guid> ("id"));
							break;
						}

						case "list":
						{
							if (request.ContainsXPath ("customergroupid"))
							{
								result.Add (Customer.List (request.getValue<Guid> ("customergroupid")));
							}
							else
							{
								result.Add (Customer.List ());
							}
							break;
						}
					}
					break;
				}
				#endregion	

				#region Didius.CustomerGroup
				case "didius.customergroup":
				{	
					switch (Method.ToLower ())
					{						
						case "create":
						{
							result.Add (new CustomerGroup ());
							break;
						}		
							
						case "load":
						{
							result.Add (CustomerGroup.Load (request.getValue<Guid>("id")));
							break;
						}
							
						case "save":
						{
							request.getValue<CustomerGroup> ("didius.customergroup").Save ();
							break;
						}
							
						case "destroy":
						{
							CustomerGroup.Delete (request.getValue<Guid> ("id"));
							break;
						}
							
						case "list":
						{
							result.Add (CustomerGroup.List ());
							break;
						}
					}
					break;
				}
				#endregion	

				#region Didius.Case
				case "didius.case":
				{	
					switch (Method.ToLower ())
					{						
						case "create":
						{
							result.Add (new Case (Auction.Load (request.getValue<Guid>("auctionid")), Customer.Load (request.getValue<Guid>("customerid"))));
							break;
						}		
							
						case "load":
						{
							result.Add (Case.Load (request.getValue<Guid>("id")));
							break;
						}
							
						case "save":
						{
							request.getValue<Case> ("didius.case").Save ();
							break;
						}
							
						case "destroy":
						{
							Case.Delete (request.getValue<Guid> ("id"));
							break;
						}
							
						case "list":
						{
							if (request.ContainsXPath ("customerid"))
							{
								result.Add (Case.List (request.getValue<Guid> ("customerid")));
							}
							else if (request.ContainsXPath ("auctionid"))
							{
								result.Add (Case.List (request.getValue<Guid> ("auctionid")));
							}
							else
							{
								result.Add (Case.List ());
							}
							break;
						}
					}
					break;
				}
				#endregion	

				#region Didius.Item
				case "didius.item":
				{	
					switch (Method.ToLower ())
					{						
						case "create":
						{
							result.Add (new Item (Case.Load (request.getValue<Guid>("caseid"))));
							break;
						}		
							
						case "load":
						{
							result.Add (Item.Load (request.getValue<Guid>("id")));
							break;
						}
							
						case "save":
						{
							result.Add (request.getValue<Item> ("didius.item").Save ());
							break;
						}
							
						case "destroy":
						{
							Item.Delete (request.getValue<Guid> ("id"));
							break;
						}

						case "bid":
						{
							decimal amount = 0;
							if (request.ContainsXPath ("amount"))
							{
								amount = decimal.Parse (request.getValue<string> ("amount"));
							}

							if (Session.User != null)
							{
								Item.Bid (Customer.Load (Session.User), Item.Load (request.getValue<Guid> ("itemid")), amount);
							}
							else
							{
								Item.Bid (Customer.Load (new Guid ("be829dbb-1f7b-47ca-85ae-6874541b74f8")), Item.Load (request.getValue<Guid> ("itemid")), amount);
							}


							break;
						}
							
						case "list":
						{
							if (request.ContainsXPath ("auctionid"))
							{
								result.Add (Item.List (Auction.Load (request.getValue<Guid> ("auctionid"))));
							}
							else if (request.ContainsXPath ("caseid"))
							{
								result.Add (Item.List (Case.Load (request.getValue<Guid> ("caseid"))));
							}
							else
							{
								result.Add (Item.List ());
							}
							break;
						}
					}
					break;
				}
				#endregion

				#region Didius.Auction
				case "didius.auction":
				{	
					switch (Method.ToLower ())
					{						
						case "create":
						{
							result.Add (new Auction ());
							break;
						}		
							
						case "load":
						{
							result.Add (Auction.Load (request.getValue<Guid>("id")));
							break;
						}
							
						case "save":
						{
							request.getValue<Auction> ("didius.auction").Save ();
							break;
						}
							
						case "destroy":
						{
							Auction.Delete (request.getValue<Guid> ("id"));
							break;
						}
							
						case "list":
						{
							result.Add (Auction.List ());
							break;
						}
					}
					break;
				}
				#endregion

				#region Didius.Bid
				case "didius.bid":
				{	
					switch (Method.ToLower ())
					{						
						case "create":
						{
							result.Add (new Bid (Customer.Load (request.getValue<Guid> ("customerid")), Item.Load (request.getValue<Guid> ("itemid")), decimal.Parse (request.getValue<string> ("amount"))));
							break;
						}		
							
						case "load":
						{
							result.Add (Bid.Load (request.getValue<Guid>("id")));
							break;
						}
							
						case "save":
						{
							request.getValue<Bid> ("didius.bid").Save ();
							break;
						}
							
						case "destroy":
						{
							Bid.Delete (request.getValue<Guid> ("id"));
							break;
						}
							
						case "list":
						{
							if (request.ContainsXPath ("itemid"))
							{
								result.Add (Bid.List (request.getValue<Guid> ("itemid")));
							}
							else if (request.ContainsXPath ("customerid"))
							{
								result.Add (Bid.List (Customer.Load (request.getValue<Guid> ("customerid"))));
							}
							else
							{
								result.Add (Bid.List ());
							}
							break;
						}
					}
					break;
				}
				#endregion

				#region Didius.AutoBid
				case "didius.autobid":
				{	
					switch (Method.ToLower ())
					{						
						case "load":
						{
							result.Add (AutoBid.Load (request.getValue<Guid>("id")));
							break;
						}
						case "list":
						{
							if (request.ContainsXPath ("itemid"))
							{
								result.Add (AutoBid.List (request.getValue<Guid> ("itemid")));
							}
							else if (request.ContainsXPath ("customerid"))
							{
								result.Add (AutoBid.List (Customer.Load (request.getValue<Guid> ("customerid"))));
							}
							else
							{
								result.Add (AutoBid.List ());
							}
							break;
						}
					}
					break;
				}
				#endregion

				#region Didius.Settlement
				case "didius.settlement":
				{	
					switch (Method.ToLower ())
					{						
						case "create":
						{
							bool simulate = false;
							if (request.ContainsXPath ("simulate"))
							{
								simulate = request.getValue<bool> ("simulate");
							}

							result.Add (Settlement.Create (Case.Load (request.getValue<Guid> ("caseid")), simulate));
							break;
						}		
							
						case "load":
						{
							result.Add (Settlement.Load (request.getValue<Guid> ("id")));
							break;
						}
							
						case "list":
						{
					if (request.ContainsXPath ("caseid"))
							{
								result.Add (Settlement.List (Case.Load (request.getValue<Guid> ("caseid"))));
							}
							if (request.ContainsXPath ("auctionid"))
							{
								result.Add (Settlement.List (Auction.Load (request.getValue<Guid> ("auctionid"))));
							}
					if (request.ContainsXPath ("customerid"))
							{
								result.Add (Settlement.List (Customer.Load (request.getValue<Guid> ("customerid"))));
							}
							else
							{
								result.Add (Bid.List ());
							}
							break;
						}
					}
					break;
				}
				#endregion

				#region Didius.Invoice
				case "didius.invoice":
				{	
					switch (Method.ToLower ())
					{						
						case "create":
						{
							result.Add (Invoice.Create (Auction.Load (request.getValue<Guid> ("auctionid")), Customer.Load (request.getValue<Guid> ("customerid")), request.getValue<bool> ("simulate")));
							break;
						}		
							
						case "load":
						{
							result.Add (Invoice.Load (request.getValue<Guid>("id")));
							break;
						}
							
						case "list":
						{
							if (request.ContainsXPath ("auctionid"))
							{
								result.Add (Invoice.List (Auction.Load (request.getValue<Guid> ("auctionid"))));
							}
							if (request.ContainsXPath ("customerid"))
							{
								result.Add (Invoice.List (Customer.Load (request.getValue<Guid> ("customerid"))));
							}
							else
							{
								result.Add (Invoice.List ());
							}
							break;
						}
					}
					break;
				}
				#endregion

				#region Didius.Creditnote
				case "didius.creditnote":
				{	
					switch (Method.ToLower ())
					{						
						case "create":
						{
					if (request.ContainsXPath ("invoiceid"))
					{
						result.Add (Creditnote.Create (Invoice.Load (request.getValue<Guid> ("invoiceid")), request.getValue<bool> ("simulate")));
					}
					else if (request.ContainsXPath ("item"))
					{


						result.Add (Creditnote.Create (Customer.Load (request.getValue<Guid> ("customerid")), request.getValue<Item> ("item"), request.getValue<bool> ("simulate")));


					}

							break;
						}		
							
						case "load":
						{
							result.Add (Creditnote.Load (request.getValue<Guid>("id")));
							break;
						}
							
						case "list":
						{							
							if (request.ContainsXPath ("customerid"))
							{
								result.Add (Creditnote.List (Customer.Load (request.getValue<Guid> ("customerid"))));
							}
							else
							{
								result.Add (Creditnote.List ());
							}
							break;
						}
					}
					break;
				}
				#endregion

				#region Didius.Helpers
				case "didius.helpers":
				{	
					switch (Method.ToLower ())
					{					
						case "createturnoverreport":
						{
							result.Add (TurnoverReport.Create (Auction.Load (request.getValue<Guid> ("auctionid"))));
							break;
						}

						case "createprofile":
						{
							Customer customer = Didius.Helpers.CreateProfile (request.getValue<string> ("name"), request.getValue<string> ("email"));

							customer.User.Password = request.getValue<string> ("password");

							if (request.xPathExists ("address1"))
								customer.Address1 = request.getValue<string> ("address1");

							if (request.xPathExists ("postcode"))
								customer.PostCode = request.getValue<string> ("postcode");

							if (request.xPathExists ("city"))
								customer.City = request.getValue<string> ("city");

							if (request.xPathExists ("phone"))
								customer.Phone = request.getValue<string> ("phone");

							if (request.xPathExists ("mobile"))
								customer.Mobile = request.getValue<string> ("mobile");

							customer.Save ();
							break;
						}

						case "verifyprofile":
						{
							result.Add (Didius.Helpers.VerifiyProfile (request.getValue<Guid> ("id")));
							break;
						}

						case "sendnewpassword":
						{
							result.Add (Didius.Helpers.SendNewPassword (SorentoLib.User.Load (request.getValue<string> ("email")).Id));
							break;
						}

						case "sendconsignment":
						{
							Didius.Helpers.SendConsignment (request.getValue<string> ("data"));
							break;
						}

						case "sendsms":
						{
							Didius.Helpers.SendSMS (request.getValue<string> ("message"));
							break;
						}

						case "bugreport":
						{
							Didius.Helpers.BugReport (request.getValue<string> ("sender"), request.getValue<string> ("description"));
							break;
						}

						case "newcatalogno":
						{
							if (request.ContainsXPath ("mincatalogno"))
							{
								result.Add (Helpers.NewCatalogNo (Auction.Load (request.getValue<Guid> ("auctionid")), int.Parse (request.getValue<string> ("mincatalogno"))));
							}
							else
							{
								result.Add (Helpers.NewCatalogNo (Auction.Load (request.getValue<Guid> ("auctionid"))));
							}

							break;
						}

						case "iscatalognotaken":
						{
							result.Add (  Helpers.IsCatalogNoTaken (Auction.Load (request.getValue<Guid> ("auctionid")), int.Parse (request.getValue<string> ("catalogno"))));
							break;
						}		

						case "mailbidwon":
						{
							Helpers.MailItemWon (Item.Load (request.getValue<Guid> ("itemid")));
							break;
						}
					}
					break;
				}
				#endregion

				#region Didius.EventListener
				case "didius.eventlistener":
				{	
					switch (Method.ToLower ())
					{					
						case "attach":
						{
							result.Add (EventListener.Attach ());
							break;
						}

						case "detach":
						{
							EventListener.Detach (request.getValue<Guid> ("eventlistenerid"));
							break;
						}	

						case "update":
						{
							if (request.ContainsXPath ("eventid"))
							{
								EventListener.Update (request.getValue<Guid> ("eventlistenerid"), request.getValue<string> ("eventid"), request.getValue<string> ("eventdata"));
							}
							else
							{
								result.Add (EventListener.Update (request.getValue<Guid> ("eventlistenerid")));
							}
							break;
						}
					}
					break;
				}
				#endregion

				#region Didius.Newsletter
				case "didius.newsletter":
				{	
					switch (Method.ToLower ())
					{						
						case "create":
						{
							result.Add (new Newsletter ());
							break;
						}		
							
						case "load":
						{
							result.Add (Newsletter.Load (request.getValue<Guid>("id")));
							break;
						}
							
						case "save":
						{
							request.getValue<Newsletter> ("didius.newsletter").Save ();
							break;
						}
							
						case "destroy":
						{
							Newsletter.Delete (request.getValue<Guid> ("id"));
							break;
						}

						case "send":
						{
							Newsletter.Load (request.getValue<Guid>("id")).Send ();
							break;
						}
							
						case "list":
						{
							result.Add (Newsletter.List ());
							break;
						}
					}
					break;
				}
				#endregion
			}
			
			return result;
		}
		#endregion
	}
}
