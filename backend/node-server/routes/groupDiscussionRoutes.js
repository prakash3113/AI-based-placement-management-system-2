const express = require("express");
const router = express.Router();

const groupDiscussionController = require("../controllers/groupDiscussionController");


router.get("/groupDiscussion", getGroupDiscussion);
// router.post("/groupDiscussion", postGroupDiscussion);


async function getGroupDiscussion(req,res){
    let response = await controller.example();
    return res.send(response);   
}

// async function postGroupDiscussion(req,res){
//     let response = await controller.example();
//     return res.send(response);   
// }


module.exports = router;