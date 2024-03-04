from dotenv import load_dotenv
import os
import robin_stocks.robinhood as r
from flask import Flask, request, jsonify
from supabase import create_client

load_dotenv()




url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_ANON_KEY")
supabase = create_client(url, key)

# data = supabase.table("test").select("*").execute()
# print(data)


# data = supabase.table("test").insert({"id":"50"}).execute()



app = Flask(__name__)

@app.route("/")
def home():
    # Using jsonify to return data as a JSON response

    return jsonify(message="Hello, World!, let's go baby")


@app.route("/api/login", methods=["POST"])
def login():
    username = request.form["username"]
    password = request.form["password"]
    # Logic to handle login and possibly MFA here
    r.login(username, password)
    # return(r.get_day_trades())
    return jsonify(orders=r.get_all_option_orders()) 

    return jsonify(message="Login request received")


@app.route("/api/mfa", methods=["POST"])
def mfa():
    mfa_token = request.form["mfaToken"]
    # Complete the login process with the MFA token
    return jsonify(message="MFA token received and processed")


@app.route("/api/simple", methods=["GET"])
def simple():
    response = jsonify(message="Simple request received")
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
