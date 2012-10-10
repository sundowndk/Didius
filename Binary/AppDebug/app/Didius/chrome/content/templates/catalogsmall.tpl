#BEGINSTYLES
.A4
{				
	width: 								200mm; 
	height: 							287mm; 
}

.Page
{
	position:							relative;
			
	display: 							block;
	page-break-after:					always; 
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
	bottom: 						-30px;	

	width: 							200mm;
	
	text-align: 					center;	
	font-size: 						14px;
	font-weight:					bold;
}

.OuterTable, td, th
{
	margin: 						0px;		
	padding:					 	0px;
	
	border: 						1px solid black;
	border-collapse:				collapse;
				
	width: 							100%;
					
	font-size: 						14px;
}

.ColumnHeader
{
	font-weight:					bold;
}

.CellCatalogNo
{			
	width: 							15mm;

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
<div id="PageHeader" class="PageHeader">
	Auktionskatalog, Waldemarsvej 1, 4296 Nyrup Sjælland<br>%%AUCTIONDATE%%
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

#BEGINROWS
// Columns
	<tr>
// CatalogNo
		<td class="CellCatalogNo">
			%%CATALOGNO%%
		</td>

// Description
		<td class="CellDescription">
			%%DESCRIPTION%%
		</td>

// Notes
		<td class="CellNotes">
		</td>		
	</tr>
#ENDROWS

</table>

// Footer
<div id="PageFooter" class="PageFooter">
	Tilmeld dig vores nyhedsmail på www.york-auktion.dk, så for du automatisk besked om næste auktion<br>Side %%PAGENUMBER%%
</div>
