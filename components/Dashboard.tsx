"use client";

import React from "react";
import ItemsTable from "./ItemsTable";
import useSWR from "swr";

async function fetcher(url: string) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
}

function Dashboard() {
  const [searchText, setSearchText] = React.useState("");
  const { data, error, isLoading } = useSWR("/server/items", fetcher);

  if (error) return <div>Failed to load data: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;

  console.log("Data:", data); // Debugging: Log data

  // Ensure the data is an array before filtering
  // const filtered = data?.items.filter((item) => {

  // });

  // console.log("Filtered data:", filtered); // Debugging: Log filtered data

  return (
    <div className="mx-40 items-center text-center my-20">
      <h1 className="text-2xl text-center font-bold">Items</h1>

      <button className="my-4 bg-blue-500 p-1 rounded text-white">+ADD</button>
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="border border-gray-300 p-1 rounded mx-2"
        placeholder="Search"
      />
      <ItemsTable data={data.items} />
    </div>
  );
}

export default Dashboard;
