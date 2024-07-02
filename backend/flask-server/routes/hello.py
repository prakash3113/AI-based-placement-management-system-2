from flask import Flask,request,jsonify
import accuracyCheckingController as ac
from flask_cors import CORS,cross_origin
import time
import uuid


from functools import wraps, partial
def exponential_backoff(func=None, seconds=10, attempts=10):
    if func is None:
        return partial(exponential_backoff, seconds=seconds, attempts=attempts)

    @wraps(func)
    def function_wrapper(*args, **kwargs):
        for s in range(0, seconds*attempts, attempts):
            time.sleep(s)
            try:
                return func(*args, **kwargs)
            except Exception as e:
                print(e)
    return function_wrapper

app = Flask(__name__)
CORS(app,resources={r"/*":{"origins":"*"}})
#CORS("Cross-Origin Resource Sharing")
app.config['CORS HEADERS'] = 'Content-Type'
@app.route("/", endpoint='func1')
@exponential_backoff()
def hello():
	return "Hello World!"


@app.route('/technical/updateSingleTechnicalAccuracy', endpoint='func2', methods = ['POST'])
@exponential_backoff()
def checkAccuracy():
	var = request.json
	dataForAccuracyChecking = {}
	dataForAccuracyChecking['question'] = str(request.json["question"]["question"])
	dataForAccuracyChecking['answer'] = request.json["answer"]["answer"]
	dataForAccuracyChecking['requiredWords'] = request.json["requiredWords"]["requiredWords"]
	dataForAccuracyChecking['testUUID'] = request.json["testUUID"]
	dataForAccuracyChecking['userAnswer'] = request.json["userAnswer"]
	dataForAccuracyChecking['topic'] = request.json["topic"]["topic"]

	
	response = ac.checkAccuracyAndSaveInDb(dataForAccuracyChecking);
	return jsonify(response);
@app.route('/technical/getReportWithtestUUID', methods = ['POST'])
@exponential_backoff()
def generateReportOfAParticularTest():
	response = ac.generateReportOfAParticularTest(request.json["testUUID"]);
	return response;


#Here frontend will send a paragraph which afterwards will be split and converted into sentences and saved in the db
@app.route('/GD/convertParagraphToSentences', methods = ['POST'])
@exponential_backoff()
def generateSentencesFromAParagraph():
	obj = {};
	response = ac.split_into_sentences(request.json["topic"],request.json["paragraph"]);
	obj['splitSentences']=response;
	return obj;


#Here user's spoken sentences will be sent and then compared, processed and then will be stored in the DB 
@app.route('/GD/chechAccuracyOfIndividualSentences', methods = ['POST'])
@exponential_backoff()
def chechAccuracyOfIndividualSentences():
    obj = {};
    response = ac.chechAccuracyOfIndividualSentences(request.json["topicSentences"],request.json["userSentences"],request.json["topic"],request.json["testUUID"]);
    return jsonify(response); 
        # obj['splitSentences']=response;
	
# This will bring you the report of the GD round userSpoken sentences with accuracy and grammatical mistakes
@app.route('/GD/getGDReportAccordingTestUUID', methods = ['POST'])
def getGDReportAccordingTestUUID():
    response = ac.getGDResultsAccordingToTestUUID(request.json["testUUID"]);
    return response;


# This will bring you the stored technical sentences from the Database
@app.route('/technical/getTechnicalQuestions', methods = ['POST'])
@exponential_backoff()
def getTechnicalQuestions():
	response = ac.getTechnicalQuestions();
	return response;

#This will store single sentence in the DB
@app.route('/technical/storeSingleQuestion', methods = ['POST'])
@exponential_backoff()
def storeSingleQuestionAnswerKeyword():
	response = ac.storeSingleQuestionAnswerKeyword(request.json["question"].request.json["answer"],request.json["requiredWords"],request.json["topic"]);
	return response;

# Here frontend will give a paragraph and from that sentences will be generated which will then be stored in the DB under the name of Topic
@app.route('/technical/generateQuestionsFromParagraph', methods = ['POST'])
@exponential_backoff()
def generateQuestionsFromParagraph():
    response = ac.generateQuestionsFromParagraph(request.json["topic"],request.json["paragraph"][0]);
    return response;

#HEre the front end will get the generated sentences froim the database with the reference of topic name
@app.route('/GD/getSentencesAccordingToTopic', methods = ['POST'])
@exponential_backoff()
def getSentencesAccordingToTopic():
    response = ac.getSentencesAccordingToTopic(request.json["topic"]);
    return response

#get sentences according to topic to speak for the bot
@app.route('/GD/getSentencesToSpeak', methods = ['POST'])
@exponential_backoff()
def getSentencesToSpeak():
    response = ac.getSentencesToSpeak(request.json["topic"],request.json["testUUID"]);
    return response


#THis will save the proctored images after processing and verifying them 
@app.route('/proctoring/saveImages', methods = ['POST'])
@exponential_backoff()
def getProctoringImages():
    userCode = request.json["userCode"]
    userInput = request.json["userInput"]
    userOutput = request.json["userOutput"]
    imageArray = request.json["imageArray"]
    testUUID = request.json["testUUID"],
    response = ac.getProctoringImages(userCode,userInput,userOutput,imageArray,testUUID)
    return response

