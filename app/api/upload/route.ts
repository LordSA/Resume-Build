// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req: NextRequest) {
  try {
    const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
    const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
    const publicUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL;

    if (!accessKeyId || !secretAccessKey || !endpoint || !bucketName) {
      return NextResponse.json(
        { error: "Cloudflare R2 credentials are not fully configured in environment variables" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const s3 = new S3Client({
      region: "auto",
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    // Make sure we have a clean filename ending with .webp
    const originalName = file.name.replace(/\.[^/.]+$/, "");
    const cleanName = `${originalName.replace(/[^a-zA-Z0-9]/g, "-")}.webp`;
    const key = `photos/${Date.now()}-${cleanName}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: "image/webp",
      })
    );

    const fileUrl = publicUrl
      ? `${publicUrl.replace(/\/$/, "")}/${key}`
      : `${endpoint.replace(/\/$/, "")}/${bucketName}/${key}`;

    return NextResponse.json({ url: fileUrl });
  } catch (err: any) {
    console.error("R2 Upload Error:", err);
    return NextResponse.json({ error: err.message || "Failed to upload file" }, { status: 500 });
  }
}
