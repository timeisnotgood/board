const express = require('express')
const route = express.Router();
const { getlist } = require("../controller/listController")

route.get('/getlist', getlist)

module.exports = route;