// MAIN ROUTE

// remix
import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
//ui
import { Button } from "~/components/ui/button";
import { getSession } from "~/sessions.server";
//images
import Dashboard from "~/images/dashboard.png";

//components
import ChartComponent from "./chartComponent";

//icons
import { FaceIcon } from "@radix-ui/react-icons";
import { FaThinkPeaks, FaUndo } from "react-icons/fa";

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
    <div className="flex h-full w-full flex-col items-center max-w-[1440px] mx-auto">
      <div className="flex w-full  flex-row items-center justify-end pr-4 pt-6">
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
      <h1 className="pt-[200px] text-8xl ">
        <strong>Next-Gen Trading Journal</strong>
      </h1>
      <p className="flex items-center pt-6 text-center text-2xl ">
        Tradeplan helps you discover your strengths and weaknesses to
        become a <br />
        profitable trader with the power of journaling and analytics.{" "}
      </p>
      <div className="pt-10">
        <Button className="flex p-8 shadow-2xl">
          <Link
            to="/app/dashboard"
            className="cursor-pointer py-[5px] text-xl text-center no-underline"
          >
            Start Journaling
          </Link>
        </Button>
      </div>
      <div className="flex items-center justify-center pt-36 rounded-xl">
        <img
          src={Dashboard}
          alt="dashboard"
          className="w-7/8 h-auto rounded-xl"
        />
      </div>
      <div className="flex justify-center flex-row gap-24 pt-36  w-full">
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold">
            Fine-tune your trading strategy
          </h1>

          <div className="flex flex-row pt-10 gap-4">
            <FaUndo className="w-10 h-10" />
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold"> Replay Trades </h2>
              <p>
                Synced with your trading data, you can replay your trades to understand where you went right or wrong.
              </p>
            </div>
         
          </div>
          <div className="flex flex-row pt-6 gap-4">

          <FaThinkPeaks className="w-10 h-10" />
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold"> Advanced Trade Tracking </h2>
              <p>
              Visually navigate through your entry and exit trading points, 
              track your setups and mistakes, jot down notes for each trade, and more advanced tracking.
              </p>
            </div>
            </div>
        </div>
        <ChartComponent />
      </div>
      <div className="flex flex-row pt-36 px-12"></div>
    </div>
  );
}
