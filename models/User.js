const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
  notice there is no ID. That's because Mongoose will assign
  an ID by default to all schemas
*/

const UserSchema = new Schema({
    _id: Schema.Types.ObjectId,
    UserName: { type: String, required: true },
    UserEmail: { type: String, required: true },
    UserFBID: String,
    UserToken: String,
    UserIsAdmin:  { type: Boolean, default: false },
    UserLeagues: [{ type: Schema.Types.ObjectId, ref: 'UserLeague' }],
    UserRegisterDate: { type: Date, default: Date.now },
    UserLastEmailBetWarning: Date,
    UserLastLogin: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema, 'user');