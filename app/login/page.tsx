"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BuiltInProviderType } from "next-auth/providers/index";
import {
  signIn,
  signOut,
  useSession,
  getProviders,
  LiteralUnion,
  ClientSafeProvider,
} from "next-auth/react";

function Login() {
  const session = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(null);

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });
  }

  const handleGoogleSignin = async () => {
    signIn("google", { callbackUrl: "/" });
  };

  function redirectSignUp() {
    window.location.href = "/signup";
  }

  return (
    <>
      <h1 className="text-3xl pt-20 text-center font-bold">Login</h1>
      <form
        onSubmit={handleLogin}
        className="flex justify-center items-center px-10 py-14 w-1/2 mx-auto shadow-lg flex-col"
      >
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
        <button
          onClick={handleGoogleSignin}
          className="bg-red-500 p-2 text-white rounded"
        >
          Login Using Google
        </button>
      </div>
    </>
  );
}

export default Login;
