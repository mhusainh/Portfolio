import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { DynamicSections } from "@/components/DynamicSections";
import { GlobalBackgroundShapes } from "@/components/GlobalBackgroundShapes";

// Ultra-fast dynamic page rendering
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // PRIORITY: Fetch ONLY Hero profile on the server with try/catch fallback
  // If database connection briefly hangs or exhausts pool, page still renders cleanly!
  let profile = null;
  try {
    profile = await prisma.profile.findFirst({
      orderBy: { updatedAt: "desc" },
    });
  } catch (error) {
    console.error("HomePage profile fetch error:", error);
  }

  return (
    <>
      <Navbar />
      <div className="relative w-full flex-1 flex flex-col">
        <GlobalBackgroundShapes />
        <main className="flex-1 flex flex-col w-full relative z-10">
          {/* 1. Hero renders instantly from the initial HTML */}
          <Hero profile={profile} />

          {/* 2. Progressive Sections in exact requested sequence:
                 Experience -> Projects -> Achievements -> Education -> What I Do -> Skills */}
          <DynamicSections
            whatIDoEn={profile?.what_i_do_en || []}
            whatIDoId={profile?.what_i_do_id || []}
          />
        </main>
        <Footer
          email={profile?.email}
          linkedinUrl={profile?.linkedin_url}
          githubUrl={profile?.github_url}
          instagramUrl={profile?.instagram_url}
        />
      </div>
    </>
  );
}
