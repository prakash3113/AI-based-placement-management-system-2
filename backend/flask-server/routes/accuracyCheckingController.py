from unittest import result
from datasets import concatenate_datasets
from pyparsing import nums
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
from flask import jsonify
import re
from happytransformer import HappyTextToText, TTSettings
from torch import nuclear_norm
import nltk
import numpy as np
import argparse
import cv2
# from pyresparser import ResumeParser
from docx import Document
import base64

from cv2 import line

import PIL.Image as Image
import io
import base64

#####################################################

##################################################################################


client = MongoClient(
    "mongodb+srv://mpp:mpp@cluster0.ybb0e.mongodb.net/mppproject?retryWrites=true&w=majority")

db = client.get_database("mppproject")
from objective import ObjectiveTest
from subjective import SubjectiveTest

alphabets = "([A-Za-z])"
prefixes = "(Mr|St|Mrs|Ms|Dr)[.]"
suffixes = "(Inc|Ltd|Jr|Sr|Co)"
starters = "(Mr|Mrs|Ms|Dr|He\s|She\s|It\s|They\s|Their\s|Our\s|We\s|But\s|However\s|That\s|This\s|Wherever)"
acronyms = "([A-Z][.][A-Z][.](?:[A-Z][.])?)"
websites = "[.](com|net|org|io|gov)"


client = MongoClient(
    "mongodb+srv://mpp:mpp@cluster0.ybb0e.mongodb.net/mppproject?retryWrites=true&w=majority")

db = client.get_database("mppproject")


def checkAccuracyAndSaveInDb(obj):
    model_name = 'bert-base-nli-mean-tokens'

    model = SentenceTransformer(model_name)

    var = cosine_similarity(
        [model.encode(
            obj['answer'])],
        [model.encode(obj['userAnswer'])]
    )
    var = float(var)

    records = db.technicalquestionsAccuracy
    # print(records.count_documents({}))
    newTestRecord = {
        "question": obj['question'],
        "answer": obj['answer'],
        "requiredWords": obj['requiredWords'],
        "topic": obj['topic'],
        "testUUID": obj['testUUID'],
        "userAnswer": obj['userAnswer'],
        "accuracy": var
    }

    return jsonify(records.insert_one(newTestRecord))
    # return records.count_documents({})


def generateReportOfAParticularTest(testId):
    records = db.technicalquestionsAccuracy
    # list = []
    cursor1 = records.find({'testUUID': str(testId)})

    data = []
    for doc in cursor1:
        doc['_id'] = str(doc['_id'])  # This does the trick!
        data.append(doc)
    return jsonify(data)


def getSentencesAccordingToTopic(topic):

    records = db.GDsplitQuestionsAccordingToTopic
    # list = []
    cursor1 = records.find({'topic': str(topic)})

    data = []
    for doc in cursor1:
        doc['_id'] = str(doc['_id'])  # This does the trick!
        data.append(doc)
    return jsonify(list(data))


def split_into_sentences(topic, text):
    text = " " + text + "  "
    text = text.replace("\n", " ")
    text = re.sub(prefixes, "\\1<prd>", text)
    text = re.sub(websites, "<prd>\\1", text)
    if "Ph.D" in text:
        text = text.replace("Ph.D.", "Ph<prd>D<prd>")
    text = re.sub("\s" + alphabets + "[.] ", " \\1<prd> ", text)
    text = re.sub(acronyms+" "+starters, "\\1<stop> \\2", text)
    text = re.sub(alphabets + "[.]" + alphabets + "[.]" +
                  alphabets + "[.]", "\\1<prd>\\2<prd>\\3<prd>", text)
    text = re.sub(alphabets + "[.]" + alphabets +
                  "[.]", "\\1<prd>\\2<prd>", text)
    text = re.sub(" "+suffixes+"[.] "+starters, " \\1<stop> \\2", text)
    text = re.sub(" "+suffixes+"[.]", " \\1<prd>", text)
    text = re.sub(" " + alphabets + "[.]", " \\1<prd>", text)
    if "”" in text:
        text = text.replace(".”", "”.")
    if "\"" in text:
        text = text.replace(".\"", "\".")
    if "!" in text:
        text = text.replace("!\"", "\"!")
    if "?" in text:
        text = text.replace("?\"", "\"?")
    text = text.replace(".", ".<stop>")
    text = text.replace("?", "?<stop>")
    text = text.replace("!", "!<stop>")
    text = text.replace("<prd>", ".")
    sentences = text.split("<stop>")
    sentences = sentences[:-1]
    sentences = [s.strip() for s in sentences]
    splitSentences = {
        "topic": topic,
        "sentences": list(sentences)
    }
    records = db.GDsplitQuestionsAccordingToTopic
    records.insert_one(splitSentences)
    return list(sentences)


