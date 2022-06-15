$( document ).ready(function() {
	
   if(localStorage.getItem("tempIco") != null)
    {
    $("#inputICO").val(localStorage.getItem("tempIco"));
    }
	
	if(localStorage.getItem("email") != null)
    {
    $("#email").val(localStorage.getItem("email"));
    }
	
	if (localStorage.getItem("usedIco") != null)
	{
	var ico = JSON.parse(localStorage.getItem("usedIco"));
		for (var index = ico.length; index > 0; index--) 
		{
		$("#usedIco").append('<option value="'+ico[index-1]+'">'); 
		}
	}

	$('#inputICO').change(function()
    {
    localStorage.setItem("tempIco", $('#inputICO').val());	
    });
 
	$('#email').change(function()
    {
    localStorage.setItem("email", $('#email').val());
    });

});

//nemoze byt viac ako 50 poloziek v SessionStorage	
function checkStorageLength(qrScanner){
	if(sessionStorage.length >=50) { 
	$("#detailModalLabel").html("Máte v pamäti uložených 50 dokladov na import! Uvoľnite pamäť a pokračujte v skenovaní.");
	//$("#detailModal .modal-content").prepend('<div class="modal-header" id="blocekHeader"><h6 class="modal-title" id="detailModalLabel">Máte v pamäti uložených 50 dokladov na import! Uvoľnite pamäť a pokračujte v skenovaní.</h6></div>');
	$("#BlocekFooter").html('<button id="breakScan" class="btn btn-lg btn-primary" data-bs-dismiss="modal">PRERUŠIŤ</button>');
	
	}
	else {scan(qrScanner);}
}

function scan(qrScanner) {
	
//wait for the modal to display and then count the width of video parent element
var refreshId = setInterval(function() {
 
 if (($('#detailModal').hasClass('show'))== true)
	{
	 $("#blocekHeader button").remove();
	 $("#BlocekFooter").html("");
   // alert("funguje");  
   $("#detailModalLabel").html('Prehliadaču musíte povoliť prístup ku kamere.');
 //$("#detailModal .modal-content").prepend('<div class="modal-header" id="blocekHeader"><h6 class="modal-title" id="detailModalLabel">Prehliadaču musíte povoliť prístup ku kamere.</h6></div>');
   $("#blocekDetail").html("");
 //vlastny button na exit modulu
   $("#BlocekFooter").html('<button id="breakScan" class="btn btn-lg btn-primary" data-bs-dismiss="modal">PRERUŠIŤ</button>');
   document.getElementById('breakScan').addEventListener('click', () => {
			   qrScanner.stop();	
			});

	 $("#videoContainer").show();
   
  var videoLength = document.getElementById("blocekModalBody").offsetWidth;
  document.getElementById("qr-video").style.width = videoLength+"px";
  //todo: dorobit try catch ak da uzivatel don't allow 
	qrScanner.start();
	
	 clearInterval(refreshId);	
	}
  },100);					

// //Hned ako sa zobrazi skenovaci ramcek, tak vypnut hlasku, aby uzivatel povolil kameru v prehladaci. Usetri sa tym miesto na mobilnych zariadeniach.
//header modal okna sa vypina priamo v subore qr-scanner.min.js
// var refreshId1 = setInterval(function() {
 
 // if ($('#videoContainer .scan-region-highlight').css("display") != "none" )
	// {
		
		
			// //	$("#detailModalLabel").html('');
			// $("#blocekHeader").remove('');
		
	 // clearInterval(refreshId1);	
	// }
  // }
// , 100);	

}

