import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const experiencesList = await prisma.experiences.findMany({
      where: type && type !== "all" ? { type: type as any } : undefined,
      include: {
        projects: {
          select: {
            id: true,
            title: true,
            slug: true,
            cover_image_url: true,
            technologies: true,
          },
        },
      },
      orderBy: [{ display_order: "asc" }, { is_current: "desc" }, { start_date: "desc" }],
    });

    return NextResponse.json(experiencesList);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch experiences";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await prisma.experiences.create({
      data: {
        type: body.type,
        organization_name: body.organization_name,
        role_en: body.role_en,
        role_id: body.role_id,
        description_en: body.description_en,
        description_id: body.description_id,
        logo_url: body.logo_url || null,
        media_urls: body.media_urls || [],
        start_date: new Date(body.start_date),
        end_date: body.end_date ? new Date(body.end_date) : null,
        is_current: Boolean(body.is_current),
        location: body.location || null,
        technologies: body.technologies || [],
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create experience";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const updated = await prisma.experiences.update({
      where: { id },
      data: {
        type: data.type,
        organization_name: data.organization_name,
        role_en: data.role_en,
        role_id: data.role_id,
        description_en: data.description_en,
        description_id: data.description_id,
        logo_url: data.logo_url || null,
        media_urls: data.media_urls || [],
        start_date: new Date(data.start_date),
        end_date: data.end_date ? new Date(data.end_date) : null,
        is_current: Boolean(data.is_current),
        location: data.location || null,
        technologies: data.technologies || [],
      },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update experience";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await prisma.experiences.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete experience";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
