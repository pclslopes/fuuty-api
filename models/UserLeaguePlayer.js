const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
  notice there is no ID. That's because Mongoose will assign
  an ID by default to all schemas
*/

const UserLeaguePlayerSchema = new Schema({
    _id: Schema.Types.ObjectId,
    UserLeague: { type: Schema.Types.ObjectId, ref: 'UserLeague', required: true },
    User: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    UserIsAdmin: { type: Boolean, default: false, required: true },
    UserLeaguePlayerBets: [{ type: Schema.Types.ObjectId, ref: 'UserLeaguePlayerBet' }],
    DateCreated: { type: Date, default: Date.now },
    DateUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserLeaguePlayer', UserLeaguePlayerSchema);