const expressAsyncHandler = require('express-async-handler');


const getlist = expressAsyncHandler(async(req, res)=>{
    res.json({"status" : "working !"})
});


module.exports = {getlist};