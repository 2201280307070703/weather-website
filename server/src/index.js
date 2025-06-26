require('dotenv').config();

const express = require('express');
const cors = require('cors');

const router = require('./routes');

const expressConfig = require('./configs/expressConfig');
const dbConnect = require('./configs/dbConfig');

const startWeatherNotifier = require('./schedulers/weatherNotifier');
const startRecommendationsNotifier = require('./schedulers/recommendationNotifier');

const app = express();

app.use(cors());

expressConfig(app);

app.use(router);

dbConnect()
.then(() => console.log('Db connected successfully'))
.catch(error => console.log('Db error:', error));

startWeatherNotifier();
startRecommendationsNotifier();

app.listen(5000, console.log('Server is listening on port 5000...'));