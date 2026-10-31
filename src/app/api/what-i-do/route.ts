import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const list = await prisma.what_i_do.findMany({
      orderBy: [{ display_order: "asc" }, { created_at: "asc" }],
    });
    return NextResponse.json(list);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch what_i_do";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await prisma.what_i_do.create({
      data: {
        title_en: body.title_en,
        title_id: body.title_id,
        description_en: body.description_en || null,
        description_id: body.description_id || null,
        display_order: Number(body.display_order) || 0,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create what_i_do";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const updated = await prisma.what_i_do.update({
      where: { id },
      data: {
        title_en: data.title_en,
        title_id: data.title_id,
        description_en: data.description_en || null,
        description_id: data.description_id || null,
        display_order: Number(data.display_order) || 0,
      },
    });
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update what_i_do";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await prisma.what_i_do.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete what_i_do";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
