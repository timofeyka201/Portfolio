import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()
  
  const educationId = (data.institutionRu || 'education').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
  
  const education = await prisma.education.create({
    data: {
      id: educationId,
      institutionRu: data.institutionRu || '',
      institutionEn: data.institutionEn || '',
      degreeRu: data.degreeRu || '',
      degreeEn: data.degreeEn || '',
      fieldRu: data.fieldRu || '',
      fieldEn: data.fieldEn || '',
      startDate: new Date(data.startDate),
      isCurrent: data.isCurrent || false,
      order: 999,
    },
  })

  return NextResponse.json(education)
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()

  const results = []
  for (const edu of data) {
    const updated = await prisma.education.upsert({
      where: { id: edu.id },
      update: { 
        institutionRu: edu.institutionRu,
        institutionEn: edu.institutionEn,
        degreeRu: edu.degreeRu,
        degreeEn: edu.degreeEn,
        fieldRu: edu.fieldRu,
        fieldEn: edu.fieldEn,
        startDate: new Date(edu.startDate),
        endDate: edu.endDate ? new Date(edu.endDate) : null,
        isCurrent: edu.isCurrent,
        order: edu.order, 
        isVisible: edu.isVisible 
      },
      create: { 
        id: edu.id,
        institutionRu: edu.institutionRu || '', 
        institutionEn: edu.institutionEn || '',
        degreeRu: edu.degreeRu || '', 
        degreeEn: edu.degreeEn || '',
        fieldRu: edu.fieldRu || '', 
        fieldEn: edu.fieldEn || '',
        startDate: new Date(edu.startDate),
        endDate: edu.endDate ? new Date(edu.endDate) : null,
        isCurrent: edu.isCurrent || false,
        order: edu.order ?? 0, 
        isVisible: edu.isVisible ?? true 
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

  await prisma.education.delete({ where: { id } })

  return NextResponse.json({ success: true })
}