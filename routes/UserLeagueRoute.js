
// api/v1/user/{id}/leagues
// api/v1/user/{id}/leagues/{id}

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

// api/v1/user/{id}/leagues [GET]
router.get('/:id/leagues',[
        sanitize('id').trim().escape()
    ], (req, res) => {

    // Validate User
    UserModel.findById(req.params.id, (err, user) => {
        if(err) return res.status(500).send(err);
        if(!user) return res.status(404).send(`User with id: ${req.params.id} not found.`)
    });

    UserLeagueModel.find({ User: req.params.id }, (err, userLeagues) => {
        if(err) res.status(500).send(err);
        res.json(userLeagues);
    });
});

// api/v1/user/{id}/leagues/{leagueId} [GET]
router.get('/:id/leagues/:userLeagueId',[
        sanitize('id').trim().escape(),
        sanitize('userLeagueId').trim().escape()
    ], (req, res) => {

    // Validate User
    UserModel.findById(req.params.id, (err, user) => {
        if(err) return res.status(500).send(err);
        if(!user) return res.status(404).send(`User with id: ${req.params.id} not found.`)
    });

    UserLeagueModel.findById(req.params.userLeagueId, (err, userLeague) => {
        if(err) return res.status(500).send(err);
        if(!userLeague) return res.status(404).send(`UserLeague with id: ${req.params.userLeagueId} not found.`)
    });
});

// api/v1/user/{id}/leagues [POST]
router.post('/:id/leagues', [
        check('League').isLength({ min: 1 }).withMessage('League is required'),
        check('UserLeagueName').isLength({ min: 1 }).withMessage('UserLeagueName is required'),
        sanitize('League').trim().escape(),
        sanitize('UserLeagueName').trim().escape(),
        sanitize('UserLeagueRules').trim().escape(),
        sanitize('UserLeagueIsGlobal').trim().escape()
    ], (req, res) => {

    // Parameter Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }

    // Validate User
    UserModel.findById(req.params.id, (err, user) => {
        if(err) return res.status(500).send(err);
        if(!user) return res.status(404).send(`User with id: ${req.params.id} not found.`)
    });

    // Validate League
    LeagueModel.findById(req.body.League, (err, league) => {
        if(err) return res.status(500).send(err);
        if(!league) return res.status(404).send(`League with id: ${req.body.League} not found.`)
    });

    // Persist
    const id = new mongoose.Types.ObjectId();
    const userLeagueToPersist = Object.assign({
        _id : id,
        User : req.params.id
    }, req.body);

    const userLeague = new UserLeagueModel(userLeagueToPersist);
    userLeague.save().then((err, userLeague) => {
        if(err) res.status(500).send(err);
        res.json(userLeague);
    });
    console.log(JSON.stringify(userLeagueToPersist));
});

router.put('/:id/leagues/:userLeagueId',[
        check('League').isLength({ min: 1 }).withMessage('League is required'),
        check('UserLeagueName').isLength({ min: 1 }).withMessage('UserLeagueName is required'),
        sanitize('id').trim().escape(),
        sanitize('userLeagueId').trim().escape(),
        sanitize('UserLeagueName').trim().escape(),
        sanitize('UserLeagueRules').trim().escape(),
        sanitize('UserLeagueIsGlobal').trim().escape()
    ], (req, res) => {

    // Parameter Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }

    // Validate User
    UserModel.findById(req.params.id, (err, user) => {
        if(err) return res.status(500).send(err);
        if(!user) return res.status(404).send(`User with id: ${req.params.id} not found.`)
    });

    // Validate League
    LeagueModel.findById(req.body.League, (err, league) => {
        if(err) return res.status(500).send(err);
        if(!league) return res.status(404).send(`UserLeague with id: ${req.body.League} not found.`)
    });

    // Validate User League and Update
    UserLeagueModel.findById(req.params.userLeagueId, (err, userLeague) => {
        if(err) res.status(500).send(err);
            if(userLeague){

                //userLeague.User = req.params.id; (shouldnt be needed as object already has the user loaded)
                userLeague.League = req.body.League;
                userLeague.UserLeagueName = req.body.UserLeagueName;
                userLeague.UserLeagueRules = req.body.UserLeagueRules;
                userLeague.UserLeagueIsGlobal = req.body.UserLeagueIsGlobal;

                userLeague.save().then((err, userLeague) => {
                    if(err) res.status(500).send(err);
                    res.json(userLeague);
            });
        }else{
            res.status(404).send(`UserLeague with id: ${req.params.userLeagueId} not found.`)
        }
    }); 
});

// api/v1/user/{id} [DELETE]
router.delete('/:id/leagues/:userLeagueId',[
        sanitize('id').trim().escape(),
        sanitize('userLeagueId').trim().escape()
    ], (req, res) => {

    // TODO: Validate if any ref exists:
    // - UserLeaguePlayer ?
    // - UserLeaguePlayerBet ?


    UserModel.findByIdAndRemove(req.params.id, (err, user)=> {
        if(err) res.status(500).send(err);
        res.status(200).send(`User with id: ${req.params.id} was deleted.`);
    });
});

module.exports = router;