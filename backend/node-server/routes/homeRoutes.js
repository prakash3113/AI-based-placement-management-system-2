const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController")



router.get("/home", getHome);


async function getHome(req,res){
    let response = await homeController.example();
    return res.send(response);   
}


module.exports = router;