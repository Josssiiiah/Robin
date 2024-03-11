function generateDeviceToken(): string {
    /**
     * This function will generate a token used when logging on.
     * @returns A string representing the token.
     */
    const rands: number[] = [];
    for (let i = 0; i < 16; i++) {
      const r = Math.random();
      const rand = 4294967296.0 * r;
      rands.push((Math.floor(rand) >> ((3 & i) << 3)) & 255);
    }
  
    const hexa: string[] = [];
    for (let i = 0; i < 256; i++) {
      hexa.push(("0" + (i + 256).toString(16).slice(1)).slice(-2));
    }
  
    let id = "";
    for (let i = 0; i < 16; i++) {
      id += hexa[rands[i]];
      if (i === 3 || i === 5 || i === 7 || i === 9) {
        id += "-";
      }
    }
  
    return id;
  }

async function login() {
    const username = "josiahgriggs8@gmail.com"
    const password = "Coder1633!"
    const loginUrl = "https://api.robinhood.com/oauth2/token/"
    const clientId = "'c82SH0WZOsabOXGP2sxqcj34FxkvfnWRZBKlBjFS'"

    const payload = {
        'client_id': clientId,
        'expires_in': 86400,
        'grant_type': 'password',
        'password': password,
        'scope': 'internal',
        'username': username,
        'challenge_type': 'sms',
        'device_token': generateDeviceToken(),
    }

    const data = await fetch(loginUrl, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "Accept": "*/*",
            "Accept-Encoding": "gzip,deflate,br",
            "Accept-Language": "en-US,en;q=1",
            "X-Robinhood-API-Version": "1.315.0",
            "Connection": "keep-alive",
            "User-Agent": "*"
          },
        body: JSON.stringify(payload)
    })

    console.log(username, password)
    console.log(data)
} 


login()
