const express = require("express");

const router = require("./routes");
const expressConfig = require("./config/expressConfig");
const dbConnect = require("./config/dbConfig");

const app = express();

expressConfig(app);

app.use(router);

dbConnect()
.then(() => console.log('Db connected successfully'))
.catch(error => console.log('Db error:', error));

app.listen(5000, console.log('Server is listening on port 5000...'));