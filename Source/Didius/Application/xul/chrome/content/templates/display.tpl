#BEGINSTYLES

body
{
	margin:					0px;
	padding:				0px;
	
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
	
	<img id="ItemPicture" class="Image" />
</div>