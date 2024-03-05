from supabase import create_client
from dotenv import load_dotenv
import robin_stocks.robinhood as r
from pathlib import Path
from csv import writer
from datetime import date
import os

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_ANON_KEY")
supabase = create_client(url, key)


username = "josiahgriggs8@gmail.com"
password =  "Coder1633!"
# Logic to handle login and possibly MFA here
data = r.login(username, password)

# data = supabase.table("test").insert({"id":"500"}).execute()
# print(jsonify(orders=r.get_all_option_orders()))

def get_option_orders(info=None):
    """Returns a list of all the option orders that have been processed for the account.

    :param info: Will filter the results to get a specific value.
    :type info: Optional[str]
    :returns: Returns a list of dictionaries of key/value pairs for each option order. If info parameter is provided, \
    a list of strings is returned where the strings are the value of the key that matches info.

    """
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
    arr = []
    for order in all_orders:
        if order['state'] == 'filled':
            for leg in order['legs']:
                    ret = ({
                        'chain_symbol': order['chain_symbol'],
                        'side': leg['side'],
                        'order_created_at': order['created_at'],
                        'price': order['price'],
                        'processed_quantity': order['processed_quantity']
                    })
                    arr.append(ret)
    print(arr)

 

if __name__ ==  '__main__':  
    print("start")
    # export("./")
    get_orders()
    print("done")

