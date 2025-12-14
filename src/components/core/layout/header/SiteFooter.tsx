import React from "react";
import { cn } from "@/lib/utils";
import { Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

import { Logo } from "./app-logo";
import { Link } from "@tanstack/react-router";



type StickyFooterProps = React.ComponentProps<"footer">;

const footerColumns = [
  {
    title: "Solusi",
    links: [
      "Otomatisasi Bisnis",
      "Layanan Cloud",
      "Analitik",
      "Integrasi",
      "Dukungan",
    ],
  },
  {
    title: "Sumber Daya",
    links: ["Dokumentasi", "Studi Kasus", "Blog", "Webinar", "Komunitas"],
  },
  {
    title: "Perusahaan",
    links: ["Tentang Kami", "Karier", "Kontak", "Mitra", "Pers"],
  },
];

const socialIcons = [
  { icon: <Instagram className="h-5 w-5" />, href: "#" },
  { icon: <Twitter className="h-5 w-5" />, href: "#" },
  { icon: <Linkedin className="h-5 w-5" />, href: "#" },
  { icon: <Youtube className="h-5 w-5" />, href: "#" },
];

export default function SiteFooter({ className, ...props }: StickyFooterProps) {
  return (
    <footer
      className={cn(
        "relative bg-muted py-20 min-h-lvh content-center z-50 w-full",
        className
      )}
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      {...props}>
      <div className="fixed z-50 bottom-0 h-full w-full">
        <div className="sticky z-50 overflow-hidden flex flex-col justify-end  h-full container px-5 sm:px-6 lg:px-14">
          <div className="grid border-b pb-8 md:pb-15 grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-4">
            {/* Kolom logo dan deskripsi */}
            <div className="col-span-2 lg:col-span-1">
              <div className="mb-6 md:mb-6 flex items-center space-x-2 group transition-transform">
                {/* Logo lebih kecil dan animasi hover */}
                <div className="size-10 sm:w-5 md:w-8 lg:w-10 transition-transform duration-300 group-hover:scale-105 group-hover:brightness-110">
                  <Logo />
                </div>
              </div>
              <p className="text-foreground/60 text- mb-3 md:mb-6 text-sm md:text-base leading-relaxed">
                Memberdayakan bisnis dengan solusi yang andal, skalabel, dan
                inovatif.
              </p>

              <div className="flex sr-only space-x-4">
                {socialIcons.map((item, i) => (
                  <Link
                    key={i}
                    to={item.href}
                    className="glass-effect hover:bg-primary/10 flex size-5 md:size-10 items-center justify-center rounded-xl transition">
                    {item.icon}
                  </Link>
                ))}
              </div>
            </div>

            {/* Kolom navigasi */}
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h4 className="mb-4 md:text-lg font-semibold">{col.title}</h4>
                <ul className="space-y-2 md:space-y-3">
                  {col.links.map((text) => (
                    <li key={text}>
                      <Link
                        to="/"
                        className="text-foreground/60 text-xs hover:text-foreground transition">
                        {text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Judul besar tengah */}
          <div className="w-full flex items-center justify-center ">
            <h1 className="text-center relative text-[18dvw] lg:text-[12em] font-bold bg-clip-text tracking-tighter bg-linear-to-b to-background text-transparent from-yellow-950/50 select-none">
  
                Sundress
            
            </h1>
          </div>
        </div>
      </div>
    </footer>
  );
}