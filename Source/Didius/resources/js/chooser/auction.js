open : function (attributes)
{
	var chooser;
		
	var set =		function ()
					{
						var onDone =	function (result)
										{													
											chooser.getUIElement ("chooser").addItems (result);
										};
																									
						didius.auction.list ({async: true, onDone: onDone});					
					};
		
	var onChoose =	function ()
					{
						if (_attributes.onDone != null)
						{
							setTimeout (function () {_attributes.onDone ()});
						}
					};
		
		
	var onClose =	function ()
					{
						chooser.dispose ();
						
						if (_attributes.onDone != null)
						{
							setTimeout (function () {_attributes.onDone (null)});
						}
					};
					
	var onChange =	function ()
					{
						if (chooser.getUIElement ("auctions").getItem ())
						{		 						 				
 							chooser.getUIElement ("choose").setAttribute ("disabled", false);
 							
 						}
 						else
 						{
 							chooser.getUIElement ("choose").setAttribute ("disabled", true); 							
 						}
					};
					
	chooser = new SNDK.SUI.modal.chooser.base ({UIURL:  "xml/choosers/auction.xml", width: "450px", height: "600px"});
	
	chooser.getUIElement ("close").setAttribute ("onClick", close);
	chooser.getUIElement ("choose").setAttribute ("onClick", choose);
	
	chooser.open ();
}

