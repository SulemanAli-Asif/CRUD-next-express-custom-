import Link from "next/link";
import React from "react";

function Navbar() {
  return (
    <nav className="flex items-center justify-between shadow py-4 px-20">
      <div>
        <h1 className=" text-xl font-bold">CRUD</h1>
      </div>
      <ul className="flex space-x-4">
        <li>
          <a href="/" className=" hover:text-gray-500">
            Home
          </a>
        </li>
        <li>
          <Link
            href="/login"
            className=" hover:text-gray-500 bg-blue-500 p-2 text-white rounded"
          >
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
