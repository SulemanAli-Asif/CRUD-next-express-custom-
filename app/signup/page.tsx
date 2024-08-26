"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!data.ok) {
      alert(data.message);
    }
    window.location.href = "/login";
    console.log("redirecting to login page");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleGoogleLogin = () => {
    window.location.href = "/auth/google";
  };

  useEffect(() => {
    if (status === "authenticated") {
      window.location.href = "/";
    }
  }, [status]);

  return (
    <>
      <h1 className="text-3xl pt-20 text-center font-bold">SignUp</h1>
      <form
        onSubmit={handleSubmit}
        className="flex justify-center items-center px-10 py-14 w-1/2 mx-auto shadow-lg flex-col"
      >
        <input
          type="name"
          placeholder="Name"
          value={name}
          className="border border-gray-300 p-2 w-80 rounded mt-4"
          onChange={(e) => setName(e.target.value)}
        />
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
          className="bg-blue-500 text-white p-2 w-40 rounded mt-4"
        >
          Sign up
        </button>
        <p className="mt-10">Already Registered?</p>
      </form>
      <div className="flex justify-center text-center items-center mt-5">
        <button
          onClick={handleLogin}
          className="mr-3 text-blue-500 font-semibold"
        >
          Login
        </button>
        <p className="mr-3">OR</p>
        <button
          onClick={handleGoogleLogin}
          className="bg-red-500 p-2 text-white rounded"
        >
          Login Using Google
        </button>
      </div>
    </>
  );
};

export default Login;
