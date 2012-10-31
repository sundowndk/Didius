#BEGINSTYLES
.A4
{				
	width: 								200mm; 
	height: 							287mm; 
	
	font-family: verdana;
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

.InnerTable td
{
	margin: 						0px;
	padding: 						0px;		
	border: 						none;
}

.InnerTableCellLabel
{
	width: 							140px;

	font-size: 						14px;		
}

.InnerTableCellValue
{
	width: 							180px;
	
	font-size: 						14px;	
}
	
	
.CellBid
{
	width:							15mm;	
	
	vertical-align: 				top; 
	
	font-size: 						14px;
}

.CellBidder
{
	width:							15mm;	
	
	vertical-align: 				top; 
	
	font-size: 						14px;
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

// Bid
		<td class="CellBid ColumnHeader">
			Bud
		</td>

// BIDDER		
		<td class="CellBidder ColumnHeader">
			Køber
		</td>		
	</tr>

%%ROWS%%

#BEGINROW
// Columns
	<tr>
// CatalogNo
		<td class="CellCatalogNo">
			%%CATALOGNO%%
		</td>

// Description
		<td class="CellDescription">

// InnerTable
			<table class="InnerTable">

// ROW 1
				<tr>
					<td colspan="4">
						%%DESCRIPTION%%
					</td>
				</tr>

// ROW 2
				<tr>
					<td class="InnerTableCellLabel">
						Vurdering 1:
					</td>

					<td class="InnerTableCellValue">
						%%APPRAISAL1%%
					</td>

					<td class="InnerTableCellLabel">
						Vurdering 2:
					</td>

					<td class="InnerTableCellValue">
						%%APPRAISAL2%%
					</td>					
				</tr>

// ROW 3
				<tr>
					<td class="InnerTableCellLabel">
						Vurdering 3:
					</td>

					<td class="InnerTableCellValue">
						%%APPRAISAL3%%
					</td>

					<td class="InnerTableCellLabel">
						Minimums bud:
					</td>
		
					<td class="InnerTableCellValue">
						%%MINIMUMBID%%
					</td>					
				</tr>

// ROW 4
				<tr>
					<td class="InnerTableCellLabel">
						Kunde:
					</td>
		
					<td class="InnerTableCellValue">
						%%CUSTOMERNAME%%
					</td>
					
					<td class="InnerTableCellLabel">
						Kunde nr.:
					</td>

					<td class="InnerTableCellValue">
						%%CUSTOMERNO%%
					</td>					
				</tr>

// ROW 5
				<tr>					
					<td class="InnerTableCellLabel">
						Telefon:
					</td>

					<td class="InnerTableCellValue">
						%%CUSTOMERPHONE%%
					</td>

					<td class="InnerTableCellLabel">
						Email:
					</td>

					<td class="InnerTableCellValue">	
						%%CUSTOMEREMAIL%%
					</td>							
				</tr>
			</table>

		</td>

// Bid
		<td class="CellBid">							
			%%BIDAMOUNT%%
		</td>		

// Bidder		
		<td class="CellBidder">							
			%%BIDCUSTOMERNAME%%<br>
			%%BIDCUSTOMERNO%%			
		</td>		
	</tr>
#ENDROW

</table>

// Footer
<div id="PageFooter" class="PageFooter">
	Tilmeld dig vores nyhedsmail på www.york-auktion.dk, så for du automatisk besked om næste auktion<br>Side %%PAGENUMBER%%
</div>