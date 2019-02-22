
// api/v1/leagues/{id}/leaguematch
// api/v1/leagues/{id}/leaguematch/{id}
var express = require('express');
var mongoose = require('mongoose');
var _ = require('lodash');
const check = require('express-validator/check').check;
const validationResult = require('express-validator/check').validationResult;
const checkSchema = require('express-validator/check').checkSchema;
const matchedData = require('express-validator/filter').matchedData;
const sanitize = require('express-validator/filter').sanitize;
var LeagueMatchModel = require('../models/LeagueMatch');
var LeagueModel = require('../models/League');
var TeamModel = require('../models/Team');

//import express from 'express';
//import mongoose from 'mongoose';
//import _ from 'lodash';
//import LeagueMatchModel from '../models/LeagueMatch';
//import LeagueModel from '../models/League';
//import TeamModel from '../models/Team';
//import { check, validationResult, checkSchema } from 'express-validator/check';
//import { matchedData, sanitize } from 'express-validator/filter';

const router = express.Router();

// api/v1/leagues/{id}/leaguematch [GET]
router.get('/:id/leaguematches',[
        sanitize('id').trim().escape()
    ], function(req, res) {

    // Validate League
    LeagueModel.findById(req.params.id, function(err, league){
        if(err) return res.status(500).send(err);
        if(!league) return res.status(404).send(`League with id: ${req.params.id} not found.`)
    });

    // Get data
    LeagueMatchModel.find({ League: req.params.id }, function(err, leagueMatches) {
        if(err) res.status(500).send(err);
        res.json(leagueMatches);
    });
});

// api/v1/leagues/{id}/leaguematch/{leagueMatchId} [GET]
router.get('/:id/leaguematches/:leagueMatchId',[
        sanitize('id').trim().escape(),
        sanitize('leagueMatchId').trim().escape()
    ], function(req, res) {

    // Validate League
    LeagueModel.findById(req.params.id, function(err, league) {
        if(err) return res.status(500).send(err);
        if(!league) return res.status(404).send(`League with id: ${req.params.id} not found.`)
    });

    LeagueMatchModel.findById(req.params.leagueMatchId, function(err, leagueMatch) {
        if(err) res.status(500).send(err);
        if(leagueMatch){
            res.json(leagueMatch);
        }else{
            res.status(404).send(`LeagueMatch with id: ${req.params.leagueMatch} not found.`)
        }
    });
});

// api/v1/leagues/{id}/leaguematches [POST]
router.post('/:id/leaguematches', [
        check('LeagueTeamHome').isLength({ min: 1 }).withMessage('LeagueTeamHome is required'),
        check('LeagueTeamAway').isLength({ min: 1 }).withMessage('LeagueTeamAway is required'),
        sanitize('LeagueTeamHome').trim().escape(),
        sanitize('LeagueTeamAway').trim().escape(),
        sanitize('LeagueMatchDate').trim().escape(),
        sanitize('LeagueMatchWeekNum').trim().escape(),
        sanitize('LeagueMatchHomeScore').trim().escape(),
        sanitize('LeagueMatchAwayScore').trim().escape(),
        sanitize('LeagueMatchIsLive').trim().escape(),
        sanitize('LeagueMatchIsHalfTime').trim().escape(),
        sanitize('LeagueMatchIsFullTime').trim().escape(),
        sanitize('LeagueMatchCurrentTime').trim().escape(),
    ], function(req, res) {

    // Parameter Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }

    // Validate League
    LeagueModel.findById(req.params.id, function(err, league) {
        if(err) return res.status(500).send(err);
        if(!league) return res.status(404).send(`League with id: ${req.params.id} not found.`)
    });

    // Validate LeagueTeamHome
    TeamModel.findById(req.body.LeagueTeamHome, function(err, team) {
        if(err) return res.status(500).send(err);
        if(!team) return res.status(404).send(`Team[LeagueTeamHome] with id: ${req.body.LeagueTeamHome} not found.`)
    });

    // Validate LeagueTeamAway
    TeamModel.findById(req.body.LeagueTeamAway, function(err, team) {
        if(err) return res.status(500).send(err);
        if(!team) return res.status(404).send(`Team[LeagueTeamAway] with id: ${req.body.LeagueTeamAway} not found.`)
    });

    // Persist
    const id = new mongoose.Types.ObjectId();
    const leagueMatchToPersist = Object.assign({
        _id : id
    }, req.body);

    const leagueMatch = new LeagueMatchModel(leagueMatchToPersist);
    leagueMatch.save().then(function(err, leagueMatch) {
        if(err) res.status(500).send(err);
        res.json(leagueMatch);
    });
    console.log(JSON.stringify(leagueMatchToPersist));
});