function getBlocek(qrScanner, Uid){
	
	qrScanner.stop();	
//	  console.log(`Scan result: ${Uid}`);
	var parameter;	
    var divToBeWorkedOn = "#blocekDetail";
	 $("#videoContainer").hide();
	 $(divToBeWorkedOn).html("");	 
	$("#BlocekFooter").html("");
    var webMethod = "https://ekasa.financnasprava.sk/mdu/api/v1/opd/receipt/find";
    
//	var parameterr = JSON.stringify({"receiptId":"O-AC6D5656CDC64336AD5656CDC60336E0"});
//	var parameter = JSON.stringify(parameters);

		var filter = /^\w-/;              
//if any sign and - e.g. 0- at the beginning, so proceed...
if (filter.test(Uid))
		{
		//	Uid="O-7036FE96E33F4849B6FE96E33F98492";
			parameter = "{\"receiptId\":\"" + Uid + "\"}";
		}
//osetruje off-line doklad (sluzba pozaduje datum v citatelnom formate a nie v tom z QR kodu)
else if (Uid.split(":").length==5)
		{
		var fields = Uid.split(":");
		//QR obsahuje data vo forme 220212175204 a potrebujeme 07.10.2020 16:57:12	
		var dateFormatted = fields[2][4]+fields[2][5]+"."+fields[2][2]+fields[2][3]+".20"+fields[2][0]+fields[2][1]+" "+fields[2][6]+fields[2][7]+":"+fields[2][8]+fields[2][9]+":"+fields[2][10]+fields[2][11];	
		parameter = "{\"okp\":\"" + fields[0] + "\",\"cashRegisterCode\":\"" + fields[1] + "\",\"issueDateFormatted\":\"" + dateFormatted + "\",\"receiptNumber\":" + fields[3] + ",\"totalAmount\":" + fields[4] + "}";			
		//{"okp":"2FD0230C-3898327F-6C7F3BD8-A9B895FF-AA157673","cashRegisterCode":"88820205189620059","issueDateFormatted":"07.10.2020 16:57:12","receiptNumber":1570,"totalAmount":16.2}	
		}
else
		{
			//$("#detailModalLabel").html("Error");
			$("#detailModal .modal-content").prepend('<div class="modal-header" id="blocekHeader"><h6 class="modal-title" id="detailModalLabel">Error</h6></div>');
			$(divToBeWorkedOn).html("Tento typ dokladu nie je zatiaľ podporovaný. Treba ho nahrať do učtovníctva manuálne.");
			$("#blocekHeader").append('<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>');
			$("#BlocekFooter").append('<button class="btn btn-primary" data-bs-dismiss="modal">ZAVRIEŤ</button>' );	
			return;
		}

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameter,
		contentType: "application/json; charset=utf-8",
        dataType: "json",
		//ked sluzba neodpoveda, tak zobrazime chybovu hlasku sluzby (timeout)
		error: function(xhr) {
			var errMsg = JSON.parse(xhr.responseText);
			
		if (errMsg.returnValue==-1) 
			{
			//  $("#detailModalLabel").html("Error");
				$("#detailModal .modal-content").prepend('<div class="modal-header" id="blocekHeader"><h6 class="modal-title" id="detailModalLabel">Error</h6></div>');
				$(divToBeWorkedOn).html(errMsg.errorDescription);
				$("#blocekHeader").append('<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>');
				$("#BlocekFooter").append('<button class="btn btn-primary" data-bs-dismiss="modal">ZAVRIEŤ</button>');
				return;			
			}
		},
        success: function(msg) {

		
		//ked blocek neexistuje, t.j. sluzba ho nedokazala vyhladat
		if (msg.returnValue==0 && msg.receipt==null)
			{
			//	$("#detailModalLabel").html("Error");
				$("#detailModal .modal-content").prepend('<div class="modal-header" id="blocekHeader"><h6 class="modal-title" id="detailModalLabel">Error</h6></div>');
				$(divToBeWorkedOn).html("Doklad sme nenašli v systéme eKasa. Budete ho musieť zaúčtovať manuálne.");
				$("#blocekHeader").append('<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>');
				$("#BlocekFooter").append('<button class="btn btn-primary" data-bs-dismiss="modal">ZAVRIEŤ</button>');
				return;
			}
		
		try {
		
		//	$("#detailModalLabel").html(msg.receipt.receiptId);
		$("#detailModal .modal-content").prepend('<div class="modal-header" id="blocekHeader"><h6 class="modal-title" id="detailModalLabel">'+msg.receipt.receiptId+'</h6></div>');
		
			var Blocek = '<table><tr><td>'+msg.receipt.organization.name+ '</td></tr>';
			if (msg.receipt.organization.propertyRegistrationNumber==null) {msg.receipt.organization.propertyRegistrationNumber = msg.receipt.organization.buildingNumber;}
			Blocek = Blocek + '<tr><td>'+msg.receipt.organization.streetName + ' ' + msg.receipt.organization.propertyRegistrationNumber+'</td></tr>';
			Blocek = Blocek + '<tr><td>'+msg.receipt.organization.postalCode+' '+msg.receipt.organization.municipality+'</td></tr>';
			Blocek = Blocek + '<tr><td> DIČ: '+msg.receipt.organization.dic+'</td></tr>';
			if (msg.receipt.organization.icDph==null) {msg.receipt.organization.icDph = "";}
			Blocek = Blocek + '<tr><td> IČ DPH: '+msg.receipt.organization.icDph+'</td></tr>';
			Blocek = Blocek + '<tr><td> IČO: '+msg.receipt.organization.ico+'</td></tr>';
			Blocek = Blocek + '<tr><td style="padding-top:5px;"> Dátum a čas vyhotovenia: '+msg.receipt.createDate +'</td></tr>';
			Blocek = Blocek + '<tr><td style="padding-top:5px;"> Poradové číslo: '+msg.receipt.receiptNumber+'</td></tr>';
			Blocek = Blocek + '<tr><td style="padding:5px 0;"> Celková suma dokladu: '+msg.receipt.totalPrice+' €</td></tr></table>';
			
			if (msg.receipt.taxBaseBasic==null) {msg.receipt.taxBaseBasic = 0.00;}
			if (msg.receipt.vatAmountBasic==null) {msg.receipt.vatAmountBasic = 0.00;}
			if (msg.receipt.taxBaseReduced==null) {msg.receipt.taxBaseReduced = 0.00;}
			if (msg.receipt.vatAmountReduced==null) {msg.receipt.vatAmountReduced = 0.00;}
			if (msg.receipt.freeTaxAmount==null) {msg.receipt.freeTaxAmount = 0.00;}			
			
			Blocek = Blocek + '<table><tr style="border-top:1pt solid black; padding-bottom:5px;"><td>Sadzba:</td><td>Bez DPH:</td><td>DPH</td></tr>';
			Blocek = Blocek + '<tr><td>20%:</td><td>'+msg.receipt.taxBaseBasic+' €</td><td>'+msg.receipt.vatAmountBasic+' €</td></tr>';
			Blocek = Blocek + '<tr><td>10%</td><td>'+msg.receipt.taxBaseReduced+' €</td><td>'+msg.receipt.vatAmountReduced+' €</td></tr>';
			Blocek = Blocek + '<tr style="border-bottom:1pt solid black;"><td>INÉ:</td><td>'+msg.receipt.freeTaxAmount+' €</td><td></td></tr></table>';
			
			Blocek = Blocek + '<table>';
			
				for (let [key, value] of Object.entries(msg.receipt.items)) {
			
					Blocek = Blocek + '<tr><td colspan="3" style="font-weight:600;">'+value.name+'</td></tr>';
					Blocek = Blocek + '<tr><td style="width: 33.33%;">'+value.quantity+' x</td><td style="width: 33.33%;">'+value.vatRate+'%</td><td style="width: 33.33%;">'+value.price+' €</td></tr>';
			
//		console.log(`${value.name} ${value.quantity}  ${value.price}`);
				}
			Blocek = Blocek + '</table>';
			
				$(divToBeWorkedOn).append(Blocek);	
				
			$("#BlocekFooter").append('<button id="AddBlocek" class="btn btn-lg btn-primary" data-bs-dismiss="modal">ULOŽIŤ</button>' );
			
			//udaje sa ulozia az po kliknuti na ULOŽIŤ
			document.getElementById('AddBlocek').addEventListener('click', () => {
				var index = sessionStorage.length;	
				//po novom nepotrebujeme cast s polozkami blocku, kedze ju aj tak nevieme vlozit do XML na import
				delete msg.receipt.items;
				sessionStorage.setItem(index, JSON.stringify(msg));
				$("#blocekDetail").html("");
				$("#BlocekFooter").html("");
			//	$("#results").html("Počet úspešne naskenovaných dokladov: " + sessionStorage.length + " / 50");		
				$("#results").val("naskenovaných " + sessionStorage.length + " / 50");		
				$("#results").removeClass("is-invalid is-valid");
			});			
			
			$("#BlocekFooter").append('<button class="btn btn-lg btn-secondary" data-bs-dismiss="modal">ZAHODIŤ</button>' );	
		}
		catch(err) 
					{
						//$("#detailModalLabel").html("Nastala neočakávaná chyba");
						$("#detailModal .modal-content").prepend('<div class="modal-header" id="blocekHeader"><h6 class="modal-title" id="detailModalLabel">Nastala neočakávaná chyba</h6></div>');
						$(divToBeWorkedOn).html("Pokračujte s iným dokladom. Ak sa nejedná o doklad k úhrade faktúry, tak nám prípadne fotokópiu pošlite na email@uskener.sk");
						$("#blocekHeader").append('<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>');
						$("#BlocekFooter").append('<button class="btn btn-primary" data-bs-dismiss="modal">ZAVRIEŤ</button>' );	
					}			
 
        },
        // error: function(e){
        // $(divToBeWorkedOn).html("Nastala neočakávaná chyba. Pokračujte s iným dokladom a prípadne nám fotokópiu tohto pošlite na noreply@uskener.sk");
		// $("#blocekHeader").append('<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>');
		// $("#BlocekFooter").append('<button class="btn btn-primary" data-bs-dismiss="modal">ZAVRIEŤ</button>' );	
        // }
    });	
}
 
 function clearMemory() {	 
	 sessionStorage.clear();
	 $('#clearModal').modal('hide');
	//$("#results").html("<span class=\"lead\">Počet úspešne naskenovaných dokladov: " + sessionStorage.length + " / 50</span>"); 
	$("#results").val("naskenovaných " + sessionStorage.length + " / 50");
	$("#results").removeClass("is-invalid is-valid");
}
 
function completeVoucher(){
if(validateEmail())
	{
	var XMLsent = new XMLDocument();
	}			
}
	
function proceedVoucher() {
	if(validateIco()  && validateQueue())
		{
		$("#emailModalLabel").html("Skonvertované dáta sa odošlú ako príloha na uvedený email");
		$("#emailModal .modal-footer").html('<button type="button" class="btn btn-primary" onclick=completeVoucher()>Odošli</button>');		
		$("#emailModal").modal('show');
		}	
}	 
 
