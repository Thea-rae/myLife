var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var twilio = require('twilio');
var geocoder = require('geocoder');


// our db models
// var Person = require("../models/person.js");
// var Course = require("../models/course.js");
var myLife = require("../models/mylife.js");

/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */
router.get('/', function(req, res) {
	res.render('index.html')
});

router.get('/add-life', function(req,res){
	res.render('add.html')
})

router.post('/api/create', function(req, res){

		console.log('the data we received is --> ')
		console.log(req.body);

		// pull out the information from the req.body
		var day = req.body.day;
		var time = req.body.time;
		var activity = req.body.activity;
		var artist = req.body.artist;
		var track = req.body.track;
		var location = req.body.location;

		// hold all this data in an object
		// this object should be structured the same way as your db model
		var mylifeObj = {
			day: day,
			time: time,
			activity: activity,
			artist: artist,
			track: track
		};

		// if there is no location, return an error
		if(!location) return res.json({status:'ERROR', message: 'You are missing a required field or have submitted a malformed request.'})

		// now, let's geocode the location
		geocoder.geocode(location, function (err,data) {


			// if we get an error, or don't have any results, respond back with error
			if (!data || data==null || err || data.status == 'ZERO_RESULTS'){
				var error = {status:'ERROR', message: 'Error finding location'};
				return res.json({status:'ERROR', message: 'You are missing a required field or have submitted a malformed request.'})
			}

			// else, let's pull put the lat lon from the results
			var lon = data.results[0].geometry.location.lng;
			var lat = data.results[0].geometry.location.lat;

			// now, let's add this to our animal object from above
			mylifeObj.location = {
				geo: [lon,lat], // need to put the geo co-ordinates in a lng-lat array for saving
				day: data.results[0].formatted_address // the location day
			}

			// now, let's save it to the database
			// create a new animal model instance, passing in the object we've created
			var life = new myLife(mylifeObj);

			// now, save that animal instance to the database
			// mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save    
			life.save(function(err,data){
				// if err saving, respond back with error
				if (err){
					var error = {status:'ERROR', message: 'Error saving animal'};
					return res.json(error);
				}

				console.log('saved a new animal!');
				console.log(data);

				// now return the json data of the new animal
				var jsonData = {
					status: 'OK',
					life: data
				}

				return res.json(jsonData);

			})

		});
});


router.get('/api/get', function(req,res){

	myLife.find(function(err,data){

			if(err){
				var error = {
					status: "ERROR",
					message: err
				}
				return res.json(err)
			}

			var jsonData = {
				status: "OK",
				life: data
			}

			return res.json(jsonData);

	})

})

router.get('/api/coding', function(req,res){
		myLife.find({activity:"Coding"},function(err,data){

			if(err){
				var error = {
					status: "ERROR",
					message: err
				}
				return res.json(err)
			}

			var jsonData = {
				status: "OK",
				life: data
			}

			return res.json(jsonData);

	})

})

router.get('/api/time', function(req,res){
		var timeVal = req.body.timeVal
		var dayVal = req.body.dayVal;
		console.log(req.body);

		myLife
		.find()
		.where('time').equals(timeSelector)
		.where('day').equals(daySelector)
		.exec(function(err,data){

			if(err){
				var error = {
					status: "ERROR",
					message: err
				}
				return res.json(err)
			}

			var jsonData = {
				status: "OK",
				life: data
			}

			return res.json(jsonData);

	})

})

router.get('/api/update', function(req,res){

	var dataToUpdate = {
		activity:"dancing",
		artist:"wildlight",
		track:"twirl me"
	}

		myLife.findOneAndUpdate({time:"10:00"}, dataToUpdate, function(err,data){

			if(err){
				var error = {
					status: "ERROR",
					message: err
				}
				return res.json(err)
			}

			var jsonData = {
				status: "OK",
				life: data
			}

			return res.json(jsonData);

	})

})

router.get('/api/remove', function(req,res){

		myLife.findOneAndUpdate({time:"11:00"}, dataToUpdate, function(err,data){

			if(err){
				var error = {
					status: "ERROR",
					message: err
				}
				return res.json(err)
			}

			var jsonData = {
				status: "OK",
				life: data
			}

			return res.json(jsonData);

	})

})

module.exports = router;







