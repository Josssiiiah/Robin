import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, json, useFetcher, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { LogoutButton } from "./logoutButton";
import { LoginButton } from "./loginButton";


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({request, params}: LoaderFunctionArgs) {
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
    console.log(data)

return json({
  data: Math.random(),
})
  
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  const fetcher = useFetcher();

  return (
    <div className="flex h-full w-full flex-col items-center">
      <div className="flex flex-row w-full pt-2 pl-4 max-w-[1440px] items-center justify-between">
        <div className="flex-grow"></div> 
          <Button>
          <LogoutButton />

          </Button>
          <Button>
          <LoginButton />
          </Button>
       
        <Button>
          <Link to="/login" className="cursor-pointer no-underline">
            Login
          </Link>
        </Button>
      </div>
      <h1 className="text-5xl pt-[200px]"><strong>Next-Gen Trading Journal</strong></h1>
      <p className="flex text-center items-center pt-6"> TradZellaK helps you discover your strengths and weaknesses to become a <br />
      profitable trader with the power of journaling and analytics. </p>
      <div className="pt-10">
        <Button className="flex">
          <Link
            to="/journal"
            className="cursor-pointer py-[5px] text-center no-underline"
          >
            Start Journaling
          </Link>
        </Button>
      </div>
    </div>
  );
}


