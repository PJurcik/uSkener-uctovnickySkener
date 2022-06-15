class XMLDocument {
	
	constructor()
	{
	var ICO = $("#inputICO").val();
	var Email = $("#email").val();
	var formXML = $('input[name="typDokladu"]:checked').val();
	var formSW=$('select[name="typSW"]').val();
	var XMLforImport;
	
	
	//datum pre INT. poznamku
	var today = new Date().toLocaleString('en-GB', {timeZone:'Europe/Bratislava'});

	if (formXML=="radioPokladna" && formSW=="pohodaStormware") 
		{
		XMLforImport = this.PD_pohodaStormware(ICO, today);
		}	
	if (formXML=="radioIntDokl" && formSW=="pohodaStormware") 
		{
		XMLforImport = this.IntD_pohodaStormware(ICO, today);
		}	
		
		this.sendForm(ICO, Email, XMLforImport);
	}


PD_pohodaStormware(ICO, today) {	
	
	var XMLFile = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
	XMLFile = XMLFile + "\n"+ "<dat:dataPack version=\"2.0\" id=\"PD_"+sessionStorage.length+"x\" ico=\""+ICO+"\" application=\"uSkener\" note=\"Import naskenovanych blockov\" xmlns:dat=\"http://www.stormware.cz/schema/version_2/data.xsd\" xmlns:vch=\"http://www.stormware.cz/schema/version_2/voucher.xsd\" xmlns:typ=\"http://www.stormware.cz/schema/version_2/type.xsd\">";
  
for (let i = 0; i < sessionStorage.length; i++) { 

	var Blocek = JSON.parse(sessionStorage.getItem(i));
	
	XMLFile = XMLFile + "\n" + "<!-- Pokladnicny doklad bez textovych poloziek -->";
	XMLFile = XMLFile + "\n" + "<dat:dataPackItem version=\"2.0\" id=\"POK"+(i+1)+"\">";
	XMLFile = XMLFile + "\n" + "<vch:voucher version=\"2.0\"><vch:voucherHeader><vch:voucherType>expense</vch:voucherType><vch:cashAccount><typ:ids>HP</typ:ids></vch:cashAccount>";
	var date = Blocek.receipt.issueDate.split(" ");
	var dateSplit = date[0].split(".");
	XMLFile = XMLFile + "<vch:originalDocument>"+Blocek.receipt.receiptNumber+"</vch:originalDocument>";
	XMLFile = XMLFile + "\n" + "<vch:date>"+dateSplit[2]+"-"+dateSplit[1]+"-"+dateSplit[0]+"</vch:date>";
	XMLFile = XMLFile + "<vch:datePayment>"+dateSplit[2]+"-"+dateSplit[1]+"-"+dateSplit[0]+"</vch:datePayment>";
	XMLFile = XMLFile + "<vch:dateTax>"+dateSplit[2]+"-"+dateSplit[1]+"-"+dateSplit[0]+"</vch:dateTax>";
	//XMLFile = XMLFile + "<vch:accounting><typ:ids>6Pv</typ:ids></vch:accounting>";
	//XMLFile = XMLFile + "\n" + "<vch:classificationVAT><typ:classificationVATType>inland</typ:classificationVATType></vch:classificationVAT>";
	XMLFile = XMLFile + "\n" + "<vch:classificationKVDPH><typ:ids>B3</typ:ids></vch:classificationKVDPH>";
	XMLFile = XMLFile + "<vch:text>"+Blocek.receipt.receiptId+"</vch:text>";
	XMLFile = XMLFile + "\n" + "<!--adresa bez vazby na program POHODA-->";
	XMLFile = XMLFile + "\n" + "<vch:partnerIdentity><typ:address>";
	XMLFile = XMLFile + "<typ:company><![CDATA["+Blocek.receipt.organization.name+"]]></typ:company>";
	XMLFile = XMLFile + "<typ:city>"+Blocek.receipt.organization.municipality+"</typ:city>";
	XMLFile = XMLFile + "<typ:street>"+Blocek.receipt.organization.streetName+" "+Blocek.receipt.organization.propertyRegistrationNumber+"</typ:street>";
	XMLFile = XMLFile + "<typ:zip>"+Blocek.receipt.organization.postalCode+"</typ:zip>";
	XMLFile = XMLFile + "<typ:ico>"+Blocek.receipt.organization.ico+"</typ:ico><typ:dic>"+Blocek.receipt.organization.dic+"</typ:dic><typ:icDph>"+Blocek.receipt.organization.icDph+"</typ:icDph>";
	XMLFile = XMLFile + "</typ:address></vch:partnerIdentity>";
//	XMLFile = XMLFile + "<vch:centre><typ:ids>Jihlava</typ:ids></vch:centre>";
	XMLFile = XMLFile + "<vch:intNote>Import PD vytvoreny vo web app uSkener dna "+today+"</vch:intNote></vch:voucherHeader>";
	
		
		// //	<!--textova polozka-->
		// XMLFile = XMLFile + "<vch:voucherDetail>";
		// for (let [key, value] of Object.entries(Blocek.receipt.items)) {
			// XMLFile = XMLFile + "\n" + "<vch:voucherItem><vch:text>"+value.name+"</vch:text><vch:quantity>"+value.quantity+"</vch:quantity>";
			
			// var rateVAT;
			// switch (value.vatRate) {
				// case 20: RateVAT = "high";
				// break;
				// case 10: RateVAT = "low";
				// break;
				// default: RateVAT = "none";
			// }
				
			// XMLFile = XMLFile + "<vch:rateVAT>"+RateVAT+"</vch:rateVAT>";
			// //na blocku nie je unitPrice ale iba priceSum
			// var unitPrice = (value.price*1000)/(value.quantity*1000);
			// XMLFile = XMLFile + "<vch:homeCurrency><typ:unitPrice>"+unitPrice.toFixed(2)+"</typ:unitPrice>";
			// XMLFile = XMLFile + "<typ:payVAT>true</typ:payVAT></vch:homeCurrency>";
			// XMLFile = XMLFile + "</vch:voucherItem>";
		// }	
		// XMLFile = XMLFile + "\n" + "</vch:voucherDetail>";
		// //	<!--textova polozka-->
		
XMLFile = XMLFile + "<vch:voucherSummary>";
XMLFile = XMLFile +"<vch:homeCurrency>";

var priceHighSum = (Blocek.receipt.taxBaseBasic*100 + Blocek.receipt.vatAmountBasic*100)/100;
var priceLowSum = (Blocek.receipt.taxBaseReduced*100 + Blocek.receipt.vatAmountReduced*100)/100; 

XMLFile = XMLFile + "<typ:priceHigh>"+Blocek.receipt.taxBaseBasic+"</typ:priceHigh><typ:priceHighVAT>"+Blocek.receipt.vatAmountBasic+"</typ:priceHighVAT><typ:priceHighSum>"+priceHighSum+"</typ:priceHighSum>";
XMLFile = XMLFile + "<typ:priceLow>"+Blocek.receipt.taxBaseReduced+"</typ:priceLow><typ:priceLowVAT>"+Blocek.receipt.vatAmountReduced+"</typ:priceLowVAT><typ:priceLowSum>"+priceLowSum+"</typ:priceLowSum>";
XMLFile = XMLFile + "<typ:priceNone>"+Blocek.receipt.freeTaxAmount+"</typ:priceNone>";
XMLFile = XMLFile + "</vch:homeCurrency>";
XMLFile = XMLFile + "</vch:voucherSummary>";	
	
	XMLFile = XMLFile + "</vch:voucher></dat:dataPackItem>";
	
	//console.log(sessionStorage.getItem(i));
	//console.log(Blocek.receipt.issueDate);
}

	XMLFile = XMLFile + "\n" + "</dat:dataPack>";

return XMLFile;

}

IntD_pohodaStormware(ICO, today) {	
	
	var XMLFile = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
	XMLFile = XMLFile + "\n"+ "<dat:dataPack version=\"2.0\" id=\"INT_"+sessionStorage.length+"x\" ico=\""+ICO+"\" application=\"uSkener\" note=\"Import naskenovanych blockov\" xmlns:dat=\"http://www.stormware.cz/schema/version_2/data.xsd\" xmlns:int=\"http://www.stormware.cz/schema/version_2/intDoc.xsd\" xmlns:typ=\"http://www.stormware.cz/schema/version_2/type.xsd\">";
  
for (let i = 0; i < sessionStorage.length; i++) { 

	var Blocek = JSON.parse(sessionStorage.getItem(i));
	
	XMLFile = XMLFile + "\n" + "<!-- Interny doklad bez textovych poloziek -->";
	XMLFile = XMLFile + "\n" + "<dat:dataPackItem version=\"2.0\" id=\"INT"+(i+1)+"\">";
	XMLFile = XMLFile + "\n" + "<int:intDoc version=\"2.0\"><int:intDocHeader>";
		var date = Blocek.receipt.issueDate.split(" ");
	var dateSplit = date[0].split(".");

	XMLFile = XMLFile + "<int:symVar>"+Blocek.receipt.receiptNumber+"</int:symVar>";
	XMLFile = XMLFile + "\n" + "<int:date>"+dateSplit[2]+"-"+dateSplit[1]+"-"+dateSplit[0]+"</int:date>";
	XMLFile = XMLFile + "<int:dateTax>"+dateSplit[2]+"-"+dateSplit[1]+"-"+dateSplit[0]+"</int:dateTax>";
	XMLFile = XMLFile + "<int:dateAccounting>"+dateSplit[2]+"-"+dateSplit[1]+"-"+dateSplit[0]+"</int:dateAccounting>";
	XMLFile = XMLFile + "<int:dateDelivery>"+dateSplit[2]+"-"+dateSplit[1]+"-"+dateSplit[0]+"</int:dateDelivery>";
	XMLFile = XMLFile + "<int:dateKVDPH>"+dateSplit[2]+"-"+dateSplit[1]+"-"+dateSplit[0]+"</int:dateKVDPH>";
	//XMLFile = XMLFile + "<int:accounting><typ:ids>6Pv</typ:ids></int:accounting>";
	XMLFile = XMLFile + "\n" + "<int:classificationVAT><typ:ids>UD</typ:ids></int:classificationVAT>";
	XMLFile = XMLFile + "\n" + "<int:classificationKVDPH><typ:ids>B3</typ:ids></int:classificationKVDPH>";
	XMLFile = XMLFile + "<int:text>"+Blocek.receipt.receiptId+"</int:text>";
	XMLFile = XMLFile + "\n" + "<!--adresa bez vazby na program POHODA-->";
	XMLFile = XMLFile + "\n" + "<int:partnerIdentity><typ:address>";
	XMLFile = XMLFile + "<typ:company><![CDATA["+Blocek.receipt.organization.name+"]]></typ:company>";
	XMLFile = XMLFile + "<typ:city>"+Blocek.receipt.organization.municipality+"</typ:city>";
	XMLFile = XMLFile + "<typ:street>"+Blocek.receipt.organization.streetName+" "+Blocek.receipt.organization.propertyRegistrationNumber+"</typ:street>";
	XMLFile = XMLFile + "<typ:zip>"+Blocek.receipt.organization.postalCode+"</typ:zip>";
	XMLFile = XMLFile + "<typ:ico>"+Blocek.receipt.organization.ico+"</typ:ico><typ:dic>"+Blocek.receipt.organization.dic+"</typ:dic><typ:icDph>"+Blocek.receipt.organization.icDph+"</typ:icDph>";
	XMLFile = XMLFile + "</typ:address></int:partnerIdentity>";
	XMLFile = XMLFile + "<int:liquidation>true</int:liquidation>";
	XMLFile = XMLFile + "<int:intNote>Import INT vytvoreny vo web app uSkener dna "+today+"</int:intNote></int:intDocHeader>";
	
		
		// //	<!--textova polozka-->
		// XMLFile = XMLFile + "<int:intDocDetail>";
		// for (let [key, value] of Object.entries(Blocek.receipt.items)) {
			// XMLFile = XMLFile + "\n" + "<int:intDocItem><int:text>"+value.name+"</int:text><int:quantity>"+value.quantity+"</int:quantity>";
			
			// var rateVAT;
			// switch (value.vatRate) {
				// case 20: RateVAT = "high";
				// break;
				// case 10: RateVAT = "low";
				// break;
				// default: RateVAT = "none";
			// }
				
			// XMLFile = XMLFile + "<int:rateVAT>"+RateVAT+"</int:rateVAT>";
			// //na blocku nie je unitPrice ale iba priceSum
			// var unitPrice = (value.price*1000)/(value.quantity*1000);
			// XMLFile = XMLFile + "<int:homeCurrency><typ:unitPrice>"+unitPrice.toFixed(2)+"</typ:unitPrice>";
			// XMLFile = XMLFile + "<typ:payVAT>true</typ:payVAT></int:homeCurrency>";
			// XMLFile = XMLFile + "</int:intDocItem>";
		// }	
		// XMLFile = XMLFile + "\n" + "</int:intDocDetail>";
		// //	<!--textova polozka-->
		
XMLFile = XMLFile + "<int:intDocSummary>";
XMLFile = XMLFile +"<int:homeCurrency>";

var priceHighSum = (Blocek.receipt.taxBaseBasic*100 + Blocek.receipt.vatAmountBasic*100)/100;
var priceLowSum = (Blocek.receipt.taxBaseReduced*100 + Blocek.receipt.vatAmountReduced*100)/100; 

XMLFile = XMLFile + "<typ:priceHigh>"+Blocek.receipt.taxBaseBasic+"</typ:priceHigh><typ:priceHighVAT>"+Blocek.receipt.vatAmountBasic+"</typ:priceHighVAT><typ:priceHighSum>"+priceHighSum+"</typ:priceHighSum>";
XMLFile = XMLFile + "<typ:priceLow>"+Blocek.receipt.taxBaseReduced+"</typ:priceLow><typ:priceLowVAT>"+Blocek.receipt.vatAmountReduced+"</typ:priceLowVAT><typ:priceLowSum>"+priceLowSum+"</typ:priceLowSum>";
XMLFile = XMLFile + "<typ:priceNone>"+Blocek.receipt.freeTaxAmount+"</typ:priceNone>";
XMLFile = XMLFile + "</int:homeCurrency>";
XMLFile = XMLFile + "</int:intDocSummary>";	
	
	XMLFile = XMLFile + "</int:intDoc></dat:dataPackItem>";
	
	//console.log(sessionStorage.getItem(i));
	//console.log(Blocek.receipt.issueDate);
}

	XMLFile = XMLFile + "\n" + "</dat:dataPack>";

return XMLFile;
}

sendForm(ico, email, data) {
var usedIcoArr = [];
//pridaj aktualne ICO do datalist pre ICO input field (max. 6  poslednych poloziek)
	if (!localStorage.getItem("usedIco"))
		{		
		usedIcoArr.push(localStorage.getItem("tempIco"));
		localStorage.setItem("usedIco", JSON.stringify(usedIcoArr)); 		
		}
	else 	
		{
			usedIcoArr = JSON.parse(localStorage.getItem("usedIco"));
			if (!usedIcoArr.includes(localStorage.getItem("tempIco")))
			{
				if (usedIcoArr.length<=5)
				{
					usedIcoArr.push(localStorage.getItem("tempIco"));
				}
				else
				{
					usedIcoArr.shift();
					usedIcoArr.push(localStorage.getItem("tempIco"));	
				}		
			localStorage.setItem("usedIco", JSON.stringify(usedIcoArr)); 	
			}
		}	
	
	


$.ajax({   
	method: "POST",
	url: "mailer.php",
	data:'email='+encodeURIComponent(email)+'&xml='+encodeURIComponent(data)+'&ico='+encodeURIComponent(ico)+'&count='+encodeURIComponent(sessionStorage.length), 
	dataType: 'html',
    beforeSend: function(x){$("#emailModalLabel").html('Čakajte... <div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>');
					$("#emailModal .modal-footer").html('<button class="btn btn-primary" type="button" disabled><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Odosielam...</button>');},
	success: function(msg){
		//TO DO: po odoslani treba zobrazit OK alebo NOK spravu uzivatelovi	
	  $("#emailModal .modal-footer").html('<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Hotovo</button>');		
      $("#emailModalLabel").html(msg);
           
	  }
	  });
	  }
  
}

 