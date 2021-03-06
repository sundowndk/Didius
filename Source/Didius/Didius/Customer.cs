// 
//  Customer.cs
//  
//  Author:
//      Rasmus Pedersen (rvp@qnax.net)
// 
//  Copyright (c) 2012 QNAX ApS
// 

using System;
using System.Xml;
using System.Collections;
using System.Collections.Generic;

using SNDK;
using SorentoLib;
using Paperboy;

namespace Didius
{
	public class Customer
	{
		#region Public Static Fields
		public static string DatastoreAisle = "didius_customers";
		#endregion
		
		#region Private Fields
		private Guid _id;

		private int _createtimestamp;
		private int _updatetimestamp;

		private string _no;

		private List<CustomerGroup> _groups;

		private string _name;
		private string _address1;
		private string _address2;
		private string _postcode;
		private string _city;
		private string _country;

		private string _att;

		private string _email;
		private string _phone;
		private string _mobile;	

//		private bool _newsemail;
		private bool _newssms;

		private bool _newsemail
		{
			get
			{
				bool result = false;

				if (this._email != string.Empty)
				{
//					try
//					{
//						if (Paperboy.Subscriber.Load (this._email).IsSubscribedTo (SorentoLib.Services.Settings.Get<Guid> (Enums.SettingsKey.didius_newsletter_paperboysubscriptionid)))
//						{
//							result = true;
//						}
//					}
//					catch {}
				}

				return result;
			}

			set
			{
				if (value)
				{
//					if (this._email != string.Empty)
//					{
//						Paperboy.Subscriber subscriber = null;
//
//						try
//						{
//							subscriber = Paperboy.Subscriber.Load (this._email);
//						}
//						catch (Exception exception)
//						{
//							subscriber = new Paperboy.Subscriber (this._email);
//						}
//
//						try
//						{
//							subscriber.Subscribe (SorentoLib.Services.Settings.Get<Guid> (Enums.SettingsKey.didius_newsletter_paperboysubscriptionid));
//							subscriber.Save ();
//						}
//						catch {}						
//					}
				}
				else
				{
//					if (this._email != string.Empty)
//					{
//						try
//						{
//							Paperboy.Subscriber subscriber = Paperboy.Subscriber.Load (this._email);
//							subscriber.UnSubscribe (SorentoLib.Services.Settings.Get<Guid> (Enums.SettingsKey.didius_newsletter_paperboysubscriptionid));
//							subscriber.Save ();
//						}
//						catch {}
//					}
				}
			}
		}


		private bool _vat;
		private string _vatno;

		private string _bankname;
		private string _bankregistrationno;
		private string _bankaccountno;

		private string _notes;

		private Enums.CustomerStatus _status;

		private Guid _userid;

		private string _groupsasstring
		{
			get
			{
				string result = string.Empty;
				foreach (CustomerGroup customergroup in this._groups)
				{
					// Remove duplicates
					if (result.Contains (customergroup.Id.ToString ()))
					{
						continue;
					}
					
					result += customergroup.Id.ToString () + ";";
				}
				
				return result;
			}
			
			set
			{
				this._groups.Clear ();
				
				foreach (string id in value.Split (";".ToCharArray (), StringSplitOptions.RemoveEmptyEntries))
				{
					try
					{
						this._groups.Add (CustomerGroup.Load (new Guid (id)));
					}
					catch
					{
						// LOG: LogError.UserLoadUsergroup
						SorentoLib.Services.Logging.LogError (string.Format (Strings.LogError.CustomerLoadCustomerGroup, this._id, id));
					}
				}
			}
		}
		#endregion

		#region Public Fields
		public Guid Id
		{
			get
			{
				return this._id;
			}
		}

		public int CreateTimestamp
		{
			get
			{
				return this._createtimestamp;
			}
		}

		public int UpdateTimestamp
		{
			get
			{
				return this._updatetimestamp;
			}
		}

		public string No
		{
			get
			{
				return this._no;
			}
		}

		public List<CustomerGroup> Groups
		{
			get
			{
				return this._groups;
			}
		}

		public string Name
		{
			get
			{
				return this._name;
			}

			set
			{
				this._name = value;
			}
		}

