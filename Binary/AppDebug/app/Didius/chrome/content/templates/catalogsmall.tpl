#BEGINSTYLES
html
{
	margin: 						0px;
	padding: 						0px;		
}

body
{
	margin: 						0px;
	padding: 						0px;
}

.A4
{
	position:						relative;
	
	width: 							210mm; 
	height: 						296mm; 
	
	overflow: hidden;
	
	display: 						block;
	page-break-after:				always; 
}

.Page
{
	position:						relative;
	
	padding-top:					15mm;
	padding-left:					10mm;
	padding-right:					10mm;
	padding-bottom:					10mm;					
	
	font-family:					verdana;	
	font-size:						11px;
}

.PageHeader
{
	top: 							0px;
	
	padding-bottom: 				10px;

	text-align: 					center;	
	font-size: 						14px;
	font-weight: 					bold;
}

.PageFooter
{
	position:						absolute;		
	
	bottom: 						30mm;
		
	width:							190mm;
	height: 						8mm;
	
	text-align: 					center;	
	font-size: 						12px;
	font-weight:					bold;
	
	overflow: 						hidden;
}

.OuterTable, td, th
{
	margin: 						0px;		
	padding:					 	0px;
	
	border: 						1px solid black;
	border-collapse:				collapse;
				
	width: 							100%;						
	
	font-size: 11px;
}

.ColumnHeader
{
	font-weight:					bold;
}

.CellCatalogNo
{			
	width: 							20mm;

	vertical-align: 				top; 
}

.CellDescription
{
	width:							155mm;

	vertical-align: 				top; 
}	

.CellNotes
{
	width:							15mm;	

	vertical-align: 				top; 
}
#ENDSTYLES

// Header
<div id="Header" class="PageHeader">
	Auktionskatalog, Waldemarsvej 1, 4296 Nyrup Sjælland<br>%%AUCTIONBEGIN%% kl. %%AUCTIONBEGINTIME%%
</div>

// Table
<table class="OuterTable">
// ColumnHeader
	<tr>	
					
// CatalogNo
		<td class="CellCatalogNo ColumnHeader">
			Kat. nr.
		</td>

// Description							
		<td class="CellDescription ColumnHeader">
			Salgsgenstand
		</td>

// Notes
		<td class="CellNotes ColumnHeader">
			Notat
		</td>	
	</tr>

%%ROWS%%

#BEGINROW
// Columns
	<tr>
// CatalogNo
		<td class="CellCatalogNo">
			%%ITEMCATALOGNO%%
		</td>

// Description
		<td class="CellDescription">
			%%ITEMDESCRIPTION%% - %%ITEMVAT%%
		</td>

// Notes
		<td class="CellNotes">
		</td>		
	</tr>
#ENDROW

</table>

// Footer
<div id="Footer" class="PageFooter">
	Tilmeld dig vores nyhedsmail på www.york-auktion.dk, så for du automatisk besked om næste auktion<br>Side %%PAGENUMBER%%
</div>
