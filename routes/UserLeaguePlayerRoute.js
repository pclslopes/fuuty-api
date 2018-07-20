
// api/v1/user/{id}/leagues/{id}/players
// api/v1/user/{id}/leagues/{id}/players/{id}

import express from 'express';
import mongoose from 'mongoose';
import _ from 'lodash';
import CountryModel from '../models/Country';
import UserModel from '../models/User';
import UserLeagueModel from '../models/UserLeague';
import LeagueModel from '../models/League';
import { check, validationResult, checkSchema } from 'express-validator/check';
import { matchedData, sanitize } from 'express-validator/filter';

const router = express.Router();



module.exports = router;