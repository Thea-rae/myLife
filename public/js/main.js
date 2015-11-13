// CUSTOM JS FILE //

	var life;
	var myActivity;
	var myLocation;
	var schedule;
	var mylat;
	var mylng;
	var instaData;
	var imgAct;
	var myheadphones;
	var artist;
	var track;

$(document).ready(function(){

	initInsta();
	initVars();
	getLife();


	function getLife(){
		console.log("yo bitches!");
		jQuery.ajax({
			url: '/api/get',
			dataType: 'json', success :function(response){
				console.log(response);
				life = response.life;
			}
		})
	}

		$("#selectors").change(function(){
			console.log("im changing")
			var timeVal = $('#timeSelector').val();
			var dayVal = $('#daySelector').val();
			getLifeByHour(timeVal, dayVal);
		});
});

function getLifeByHour(timeVal, dayVal){
	console.log("by hour is being called...");
	for(var i =0; i<life.length; i++){
		if(dayVal == life[i].day){
			if(timeVal == life[i].time){
				myActivity = life[i].activity;
				track = life[i].track;
				artist = life[i].artist;
				mylng = life[i].location.geo[1];
				mylat = life[i].location.geo[0];
			}
		}
	}
	setHistory(artist, track);
	setActivityImage(myActivity);
	initMap(mylat, mylng);
}

function setHistory(artist, track){
	if ((artist == "none"|| artist ==null) && (track =="none" || track == null)){
		$("#headphones").attr("src", "img/noheadphones.png");
		$("#artist").empty();
		$("#track").empty();
	} else {
		$("#headphones").attr("src", "img/headphones.png");
		$("#artist").text(artist);
		$("#track").text(track);
	}
}

function setActivityImage(activity){
	console.log('set the activity image for ' + activity);

	for(var i=0;i<instaData.length;i++){
		var matchStatus = $.inArray(activity, instaData[i].tags);
		if(matchStatus!=-1){
			imgAct = instaData[i].images.standard_resolution.url;
			$("#activityImg").attr("src", imgAct);
			return;
		}
	}
	imgAct = "img/"+myActivity+".png";
	$("#activityImg").attr("src",imgAct);
}

function initVars(){
	imgAct = "img/handstanding.png";
	$("#activityImg").attr("src",imgAct);
	mylat = 40.703791;
	mylng = -73.93788;
	$("#headphones").attr("src", "img/noheadphones.png");
}

function initInsta(){
	var id = "d76eab0645a34b1598e211af5370dd4d";
	var userID = 1701856516; //my userID 

	$.ajax({
		type: "GET",
		dataType: "jsonp",
		cache: false,
		url: "https://api.instagram.com/v1/users/"+userID+"/media/recent/?client_id=" + id,
		success: function(response) {
			instaData = response.data;
		}
	});
}

function initMap(mlat, mlng) {
	// Specify features and elements to define styles.
	var styleArray = [
		{
			featureType: "all",
			stylers: [
			 { saturation: -90 }
			]
		},{
			featureType: "road",
			elementType: "geometry",
			stylers: [
				{ hue: "#00ffee" },
				{ saturation: 150 }
			]
		},
	];

	// Create a map object and specify the DOM element for display.
	var map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: mylat, lng: mylng},
		scrollwheel: false,
		// Apply the map style array to the map.
		styles: styleArray,
		zoom: 15
	});
}