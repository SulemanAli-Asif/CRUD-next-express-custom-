"use client";
import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // function handleLogin(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   fetch("/server/login", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ email, password }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.message === "Login successful") {
  //         window.location.href = "/";
  //       } else {
  //         alert(data.message);
  //       }
  //     });
  // }

  // function googleSignIn() {
  //   signIn("google", { callbackUrl: "/" });
  // }

  function redirectSignUp() {
    window.location.href = "/signup";
  }

  return (
    <>
      <h1 className="text-3xl pt-20 text-center font-bold">Login</h1>
      <form className="flex justify-center items-center px-10 py-14 w-1/2 mx-auto shadow-lg flex-col">
        <input
          type="email"
          placeholder="Email"
          value={email}
          className="border border-gray-300 p-2 w-80 rounded mt-4"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 p-2 w-80 rounded mt-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-80 rounded mt-4"
        >
          Login
        </button>
        <p className="mt-10">Not Registered?</p>
      </form>
      <div className="flex justify-center text-center items-center mt-5">
        <button
          onClick={redirectSignUp}
          className="mr-3 text-blue-500 font-semibold"
        >
          Signup
        </button>
        <p className="mr-3">OR</p>
        <button className="bg-red-500 p-2 text-white rounded">
          Login Using Google
        </button>
      </div>
    </>
  );
}

export default Login;
