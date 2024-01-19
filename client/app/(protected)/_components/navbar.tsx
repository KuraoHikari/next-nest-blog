"use client";

import { UserButton } from "@/components/auth/user-button";
import { ModeToggle } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="bg-secondary flex justify-between items-center p-4 shadow-sm">
      <ModeToggle />
      <div className="flex gap-x-2">
        <h2 className="font-bold text-lg">Kurao Blog</h2>
      </div>
      <UserButton />
    </nav>
  );
};
