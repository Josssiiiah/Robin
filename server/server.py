from dotenv import load_dotenv
import os
import random
import robin_stocks.robinhood as r
from pathlib import Path
from csv import writer
from datetime import date, datetime, timedelta

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
    # username = request.json.get("username")
    # password = request.json.get("password")
    username = "josiahgriggs8@gmail.com"
    password = "Coder1633!"

    # Logic to handle login and possibly MFA here
    data = r.login(username, password)

    # if data = "failed due to mfa":
    #     return jsonify(message="MFA required")

    print(data)
    # return(r.get_day_trades())
    # return jsonify(orders=r.get_all_optio n_orders()) 

    return jsonify(data)

@app.route("/api/logout", methods=["POST"])
def logout():
    r.logout()
    return jsonify(message="Logged out successfully")

@app.route("/api/showStocks", methods=["POST"])
def showStocks():
    user_id = request.json["userId"]

    # handle login
    username = "josiahgriggs8@gmail.com"
    password = "Coder1633!"
    r.login(username, password)

    # get orders
    def get_option_orders(info=None):
        url = "https://api.robinhood.com/options/orders/"
        data = r.request_get(url, 'results')
        return(r.filter_data(data, info))

    def get_orders():
        all_orders = get_option_orders()
        ret = []
        for order in all_orders:
            if order['state'] == 'filled':
                for leg in order['legs']:
                        i = ({
                            'symbol': order['chain_symbol'],
                            'side': leg['side'],
                            'order_created_at': order['created_at'],
                            'price': order['price'],
                            'processed_quantity': order['processed_quantity']
                        })
                        ret.append(i)
        return ret
                        
    response = get_orders()
    final = []
    # filter by symbol
    # for item in response:
    #     if item['chain_symbol'] == "QQQ":
    #         final.append(item)

    # filter by last 5 days
    now = datetime.utcnow()

    for item in response:
        order_date = datetime.strptime(item['order_created_at'], "%Y-%m-%dT%H:%M:%S.%fZ")
        if (now - order_date) <= timedelta(days=12):
            final.append(item)


    # perform calculations on the server-side
    grouped_trades = {}
    for item in final:
        date = item['order_created_at'].split("T")[0]  # Extract date part
        if date not in grouped_trades:
            grouped_trades[date] = {'trades': [], 'totalBuy': 0, 'totalSell': 0}
        amount = float(item['price']) * float(item['processed_quantity'])
        grouped_trades[date]['trades'].append(item)
        if item['side'] == 'buy':
            grouped_trades[date]['totalBuy'] += amount
        else:
            grouped_trades[date]['totalSell'] += amount

    total_pnl = sum(group['totalSell'] - group['totalBuy'] for group in grouped_trades.values()) * 100
    positive_pnl_days = sum(1 for group in grouped_trades.values() if group['totalSell'] - group['totalBuy'] > 0)
    average_win_loss = total_pnl / len(grouped_trades)
    trade_win_percentage = round((positive_pnl_days / len(grouped_trades)) * 100)

    stats = {
        'totalPnL': round(total_pnl),
        'positivePnLDays': positive_pnl_days,
        'averageWinLoss': round(average_win_loss),
        'tradeWinPercentage': trade_win_percentage,
        'groupedTrades': grouped_trades
    }

    return jsonify(stats)

    # return jsonify(message=final)
    # print("done")
    



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

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000)