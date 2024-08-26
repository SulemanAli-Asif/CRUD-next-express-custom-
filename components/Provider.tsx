"use client";

import { SessionProvider } from "next-auth/react";
const Provider = ({ children, session }: ProviderProps) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

interface ProviderProps {
  children: React.ReactNode;
  session?: any;
}

export default Provider;
