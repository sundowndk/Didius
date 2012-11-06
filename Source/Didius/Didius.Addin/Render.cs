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

						case "title":
						{
							return ((Didius.Auction)Variable).Title;
						}

						case "description":
						{
							return ((Didius.Auction)Variable).Description;
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

//						case "picture":
//						{
//							if (((Didius.Item)Variable).PictureId != Guid.Empty)
//							{
//								return SorentoLib.Media.Load (((Didius.Item)Variable).PictureId);
//							}
//							else
//							{
//								return SorentoLib.Media.Default ();
//							}
//						}
							
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
			}
			
			throw new SorentoLib.Exceptions.RenderExceptionMemberNotFound ();
		}
		#endregion
	}
}