from dotenv import load_dotenv
import os
import random
import robin_stocks.robinhood as r
import multiprocessing
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client


load_dotenv()


url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_ANON_KEY")
supabase = create_client(url, key)

# data = supabase.table("test").select("*").execute()
# print(data)


# data = supabase.table("test").insert({"id":"50"}).execute()



app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    # Using jsonify to return data as a JSON response

    return jsonify(message="Hello, World!, let's go baby")


@app.route("/api/login", methods=["POST"])
def login():
    username = request.json.get("username")
    password = request.json.get("password")

    # Logic to handle login and possibly MFA here
    data = r.login(username, password)
    print(data)
    # return(r.get_day_trades())
    # return jsonify(orders=r.get_all_option_orders()) 

    return jsonify(data)

@app.route("/api/logout", methods=["POST"])
def logout():
    r.logout()
    return jsonify(message="Logged out successfully")

@app.route("/api/mfa", methods=["POST"])
def mfa():
    mfa_token = request.form["mfaToken"]
    # Complete the login process with the MFA token
    return jsonify(message="MFA token received and processed")


@app.route("/api/simple", methods=["GET"])
def simple():
    response = jsonify(message="Simple request boiiiiii")
    # supabase.table("test").insert({"message":response}).execute()
    return response

@app.route("/api/mutate", methods=["POST"])
def test():
    random1 = random.randint(1, 100) 
    random2 = random.randint(1, 10) 

    t = random1 * random2
    supabase.table("test").insert({"id":t}).execute()
    return jsonify(message="Mutate request received")

@app.route("/api/showStocks", methods=["GET"])
def showStocks():
    response = multiprocessing.Process(target=r.export_completed_option_orders("./"), name="func", args=(3,))
    response.start()
    time.sleep(3)
    response.terminate()
    response.join()
