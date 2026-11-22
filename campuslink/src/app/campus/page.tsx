import AppShell from "@/components/AppShell";
import CampusWorkspace from "./CampusWorkspace";

export const metadata = { title: "CampusLink | Campus" };

export default function CampusPage() {
  return (
    <AppShell user="Dana Carter" role="Grade 3 Teacher, Bluebonnet Elementary">
      <CampusWorkspace />
    </AppShell>
  );
}
