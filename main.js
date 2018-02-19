//
 
var ready = false;
var eurecaServer;
//this function will handle client communication with the server
var eurecaClientSetup = function() {
	//create an instance of eureca.io client
	var eurecaClient = new Eureca.Client();
	
	eurecaClient.ready(function (proxy) {		
		eurecaServer = proxy;
		
		
		//we temporary put create function here so we make sure to launch the game once the client is ready
		create();
		ready = true;
	});	
}