		public string Address1
		{
			get
			{
				return this._address1;
			}
			
			set
			{
				this._address1 = value;
			}
		}

		public string Address2
		{
			get
			{
				return this._address2;
			}
			
			set
			{
				this._address2 = value;
			}
		}

		public string PostCode
		{
			get
			{
				return this._postcode;
			}
			
			set
			{
				this._postcode = value;
			}
		}

		public string City
		{
			get
			{
				return this._city;
			}
			
			set
			{
				this._city = value;
			}
		}

		public string Country
		{
			get
			{
				return this._country;
			}
			
			set
			{
				this._country = value;
			}
		}

		public string Att
		{
			get
			{
				return this._att;
			}

			set
			{
				this._att = value;
			}
		}

		public string Phone
		{
			get
			{
				return this._phone;
			}
			
			set
			{
				this._phone = value;
			}
		}

		public string Mobile
		{
			get
			{
				return this._mobile;
			}
			
			set
			{
				this._mobile = value;
			}
		}

		public bool NewsEmail
		{
			get
			{
				return this._newsemail;
			}

			set
			{
				this._newsemail = value;
			}
		}

		public bool NewsSMS
		{
			get
			{
				return this._newssms;
			}

			set
			{
				this._newssms = value;
			}
		}

		public string Email
		{
			get
			{
				return this._email;
			}

			set
			{
				this._email = value;
			}
		}


		public bool Vat
		{
			get
			{
				return this._vat;
			}

			set
			{
				this._vat = value;
			}
		}

		public string VatNo
		{
			get
			{
				return this._vatno;
			}

			set
			{
				this._vatno = value;
			}
		}

		public string BankName
		{
			get
			{
				return this._bankname;
			}

			set
			{
				this._bankname = value;
			}
		}

		public string BankRegistrationNo
		{
			get
			{
				return this._bankregistrationno;
			}

			set
			{
				this._bankregistrationno = value;
			}
		}

		public string BankAccountNo
		{
			get
			{
				return this._bankaccountno;
			}

			set
			{
				this._bankaccountno = value;
			}
		}

		public string Notes
		{
			get
			{
				return this._notes;
			}

			set
			{
				this._notes = value;
			}
		}

		public Enums.CustomerStatus Status
		{
			get
			{
				Enums.CustomerStatus result = this._status;

				if (this._userid != Guid.Empty)
				{
					User user = User.Load (this._userid);

					if (user.Status == SorentoLib.Enums.UserStatus.Enabled)
					{
						result = Didius.Enums.CustomerStatus.Enabled;
					}
					else 
					{
						result = Didius.Enums.CustomerStatus.Disabled;
					}
				}

				return result;
			}

			set
			{
				if (this._userid != Guid.Empty)
				{
					User user = User.Load (this._userid);
					if (value == Enums.CustomerStatus.Enabled)
					{
						user.Status = SorentoLib.Enums.UserStatus.Enabled;
					}
					else 
					{
						user.Status = SorentoLib.Enums.UserStatus.Disabled;
					}
					user.Save ();
				}

				this._status = value;
			}
		}

		public Guid UserId
		{
			get
			{
				return this._userid;
			}
		}

		public SorentoLib.User User
		{
			get
			{
				if (this._userid != Guid.Empty)
				{
					return SorentoLib.User.Load (this._userid);
				}
				else
				{
					return null;
				}
			}

			set
			{
				if (value.Status != SorentoLib.Enums.UserStatus.NotVerified)
				{
					if (this._status == Enums.CustomerStatus.Enabled)
					{
						value.Status = SorentoLib.Enums.UserStatus.Enabled;
					}
					else 
					{
						value.Status = SorentoLib.Enums.UserStatus.Disabled;
					}
				}
					
				value.Save ();

				this._userid = value.Id;
			}

		}
		#endregion	
		
