import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const educationList = await prisma.education.findMany({
      orderBy: [{ isCurrent: "desc" }, { startDate: "desc" }],
    });
    return NextResponse.json(educationList);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch education";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await prisma.education.create({
      data: {
        institution: body.institution,
        degreeEn: body.degreeEn,
        degreeId: body.degreeId,
        fieldOfStudyEn: body.fieldOfStudyEn,
        fieldOfStudyId: body.fieldOfStudyId,
        descriptionEn: body.descriptionEn || null,
        descriptionId: body.descriptionId || null,
        logoUrl: body.logoUrl || null,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        isCurrent: Boolean(body.isCurrent),
        scoreGpa: body.scoreGpa || null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create education";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const updated = await prisma.education.update({
      where: { id },
      data: {
        institution: data.institution,
        degreeEn: data.degreeEn,
        degreeId: data.degreeId,
        fieldOfStudyEn: data.fieldOfStudyEn,
        fieldOfStudyId: data.fieldOfStudyId,
        descriptionEn: data.descriptionEn || null,
        descriptionId: data.descriptionId || null,
        logoUrl: data.logoUrl || null,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        isCurrent: Boolean(data.isCurrent),
        scoreGpa: data.scoreGpa || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update education";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await prisma.education.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete education";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
