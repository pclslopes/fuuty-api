const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
  notice there is no ID. That's because Mongoose will assign
  an ID by default to all schemas
*/

const TeamSchema = new Schema({
	_id: Schema.Types.ObjectId,
	Country: { type: Schema.Types.ObjectId, ref: 'Country', required: true },
	TeamFullName: { type: String, required: true },
	TeamShortName: { type: String, required: true },
	DateCreated: { type: Date, default: Date.now },
	DateUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Team', TeamSchema);