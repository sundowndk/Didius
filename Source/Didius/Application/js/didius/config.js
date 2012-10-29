load : function ()
{
	var result = new Array ();

	result.companyname = sXUL.config.get ({key: "companyname"});
	result.companyaddress = sXUL.config.get ({key: "companyaddress"});
	result.companypostcode = sXUL.config.get ({key: "companypostcode"});
	result.companycity = sXUL.config.get ({key: "companycity"});
	result.companyphone = sXUL.config.get ({key: "companyphone"});
	result.companyemail = sXUL.config.get ({key: "companyemail"});
	
	result.commisionfeepercentage = sXUL.config.get ({key: "commisionfeepercentage"});
	result.commisionfeeminimum = sXUL.config.get ({key: "commisionfeeminimum"});
	
	return result;
},

save : function (config)
{
	for (idx in config)
	{		
		sXUL.console.log (idx +" "+ config[idx])
	
		sXUL.config.set ({key: idx, value: config[idx]});
	}
}			
