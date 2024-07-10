const express = require('express');
const route = express.Router();
const cardController = require("../controller/cardController");
const authenticate = require('../auth');
const multer = require('multer');
const upload = multer({limits : {fileSize : 5000000}})

// card Routes
route.get('/getcard', authenticate, cardController.getCard);
route.post('/createcard', authenticate, cardController.createCard);
route.put('/updatecard', authenticate, cardController.updateCard);
route.post('/cardinterchange', authenticate, cardController.cardInterchange);
route.delete('/deletecard/:id', authenticate, cardController.deleteCard);

//-------------------------------------------------------------------------------

// Image upload
route.post('/upload',upload.any(),cardController.uploadImage)
//-------------------------------------------------------------------------------

// discussion  Route
route.get('/getdiscussion/:id', authenticate,cardController.getdiscussion);
route.post('/creatediscussion', authenticate, cardController.createDiscussion);
//------------------------------------------------------------------------------
// cmt Routes
route.get('/getcmt/:id', authenticate, cardController.getComment);
route.post('/createcmt', authenticate, cardController.createComment);
route.put('/updatecmt', authenticate, cardController.updateComment);
route.delete('/deletecmt', authenticate, cardController.deleteComment);

module.exports = route;