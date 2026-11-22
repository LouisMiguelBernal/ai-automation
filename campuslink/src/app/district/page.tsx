import AppShell from "@/components/AppShell";
import DistrictDashboard from "./DistrictDashboard";

export const metadata = { title: "CampusLink | District" };

export default function DistrictPage() {
  return (
    <AppShell user="Dr. Renee Ortiz" role="Director of Federal Programs">
      <DistrictDashboard />
    </AppShell>
  );
}