def chechAccuracyOfIndividualSentences(topicSentences, userSentences, topic, testUUID):
    # Grammer checking library import
    happy_tt = HappyTextToText("T5", "vennify/t5-base-grammar-correction")

    args = TTSettings(num_beams=5, min_length=1)

    model_name = 'bert-base-nli-mean-tokens'

    model = SentenceTransformer(model_name)

    sentence_vecs_topic = model.encode(list(topicSentences))
    sentence_vecs_user = model.encode(list(userSentences))

    accuracyTillNow = []
    finalAccuracies = []
    for i in range(len(list(userSentences))):
        accuracyTillNow.clear()
        for j in range(len(list(topicSentences))):
            userSentence1 = sentence_vecs_user[i]
            topicSentence1 = sentence_vecs_topic[j]
            accuracyVal = float(cosine_similarity(
                [userSentence1],
                [topicSentence1]
            ))

            accuracyTillNow.append(accuracyVal)

        largestNumber = accuracyTillNow[0]
        for k in range(len(list(accuracyTillNow))):
            if accuracyTillNow[k] > largestNumber:
                largestNumber = accuracyTillNow[k]
        finalAccuracies.append(largestNumber)
    print(finalAccuracies)

    finalConstructedObjectForGDTest = {}
    GDResultArray = []
    for i in range(len(list(userSentences))):
        if(finalAccuracies[i] > 0.8):
            resultConstruction = {}
            resultConstruction['point'] = userSentences[i]
            resultConstruction['quality'] = "Excellent point"
            resultConstruction['accuracy'] = finalAccuracies[i]
            resultConstruction['grammerReplacement'] = (
                happy_tt.generate_text("grammar: "+userSentences[i], args=args)).text

            GDResultArray.append(resultConstruction)
        elif(finalAccuracies[i] > 0.6):
            resultConstruction = {}
            resultConstruction['point'] = userSentences[i]
            resultConstruction['quality'] = "Good point"
            resultConstruction['accuracy'] = finalAccuracies[i]
            resultConstruction['grammerReplacement'] = (
                happy_tt.generate_text("grammar: "+userSentences[i], args=args)).text

            GDResultArray.append(resultConstruction)

        elif(finalAccuracies[i] > 0.4):
            resultConstruction = {}
            resultConstruction['point'] = userSentences[i]
            resultConstruction['quality'] = "Inaccuracy"
            resultConstruction['accuracy'] = finalAccuracies[i]
            resultConstruction['grammerReplacement'] = (
                happy_tt.generate_text("grammar: "+userSentences[i], args=args)).text

            GDResultArray.append(resultConstruction)

        else:
            resultConstruction = {}
            resultConstruction['point'] = userSentences[i]
            resultConstruction['quality'] = "Bad point"
            resultConstruction['accuracy'] = finalAccuracies[i]
            resultConstruction['grammerReplacement'] = (
                happy_tt.generate_text("grammar: "+userSentences[i], args=args)).text

            GDResultArray.append(resultConstruction)

    finalConstructedObjectForGDTest['topic'] = topic
    finalConstructedObjectForGDTest['testUUID'] = testUUID
    finalConstructedObjectForGDTest['result'] = GDResultArray

    records = db.GDTestResult
    records.insert_one(finalConstructedObjectForGDTest)
    tempArray = []
    tempArray.append(finalConstructedObjectForGDTest)
    return "Data stored successfully"


def getGDResultsAccordingToTestUUID(testUUID):
    records = db.GDTestResult
    # list = []
    cursor1 = records.find({'testUUID': str(testUUID)})

    data = []
    for doc in cursor1:
        doc['_id'] = str(doc['_id'])
        data.append(doc)
    return jsonify(data)


