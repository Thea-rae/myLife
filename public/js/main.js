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
	var currentDay;
	var dayPosted;

$(document).ready(function(){
	var date = new Date().toJSON();
	var currentDate = date.substr(8,2);
	currentDay = currentDate.valueOf();

	initInsta();
	initVars();
	getLife();



	function getLife(){
		jQuery.ajax({
			url: '/api/get',
			dataType: 'json', success :function(response){
				console.log(response);
				life = response.life;
				fillArrays();
			}
		})
	}

	$(function(){
		var select = $('#timeSelector');
		var slider = $("<div id ='timeslider' placeholder='Time'></div>").insertAfter(select).slider({
			min: 1,
			max: 24,
			range:"true",
			value: select[0].selectedIndex+1,
			slide: function(event, ui){
				select[0].selectedIndex = ui.value-1;
			}
		});
	});

		$(function(){
		var select = $('#daySelector');
		var slider = $("<div id ='dayslider' placeholder ='Day'></div>").insertAfter(select).slider({
			min: 1,
			max: 7,
			range:"true",
			value: select[0].selectedIndex+1,
			slide: function(event, ui){
				select[0].selectedIndex = ui.value-1;
			}
		});
	});

		$("#selectors").on("slidestop",function(event, ui){
			var dayVal = $('#daySelector').val();
			var timeVal = $('#timeSelector').val();
			getLifeByHour(timeVal, dayVal);
		});
});

function getLifeByHour(timeVal, dayVal){
	for(var i =0; i<life.length; i++){
		if(dayVal.toLowerCase() == life[i].day.toLowerCase()){
			if(timeVal == life[i].time){
				myActivity = life[i].activity.toLowerCase();
				console.log(myActivity);
				track = life[i].track.toLowerCase();
				artist = life[i].artist.toLowerCase();
				mylat = life[i].location.geo[1];
				mylng = life[i].location.geo[0];
				callAllTheThings(myActivity, dayVal, timeVal, artist, track, mylat, mylng);
			}else{
				track = "none";
				artist = "none";
				myActivity = "sleeping";
				mylat = 40.703791;
				mylng = -73.93788;
				callAllTheThings(myActivity, dayVal, timeVal, artist, track, mylat, mylng);
			}
		}
	}
}

function callAllTheThings(act, day, time, artist, track, lat, lng){
				initMap(lat,lng);
				setHistory(artist, track);
				setActivityImage(act);
				currently(act, day, time);
}

function currently(activity, day, time){
	var p0 = "On "+ day;
	var p1 = "At "+ time;
	var p2 = "I was "+ activity;
	$('#myLife').text(p0);
	$('#myLife').text(p1);
	$('#myLife').text(p2);
}

function fillArrays(){
	var datePosted=[];
	var activity = [];
	for(var i =0; i<life.length; i++){
		datePosted.push(life[i].dateAdded.substr(8,2).valueOf());
		if(life[i].dateAdded.substr(8,2).valueOf()>currentDay-7){
			activity.push(life[i].activity.toLowerCase());
		}
	}
	addSummary(mode(activity));
}

function mode(array){
		if(array.length == 0)
			return null;
		var modeMap = {};
		var maxEl = array[0], maxCount = 1;
		for(var i = 0; i < array.length; i++)
		{
			var el = array[i];
			if(modeMap[el] == null)
				modeMap[el] = 1;
			else
				modeMap[el]++;	
			if(modeMap[el] > maxCount)
			{
				maxEl = el;
				maxCount = modeMap[el];
			}
		}
		console.log(maxEl);
		return maxEl;
}

function addSummary(mode){
	var p = "<li>In the last 7 days was most offen " + mode  + "</li>";
	$('#myLife').append(p);
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
	for(var i=0;i<instaData.length;i++){
		var matchStatus = $.inArray(activity, instaData[i].tags);
		if(matchStatus!=-1){
			console.log(imgAct);
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