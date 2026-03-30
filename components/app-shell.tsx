"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { WalletPill } from "@/components/wallet-pill";

const links = [
  { href: "/", label: "Bills" },
  { href: "/create", label: "Create" },
  { href: "/my-bills", label: "My Bills" },
];

export function AppShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  const pathname = usePathname();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary-deep/70">
            SplitBill Simple
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-ink/65 sm:text-base">{subtitle}</p>
        </div>
        <WalletPill />
      </div>

      <nav className="mb-6 flex w-full gap-2 overflow-x-auto rounded-full bg-white/75 p-2 shadow-card backdrop-blur">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              pathname === link.href
                ? "bg-primary text-white"
                : "text-ink/70 hover:bg-primary-soft hover:text-primary-deep",
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {children}
    </main>
  );
}
