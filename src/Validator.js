function validateQueue() {

	if (sessionStorage.length == 0) 
	{
	//	$("#results").html("<span class=\"lead\">Počet úspešne naskenovaných dokladov: " + sessionStorage.length + " / 50</span>  <span style=\"color:#dc3545\">Zatiaľ ste nenaskenovali žiadny doklad!</span>");
		$("#results").addClass("is-invalid");
		return false;
	}	
	else 
	{	
		$("#results").removeClass("is-invalid").addClass("is-valid");
		return true;
	}
}

//global var for validation of Email
 var doneEmailVal;
function validateEmail(){
		var email = $("#email");
		//testing regular expression
		var a = $("#email").val();
		var filter = /^\S+@[\w\d.-]{2,}\.[\w]{2,6}$/; 
		if(!doneEmailVal)
		{ 
		email.on("input", function() {validateEmail();});			 
		doneEmailVal=true;				 
		} 
		//if it's valid email
		if(filter.test(a))
		{
			email.removeClass("is-invalid");
			email.addClass("is-valid");	
			return true;			
		}
		//if it's NOT valid
		else
		{
			email.removeClass("is-valid");
			email.addClass("is-invalid");
			return false;
		}
	}

	//global var for validation of ICO
 var doneIcoVal;
 function validateIco(){	
		var email = $("#inputICO");
		//testing regular expression
		var a = $("#inputICO").val();
		var filter = /^\d{6}$|^\d{8}$/;  
		if(!doneIcoVal)
		{ 
		email.on("input", function() {validateIco();});			 
		doneIcoVal=true;				 
		} 		
		//if it's valid email
		if(filter.test(a))
		{
			email.removeClass("is-invalid");
			email.addClass("is-valid");
			return true;
		}
		//if it's NOT valid
		else
		{
			email.removeClass("is-valid");
			email.addClass("is-invalid");
			return false;
		}
}