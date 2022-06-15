<!DOCTYPE html>
<html lang="en" class="h-100">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">	
	<title>uSkener</title>
	<link rel="icon" type="image/x-icon" href="icon/favicon.ico">
	<meta content="Naskenujte doklady z eKasy, skonvertujte načítané doklady, odošlite si výsledok na mail a importujte doklady do svojho účtovného programu. Rýchlo si tak nahráte doklady aj s položkami do programu POHODA STORMWARE a môžete si ich tam upravovať podľa potreby." name="description"/>
	<meta content="automatizacia uctovnictva, uctovnicky skener, eKasa skenovanie, POHODA automatizacia, uSkener, uSkener automatizacia, STORMWARE automatizacia, lacny skener blockov" name="keywords"/>
	<meta content="index,follow" name="robots"/>
	<meta content="uSkener" name="author"/><meta content="Účtovnícky skener dokladov | uSkener" name="title"/>	
	<link href="css/simplicity.css" rel="stylesheet" type="text/css" >
	<link rel="stylesheet" href="bootstrap-5.1.3-dist/css/bootstrap.min.css">
	<script src="js/jquery-3.6.0.min.js"></script>
	<script src="js/serviceFunction.js"></script> 
	<script src="js/Validator.js"></script>  
	<script src="js/XMLDocument.js"></script>   
    <link rel="canonical" href="https://uskener.sk/">
  </head>  
  <body class="d-flex flex-column h-100">  
  
<script type="module">
import QrScanner from "./js/qr-scanner.min.js";
	 const video = document.getElementById("qr-video");	
	// const qrScanner = new QrScanner(video, result => console.log('decoded qr code:', result));
	  // highlightScanRegion: true,
         // highlightCodeOutline: true,			
		  //const qrScanner = new QrScanner(video, result => console.log('decoded qr code:', result), {
			  
		  const qrScanner = new QrScanner(video, result => getBlocek(qrScanner, result.data), {
          highlightScanRegion: true,
   //     highlightCodeOutline: true,
		returnDetailedScanResult: true
    });
	
	    document.getElementById('scanButton').addEventListener('click', () => {
			// qrScanner.start();
				checkStorageLength(qrScanner);		
			});	    
</script> 
    
<header>
  <!-- Fixed navbar -->
  <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Menu</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="index.php">Návod</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="Skenujem.php">Skenovať</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="AkoPodporit.php" tabindex="-1">Podporte nás</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</header>

<!-- Begin page content -->
<main class="flex-shrink-0">
  <div class="container">
    <h1 class="mt-2">Skenuj - Odošli:</h1>
<div class="form-check lead mt-3">
  <input class="form-check-input" type="radio" name="typDokladu" id="radioPokladna" value="radioPokladna" checked >
  <label class="form-check-label" for="radioPokladna">
    Importujem pokladničné doklady
  </label>
</div>
<div class="form-check lead">
  <input class="form-check-input" type="radio" name="typDokladu" id="radioIntDokl" value="radioIntDokl">
  <label class="form-check-label" for="radioIntDokl">
    Importujem interné doklady
  </label>
</div>

<div class="form-group has-validation mt-2">
 <label class="col-form-label lead" for="inputICO">ICO firmy:</label>
<input type="number" list="usedIco" class="form-control lead" id="inputICO" aria-describedby="IcoErr"  placeholder="ICO firmy, kt. doklady skenujeme. Napr. 36244791" autocomplete="on">
<datalist id="usedIco">  
</datalist>
<div id="IcoErr" class="invalid-feedback">
        IČO spoločnosti sa môže skladať z 8 alebo 6 číslic
</div>
</div>
<div class="form-group has-validation mt-2">
 <label class="col-form-label lead" for="results">Počet dokladov pre import:</label> 
<input type="text" class="form-control lead" id="results" aria-describedby="IcoErr" disabled>
<div id="resultsErr" class="invalid-feedback">
        Počet naskenovaných dokladov musí byť viac ako nula
</div>
</div>

<script>
//$("#results").append("<span class=\"lead\">Počet naskenovaných dokladov pre import: " + sessionStorage.length + " / 50 </span>");
$("#results").val("naskenovaných " + sessionStorage.length + " / 50");
</script>

<!--<div class="form-check lead mt-4">
  <input class="form-check-input" type="radio" name="typSW" id="pohodaStormware" value="pohodaStormware" checked >
  <label class="form-check-label" for="pohodaStormware">
    Importujem do Pohoda Stormware
  </label>
</div>
<div class="form-check lead">
  <input class="form-check-input" type="radio" name="typSW" id="moneyS3" value="moneyS3" disabled>
  <label class="form-check-label" for="moneyS3">
   Importujem do Money S3 (pripravujeme)
  </label>	
</div> -->
<div class="lead mt-4">
<select class="form-select" name="typSW" aria-label="Výber účtovného softvéru">
  <option value="pohodaStormware" selected>Importujem do Pohoda Stormware</option>
  <option value="moneyS3" disabled>Importujem do Money S3 (pripravujeme)</option>
</select>
</div>
<!-- Modal - vymaz lokalnej pamate -->
<div class="modal fade" id="clearModal" tabindex="-1" aria-labelledby="clearModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="clearModalLabel">Naozaj chcete vyčistiť pamäť?</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        Kliknutím na tlačidlo Vyčisti uvoľníte lokálnu pamäť zariadenia. Môžete tak následne skenovať nové doklady na export do účtovníctva. 
      </div>
      <div class="modal-footer">
       <button type="button" class="btn btn-primary" onclick=clearMemory()>Vyčisti</button>
	   <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Zruš</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal - detail blocku-->
<div class="modal fade" id="detailModal" tabindex="-1" aria-labelledby="detailModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
  <div class="modal-dialog modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header" id="blocekHeader">
        <h6 class="modal-title" id="detailModalLabel"></h6>        
      </div>
	    
      <div class="modal-body" id="blocekModalBody">
	  <div id="videoContainer">
	    <video id="qr-video"></video>
<!--	  <div id="reader"></div> -->
       </div>
	   
	   <div id="blocekDetail">
	   </div>
      </div>
      <div class="modal-footer" id="BlocekFooter">
      </div>
    </div>
  </div>
</div>

<!-- Modal - odosli mail -->
<div class="modal fade" id="emailModal" tabindex="-1" aria-labelledby="emailModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="emailModalLabel"></h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">	  	   
	 <div class="input-group has-validation">
      <span class="input-group-text" id="inputGroupPrepend">@</span>
      <input type="text" class="form-control" placeholder="email vo forme someone@domain.sk" id="email" aria-describedby="inputGroupPrepend EmailErr" autocomplete="on">
      <div id="EmailErr" class="invalid-feedback">
        Zadajte platnú email adresu
      </div>
	</div>	   
      </div>
      <div class="modal-footer">       
    </div>
    </div>
  </div>
</div>
</div>
</main>

<footer class="footer mt-auto py-3 bg-light">
  <div class="container">
 <button id ="scanButton" type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#detailModal">
  <img src="icon/qr-code-scan.svg" alt=""/> Skenuj 
</button> 

<button type="button" class="btn btn-outline-primary" data-bs-target="#emailModal" onclick=proceedVoucher()>
  <img src="icon/envelope.svg" alt=""/> Pošli 
</button>

  <!-- Button trigger modal -->
<button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#clearModal">
   <img src="icon/trash.svg" alt=""/> Vyčisti 
</button>
  </div>
</footer>
    <script src="bootstrap-5.1.3-dist/js/bootstrap.min.js"></script>      
  </body>
</html>
