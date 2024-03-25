import { Outlet } from "@remix-run/react";
import React from "react";
import { LeftSidebar } from "./leftSidebar";

export default function route() {
  return (
    <div className="w-full h-full items-center justify-center mx-auto bg-black">
      <LeftSidebar />
      <Outlet />
    </div>
  );
}
