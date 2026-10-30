"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, Languages, Menu, X } from "lucide-react";

export function Navbar() {
  const { locale, setLocale, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: t.nav.about, href: "#hero" },
    { label: t.nav.experience, href: "#experience" },
    { label: t.nav.projects, href: "#projects" },
    { label: t.nav.achievements, href: "#achievements" },
    { label: t.nav.education, href: "#education" },
    { label: t.nav.whatIDo, href: "#what-i-do" },
    { label: t.nav.skills, href: "#skills" },
    { label: t.nav.contact, href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 dark:bg-[#000000]/95 border-b-2 border-black dark:border-white px-4 md:px-8 py-3 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand Logo with Neo Lime Accent */}
        <a
          href="#hero"
          className="font-black text-xl tracking-tighter flex items-center gap-2 px-3.5 py-1.5 bg-[#E2FF00] text-black border-2 border-black dark:border-white rounded-lg shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] neo-lift-hover"
        >
          <span>Portfolio</span>
        </a>

        {/* Desktop Nav Links with Neo Lime / Indigo Hover */}
        <nav className="hidden lg:flex items-center gap-2">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs font-mono font-black uppercase tracking-wider px-3 py-1.5 bg-[#FFFFFF] dark:bg-[#000000] text-black dark:text-[#FFFFFF] border-2 border-black dark:border-white rounded-md shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] neo-lift-hover hover:bg-[#E2FF00] hover:text-black dark:hover:bg-[#E2FF00] dark:hover:text-black"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Controls: Theme & Language */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            onClick={() => setLocale(locale === "en" ? "id" : "en")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider bg-[#FFFFFF] dark:bg-[#000000] text-black dark:text-[#FFFFFF] border-2 border-black dark:border-white rounded-md shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] neo-lift-hover hover:bg-[#E2FF00] hover:text-black dark:hover:bg-[#E2FF00] dark:hover:text-black"
            aria-label="Toggle language"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{locale.toUpperCase()}</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="group p-1.5 bg-[#FFFFFF] dark:bg-[#000000] border-2 border-black dark:border-white rounded-md shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] neo-lift-hover hover:bg-[#E2FF00] hover:text-black dark:hover:bg-[#E2FF00] dark:hover:text-black"
            aria-label="Toggle color theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-[#FFFFFF] group-hover:text-black transition-colors" />
            ) : (
              <Moon className="w-4 h-4 text-black transition-colors" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 bg-[#FFFFFF] dark:bg-[#000000] text-black dark:text-[#FFFFFF] border-2 border-black dark:border-white rounded-md shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] neo-lift-hover"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t-2 border-black dark:border-white grid grid-cols-2 gap-2">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-mono font-black uppercase tracking-wider px-3 py-2 bg-[#FFFFFF] dark:bg-[#000000] text-black dark:text-[#FFFFFF] border-2 border-black dark:border-white rounded-md shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] neo-lift-hover hover:bg-[#E2FF00] hover:text-black"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
