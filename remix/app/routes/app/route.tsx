import { Outlet } from "@remix-run/react";
import React from "react";
import { LeftSidebar } from "./leftSidebar";
import { Footer } from "./footer"

export default function route() {
  return (
    <div className="flex flex-col w-full h-screen mx-auto bg-gray-200">
      <LeftSidebar />
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
}
