"use client";
import useSWR from "swr";
import { useEffect, useState } from "react";
import ItemsTable from "./ItemsTable";
import { useAuth } from "@/app/Hooks/useAuth";

const fetcher = async (url: string) =>
  await fetch(url).then((res) => res.json());

function ItemsList() {
  const { data, error, isLoading } = useAuth("/server/items");
  const [token, setToken] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  // Filter items based on searchText
  const filteredItems = data?.filter((item: { name: string }) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  function handleAdd() {
    window.location.href = "/add";
  }
  async function handleDelete(id: number) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;
    try {
      const response = await fetch(`/server/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      const data = await response.json();
      alert("Item deleted successfully");
      window.location.reload();
      return data;
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      window.location.href = "/login";
    }
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load items</div>;

  return (
    <div className="text-center items-center mx-40 my-20 min-w-md">
      <h1 className="text-2xl font-bold">Items</h1>
      <div>
        <button
          onClick={handleAdd}
          className="bg-blue-500 p-2 m-2 text-white rounded"
        >
          +ADD
        </button>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search"
          className="border border-gray-300 p-2 w-80 rounded mt-4"
        />
      </div>

      {searchText && filteredItems?.length === 0 ? (
        <div className="mt-4 text-red-500">Not found</div>
      ) : (
        <ItemsTable data={filteredItems} handleDelete={handleDelete} />
      )}
    </div>
  );
}

export default ItemsList;
