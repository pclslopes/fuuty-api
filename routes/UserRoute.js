
// api/v1/user
// api/v1/user/{id}


// api/v1/user/{id}/leagues/{id}/{id}/bets
// api/v1/user/{id}/leagues/{id}/{id}/bets/{id}

// api/v1/user/{id}/leagues/{id}/Invite

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

// api/v1/user [GET]
router.get('/', (req, res) => {
    UserModel.find().populate('UserLeague').exec((err, users) => {
        if(err) res.status(500).send(err);
        res.json(users);
        console.log("Populated User " + users);
      });
});

// api/v1/user/{id} [GET]
router.get('/:id', (req, res) => {
    UserModel.findById(req.params.id, (err, user) => {
        if(err) res.status(500).send(err);
        if(user){
            res.json(user);
        }else{
            res.status(404).send(`User with id: ${req.params.id} not found.`)
        }
    })
    .populate({ path: 'UserLeague', select: '_id' })
});

// api/v1/user [POST]
router.post('/',[
        check('UserName').isLength({ min: 1 }).withMessage('UserName is required'),
        check('UserEmail').isLength({ min: 1 }).withMessage('UserEmail is required'),
        check('UserFBID').isLength({ min: 1 }).withMessage('UserFBID is required'),
        sanitize('UserName').trim().escape(),
        sanitize('UserEmail').trim().escape(),
        sanitize('UserFBID').trim().escape()
    ], (req, res) => {

    // Parameter Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }

    // Set Model Object
    const id = new mongoose.Types.ObjectId();
    const userToPersist = Object.assign({
        _id : id
    }, req.body);

    const user = new UserModel(userToPersist);
    user.save().then((err, user) => {
        if(err) res.status(500).send(err);
        res.json(user);
    });
    console.log(JSON.stringify(userToPersist));
});

// api/v1/user [PUT]
router.put('/:id',[
        check('UserName').isLength({ min: 1 }).withMessage('UserName is required'),
        check('UserEmail').isLength({ min: 1 }).withMessage('UserEmail is required'),
        check('UserFBID').isLength({ min: 1 }).withMessage('UserFBID is required'),
        sanitize('UserName').trim().escape(),
        sanitize('UserEmail').trim().escape(),
        sanitize('UserFBID').trim().escape()
    ], (req, res) => {

    // Parameter Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }

    // TODO: Only admin can update the following fields:
    // - UserName
    // - UserEmail
    // - UserFBID

    // Validate User
    UserModel.findById(req.params.id, (err, user) => {
        if(err) res.status(500).send(err);
        if(user){

            user.UserName = req.body.UserName;
            user.UserEmail = req.body.UserEmail;
            user.UserFBID = req.body.UserFBID;

            user.save().then((err, team) => {
                if(err) res.status(500).send(err);
                res.json(user);
                });
        }else{
            res.status(404).send(`User with id: ${req.params.id} not found.`)
        }
    }); 
});

// api/v1/user/{id} [DELETE]
router.delete('/:id',[
        sanitize('id').trim().escape()
    ], (req, res) => {
    
    // TODO: Validate if any ref to user exists:
    // - UserLeagues

    UserModel.findByIdAndRemove(req.params.id, (err, user)=> {
        if(err) res.status(500).send(err);
        res.status(200).send(`User with id: ${req.params.id} was deleted.`);
    });
});

// USER LEAGUES

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

// api/v1/user/{id}/leagues/{userLeagueId} [GET]
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

// api/v1/user/{id}/leagues/{userLeagueId} [PUT]
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

// api/v1/user/{id}/leagues/{userLeagueId} [DELETE]
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