def getTechnicalQuestions():
    records = db.technicalquestions

    cursor1 = records.find()

    data = []
    for doc in cursor1:
        doc['_id'] = str(doc['_id'])
        data.append(doc)
    return jsonify(data)


def storeSingleQuestionAnswerKeyword(question, answer, requiredWords, topic):

    records = db.technicalquestions
    # print(records.count_documents({}))
    newTestRecord = {
        "question": question,
        "answer": answer,
        "requiredWords": requiredWords,
        "topic": topic,
    }

    records.insert_one(newTestRecord)

# test generator for generating subjective or pbjective questions and answers


def testGenerator(inputText, testType, noOfQues):
    if(noOfQues != 0):

        if testType == "objective":
            objective_generator = ObjectiveTest(inputText, noOfQues)
            question_list, answer_list = objective_generator.generate_test()
            # testgenerate = zip(question_list, answer_list)
            # return render_template('generatedtestdata.html', cresults = testgenerate)
            print(question_list)
            print(answer_list)
        elif testType == "subjective":
            subjective_generator = SubjectiveTest(inputText, noOfQues)
            question_list, answer_list = subjective_generator.generate_test()
            # testgenerate = zip(question_list, answer_list)
            # return render_template('generatedtestdata.html', cresults = testgenerate)
            print(question_list)
            print(answer_list)
            return jsonify(list(question_list), list(answer_list))
        else:
            return {[], []}


# nltk.download('punkt')
def generateQuestionsFromParagraph(topic, paragraph):
    # aplit paragraph in sentences
    questionList = []
    answerList = []
    paragraph = ''.join(paragraph.splitlines())
    splitSentences = nltk.tokenize.sent_tokenize(paragraph)

    # Temporary array to work with the sentences
    tempSplitSentences = splitSentences

    concatenatedString = ''
    while(len(tempSplitSentences) != 0):
        # problem with i because the data is being popped every iteration
        concatenatedString = concatenatedString+tempSplitSentences[0]
        tempSplitSentences.pop(0)
        if(len(str(concatenatedString).split()) > 130):
            print(concatenatedString)
            inputText = concatenatedString
            testType = "subjective"
            lenOfPara = len(str(concatenatedString).split())
            noOfQues = int(lenOfPara/65)
            questionAnswersObject = testGenerator(
                inputText, testType, noOfQues)
            for i in range(len(list(questionAnswersObject.json)[0])):
                questionList.append(questionAnswersObject.json[0][i])
                answerList.append(questionAnswersObject.json[1][i])
            concatenatedString = ''
        elif(len(tempSplitSentences) == 0):
            print(concatenatedString)
            inputText = concatenatedString
            testType = "subjective"
            noOfQues = int(len(str(concatenatedString).split())/65)
            if(noOfQues != 0):
                questionAnswersObject = testGenerator(
                    inputText, testType, noOfQues)
                for i in range(len(questionAnswersObject.json[0])):
                    questionList.append(questionAnswersObject.json[0][i])
                    answerList.append(questionAnswersObject.json[1][i])
            concatenatedString = ''
        # store the got questions

    records = db.technicalquestions
    # print(records.count_documents({}))
    for i in range(len(questionList)):

        newTestRecord = {
            "question": questionList[i],
            "answer": answerList[i],
            "requiredWords": [],
            "topic": topic,
        }

        records.insert_one(newTestRecord)
    return "Data stored successfully"
    # i+=1


def getSentencesToSpeak(topic, testUUID):

    tempDB = db.tempColForSentenceManip
    cursorOfTempDB = tempDB.find({'testUUID': str(testUUID)})
    returnedSentences = list(cursorOfTempDB)

    if(len(returnedSentences) == 0):

        records = db.GDsplitQuestionsAccordingToTopic
        # list = []
        cursor1 = records.find({'topic': str(topic)})

        data = []
        for doc in cursor1:
            doc['_id'] = str(doc['_id'])  # This does the trick!
            data.append(doc)
        # if(list(data)[0].sentences):
        sentenceToSendArray = []
        for i in range(3):
            if(list(data)[0]['sentences'][i]):
                sentenceToSendArray.append(data[0]['sentences'][i])
        for j in range(3):
            if(list(data)[0]['sentences']):
                list(data)[0]['sentences'].pop(0)

        obj = {}
        obj['testUUID'] = testUUID
        obj['data'] = list(data)[0]['sentences']
        tempDB.delete_one({"testUUID": testUUID})

        if(len(obj['data'])):
            tempDB.insert_one(obj)
        return jsonify(sentenceToSendArray)
    else:

        data = []
        sentenceToSendArray = []
        for i in range(3):
            if(len(returnedSentences[0]['data'])>(i)):
                sentenceToSendArray.append(returnedSentences[0]['data'][i])
        for i in range(3):
            if(list(returnedSentences)[0]['data']):
                returnedSentences[0]['data'].pop(0)
        obj = {}
        obj['testUUID'] = testUUID
        obj['data'] = list(returnedSentences)[0]['data']
        tempDB.delete_one({"testUUID": testUUID})
        if(len(obj['data'])):
            tempDB.insert_one(obj)# continue from here

        return jsonify(sentenceToSendArray)






