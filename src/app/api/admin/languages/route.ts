import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()
  
  const langId = (data.nameRu || data.nameEn || 'language').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
  
  const language = await prisma.language.create({
    data: {
      id: langId,
      nameRu: data.nameRu || '',
      nameEn: data.nameEn || '',
      proficiency: data.proficiency || '',
      order: 999,
    },
  })

  return NextResponse.json(language)
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()

  const results = []
  for (const lang of data) {
    const updated = await prisma.language.upsert({
      where: { id: lang.id },
      update: { 
        nameRu: lang.nameRu,
        nameEn: lang.nameEn,
        proficiency: lang.proficiency,
        order: lang.order, 
        isVisible: lang.isVisible 
      },
      create: { 
        id: lang.id,
        nameRu: lang.nameRu || '', 
        nameEn: lang.nameEn || '',
        proficiency: lang.proficiency || '',
        order: lang.order ?? 0, 
        isVisible: lang.isVisible ?? true 
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

  await prisma.language.delete({ where: { id } })

  return NextResponse.json({ success: true })
}