# @app.route('/resume/parsing', methods = ['POST'])
# @exponential_backoff()
# def resumeParsing():
#     response = ac.resumeParsing(request.json["emailId"],);
#     return response;


#This will bring the result of the proctoring according to the s
@app.route('/proctoring/getSavedImagesResult', methods = ['POST'])
@exponential_backoff()
def getSavedImagesResult():
    response = ac.getSavedImagesResult(request.json["testUUID"]);
    return response;

@app.route('/technical/checkImagesForTechnical', methods = ['POST'])
@exponential_backoff()
def checkImagesForTechnical():
    imageArray = request.json["imageArray"]
    testUUID = request.json["testUUID"]
    userEmail = request.json["userEmail"]

    response = ac.checkImagesForTechnical(testUUID,userEmail,imageArray);
    return response;

@app.route('/GD/checkImagesForGD', methods = ['POST'])
@exponential_backoff()
def checkImagesForGD():
    imageArray = request.json["imageArray"]
    testUUID = request.json["testUUID"]
    userEmail = request.json["userEmail"]

    response = ac.checkImagesForGD(testUUID,userEmail,imageArray);
    return response;

@app.route('/GD/checkImagesForApti', methods = ['POST'])
@exponential_backoff()
def checkImagesForApti():
    imageArray = request.json["imageArray"]
    testUUID = request.json["testUUID"]
    userEmail = request.json["userEmail"]

    response = ac.checkImagesForApti(testUUID,userEmail,imageArray);
    return response;


@app.route('/coding/storeTestCases', methods = ['POST'])
@exponential_backoff()
def storeTestCases():
    problemStatement = request.json["problemStatement"]
    testInput = request.json["testInput"]
    expectedOutput = request.json["expectedOutput"]
    instructions = request.json["instructions"]


    response = ac.storeTestCases(problemStatement,testInput,expectedOutput,instructions);
    return response;

@app.route('/coding/getTestCases', methods = ['POST'])
@exponential_backoff()
def getTestCases():

    response = ac.getTestCases();
    return response;

@app.route('/testCreation/createTest', methods = ['POST'])
@exponential_backoff()
def createTest():

    userEmail = request.json["userEmail"]
    testName = request.json["testName"]
    collegeCode = request.json["collegeCode"]
    testCode = request.json["collegeCode"]
    orgName = request.json["orgName"]
    # uuid.uuid4()
    # str(uuid.uuid4())
    # testCode = uuid.uuid4().hex
    response = ac.createTest(userEmail,testName,collegeCode,testCode,orgName);
    return response;

@app.route('/testCreation/getTestWithEmail', methods = ['POST'])
@exponential_backoff()
def getTestWithEmail():

    userEmail = request.json["userEmail"]

    # uuid.uuid4()
    # str(uuid.uuid4())
    # testCode = uuid.uuid4().hex
    response = ac.getTestWithEmail(userEmail);
    return response;

@app.route('/testCreation/getTestWithCodes', methods = ['POST'])
@exponential_backoff()
def getTestWithCodes():

    userEmail = request.json["userEmail"]
    testName = request.json["testName"]
    collegeCode = request.json["collegeCode"]
    testCode = request.json["collegeCode"]
    # uuid.uuid4()
    # str(uuid.uuid4())
    # testCode = uuid.uuid4().hex
    response = ac.getTestWithCodes(userEmail,testName,collegeCode,testCode);
    return response;

##### Aptitude ##################################
@app.route('/aptitude/saveQuestions', methods = ['POST'])
@exponential_backoff()
def aptitudeSaveQuestions():

    testId = request.json["testId"]["testId"]
    orgName = request.json["orgName"]
    question = request.json["question"]["question"]
    options = request.json["options"]["options"]
    correctOption = request.json["correctOption"]["correctOption"]
    marks = request.json["marks"]["marks"]

    response = ac.aptitudeSaveQuestions(testId,orgName,question,options,correctOption,marks);
    return response;


@app.route('/aptitude/getQuestions', methods = ['POST'])
@exponential_backoff()
def aptitudeGetQuestions():

    testId = request.json["testId"]
    orgName = request.json["orgName"]

    response = ac.aptitudeGetQuestions(testId,orgName);
    return response;


@app.route('/aptitude/submitTestFromUserSide', methods = ['POST'])
@exponential_backoff()
def aptitudeSubmitTestFromUserSide():

    testId = request.json["testId"]
    email = request.json["email"]
    totalMarks = request.json["totalMarks"]

    response = ac.aptitudeSubmitTestFromUserSide(testId,email,totalMarks);
    return response;

@app.route('/aptitude/getOrgNames', methods = ['POST'])
@exponential_backoff()
def getOrgNames():


    response = ac.getOrgNames();
    return response;


if __name__ == "__main__":
	app.run(host='0.0.0.0', port=5000)