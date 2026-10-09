// Sign-in screens: centered card over the hero image, always dark, no navbar or footer.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="dark" className="relative min-h-screen bg-background text-foreground">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url(/encyclopedia/hero.jpg)" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" aria-hidden />
      <main className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 pb-28 pt-10">
        {children}
      </main>
    </div>
  );
}
