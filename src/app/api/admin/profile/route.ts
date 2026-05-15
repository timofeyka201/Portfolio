import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function PUT(req: NextRequest) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()

  const existingProfile = await prisma.profile.findFirst()

  if (existingProfile) {
    const updated = await prisma.profile.update({
      where: { id: existingProfile.id },
      data: {
        nameRu: data.nameRu || '',
        nameEn: data.nameEn || '',
        roleRu: data.roleRu || '',
        roleEn: data.roleEn || '',
        positioningStatementRu: data.positioningStatementRu || '',
        positioningStatementEn: data.positioningStatementEn || '',
        bioRu: data.bioRu || '',
        bioEn: data.bioEn || '',
        currentFocusRu: data.currentFocusRu || '',
        currentFocusEn: data.currentFocusEn || '',
      },
    })
    return NextResponse.json(updated)
  } else {
    const created = await prisma.profile.create({
      data: {
        nameRu: data.nameRu || '',
        nameEn: data.nameEn || '',
        roleRu: data.roleRu || '',
        roleEn: data.roleEn || '',
        positioningStatementRu: data.positioningStatementRu || '',
        positioningStatementEn: data.positioningStatementEn || '',
        bioRu: data.bioRu || '',
        bioEn: data.bioEn || '',
        currentFocusRu: data.currentFocusRu || '',
        currentFocusEn: data.currentFocusEn || '',
      },
    })
    return NextResponse.json(created)
  }
}

export async function GET(req: NextRequest) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const profile = await prisma.profile.findFirst()
  return NextResponse.json(profile)
}