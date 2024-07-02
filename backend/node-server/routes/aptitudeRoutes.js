const express = require("express");
const router = express.Router();
const aptitudeController = require("../controllers/aptitudeController");


router.get("/aptitude", getAptitude);
// router.post("/aptitude", postAptitude);



async function getAptitude(req,res){
    let response = await aptitudeController.example();
    return res.send(response);   
}

module.exports = router;