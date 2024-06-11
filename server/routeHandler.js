const express = require('express');
const cors = require("cors")
const app = express();


app.use(express.json())
app.use(cors());

// board Routes --**--
app.use('/board', require("./routes/boardRoute"))

// list Routes --**--
app.use('/list', require("./routes/listRoute"))


module.exports = {app};