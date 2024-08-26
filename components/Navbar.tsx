"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  signIn,
  signOut,
  useSession,
  getProviders,
  LiteralUnion,
  ClientSafeProvider,
} from "next-auth/react";

function Navbar() {
  const { data: session, status } = useSession();

  function handleLogin() {
    window.location.href = "/login";
  }

  function handleLogout() {
    signOut({ callbackUrl: "/login" });
  }

  return (
    <nav className="flex items-center justify-between shadow py-4 px-20">
      <div>
        <h1 className="text-xl font-bold">CRUD</h1>
      </div>
      <ul className="flex space-x-4">
        <li className="hover:text-gray-500 mt-2">
          <Link href="/" className="hover:text-gray-500">
            Home
          </Link>
        </li>
        <li>
          {status === "authenticated" ? (
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
