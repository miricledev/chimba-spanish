from flask import Flask, request, jsonify, session, redirect
from flask_cors import CORS
from flask_socketio import join_room, leave_room, send, SocketIO
import random
from string import ascii_uppercase
import json
from user_db import DBHandler, DatabaseConfiguration
import bcrypt
from pyisemail import is_email
import re
import ollama
import requests
from dotenv import load_dotenv
import os
from datetime import datetime

# Flask setup
app = Flask(__name__)
CORS(app)

# SocketIO integration
socketio = SocketIO(app,  cors_allowed_origins="*", async_mode="eventlet")

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

# For storing connected users
users = {}


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
    
# REST API Handling ----------------------------------------------------------------------------------------------------------

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
    
@app.route('/users/getall', methods=['GET'])
def get_all_users():
    print("get all users", flush=True)
    try:
        all_users_tpl = handler.get_all_rows()
        
        all_users_tpl = convert_string_tuples(all_users_tpl)
        
        print(all_users_tpl, flush=True)
        # Takes the list of tuples and returns a dict with an index and the tuple converted to list for jsonify
        all_users_dict = {index: list(attributes) for index, attributes in enumerate(all_users_tpl)}
        
        return jsonify(all_users_dict)
        
    except Exception as e:
        print(e, flush=True)
        
        return jsonify({"error": str(e)})
    
    
    
# GET all chats for user x, SET all chats to read
@app.route('/chats/get', methods=['POST'])
def load_all_chats():
    data = request.json
    room_id = data['room_id']
    try:
        chat_log = handler.get_chat_log(room_id)
        if chat_log:
            ...
    except Exception as e:
        ...
    
    
# Socket IO functions ------------------------------------------------------------------------------------------------------------
    
@socketio.on("connect")
def handle_connect():
    print(f"user connected: {request.sid}")
    
@socketio.on("disconnect")
def handle_disconnect():
    print(f"User disconnected: {request.sid}")
    
@socketio.on("join")
def handle_join(data):
    user_id = data['user_id']
    chat_url = data['chat_url']
    room = data['room_id']
    join_room(chat_url)
    users[user_id] = request.sid
    chat_log = handler.get_chat_log(room)
    print(chat_log, flush=True)
    formatted_chat_log = format_message_response(chat_log)
    print(f"\nLoaded chats:\n\n{formatted_chat_log}\n\n")
    socketio.emit('loadChats', formatted_chat_log)
    print(f"User {user_id} joined room {chat_url}", flush=True)
    
@socketio.on("leave")
def handle_leave(data):
    user_id = data["user_id"]
    chat_url = data["chat_url"]
    leave_room(chat_url)
    print(f"User {user_id} left room {chat_url}")
    
@socketio.on("message")
def handle_message(data):
    chat_url = data["chat_url"]
    message = data["message_content"]
    sender = data["sender_id"]
    receiver = data['receiver_id']
    room = data['room_id']
    time_now = datetime.now().strftime("%H:%M")
    
    handler.add_message(room_id=room, sender_id=sender, receiver_id=receiver, message_content=message)
    
    print(f"Message from {sender}: {message} in room {chat_url}")
    send({"sender_id": sender, "message_contents": message, "time": time_now}, room=chat_url)
    
@socketio.on('messagesSeen')
def view_message(data):
    receiver_id = data['user_id']
    handler.read_message(receiver_id)
    

# General purpose funcions -----------------------------------------------------------------------------------------------------
        

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

def format_message_response(message_tuple_array):
    dict_arr = []
    for message_tuple in message_tuple_array:
        dt_obj = message_tuple[5]
        date = dt_obj.strftime("%Y-%m-%d")
        time = dt_obj.strftime("%H:%M")
        dict_msg = {
            'message_id': message_tuple[0], 
            'sender_id': message_tuple[1],
            'receiver_id': message_tuple[2],
            'message_contents': message_tuple[3],
            'room_id': message_tuple[4],
            'date': date,
            'time': time,
            'receiver_has_read': message_tuple[-1]
        }
        dict_arr.append(dict_msg)
    return dict_arr
            

# Ollama client functions ------------------------------------------------------------------------------------------------
    
def get_response(prompt_message, chat_history):
    # send message
    response = client.generate(model=model_type, prompt=f'chat_history: {chat_history} || next_message: {prompt_message}', keep_alive=True)
    
    return response.response

# -----------------------------------------------------------------------------------------------------------------------------

if __name__ == "__main__":
    socketio.run(app, debug=True)
