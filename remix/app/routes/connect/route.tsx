import { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, useSubmit, useFetcher } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";

// -----------------------------------------------------------------------------
// Connect FUNCTION
// -----------------------------------------------------------------------------
export default function Connect() {
    const { toast } = useToast();
    const submit = useSubmit();
    const fetcher = useFetcher();

    const handleRobinhoodClick = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    submit(event.currentTarget, { method: "post" });

    toast({
        title: "You submitted",
        description: (
        <pre>
            <code>{JSON.stringify({ email, password }, null, 2)}</code>
        </pre>
        ),
    });
};

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
        <fetcher.Form onSubmit={handleRobinhoodClick} className="w-full max-w-md">
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
            {/* Button to connect to robinhood brokerage and get cookie back */}
            <Button type="submit">Robinhood</Button>
        </fetcher.Form>
        </div>
        <Form>
        <div className="mb-6">
            <label
            htmlFor="password"
            className="block text-gray-700 font-bold mb-2"
            >
            MFA
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
        <Button>Submit</Button>
        </Form>
    </div>
    );
}

// -----------------------------------------------------------------------------
// ACTION FUNCTION
// -----------------------------------------------------------------------------
export async function action({ request }: ActionFunctionArgs) {
    const data = await request.formData();
    const email = data.get("email");
    const password = data.get("password");

    console.log(email, password);

    return null;
}