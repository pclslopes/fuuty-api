// api/v1/users
// api/v1/users/{id}
// api/v1/users/{id}/leagues
// api/v1/users/{id}/leagues/{id}
// api/v1/users/{id}/leagues/{id}/leaguematch
// api/v1/users/{id}/leagues/{id}/leaguematch/{id}
// api/v1/users/{id}/leagues/{id}/leaguematch/{id}/bets
// api/v1/users/{id}/leagues/{id}/leaguematch/{id}/bets/{id}
// api/v1/users/{id}/leagues/{id}/players
// api/v1/users/{id}/leagues/{id}/players/{id}
// api/v1/users/{id}/leagues/{id}/Invite

import express from 'express';
//import _ from 'lodash';
import CountryModel from '../models/Country';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', (req, res) => {
    CountryModel.find((err, countries) => {
        if(err) res.status(500).send(err);
        res.json(countries);
    });
});

router.get('/:id', (req, res) => {
    CountryModel.findById(req.params.id, (err, country) => {
        if(err) res.status(500).send(err);
        if(country){
            res.json(country);
        }else{
            res.status(404).send(`Country with id: ${req.params.id} not found.`)
        }
    });
});

router.post('/', (req, res) => {
    const id = new mongoose.Types.ObjectId();
    const countryToPersist = Object.assign({
        _id : id
    }, req.body);
    const country = new CountryModel(countryToPersist);
    country.save().then((err, country) => {
        if(err) res.status(500).send(err);
        res.json(country);
    });
    console.log(JSON.stringify(countryToPersist));
});

router.put('/:id', (req, res) => {
    CountryModel.findById(req.params.id, (err, country) => {
        if(err) res.status(500).send(err);
        if(country){
            country.CountryName = req.body.CountryName;
            country.CountrySymbol = req.body.CountrySymbol;
            country.save().then((err, country) => {
                if(err) res.status(500).send(err);
                res.json(country);
            });
        }else{
            res.status(404).send(`Country with id: ${req.params.id} not found.`)
        }
    });
});

router.delete('/:id', (req, res) => {
    CountryModel.findByIdAndRemove(req.params.id, (err, country)=> {
        if(err) res.status(500).send(err);
        res.status(200).send(`Country with id: ${req.params.id} was deleted.`);
    });
});
/*
router.param('id', (req, res, next, id) => {
    if(isNaN(id)) {
        next(`${id} is not a valid number.`);
    }
    next();
});
*/
module.exports = router;