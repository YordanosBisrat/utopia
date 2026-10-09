// A template re-mounts on every navigation, so every page fades in.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}