		#region Constructor
		public Customer ()
		{
			this._id = Guid.NewGuid ();
			
			this._createtimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();

			this._no = Helpers.NewNo ();

			this._groups = new List<CustomerGroup> ();

			this._name = string.Empty;
			this._address1 = string.Empty;
			this._address2 = string.Empty;
			this._postcode = string.Empty;
			this._city = string.Empty;
			this._country = string.Empty;

			this._att = string.Empty;

			this._email = string.Empty;
			this._phone = string.Empty;
			this._mobile = string.Empty;

			this._newssms = false;
			this._newsemail = false;

			this._vat = false;
			this._vatno = string.Empty;

			this._bankname = string.Empty;
			this._bankregistrationno = string.Empty;
			this._bankaccountno = string.Empty;

			this._notes = string.Empty;

			this._status = Enums.CustomerStatus.Enabled;

			this._userid = Guid.Empty;
		}
		#endregion
		
		#region Public Methods
		public void Save ()
		{
			try
			{
				this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();

				if (this._userid == Guid.Empty)
				{
					if (this._email != string.Empty)
					{
						SorentoLib.User user = new SorentoLib.User (this._email);
						user.Email = this._email;
						user.Realname = this._name;

						if (this.Status == Didius.Enums.CustomerStatus.Enabled)
						{
							user.Status = SorentoLib.Enums.UserStatus.Enabled;
						}
						else
						{
							user.Status = SorentoLib.Enums.UserStatus.Disabled;
						}

						user.Save ();
						this._userid = user.Id;
					}
				}
				else
				{
					if (this._email != string.Empty)
					{
						SorentoLib.User user = SorentoLib.User.Load (this._userid);
						user.Username = this._email;
						user.Email = this._email;
						user.Realname = this._name;
						user.Save ();
					}
					else
					{
						try
						{
							this._newsemail = false;
							SorentoLib.User.Delete (this._userid);
							this._userid = Guid.Empty;
						}
						catch {}
					}
				}
				
				Hashtable item = new Hashtable ();
				
				item.Add ("id", this._id);
				item.Add ("createtimestamp", this._createtimestamp);
				item.Add ("updatetimestamp", this._updatetimestamp);		

				item.Add ("no", this._no);

				item.Add ("groupids", this._groupsasstring);

				item.Add ("name", this._name);
				item.Add ("address1", this._address1);
				item.Add ("address2", this._address2);
				item.Add ("postcode", this._postcode);
				item.Add ("city", this._city);
				item.Add ("country", this._country);

				item.Add ("att", this._att);

				item.Add ("phone", this._phone);
				item.Add ("mobile", this._mobile);
				item.Add ("email", this._email);

//				item.Add ("newsemail", this._newsemail);
				item.Add ("newssms", this._newssms);

				item.Add ("vat", this._vat);
				item.Add ("vatno", this._vatno);

				item.Add ("bankname", this._bankname);
				item.Add ("bankregistrationno", this._bankregistrationno);
				item.Add ("bankaccountno", this._bankaccountno);

				item.Add ("notes", this._notes);

				item.Add ("status", this._status);

				item.Add ("userid", this._userid);

				SorentoLib.Services.Datastore.Meta meta = new SorentoLib.Services.Datastore.Meta ();
				meta.Add ("customergroupids", this._groupsasstring);
				meta.Add ("userid", this._userid);

				SorentoLib.Services.Datastore.Set (DatastoreAisle, this._id.ToString (), SNDK.Convert.ToXmlDocument (item, this.GetType ().FullName.ToLower ()), meta);
			}
			catch (Exception exception)
			{
				Console.WriteLine (exception);

				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.CUSTOMER", exception.Message));
				
				// EXCEPTION: Exception.PageSave
				throw new Exception (string.Format (Strings.Exception.CustomerSave, this._id.ToString ()));
			}					
		}

		public XmlDocument ToXmlDocument ()
		{
			Hashtable result = new Hashtable ();
			
			result.Add ("id", this._id);
			result.Add ("createtimestamp", this._createtimestamp);
			result.Add ("updatetimestamp", this._updatetimestamp);

			result.Add ("no", this._no);

			result.Add ("groups", this._groups);

			result.Add ("name", this._name);
			result.Add ("address1", this._address1);
			result.Add ("address2", this._address2);
			result.Add ("postcode", this._postcode);
			result.Add ("city", this._city);
			result.Add ("country", this._country);

			result.Add ("att", this._att);

			result.Add ("phone", this._phone);
			result.Add ("mobile", this._mobile);
			result.Add ("email", this._email);

			result.Add ("newsemail", this._newsemail);
			result.Add ("newssms", this._newssms);

			result.Add ("vat", this._vat);
			result.Add ("vatno", this._vatno);

			result.Add ("bankname", this._bankname);
			result.Add ("bankregistrationno", this._bankregistrationno);
			result.Add ("bankaccountno", this._bankaccountno);

			result.Add ("notes", this._notes);

			result.Add ("status", this.Status);

			result.Add ("userid", this._userid);
			
			return SNDK.Convert.ToXmlDocument (result, this.GetType ().FullName.ToLower ());
		}
		#endregion

