const express = require('express');
const route = express.Router();
const { getBoard, createBoard, updateBoard, deleteBoard, updateListOrder } = require('../controller/boardController')

route.get('/getboard', getBoard);
route.post('/createboard', createBoard);
route.put('/updateboard', updateBoard);
route.put('/updatelistorder', updateListOrder);
route.delete('/deleteboard', deleteBoard);

module.exports = route