import { prisma } from "@/lib/db"
import HomeClient from "./home-client"

async function getData() {
  const profile = await prisma.profile.findFirst()
  const projects = await prisma.project.findMany({ 
    where: { isVisible: true },
    orderBy: { order: 'asc' },
  })
  const socialLinks = await prisma.socialLink.findMany({ 
    where: { isVisible: true },
    orderBy: { order: 'asc' }
  })
  
  return { profile, projects, socialLinks }
}

export default async function Home() {
  const data = await getData()
  return <HomeClient data={data} />
}