// 
//  Runtime.cs
//  
//  Author:
//      Rasmus Pedersen (rvp@qnax.net)
// 
//  Copyright (c) 2012 QNAX ApS
// 

using System;
using System.Collections;

namespace Didius
{
	public static class Runtime
	{
		#region Public Static Fields
		#endregion
		
		#region Public Static Methods
		public static void Initialize ()
		{	
			// Set default settings.
			foreach (Enums.SettingsKey key in Enum.GetValues (typeof (Enums.SettingsKey)))
			{
				if (!SorentoLib.Services.Settings.Exist (key))
				{
					SorentoLib.Services.Settings.Set (key, defaults[key]);
					
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ServiceSettingsDefaultSet, key.ToString ().ToLower ()));
				}
			}

			// Remove current symlinks
			SNDK.IO.RemoveSymlink (SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_content) + "/didius");
			SNDK.IO.RemoveSymlink (SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_html) + "/didius");
			SNDK.IO.RemoveSymlink (SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_script) + "didius");

			// Create symlinks
			SNDK.IO.CreateSymlink (SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_addins) + "Didius/resources/content", SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_content) + "/didius");
			//SNDK.IO.CreateSymlink (SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_addins) + "Didius/resources/htdocs", SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_html) + "/didius");
			SNDK.IO.CreateSymlink (SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_addins) + "Didius/resources/scripts", SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_script) + "didius");	

//			SNDK.IO.CreateSymlink (SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_addins) + "sCMS/resources/xml", SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_addins) + "sConsole/resources/xml/scms");

			// GARBAGE COLLECTOR
			SorentoLib.Services.Events.ServiceGarbageCollector += EventhandlerServiceGarbageCollector;		
		}	
		#endregion

		public static Hashtable defaults = new Hashtable ()
		{
			{ Enums.SettingsKey.didius_company_name, string.Empty },
		
			{ Enums.SettingsKey.didius_company_address, string.Empty },
			{ Enums.SettingsKey.didius_company_postcode, string.Empty },
			{ Enums.SettingsKey.didius_company_city, string.Empty },
			{ Enums.SettingsKey.didius_company_phone, string.Empty },
			{ Enums.SettingsKey.didius_company_email, string.Empty },

			{ Enums.SettingsKey.didius_text_auction_description, string.Empty },

			{ Enums.SettingsKey.didius_value_seller_commission_percentage, 15 },
			{ Enums.SettingsKey.didius_value_seller_commission_minimum, 100 },
			{ Enums.SettingsKey.didius_value_buyer_commission_percentage, 15 },
			{ Enums.SettingsKey.didius_value_buyer_commission_minimum, 100 },
			{ Enums.SettingsKey.didius_value_vat_percentage, 25 },

			{ Enums.SettingsKey.didius_email_sender, string.Empty },
			{ Enums.SettingsKey.didius_email_template_itemwon_subject, string.Empty },
			{ Enums.SettingsKey.didius_email_template_itemwon_body, string.Empty },
			{ Enums.SettingsKey.didius_email_template_itemwon_isbodyhtml, false },
			{ Enums.SettingsKey.didius_email_template_outbid_subject, string.Empty },
			{ Enums.SettingsKey.didius_email_template_outbid_body, string.Empty },
			{ Enums.SettingsKey.didius_email_template_outbid_isbodyhtml, false },
			{ Enums.SettingsKey.didius_email_template_invoice_subject, string.Empty },
			{ Enums.SettingsKey.didius_email_template_invoice_body, string.Empty },
			{ Enums.SettingsKey.didius_email_template_invoice_isbodyhtml, false },
			{ Enums.SettingsKey.didius_email_template_settlement_subject, string.Empty },
			{ Enums.SettingsKey.didius_email_template_settlement_body, string.Empty },
			{ Enums.SettingsKey.didius_email_template_settlement_isbodyhtml, false },
			{ Enums.SettingsKey.didius_email_template_salesagreement_subject, string.Empty },
			{ Enums.SettingsKey.didius_email_template_salesagreement_body, string.Empty },
			{ Enums.SettingsKey.didius_email_template_salesagreement_isbodyhtml, false },
			{ Enums.SettingsKey.didius_email_template_creditnote_subject, string.Empty },
			{ Enums.SettingsKey.didius_email_template_creditnote_body, string.Empty },
			{ Enums.SettingsKey.didius_email_template_creditnote_isbodyhtml, false },

			{ Enums.SettingsKey.didius_template_salesagreement, string.Empty },
			{ Enums.SettingsKey.didius_template_catalogsmall, string.Empty },
			{ Enums.SettingsKey.didius_tamplate_cataloglarge, string.Empty },
			{ Enums.SettingsKey.didius_template_settlement, string.Empty },
			{ Enums.SettingsKey.didius_template_invoice, string.Empty },
			{ Enums.SettingsKey.didius_template_creditnote, string.Empty },
			{ Enums.SettingsKey.didius_template_display, string.Empty },

			{ Enums.SettingsKey.didius_item_datafields, "stelnummer;Stelnummer|aargang;Årgang|regnr;Reg.nr" }
		};

		static void EventhandlerServiceGarbageCollector (object Sender, EventArgs E)
		{
			Item.ServiceGarbageCollector ();
		}
	}
}

