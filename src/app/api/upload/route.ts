import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueId = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
    const filename = `${uniqueId}-${safeName}`;

    // Target upload folder in public/
    const uploadDir = join(process.cwd(), "public", "uploads");
    
    try {
      // Ensure directory exists
      await mkdir(uploadDir, { recursive: true });

      // Write file to disk
      const filePath = join(uploadDir, filename);
      await writeFile(filePath, buffer);

      // Return the public access URL
      const url = `/uploads/${filename}`;
      return NextResponse.json({ url });
    } catch (fsError) {
      console.warn("Local filesystem write failed, falling back to base64 Data URL format:", fsError);
      
      // Fallback: Convert directly to base64 data URL
      const base64Data = buffer.toString("base64");
      const url = `data:${file.type || "image/png"};base64,${base64Data}`;
      return NextResponse.json({ url });
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 });
  }
}