################################### This is object detection ###################################


def objectDetection(prototxt,model,image,confidence):
    args = {}
    args["prototxt"] = prototxt
    args["model"] = model
    args["image"] = image
    args["confidence"] = confidence


    CLASSES = ["background", "aeroplane", "bicycle", "bird", "boat",
	"bottle", "bus", "car", "cat", "chair", "cow", "diningtable",
	"dog", "horse", "motorbike", "person", "pottedplant", "sheep",
	"sofa", "train", "tvmonitor"]
    COLORS = np.random.uniform(0, 255, size=(len(CLASSES), 3))

	# load our serialized model from disk
    print("[INFO] loading model...")
    net = cv2.dnn.readNetFromCaffe(args["prototxt"], args["model"])


    image = cv2.imread(args["image"])
    (h, w) = image.shape[:2]
    blob = cv2.dnn.blobFromImage(cv2.resize(image, (300, 300)), 0.007843, (300, 300), 127.5)

    print("[INFO] computing object detections...")
    net.setInput(blob)
    detections = net.forward()
    objectsObjects = []

    for i in np.arange(0, detections.shape[2]):
        confidence = detections[0, 0, i, 2]

        if confidence > args["confidence"]:
            idx = int(detections[0, 0, i, 1])
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (startX, startY, endX, endY) = box.astype("int")

            label = "{}: {:.2f}%".format(CLASSES[idx], confidence * 100)
            print("ch[INFO] {}".format(label))
            # print("printysss"+str(label))
            objectsObjects.append(label)

            # objectsObjects.append(format(label))
            # cv2.rectangle(image, (startX, startY), (endX, endY),
            #     COLORS[idx], 2)
            # y = startY - 15 if startY - 15 > 15 else startY + 15
            # cv2.putText(image, label, (startX, y),
            #     cv2.FONT_HERSHEY_SIMPLEX, 0.5, COLORS[idx], 2)

    # cv2.imshow("Output", image)
    # cv2.waitKey(0)

    return objectsObjects
    # return jsonify(list(data))

# tArray = objectDetection('MobileNetSSD_deploy.prototxt.txt','MobileNetSSD_deploy.caffemodel','images/something.png',0.2)
# print(tArray)


def getProctoringImages(userCode,userInput,userOutput,imageLinksArray,testUUID):
    ################# save the image in the db ##############
    flags = {}
    multiplePersons = False
    mobileSpotted = False
    screenExited = False

    imageNamesArray = []
    resultsArray = []
    for i in range(len(imageLinksArray)):
        numString = str(i)
        imageNamesArray.append("images/image"+numString+".png")

        splitLink = str(imageLinksArray[i]).split('data:image/png;base64,')

        linkStr = b''+str(splitLink[1]).encode("ascii")


        b = base64.b64decode(linkStr)
        # print(b)
        img = Image.open(io.BytesIO(b))
        # img.show()

        img.save("images/image"+str(i)+".png")

        result = objectDetection('MobileNetSSD_deploy.prototxt.txt','MobileNetSSD_deploy.caffemodel',imageNamesArray[i],0.2)
        resultsArray.append(result)
    print(resultsArray)
    return jsonify(str(resultsArray))
    ################# save the image in the db ####################
    ## write a function to proess images from frontend