		#region Public Static Methods
		public static Customer Load (SorentoLib.User User)
		{
			return Load (Guid.Empty, User);
		}

		public static Customer Load (Guid Id)
		{
			return Load (Id, null);
		}

		private static Customer Load (Guid Id, SorentoLib.User User)
		{
			Customer result;
			
			try
			{
				Hashtable item;

				if (Id != Guid.Empty)
				{
					item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (SorentoLib.Services.Datastore.Get<XmlDocument> (DatastoreAisle, Id.ToString ()).SelectSingleNode ("(//didius.customer)[1]")));
				}
				else
				{				
					item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (SorentoLib.Services.Datastore.Get<XmlDocument> (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("userid", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Equal, User.Id)).SelectSingleNode ("(//didius.customer)[1]")));
				}

				result = new Customer ();
				
				result._id = new Guid ((string)item["id"]);
				
				if (item.ContainsKey ("createtimestamp"))
				{
					result._createtimestamp = int.Parse ((string)item["createtimestamp"]);
				}
				
				if (item.ContainsKey ("updatetimestamp"))
				{
					result._updatetimestamp = int.Parse ((string)item["updatetimestamp"]);
				}

				if (item.ContainsKey ("no"))
				{					
					result._no = (string)item["no"];
				}

				if (item.ContainsKey ("groupids"))
				{					
					result._groupsasstring = (string)item["groupids"];
				}

				if (item.ContainsKey ("name"))
				{					
					result._name = (string)item["name"];
				}
				
				if (item.ContainsKey ("address1"))
				{
					result._address1 = (string)item["address1"];
				}
				
				if (item.ContainsKey ("address2"))
				{
					result._address2 = (string)item["address2"];
				}
				
				if (item.ContainsKey ("postcode"))
				{
					result._postcode = (string)item["postcode"];
				}

				if (item.ContainsKey ("city"))
				{
				result._city = (string)item["city"];
				}
				
				if (item.ContainsKey ("country"))
				{
					result._country = (string)item["country"];
				}							

				if (item.ContainsKey ("att"))
				{
					result._att = (string)item["att"];
				}							

				if (item.ContainsKey ("phone"))
				{
					result._phone = (string)item["phone"];
				}

				if (item.ContainsKey ("mobile"))
				{
					result._mobile = (string)item["mobile"];
				}

				if (item.ContainsKey ("email"))
				{
					result._email = (string)item["email"];
				}

//				if (item.ContainsKey ("phonenumbers"))
//				{
//					result._phonenumbers = new List<string> ();						
//					foreach (XmlDocument phonenumber in (List<XmlDocument>)item["phonenumbers"])
//					{					
//						result._phonenumbers.Add ((string)((Hashtable)SNDK.Convert.FromXmlDocument (phonenumber))["value"]);
//					}
//				}	

//				if (item.ContainsKey ("newsemail"))
//				{
//					result._newsemail = (bool)item["newsemail"];
//				}

				if (item.ContainsKey ("newssms"))
				{
					result._newssms = (bool)item["newssms"];
				}

				if (item.ContainsKey ("vat"))
				{
					result._vat = (bool)item["vat"];
				}

				if (item.ContainsKey ("vatno"))
				{
					result._vatno = (string)item["vatno"];
				}

				if (item.ContainsKey ("bankname"))
				{
					result._bankname = (string)item["bankname"];
				}

				if (item.ContainsKey ("bankregistrationno"))
				{
					result._bankregistrationno = (string)item["bankregistrationno"];
				}

				if (item.ContainsKey ("bankaccountno"))
				{
					result._bankaccountno = (string)item["bankaccountno"];
				}

