"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
export default function DashboardNav({
  navLinks,
}: {
  navLinks: { label: string; path: string; icon: JSX.Element }[];
}) {
  // get the url pathname for link highlight
  const pathname = usePathname();
  return (
    <nav className=" py-2 overflow-auto">
      <ul className="flex gap-6 text-xs font-bold">
        <AnimatePresence>
          {navLinks.map((link, index) => (
            <motion.li key={index} whileTap={{ scale: 0.95 }}>
              <Link
                href={link.path}
                className={cn(
                  "flex flex-col gap-1 items-center",
                  pathname === link.path && "text-primary"
                )}
              >
                {link.icon} {link.label}
                {pathname === link.path && (
                  <motion.div
                    className="h-[2px] w-full rounded-full bg-primary "
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    layoutId="underline"
                    transition={{ type: "string", stiffness: 35 }}
                  />
                )}
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </nav>
  );
}
