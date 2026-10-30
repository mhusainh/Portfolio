import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst({
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(profile);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const existing = await prisma.profile.findFirst();

    if (existing) {
      const updated = await prisma.profile.update({
        where: { id: existing.id },
        data: {
          fullName: body.fullName,
          title_en: body.title_en,
          title_id: body.title_id,
          bio_en: body.bio_en,
          bio_id: body.bio_id,
          what_i_do_en: body.what_i_do_en || [],
          what_i_do_id: body.what_i_do_id || [],
          avatar_url: body.avatar_url,
          resume_url: body.resume_url,
          email: body.email,
          linkedin_url: body.linkedin_url,
          github_url: body.github_url,
          instagram_url: body.instagram_url,
        },
      });
      return NextResponse.json(updated);
    }

    const created = await prisma.profile.create({
      data: {
        fullName: body.fullName,
        title_en: body.title_en,
        title_id: body.title_id,
        bio_en: body.bio_en,
        bio_id: body.bio_id,
        what_i_do_en: body.what_i_do_en || [],
        what_i_do_id: body.what_i_do_id || [],
        avatar_url: body.avatar_url,
        resume_url: body.resume_url,
        email: body.email,
        linkedin_url: body.linkedin_url,
        github_url: body.github_url,
        instagram_url: body.instagram_url,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
