//
// Render.cs
//
// Author:
// Rasmus Pedersen <rasmus@akvaservice.dk>
//
// Copyright (c) 2009 Rasmus Pedersen
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

using System;
using System.Collections;
using System.Collections.Generic;

using SorentoLib;

namespace Didius.Addin
{
	public class Render : SorentoLib.Addins.IRenderBaseClass, SorentoLib.Addins.IRender
	{
		#region Constructor
		public Render ()
		{
			base.NameSpaces.Add ("didius");
		}
		#endregion
		
		#region Public Methods
		override public object Process (SorentoLib.Session Session, string Fullname, string Method, object Variable, SorentoLib.Render.Resolver.Parameters Parameters)
		{
			switch (Fullname)
			{
				#region Didius.Customer
				case "didius.customer":
				{
					switch (Method)
					{
						case "":
						{
							return ((Didius.Customer)Variable);
						}
							
						case "id":
						{
							return ((Didius.Customer)Variable).Id;
						}
																				
						case "load":
						{
							switch (Parameters.Type (0).Name.ToLower())
							{
								case "user":
								{
									return Didius.Customer.Load (Parameters.Get<SorentoLib.User>(0));
								}

								case "guid":							
									return Didius.Customer.Load (Parameters.Get<Guid>(0));
									
								case "string":
									return Didius.Customer.Load (new Guid (Parameters.Get<string>(0)));
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
					switch (Method)
					{
						case "getauctionscustomerbidon":
						{
							return Didius.Helpers.GetAuctionsCustomerBidOn (Parameters.Get<Customer>(0));
						}

						case "getitemscustomerbidon":
						{
							return Didius.Helpers.GetItemsCustomerBidOn (Parameters.Get<Customer>(0), Parameters.Get<Auction>(1));
						}

						case "getcustomershighbidonitem":
						{
							return Didius.Helpers.GetCustomersHighBidOnItem (Parameters.Get<Customer>(0), Parameters.Get<Item>(1));
						}
					}
					break;
				}
				#endregion

				#region Didius.Auction
				case "didius.auction":
				{
					switch (Method)
					{
						case "":
						{
							return ((Didius.Auction)Variable);
						}
							
						case "id":
						{
							return ((Didius.Auction)Variable).Id;
						}

						case "no":
						{
							return ((Didius.Auction)Variable).No;
						}

						case "begin":
						{
							return ((Didius.Auction)Variable).Begin;
						}

						case "end":
						{
							return ((Didius.Auction)Variable).End;
						}

						case "location":
						{
							return ((Didius.Auction)Variable).Location;
						}

						case "deadline":
						{
							return ((Didius.Auction)Variable).Deadline;
						}

						case "title":
						{
							return ((Didius.Auction)Variable).Title;
						}

						case "description":
						{
							return ((Didius.Auction)Variable).Description;
						}

						case "type":
						{
							return ((Didius.Auction)Variable).Type;
						}

						case "status":
						{
							return ((Didius.Auction)Variable).Status;
						}
													
						case "load":
						{
							switch (Parameters.Type (0).Name.ToLower())
							{
								case "guid":							
									return Didius.Auction.Load (Parameters.Get<Guid>(0));
									
								case "string":
									return Didius.Auction.Load (new Guid (Parameters.Get<string>(0)));
							}
							break;
						}

						case "list":
						{
							return Didius.Auction.List ();
						}
					}
					break;
				}
				#endregion				

				#region Didius.Case
				case "didius.case":
				{
					switch (Method)
					{
						case "":
						{
							return ((Didius.Case)Variable);
						}
							
						case "id":
						{
							return ((Didius.Case)Variable).Id;
						}
							
						case "auctionid":
						{
							return ((Didius.Case)Variable).AuctionId;
						}
																				
						case "load":
						{
							switch (Parameters.Type (0).Name.ToLower())
							{
								case "guid":							
									return Didius.Case.Load (Parameters.Get<Guid>(0));
									
								case "string":
									return Didius.Case.Load (new Guid (Parameters.Get<string>(0)));
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
					switch (Method)
					{
						case "":
						{
							return ((Didius.Item)Variable);
						}
							
						case "id":
						{
							return ((Didius.Item)Variable).Id;
						}
						
						case "caseid":
						{
							return ((Didius.Item)Variable).CaseId;
						}

						case "auctionid":
						{
							return ((Didius.Item)Variable).Case.Auction.Id;
						}
													
						case "no":
						{
							return ((Didius.Item)Variable).No;
						}
							
						case "catalogno":
						{
							return ((Didius.Item)Variable).CatalogNo;
						}

						case "vat":
						{
							return ((Didius.Item)Variable).Vat;
						}

						case "title":
						{
							return ((Didius.Item)Variable).Title;
						}
							
						case "description":
						{
							return ((Didius.Item)Variable).Description;
						}

						case "pictureid":
						{
							return ((Didius.Item)Variable).PictureId;
						}

						case "currentbid":
						{
							return ((Didius.Item)Variable).CurrentBid;
						}

						case "bidamount":
						{
							return ((Didius.Item)Variable).BidAmount;
						}

						case "nextbidamount":
						{
							return ((Didius.Item)Variable).NextBidAmount;
						}

						case "onlinebid":
						{
							Didius.Item.OnlineBid (Parameters.Get<Didius.Customer>(0), Parameters.Get<Didius.Item>(1));
							break;
						}

						case "load":
						{
							switch (Parameters.Type (0).Name.ToLower())
							{
								case "guid":							
									return Didius.Item.Load (Parameters.Get<Guid>(0));
									
								case "string":
									return Didius.Item.Load (new Guid (Parameters.Get<string>(0)));
							}
							break;
						}
							
						case "list":
						{
							if (Parameters.Count == 1)
							{
								switch (Parameters.Type (0).Name.ToLower())
								{
									case "auction":
									{
										return Didius.Item.List (Parameters.Get<Didius.Auction>(0));
									}
										
									default:
									{
										return Didius.Item.List ();
									}
								}
							}
							else if (Parameters.Count == 3)
							{
								switch (Parameters.Type (0).Name.ToLower())
								{
									case "auction":
									{
										return Didius.Item.List (Parameters.Get<Didius.Auction>(0)).GetRange (Parameters.Get<int> (1), Parameters.Get<int> (2));
									}
										
									default:
									{
										return Didius.Item.List ().GetRange (Parameters.Get<int> (1), Parameters.Get<int> (2));
									}
								}
							}
							break;
						}
					}
					break;
				}
				#endregion	

				#region Didius.Bid
				case "didius.bid":
				{
					switch (Method)
					{
						case "":
						{
							return ((Didius.Bid)Variable);
						}
							
						case "id":
						{
							return ((Didius.Bid)Variable).Id;
						}

						case "createtimestamp":
						{
							return ((Didius.Bid)Variable).CreateTimestamp;
						}

						case "updatetimestamp":
						{
							return ((Didius.Bid)Variable).UpdateTimestamp;
						}
							
						case "itemid":
						{
							return ((Didius.Bid)Variable).ItemId;
						}
							
						case "customerid":
						{
							return ((Didius.Bid)Variable).CustomerId;
						}
							
						case "amount":
						{
							return ((Didius.Bid)Variable).Amount;
						}
													
						case "load":
						{
							switch (Parameters.Type (0).Name.ToLower())
							{
								case "guid":							
									return Didius.Bid.Load (Parameters.Get<Guid>(0));
									
								case "string":
									return Didius.Bid.Load (new Guid (Parameters.Get<string>(0)));
							}
							break;
						}
							
						case "list":
						{
							switch (Parameters.Type (0).Name.ToLower())
							{
								case "customer":
								{
									return Didius.Bid.List (Parameters.Get<Didius.Customer>(0));
								}

								case "item":
								{
									return Didius.Bid.List (Parameters.Get<Didius.Item>(0));
								}
																	
								default:
								{
									return Didius.Bid.List ();
								}
							}						
						}
					}
					break;
				}
				#endregion	

				#region Didius.AutoBid
				case "didius.autobid":
				{
					switch (Method)
					{
						case "":
						{
							return ((Didius.AutoBid)Variable);
						}
							
						case "id":
						{
							return ((Didius.AutoBid)Variable).Id;
						}

						case "createtimestamp":
						{
							return ((Didius.AutoBid)Variable).CreateTimestamp;
						}
							
						case "updatetimestamp":
						{
							return ((Didius.AutoBid)Variable).UpdateTimestamp;
						}
							
						case "itemid":
						{
							return ((Didius.AutoBid)Variable).ItemId;
						}
							
						case "customerid":
						{
							return ((Didius.AutoBid)Variable).CustomerId;
						}
							
						case "amount":
						{
							return ((Didius.AutoBid)Variable).Amount;
						}
							
						case "load":
						{
							switch (Parameters.Type (0).Name.ToLower())
							{
								case "guid":							
									return Didius.AutoBid.Load (Parameters.Get<Guid>(0));
									
								case "string":
									return Didius.AutoBid.Load (new Guid (Parameters.Get<string>(0)));
							}
							break;
						}
							
						case "list":
						{
							switch (Parameters.Type (0).Name.ToLower())
							{
								case "customer":
								{
									return Didius.AutoBid.List (Parameters.Get<Didius.Customer>(0));
								}
									
								case "item":
								{
									return Didius.AutoBid.List (Parameters.Get<Didius.Item>(0));
								}
									
								default:
								{
									return Didius.AutoBid.List ();
								}
							}						
						}
					}
					break;
				}
				#endregion
			}
			
			throw new SorentoLib.Exceptions.RenderExceptionMemberNotFound ();
		}
		#endregion
	}
}