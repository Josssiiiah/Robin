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

@app.route("/api/showStocks", methods=["GET"])
def showStocks():
    # handle login
    username = "josiahgriggs8@gmail.com"
    password = "Coder1633!"
    r.login(username, password)

    # get orders
    def get_option_orders(info=None):
        url = "https://api.robinhood.com/options/orders/"
        data = r.request_get(url, 'results')
        return(r.filter_data(data, info))


    def fix_file_extension(file_name):
        """ Takes a file extension and makes it end with .csv

        :param file_name: Name of the file.
        :type file_name: str
        :returns: Adds or replaces the file suffix with .csv and returns it as a string.

        """
        path = Path(file_name)
        path = path.with_suffix('.csv')
        return path.resolve()

    def create_absolute_csv(dir_path, file_name, order_type):
        """ Creates a filepath given a directory and file name.

        :param dir_path: Absolute or relative path to the directory the file will be written.
        :type dir_path: str
        :param file_name: An optional argument for the name of the file. If not defined, filename will be stock_orders_{current date}
        :type file_name: str
        :param file_name: Will be 'stock', 'option', or 'crypto'
        :type file_name: str
        :returns: An absolute file path as a string.

        """
        path = Path(dir_path)
        directory = path.resolve()
        if not file_name:
            file_name = "{}_orders_{}.csv".format(order_type, date.today().strftime('%b-%d-%Y'))
        else:
            file_name = fix_file_extension(file_name)
        return(Path.joinpath(directory, file_name))

    def export(dir_path, file_name=None):
        file_path = create_absolute_csv(dir_path, file_name, 'option')
        all_orders = get_option_orders()
        with open(file_path, 'w', newline='') as f:
            csv_writer = writer(f)
            csv_writer.writerow([
                'chain_symbol',
                'expiration_date',
                'strike_price',
                'option_type',
                'side',
                'order_created_at',
                'direction',
                'order_quantity',
                'order_type',
                'opening_strategy',
                'closing_strategy',
                'price',
                'processed_quantity'
            ])
            for order in all_orders:
                if order['state'] == 'filled':
                    for leg in order['legs']:
                        instrument_data = r.request_get(leg['option'])
                        csv_writer.writerow([
                            order['chain_symbol'],
                            instrument_data['expiration_date'],
                            instrument_data['strike_price'],
                            instrument_data['type'],
                            leg['side'],
                            order['created_at'],
                            order['direction'],
                            order['quantity'],
                            order['type'],
                            order['opening_strategy'],
                            order['closing_strategy'],
                            order['price'],
                            order['processed_quantity']
                        ])
            f.close()

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
        if (now - order_date) <= timedelta(days=5):
            final.append(item)

    # return jsonify(message=response)
    return jsonify(message=final)
    print("done")
    



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

