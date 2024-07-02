const express = require("express");
const router = express.Router();

const technicalController = require("../controllers/technicalController");
const app= express();
var bodyParser = require("body-parser");
// router.get("/technical", getTechnical);
// router.post("/technical", postTechnical);

router.post("/technical/storeSingleQuestion", storeSingleQuestionAnswerKeyword);
router.get("/technical/getTechnicalQuestions", getTechnicalQuestions);


app.use(bodyParser());


async function getTechnicalQuestions(req,res){
    let response = {};
    let body = req.body;

    if(body.topicName)
    {

        try{
        
            response = await technicalController.getTechnicalQuestions(body.topicName);
            return res.send(response);  
        }
        catch(error){
            response.status = {
                code: 400
            };
            response.message = error.toString();
            return res.send(response);
        } 
    
    }
    else{

    try{
        
        response = await technicalController.getTechnicalQuestions();
        return res.send(response);  
    }
    catch(error){
		response.status = {
			code: 400
		};
		response.message = error.toString();
		return res.send(response);
    } 

    }
}



async function storeSingleQuestionAnswerKeyword(req,res){
    let response = {};
    try{

        let body = req.body;
        if (!body.question.question) {
            throw new Error("Question is required");
        }
        if (!body.answer.answer) {
            throw new Error("Answer is required");
        }
        if (!body.requiredWords.requiredWords) {
            throw new Error("Array is required words is required");
        }
        if (!body.topic.topic) {
            throw new Error("Topic is required");
        }
        
        let question = body.question.question;
        let answer = body.answer.answer;
        let requiredWords = body.requiredWords.requiredWords;
        let topic = body.topic.topic;
        
        response = await technicalController.storeSingleQuestionAnswerKeyword(question,answer,requiredWords,topic);
        return res.send(response);  
    }
    catch(error){
		response.status = {
			code: 400
		};
		response.message = error.toString();
		return res.send(response);
    } 
}

module.exports = router;