// Full-screen game pages keep the dark look even when the site is in light theme.
export default function ImmersiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="dark" className="bg-background text-foreground">
      {children}
    </div>
  );
}
