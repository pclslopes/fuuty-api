// api/v1/countries
// api/v1/countries/{id}
// api/v1/countries/{id}/leagues
var express = require('express');
var _ = require('lodash');
var CountryModel = require('../models/Country');
var mongoose = require('mongoose');
const check = require('express-validator/check').check;
const validationResult = require('express-validator/check').validationResult;
const checkSchema = require('express-validator/check').checkSchema;
const matchedData = require('express-validator/filter').matchedData;
const sanitize = require('express-validator/filter').sanitize;

//import express from 'express';
//import _ from 'lodash';
//import CountryModel from '../models/Country';
//import mongoose from 'mongoose';
//import { check, validationResult, checkSchema } from 'express-validator/check';
//import { matchedData, sanitize } from 'express-validator/filter';

const router = express.Router();

router.get('/', function(req, res){
    CountryModel.find({}, function(err, countries) {
        if(err) res.status(500).send(err);
        res.json(countries);
    });
});

router.get('/:id', function(req, res){
    CountryModel.findById(req.params.id, function(err, country) {
        if(err) res.status(500).send(err);
        if(country){
            res.json(country);
        }else{
            res.status(404).send(`Country with id: ${req.params.id} not found.`)
        }
    });
});

router.post('/',[ 
    check('CountryName').isLength({ min: 1 }).withMessage('CountryName is required'),
    check('CountrySymbol').isLength({ min: 1 }).withMessage('CountrySymbol is required'),
    sanitize('CountryName').trim().escape(),
    sanitize('CountrySymbol').trim().escape()
], function(req, res) {

    // Parameter Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }

    const id = new mongoose.Types.ObjectId();
    const countryToPersist = Object.assign({
        _id : id
    }, req.body);
    const country = new CountryModel(countryToPersist);
    country.save().then(function(err, country) {
        if(err) res.status(500).send(err);
        res.json(country);
    });
    console.log(JSON.stringify(countryToPersist));
});

router.put('/:id',[ 
        check('CountryName').isLength({ min: 1 }).withMessage('CountryName is mandatory'),
        check('CountrySymbol').isLength({ min: 1 }).withMessage('CountrySymbol is mandatory'),
        sanitize('CountryName').trim().escape(),
        sanitize('CountrySymbol').trim().escape()
    ], function(req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }
    
    CountryModel.findById(req.params.id, function(err, country) {
        if(err) res.status(500).send(err);
        if(country){
            country.CountryName = req.body.CountryName;
            country.CountrySymbol = req.body.CountrySymbol;
            country.save().then(function(err, country) {
                if(err) res.status(500).send(err);
                res.json(country);
            });
        }else{
            res.status(404).send(`Country with id: ${req.params.id} not found.`)
        }
    });
});

router.delete('/:id', function(req, res){
    CountryModel.findByIdAndRemove(req.params.id, function(err, country) {
        if(err) res.status(500).send(err);
        res.status(200).send(`Country with id: ${req.params.id} was deleted.`);
    });
});

module.exports = router;