def getSavedImagesResult(testUUID):
    records = db.proctoredResult

    # list = []
    cursor1 = records.find({'testUUID': str(testUUID)})

    data = []
    for doc in cursor1:
        doc['_id'] = str(doc['_id'])  # This does the trick!
        data.append(doc)
    return jsonify(data)

def checkImagesForTechnical(testUUID,userEmail,imageLinksArray):
        ################# save the image in the db ##############
    flags = {}
    multiplePersons = False
    mobileSpotted = False
    screenExited = False

    imageNamesArray = []
    resultsArray = []
    for i in range(len(imageLinksArray)):
        numString = str(i)
        imageNamesArray.append("images/image"+numString+".png")

        splitLink = str(imageLinksArray[i]).split('data:image/png;base64,')

        linkStr = b''+str(splitLink[1]).encode("ascii")


        b = base64.b64decode(linkStr)
        # print(b)
        img = Image.open(io.BytesIO(b))
        # img.show()

        img.save("images/image"+str(i)+".png")

        result = objectDetection('MobileNetSSD_deploy.prototxt.txt','MobileNetSSD_deploy.caffemodel',imageNamesArray[i],0.2)
        resultsArray.append(result)
    print(resultsArray)
    person = 0
    for i in range(len(resultsArray)):
        person = 0
        for j in range(len(resultsArray[i])):
            if(str(resultsArray[i][j]).find("person")!=-1):
                person +=1
                if(person>1):
                    flags['multiplePersons'] = True
            elif(str(resultsArray[i][j]).find("tvmonitor")!=-1):
                    flags['tvmonitor'] = True

    
    records = db.proctoredResult
    newProctoredRecord = {
            "userEmail":userEmail,
            "testUUID":testUUID,
            "flags":flags
        }
    records.insert_one(newProctoredRecord)
    return "records inserted"
    # return jsonify(newProctoredRecord)
    ################# save the image in the db ####################
    ## write a function to proess images from frontend




def checkImagesForGD(testUUID,userEmail,imageLinksArray):
        ################# save the image in the db ##############
    flags = {}
    multiplePersons = False
    mobileSpotted = False
    screenExited = False

    imageNamesArray = []
    resultsArray = []
    for i in range(len(imageLinksArray)):
        numString = str(i)
        imageNamesArray.append("images/image"+numString+".png")

        splitLink = str(imageLinksArray[i]).split('data:image/png;base64,')

        linkStr = b''+str(splitLink[1]).encode("ascii")


        b = base64.b64decode(linkStr)
        # print(b)
        img = Image.open(io.BytesIO(b))
        # img.show()

        img.save("images/image"+str(i)+".png")

        result = objectDetection('MobileNetSSD_deploy.prototxt.txt','MobileNetSSD_deploy.caffemodel',imageNamesArray[i],0.2)
        resultsArray.append(result)
    print(resultsArray)
    person = 0
    for i in range(len(resultsArray)):
        person = 0
        for j in range(len(resultsArray[i])):
            if(str(resultsArray[i][j]).find("person")!=-1):
                person +=1
                if(person>1):
                    flags['multiplePersons'] = True
            elif(str(resultsArray[i][j]).find("tvmonitor")!=-1):
                    flags['tvmonitor'] = True

    
    records = db.proctoredResult
    newProctoredRecord = {
            "userEmail":userEmail,
            "testUUID":testUUID,
            "flags":flags
        }
    records.insert_one(newProctoredRecord)
    return "records inserted"
    # return jsonify(newProctoredRecord)
    ################# save the image in the db ####################
    ## write a function to proess images from frontend





