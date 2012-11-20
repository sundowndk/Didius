#BEGINSTYLES

html
{
	margin: 0px;
	padding: 0px;

}

body
{
	margin: 0px;
	padding: 0px;

}

.A4
{				
	width: 								210mm; 
	height: 							296mm; 
	
	display: 							block;
	page-break-after:					always; 
}

.Page
{
	position:							relative;
	
	padding-top:						15mm;
	padding-left:						7mm;
	padding-right:						0mm;
	padding-bottom:						0mm;
			
	font-family:verdana;
}


.Label
{	
	display: inline-block;
	padding: 0px;	
	
	margin-right: 1mm;
	padding: 1mm;

	font-size:							11px;
	
	width: 								62mm;
	height: 							35mm;
	
	overflow: hidden;
}

.Label .CatalogNo
{
	font-size: 13px;
	font-weight: bold;
}

.Label .No
{
	font-size: 13px;
	font-weight: bold;
}

.Label .VAT
{	
	font-weight: bold;
}
#ENDSTYLES

%%ROWS%%

#BEGINROW
<div class="Label">
	<span class="CatalogNo">Katalog nr.: %%ITEMCATALOGNO%%</span><br>
	<span class="No">Effekt nr.: %%ITEMNO%%</span><br>
	%%ITEMDESCRIPTION%%<br><br>
	<span class="VAT">%%ITEMVAT%%</span>
</div>
#ENDROW


