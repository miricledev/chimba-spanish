from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from user_db import DBHandler, DatabaseConfiguration

app = Flask(__name__)
CORS(app)

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
    
    # Extracting form details
    first_name = str(form_data['firstName'])
    last_name = str(form_data['lastName'])
    email = str(form_data['email'])
    password = str(form_data['password'])
    phone_number = str(form_data['phone'])
    
    # Adding the new user to the database
    try:
        handler.register_new_user(email, first_name, last_name, password, phone_number)
        new_user = handler.verify_user_exists(email)
        response = {"reply": f"{last_name}"}
    except Exception as e:
        response = {"reply": str(e)}
        
    #response = {"reply": f"{new_user}"}
    
    # Send confirmation message
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)