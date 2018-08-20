const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
  notice there is no ID. That's because Mongoose will assign
  an ID by default to all schemas
*/

const LeagueSchema = new Schema({
    _id: Schema.Types.ObjectId,
    Country: {type: Schema.Types.ObjectId, ref: 'Country', required: true },
    LeagueName: { type: String, required: true },
    LeagueYearStart: Number,
    LeagueYearEnd: Number,
    LeagueStartDate: { type: Date },
    LeagueIsClosed: Boolean,
    LeagueMatches: [{type: Schema.Types.ObjectId, ref: 'LeagueMatch' }],
    LeagueTeams: [{type: Schema.Types.ObjectId, ref: 'LeagueTeam' }],
    DateCreated: { type: Date, default: Date.now },
    DateUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('League', LeagueSchema, 'league');