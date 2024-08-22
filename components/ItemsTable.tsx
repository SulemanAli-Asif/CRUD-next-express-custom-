import React from "react";
import { Item } from "@prisma/client";

type ItemsTableProps = {
  data: Item[]; // data is an array of Item objects
};

function ItemsTable({ data }: ItemsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full mt-4 bg-white border border-gray-200">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 border-b">Item</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item) => (
            <tr key={item.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 text-center border-b">{item.name}</td>
              <td className="py-2 px-4 text-center border-b">{item.price}</td>
              <td className="py-2 px-4 border-b">
                <div className="flex justify-center items-center space-x-2">
                  <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                    Delete
                  </button>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    Update
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ItemsTable;