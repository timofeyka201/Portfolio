import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { nameRu, nameEn, category } = await req.json()
  
  const skillId = (nameRu || nameEn || 'skill').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
  
  const skill = await prisma.skill.create({
    data: {
      id: skillId,
      nameRu: nameRu || '',
      nameEn: nameEn || '',
      category,
      order: 999,
    },
  })

  return NextResponse.json(skill)
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()

  const results = []
  for (const skill of data) {
    const updated = await prisma.skill.upsert({
      where: { id: skill.id },
      update: { nameRu: skill.nameRu, nameEn: skill.nameEn, category: skill.category, order: skill.order, isVisible: skill.isVisible },
      create: { id: skill.id, nameRu: skill.nameRu || '', nameEn: skill.nameEn || '', category: skill.category, order: skill.order ?? 0, isVisible: skill.isVisible ?? true },
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

  await prisma.skill.delete({ where: { id } })

  return NextResponse.json({ success: true })
}