import { prisma } from "@/lib/db"
import ExperienceClient from "./experience-client"

export const metadata = {
  title: "Experience | Timofey Morozov",
}

async function getExperiences() {
  return prisma.experience.findMany({
    where: { isVisible: true },
    orderBy: { order: 'asc' },
  })
}

export default async function ExperiencePage() {
  const experiences = await getExperiences()
  return <ExperienceClient experiences={experiences} />
}