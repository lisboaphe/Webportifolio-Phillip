import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { hasResumeAccess } from "@/lib/server/resume-access";

export const dynamic = "force-dynamic";

const files: Record<string, string> = {
  en: "phillip-lisboa-cv-en.pdf",
  de: "phillip-lisboa-cv-de.pdf",
};

/** Serves the résumé PDF only to visitors who unlocked it with the password. */
export async function GET(_request: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const file = files[lang];
  if (!file) return new NextResponse("Not found", { status: 404 });
  if (!(await hasResumeAccess())) return new NextResponse("Password required", { status: 401 });

  const pdf = await readFile(path.join(process.cwd(), "private", "cv", file));
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${file}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
