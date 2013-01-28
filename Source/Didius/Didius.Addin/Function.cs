//
// Function.cs
//  
// Author:
//       Rasmus Pedersen <rasmus@akvaservice.dk>
// 
// Copyright (c) 2010 Rasmus Pedersen
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
using System.IO;
using System.Text;
using System.Threading;
using System.Collections.Generic;

using SorentoLib;

namespace Didius.Addin
{
	public class Function : SorentoLib.Addins.IFunction
	{
		#region Private Fields
		private List<string> _namespaces = new List<string> ();
		#endregion
		
		#region Constructor
		public Function ()
		{
			this._namespaces.Add ("didius");
		}
		#endregion
		
		#region Public Methods
		public bool IsProvided (string Namespace)
		{
			return this._namespaces.Exists (delegate (string o) {return (o == Namespace.ToLower ());});
		}
		
		public bool Process (SorentoLib.Session Session, string Fullname, string Method)
		{


			switch (Fullname.ToLower ())
			{
				#region Item
				case "didius.item":
					
					switch (Method.ToLower ())
					{
						case "imageupload":
							List<string> allowedfiletypes = new List<string> ();
							allowedfiletypes.Add ("image/jpeg");
							allowedfiletypes.Add ("image/png");
							allowedfiletypes.Add ("image/gif");

//							allowedfiletypes.Add ("application/pdf");
//							allowedfiletypes.Add ("image/gif");
														
							Console.WriteLine (Session.Request.QueryJar.Get ("image").BinaryContentType);

							if (allowedfiletypes.Contains (Session.Request.QueryJar.Get ("image").BinaryContentType))
							{

								Console.WriteLine ("BLA");
								SorentoLib.Media image = new SorentoLib.Media ("/media/didius/app/"+ Guid.NewGuid ().ToString (), Session.Request.QueryJar.Get ("image").BinaryData);
								image.Type = SorentoLib.Enums.MediaType.Restricted;
								image.Save ();

								MediaTransformation.Transform (image, SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_script) + "didius/item_picture_resize.xml");
								
//								Session.Page.Variables.Add ("mediaid", image.Id);
//								Session.Page.Variables.Add ("mediasoftpath", image.Path);
//								Session.Page.Variables.Add ("uploadsuccess", "true");

								Session.Page.Lines.Add ("SUCCESS:"+ image.Id);
			
								return true;
							}
							
							Session.Page.Lines.Add ("ERROR");
							return true;
							
						default:
							return false;
					}
				#endregion

				#region Invoice
			case "didius.invoice":
				switch (Method.ToLower ())
				{
				case "mailto":
				{
							Console.WriteLine ("MAILTO");

					try
					{
						Customer customer = Customer.Load (new Guid (Session.Request.QueryJar.Get ("customerid").Value));

								Console.WriteLine (Session.Request.QueryJar.Get ("pdf").BinaryContentType);

						List<SorentoLib.Tools.Helpers.SendMailAttatchment> attatchments = new List<SorentoLib.Tools.Helpers.SendMailAttatchment> ();
						attatchments.Add (new SorentoLib.Tools.Helpers.SendMailAttatchment (Session.Request.QueryJar.Get ("pdf").BinaryData, "faktura.pdf", Session.Request.QueryJar.Get ("pdf").BinaryContentType));

						SorentoLib.Tools.Helpers.SendMail ("robot@york-auktion.dk", customer.Email, "Faktura", "Her er din faktura!", false, attatchments);

						Session.Page.Lines.Add ("SUCCESS:"+ "TRUE");
					} catch (Exception e)
					{
								Console.WriteLine (e);

						Session.Page.Lines.Add ("ERROR");
						return true;
					}

					Console.WriteLine ("AllDone");
					return true;
				}
							
				default:
					return false;
				}
				
#endregion

				#region Helpers
				case "didius.helpers":
				{
					switch (Method.ToLower ())
					{
						case "mailfiletocustomer":
						{
							try
							{
								string filename = SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_temp) + "/"+ Guid.NewGuid ();
								SNDK.IO.ByteArrayToFile (filename, Session.Request.QueryJar.Get ("file").BinaryData);

								Helpers.MailFileToCustomer (Customer.Load (new Guid (Session.Request.QueryJar.Get ("customerid").Value)), filename, "Hej med dig!");

								Session.Page.Lines.Add ("SUCCESS:"+ "TRUE");

							}
							catch (Exception e)
							{
								Console.WriteLine (e);
								Session.Page.Lines.Add ("ERROR");
								return true;
							}
							break;
						}

						case "mailinvoice":
						{
							try
							{
								string filename = SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_temp) + "/"+ Guid.NewGuid ();
								SNDK.IO.ByteArrayToFile (filename, Session.Request.QueryJar.Get ("file").BinaryData);



								try
								{
									Helpers.MailInvoice (Invoice.Load (new Guid (Session.Request.QueryJar.Get ("invoiceid").Value)), filename);
								}
								catch
								{
									// TODO: remove this.
//									Invoice invoice = Invoice.Create (Auction.Load (new Guid (Session.Request.QueryJar.Get ("auctionid").Value)), Customer.Load (new Guid (Session.Request.QueryJar.Get ("customerid").Value)), true);
//									Helpers.MailInvoice (invoice, filename);
								}

								Session.Page.Lines.Add ("SUCCESS:"+ "TRUE");								
							}
							catch (Exception e)
							{
								Console.WriteLine (e);
								Session.Page.Lines.Add ("ERROR");
								return true;
							}
							break;
						}

				case "mailcreditnote":
						{
							try
							{
								string filename = SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_temp) + "/"+ Guid.NewGuid ();
								SNDK.IO.ByteArrayToFile (filename, Session.Request.QueryJar.Get ("file").BinaryData);



								try
								{
									Helpers.MailCreditnote (Creditnote.Load (new Guid (Session.Request.QueryJar.Get ("creditnoteid").Value)), filename);
								}
								catch
								{
									// TODO: remove this.
//									Invoice invoice = Invoice.Create (Auction.Load (new Guid (Session.Request.QueryJar.Get ("auctionid").Value)), Customer.Load (new Guid (Session.Request.QueryJar.Get ("customerid").Value)), true);
//									Helpers.MailInvoice (invoice, filename);
								}

								Session.Page.Lines.Add ("SUCCESS:"+ "TRUE");								
							}
							catch (Exception e)
							{
								Console.WriteLine (e);
								Session.Page.Lines.Add ("ERROR");
								return true;
							}
							break;
						}

