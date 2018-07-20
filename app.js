import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import expressValidator from 'express-validator';
import Config from './config/config';
import CountryRoute from './routes/CountryRoute';
import LeagueRoute from './routes/LeagueRoute';
import TeamRoute from './routes/TeamRoute';
import UserRoute from './routes/UserRoute';
import UserLeagueRoute from './routes/UserLeagueRoute';
import LeagueMatchRoute from './routes/LeagueMatchRoute';
import _ from 'lodash';
import bodyParser from 'body-parser';
import path from 'path';

const buildUrl = (version, path) => `/api/${version}/${path}`;
const COUNTRY_BASE_URL = buildUrl('v1', 'country');
const LEAGUE_BASE_URL = buildUrl('v1', 'league');
const LEAGUE_MATCH_BASE_URL = buildUrl('v1', 'league/:id/leaguematches');
const TEAM_BASE_URL = buildUrl('v1', 'team');
const USER_BASE_URL = buildUrl('v1', 'user');
const USER_LEAGUE_BASE_URL = buildUrl('v1', 'user/:id/leagues');

// Server (Express) Config
const server = express();
server.use(morgan('tiny'));
server.use(bodyParser.json());
server.use(expressValidator());
server.use(COUNTRY_BASE_URL, CountryRoute);
server.use(LEAGUE_BASE_URL, LeagueRoute);
server.use(LEAGUE_MATCH_BASE_URL, LeagueMatchRoute);
server.use(TEAM_BASE_URL, TeamRoute);
server.use(USER_BASE_URL, UserRoute);
server.use(USER_LEAGUE_BASE_URL, UserLeagueRoute);


// Database Connect
mongoose.connect(Config.database.url, { useNewUrlParser: true });
const db = mongoose.connection;

db.once('open', () => {
    console.log(`Connected to the DB in MLabs [${Config.database.db}]`);
});

// Server Start
server.listen(Config.server.port, () => {
    console.log(`Server started on [${Config.server.host}] port [${Config.server.port}]`);
});