// api/v1/leagues/{id}/leaguematch [PUT]
router.post('/:id/leaguematches/:leagueMatchId', [
        check('LeagueTeamHome').isLength({ min: 1 }).withMessage('LeagueTeamHome is required'),
        check('LeagueTeamAway').isLength({ min: 1 }).withMessage('LeagueTeamAway is required'),
        sanitize('LeagueTeamHome').trim().escape(),
        sanitize('LeagueTeamAway').trim().escape(),
        sanitize('LeagueMatchDate').trim().escape(),
        sanitize('LeagueMatchWeekNum').trim().escape(),
        sanitize('LeagueMatchHomeScore').trim().escape(),
        sanitize('LeagueMatchAwayScore').trim().escape(),
        sanitize('LeagueMatchIsLive').trim().escape(),
        sanitize('LeagueMatchIsHalfTime').trim().escape(),
        sanitize('LeagueMatchIsFullTime').trim().escape(),
        sanitize('LeagueMatchCurrentTime').trim().escape(),
    ], function(req, res) {

    // Parameter Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }

    // Validate League
    LeagueModel.findById(req.params.id, function(err, league) {
        if(err) return res.status(500).send(err);
        if(!league) return res.status(404).send(`League with id: ${req.params.id} not found.`)
    });

    // Validate LeagueTeamHome
    TeamModel.findById(req.body.LeagueTeamHome, function(err, team) {
        if(err) return res.status(500).send(err);
        if(!team) return res.status(404).send(`Team[LeagueTeamHome] with id: ${req.body.LeagueTeamHome} not found.`)
    });

    // Validate LeagueTeamAway
    TeamModel.findById(req.body.LeagueTeamAway, function(err, team) {
        if(err) return res.status(500).send(err);
        if(!team) return res.status(404).send(`Team[LeagueTeamAway] with id: ${req.body.LeagueTeamAway} not found.`)
    });

    // Validate League Match and Update
    LeagueMatchModel.findById(req.params.leagueMatchId, function(err, leagueMatch) {
        if(err) res.status(500).send(err);
            if(leagueMatch){

                //userLeague.User = req.params.id; (shouldnt be needed as object already has the user loaded)
                leagueMatch.League = req.body.League;
                leagueMatch.LeagueTeamHome = req.body.LeagueTeamHome;
                leagueMatch.LeagueTeamAway = req.body.LeagueTeamAway;
                leagueMatch.LeagueMatchDate = req.body.LeagueMatchDate;
                leagueMatch.LeagueMatchWeekNum = req.body.LeagueMatchWeekNum;
                leagueMatch.LeagueMatchHomeScore = req.body.LeagueMatchHomeScore;
                leagueMatch.LeagueMatchAwayScore = req.body.LeagueMatchAwayScore;
                leagueMatch.LeagueMatchIsLive = req.body.LeagueMatchIsLive;
                leagueMatch.LeagueMatchIsHalfTime = req.body.LeagueMatchIsHalfTime;
                leagueMatch.LeagueMatchIsFullTime = req.body.LeagueMatchIsFullTime;
                leagueMatch.LeagueMatchCurrentTime = req.body.LeagueMatchCurrentTime;

                leagueMatch.save().then(function(err, leagueMatch) {
                    if(err) res.status(500).send(err);
                    res.json(leagueMatch);
            });
        }else{
            res.status(404).send(`LeagueMatch with id: ${req.params.leagueMatchId} not found.`)
        }
    }); 
});

// api/v1/leagues/{id}/leaguematch/:leagueMatchId [DELETE]
router.delete('/:id/leaguematches/:leagueMatchId',[
        sanitize('id').trim().escape(),
        sanitize('leagueMatchId').trim().escape()
    ], function(req, res) {

    // TODO: Validate if any ref exists:
    // - UserLeaguePlayerBet ?

    LeagueMatchModel.findByIdAndRemove(req.params.id, function(err, leagueMatch) {
        if(err) res.status(500).send(err);
        res.status(200).send(`LeagueMatch with id: ${req.params.leagueMatchId} was deleted.`);
    });
});

module.exports = router;