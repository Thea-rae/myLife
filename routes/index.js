var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// our db models
var Person = require("../models/person.js");
var Course = require("../models/course.js");
var myLife = require("../models/mylife.js");

/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */
router.get('/', function(req, res) {

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

});

router.get('/add-life', function(req,res){

	res.render('add.html')

})

router.get('/directory', function(req,res){

	res.render('directory.html')

})


router.post('/api/create', function(req,res){

	console.log('!!!!!GOT HERE!!!!!!')
	console.log(req.body);

	var mylifeObj = {
		day: req.body.day,
		time: req.body.time,
		activity: req.body.activity,
		location: req.body.location,
		artist: req.body.artist,
		track: req.body.track
	}

	var life = new myLife(mylifeObj);

	life.save(function(err,data){
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
		myLife.find({time:"10:00"},function(err,data){

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







