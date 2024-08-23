import ProtectedLayout from "@/components/ProtectedLayout";
import UpdateForm from "@/components/UpdateForm";
import React from "react";

function Update() {
  return (
    <div>
      <ProtectedLayout>
        <UpdateForm />
      </ProtectedLayout>
    </div>
  );
}

export default Update;
