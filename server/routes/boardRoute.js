const express = require('express');
const route = express.Router();
const boardController = require('../controller/boardController');
const authenticate = require('../auth');

route.get('/getallboard/:id', authenticate,boardController.getallBoards);
route.get('/getboard/:id', authenticate, boardController.getBoard);
route.post('/createboard', authenticate, boardController.createBoard);
route.put('/updateboard', authenticate, boardController.updateBoard);
route.put('/updatelistorder', authenticate,boardController.updateListOrder);
route.delete('/deleteboard/:id', authenticate,boardController.deleteBoard);

module.exports = route