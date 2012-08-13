open : function (attributes)
{
	if (!attributes)
		attributes = new Array ();

	var chooser;	
	var result;
		
	var set =		function ()
					{
						var onDone =	function (result)
										{										
											chooser.getUIElement ("customers").addItems (result);
										};
																									
						didius.customer.list ({async: true, onDone: onDone});					
					};
		
	var onChoose =	function ()
					{		
						chooser.dispose ();
															
						if (attributes.onDone != null)
						{
							setTimeout (function () {attributes.onDone (didius.customer.load (result.id))});
						}
					};
		
		
	var onClose =	function ()
					{
						chooser.dispose ();
						
						if (attributes.onDone != null)
						{
							setTimeout (function () {attributes.onDone (null)});
						}
					};
					
	var onChange =	function ()
					{
						result = chooser.getUIElement ("customers").getItem ();
					
						if (result)
						{		 						 											
 							chooser.getUIElement ("choose").setAttribute ("disabled", false); 						
 						}
 						else
 						{
 							chooser.getUIElement ("choose").setAttribute ("disabled", true); 							
 						}
					};
					
	chooser = new SNDK.SUI.modal.chooser.base ({UIURL:  "xml/choosers/customer.xml", width: "450px", height: "600px"});
	
	chooser.getUIElement ("customers").setAttribute ("onChange", onChange);
	chooser.getUIElement ("customers").setAttribute ("onDoubleClick", onChoose);
	
	chooser.getUIElement ("close").setAttribute ("onClick", onClose);
	chooser.getUIElement ("choose").setAttribute ("onClick", onChoose);
	
	set ();
	
	chooser.open ();
}

