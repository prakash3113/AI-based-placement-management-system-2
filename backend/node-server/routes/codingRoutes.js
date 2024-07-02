const express = require("express");
const router = express.Router();

const codingController = require("../controllers/codingController");


router.get("/coding", getCoding);
// router.post("/coding", postCoding);



async function getCoding(req,res){
    let response = await codingController.example();
    return res.send(response);   
}

// async function postCoding(req,res){
//     let response = await controller.example();
//     return res.send(response);   
// }

module.exports = router;