import { AksumGame } from "@/components/game/AksumGame";

export const metadata = { title: "Time Journey: Aksum | UTOPIA" };

export default function AksumPage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      <AksumGame />
    </main>
  );
}
