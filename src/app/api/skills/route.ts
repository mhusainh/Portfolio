import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const skillsList = await prisma.skill.findMany({
      where: category && category !== "all" ? { category: category as any } : undefined,
      orderBy: [{ display_order: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(skillsList);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch skills";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await prisma.skill.create({
      data: {
        name: body.name,
        category: body.category || "other",
        icon_type: body.icon_type,
        iconUrl: body.iconUrl,
        proficiency_level: body.proficiency_level || null,
        display_order: Number(body.display_order) || 0,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create skill";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const updated = await prisma.skill.update({
      where: { id },
      data: {
        name: data.name,
        category: data.category || "other",
        icon_type: data.icon_type,
        iconUrl: data.iconUrl,
        proficiency_level: data.proficiency_level || null,
        display_order: Number(data.display_order) || 0,
      },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update skill";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await prisma.skill.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete skill";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
