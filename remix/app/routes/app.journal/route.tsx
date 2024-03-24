import { LoaderFunctionArgs } from "@remix-run/node";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { requireAuth } from "~/sessions.server";

// -----------------------------------------------------------------------------
// LOADER FUNCTION
// -----------------------------------------------------------------------------
export async function loader({ request }: LoaderFunctionArgs) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  // protected route
  const userid = await requireAuth(request);

  // pull in auth token
  try {
    const { data, error } = await supabase
      .from("rh_auth")
      .select("auth_token")
      .eq("user_id", userid)
      .single();

    if (error || !data) {
      console.error("Error fetching auth token:", error);
      return { userid, stats: null, error: "Connect to Broker" };
    }

    // make request for trades
    var options = {
      method: "GET",
      url: "https://api.robinhood.com/options/orders/",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${data!.auth_token}`,
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=1",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Robinhood-API-Version": "1.315.0",
        Connection: "keep-alive",
        "User-Agent": "*",
      },
    };

    function processOrders(data: any) {
      const ret = [];

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const orders = data[key];
          if (Array.isArray(orders)) {
            // If the property value is an array, process it
            for (const order of orders) {
              if (order.state === "filled") {
                for (const leg of order.legs) {
                  const i = {
                    symbol: order.chain_symbol,
                    side: leg.side,
                    order_created_at: order.created_at,
                    price: order.price,
                    processed_quantity: order.processed_quantity,
                  };
                  ret.push(i);
                }
              }
            }
          }
        }
      }
      return ret;
    }

    const response2 = await axios(options);
    const response = processOrders(response2.data);
    const final = [];

    // Filter by last 12 days
    const now: any = new Date();
    for (const item of response) {
      const orderDate: any = new Date(item.order_created_at);
      if (now - orderDate <= 30 * 24 * 60 * 60 * 1000) {
        final.push(item);
      }
    }

    // Perform calculations on the server-side
    const groupedTrades: any = {};
    for (const item of final) {
      const date = item.order_created_at.split("T")[0]; // Extract date part
      if (!groupedTrades[date]) {
        groupedTrades[date] = { trades: [], totalBuy: 0, totalSell: 0 };
      }
      const amount =
        parseFloat(item.price) * parseFloat(item.processed_quantity);
      groupedTrades[date].trades.push(item);
      if (item.side === "buy") {
        groupedTrades[date].totalBuy += amount;
      } else {
        groupedTrades[date].totalSell += amount;
      }
    }

    const stats = {
      userId: userid,
      groupedTrades,
    };

    // console.log("Response 2:", stats);
    return { userid, stats, error: null };
  } catch (error) {
    console.error("Error in request 1:", error);
    return { userid, stats: null, error: "Failed to fetch data" };
  }
}

export default function route() {
  const data = {
    value1: "Value 1",
    value2: "Value 2",
    value3: "Value 3",
    value4: "Value 4",
  };

  return (
    <div className="flex flex-col p-10 h-screen">
      <div className="flex text-center items-center justify-center">
        <h1 className="text-4xl text-black font-bold">Journal</h1>
      </div>
      <div className="flex flex-col mt-8 gap-4">
        {Object.entries(data).map(([key, value]) => (
          <Card key={key} className="w-full px-4">
            <CardHeader>
              <CardTitle>{key}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{value}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
