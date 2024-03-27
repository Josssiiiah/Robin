// DEMO ROUTE TO BUILD MAILING LIST

// remix
import { LoaderFunctionArgs } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useFetcher,
  Form,
  useActionData,
  useSubmit,
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
    <div className="flex h-full w-full flex-col items-center max-w-[1400px] mx-auto overflow-x-hidden">
      <div className="flex flex-col gap-6 text-center min-h-screen pt-[100px] lg:pt-[150px]">
        <h1 className="text-4xl lg:text-7xl font-bold">
          The Simple Trading Companion
        </h1>
        <p className="hidden md:flex mx-auto text-center text-sm lg:text-2xl px-4 lg:px-0">
          Combine the power of journaling and analytics to unlock your full
          potential. <br /> Track your progress, identify areas for improvement, and
          develop a winning trading mindset.
        </p>
        <p className="md:hidden text-sm lg:text-2xl px-4 lg:px-0">
          Combine the power of journaling and analytics to unlock your full
          potential. Track your progress, identify areas for improvement, and
          develop a winning trading mindset.
        </p>
        <fetcher.Form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 px-16 lg:px-72 pt-4">
            <Input
              className="h-auto text-base lg:text-xl"
              type="email"
              name="email"
              placeholder="Email"
              required
            />
            <Button type="submit" className="flex p-4 lg:p-8 shadow-2xl">
              Join waitlist
            </Button>
          </div>
        </fetcher.Form>
        <div className="flex items-center justify-center px-6 pt-6 lg:pt-10 rounded-xl">
          <img
            src={Dashboard}
            alt="dashboard"
            className="w-full lg:w-2/3 h-auto rounded-xl"
          />
        </div>
      </div>
      <div className="flex flex-col px-12 pt-12 gap-16">
        <div className="flex flex-col xl:flex-row justify-center gap-12 lg:gap-24 lg:pt-12 w-full px-4 lg:px-0">
          <div className="flex flex-col">
          <h1 className="text-center lg:text-left text-3xl lg:text-4xl font-bold">
              Fine-tune your trading strategy
            </h1>

            <div className="items-center text-center lg:items-left lg:text-left flex flex-col lg:flex-row pt-6 lg:pt-10 gap-4">
              <div>
                <FaUndo className="w-6 lg:w-8 h-6 lg:h-8" />
              </div>

              <div className="flex flex-col gap-1">
                <h2 className="text-xl lg:text-2xl font-semibold">
                  Replay Trades
                </h2>
                <p className="text-base lg:text-xl">
                  Synced with your trading data, you can replay your trades to
                  understand where you went right or wrong.
                </p>
              </div>
            </div>
            <div className="items-center text-center lg:items-left lg:text-left flex flex-col lg:flex-row pt-6 lg:pt-10 gap-4">
              <div>
                <FaThinkPeaks className="w-6 lg:w-8 h-6 lg:h-8" />
              </div>

              <div className="flex flex-col gap-1">
                <h2 className="text-xl lg:text-2xl font-semibold">
                  Advanced Trade Tracking
                </h2>
                <p className="text-base lg:text-xl">
                  Visually navigate through your entry and exit trading points,
                  track your setups and mistakes.
                </p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <ChartComponent width={600} height={400} />
          </div>
          <div className="flex md:hidden items-center justify-center pl-8">
            <ChartComponent width={300} height={200} />
          </div>
        </div>

        <div className="flex flex-col xl:flex-row pt-12 lg:pt-36 gap-8 lg:gap-18 pb-8 lg:pb-12 px-4 lg:px-0 justify-between">
          <img
            src={Journal}
            alt="journal"
            className="hidden xl:flex w-full lg:w-1/2 h-auto rounded-xl"
          />
          <div className="flex flex-col">
            <h1 className="text-center lg:text-left text-3xl lg:text-4xl font-bold">
              Optimize your trading performance
            </h1>

            <div className="items-center text-center lg:items-left lg:text-left flex flex-col lg:flex-row pt-6 lg:pt-10 gap-4">
              <div>
                <FaBook className="w-6 lg:w-8 h-6 lg:h-8" />
              </div>

              <div className="flex flex-col gap-1">
                <h2 className="text-xl lg:text-2xl font-semibold">
                  Trading Journal
                </h2>
                <p className="text-base lg:text-xl">
                  Journaling your trades shouldn't be a chore. Automatically sync your trades, and start understanding yourself
                  better.
                </p>
              </div>
            </div>
            <div className="items-center text-center lg:items-left lg:text-left flex flex-col lg:flex-row pt-6 lg:pt-10 gap-4">
              <div>
                <FaRegImages className="w-6 lg:w-8 h-6 lg:h-8" />
              </div>

              <div className="flex flex-col gap-1">
              <h2 className="text-xl lg:text-2xl font-semibold">
                  Intelligent Reports
                </h2>
                <p className="text-base lg:text-xl">
                  Access insightful reports that let you see deeper
                  into your data.
                </p>
              </div>
            </div>
          </div>
          <img
            src={Journal}
            alt="journal"
            className="flex xl:hidden w-full h-auto rounded-xl"
          />
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
  console.log("EMAIL HERE FOLKS: ", email);

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
