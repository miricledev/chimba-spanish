from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi_socketio import SocketManager
from contextlib import asynccontextmanager
from pydantic import BaseModel
import asyncpg
import bcrypt
import re
import ollama
import requests
import os
from dotenv import load_dotenv
from datetime import datetime

# Import the database handler
from user_db import DBHandler, DatabaseConfiguration

# Load environment variables
load_dotenv()
DEEPL_API_KEY = os.getenv("DEEPL_API_KEY")





# AI Model Setup
client = ollama.Client()
model_type = "pablo"
chat = []

# Store connected users
users = {}

# Database configuration
config = DatabaseConfiguration(
    database="chimba",
    host="localhost",
    user="postgres",
    password="kumar4569",
    port="5432"
)

handler = DBHandler(config)

@asynccontextmanager
async def lifespan_context(app: FastAPI):
    """Lifecycle manager for FastAPI startup and shutdown."""
    print("🔌 Connecting to the database...")
    await handler.connect()  # Connect to DB when FastAPI starts
    yield
    print("🛑 Closing database connection...")
    await handler.close()  # Close DB connection when FastAPI stops

# Initialize FastAPI with lifespan
app = FastAPI(lifespan=lifespan_context)

# Enable CORS for WebSocket connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this for production security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add FastAPI-SocketIO
socket_manager = SocketManager(app=app)

@app.get("/")
async def root():
    return {"message": "FastAPI server is running"}


# -------------------- MODELS --------------------

class RegisterRequest(BaseModel):
    firstName: str
    lastName: str
    email: str
    password: str
    phone: str

class LoginRequest(BaseModel):
    email: str
    password: str

class TranslateRequest(BaseModel):
    text: str
    targetLang: str

class FlashcardRequest(BaseModel):
    term: str
    definition: str
    id: int

class AIMessageRequest(BaseModel):
    message: str

class ChatMessageRequest(BaseModel):
    chat_url: str
    message_content: str
    sender_id: int
    receiver_id: int
    room_id: int

class ViewMessageRequest(BaseModel):
    user_id: int

# -------------------- REST API ROUTES --------------------

@app.post("/api/register")
async def register(request: RegisterRequest):
    password = request.password.encode()
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password, salt)
    
    try:
        await handler.register_new_user(request.email, request.firstName, request.lastName, hashed, request.phone)
        new_user = await handler.verify_user_exists(request.email)
        return {"reply": f"You are now registered, {request.firstName}", "new_user_data": new_user}
    except Exception as e:
        return {"reply": str(e)}

@app.post("/api/login")
async def login(request: LoginRequest):
    try:
        await handler.verify_user_login(request.email, request.password)
        user_data = await handler.verify_user_exists(request.email)
        return {
            "reply": "logged in",
            "user_data": {
                "id": user_data[0],
                "firstName": user_data[1],
                "lastName": user_data[2],
                "email": user_data[3],
            },
        }
    except Exception as e:
        return {"reply": str(e)}

@app.post("/get/terms")
async def get_flashcards(request: ViewMessageRequest):
    try:
        flashcards = await handler.get_all_flashcards(request.user_id)
        return {key: value for key, value in convert_string_tuples(flashcards)}
    except Exception as e:
        return {"reply": str(e)}

@app.post("/set/terms")
async def insert_flashcards(request: FlashcardRequest):
    try:
        await handler.insert_new_flashcards(request.id, request.term, request.definition)
        return {"reply": "success"}
    except Exception as e:
        return {"reply": str(e)}

@app.post("/api/ollama")
async def communicate_ai(request: AIMessageRequest):
    chat.append(f'User: {request.message}')
    ai_reply = get_response(request.message, chat)
    chat.append(f'Pablo: {ai_reply}')
    return {"reply": ai_reply}

@app.post("/api/resetai")
async def reset_ai():
    global chat
    chat = []
    return {"reply": ""}

@app.post("/translate")
async def translate(request: TranslateRequest):
    try:
        response = requests.post(
            "https://api-free.deepl.com/v2/translate",
            data={"auth_key": DEEPL_API_KEY, "text": request.text, "target_lang": request.targetLang},
        )
        translated_text = response.json()["translations"][0]["text"]
        return {"translated_text": translated_text}
    except Exception as e:
        return {"error": "Translation failed"}

@app.get("/users/getall")
async def get_all_users():
    try:
        all_users = await handler.get_all_rows()
        return {index: list(attributes) for index, attributes in enumerate(convert_string_tuples(all_users))}
    except Exception as e:
        return {"error": str(e)}

# -------------------- SOCKET.IO EVENTS --------------------

@socket_manager.on("connect")
async def handle_connect(sid, environ):
    print(f"user connected: {sid}")

@socket_manager.on("disconnect")
async def handle_disconnect(sid):
    print(f"User disconnected: {sid}")

@socket_manager.on("join")
async def handle_join(sid, data):
    user_id = data["user_id"]
    chat_url = data["chat_url"]
    room = data["room_id"]
    await socket_manager.enter_room(sid, chat_url)
    users[user_id] = sid
    chat_log = await handler.get_chat_log(room)
    formatted_chat_log = format_message_response(chat_log)
    await socket_manager.emit("loadChats", formatted_chat_log, room=chat_url)
    print(f"User {user_id} joined room {chat_url}")

@socket_manager.on("leave")
async def handle_leave(sid, data):
    user_id = data["user_id"]
    chat_url = data["chat_url"]
    await socket_manager.leave_room(sid, chat_url)
    print(f"User {user_id} left room {chat_url}")

@socket_manager.on("message")
async def handle_message(sid, data: ChatMessageRequest):
    chat_url = data.chat_url
    time_now = datetime.now().strftime("%H:%M")
    
    await handler.add_message(room_id=data.room_id, sender_id=data.sender_id, receiver_id=data.receiver_id, message_content=data.message_content)

    await socket_manager.emit(
        "message",
        {"sender_id": data.sender_id, "message_contents": data.message_content, "time": time_now},
        room=chat_url
    )

@socket_manager.on("messagesSeen")
async def view_message(sid, data: ViewMessageRequest):
    await handler.read_message(data.user_id)

# -------------------- UTILITIES --------------------

def convert_string_tuples(lst):
    return [tuple(item[0].replace("(", "").replace(")", "").split(",")) for item in lst]

def format_message_response(message_tuple_array):
    return [
        {
            "message_id": msg[0],
            "sender_id": msg[1],
            "receiver_id": msg[2],
            "message_contents": msg[3],
            "room_id": msg[4],
            "date": msg[5].strftime("%Y-%m-%d"),
            "time": msg[5].strftime("%H:%M"),
            "receiver_has_read": msg[-1],
        }
        for msg in message_tuple_array
    ]

def get_response(prompt_message, chat_history):
    response = client.generate(model=model_type, prompt=f"chat_history: {chat_history} || next_message: {prompt_message}", keep_alive=True)
    return response.response

# -------------------- RUN SERVER --------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
