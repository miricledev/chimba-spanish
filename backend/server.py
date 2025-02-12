from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from user_db import DBHandler, DatabaseConfiguration
import bcrypt
from pyisemail import is_email
import re
import ollama
import requests
from dotenv import load_dotenv
import os

# Flask setup
app = Flask(__name__)
CORS(app)

# DeepL key
load_dotenv()
DEEPL_API_KEY = os.getenv("DEEPL_API_KEY")

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
            "user_data": {'id': user_data[0], 
                          'firstName': user_data[1],
                          "lastName": user_data[2],
                          "email": user_data[3]
                          }
            }
    except Exception as e:
        response = {"reply": str(e)}
        
    return jsonify(response)

@app.route("/get/terms", methods=['POST'])
def get_flashcards():
    form_data = request.json
    user_id = form_data['id']
    try:
        flashcards = handler.get_all_flashcards(user_id)
        flashcards = convert_string_tuples(flashcards)
        print(flashcards, flush=True)
        response = {key: value for key, value in flashcards}
        return jsonify(response)
    except Exception as e:
        response = {"reply": str(e)}
        return jsonify(response)
    
    
@app.route('/set/terms', methods=['POST'])
def insert_flashcards():
    form_data = request.json
    term = form_data['term']
    definition = form_data['definition']
    user_id = form_data['id']
    
    try:
        handler.insert_new_flashcards(user_id, term, definition)
        response = {"reply": "success"}
    except Exception as e:
        response = {"reply": str(e)}
        
    return jsonify(response)
    



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

@app.route("/translate", methods=["POST"])
def translate():
    try:
        data = request.json
        text = data['text']
        target_lang = data['targetLang'] 

        if not text:
            return jsonify({"error": "No text provided"}), 400

        response = requests.post(
            "https://api-free.deepl.com/v2/translate",
            data={
                "auth_key": DEEPL_API_KEY,
                "text": text,
                "target_lang": target_lang,
            },
        )

      
        translated_text = response.json()["translations"][0]["text"]
        print(translated_text, flush=True)
        return jsonify({"translated_text": translated_text})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Translation failed"}), 500
        

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
    
def convert_string_tuples(lst):
    
    new_lst = []
    
    for item in lst:
        removed_tuple_layer = item[0]
        
        for char in "()":
            removed_tuple_layer = removed_tuple_layer.replace(char, "")
            
        new_lst.append(tuple(removed_tuple_layer.split(',')))
        
    return new_lst
            
        
    
def get_response(prompt_message, chat_history):
    # send message
    response = client.generate(model=model_type, prompt=f'chat_history: {chat_history} || next_message: {prompt_message}', keep_alive=True)
    
    return response.response

if __name__ == "__main__":
    app.run(debug=True)
