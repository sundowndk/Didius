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

.CellMinimumBid
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

.Disclaimer
{
	font-size: 13px;
	
	border-style: 					solid none none none;
	border-width:					1px;
	

}

.SignatureDate
{
	margin-top: 15mm;
	margin-left: 10mm;
	width: 100%;
}

.Signature
{
	float: left;

	margin-top:		35mm;
	
	margin-left: 	10mm;
	
	border-style: 	solid none none none;
	border-width: 	1px;
	
	width: 			80mm;
	
	text-align: center;
}

ul
{
	font-size: 12px;

}

li
{
	margin-bottom: 20px;

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
				<br>
				<br>
			</td>
			<td valign="top" align="right" style="width: 100mm">								
				Sag: %%CASENO%%<br>		
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

// MINIMUMBID
		<td class="CellMinimumBid ColumnHeader">
			Pris
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

// MINIMUMBID
		<td class="CellMinimumBid">
			%%MINIMUMBID%%
		</td>		
#ENDROW

#BEGINHASVATNO
<li>
	Rekvirent er moms registreret. CVR nr.: <b>%%VATNO%%</b>
</li>
#ENDHASVATNO

#BEGINDISCLAIMER
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
<span class="Disclaimer">
<ul>
	<li>
		Ovenst�ende effekter/maskiner borts�lges p� auktion d. <b>%%AUCTIONBEGIN%%</b> kl. <b>%%AUCTIONBEGINTIME%%</b>
	</li>
	<li>
		Auktionsadresse: %%AUCTIONLOCATION%%
	</li>
	<li>
		<b>%%CASECOMMISIONFEEPERCENTAGE%%%</b> af budsummen + moms tilfalder <b>York-auktion ApS</b>, dog min. <b>%%CASECOMMISIONFEEMINIMUM%% kr.</b> pr. katalog nummer.
	</li>
	<li>
		Effekter skal v�re Auktionsfirmaet i h�nde senest d. <b>%%AUCTIONDEADLINE%%</b> kl. <b>%%AUCTIONDEADLINETIME%%</b>
	</li>
	<li>
		S�fremt effekterne / maskinerne ikke borts�lges p.g.a ikke opn�et evt. mindstepris, beregnes et fremstillingsgebyr p� <b>kr. 100</b> + moms pr. katalog nummer.
	</li>
	<li>
		S�fremt rekvirent har indsat effekterne/maskinerne til mindste pris og selv byder med under auktionen, slettes mindsteprisen, og rekvirent skal herefter betale salgs- og k�bsal�r af opn�et budsum.
	</li>
	<li>
		Rekvirent / s�lger m� p� ingen m�de selv byde p� egne effekter / maskiner p� York-auktions hjemmeside.
	</li>
	<li>
		<b>Effekter under 5000.00 kr. betragtes som absolut bortsalg uden mindste pris.</b>
	</li>
	<li>
		Effekterne / maskinerne opretholder kun mindste pris p� f�rste auktion, derefter slettes den ved evt. n�stkommende auktion, s�fremt rekviret / s�lger ikke har anmodet om ny salgsaftale skriftligt.
	</li>
	<li>
		<b>Rekvirent / inds�tter har selv de indsatte effekter forsikret mod brand, vandskade og tyveri.</b>
	</li>
	<li>
		Opg�relse over solgte effekter vil blive fremsendt 30 hverdage efter auktionsdato.
	</li>
	<li>
		Afregning vil blive bankoverf�rt til <b>konto: %%CUSTOMERBANKACCOUNT%%</b>
	</li>
	%%HASVATNO%%
	<li>
		Rekvirent bekr�fter ved underskrift at effekterne kan s�lges som frie og ubeh�ftede af nogen art, samt at have modtaget en kopi af n�rv�rende salgs / indleveringsaftale.
	</li>
	<li>
		<b>EVT: MINDSTE PRISER SKAL OPGIVES SKRIFTLIGT VED INDLEVERING. ellers betragtes det som absolut bortsalg.</b>
	</li>
	<li>
		Evt. k�b af effekter p� auktionen, kan der ikke modregnes i evt. salg p� auktionen, alt k�b skal afregnes / betales if�lge York-aukions auktionsbetingelser.
	</li>	
</ul>

<div class="SignatureDate">
Dato: %%DATE%%
</div>

<div class="Signature">
%%CUSTOMERNAME%%<br>
%%CUSTOMERADDRESS%%<br>
%%CUSTOMERPOSTCODE%% %%CUSTOMERCITY%%<br>
%%CUSTOMERCOUNTRY%%<br>
</div>

<div class="Signature">
	York-Auktion ApS<br>
	Waldemarsvej 1<br>
	4296 Nyrup<br>
	70 20 36 06<br>	
</div>

</span>
#ENDDISCLAIMER

// Footer
<div id="PageFooter" class="PageFooter">
</div>
