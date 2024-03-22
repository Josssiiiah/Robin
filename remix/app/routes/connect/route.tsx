import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useSubmit, useFetcher, useActionData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';


// -----------------------------------------------------------------------------
// Connect FUNCTION
// -----------------------------------------------------------------------------
interface ActionData {
    success?: boolean;
    mfaRequired?: boolean;
    error?: string;
  }

export default function Connect() {
    const { toast } = useToast();
    const submit = useSubmit();
    const fetcher = useFetcher();  
    const actionData = useActionData<ActionData>();
    const [showMFAInput, setShowMFAInput] = useState(false);
  
    useEffect(() => {
        if (actionData?.mfaRequired) {
          setShowMFAInput(true);
        }
        if (actionData?.error) {
          toast({
            title: "Error",
            description: actionData.error,
            variant: "destructive",
          });
        }
      }, [actionData, toast]);

    return (
    <div className="flex flex-col gap-8 p-10">
        <div className="flex justify-start">
        <Button>
            <Link to="/journal" className="cursor-pointer no-underline">
            Back
            </Link>
        </Button>
        </div>
        <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold pb-8 pt-24">
            Connect to your Broker
        </h1>
        <fetcher.Form method="post" className="w-full max-w-md">
            <div className="mb-4">
            <label
                htmlFor="email"
                className="block text-gray-700 font-bold mb-2"
            >
                Email
            </label>
            <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
            </div>
            <div className="mb-6">
            <label
                htmlFor="password"
                className="block text-gray-700 font-bold mb-2"
            >
                Password
            </label>
            <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
            </div>
            <div className="mb-6">
            <label
                htmlFor="password"
                className="block text-gray-700 font-bold mb-2"
            >
                MFA
            </label>
            <input
                type="password"
                id="mfa"
                name="mfa"
                placeholder="Enter your MFA code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
            </div>
            {/* Button to connect to robinhood brokerage and get auth token back */}
            <Button type="submit">Robinhood</Button>
        </fetcher.Form>
        </div>
    </div>
    );
}

// -----------------------------------------------------------------------------
// ACTION FUNCTION
// -----------------------------------------------------------------------------
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const RH_USERNAME = formData.get("email") as string;
  const RH_PASSWORD = formData.get("password") as string;
  const mfa = formData.get("mfa") as string;

  const options = {
    method: 'POST',
    url: 'https://api.robinhood.com/oauth2/token/',
    headers: {
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=1',
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Robinhood-API-Version': '1.315.0',
      'Connection': 'keep-alive',
      'User-Agent': '*',
    },
    data: {
      client_id: 'c82SH0WZOsabOXGP2sxqcj34FxkvfnWRZBKlBjFS',
      grant_type: 'password',
      password: RH_PASSWORD,
      scope: 'internal',
      username: RH_USERNAME,
      challenge_type: 'sms',
      device_token: 'fe3e28aa-4914-0cbb-d631-110568146b29',
      mfa_code: mfa 
    },
  };

  try {
    const response = await axios(options);
    console.log('options', response.data);
    return json({ success: true });
  } catch (error: any) {
    console.log('error', error);
    if (error.response && error.response.data && error.response.data.detail) {
      return json({ success: false, error: error.response.data.detail });
    } else {
      return json({ success: false, error: 'Login failed' });
    }
  }
}