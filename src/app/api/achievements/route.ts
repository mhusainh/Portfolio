import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");

    const achievements = await prisma.achievements.findMany({
      where: featured === "true" ? { is_featured: true } : undefined,
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
            cover_image_url: true,
            technologies: true,
          },
        },
      },
      orderBy: [{ display_order: "asc" }, { issue_date: "desc" }],
    });

    return NextResponse.json(achievements);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch achievements";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await prisma.achievements.create({
      data: {
        project_id: body.project_id || null,
        title_en: body.title_en,
        title_id: body.title_id,
        issuer: body.issuer,
        issue_date: new Date(body.issue_date),
        description_en: body.description_en || null,
        description_id: body.description_id || null,
        certificate_url: body.certificate_url || null,
        credential_url: body.credential_url || null,
        is_featured: Boolean(body.is_featured ?? true),
        display_order: Number(body.display_order) || 0,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
            cover_image_url: true,
            technologies: true,
          },
        },
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create achievement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const updated = await prisma.achievements.update({
      where: { id },
      data: {
        project_id: data.project_id || null,
        title_en: data.title_en,
        title_id: data.title_id,
        issuer: data.issuer,
        issue_date: new Date(data.issue_date),
        description_en: data.description_en || null,
        description_id: data.description_id || null,
        certificate_url: data.certificate_url || null,
        credential_url: data.credential_url || null,
        is_featured: Boolean(data.is_featured ?? true),
        display_order: Number(data.display_order) || 0,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
            cover_image_url: true,
            technologies: true,
          },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update achievement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await prisma.achievements.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete achievement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
