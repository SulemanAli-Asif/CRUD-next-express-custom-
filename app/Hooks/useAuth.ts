import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  const res = await response.json();
  return res;
};

export const useAuth = (URL: string) => {
  const router = useRouter();

  const { data, error } = useSWR(URL, fetcher, {
    onError: () => router.push("/login"),
    revalidateIfStale: false,
  });

  if (error) {
    router.push("/login");
  }

  return { data, isLoading: !data && !error, error };
};
