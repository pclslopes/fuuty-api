const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
  notice there is no ID. That's because Mongoose will assign
  an ID by default to all schemas
*/

const UserLeagueSchema = new Schema({
    _id: Schema.Types.ObjectId,
    User: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    League: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    UserLeagueName: { type: String, required: true },
    UserLeagueRules: { type: String, required: false },
    UserLeagueIsGlobal: { type: Boolean, default: false },
    DateCreated: { type: Date, default: Date.now },
    DateUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserLeague', UserLeagueSchema, 'userleague');