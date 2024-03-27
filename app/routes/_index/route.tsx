// DEMO ROUTE TO BUILD MAILING LIST

// remix
import { LoaderFunctionArgs } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useFetcher,
  Form,
  useActionData,
  useSubmit
} from "@remix-run/react";
//ui
import { Button } from "~/components/ui/button";
import { getSession } from "~/sessions.server";
//images
import Dashboard from "~/images/dashboard.png";
import Journal from "~/images/journal.png";

//components
import { Input } from "~/components/ui/input";
import ChartComponent from "./chartComponent";
import { Footer } from "./footer";
import { useToast } from "~/components/ui/use-toast";

//icons
import { FaceIcon } from "@radix-ui/react-icons";
import { FaThinkPeaks, FaUndo, FaBook, FaRegImages } from "react-icons/fa";
import { createSupabaseServerClient } from "../supabase.server";
import { useEffect } from "react";

// -----------------------------------------------------------------------------
// Index FUNCTION
// -----------------------------------------------------------------------------
export default function Index() {
  const { toast } = useToast();
  const submit = useSubmit();

  const actionData = useActionData<typeof action>();
  const fetcher = useFetcher();

  useEffect(() => {
    if (actionData?.error) {
      toast({
        title: "Login Failed",
        description: actionData.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Email added successfully",
        variant: "default",
      });
    }
  }, [actionData, toast]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit(event.currentTarget, { method: "post" });
    event.currentTarget.reset(); // Reset the form after submitting

  };

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
          <strong>The Simple Trading Companion</strong>
        </h1>
        <p className="text-2xl ">
          Combine the power of journaling and analytics to unlock your full
          potential. <br /> Track your progress, identify areas for improvement,
          and develop a winning trading mindset.
        </p>        <fetcher.Form onSubmit={handleSubmit}>
        <div className="flex flex-row gap-8 px-80 pt-4">


            <Input
              className="h-auto text-xl"
              type="email"
              name="email"
              placeholder="Email"
              required
            />

            <Button type="submit" className="flex p-8 shadow-2xl">
        
                Join waitlist
     
            </Button>
      
        </div>
  </fetcher.Form>

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
              <h2 className="text-2xl font-semibold">
                {" "}
                Advanced Trade Tracking{" "}
              </h2>
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
      <div className="flex flex-row pt-36 gap-12 pb-12 justify-between">
        <img src={Journal} alt="journal" className="w-1/2 h-auto rounded-xl" />
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold">
            Optimize your trading performance
          </h1>

          <div className="flex flex-row pt-10 gap-4">
            <div>
              <FaBook className="w-8 h-8" />
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-semibold"> Trading Journal </h2>
              <p className="text-xl">
                Journaling your trades shouldn't be a chore. With us, it's
                effortless. Sync your trades, and start understanding youreself
                better.
              </p>
            </div>
          </div>
          <div className="flex flex-row pt-6 gap-4">
            <div>
              <FaRegImages className="w-8 h-8" />
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-semibold">Intelligent Reports</h2>
              <p className="text-xl">
                What's your worst trading day? Which mistake is causing the most
                losses? Are you losing too much money on poor risk management?
                Access insightful reports that let you see deeper into the data.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
// -----------------------------------------------------------------------------
// ACTION FUNCTION
// -----------------------------------------------------------------------------
export async function action({ request }: any) {
  const supabase = await createSupabaseServerClient({ request });

  // handle form data
  const formData = await request.formData();
  const { email } = Object.fromEntries(formData.entries());
  console.log("EMAIL HERE FOLKS: ", email)

  // call supabase sign up function, adds user to database
  const { data, error } = await supabase.from("waiting_list").insert({
    email: email as string,
    created_at: new Date(),
  });

  // if error when signing up
  if (error) {
    console.log(error);
    return { error: error.message };
  }

  // if user created successfully
  else {
    console.log("Email added successfully", data);
    return null;
  }
}
