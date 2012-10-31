#BEGINSTYLES

body
{
	margin:					0px;
	padding:				0px;
	
	background-color:		#000000;
	
	overflow: hidden;
}

.Image
{
	width:					100%;
}


.ItemCatalogNo
{
	position:				absolute;
	top:					0px;
	left:					0px;
	
	padding:				25px;
	
	border-radius: 			0px 0px 40px 0px;

	font-family:			verdana;
	font-size: 				50px;	
	font-weight:			bold;
	
	background-color:		#000000;
	
	opacity: 0.8;
	
	
	color: #ffffff;
	text-transform:			uppercase;
}

.ItemDescription
{
	position:				absolute;
	bottom:					0px;
	right:					0px;
	
	width:					60%;
	
	padding:				25px;
	
	border-radius: 			40px 0px 0px 0px;

	font-family:			verdana;
	font-size: 				50px;	
	font-weight:			bold;
	
	background-color:		#000000;
	
	opacity: 0.8;
	
	
	color: #ffffff;
	text-transform:			uppercase;

}


#ENDSTYLES

// Header
<div>	
	<div id="ContainerItemCatalogNo" class="ItemCatalogNo">
		Katalog nr.:<span id="ItemCatalogNo"></span>
	</div>
	
	<div id="ContainerItemDescription" class="ItemDescription">
		<span id="ItemDescription"></span>
	</div>
	
	<img id="ItemPicture" class="Image" />	
</div>