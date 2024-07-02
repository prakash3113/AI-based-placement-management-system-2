const mongoose = require("mongoose");

const technicalQuestionsModel = mongoose.Schema({
    question:{
        type:String,
        required: true,
    },
    answer:{
        type:String,
        required: true
    },
    requiredWords:{
        type:Array,
        required: true
    },
    topic:{
        type:String,
        required: true
    }
})

const TechnicalQuestionsModel = mongoose.model('TechnicalQuestion',technicalQuestionsModel);

module.exports = TechnicalQuestionsModel;