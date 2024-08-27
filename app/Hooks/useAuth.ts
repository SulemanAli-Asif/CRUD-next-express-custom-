import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const fetcher = async (url: string, token: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
    };

    const storedToken = getCookie("auth_token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      router.push("/login");
    }
  }, [token, router]);

  const { data, error } = useSWR(
    token ? [URL, token] : null,
    ([url, token]) => fetcher(url, token),
    {
      onError: () => router.push("/login"),
      revalidateIfStale: false,
    }
  );

  if (error) {
    router.push("/login");
  }
  return { data, isLoading: !data && !error, error };
};
