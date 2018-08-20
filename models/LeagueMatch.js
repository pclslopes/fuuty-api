const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
  notice there is no ID. That's because Mongoose will assign
  an ID by default to all schemas
*/

const LeagueMatchSchema = new Schema({
    _id: Schema.Types.ObjectId,
    League: { type: Schema.Types.ObjectId, ref: 'League', required: true },
    LeagueTeamHome: { type: Schema.Types.ObjectId, ref: 'LeagueTeam', required: true },
    LeagueTeamAway: { type: Schema.Types.ObjectId, ref: 'LeagueTeam', required: true },
    LeagueMatchDate: { type: Date },
    LeagueMatchWeekNum: Number,
    LeagueMatchHomeScore: Number,
    LeagueMatchAwayScore: Number,
    LeagueMatchIsLive: Boolean,
    LeagueMatchIsHalfTime: Boolean,
    LeagueMatchIsFullTime: Boolean,
    LeagueMatchCurrentTime: String,
    DateCreated: { type: Date, default: Date.now },
    DateUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LeagueMatch', LeagueMatchSchema, 'LeagueMatch');