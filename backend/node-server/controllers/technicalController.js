const mongoose = require("mongoose");
const TechnicalQuestionsModel = require("../models/technicalQuestionsSchema");
var http = require('http');  
const { response } = require("express");
var MongoClient = require('mongodb').MongoClient; 
const DB_URL = "mongodb+srv://mpp:mpp@cluster0.ybb0e.mongodb.net/mppproject?retryWrites=true&w=majority"


mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


const connection = mongoose.connection

connection.once('open', ()=>{
    console.log("Database Connection Successful")
})


async function storeSingleQuestionAnswerKeyword(question, answer, requiredWords,topic){
let type = typeof(question);
type = type;
    try{
        let technicalQuestionsModel = new TechnicalQuestionsModel();
        technicalQuestionsModel.question = question;
        technicalQuestionsModel.answer = answer;
        technicalQuestionsModel.requiredWords = requiredWords;
        technicalQuestionsModel.topic = topic;

        
        await technicalQuestionsModel.save((err,data)=>{
            if(err)
            {
                throw new Error(err);
            }
            else{
                return "Message stored successfully"
            }
        })
    
    }catch(error)
    {
        throw error;
    }


}

//Added comments
async function getTechnicalQuestions(topicName=null)
{
    if(topicName!=null)
    {
        try{
            const mongoClient = new MongoClient(DB_URL);

            await mongoClient.connect(await function(err, client) {
                client.db("mppproject").collection('technicalquestions').find({topic:"topic"}).toArray(function(err, result) {  
                    if (err) throw err; 
                    client.close();
                    });  
            });

            
        }catch(error)
        {
            console.log(error);
        }
    }
    else{
        try{
            const mongoClient = new MongoClient(DB_URL);

            await mongoClient.connect(function(err, client) {
                client.db("mppproject").collection('technicalquestions').find().toArray(function(err, result) {  
                    if (err)
                    {
                        throw err;
                    }  
                    client.close();
                    response.end;
                    // console.log(result);

                    });  
            });
            
        }catch(error)
        {
            return error
        }
    }
}


module.exports = {
    storeSingleQuestionAnswerKeyword,
    getTechnicalQuestions
}