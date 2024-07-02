For the 4th module

1. We will have a topic
2. Then we will have a 100 sentences on that topic 
3. Then 3 bots will choose sentences randomly and speak
4. Then you have to show a message that it is user's turn 
5. Then the user will say something, if the accuracy matches any of the sentences which already exists then remove that sentence from the array too 
6. Other wise if it is not correct of matches the accuracy of the wrong sentences then you a bot will say a I don't really agree with the user 
7. If user says the correct thing then the bot can continue or speak something which is closely related to the user's statement 
8. Train a module to for this
9. Set a timer for conclusion and finally submit the conclusion
10. leaAIfrom flask import Flask,request
app = Flask(__name__)

@app.route('/')
def helloworld():
    return "helo world"

@app.route('/users', methods = ['POST'])
def helloworld2():
    return {
        "question":request.form.get('question'),
        "answer":request.form.get('question'),
        "requiredKeywords":request.form.get('question'),
        "testUUID":request.form.get('question'),
        "userAnswer":request.form.get('question')}

if __name__ == "__main__":
    app.run(debug=True)