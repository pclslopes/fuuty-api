const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
  notice there is no ID. That's because Mongoose will assign
  an ID by default to all schemas
*/

const LeagueTeamSchema = new Schema({
    _id: Schema.Types.ObjectId,
    League: { type: Schema.Types.ObjectId, ref: 'League', required: true },
    Team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    DateCreated: { type: Date, default: Date.now },
    DateUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LeagueTeam', LeagueTeamSchema, 'LeagueTeam');