const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
  notice there is no ID. That's because Mongoose will assign
  an ID by default to all schemas
*/

const CountrySchema = new Schema({
    _id: Schema.Types.ObjectId,
    CountryName: { type: String, required: true },
    CountrySymbol: { type: String, required: true },
    DateCreated: { type: Date, default: Date.now },
    DateUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Country', CountrySchema);