import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const fetcher = async (url: string, token: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: ` Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  const res = await response.json();
  console.log(res);
  return res;
};

export const useAuth = (URL: string) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      router.push("/login");
    }
  }, [router, token]);

  const { data, error } = useSWR(
    token ? [URL, token] : null,
    ([url, token]) => {
      return fetcher(url, token);
    },
    {
      onError: () => router.push("/login"),
    }
  );

  if (error) {
    router.push("/login");
  }
  console.log(data);

  return { data, isLoading: !data && !error, error };
};
