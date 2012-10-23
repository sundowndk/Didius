//
// Ajax.cs
//

using System;
using System.Collections.Generic;
using System.Collections;

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
							result.Add (Customer.Load (request.getValue<Guid>("id")));
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
							request.getValue<Item> ("didius.item").Save ();
							break;
						}
							
						case "destroy":
						{
							Item.Delete (request.getValue<Guid> ("id"));
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
							if (request.ContainsXPath ("customerid"))
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

				#region Didius.Settlement
				case "didius.settlement":
				{	
					switch (Method.ToLower ())
					{						
						case "create":
						{
							result.Add (new Settlement (Case.Load (request.getValue<Guid> ("caseid"))));
							break;
						}		
							
						case "load":
						{
							result.Add (Settlement.Load (request.getValue<Guid>("id")));
							break;
						}
							
						case "list":
						{
							if (request.ContainsXPath ("caseid"))
							{
								result.Add (Settlement.List (Case.Load (request.getValue<Guid> ("caseid"))));
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
							result.Add (new Invoice (Auction.Load (request.getValue<Guid> ("auctionid")), Customer.Load (request.getValue<Guid> ("customerid"))));
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

				#region Didius.Helpers
				case "didius.helpers":
				{	
					switch (Method.ToLower ())
					{					
						case "newcatalogno":
						{
							result.Add (Helpers.NewCatelogNo (Auction.Load (request.getValue<Guid> ("auctionid"))));
							break;
						}

						case "iscatalognotaken":
						{
							result.Add (  Helpers.IsCatalogNoTaken (Auction.Load (request.getValue<Guid> ("auctionid")), int.Parse (request.getValue<string> ("catalogno"))));
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
			}
			
			return result;
		}
		#endregion
	}
}
