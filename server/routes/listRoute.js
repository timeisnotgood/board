const express = require('express');
const route = express.Router();
const listController = require("../controller/listController");

route.get('/getlist', listController.getList);
route.post('/createlist', listController.createList);
route.put('/updatelist', listController.updateList);
route.put('/updatecardorder', listController.updatecardOrder);
route.delete('/deletelist', listController.deleteList);

module.exports = route;