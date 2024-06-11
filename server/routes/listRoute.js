const express = require('express');
const route = express.Router();
const { getList, createList, updateList, deleteList } = require("../controller/listController");

route.get('/getlist', getList);
route.post('/createlist', createList);
route.put('/updatelist', updateList);
route.delete('/deletelist', deleteList);

module.exports = route;