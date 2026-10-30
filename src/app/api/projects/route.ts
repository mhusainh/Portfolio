import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");

    const projectsList = await prisma.project.findMany({
      where: featured === "true" ? { isFeatured: true } : undefined,
      include: {
        experiences: {
          select: {
            id: true,
            organization_name: true,
            role_en: true,
            role_id: true,
            type: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projectsList);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch projects";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await prisma.project.create({
      data: {
        experience_id: body.experience_id || null,
        title: body.title,
        slug: body.slug,
        description_en: body.description_en,
        description_id: body.description_id,
        cover_image_url: body.cover_image_url,
        gallery_urls: body.gallery_urls || [],
        technologies: body.technologies || [],
        project_url: body.project_url || null,
        repository_url: body.repository_url || null,
        isFeatured: Boolean(body.isFeatured),
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const updated = await prisma.project.update({
      where: { id },
      data: {
        experience_id: data.experience_id || null,
        title: data.title,
        slug: data.slug,
        description_en: data.description_en,
        description_id: data.description_id,
        cover_image_url: data.cover_image_url,
        gallery_urls: data.gallery_urls || [],
        technologies: data.technologies || [],
        project_url: data.project_url || null,
        repository_url: data.repository_url || null,
        isFeatured: Boolean(data.isFeatured),
      },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
