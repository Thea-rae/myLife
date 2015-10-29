var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html

var mylifeSchema = new Schema({
	day: String,
	time: String,
	activity: String,
	location: String,
	artist: String,
	track: String,
	dateAdded : { type: Date, default: Date.now }
})

// export 'Person' model so we can interact with it in other files
module.exports = mongoose.model('myLife',mylifeSchema);