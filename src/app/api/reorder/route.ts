import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { entity, items } = await request.json();

    if (!entity || !Array.isArray(items)) {
      return NextResponse.json({ error: "entity and items array required" }, { status: 400 });
    }

    // items is an array of { id: string, display_order: number }
    // Run all updates in a transaction for speed and atomicity
    const updatePromises = items.map((item, index) => {
      const order = typeof item.display_order === "number" ? item.display_order : index;

      switch (entity) {
        case "skills":
          return prisma.skill.update({
            where: { id: item.id },
            data: { display_order: order },
          });
        case "projects":
          return prisma.project.update({
            where: { id: item.id },
            data: { display_order: order },
          });
        case "experiences":
          return prisma.experiences.update({
            where: { id: item.id },
            data: { display_order: order },
          });
        case "achievements":
          return prisma.achievements.update({
            where: { id: item.id },
            data: { display_order: order },
          });
        case "education":
          return prisma.education.update({
            where: { id: item.id },
            data: { display_order: order },
          });
        default:
          throw new Error(`Unsupported entity: ${entity}`);
      }
    });

    await prisma.$transaction(updatePromises);

    return NextResponse.json({ success: true, count: items.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to reorder items";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
