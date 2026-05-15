import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()
  
  const experience = await prisma.experience.create({
    data: {
      companyRu: data.companyRu || '',
      companyEn: data.companyEn || '',
      roleRu: data.roleRu || '',
      roleEn: data.roleEn || '',
      descriptionRu: data.descriptionRu || '',
      descriptionEn: data.descriptionEn || '',
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      isCurrent: data.isCurrent || false,
      highlightsRu: data.highlightsRu || [],
      highlightsEn: data.highlightsEn || [],
      order: 999,
    },
  })

  return NextResponse.json(experience)
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()

  const results = []
  for (const exp of data) {
    const updated = await prisma.experience.upsert({
      where: { id: exp.id },
      update: { 
        companyRu: exp.companyRu, 
        companyEn: exp.companyEn,
        roleRu: exp.roleRu, 
        roleEn: exp.roleEn,
        descriptionRu: exp.descriptionRu, 
        descriptionEn: exp.descriptionEn,
        startDate: new Date(exp.startDate),
        endDate: exp.endDate ? new Date(exp.endDate) : null,
        isCurrent: exp.isCurrent,
        highlightsRu: exp.highlightsRu || [], 
        highlightsEn: exp.highlightsEn || [],
        order: exp.order, 
        isVisible: exp.isVisible 
      },
      create: { 
        companyRu: exp.companyRu || '', 
        companyEn: exp.companyEn || '',
        roleRu: exp.roleRu || '', 
        roleEn: exp.roleEn || '',
        descriptionRu: exp.descriptionRu || '', 
        descriptionEn: exp.descriptionEn || '',
        startDate: new Date(exp.startDate),
        endDate: exp.endDate ? new Date(exp.endDate) : null,
        isCurrent: exp.isCurrent || false,
        highlightsRu: exp.highlightsRu || [], 
        highlightsEn: exp.highlightsEn || [],
        order: exp.order ?? 0, 
        isVisible: exp.isVisible ?? true 
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

  await prisma.experience.delete({ where: { id } })

  return NextResponse.json({ success: true })
}