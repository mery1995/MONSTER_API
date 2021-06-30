const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const app = express();
const monsterRouter = require('./routes/monsters');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(userRouter);
app.use(monsterRouter);
module.exports = app;
