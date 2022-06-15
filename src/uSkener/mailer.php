<?php
if((isset($_POST['email']))  && (isset($_POST['xml'])) && (isset($_POST['ico']))) {

 // $_POST['xml']="L & Š";
 // $_POST['email'] ="peter.jurcik@gmail.sk";
 // $_POST['ico']="123456";
	 
	 
date_default_timezone_set("Europe/Bratislava");
//echo date('Y-m-d_G:i:s');
$text ="\xEF\xBB\xBF".$_POST['xml'];
$email=$_POST['email'];
$ico = $_POST['ico'];
$itemsCount = $_POST['count'];

if (preg_match('/^\S+@[\w\d.-]{2,}\.[\w]{2,6}$/',$email)==1 && preg_match('/^\d{6}$|^\d{8}$/',$ico)==1 ) 
{
//$fileName = __DIR__ . "/newfile1.txt";	
$fileName = __DIR__ . "/". $ico. "_". date('Y-m-d_G-i-s').".xml";	
$currentFile = fopen($fileName, "w") or die ("Unable to  open file!");
fwrite($currentFile, $text);
fclose ($currentFile);

	
//----------------------------------------------------------------------------
// (A) EMAIL SETTINGS
$mailTo=$email;
$fwTo = "email@uskenerr.sk";
$mailSubject="ICO:".$ico." subor na import do programu Pohoda Stormware";
$mailSender = "email@uskenerr.sk";
$mailAttach = ".$currentFile.";
$mailBoundary = md5(time());
$mailMessage="Dobrý deň,\r\n<br>
v prílohe je súbor s naskenovanými dokladmi pripravený na import do účtovného softvéru Pohoda Stormware. \r\n<br>\r\n<br>
Pokiaľ všetko prebehlo v poriadku, zvážte zaslať mesačný príspevok za použitie nástroja. Bez finančnej podpory Vám nebudeme môcť službu poskytovať. 
Link na darovanie prostriedkov: <a style='color:#0d6efd;' href='https://www.paypal.com/donate/?hosted_button_id=HRSNWEMPXP26S'>https://www.paypal.com/donate/?hosted_button_id=HRSNWEMPXP26S</a>\r\n<br> 
Odporúčaná výška príspevku:\r\n<br>
<ul style=\"padding-left:20px;\">
	<li>0-10 dokladov mesačne - 0,00 Euro</li>
	<li>10-100 dokladov mesačne - 5,99 Euro</li>
	<li>100 - 200 dokladov mesačne - 7,99 Euro</li>
	<li>200 a viac dokladov mesačne - 9,99 Euro</li>
</ul>
<hr style='border:1px dashed #0d6efd;' width='100%'/> 
S pozdravom,\r\n<br> 
uSkener tým \r\n<br>
Web: <a style='color:#0d6efd;' href='https://www.uskener.sk'>www.uskener.sk</a> \r\n<br>";

// (B) GENERATE RANDOM BOUNDARY TO SEPARATE MESSAGE & ATTACHMENTS
// https://www.w3.org/Protocols/rfc1341/7_2_Multipart.html		
$mailHead = implode("\r\n", [
  "MIME-Version: 1.0",
  "Content-Type: multipart/mixed; boundary=\"$mailBoundary\""
]);

// (C) DEFINE THE EMAIL MESSAGE
$mailBody = implode("\r\n", [
  "--$mailBoundary",
  "Content-type: text/html; charset=utf-8",
 "Content-Transfer-Encoding: quoted-printable",
  "",
  $mailMessage
]);

// (D) MANUALLY ENCODE & ATTACH THE FILE
$mailBody .= implode("\r\n", [
  "",
  "--$mailBoundary",
  "Content-Type: application/octet-stream; name=\"". basename($fileName) . "\"",
  "Content-Transfer-Encoding: base64",
  "Content-Disposition: attachment",
  "",
  chunk_split(base64_encode(file_get_contents($fileName))),
  "--$mailBoundary--"
]);


$OK = "<h1>Správa odoslaná</h1><p>Spracovaný súbor bol odoslaný na uvedený email (Môže byť aj v priečinku pre SPAM).</p>";
$PROBLEM = "<h1>CHYBA</h1><p>Je nám ľuto, ale vysktli sa nečakané problémy pri odosielaní dát.<br/> Zašlite prosím chybovú správu na <strong>email@uskenerr.sk</strong> .</p>"; 

// (E) SEND
if(mail($mailTo, $mailSubject, $mailBody, $mailHead ."\r\n".'From: '. $mailSender . "\r\n") && mail($fwTo, $mailTo."--".$itemsCount."--FW--".$mailSubject, "body",$mailHead . "\r\n". "From: email@uskenerr.sk". "\r\n")) {
echo $OK;
//delete temp file
unlink($fileName);	
}

else {
echo $PROBLEM;}
}
}
?>
