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
	top:	 						220mm;	

	width: 							200mm;
	

	
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
	border-width:					1px;
	border-collapse:				collapse;
}

.TableRows
{
	margin: 						0px;		
	padding:					 	0px;
	
	width: 							100%;
	
	border-style: 					none none none none;
	border-collapse:				collapse;
}

.TableTransfer
{
	margin: 						0px;		
	padding:					 	0px;
	
	margin-top:						15px;
	
	width: 							100%;
	
	border-style: 					solid none solid none;
	border-width:					1px;
	border-collapse:				collapse;
}

.TableTotal
{
	margin: 						0px;		
	padding:					 	0px;
	
	margin-top:						20px;
	
	border-style: 					solid none none none;
	border-width:					1px;
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
	border-width:					1px;
}

.CellCatalogNo
{			
	width: 							15mm;

	vertical-align: 				top; 
}

.CellDescription
{	
	vertical-align: 				top; 
	
	width:							125mm;	
}	

.CellBidAmount
{
	width:							25mm;	

	vertical-align: 				top; 
	
	text-align:						right;
}

.CellCommissionFee
{
	width:							25mm;	

	vertical-align: 				top; 
	
	text-align:						right;
}

.CellTotalDescription
{
	text-align:						left;	
}

.CellTotalValue
{
	text-align:						right;	
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
				%%CUSTOMERNAME%%<br>
				%%CUSTOMERADDRESS%%<br>
				%%CUSTOMERPOSTCODE%% %%CUSTOMERCITY%%<br>
				%%CUSTOMERCOUNTRY%%<br>
				<br>
				Kunde nr.: %%CUSTOMERNO%%<br>
				<br>
				Telefon: %%CUSTOMERPHONE%%<br>
				Email: %%CUSTOMEREMAIL%%<br>
				<br>
				Sag: %%CASENO%% - %%CASETITLE%%<br><br><br>			
			</td>
			<td valign="top" align="right" style="width: 100mm">				
				Afregning: %%SETTLEMENTNO%%<br><br>
				Afregningskonto: %%CUSTOMERBANKACCOUNT%%
			</td>
		</tr>
	</table>
</div>

// Table
<table class="TableRows">
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
		<td class="CellBidAmount ColumnHeader">
			Pris
		</td>	

// CommissionFee
		<td class="CellCommissionFee ColumnHeader">
			Salær
		</td>		
	</tr>

%%ROWS%%	
</table>

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
		<td class="CellBidAmount">
			%%BIDAMOUNT%%
		</td>		

// CommissionFee
		<td class="CellCommissionFee">
			%%COMMISSIONFEE%%
		</td>			
	</tr>
#ENDROW

#BEGINTRANFER
<table class="TableTransfer">
	<tr>
		<td colspan="4">
			Overført
		</td>
	</tr>
</table>
#ENDTRANSFER

#BEGINTOTAL
<table class="TableTotal">
	<tr>
		<td class="CellTotalDescription">
			Salg
		</td>
		<td class="CellTotalValue" colspan="3">
			%%TOTALSALE%%
		</td>
	</tr>
	<tr>
		<td class="CellTotalDescription">
			Salær
		</td>
		<td class="CellTotalValue" colspan="3">
			%%TOTALCOMMISSIONFEE%%
		</td>
	</tr>
	<tr>
		<td class="CellTotalDescription">
			Moms
		</td>
		<td class="CellTotalValue" colspan="3">
			%%TOTALVAT%%
		</td>
	</tr>	
	<tr>
		<td class="CellTotalDescription">
			I alt
		</td>
		<td class="CellTotalValue" colspan="3">
			%%TOTALTOTAL%%
		</td>
	</tr>	
</table>
#ENDTOTAL

#BEGINDISCLAIMER
<br>
<br>
Effekterne afregnes under forudsætning af at ovennævnte er fri og ubehæftet af nogen art.<br>
Beløbet bankoverføres til den opgivne bankkonto. (3 - 5 bankdage fra modtagelse af denne opgørelse)<br>
Skulle der være tvivlsspørgsmål i afregningen, bedes du kontakte os inden 3 hverdage fra modtagelsen af denne
afregning på jm@york-auktion.dk, herefter vil beløbet blive overført til din konto.<br><br>
#ENDDISCLAIMER

// Footer
<div id="PageFooter" class="PageFooter">
	%%TRANSFER%%
	%%TOTAL%%
	%%DISCLAIMER%%
</div>
