$(document).ready(function(){
	var tempText = $("#temp-text");
	var degType = $("#deg-type");

	function ShowTemp(){
		var startPos;
		var geoSuccess = function(position) {
			startPos = position;

			GetLocation(startPos.coords.latitude, startPos.coords.longitude)

			GetTemp(startPos.coords.latitude, startPos.coords.longitude);

		};
		var geoError = function(error) {
			console.log('Error occurred. Error code: ' + error.code);
			// error.code can be:
			//   0: unknown error
			//   1: permission denied
			//   2: position unavailable (error response from location provider)
			//   3: timed out
		};
		navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
	}

	function GetLocation(lat, long){
		var apiKey = 'AIzaSyB9d_Uh9vUe5ADQf-kVxspRc1nRPiKPQTM',
				url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=',
				api_call = url + lat + "," + long + "&key=" + apiKey;

		$.getJSON(api_call, function(json) {
			$("#city").text(json.results[0].address_components[3].long_name);
			$("#state").text(json.results[0].address_components[5].long_name);
		});
	}

	// Get Temp
	function GetTemp(lat, long){
		var apiKey       = 'eb089da3c68bd934465d9bea8d1894a3',
				url          = 'https://api.darksky.net/forecast/',
				api_call     = url + apiKey + "/" + lat + "," + long + "?extend=hourly&callback=?";

		// Call to the DarkSky API to retrieve JSON
	$.getJSON(api_call, function(result) {
		var temp = result.currently.temperature;

		// If Celsius is checked then convert degrees to celsius
			if(degType.data("checked")) {
				temp = ConvertToCelsius(temp);
				degType.find("p").text("C");
			}
			else{
				degType.find("p").text("F");
			}

		tempText.text(temp.toFixed(1));

		 var skycons = new Skycons({"color": "lightblue"});

		// ...or by the canvas DOM element itself.
		skycons.add("canvas", result.currently.icon);

		// if you're using the Forecast API, you can also supply
		// strings: "partly-cloudy-day" or "rain".

		// start animation!
		skycons.play()
		});
	}

	// ConvertToCelsius
	function ConvertToCelsius(temp){
		return (temp - 32) * 5 / 9;
	}


	degType.on("click", function(){
		if(degType.data("checked")){
			degType.data("checked", false);
		}
		else{
			degType.data("checked", true);
		}

		ShowTemp();
	});

	ShowTemp();
});

