from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from user_db import DBHandler, DatabaseConfiguration
import bcrypt
from pyisemail import is_email
import re
import ollama

# Flask setup
app = Flask(__name__)
CORS(app)

# Set up Ollama LLM
# initialise client
client = ollama.Client()
# model
model_type = 'pablo'
# chat history
chat = []

# Setup db
config = DatabaseConfiguration(
    database="chimba",
    host="localhost",
    user="postgres",
    password="kumar4569",
    port="5432"
)

handler = DBHandler(config)

try:
    handler.connect()
except Exception as e:
    app.logger.info(e)
    exit()

@app.route("/api/register", methods=["POST"])
def register():
    form_data = request.json
    
    # Extracting form details | Hash password
    first_name = str(form_data['firstName'])
    last_name = str(form_data['lastName'])
    email = str(form_data['email'])
    password = str(form_data['password']).encode()
    phone_number = str(form_data['phone'])
    
    # Add salt to password
    salt = bcrypt.gensalt()
    # Hash
    hashed = bcrypt.hashpw(password, salt)
    
    # Adding the new user to the database
    try:
        handler.register_new_user(email, first_name, last_name, hashed, phone_number)
        new_user = handler.verify_user_exists(email)
        response = {
            "reply": f"You are now registered, {first_name}",
            "new user data": f"{new_user}"
                    }
    except Exception as e:
        response = {"reply": str(e)}
        
    #response = {"reply": f"{new_user}"}
    
    # Send confirmation message
    return jsonify(response)

@app.route("/api/login", methods=["POST"])
def login():
    form_data = request.json
    
    # Extract form details
    email = str(form_data['email'])
    password = str(form_data['password'])
    
    # default
    user_data = None
    
    try:
        handler.verify_user_login(email, password)
        
        # get the new users data to send in the response
        user_data = handler.verify_user_exists(email)
        response = {
            "reply": 'logged in',
            "user_data": 'man'
            }
    except Exception as e:
        response = {"reply": str(e)}
        
    return jsonify(response)

@app.route("/get/terms", methods=['GET'])
def get_flashcards():
    flashcards = {'hello': 'hola',
                  'goodbye': 'adios',
                  'incredible': 'increíble'
                  }
    return jsonify(flashcards)



@app.route("/api/ollama", methods=['POST'])
def communicate_ai():
    user_message = request.json
    chat.append(f'User: {user_message['message']}')
    
    ai_reply = get_response(user_message['message'], chat)
    chat.append(f'Pablo: {ai_reply}')
    
    ai_reply_pkt = {"reply": ai_reply}
    
    return jsonify(ai_reply_pkt)



@app.route('/api/resetai', methods=['POST'])
def reset_ai():
    global chat
    chat = []
    
    return jsonify({'reply': ''})
        



def email_checker(email):
    detailed_result = is_email(email, diagnose=True)
    return detailed_result
    
def password_checker(password):
    if len(password) < 8:
        return ("Make sure your password is at least 8 letters")
    elif re.search('[0-9]',password) is None:
        return ("Make sure your password has a number in it")
    elif re.search('[A-Z]',password) is None: 
        return ("Make sure your password has a capital letter in it")
    else:
        return 'valid'
    
def get_response(prompt_message, chat_history):
    # send message
    response = client.generate(model=model_type, prompt=f'chat_history: {chat_history} || next_message: {prompt_message}', keep_alive=True)
    
    return response.response

if __name__ == "__main__":
    app.run(debug=True)
