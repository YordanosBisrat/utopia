import { PortalHub } from "@/components/game/PortalHub";

export const metadata = { title: "Time Portal | UTOPIA" };

export default function PortalPage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background">
      <PortalHub />
    </main>
  );
}
