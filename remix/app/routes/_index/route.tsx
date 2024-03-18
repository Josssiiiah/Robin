// MAIN ROUTE

// remix
import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

//ui
import { Button } from "~/components/ui/button";
import { getSession } from "~/sessions.server";

// -----------------------------------------------------------------------------
// LOADER FUNCTION
// -----------------------------------------------------------------------------
export async function loader({ request }: LoaderFunctionArgs) {
  // check if logged in
  let isUser = false;
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (userId) {
    isUser = true;
  }

  return { isUser };
}

// -----------------------------------------------------------------------------
// Index FUNCTION
// -----------------------------------------------------------------------------
export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full w-full flex-col items-center">
      <div className="flex w-full max-w-[1440px] flex-row items-center justify-end pr-4 pt-2">
        {data.isUser ? (
          <Button>
            <Link to="/logout" className="cursor-pointer no-underline">
              Logout
            </Link>
          </Button>
        ) : (
          <Button>
            <Link to="/login" className="cursor-pointer no-underline">
              Login
            </Link>
          </Button>
        )}
      </div>
      <h1 className="pt-[200px] text-5xl">
        <strong>Next-Gen Trading Journal</strong>
      </h1>
      <p className="flex items-center pt-6 text-center">
        TradZellaK helps you discover your strengths and weaknesses to become a{" "}
        <br />
        profitable trader with the power of journaling and analytics.{" "}
      </p>
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
