import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()
  
  const achievementId = (data.titleRu || data.titleEn || 'achievement').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
  
  const achievement = await prisma.achievement.create({
    data: {
      id: achievementId,
      titleRu: data.titleRu || '',
      titleEn: data.titleEn || '',
      descriptionRu: data.descriptionRu || '',
      descriptionEn: data.descriptionEn || '',
      date: new Date(data.date),
      type: data.type || 'Achievement',
      url: data.url || '',
      order: 999,
    },
  })

  return NextResponse.json(achievement)
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()

  const results = []
  for (const ach of data) {
    const updated = await prisma.achievement.upsert({
      where: { id: ach.id },
      update: { 
        titleRu: ach.titleRu, 
        titleEn: ach.titleEn,
        descriptionRu: ach.descriptionRu, 
        descriptionEn: ach.descriptionEn,
        date: new Date(ach.date),
        type: ach.type,
        url: ach.url,
        order: ach.order, 
        isVisible: ach.isVisible 
      },
      create: { 
        id: ach.id,
        titleRu: ach.titleRu || '', 
        titleEn: ach.titleEn || '',
        descriptionRu: ach.descriptionRu || '', 
        descriptionEn: ach.descriptionEn || '',
        date: new Date(ach.date),
        type: ach.type || 'Achievement',
        url: ach.url || '',
        order: ach.order ?? 0, 
        isVisible: ach.isVisible ?? true 
      },
    })
    results.push(updated)
  }

  return NextResponse.json(results)
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  await prisma.achievement.delete({ where: { id } })

  return NextResponse.json({ success: true })
}