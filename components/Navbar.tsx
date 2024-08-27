"use client";
import { data } from "autoprefixer";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/Hooks/useAuth";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState<String | null>(null);
  const { data, error } = useAuth("/api/session");

  async function handleLogout() {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      // Redirect to login page after logout
      window.location.href = "/login";
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  }

  useEffect(() => {
    if (data) {
      setIsLoggedIn(data.message);
    }
  }, [data]);

  function handleLogin() {
    window.location.href = "/login";
  }

  return (
    <nav className="flex items-center justify-between shadow py-4 px-20">
      <div>
        <h1 className=" text-xl font-bold">CRUD</h1>
      </div>
      <ul className="flex space-x-4">
        <li className="hover:text-gray-500 mt-2">
          <Link href="/" className="hover:text-gray-500">
            Home
          </Link>
        </li>
        <li>
          {isLoggedIn === "Authenticated" ? (
            <button
              onClick={handleLogout}
              className="bg-blue-500 p-2 text-white rounded"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-blue-500 p-2 text-white rounded"
            >
              Login
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
