from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Members API Route
@app.route("/members")
def members():
    return {"members": ["1", "2", "3"]}

@app.route("/api/data", methods=["POST"])
def receive_data():
    data = request.json
    app.logger.info(f'Received data: {data}')
    
    response = {"reply": f"Hello, you sent: ${data}"}
    
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)