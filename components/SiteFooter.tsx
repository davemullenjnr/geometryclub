"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

const HIDE_FOOTER_PATHS = new Set(["/submit/confirmation"]);

export function SiteFooter() {
  const pathname = usePathname();

  if (HIDE_FOOTER_PATHS.has(pathname)) {
    return null;
  }

  return <Footer />;
}
