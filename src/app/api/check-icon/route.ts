import { NextResponse } from "next/server";
import { checkIconCandidate } from "@/lib/icon-checker";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name || name.trim().length === 0) {
    return NextResponse.json({ error: "Skill name query required" }, { status: 400 });
  }

  const result = await checkIconCandidate(name);
  if (!result) {
    return NextResponse.json({ found: false, message: "Icon not found in CDN" }, { status: 404 });
  }

  return NextResponse.json({ found: true, ...result });
}
