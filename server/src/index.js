require('dotenv').config();

const express = require('express');
const cors = require('cors');

const router = require('./routes');
const expressConfig = require('./config/expressConfig');
const dbConnect = require('./config/dbConfig');
const startWeatherNotifier = require('./scheduler/weatherNotifier');

const app = express();

app.use(cors());

expressConfig(app);

app.use(router);

dbConnect()
.then(() => console.log('Db connected successfully'))
.catch(error => console.log('Db error:', error));

startWeatherNotifier();

app.listen(5000, console.log('Server is listening on port 5000...'));