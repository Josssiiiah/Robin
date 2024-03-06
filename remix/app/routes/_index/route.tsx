import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-full w-full flex-col items-center">
      <div className="flex flex-row w-full pt-2 pl-4 max-w-[1440px] items-center justify-between">
        <div className="flex-grow"></div> 
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
