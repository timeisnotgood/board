const express = require('express');
const route = express.Router();
const { getCard, createCard, updateCard, deleteCard,
        getComment, createComment,
        updateComment,
        deleteComment
 } = require("../controller/cardController");

// card Routes
route.get('/getcard', getCard);
route.post('/createcard', createCard);
route.put('/updatecard', updateCard);
route.delete('/deletecard', deleteCard);

// cmt Routes
route.get('/getcmt', getComment);
route.post('/createcmt', createComment);
route.put('/updatecmt', updateComment);
route.delete('/deletecmt', deleteComment);

module.exports = route;