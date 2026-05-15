import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function PUT(req: NextRequest) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()

  const results = []
  for (const link of data) {
    const updated = await prisma.socialLink.upsert({
      where: { id: link.id },
      update: { url: link.url, labelRu: link.labelRu, labelEn: link.labelEn, isVisible: link.isVisible, order: link.order },
      create: { id: link.id, platform: link.platform, url: link.url, labelRu: link.labelRu || '', labelEn: link.labelEn || '', isVisible: link.isVisible ?? true, order: link.order ?? 0 },
    })
    results.push(updated)
  }

  return NextResponse.json(results)
}