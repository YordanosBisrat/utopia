import Image from "next/image";
import Link from "next/link";

export function Logo({
  href = "/",
  size = 40,
  showText = true,
}: {
  href?: string;
  size?: number;
  showText?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label="UTOPIA | you-ጦቢያ, home"
      className="pointer-events-auto flex items-center gap-3"
    >
      <Image
        src="/brand/logo-mark.png"
        alt=""
        width={size}
        height={size}
        priority
        className="rounded-xl shadow-[var(--shadow-relic)]"
      />
      {showText && (
        <span className="font-display text-xs uppercase tracking-[0.25em] text-parchment sm:text-sm">
          Utopia <span className="font-geez normal-case text-gold">| you-ጦቢያ</span>
        </span>
      )}
    </Link>
  );
}