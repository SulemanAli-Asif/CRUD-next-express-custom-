import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  const res = await response.json();
  return res;
};

export const useAuth = (URL: string) => {
  const router = useRouter();

  // useEffect(() => {
  //   const getCookie = (name: string) => {
  //     const value = `; ${document.cookie}`;
  //     const parts = value.split(`; ${name}=`);
  //     if (parts.length === 2) return parts.pop()?.split(";").shift();
  //   };

  //   const storedToken = getCookie("auth_token");
  //   if (storedToken) {
  //     setToken(storedToken);
  //   } else {
  //     router.push("/login");
  //   }
  // }, [router]);

  const { data, error } = useSWR([URL], (url) => fetcher(url), {
    onError: () => router.push("/login"),
    revalidateIfStale: false,
  });

  console.log("SWR data: ", data);

  if (error) {
    router.push("/login");
  }
  return { data, isLoading: !data && !error, error };
};
