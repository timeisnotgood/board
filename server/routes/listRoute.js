const express = require('express');
const route = express.Router();
const listController = require("../controller/listController");
const authenticate = require('../auth');

route.get('/getlist/:id', authenticate, listController.getList);
route.post('/createlist', authenticate, listController.createList);
route.put('/updatelist', authenticate, listController.updateList);
route.put('/updatecardorder', authenticate, listController.updatecardOrder);
route.delete('/deletelist/:id', authenticate, listController.deleteList);

module.exports = route;