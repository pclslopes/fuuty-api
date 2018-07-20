// api/v1/leagues/{id}
// api/v1/leagues/{id}/teams/

import express from 'express';
import mongoose from 'mongoose';
import _ from 'lodash';
import LeagueModel from '../models/League';
import LeagueTeamModel from '../models/LeagueTeam';
import CountryModel from '../models/Country';
import TeamModel from '../models/Team';
import { check, validationResult, checkSchema } from 'express-validator/check';
import { matchedData, sanitize } from 'express-validator/filter';

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

router.post('/:id/teams', [
        check('Team').isLength({ min: 1 }).withMessage('Team is required'),
        sanitize('id').trim().escape(),
        sanitize('Team').trim().escape()
    ], (req, res) => {

    // Parameter Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }

    // Validate League
    LeagueModel.findById(req.params.id, (err, league) => {
        if(err) return res.status(500).send(err);
        if(!league) return res.status(404).send(`League with id: ${req.params.id} not found.`)
    });
    // Validate Team
    TeamModel.findById(req.body.Team, (err, team) => {
        if(err) return res.status(500).send(err);
        if(!team) return res.status(404).send(`Team with id: ${req.body.Team} not found.`)
    });
    
    const id = new mongoose.Types.ObjectId();
    const leagueTeamToPersist = Object.assign({
        _id : id,
        League : req.params.id
    }, req.body);

    const leagueTeam = new LeagueTeamModel(leagueTeamToPersist);
    leagueTeam.save().then((err, leagueTeam) => {
        if(err) res.status(500).send(err);
        res.json(leagueTeam);
    });
    console.log(JSON.stringify(leagueTeamToPersist));
});

router.post('/',[
        check('Country').isLength({ min: 1 }).withMessage('Country is required'),
        check('LeagueName').isLength({ min: 1 }).withMessage('LeagueName is required'),
        sanitize('Country').trim().escape(),
        sanitize('LeagueName').trim().escape(),
        sanitize('LeagueYearStart').trim().escape(),
        sanitize('LeagueYearEnd').trim().escape(),
        sanitize('LeagueStartDate').trim().escape(),
        sanitize('LeagueIsClosed').trim().escape()
    ], (req, res) => {

    // Parameter Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }

    // Set Model Object
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

router.put('/:id',[
        check('Country').isLength({ min: 1 }).withMessage('Country is required'),
        check('LeagueName').isLength({ min: 1 }).withMessage('LeagueName is required'),
        sanitize('Country').trim().escape(),
        sanitize('LeagueName').trim().escape(),
        sanitize('LeagueYearStart').trim().escape(),
        sanitize('LeagueYearEnd').trim().escape(),
        sanitize('LeagueStartDate').trim().escape(),
        sanitize('LeagueIsClosed').trim().escape()
    ], (req, res) => {
    
    // Parameter Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }

    // Validate Country
    CountryModel.findById(req.body.Country, (err, country) => {
        if(err) return res.status(500).send(err);
        if(!country) return res.status(404).send(`Country with id: ${req.body.Country} not found.`)
    });

    // Validate League
    LeagueModel.findById(req.params.id, (err, league) => {
        if(err) res.status(500).send(err);
        if(league){
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
            res.status(404).send(`League with id: ${req.params.id} not found.`)
        }
    });
});

router.delete('/:id', (req, res) => {
    LeagueModel.findByIdAndRemove(req.params.id, (err, league)=> {
        if(err) res.status(500).send(err);
        res.status(200).send(`League with id: ${req.params.id} was deleted.`);
    });
});

router.delete('/:id/teams/:teamId', (req, res) => {

    // Validate League
    LeagueModel.findById(req.params.id, (err, league) => {
        if(err) return res.status(500).send(err);
        if(!league) return res.status(404).send(`League with id: ${req.params.id} not found.`)
    });
    
    // Find and Remove
    LeagueTeamModel.findByIdAndRemove(req.params.teamId, (err, leagueTeam)=> {
        if(err) res.status(500).send(err);
        res.status(200).send(`League Team with id: ${req.params.teamId} was deleted.`);
    });
});

module.exports = router;