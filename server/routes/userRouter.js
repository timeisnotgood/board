const express = require('express');
const userController = require('../controller/userController');
const authenticate = require('../auth');
const route = express.Router();

route.post('/login', userController.login);

route.post('/createuser', userController.signup);

module.exports = route;