				if (item.ContainsKey ("notes"))
				{
					result._notes = (string)item["notes"];
				}

				if (item.ContainsKey ("status"))
				{
					result._status = SNDK.Convert.StringToEnum<Enums.CustomerStatus> ((string)item["status"]);
				}

				if (item.ContainsKey ("userid"))
				{
					result._userid = new Guid ((string)item["userid"]);
				}
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.CUSTOMER", exception.Message));

				if (Id != Guid.Empty)
				{
					// EXCEPTION: Excpetion.PageLoadName
					throw new Exception (string.Format (Strings.Exception.CustomerLoadGuid, Id));
				}
				else
				{
					// EXCEPTION: Excpetion.PageLoadName
					throw new Exception (string.Format (Strings.Exception.CustomerLoadUserId, User.Id));
				}
			}	
			
			return result;
		}

		public static void Delete (Guid Id)
		{
			Customer customer = Customer.Load (Id);

			if (Case.List (customer).Count > 0)
			{
				// EXCEPTION: Exception.CustomerDeleteHasRelations
				throw new Exception (string.Format (Strings.Exception.CustomerDeleteHasRelations, Id.ToString ()));
			}

			if (Invoice.List (customer).Count > 0)
			{
				// EXCEPTION: Exception.CustomerDeleteHasRelations
				throw new Exception (string.Format (Strings.Exception.CustomerDeleteHasRelations, Id.ToString ()));
			}

			if (Creditnote.List (customer).Count > 0)
			{
				// EXCEPTION: Exception.CustomerDeleteHasRelations
				throw new Exception (string.Format (Strings.Exception.CustomerDeleteHasRelations, Id.ToString ()));
			}

			if (Bid.List (customer).Count > 0)
			{
				// EXCEPTION: Exception.CustomerDeleteHasRelations
				throw new Exception (string.Format (Strings.Exception.CustomerDeleteHasRelations, Id.ToString ()));
			}

			if (AutoBid.List (customer).Count > 0)
			{
				// EXCEPTION: Exception.CustomerDeleteHasRelations
				throw new Exception (string.Format (Strings.Exception.CustomerDeleteHasRelations, Id.ToString ()));
			}

			try
			{
				SorentoLib.User.Delete (Customer.Load (Id)._userid);

				SorentoLib.Services.Datastore.Delete (DatastoreAisle, Id.ToString ());
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.CUSTOMER", exception.Message));
				
				// EXCEPTION: Exception.PageDelete
				throw new Exception (string.Format (Strings.Exception.CustomerDeleteGuid, Id.ToString ()));
			}			
		}

		public static List<Customer> List (CustomerGroup CustomerGroup)
		{
			return List (CustomerGroup.Id);
		}
		
		public static List<Customer> List (Guid CustomerGroupId)
		{
			List<Customer> result = new List<Customer> ();
			
//			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("customergroupids", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Contains, CustomerGroupId)))
			foreach (SorentoLib.Services.DatastoreItem item in SorentoLib.Services.Datastore.ListOfShelfsNew (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("customergroupids", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Contains, CustomerGroupId)))
			{
				try
				{
//					result.Add (Load (new Guid (id)));
					result.Add (FromXmlDocument (item.Get<XmlDocument> (), true));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.CUSTOMER", exception.Message));
					
					// LOG: LogDebug.CustomerList
//					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.CustomerList, id));
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.CustomerList, item.Id));
				}
			}
			
			return result;
		}

		public static List<Customer> List ()
		{
			List<Customer> result = new List<Customer> ();
			
//			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle))
			foreach (SorentoLib.Services.DatastoreItem item in SorentoLib.Services.Datastore.ListOfShelfsNew (DatastoreAisle))
			{
				try
				{
//					result.Add (Load (new Guid (id)));
					result.Add (FromXmlDocument (item.Get<XmlDocument> (), true));				
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.CUSTOMER", exception.Message));
					
					// LOG: LogDebug.PageList
//					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.CustomerList, id));
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.CustomerList, item.Id));
				}
			}
					
			return result;
		}

		public static Customer FromXmlDocument (XmlDocument xmlDocument)
		{
			return FromXmlDocument (xmlDocument, false);
		}

		private static Customer FromXmlDocument (XmlDocument xmlDocument, bool skip)
		{
			Hashtable item;
			Customer result = new Customer ();
			
			try
			{
				item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (xmlDocument.SelectSingleNode ("(//didius.customer)[1]")));
			}
			catch
			{
				item = (Hashtable)SNDK.Convert.FromXmlDocument (xmlDocument);
			}
			
			if (item.ContainsKey ("id"))
			{
				result._id = new Guid ((string)item["id"]);
			}
			else
			{
				throw new Exception (string.Format (Strings.Exception.CustomerFromXmlDocument, "ID"));
			}
			
			if (item.ContainsKey ("createtimestamp"))
			{
				result._createtimestamp = int.Parse ((string)item["createtimestamp"]);
			}
			
			if (item.ContainsKey ("updatetimestamp"))
			{
				result._updatetimestamp = int.Parse ((string)item["updatetimestamp"]);
			}

			if (item.ContainsKey ("no"))
			{
				result._no = (string)item["no"];
			}		

			if (item.ContainsKey ("groups"))
			{
				result._groups.Clear ();
				
				foreach (XmlDocument customergroup in (List<XmlDocument>)item["groups"])
				{
					result._groups.Add (CustomerGroup.FromXmlDocument (customergroup));
				}
			}
			
			if (item.ContainsKey ("name"))
			{
				result._name = (string)item["name"];
			}

			if (item.ContainsKey ("address1"))
			{
				result._address1 = (string)item["address1"];
			}

			if (item.ContainsKey ("address2"))
			{
				result._address2 = (string)item["address2"];
			}

			if (item.ContainsKey ("postcode"))
			{
				result._postcode = (string)item["postcode"];
			}

			if (item.ContainsKey ("city"))
			{
				result._city = (string)item["city"];
			}

			if (item.ContainsKey ("postcode"))
			{
				result._postcode = (string)item["postcode"];
			}

			if (item.ContainsKey ("country"))
			{
				result._country = (string)item["country"];
			}

			if (item.ContainsKey ("att"))
			{
				result._att = (string)item["att"];
			}

			if (item.ContainsKey ("phone"))
			{
				result._phone = (string)item["phone"];
			}

			if (item.ContainsKey ("mobile"))
			{
				result._mobile = (string)item["mobile"];
			}

			if (item.ContainsKey ("email"))
			{
				result._email = (string)item["email"];
			}

