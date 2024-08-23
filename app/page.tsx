import Dashboard from "@/components/Dashboard";
import ProtectedLayout from "@/components/ProtectedLayout";

export default function Home() {
  return (
    <ProtectedLayout>
      <Dashboard />
    </ProtectedLayout>
  );
}
