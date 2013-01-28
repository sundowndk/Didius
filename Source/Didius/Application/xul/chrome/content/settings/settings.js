Components.utils.import("resource://didius/js/app.js");

var main =
{
	checksum : null,
	current : {},
	currentPage : null,		
		 
	init : function ()
	{		
		main.set ();		
		
//		app.events.onUserCreate.addHandler (this.eventHandlers.onUserCreate);
//		app.events.onUserSave.addHandler (this.eventHandlers.onUserSave);
//		app.events.onUserDestroy.addHandler (this.eventHandlers.onUserDestroy);
	},			
					
	eventHandlers :
	{
		onUserCreate : function (eventData)
		{
			main.access.usersTreeHelper.addRow ({data: eventData});
		},
	
		onUserSave : function (eventData)
		{			
			main.access.usersTreeHelper.setRow ({data: eventData});
		},
	
		onUserDestroy : function (eventData)
		{				
			main.access.usersTreeHelper.removeRow ({id: eventData.id});
		}		
	},	
				
	set : function ()
	{
		var keys = new Array ();
		keys[keys.length] = "didius_company_name";
		keys[keys.length] = "didius_company_address";
		keys[keys.length] = "didius_company_postcode";
		keys[keys.length] = "didius_company_city";
		keys[keys.length] = "didius_company_phone";
		keys[keys.length] = "didius_company_email";
		keys[keys.length] = "didius_text_auction_description";		
		keys[keys.length] = "didius_value_seller_commission_percentage";
		keys[keys.length] = "didius_value_seller_commission_minimum"; 
		keys[keys.length] = "didius_value_buyer_commission_percentage";
		keys[keys.length] = "didius_value_buyer_commission_minimum";
		keys[keys.length] = "didius_email_sender";
		keys[keys.length] = "didius_email_template_itemwon_subject";
		keys[keys.length] = "didius_email_template_itemwon_body";
		keys[keys.length] = "didius_email_template_itemwon_isbodyhtml";
		keys[keys.length] = "didius_email_template_outbid_subject";
		keys[keys.length] = "didius_email_template_outbid_body";
		keys[keys.length] = "didius_email_template_outbid_isbodyhtml";
		keys[keys.length] = "didius_email_template_invoice_subject";
		keys[keys.length] = "didius_email_template_invoice_body";
		keys[keys.length] = "didius_email_template_invoice_isbodyhtml";
		keys[keys.length] = "didius_email_template_settlement_subject";
		keys[keys.length] = "didius_email_template_settlement_body";
		keys[keys.length] = "didius_email_template_settlement_isbodyhtml";
		keys[keys.length] = "didius_email_template_salesagreement_subject";
		keys[keys.length] = "didius_email_template_salesagreement_body";
		keys[keys.length] = "didius_email_template_salesagreement_isbodyhtml";
		keys[keys.length] = "didius_email_template_creditnote_subject";
		keys[keys.length] = "didius_email_template_creditnote_body";
		keys[keys.length] = "didius_email_template_creditnote_isbodyhtml";
		keys[keys.length] = "didius_template_catalogsmall";
		keys[keys.length] = "didius_template_cataloglarge";
		keys[keys.length] = "didius_template_salesagreement";
		keys[keys.length] = "didius_template_settlement";
		keys[keys.length] = "didius_template_invoice";
		keys[keys.length] = "didius_template_creditnote";
	
		main.current = didius.settings.get ({keys: keys});
		
		main.checksum = SNDK.tools.arrayChecksum (main.current);
				
	
//		this.access.init ();		
	
		document.getElementById ("settingsMenu").selectedIndex = 0;										
		
		// COMPANY
		document.getElementById ("companyName").value = main.current.didius_company_name;
		document.getElementById ("companyAddress").value = main.current.didius_company_address;
		document.getElementById ("companyPostcode").value = main.current.didius_company_postcode;
		document.getElementById ("companyCity").value = main.current.didius_company_city;
		document.getElementById ("companyPhone").value = main.current.didius_company_phone;
		document.getElementById ("companyEmail").value = main.current.didius_company_email;
		
		// TEXTS
		document.getElementById ("auctionDescription").value = main.current.didius_text_auction_description;
		
		// VALUES
		document.getElementById ("valueSellerCommissionPercentage").value = main.current.didius_value_seller_commission_percentage;
		document.getElementById ("valueSellerCommissionMinimum").value = main.current.didius_value_seller_commission_minimum;			
		document.getElementById ("valueBuyerCommissionPercentage").value = main.current.didius_value_buyer_commission_percentage;
		document.getElementById ("valueBuyerCommissionMinimum").value = main.current.didius_value_buyer_commission_minimum;			
		
		// EMAIL
		document.getElementById ("emailSender").value = main.current.didius_email_sender;
		document.getElementById ("emailTemplateItemWonSubject").value = main.current.didius_email_template_itemwon_subject;
		document.getElementById ("emailTemplateItemWonBody").value = main.current.didius_email_template_itemwon_body;
		
		document.getElementById ("emailTemplateOutBidSubject").value = main.current.didius_email_template_outbid_subject;
		document.getElementById ("emailTemplateOutBidBody").value = main.current.didius_email_template_outbid_body;
				
		document.getElementById ("emailTemplateInvoiceSubject").value = main.current.didius_email_template_invoice_subject;
		document.getElementById ("emailTemplateInvoiceBody").value = main.current.didius_email_template_invoice_body;
		
		document.getElementById ("emailTemplateSettlementSubject").value = main.current.didius_email_template_settlement_subject;
		document.getElementById ("emailTemplateSettlementBody").value = main.current.didius_email_template_settlement_body;
		
		document.getElementById ("emailTemplateSalesAgreementSubject").value = main.current.didius_email_template_salesagreement_subject;
		document.getElementById ("emailTemplateSalesAgreementBody").value = main.current.didius_email_template_salesagreement_body;
		
		document.getElementById ("emailTemplateCreditnoteSubject").value = main.current.didius_email_template_creditnote_subject;
		document.getElementById ("emailTemplateCreditnoteBody").value = main.current.didius_email_template_creditnote_body;
		
		// TEMPLATES
		document.getElementById ("templatesCatalogSmall").value = main.current.didius_template_catalogsmall;
		document.getElementById ("templatesCatalogLarge").value = main.current.didius_template_cataloglarge;
		document.getElementById ("templatesSalesAgreement").value = main.current.didius_template_salesagreement;
		document.getElementById ("templatesSettlement").value = main.current.didius_template_settlement;
		document.getElementById ("templatesInvoice").value = main.current.didius_template_invoice;
		document.getElementById ("templatesCreditnote").value = main.current.didius_template_creditnote;		
	},
	
	get : function ()
	{
		// COMPANY
		main.current.didius_company_name = document.getElementById ("companyName").value;
		main.current.didius_company_address = document.getElementById ("companyAddress").value;
		main.current.didius_company_postcode = document.getElementById ("companyPostcode").value;
		main.current.didius_company_city = document.getElementById ("companyCity").value;
		main.current.didius_company_phone = document.getElementById ("companyPhone").value;
		main.current.didius_company_email = document.getElementById ("companyEmail").value;
		
		// TEXTS
		main.current.didius_text_auction_description = document.getElementById ("auctionDescription").value;
		
		// VALUES		
		main.current.didius_value_seller_commission_percentage = document.getElementById ("valueSellerCommissionPercentage").value;
		main.current.didius_value_seller_commission_minimum = document.getElementById ("valueSellerCommissionMinimum").value;			
		
		// EMAIL
		main.current.didius_email_sender = document.getElementById ("emailSender").value;
		main.current.didius_email_template_itemwon_subject = document.getElementById ("emailTemplateItemWonSubject").value;
		main.current.didius_email_template_itemwon_body = document.getElementById ("emailTemplateItemWonBody").value;
		
		main.current.didius_email_template_outbid_subject = document.getElementById ("emailTemplateOutBidSubject").value;
		main.current.didius_email_template_outbid_body = document.getElementById ("emailTemplateOutBidBody").value;
		
		main.current.didius_email_template_invoice_subject = document.getElementById ("emailTemplateInvoiceSubject").value;
		main.current.didius_email_template_invoice_body = document.getElementById ("emailTemplateInvoiceBody").value;
		
		main.current.didius_email_template_settlement_subject = document.getElementById ("emailTemplateSettlementSubject").value;
		main.current.didius_email_template_settlement_body = document.getElementById ("emailTemplateSettlementBody").value;
		
		main.current.didius_email_template_salesagreement_subject = document.getElementById ("emailTemplateSalesAgreementSubject").value;
		main.current.didius_email_template_salesagreement_body = document.getElementById ("emailTemplateSalesAgreementBody").value;
		
		main.current.didius_email_template_creditnote_subject = document.getElementById ("emailTemplateCreditnoteSubject").value;
		main.current.didius_email_template_creditnote_body = document.getElementById ("emailTemplateCreditnoteBody").value;
		
		// TEMPLATES
		main.current.didius_template_catalogsmall = document.getElementById ("templatesCatalogSmall").value;		
		main.current.didius_template_cataloglarge = document.getElementById ("templatesCatalogLarge").value;		
		main.current.didius_template_salesagreement = document.getElementById ("templatesSalesAgreement").value;		
		main.current.didius_template_settlement = document.getElementById ("templatesSettlement").value;		
		main.current.didius_template_invoice = document.getElementById ("templatesInvoice").value;				
		main.current.didius_template_creditnote = document.getElementById ("templatesCreditnote").value;				
	},
	
	onChange : function ()
	{		
		main.get ();
	
		if ((SNDK.tools.arrayChecksum (main.current) != main.checksum))
		{					
			document.getElementById ("close").disabled = false;
			document.getElementById ("save").disabled = false;			
		}
		else
		{				
			document.getElementById ("close").disabled = false;
			document.getElementById ("save").disabled = true;			
		}
							
		if (document.getElementById ("settingsMenu").selectedItem != null)
		{
			var page = document.getElementById ("settingsMenu").selectedItem.value;
			
			if (page != null)
			{
				main.setPage (page);
			}
		}
	},
	
	setPage : function (page)
	{		
		document.getElementById (page).setAttribute ("collapsed", false);
		
		if (main.currentPage != null && main.currentPage != page)
		{
			document.getElementById (main.currentPage).setAttribute ("collapsed", true);		
		}
		
		main.currentPage = page;
	},
	
	close : function (force)
	{	
		// If we are forced to close, then dont promt user about potential unsaved data.		
		if (!force)
		{	
			// If checksums do not match, promt user about unsaved data.
			if ((SNDK.tools.arrayChecksum (main.current) != main.checksum))
			{
				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			
				if (!prompts.confirm (null, "Ændringer ikke gemt", "Der er fortaget ændringer, der ikke er gemt, vil du forstætte ?"))
				{
					return false;
				}			
			}
		}
		
		// Unhook events.		
//		app.events.onUserCreate.removeHandler (main.eventHandlers.onUserCreate);				
//		app.events.onUserSave.removeHandler (main.eventHandlers.onUserSave);
//		app.events.onUserDestroy.removeHandler (main.eventHandlers.onUserDestroy);
							
		// Close window.
		window.close ();
	},
	
	save : function ()
	{
		main.get ();
		
		didius.settings.set ({keys: main.current});
		
		main.checksum = SNDK.tools.arrayChecksum (main.current);
		
		app.config = main.current;

		
		
		main.onChange ();
	},
	
	access :
	{
		usersTreeHelper : null,
		
		init : function ()
		{
			this.usersTreeHelper = new sXUL.helpers.tree ({element: document.getElementById ("users"), sort: "realname", sortDirection: "descending", onDoubleClick: main.access.userEdit});
			this.set ();
		},		
		
		set : function ()
		{
			var onDone = 	function (items)
							{															
								for (idx in items)
								{	
									main.access.usersTreeHelper.addRow ({data: items[idx]});
								}
								
								// Enable controls
								document.getElementById ("users").disabled = false;														
								main.access.onChange ();
							};

			// Disable controls
			document.getElementById ("users").disabled = true;					
			document.getElementById ("userCreate").disabled = true;			
			document.getElementById ("userEdit").disabled = true;
			document.getElementById ("userDestroy").disabled = true;
														
			didius.user.list ({async: true, onDone: onDone});
		},
		
		onChange : function ()
		{
			if (this.usersTreeHelper.getCurrentIndex () != -1)
			{					
				document.getElementById ("userCreate").disabled = false;
				document.getElementById ("userEdit").disabled = false;
				document.getElementById ("userDestroy").disabled = false;				
			}
			else
			{				
				document.getElementById ("userCreate").disabled = false;
				document.getElementById ("userEdit").disabled = true;
				document.getElementById ("userDestroy").disabled = true;				
			}
		},
		
		usersSort : function (attributes)
		{
			this.usersTreeHelper.sort (attributes);
		},
		
		userCreate : function ()
		{																													
			window.openDialog ("chrome://didius/content/settings/access/user/create.xul", "usercreate", "chrome,modal", null);
		},
		
		userEdit : function ()
		{
			var current = main.access.usersTreeHelper.getRow ();
																		
			window.openDialog ("chrome://didius/content/settings/access/user/edit.xul", current.id, "chrome,modal", {userId: current.id});
		},
		
		userDestroy : function ()
		{		
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService); 
			var result = prompts.confirm (null, "Slet bruger", "Er du sikker på du vil slette denne bruger ?");
			
			if (result)
			{
				try
				{									
					didius.user.delete (this.usersTreeHelper.getRow ().id);					
				}
				catch (error)
				{
					app.error ({exception: error})
				}								
			}		
		}		
	}
}