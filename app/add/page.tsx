import AddForm from "@/components/AddForm";
import ProtectedLayout from "@/components/ProtectedLayout";
import React from "react";

function Add() {
  return (
    <div>
      <ProtectedLayout>
        <AddForm />
      </ProtectedLayout>
    </div>
  );
}

export default Add;
