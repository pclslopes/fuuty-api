
// api/v1/user/{id}/leagues/{id}/players
// api/v1/user/{id}/leagues/{id}/players/{id}
var express = require('express');
var mongoose = require('mongoose');
var _ = require('lodash');
const check = require('express-validator/check').check;
const validationResult = require('express-validator/check').validationResult;
const checkSchema = require('express-validator/check').checkSchema;
const matchedData = require('express-validator/filter').matchedData;
const sanitize = require('express-validator/filter').sanitize;
var CountryModel = require('../models/Country');
var UserModel = require('../models/User');
var UserLeagueModel = require('../models/UserLeague');
var LeagueModel = require('../models/League');

//import express from 'express';
//import mongoose from 'mongoose';
//import _ from 'lodash';
//import CountryModel from '../models/Country';
//import UserModel from '../models/User';
//import UserLeagueModel from '../models/UserLeague';
//import LeagueModel from '../models/League';
//import { check, validationResult, checkSchema } from 'express-validator/check';
//import { matchedData, sanitize } from 'express-validator/filter';

const router = express.Router();



module.exports = router;