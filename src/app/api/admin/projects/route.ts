import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()
  
  const projectId = (data.titleRu || data.titleEn || 'project').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
  
  const project = await prisma.project.create({
    data: {
      id: projectId,
      slug: projectId,
      titleRu: data.titleRu || '',
      titleEn: data.titleEn || '',
      descriptionRu: data.descriptionRu || '',
      descriptionEn: data.descriptionEn || '',
      stack: data.stack || [],
      tagsRu: data.tagsRu || [],
      tagsEn: data.tagsEn || [],
      status: data.status || 'DRAFT',
      featured: data.featured || false,
      order: 999,
    },
  })

  return NextResponse.json(project)
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()

  const results = []
  for (const project of data) {
    const updated = await prisma.project.upsert({
      where: { id: project.id },
      update: { 
        titleRu: project.titleRu, 
        titleEn: project.titleEn,
        descriptionRu: project.descriptionRu, 
        descriptionEn: project.descriptionEn,
        stack: project.stack || [], 
        tagsRu: project.tagsRu || [], 
        tagsEn: project.tagsEn || [],
        status: project.status, 
        featured: project.featured,
        order: project.order, 
        isVisible: project.isVisible 
      },
      create: { 
        id: project.id, 
        slug: project.id,
        titleRu: project.titleRu || '', 
        titleEn: project.titleEn || '',
        descriptionRu: project.descriptionRu || '', 
        descriptionEn: project.descriptionEn || '',
        stack: project.stack || [], 
        tagsRu: project.tagsRu || [], 
        tagsEn: project.tagsEn || [],
        status: project.status || 'DRAFT', 
        featured: project.featured || false,
        order: project.order ?? 0, 
        isVisible: project.isVisible ?? true 
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

  await prisma.project.delete({ where: { id } })

  return NextResponse.json({ success: true })
}