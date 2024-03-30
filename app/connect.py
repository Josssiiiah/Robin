import robin_stocks.robinhood as r
from dotenv import load_dotenv
import robin_stocks.robinhood as r



load_dotenv()

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