def checkImagesForApti(testUUID,userEmail,imageLinksArray):
        ################# save the image in the db ##############
    flags = {}
    multiplePersons = False
    mobileSpotted = False
    screenExited = False

    imageNamesArray = []
    resultsArray = []
    for i in range(len(imageLinksArray)):
        numString = str(i)
        imageNamesArray.append("images/image"+numString+".png")

        splitLink = str(imageLinksArray[i]).split('data:image/png;base64,')

        linkStr = b''+str(splitLink[1]).encode("ascii")


        b = base64.b64decode(linkStr)
        # print(b)
        img = Image.open(io.BytesIO(b))
        # img.show()

        img.save("images/image"+str(i)+".png")

        result = objectDetection('MobileNetSSD_deploy.prototxt.txt','MobileNetSSD_deploy.caffemodel',imageNamesArray[i],0.2)
        resultsArray.append(result)
    print(resultsArray)
    person = 0
    for i in range(len(resultsArray)):
        person = 0
        for j in range(len(resultsArray[i])):
            if(str(resultsArray[i][j]).find("person")!=-1):
                person +=1
                if(person>1):
                    flags['multiplePersons'] = True
            elif(str(resultsArray[i][j]).find("tvmonitor")!=-1):
                    flags['tvmonitor'] = True

    
    records = db.proctoredResult
    newProctoredRecord = {
            "userEmail":userEmail,
            "testUUID":testUUID,
            "flags":flags
        }
    records.insert_one(newProctoredRecord)
    return "records inserted"
    # return jsonify(newProctoredRecord)
    ################# save the image in the db ####################
    ## write a function to proess images from frontend



def storeTestCases(problemStatement,testInput,expectedOutput,instructions):

    records = db.codingTextCasesWithQuestions
    # print(records.count_documents({}))
    newTestRecord = {
        "problemStatement":problemStatement,
        "testInput": testInput,
        "expectedOutput": expectedOutput,
        "instructions": instructions,
    }

    records.insert_one(newTestRecord)
    return "Test Cases Stored"

def getTestCases():

    records = db.codingTextCasesWithQuestions
    # print(records.count_documents({}))
    cursor1 = records.find()

    data = []
    for doc in cursor1:
        doc['_id'] = str(doc['_id'])  # This does the trick!
        data.append(doc)
    return jsonify(data)


def createTest(userEmail,testName,collegeCode,testCode,orgName):
    records = db.tests
    # print(records.count_documents({}))
    newTestRecord = {
        "userEmail":userEmail,
        "testName": testName,
        "collegeCode": collegeCode,
        "testCode": testCode,
        "orgName": orgName
    }

    records.insert_one(newTestRecord)
    return "Test created"

def getTestWithEmail(userEmail):
    records = db.tests
    # list = []
    cursor1 = records.find({'userEmail': userEmail})

    data = []
    for doc in cursor1:
        doc['_id'] = str(doc['_id'])  # This does the trick!
        data.append(doc)
    return jsonify(data)

def getTestWithCodes(collegeCode,testCode):
    records = db.tests
    # list = []
    cursor1 = records.find({'collegeCode': collegeCode,'testCode':testCode})

    data = []
    for doc in cursor1:
        doc['_id'] = str(doc['_id'])  # This does the trick!
        data.append(doc)
    return jsonify(data)


def aptitudeSaveQuestions(testId,orgName,question,options,correctOption,marks):
    records = db.aptitudeQuestions
    # print(records.count_documents({}))
    newTestRecord = {
        "testId":testId,
        "orgName": orgName,
        "question": question,
        "question": question,
        "options":options,
        "correctOption":correctOption,
        "marks":marks
    }



    records.insert_one(newTestRecord)
    return "Aptitude questions saved"


def aptitudeGetQuestions(testId,orgName):
    records = db.aptitudeQuestions
    # list = []
    cursor1 = records.find({'testId':testId})

    data = []
    for doc in cursor1:
        doc['_id'] = str(doc['_id'])  # This does the trick!
        data.append(doc)
    return jsonify(data)

def aptitudeSubmitTestFromUserSide(testId,email,totalMarks):
    records = db.aptitudeResult
    # print(records.count_documents({}))
    newTestRecord = {
        "testId":testId,
        "email": email,
        "totalMarks": totalMarks
    }

    records.insert_one(newTestRecord)
    return "Aptitude Result saved saved"

def getAptitudeResultWithEmail(email):
    records = db.aptitudeResult
    # list = []
    cursor1 = records.find({'email':email})

    data = []
    for doc in cursor1:
        doc['_id'] = str(doc['_id'])  # This does the trick!
        data.append(doc)
    return jsonify(data)

def getOrgNames():
    records = db.tests
    # list = []
    cursor1 = records.find({})
    data = []
    for doc in cursor1:
        doc['_id'] = str(doc['_id'])  # This does the trick!
        data.append(doc)
    obj = {}
    for i in range(len(data)):
        if hasattr(obj,data[i]['orgName']):
            print("has")
        else:
            obj[data[i]['orgName']] = True
    return obj



