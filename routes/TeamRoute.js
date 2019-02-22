// api/v1/teams
// api/v1/teams/{id}
var express = require('express');
var mongoose = require('mongoose');
var _ = require('lodash');
const check = require('express-validator/check').check;
const validationResult = require('express-validator/check').validationResult;
const checkSchema = require('express-validator/check').checkSchema;
const matchedData = require('express-validator/filter').matchedData;
const sanitize = require('express-validator/filter').sanitize;
var TeamModel = require('../models/Team');
var CountryModel = require('../models/Country');

//import express from 'express';
//import _ from 'lodash';
//import TeamModel from '../models/Team';
//import CountryModel from '../models/Country';
//import mongoose from 'mongoose';
//import { check, validationResult, checkSchema } from 'express-validator/check';
//import { matchedData, sanitize } from 'express-validator/filter';

const router = express.Router();

router.get('/', function(req, res) {
    TeamModel.find().populate('Country').exec(function(err, teams) {
        console.log("this is the rught function");
        if(err) res.status(500).send(err);
        res.json(teams);
    });
});

router.get('/:id', function(req, res) {
    TeamModel.findById(req.params.id).populate('Country').exec(function(err, team) {
        if(err) res.status(500).send(err);
        if(team){
            res.json(team);
        }else{
            res.status(404).send(`Team with id: ${req.params.id} not found.`)
        }
    });
});

router.post('/',[ 
    check('Country').isLength({ min: 1 }).withMessage('Country is required'),
    check('TeamFullName').isLength({ min: 1 }).withMessage('TeamFullName is required'),
    check('TeamShortName').isLength({ min: 1 }).withMessage('TeamShortName is required'),
    sanitize('Country').trim().escape(),
    sanitize('TeamFullName').trim().escape(),
    sanitize('TeamShortName').trim().escape()
], function(req, res){

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }

    const id = new mongoose.Types.ObjectId();
    const teamToPersist = Object.assign({
        _id : id,
        Country: req.body.Country,
        TeamFullName: req.body.TeamFullName,
        TeamShortName: req.body.TeamShortName,
    });

    // Validate Country
    CountryModel.findById(teamToPersist.Country, function(err, country) {
        if(err) res.status(500).send(err);
        if(country){
            const team = new TeamModel(teamToPersist);
            team.save().then(function(err, team) {
                if(err) res.status(500).send(err);
                res.json(team);
            });
            console.log(JSON.stringify(teamToPersist));
        }else{
            res.status(404).send(`Country with id: ${teamToPersist.Country} not found.`)
        }
    });
});

router.put('/:id',[ 
        check('Country').isLength({ min: 1 }).withMessage('Country is mandatory'),
        check('TeamFullName').isLength({ min: 1 }).withMessage('TeamFullName is mandatory'),
        check('TeamShortName').isLength({ min: 1 }).withMessage('TeamShortName is mandatory'),
        sanitize('Country').trim().escape(),
        sanitize('TeamFullName').trim().escape(),
        sanitize('TeamShortName').trim().escape()
    ], function(req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }
    
    TeamModel.findById(req.params.id, function(err, team) {
        if(err) res.status(500).send(err);
        if(team){
                // Validate Country
            CountryModel.findById(req.body.Country, function(err, country) {
                if(err) res.status(500).send(err);
                if(country){
                    team.Country = req.body.Country;
                    team.TeamFullName = req.body.TeamFullName;
                    team.TeamShortName = req.body.TeamShortName;
                    team.save().then(function(err, team) {
                        if(err) res.status(500).send(err);
                        res.json(team);
                     });
                }else{
                    res.status(404).send(`Country with id: ${teamToPersist.Country} not found.`)
                }
            });
        }else{
            res.status(404).send(`Team with id: ${req.params.id} not found.`)
        }
    });
});

router.delete('/:id', function(req, res) {
    TeamModel.findByIdAndRemove(req.params.id, function(err, team) {
        if(err) res.status(500).send(err);
        res.status(200).send(`Team with id: ${req.params.id} was deleted.`);
    });
});

module.exports = router;