const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
  notice there is no ID. That's because Mongoose will assign
  an ID by default to all schemas
*/

const UserLeaguePlayerBetSchema = new Schema({
    _id: { type: Schema.Types.ObjectId },
    UserLeaguePlayer: { type: Schema.Types.ObjectId, ref: 'UserLeaguePlayer', required: true },
    LeagueMatch: {type: Schema.Types.ObjectId, ref: 'LeagueMatch', required: true },
    LeagueMatchHomeScore: { type: Number, required: true },
    LeagueMatchAwayScore: { type: Number, required: true },
    DateCreated: { type: Date, default: Date.now },
    DateUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserLeaguePlayerBet', UserLeaguePlayerBetSchema);