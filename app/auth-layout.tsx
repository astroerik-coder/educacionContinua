"use client";

import { usePathname } from "next/navigation";
import AuthCheck from "./components/AuthCheck";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  return <AuthCheck pathName={pathname}>{children}</AuthCheck>;
}
