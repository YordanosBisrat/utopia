import { UTOPIANavbar, UTOPIAFooter } from "@/components/utopia/Navbar";
import { SearchCommand } from "@/components/utopia/SearchCommand";

// Normal site pages: top navigation, footer and global search.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UTOPIANavbar />
      <main className="min-h-screen">{children}</main>
      <UTOPIAFooter />
      <SearchCommand />
    </>
  );
}