//			if (item.ContainsKey ("phonenumbers"))
//			{
//				result._phonenumbers = new List<string> ();						
//				foreach (XmlDocument phonenumber in (List<XmlDocument>)item["phonenumbers"])
//				{					
//					result._phonenumbers.Add ((string)((Hashtable)SNDK.Convert.FromXmlDocument (phonenumber))["value"]);
//				}
//			}	

			if (item.ContainsKey ("newsemail"))
			{
				result._newsemail = (bool)item["newsemail"];
			}

			if (item.ContainsKey ("newssms"))
			{
				result._newssms = (bool)item["newssms"];
			}

			if (item.ContainsKey ("vat"))
			{
				result._vat = (bool)item["vat"];
			}
			
			if (item.ContainsKey ("vatno"))
			{
				result._vatno = (string)item["vatno"];
			}
			
			if (item.ContainsKey ("bankname"))
			{
				result._bankname = (string)item["bankname"];
			}
			
			if (item.ContainsKey ("bankregistrationno"))
			{
				result._bankregistrationno = (string)item["bankregistrationno"];
			}
			
			if (item.ContainsKey ("bankaccountno"))
			{
				result._bankaccountno = (string)item["bankaccountno"];
			}
			
			if (item.ContainsKey ("notes"))
			{
				result._notes = (string)item["notes"];
			}

			if (item.ContainsKey ("userid"))
			{
				result._userid = new Guid ((string)item["userid"]);
			}

			if (item.ContainsKey ("status"))
			{
				if (skip)
				{
					result._status = SNDK.Convert.StringToEnum<Enums.CustomerStatus> ((string)item["status"]);
				}
				else
				{
					result.Status = SNDK.Convert.StringToEnum<Enums.CustomerStatus> ((string)item["status"]);
				}
			}
			
			return result;
		}
		#endregion
	}
}

