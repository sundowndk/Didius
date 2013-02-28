using System;
using System.Collections.Generic;
using System.Xml;
using System.Threading;

using SNDK;
using SNDK.DBI;

using SorentoLib;


namespace Test
{
	class MainClass
	{
		public static void Main (string[] args)
		{
			SorentoLib.Services.Database.Connection = new Connection (SNDK.Enums.DatabaseConnector.Mysql,
			                                                          //			                                                          "localhost",
			                                                          "172.20.0.34",
			                                                          //			                                                            "sorento",
			                                                          "default",
			                                                          "default",
			                                                          "qwerty",
			                                                          true);
			
			SorentoLib.Services.Database.Prefix = "didiustest_";

			if (SorentoLib.Services.Database.Connection.Connect ())
			{
				Console.WriteLine ("Connected to database.");

				Didius.Auction auction = Didius.Auction.Load (new Guid ("fbc361f3-f060-4a8f-818e-8b266fad8503"));

				Console.WriteLine (Didius.Helpers.NewCatalogNo (auction, 60));

//				Didius.Helpers.SendSMS ("0");

//				Didius.Creditnote creditnote = Didius.Creditnote.Create (Didius.Invoice.Load (new Guid ("709de68b-ac61-4d2d-81cd-cb4e39789c0b")), true);
//
//				Console.WriteLine (creditnote.Total);
//				foreach (Didius.CreditnoteLine line in creditnote.Lines)
//				{
//					Console.WriteLine (line.Text);
//				}

//				2c8a183b-2e1c-4eba-844b-19769429acc9
//				foreach (Didius.Invoice invoice in Didius.Invoice.List ())
//				{
//					Console.WriteLine (invoice.Id);
//
//					Console.WriteLine (invoice.No);
//
//					foreach (Didius.InvoiceLine line in invoice.Lines)
//					{
//						Console.WriteLine (line.Amount);
//					}
//
////					Didius.Creditnote.Create (invoice, false);
//				}




//				Didius.Case c = Didius.Case.Load (new Guid ("4159988c-3328-4ebf-9592-0be125e698cc"));
//
//				c.ToXmlDocument ();

//				foreach (Didius.Item item in Didius.Item.List ())
//				{
//					if (item.Invoiced)
//					{
//						Console.WriteLine (item.Title);
//						item.Invoiced = false;
//						item.Settled = false;
//						item.Save ();
//					}
//				}

			

//				foreach (Didius.Creditnote creditnote in Didius.Creditnote.List ())
//				{
//					Didius.Customer customer = Didius.Customer.Load (creditnote.CustomerId);
//
//					Console.WriteLine (customer.Name);
//				}

//				foreach (Didius.Invoice invoice in Didius.Invoice.List ())
//				{
////					Console.WriteLine (invoice.No);
//
//					Didius.Creditnote creditnote = Didius.Creditnote.Create (invoice, true);
//
//					Console.WriteLine (creditnote.ToXmlDocument ().InnerXml);
//
//					break;
//
////					Didius.Creditnote creditnote = Didius.Creditnote.Create (invoice, true);
//
////					foreach (Didius.CreditnoteLine line in creditnote.Lines)
////					{
////						Console.WriteLine (line.Title +" "+ line.Amount);
////					}
//
////					Console.WriteLine ("");
//				}

//				foreach (Didius.Auction auction in Didius.Auction.List ())
//				{
//					foreach (Didius.Item item in Didius.Item.List (auction))
//					{
//						Console.WriteLine (item.Title);
//					}
//				}


//				foreach (Didius.AutoBid autobid in Didius.AutoBid.List ())
//				{
//					Didius.AutoBid.Delete (autobid.Id);
//				}


//				foreach (Didius.Item item in Didius.Item.List ())
//				{
//
//
//					if (item.Settled)
//					{
//						Console.WriteLine (item.Settled);
//						item.Settled = false;
//						item.Save ();
//					}
//
//				}

//				foreach (Didius.Bid bid in Didius.Bid.List ())
//				{
//					Console.WriteLine (bid.Amount);
//					Didius.Bid.Delete (bid.Id);
//				}


//				bool testcustomergroup = false;
//				bool testcustomer = false;
//
//				bool testcase = false;
//				bool testitem = false;
//
//				bool testsettlement = false;
//
//				bool testauction = false;
//
//				bool testbid = false;
//
//				if (true)
//				{
//					// SETUP
//					Didius.Customer c1 = new Didius.Customer ();
//					c1.Name = "Kunde #1";
//					c1.Save ();
//
//					Didius.Customer c2 = new Didius.Customer ();
//					c2.Name = "Kunde #2";
//					c2.Save ();
//
//					Didius.Customer c3 = new Didius.Customer ();
//					c3.Name = "Kunde #3";
//					c3.Save ();
//
//					Didius.Customer c4 = new Didius.Customer ();
//					c4.Name = "Kunde #4";
//					c4.Save ();
//
//					Didius.Auction a1 = new Didius.Auction ();
//					a1.Title = "Auktion #1";
//					a1.Save ();
//
//					Didius.Case ca1 = new Didius.Case (a1, c1);
//					ca1.Title = "Sag #1";
//					ca1.Save ();
//
//					Didius.Item i1 = new Didius.Item (ca1);
//					i1.Description = "Effekt #1";
//					i1.Save ();
//
//					Didius.Item i2 = new Didius.Item (ca1);
//					i2.Description = "Effekt #2";
//					i2.Save ();
////
////					Didius.Item i3 = new Didius.Item (ca1);
////					i3.Description = "Effekt #3";
////					i3.Save ();
////
////					Didius.Item i4 = new Didius.Item (ca1);
////					i4.Description = "Effekt #4";
////					i4.Save ();
//
//					// TEST
//
//					Didius.Item.Bid (c1, i1);
//					Didius.Item.Bid (c2, i1);
//					Didius.Item.Bid (c1, i1, 1000);
//					Didius.Item.Bid (c2, i1);
//					Didius.Item.Bid (c2, i1);
//					Didius.Item.Bid (c2, i1);
//					Didius.Item.Bid (c2, i1);
////
////					Didius.Item.Bid (c1, i1, 500); // 400, 500 *
////					Didius.Item.Bid (c1, i1, 1600); // 700, 1000, 1100, 1600 *
////					Didius.Item.Bid (c3, i1); // 500 *
////					Didius.Item.Bid (c3, i1); // 600 *
////					Didius.Item.Bid (c2, i1, 1000); // 1000 *
////					Didius.Item.Bid (c1, i1, 1500); // 1500 *
////					Didius.Item.Bid (c3, i1, 300); // 300 *
////					Didius.Item.Bid (c2, i1, 1600); // 1600 *
////					Didius.Item.Bid (c4, i1, 2000); // 1700, 1900, 2000 *
////					Didius.Item.Bid (c1, i1); // 1800 *
////					Didius.Item.Bid (c1, i1); // 2000 *
////					Didius.Item.Bid (c1, i1); // 2200 *
////					Didius.Item.Bid (c2, i1, 3000); // 2400, 2800, 3000 *
////					Didius.Item.Bid (c3, i1); // 2600 *
////					Didius.Item.Bid (c3, i1, 3200); // 3200 *
//
//
//
//
////					Didius.Item.Bid (c1, i2, 600);
////					Didius.Item.Bid (c2, i2, 800);
////					Didius.Item.Bid (c2, i1, 1200);
////					Didius.Item.Bid (c3, i1, 8000);
////					Didius.Item.Bid (c4, i1);
////					Didius.Item.Bid (c2, i1);
////					Didius.Item.Bid (c1, i1);
//
////								foreach (Didius.AutoBid autobid in Didius.AutoBid.List (i1))
////								{
////									Console.WriteLine ("\t"+ Didius.Customer.Load (autobid.CustomerId).Name);
////								}
//
//
//					foreach (Didius.Item item in Didius.Item.List (a1))
//					{
//						Console.WriteLine ("Item: "+ item.Title +" NextBidAmount: "+ item.NextBidAmount);
//
//						foreach (Didius.Bid bid in Didius.Bid.List (item))
//						{
//							Console.WriteLine ("\t"+ Didius.Customer.Load (bid.CustomerId).Name +" - "+ bid.Amount +" "+ bid.Sort); 
//						}
//					}
//
//
//
//
//					// CLEANUP
//					foreach (Didius.Item item in Didius.Item.List (a1))
//					{
//						foreach (Didius.Bid bid in Didius.Bid.List (item))
//						{
//							Didius.Bid.Delete (bid.Id);
//						}
//
//						foreach (Didius.AutoBid autobid in Didius.AutoBid.List (item))
//						{
//							Didius.AutoBid.Delete (autobid.Id);
//						}
//					}
//
//					Didius.Item.Delete (i1);
//					Didius.Item.Delete (i2);
////					Didius.Item.Delete (i3);
////					Didius.Item.Delete (i4);
//
//					Didius.Case.Delete (ca1.Id);
//
//					Didius.Auction.Delete (a1.Id);
//
//					Didius.Customer.Delete (c1.Id);
//					Didius.Customer.Delete (c2.Id);
//					Didius.Customer.Delete (c3.Id);
//					Didius.Customer.Delete (c4.Id);
//				}
//
//				if (testsettlement)
//				{
////					Didius.Customer d1 = new Didius.Customer ();
////					d1.Name = "Rasmus Pedersen";
////					d1.Save ();
////
////					Didius.Auction d2 = new Didius.Auction ();
////					d2.Title = "Test Auktion";
////					d2.Save ();
////
////					Didius.Case d3 = new Didius.Case (d2, d1);
////					d3.Title = "Nogle ting der skal sælges";
////					d3.CommisionFeePercentage = 20;
////					d3.CommisionFeeMinimum = 100;
////					d3.Save ();
////
////					Didius.Item d4 = new Didius.Item (d3);
////					d4.Description = "Skrivebord. Brugt.";
////					d4.Save ();
////
////					Didius.Bid d5 = new Didius.Bid (d1, d4, 1500);
////					d5.Save ();
////
////					Didius.Settlement s1 = new Didius.Settlement (d3);
////
////					Console.WriteLine ("No: "+ s1.No);
////					Console.WriteLine ("Sales: "+ s1.Sales);
////					Console.WriteLine ("CommissionFee: "+ s1.CommissionFee);
////					Console.WriteLine ("Total: "+ s1.Total);
////
////					Didius.Settlement s2 = new Didius.Settlement (d3);
////					
////					Console.WriteLine ("No: "+ s2.No);
////					Console.WriteLine ("Sales: "+ s2.Sales);
////					Console.WriteLine ("CommissionFee: "+ s2.CommissionFee);
////					Console.WriteLine ("Total: "+ s2.Total);
////
////					Didius.Bid.Delete (d5.Id);
////					Didius.Item.Delete (d4.Id);
////					Didius.Case.Delete (d3.Id);
////					Didius.Auction.Delete (d2.Id);
////					Didius.Customer.Delete (d1.Id);
//				}
//
//				#region CUSTOMERGROUP
//				if (testcustomergroup)
//				{
//					Console.WriteLine ("Testing Didius.CustomerGroup\n");
//
//					// SAVE
//					Console.WriteLine ("\tSave\n");
//					Didius.CustomerGroup cg1 = new Didius.CustomerGroup ();
//					cg1.Name = "Name";
//					
//					cg1.Save ();
//
//					// LOAD
//					Console.WriteLine ("\tLoad\n");
//					Didius.CustomerGroup cg2 = Didius.CustomerGroup.Load (cg1.Id);
//
//					Console.WriteLine ("\t\tName: "+ cg2.Name);
//
//					// LIST
//					Console.WriteLine ("\r\tList\n");
//					foreach (Didius.CustomerGroup cg in Didius.CustomerGroup.List ())
//					{
//						Console.WriteLine ("\t\t"+ cg.Name);
//					}
//						
//					// TOXMLDOCUMENT
//					Console.WriteLine ("\r\tToXmlDocument\n");
//					XmlDocument cg1xml = cg1.ToXmlDocument ();
//					Console.WriteLine ("\t\t"+ cg1xml.InnerXml.ToString ());
//
//					// FROMXMLDOCUMENT
//					Console.WriteLine ("\r\tFromXmlDocument\n");
//					Didius.CustomerGroup cg3 = Didius.CustomerGroup.FromXmlDocument (cg1xml);
//					Console.WriteLine ("\t\tName: "+ cg3.Name);
//
//					// DELETE
//					Console.WriteLine ("\r\tDelete\n");
//					Didius.CustomerGroup.Delete (cg1.Id);
//
//					// CLEANUP
//					Console.WriteLine ("\tCleanup");
//				}
//				#endregion
//
//				#region CUSTOMER
//				if (testcustomer)
//				{
//					Console.WriteLine ("\rTesting Didius.Customer\n\r");
//
//					// SAVE
//					Console.WriteLine ("\tSave\n");
//					Didius.Customer c1 = new Didius.Customer ();
//
//					Didius.CustomerGroup cg1 = new Didius.CustomerGroup ();
//					cg1.Name = "Group1";
//					cg1.Save ();
//
//					Didius.CustomerGroup cg2 = new Didius.CustomerGroup ();
//					cg2.Name = "Group2";
//					cg2.Save ();
//
//					c1.Groups.Add (cg1);
//					c1.Groups.Add (cg2);
//
//					c1.Name = "Name";
//					c1.Address1 = "Address1";
//					c1.Address2 = "Address2";
//					c1.PostCode = "PostCode";
//					c1.City = "City";
//					c1.Country = "Country";
//					c1.Att = "Att";
//					c1.Email = "Email";
////					c1.PhoneNumbers.Add ("PhoneNumber");
////					c1.PhoneNumbers.Add ("PhoneNumber");
//					c1.Vat = true;
//					c1.VatNo = "VatNo";
//					c1.BankName = "BankName";
//					c1.BankRegistrationNo = "BankRegistrationNo";
//					c1.BankAccountNo = "BankAccountNo";
//					c1.Notes = "Notes";
//					c1.Status = Didius.Enums.CustomerStatus.Enabled;
//
//					SorentoLib.User u1 = new User ("TESTUSER", "TEST@TEST.TEST");
//					u1.Save ();
//
//					c1.User = u1;
//
//					c1.Save ();
//
//					// LOAD
//					Console.WriteLine ("\tLoad\n");
//					Didius.Customer c2 = Didius.Customer.Load (c1.Id);
//
//					Console.WriteLine ("\t\tNo: "+ c2.No);
//
//					Console.WriteLine ("\t\tGroups:");
//					foreach (Didius.CustomerGroup cg in c2.Groups)
//					{
//						Console.WriteLine ("\t\t\t"+ cg.Name);
//					}
//
//					Console.WriteLine ("\r\t\tName: "+ c2.Name);
//					Console.WriteLine ("\t\tAddress1: "+ c2.Address1);
//					Console.WriteLine ("\t\tAddress2: "+ c2.Address2);
//					Console.WriteLine ("\t\tPostcode: "+ c2.PostCode);
//					Console.WriteLine ("\t\tCity: "+ c2.City);
//					Console.WriteLine ("\t\tCountry: "+ c2.Country);
//					Console.WriteLine ("\t\tAtt.: "+ c2.Att);
//					Console.WriteLine ("\t\tEmail: "+ c2.Email);
//
//					Console.WriteLine ("\r\t\tPhoneNumbers:");
////					foreach (string phonenumber in c2.PhoneNumbers)
////					{
////						Console.WriteLine ("\t\t\t"+ phonenumber);
////					}
//
//					Console.WriteLine ("\r\t\tVat: "+ c2.Vat);
//					Console.WriteLine ("\t\tVatNo.: "+ c2.VatNo);
//					Console.WriteLine ("\t\tBankName.: "+ c2.BankName);
//					Console.WriteLine ("\t\tBankRegistrationNo.: "+ c2.BankRegistrationNo);
//					Console.WriteLine ("\t\tBankAccountNo.: "+ c2.BankAccountNo);
//					Console.WriteLine ("\t\tNotes: "+ c2.Notes);
//					Console.WriteLine ("\t\tStatus: "+ c2.Status);
//
//					Console.WriteLine ("\t\tUser: "+ c2.User.Username);
//					Console.WriteLine ("\t\tUserStatus: "+ c2.User.Status);
//
//					// LIST
//					Console.WriteLine ("\r\tList\n");
//					foreach (Didius.Customer c in Didius.Customer.List ())
//					{
//						Console.WriteLine ("\t\t"+ c1.Name);
//					}
//
//					// TOXMLDOCUMENT
//					Console.WriteLine ("\r\tToXmlDocument\n");
//					XmlDocument c1xml = c1.ToXmlDocument ();
//					Console.WriteLine ("\t\t"+ c1xml.InnerXml.ToString ());
//					
//					// FROMXMLDOCUMENT
//					Console.WriteLine ("\r\tFromXmlDocument\n");
//					Didius.Customer c3 = Didius.Customer.FromXmlDocument (c1xml);
//					Console.WriteLine ("\t\tNo: "+ c3.No);
//					
//					Console.WriteLine ("\t\tGroups:");
//					foreach (Didius.CustomerGroup cg in c3.Groups)
//					{
//						Console.WriteLine ("\t\t\t"+ cg.Name);
//					}
//					
//					Console.WriteLine ("\r\t\tName: "+ c3.Name);
//					Console.WriteLine ("\t\tAddress1: "+ c3.Address1);
//					Console.WriteLine ("\t\tAddress2: "+ c3.Address2);
//					Console.WriteLine ("\t\tPostcode: "+ c3.PostCode);
//					Console.WriteLine ("\t\tCity: "+ c3.City);
//					Console.WriteLine ("\t\tCountry: "+ c3.Country);
//					Console.WriteLine ("\t\tAtt.: "+ c3.Att);
//					Console.WriteLine ("\t\tEmail: "+ c3.Email);
//					
//					Console.WriteLine ("\r\t\tPhoneNumbers:");
////					foreach (string phonenumber in c3.PhoneNumbers)
////					{
////						Console.WriteLine ("\t\t\t"+ phonenumber);
////					}
//					
//					Console.WriteLine ("\r\t\tVat: "+ c3.Vat);
//					Console.WriteLine ("\t\tVatNo.: "+ c3.VatNo);
//					Console.WriteLine ("\t\tBankName.: "+ c3.BankName);
//					Console.WriteLine ("\t\tBankRegistrationNo.: "+ c3.BankRegistrationNo);
//					Console.WriteLine ("\t\tBankAccountNo.: "+ c3.BankAccountNo);
//					Console.WriteLine ("\t\tNotes: "+ c3.Notes);
//					Console.WriteLine ("\t\tStatus: "+ c3.Status);
//
//					Console.WriteLine ("\t\tUser: "+ c2.User.Username);
//					Console.WriteLine ("\t\tUserStatus: "+ c2.User.Status);
//
//					// DELETE
//					Console.WriteLine ("\r\tDelete");
//					Didius.Customer.Delete (c1.Id);
//
//					// CLEANUP
//					Console.WriteLine ("\r\tCleanup");
//					Didius.CustomerGroup.Delete (cg1.Id);
//					Didius.CustomerGroup.Delete (cg2.Id);
//					SorentoLib.User.Delete (u1.Id);
//				}
//				#endregion			
//			
//				#region CASE
//				if (testcase)
//				{
//					Console.WriteLine ("Testing Didius.Case\n");
//					
//					// SAVE
//					Console.WriteLine ("\tSave\n");
//
//					Didius.Auction d1 = new Didius.Auction ();
//					d1.Save ();
//
//					Didius.Customer d2 = new Didius.Customer ();
//					d2.Name = "TEST CUSTOMER";
//					d2.Save ();
//
//					Didius.Case t1 = new Didius.Case (d1, d2);					
//					t1.Save ();
//					
//					// LOAD
//					Console.WriteLine ("\tLoad\n");
//					Didius.Case t2 = Didius.Case.Load (t1.Id);
//					
//					Console.WriteLine ("\t\tNo: "+ t2.No);
//					Console.WriteLine ("\t\tCustomerId: "+ t2.CustomerId);
//					
//					// LIST
//					Console.WriteLine ("\r\tList\n");
//					foreach (Didius.Case t in Didius.Case.List ())
//					{
//						Console.WriteLine ("\t\t"+ t.No);
//					}
//
//					// LIST CUSTOMER
//					Console.WriteLine ("\r\tList with Customer\n");
//					foreach (Didius.Case c in Didius.Case.List (d2))
//					{
//						Console.WriteLine ("\t\t"+ c.No);
//					}
//					
//					// TOXMLDOCUMENT
//					Console.WriteLine ("\r\tToXmlDocument\n");
//					XmlDocument t1xml = t1.ToXmlDocument ();
//					Console.WriteLine ("\t\t"+ t1xml.InnerXml.ToString ());
//					
//					// FROMXMLDOCUMENT
//					Console.WriteLine ("\r\tFromXmlDocument\n");
//					Didius.Case t3 = Didius.Case.FromXmlDocument (t1xml);
//					Console.WriteLine ("\t\tNo: "+ t3.No);
//					Console.WriteLine ("\t\tCustomerId: "+ t3.CustomerId);
//					
//					// DELETE
//					Console.WriteLine ("\r\tDelete\n");
//					Didius.Case.Delete (t1.Id);
//					
//					// CLEANUP
//					Console.WriteLine ("\tCleanup");
//
//					Didius.Auction.Delete (d1.Id);				
//					Didius.Customer.Delete (d2.Id);				
//				}
//				#endregion
//
//				#region ITEM
//				if (testitem)
//				{
//					Console.WriteLine ("Testing Didius.Item\n");
//		
////					// SAVE
////					Console.WriteLine ("\tSave\n");
////					
//					Didius.Auction d1 = new Didius.Auction ();
//					d1.Save ();
//
//					Didius.Customer d2 = new Didius.Customer ();
//					d2.Save ();
//
//					Didius.Case d3 = new Didius.Case (d1, d2);
//					d3.Save ();
//
//
//
//				
//
//
//					for (int i = 1; i < 20; i++) 
//					{
//						Didius.Item t = new Didius.Item (d3);
//						t.Description= "TITLE #"+ i.ToString ();
//
//						if (i == 4)
//						{
//							t.CatalogNo = 15;
//						}
//
//						if (i == 13)
//						{
//							t.CatalogNo = 17;
//						}
//
//						if (i == 14)
//						{
//							t.CatalogNo = 16;
//						}
//
//						if (i == 16)
//						{
//							t.CatalogNo = 19;
//						}
//
//						t.Save ();	
//
//					}
////
////
//					List<Didius.Item> list = Didius.Item.List ();
//					list.Sort (delegate (Didius.Item int1, Didius.Item int2) { return int1.CatalogNo.CompareTo (int2.CatalogNo); });
//
//					foreach (Didius.Item i in list)
//					{
//						Console.WriteLine (i.CatalogNo +" - "+ i.Title);
//					}
//
//
//				
//
////					Console.WriteLine ("catalog "+ t1.CatalogNo);
////
////					// LOAD
////					Console.WriteLine ("\tLoad\n");
////					Didius.Item t2 = Didius.Item.Load (t1.Id);
////					Console.WriteLine ("\t\tCaseId: "+ t2.CaseId);
////					Console.WriteLine ("\t\tTitle: "+ t2.Title);
////					Console.WriteLine ("\t\tDescription: "+ t2.Description);
//
////					foreach (string key in t2.Fields.Keys)
////					{
////						Console.WriteLine ("\t\t\t"+ key +": "+ t2.Fields[key]);
////					}
////										
//					// LIST
////					Console.WriteLine ("\r\tList\n");
////					foreach (Didius.Item t3 in Didius.Item.List ())
////					{
////						Console.WriteLine ("\t\tTitle: "+ t3.Title);
////					}
////
////					// TOXMLDOCUMENT
////					Console.WriteLine ("\r\tToXmlDocument\n");
////					XmlDocument t1xml = t1.ToXmlDocument ();
////					Console.WriteLine ("\t\t"+ t1xml.InnerXml.ToString ());
////
////					// FROMXMLDOCUMENT
////					Console.WriteLine ("\r\tFromXmlDocument\n");
////					Didius.Item t4 = Didius.Item.FromXmlDocument (t1xml);
////					Console.WriteLine ("\t\tId: "+ t4.Id);
////					Console.WriteLine ("\t\tTitle: "+ t4.Title);
////					Console.WriteLine ("\t\tDescription: "+ t4.Description);
////
////					foreach (string key in t2.Fields.Keys)
////					{
////						Console.WriteLine ("\t\t\t"+ key +": "+ t2.Fields[key]);
////					}
//
//					// DELETE
//					Console.WriteLine ("\r\tDelete\n");
//					foreach (Didius.Item i in Didius.Item.List ())
//					{
//						Didius.Item.Delete (i);
//					}
//
//					// CLEANUP
//					Console.WriteLine ("\tCleanup");
//
//					Didius.Case.Delete (d3.Id);
//					Didius.Customer.Delete (d2.Id);
//					Didius.Auction.Delete (d1.Id);				
//				}
//				#endregion
//
//				#region AUCTION
//				if (testauction)
//				{
////					Console.WriteLine ("Testing Didius.Auction\n");
////					
////					// SAVE
////					Console.WriteLine ("\tSave\n");
////					
//					Didius.Customer c1 = new Didius.Customer ();
//					c1.Name = "Rasmus";
//					c1.Save ();
//
//
//					Didius.Customer c2= new Didius.Customer ();
//					c2.Name = "Ina";
//					c2.Save ();
//
//					Didius.Auction a1 = new Didius.Auction ();					
//
//					Didius.LiveBider l1 = new Didius.LiveBider ();
//					l1.BuyerNo = "100";
//					l1.CustomerId = c1.Id;
//
//					Didius.LiveBider l2 = new Didius.LiveBider ();
//					l2.BuyerNo = "101";
//					l2.CustomerId = c2.Id;
//
//					a1.LiveBiders.Add (l1);
//					a1.LiveBiders.Add (l2);
//
//
////					a1.LiveBiders.Add ("111");
////					a1.LiveBiders.Add ("122");
//
//					a1.Save ();
//
//
//					Didius.Auction a2 = Didius.Auction.Load (a1.Id);
//
//					foreach (Didius.LiveBider livebider in a2.LiveBiders)
//					{
//						Console.WriteLine (Didius.Customer.Load (livebider.CustomerId).Name +" = "+  livebider.BuyerNo);
//					}
////					{
////						Console.WriteLine (Didius.Customer.Load (new Guid (key)).Name +" = "+  a2.LiveBiders[key]);
////					}
//
//
//
////										
////					// LOAD
////					Console.WriteLine ("\tLoad\n");
////					Didius.Auction a2 = Didius.Auction.Load (a1.Id);
////
////					Console.WriteLine ("\t\tId: "+ a2.Id);
////					
////					// LIST
////					Console.WriteLine ("\r\tList\n");
////					foreach (Didius.Auction a in Didius.Auction.List ())
////					{
////						Console.WriteLine ("\t\tId: "+ a.Id);
////					}
////										
////					// TOXMLDOCUMENT
////					Console.WriteLine ("\r\tToXmlDocument\n");
////					XmlDocument a1xml = a1.ToXmlDocument ();
////					Console.WriteLine ("\t\t"+ a1xml.InnerXml.ToString ());
////					
////					// FROMXMLDOCUMENT
////					Console.WriteLine ("\r\tFromXmlDocument\n");
////					Didius.Auction a3 = Didius.Auction.FromXmlDocument (a1xml);
////					Console.WriteLine ("\t\tId: "+ a3.Id);
////					
////					// DELETE
//					Console.WriteLine ("\r\tDelete\n");
//					Didius.Auction.Delete (a1.Id);
//
//					Didius.Customer.Delete (c1.Id);
//					Didius.Customer.Delete (c2.Id);
////					
////					// CLEANUP
////					Console.WriteLine ("\tCleanup");
//				}
//				#endregion
//
//				#region BID
//				if (testbid)
//				{
////					Console.WriteLine ("Testing Didius.Bid\n");
////					
////					// SAVE
////					Console.WriteLine ("\tSave\n");
////
////					Didius.Customer d1 = new Didius.Customer ();
////					d1.Name = "TEST CUSTOMER";
////					d1.Save ();
////
////					Didius.Case d2 = new Didius.Case (d1);
////					d2.Save ();
////
////					Didius.Item d3 = new Didius.Item (d2);
////					d3.Save ();
////								
////					Didius.Bid b1 = new Didius.Bid (d1, d3, 100);
////					b1.Save ();
////					
////					// LOAD
////					Console.WriteLine ("\tLoad\n");
////					Didius.Bid b2 = Didius.Bid.Load (b1.Id);					
////					Console.WriteLine ("\t\tId: "+ b2.Id);
////					Console.WriteLine ("\t\tAmount: "+ b2.Amount);
////					
////					// LIST
////					Console.WriteLine ("\r\tList\n");
////					foreach (Didius.Bid b in Didius.Bid.List ())
////					{
////						Console.WriteLine ("\t\tId: "+ b.Id);
////					}
////					
////					// TOXMLDOCUMENT
////					Console.WriteLine ("\r\tToXmlDocument\n");
////					XmlDocument b1xml = b1.ToXmlDocument ();
////					Console.WriteLine ("\t\t"+ b1xml.InnerXml.ToString ());
////					
////					// FROMXMLDOCUMENT
////					Console.WriteLine ("\r\tFromXmlDocument\n");
////					Didius.Bid b3 = Didius.Bid.FromXmlDocument (b1xml);
////					Console.WriteLine ("\t\tId: "+ b3.Id);
////					Console.WriteLine ("\t\tAmount: "+ b3.Amount);
////					
////					// DELETE
////					Console.WriteLine ("\r\tDelete\n");
////					Didius.Bid.Delete (b1.Id);
////					
////					// CLEANUP
////					Console.WriteLine ("\tCleanup");
////
////					Didius.Item.Delete (d3.Id);
////					Didius.Case.Delete (d2.Id);
////					Didius.Customer.Delete (d1.Id);
//				}
//				#endregion
			}
			else
			{
				Console.WriteLine ("Could not connect to database.");
			}
		}
	}
}
