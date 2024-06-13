const express = require('express');
const route = express.Router();
const cardController = require("../controller/cardController");

// card Routes
route.get('/getcard', cardController.getCard);
route.post('/createcard', cardController.createCard);
route.put('/updatecard', cardController.updateCard);
route.put('/cardinterchange', cardController.cardInterchange);
route.delete('/deletecard', cardController.deleteCard);

// cmt Routes
route.get('/getcmt', cardController.getComment);
route.post('/createcmt', cardController.createComment);
route.put('/updatecmt', cardController.updateComment);
route.delete('/deletecmt', cardController.deleteComment);

module.exports = route;