const express = require('express');
const route = express.Router();

route.get("/delete", function(req,res,next){
    res.redirect('/about');
})

module.exports = route;