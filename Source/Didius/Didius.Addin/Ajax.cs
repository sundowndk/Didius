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
							result.Add (Customer.List ());
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
							result.Add (new Case (request.getValue<Guid>("customerid")));
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
							result.Add (new Item (request.getValue<Guid>("caseid")));
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
							if (request.ContainsXPath ("caseid"))
							{
								result.Add (Item.List (request.getValue<Guid> ("caseid")));
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

				#region Didius.Bid
				case "didius.bid":
				{	
					switch (Method.ToLower ())
					{						
						case "create":
						{
							result.Add (new Item (request.getValue<Guid>("itemid")));
							break;
						}		
							
						case "load":
						{
							result.Add (Item.Load (request.getValue<Guid>("id")));
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
								result.Add (Item.List (request.getValue<Guid> ("itemid")));
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
			}
			
			return result;
		}
		#endregion
	}
}
