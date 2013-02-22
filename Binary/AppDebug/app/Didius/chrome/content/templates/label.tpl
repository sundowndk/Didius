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
	width: 								100mm; 
	height: 							62mm; 
	
	display: 							block;
	page-break-after:					always; 
}

.Page
{
	position:							relative;
	
	padding-top:						0mm;
	padding-left:						0mm;
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
	
	width: 								100mm;
	height: 							62mm;
	
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

<div class="Label">
Kunde nr. %%CUSTOMERNAMENO%%<br>
Effekt nr. %%ITEMNO%%<br>
Katalog nr. %%ITEMCATALOGNO%%<br>
%%ITEMDESCRIPTION%%
</div>



