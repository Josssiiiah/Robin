import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Trader</h1>
      <div>
        <Link to="/query">Query</Link>
        <Link to="/mutation">Mutation</Link>
        <Link to="/db">DB</Link>
      </div>
     
    </div>
  );
}
