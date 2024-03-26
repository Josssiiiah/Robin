// DEMO ROUTE TO BUILD MAILING LIST

// remix
import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
//ui
import { Button } from "~/components/ui/button";
import { getSession } from "~/sessions.server";
//images
import Dashboard from "~/images/dashboard.png";
import Journal from "~/images/journal.png";

//components
import { Input } from "~/components/ui/input";
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
    <div className="flex h-full w-full flex-col items-center max-w-[1400px] mx-auto">
      {/* <div className="flex w-full  flex-row items-center justify-end pr-4 pt-6">
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
      </div> */}

      <div className="flex flex-col gap-10 text-center min-h-screen pt-[150px]">
        <h1 className="text-7xl ">
          <strong>The Ultimate Trading Companion</strong>
        </h1>
        <p className="text-2xl ">
          Combine the power of journaling and analytics to unlock your full
          potential. <br /> Track your progress, identify areas for improvement,
          and develop a winning trading mindset.
        </p>
        <div className="flex flex-row gap-8 px-96 pt-4">
          <Input className="h-auto text-xl" type="email" placeholder="Email" />
          <Button className="flex p-8 shadow-2xl">
            <Link
              to="/app/dashboard"
              className="cursor-pointer py-[5px] text-xl text-center no-underline"
            >
              Join waitlist
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-center pt-10 rounded-xl">
          <img
            src={Dashboard}
            alt="dashboard"
            className="w-2/3 h-auto rounded-xl"
          />
        </div>
        {/* <Button className="flex p-8 shadow-2xl">
          <Link
            to="/app/dashboard"
            className="cursor-pointer py-[5px] text-xl text-center no-underline"
          >
            Start Journaling
          </Link>
        </Button> */}
      </div>

      <div className="flex justify-center flex-row gap-24 pt-36  w-full">
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold">
            Fine-tune your trading strategy
          </h1>

          <div className="flex flex-row pt-10 gap-4">
            <div>
                 <FaUndo className="w-8 h-8" />
            </div>
         
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-semibold"> Replay Trades </h2>
              <p className="text-xl">
                Synced with your trading data, you can replay your trades to
                understand where you went right or wrong.
              </p>
            </div>
          </div>
          <div className="flex flex-row pt-6 gap-4">
            <div>
                  <FaThinkPeaks className="w-8 h-8" />
            </div>
 
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-semibold"> Advanced Trade Tracking </h2>
              <p className="text-xl">
                Visually navigate through your entry and exit trading points,
                track your setups and mistakes, jot down notes for each trade,
                and more advanced tracking.
              </p>
            </div>
          </div>
        </div>
        <ChartComponent />
      </div>
      <div className="flex justify-center flex-row gap-24 pt-36 pb-12 w-full">
        <div>
          <img
            src={Journal}
            alt="journal"
            className="w-3/4 h-auto rounded-xl"
          />
        </div>
        <div>
        <h1 className="text-5xl font-bold">
          Optimize your trading performance</h1>
        </div>
      </div>
    </div>
  );
}
