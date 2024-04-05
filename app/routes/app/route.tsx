import { Outlet } from "@remix-run/react";
import { TopNavbar } from "./TopNavbar";

export default function route() {
  return (
    <div className="flex flex-col w-full h-screen mx-auto bg-gray-200">
      <TopNavbar />
      <Outlet />
    </div>
  );
}
