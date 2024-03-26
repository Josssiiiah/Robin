import { useState } from "react";
import { ChevronRightIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { commitSession, getSession } from "~/sessions.server";
import { NavLink } from "@remix-run/react";

export function LeftSidebar() {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);

  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };

  return (
    <>
      {isLeftSidebarOpen && (
        <div className="fixed left-0 top-0 bottom-0 z-10 w-64 bg-black p-4">
          <nav>
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/app/dashboard"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-white hover:bg-gray-500 ${
                      isActive ? "bg-gray-500" : ""
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/app/journal"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-white hover:bg-gray-500 ${
                      isActive ? "bg-gray-500" : ""
                    }`
                  }
                >
                  Journal
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/app/nightBefore"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-white hover:bg-gray-500 ${
                      isActive ? "bg-gray-500" : ""
                    }`
                  }
                >
                  Night Before
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      )}
      <div
        className={`${
          isLeftSidebarOpen ? "left-[250px]" : "left-[10px]"
        } fixed top-1/2 z-40 flex h-20 w-8 cursor-pointer items-center justify-center rounded-lg`}
        onClick={toggleLeftSidebar}
      >
        {isLeftSidebarOpen ? (
          <ChevronLeftIcon color="black" width={20} height={20} />
        ) : (
          <ChevronRightIcon color="black" width={20} height={20} />
        )}
      </div>
    </>
  );
}
