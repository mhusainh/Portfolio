import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst({
      select: { resume_url: true, fullName: true },
    });

    if (!profile?.resume_url) {
      return new NextResponse("Resume file not found", { status: 404 });
    }

    const url = profile.resume_url;

    // If it's a Cloudinary URL, fetch and stream cleanly
    const response = await fetch(url);
    if (response.ok) {
      const buffer = await response.arrayBuffer();
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${encodeURIComponent(profile.fullName || "Resume")}.pdf"`,
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    // Fallback: If 401 or restricted, generate signed URL and redirect
    if (url.includes("cloudinary.com")) {
      const match = url.match(/(?:raw|image)\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
      if (match && match[1]) {
        const publicId = match[1];
        const isRaw = url.includes("/raw/upload");
        const signedUrl = cloudinary.utils.url(publicId, {
          resource_type: isRaw ? "raw" : "image",
          sign_url: true,
          secure: true,
        });

        const signedRes = await fetch(signedUrl);
        if (signedRes.ok) {
          const buffer = await signedRes.arrayBuffer();
          return new NextResponse(buffer, {
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `inline; filename="${encodeURIComponent(profile.fullName || "Resume")}.pdf"`,
            },
          });
        }
        return NextResponse.redirect(signedUrl);
      }
    }

    return NextResponse.redirect(url);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error serving resume";
    return new NextResponse(message, { status: 500 });
  }
}
