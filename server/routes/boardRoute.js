const express = require('express');
const route = express.Router();
const { getBoard, createBoard, updateBoard, deleteBoard } = require('../controller/boardController')

route.get('/getboard', getBoard);
route.post('/createboard', createBoard)
route.put('/updateboard', updateBoard)
route.delete('/deleteboard', deleteBoard)

module.exports = route