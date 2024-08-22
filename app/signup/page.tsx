"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = () => {
    router.push("/signup");
  };

  return (
    <div className="mt-20 text-center ">
      <h1 className="text-2xl text-center">Sign Up</h1>

      <form className="mt-10 pt-10 w-1/2 mx-auto text-center border shadow flex flex-col gap-7">
        <label>
          <span>Name</span>
          <input
            type="name"
            placeholder="Enter your Name"
            required
            value={name}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2  bg-white rounded-lg border border-gray-400 ml-10"
          />
        </label>
        <label>
          <span>Email</span>
          <input
            type="email"
            placeholder="Enter your Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2  bg-white rounded-lg border border-gray-400 ml-10"
          />
        </label>
        <label>
          <span className="pr-2">Password</span>
          <input
            type="password"
            placeholder="Enter your Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 bg-white rounded-lg border border-gray-400"
          />
        </label>

        <div className="flex-end mx-3 mb-5 gap-4">
          <button
            className="px-5 py-1.5 text-sm bg-primary-orange rounded bg-blue-500 text-white"
            type="submit"
          >
            Sign Up
          </button>
        </div>
      </form>

      <button className="px-5 py-1.5 mt-8  text-sm bg-red-500 rounded text-white">
        Sign In Using Google
      </button>

      <button
        onClick={handleSignUp}
        className="px-5 py-1.5 ml-5 mt-8  text-sm bg-blue-500 rounded text-white"
      >
        Login
      </button>

      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
};

export default Login;
