const express = require('express');
const route = express.Router();
const boardController = require('../controller/boardController')

route.get('/getboard', boardController.getBoard);
route.post('/createboard', boardController.createBoard);
route.put('/updateboard', boardController.updateBoard);
route.put('/updatelistorder', boardController.updateListOrder);
route.delete('/deleteboard', boardController.deleteBoard);

module.exports = route