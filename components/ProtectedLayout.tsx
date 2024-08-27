"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { useAuth } from "../app/Hooks/useAuth";
type ProtectedLayoutProps = {
  children: ReactNode;
};

function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { data, error, isLoading } = useAuth("/api/profile");

  if (error) return <div>Failed to fetch the page</div>;
  return data ? <div>{children}</div> : <div>Loading...</div>;
}

export default ProtectedLayout;
