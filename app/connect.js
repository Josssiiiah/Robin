import axios from "axios";

function processFullTrades(data) {
  console.log("DATA: ", data);

  const openPositions = {};
  const completedTrades = [];

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const orders = data[key];
      if (Array.isArray(orders)) {
        for (const order of orders) {
          if (order.state === "filled") {
            for (const leg of order.legs) {
              const legId = leg.option;
              const quantity = parseFloat(order.processed_quantity);
              const price = parseFloat(order.price);

              if (leg.side === "buy") {
                if (!openPositions[legId]) {
                  openPositions[legId] = [];
                }
                openPositions[legId].push({ order, quantity, price });
              } else if (leg.side === "sell") {
                if (openPositions[legId] && openPositions[legId].length > 0) {
                  const openPosition = openPositions[legId].shift();
                  const openQuantity = openPosition.quantity;
                  const openPrice = openPosition.price;
                  const pnl = (price - openPrice) * openQuantity * 100;

                  const trade = {
                    symbol: order.chain_symbol,
                    openingOrder: openPosition.order.created_at,
                    optionType: leg.option_type,
                    expirationDate: leg.expiration_date,
                    strikePrice: leg.strike_price,
                    // closingOrder: order,
                    quantity: openQuantity,
                    openPrice,
                    closePrice: price,
                    pnl,
                    closeDate: order.updated_at,
                  };
                  completedTrades.push(trade);
                }
              }
            }
          }
        }
      }
    }
  }
  return completedTrades;
}

async function fetchData() {
  // const RH_USERNAME = "josiahgriggs8@gmail.com"
  // const RH_PASSWORD = "Coder1633!"
  // const mfa = "825722"

  // const options = {
  //   method: "POST",
  //   url: "https://api.robinhood.com/oauth2/token/",
  //   headers: {
  //     Accept: "*/*",
  //     "Accept-Encoding": "gzip, deflate, br",
  //     "Accept-Language": "en-US,en;q=1",
  //     "Content-Type": "application/x-www-form-urlencoded",
  //     "X-Robinhood-API-Version": "1.315.0",
  //     Connection: "keep-alive",
  //     "User-Agent": "*",
  //   },
  //   data: {
  //     client_id: "c82SH0WZOsabOXGP2sxqcj34FxkvfnWRZBKlBjFS",
  //     grant_type: "password",
  //     password: RH_PASSWORD,
  //     scope: "internal",
  //     username: RH_USERNAME,
  //     challenge_type: "sms",
  //     device_token: "fe3e28aa-4914-0cbb-d631-110568146b29",
  //     mfa_code: mfa,
  //   },
  // };

  //   // send requests to Robinhood and for current userId
  //   const response = await axios(options);
  //   const userId = "770122f5-b601-4243-86f0-2d9d77574757";

  const auth_token =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkY3QiOjE3MTEwOTI5NTAsImRldmljZV9oYXNoIjoiM2JiN2FiODQxZDdiYmQ4NGVlYmM5ZGJkODZhNjJhMTciLCJleHAiOjE3MTIyNDc3NzAsImxldmVsMl9hY2Nlc3MiOmZhbHNlLCJtZXRhIjp7Im9pZCI6ImM4MlNIMFdaT3NhYk9YR1Ayc3hxY2ozNEZ4a3ZmbldSWkJLbEJqRlMiLCJvbiI6IlJvYmluaG9vZCJ9LCJvcHRpb25zIjp0cnVlLCJzY29wZSI6ImludGVybmFsIiwic2VydmljZV9yZWNvcmRzIjpbeyJoYWx0ZWQiOmZhbHNlLCJzZXJ2aWNlIjoibnVtbXVzX3VzIiwic2hhcmRfaWQiOjEsInN0YXRlIjoiYXZhaWxhYmxlIn0seyJoYWx0ZWQiOmZhbHNlLCJzZXJ2aWNlIjoiYnJva2ViYWNrX3VzIiwic2hhcmRfaWQiOjgsInN0YXRlIjoiYXZhaWxhYmxlIn1dLCJzcm0iOnsiYiI6eyJobCI6ZmFsc2UsInIiOiJ1cyIsInNpZCI6OH0sIm4iOnsiaGwiOmZhbHNlLCJyIjoidXMiLCJzaWQiOjF9fSwidG9rZW4iOiJRZnFBOWVFYTlOV2NNOUlGR3VvRTViYWY1aUMzR2MiLCJ1c2VyX2lkIjoiZmVlM2NmYTMtMTFlYi00NTMxLWIzMjctNWMzNWYzNzg0Y2QzIiwidXNlcl9vcmlnaW4iOiJVUyJ9.UTZjKdRuE7Dqay1Ks3IOo43gcDrlkDaf1TzsUxybfECDUFIuixJG85CQaJ31Z2MGz__icufnFWCGwS8-rs5bvKk-PtlX1Yc3KEH_PS9ZkoAF7LjlMYECE0bAcXAwTU6AG9Vr_SNrcKNmTAagrBfMQwldBrlN0hUXtioFydOKXZ6sNSBQ5-HpC5xkNrzKSGuIVI4iuyTrhzKTLYUqkABlBgxt0_m27lIOZuhK39YxGA-Baj03zh6RrtCeZq2znHkNLCmPHovfVJ3NiqoE5TXYG_o2sR4o6mR7JL3gAq3CK07VJaV-PgSheJlC9DZ8GPuqHuxN8sfEzxp30BFWmoG1nA";

  // make request for trades
  var options2 = {
    method: "GET",
    url: "https://api.robinhood.com/options/orders/",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${auth_token}`,
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=1",
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Robinhood-API-Version": "1.315.0",
      Connection: "keep-alive",
      "User-Agent": "*",
    },
  };

  const response2 = await axios(options2);
  const fullTrades = processFullTrades(response2.data);
  const finalFullTrades = [];

  const now = new Date();
  for (const fullTrade of fullTrades) {
    const date = new Date(fullTrade.closeDate);
    if (now - date <= 8 * 24 * 60 * 60 * 1000) {
      finalFullTrades.push(fullTrade);
    }
  }

  console.log(fullTrades);
}

fetchData();
