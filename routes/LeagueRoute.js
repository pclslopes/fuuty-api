// api/v1/leagues/{id}
// api/v1/leagues/{id}/teams/

import express from 'express';
import _ from 'lodash';
import LeagueModel from '../models/League';
import LeagueTeamModel from '../models/LeagueTeam';
import CountryModel from '../models/Country';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', (req, res) => {
    LeagueModel.find((err, leagues) => {
        if(err) res.status(500).send(err);
        res.json(leagues);
    });
});

router.get('/:id', (req, res) => {
    LeagueModel.findById(req.params.id).populate('').exec((err, league) => {
        if(err) res.status(500).send(err);
        if(league){
            res.json(league);
        }else{
            res.status(404).send(`League with id: ${req.params.id} not found.`)
        }
    });
});

router.get('/:id/teams', (req, res) => {
    LeagueModel.findById(req.params.id, (err, league) => {
        if(err) res.status(500).send(err);
        if(league){
            LeagueTeamModel.find({ League: req.params.id }, (err, teams) => {
                if(err) res.status(500).send(err);
                res.json(teams);
            });
        }else{
            res.status(404).send(`League with id: ${req.params.id} not found.`)
        }
    });
});

router.post('/', (req, res) => {
    const id = new mongoose.Types.ObjectId();
    const leagueToPersist = Object.assign({
        _id : id
    }, req.body);

    // Validate Country
    CountryModel.findById(leagueToPersist.Country, (err, country) => {
        if(err) res.status(500).send(err);
        if(country){
            const league = new LeagueModel(leagueToPersist);
            league.save().then((err, league) => {
                if(err) res.status(500).send(err);
                res.json(league);
            });
            console.log(JSON.stringify(leagueToPersist));
        }else{
            res.status(404).send(`Country with id: ${leagueToPersist.Country} not found.`)
        }
    });
});

router.put('/:id', (req, res) => {
    LeagueModel.findById(req.params.id, (err, league) => {
        if(err) res.status(500).send(err);
        if(league){
            // Validate Country
            CountryModel.findById(req.body.Country, (err, country) => {
                if(err) res.status(500).send(err);
                if(country){
                    league.Country = req.body.Country;
                    league.LeagueName = req.body.LeagueName;
                    league.LeagueYear = req.body.LeagueYear;
                    league.LeagueStartDate = req.body.LeagueStartDate;
                    // LeagueIsClosed: not updated here
                    // LeagueMatches: not updated here
                    // LeagueTeams: not updated here
                    league.save().then((err, team) => {
                        if(err) res.status(500).send(err);
                        res.json(league);
                     });
                }else{
                    res.status(404).send(`Country with id: ${eq.body.Country} not found.`)
                }
            });
        }else{
            res.status(404).send(`League with id: ${req.params.id} not found.`)
        }
    });
});

router.delete('/:id', (req, res) => {
    LeagueModel.findByIdAndRemove(req.params.id, (err, country)=> {
        if(err) res.status(500).send(err);
        res.status(200).send(`League with id: ${req.params.id} was deleted.`);
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