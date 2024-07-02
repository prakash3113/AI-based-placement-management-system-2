from flask import Flask,request,jsonify
import sys
# sys.path.insert(1, 'AI-based-placement-management-system/backend/flask-server/controllers')
import accuracyCheckingController as ac

app = Flask(__name__)

@app.route('/technical/updateSingleTechnicalAccuracy', methods = ['POST'])
def checkAccuracy():

        dataForAccuracyChecking = {}
        dataForAccuracyChecking['question'] = request.json["question"]
        dataForAccuracyChecking['answer'] = request.json["answer"]
        dataForAccuracyChecking['requiredWords'] = request.json["requiredWords"]
        dataForAccuracyChecking['testUUID'] = request.json["testUUID"]
        dataForAccuracyChecking['userAnswer'] = request.json["userAnswer"]
        dataForAccuracyChecking['topic'] = request.json["topic"]

        
        response = ac.checkAccuracyAndSaveInDb(dataForAccuracyChecking);
        return jsonify(response);
         
@app.route('/technical/getReportWithtestUUID', methods = ['POST'])
def generateReportOfAParticularTest():
        response = ac.generateReportOfAParticularTest(request.json["testUUID"]);
        return response;


@app.route('/GD/convertParagraphToSentences', methods = ['POST'])
def generateSentencesFromAParagraph():
        obj = {};
        response = ac.split_into_sentences(request.json["topic"],request.json["paragraph"][0]);
        
        obj['splitSentences']=response;
        return obj;

@app.route('/GD/chechAccuracyOfIndividualSentences', methods = ['POST'])
def chechAccuracyOfIndividualSentences():
        obj = {};
        response = ac.chechAccuracyOfIndividualSentences(request.json["topicSentences"],request.json["userSentences"],request.json["topic"],request.json["testUUID"]);
        
        # obj['splitSentences']=response;
        return jsonify(response);

@app.route('/GD/getGDReportAccordingTestUUID', methods = ['POST'])
def getGDReportAccordingTestUUID():
        response = ac.getGDResultsAccordingToTestUUID(request.json["testUUID"]);
        return response;

@app.route('/technical/getTechnicalQuestions', methods = ['POST'])
def getTechnicalQuestions():
        response = ac.getTechnicalQuestions();
        return response;


@app.route('/technical/storeSingleQuestion', methods = ['POST'])
def storeSingleQuestionAnswerKeyword():
        response = ac.storeSingleQuestionAnswerKeyword(request.json["question"].request.json["answer"],request.json["requiredWords"],request.json["topic"]);
        return response;


if __name__ == "__main__":
    app.run(debug=True)

    