						case "mailsalesagreement":
						{
							try
							{
								string filename = SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_temp) + "/"+ Guid.NewGuid ();
								SNDK.IO.ByteArrayToFile (filename, Session.Request.QueryJar.Get ("file").BinaryData);
																														
								Helpers.MailSalesAgreement (Customer.Load (new Guid (Session.Request.QueryJar.Get ("customerid").Value)), filename);
								
								Session.Page.Lines.Add ("SUCCESS:"+ "TRUE");								
							}
							catch (Exception e)
							{
								Console.WriteLine (e);
								Session.Page.Lines.Add ("ERROR");
								return true;
							}
							break;
						}

						case "mailsettlement":
						{
							try
							{
								string filename = SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_temp) + "/"+ Guid.NewGuid ();
								SNDK.IO.ByteArrayToFile (filename, Session.Request.QueryJar.Get ("file").BinaryData);
								
								Helpers.MailSettlement (Customer.Load (new Guid (Session.Request.QueryJar.Get ("customerid").Value)), filename);
								
								Session.Page.Lines.Add ("SUCCESS:"+ "TRUE");								
							}
							catch (Exception e)
							{
								Console.WriteLine (e);
								Session.Page.Lines.Add ("ERROR");
								return true;
							}
							break;
						}
					}
					break;
				}
					#endregion

				#region Settlement
			case "didius.settlement":
				switch (Method.ToLower ())
				{
				case "mailto":
				{
					try
					{
						Customer customer = Customer.Load (new Guid (Session.Request.QueryJar.Get ("customerid").Value));
						
						Console.WriteLine (Session.Request.QueryJar.Get ("pdf").BinaryContentType);

						List<SorentoLib.Tools.Helpers.SendMailAttatchment> attatchments = new List<SorentoLib.Tools.Helpers.SendMailAttatchment> ();
						attatchments.Add (new SorentoLib.Tools.Helpers.SendMailAttatchment (Session.Request.QueryJar.Get ("pdf").BinaryData, "afregning.pdf", Session.Request.QueryJar.Get ("pdf").BinaryContentType));
						
						SorentoLib.Tools.Helpers.SendMail ("robot@york-auktion.dk", customer.Email, "Faktura", "Her er din afregning!", false, attatchments);
						
						Session.Page.Lines.Add ("SUCCESS:"+ "TRUE");
					} catch
					{
						Session.Page.Lines.Add ("ERROR");
						return true;
					}
					
					return true;
				}
					
				default:
					return false;
				}
#endregion
			}
			
			return false;
		}
		#endregion
	}
}
