"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Mail, Copy, Check, ArrowUpRight, Globe } from "lucide-react";
import { NeoStamp } from "@/components/NeoBrutalAssets";

interface FooterProps {
  email?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  instagramUrl?: string | null;
}

export function Footer({
  email,
  linkedinUrl,
  githubUrl,
  instagramUrl,
}: FooterProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const contactEmail = email || "husainhasbulah@gmail.com";
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contactEmail)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer
      id="contact"
      className="border-t-4 border-black dark:border-white bg-[#FFFFFF] dark:bg-[#000000] mt-auto"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Main Call to Connect */}
          <div className="md:col-span-8 flex flex-col gap-4">
            <div className="mb-2">
              <NeoStamp
                text="COMMUNICATION DISPATCH"
                color="bg-[#E2FF00]"
                className="text-black"
              />
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-black dark:text-[#FFFFFF]">
              {t.footer.heading}
            </h2>
            <p className="text-base text-[#4A4A4A] dark:text-[#FFFFFF]/85 max-w-[55ch] leading-relaxed">
              {t.footer.subheading}
            </p>

            {/* Email Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={gmailComposeUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-[#FF6B35] text-white font-black uppercase text-sm tracking-wider border-2 border-black dark:border-white rounded-lg shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFFFF] neo-lift-hover flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>{t.footer.emailLabel}</span>
              </a>

              <button
                onClick={handleCopy}
                className="px-5 py-3 bg-[#FFFFFF] dark:bg-[#000000] text-black dark:text-white font-mono font-bold text-xs uppercase tracking-wider border-2 border-black dark:border-white rounded-lg shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFFFF] neo-lift-hover flex items-center gap-2"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-[#E2FF00]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span>{copied ? t.footer.copied : contactEmail}</span>
              </button>
            </div>
          </div>

          {/* Social Channels Strip */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <span className="font-mono font-black text-xs uppercase tracking-wider text-black dark:text-white border-b-2 border-black dark:border-white pb-1">
              CHANNELS
            </span>

            <div className="flex flex-col gap-2.5">
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group p-3 bg-[#FFFFFF] dark:bg-[#000000] text-black dark:text-[#FFFFFF] border-2 border-black dark:border-white rounded-lg shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] font-black text-xs uppercase tracking-wider flex items-center justify-between hover:bg-[#635BFF] hover:text-white dark:hover:bg-[#635BFF] dark:hover:text-white neo-lift-hover"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#635BFF] group-hover:text-white transition-colors duration-200" />{" "}
                    LinkedIn
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}

              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-[#FFFFFF] dark:bg-[#000000] text-black dark:text-[#FFFFFF] border-2 border-black dark:border-white rounded-lg shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] font-black text-xs uppercase tracking-wider flex items-center justify-between hover:bg-[#E2FF00] hover:text-black dark:hover:bg-[#E2FF00] dark:hover:text-black neo-lift-hover"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4" /> GitHub
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}

              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group p-3 bg-[#FFFFFF] dark:bg-[#000000] text-black dark:text-[#FFFFFF] border-2 border-black dark:border-white rounded-lg shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFFFF] font-black text-xs uppercase tracking-wider flex items-center justify-between hover:bg-[#FF6B35] hover:text-white dark:hover:bg-[#FF6B35] dark:hover:text-white neo-lift-hover"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#FF6B35] group-hover:text-white transition-colors duration-200" />
                    Instagram
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t-2 border-black dark:border-white flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono font-bold text-[#4A4A4A] dark:text-[#FFFFFF]/70">
          <span>
            &copy; {new Date().getFullYear()} MAHMUDI HUSAIN HASBULLAH
          </span>
          <span>{t.footer.rights}</span>
        </div>
      </div>
    </footer>
  );
}
