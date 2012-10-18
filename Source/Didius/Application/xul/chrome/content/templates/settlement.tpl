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
	
	text-align: 					right;	
	font-size: 						14px;
	font-weight:					bold;
}

.PageHeaderTable, td, th
{
	margin: 						0px;		
	padding:					 	0px;
	
	border-style: 					none;
	border-collapse:				collapse;
}

.InfoTable
{
	margin: 						0px;		
	padding:					 	0px;
	
	border-style: 					solid none none none;
	border-collapse:				collapse;
}

.LinesTable
{
	margin: 						0px;		
	padding:					 	0px;
	
	border-style: 					none none none none;
	border-collapse:				collapse;
}

.totalTable
{
	margin: 						0px;		
	padding:					 	0px;
	
	margin-top:						20px;
	
	border-style: 					solid none none none;
	border-collapse:				collapse;
}


.OuterTable, td, th
{
	margin: 						0px;		
	padding:					 	0px;
	
	border-collapse:				collapse;
				
	width: 							100%;
					
	font-size: 						14px;
}

.ColumnHeader
{
	font-weight:					bold;
	
	border-style: 					none none solid none;
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
	<table class="PageHeaderTable">
		<tr>
			<td valign="top" style="width: 80mm">
				<h1>York-auktion ApS</h1>
			</td>
			<td valign="top" style="width: 60mm">
				Waldemarsvej 1<br>
				4296 Nyrup<br>
				Tlf. 70 20 36 06<br>
				Fax. 57 80 36 06<br>
				Mobil. 50 50 37 06<br>
				CVR-nr. 27981488<br>
				Bank. 2376-0122581799
			</td>
			<td valign="top" style="width: 60mm">			
				Auktionshal:<br>
				Waldemarsvej 1<br>
				4296 Nyrup<br>
				Tlf. 50 50 37 06<br>
				Fax. 57 80 36 06<br>
			</td>
		</tr>
	</table>	
</div>

<div>
	<table class="InfoTable">
		<tr>
			<td valign="top" align="left" style="width: 100mm">
				%%CUSTOMERINFO%%
			</td>
			<td valign="top" align="right" style="width: 100mm">
				Afregningskonto: %%CUSTOMERBANKACCOUNT%%
			</td>
		</tr>
	</table>
</div>

// Table
<table class="LinesTable">
// ColumnHeader
	<tr>					
// CatalogNo
		<td class="CellCatalogNo ColumnHeader">
			Kat.nr.
		</td>

// Description
		<td class="CellDescription ColumnHeader">
			Salgsgenstand
		</td>

// BidAmount
		<td class="CellNotes ColumnHeader">
			Pris
		</td>	

// CommissionFee
		<td class="CellNotes ColumnHeader">
			Salær
		</td>		
</tr>

%%ROWS%%

%%DISCLAIMER%%

#BEGINROW
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

// BidAmount
		<td class="CellNotes">
			%%BIDAMOUNT%%
		</td>		

// CommissionFee
		<td class="CellNotes">
			%%COMMISSIONFEE%%
		</td>			
	</tr>
#ENDROW
</table>

#BEGINTOTAL
<table class="totalTable">
	<tr>
		<td >
			Salg
		</td>
		<td colspan="3">
			%%TOTALSALE%%
		</td>
	</tr>
	<tr>
		<td>
			Salære
		</td>
		<td colspan="3">
			%%TOTALCOMMISSIONFEE%%
		</td>
	</tr>
	<tr>
		<td>
			I alt
		</td>
		<td colspan="3">
			%%TOTALTOTAL%%
		</td>
	</tr>	
</table>
#ENDTOTAL

#BEGINDISCLAIMER
Effekterne afregnes under forudsætning af at ovennævnte er fri og ubehæftet af nogen art.<br>
Beløbet bankoverføres til den opgivne bankkonto. (3 - 5 bankdage fra modtagelse af denne opgørelse)<br>
Skulle der være tvivlsspørgsmål i afregningen, bedes du kontakte os inden 3 hverdage fra modtagelsen af denne
afregning på jm@york-auktion.dk, herefter vil beløbet blive overført til din konto.<br><br>

Næste auktion i Nyrup: %%NEXTAUCTIONDATE%%<br><br>
#ENDDISCLAIMER

// Footer
<div id="PageFooter" class="PageFooter">
	Side %%PAGENUMBER%%
</div>
