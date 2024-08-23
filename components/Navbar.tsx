"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

function Navbar() {
  const [token, setToken] = useState<String | null>(null);

  useEffect(() => {
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
      return null;
    };

    const storedToken = getCookie("auth_token");
    setToken(storedToken);
  }, []);

  function handleLogin() {
    window.location.href = "/login";
  }

  function handleLogout() {
    document.cookie =
      "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

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
          {token ? (
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
