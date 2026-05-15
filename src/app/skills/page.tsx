import { prisma } from "@/lib/db"
import SkillsClient from "./skills-client"

export const metadata = {
  title: "Skills | Timofey Morozov",
}

async function getSkills() {
  return prisma.skill.findMany({
    where: { isVisible: true },
    orderBy: { order: 'asc' },
  })
}

export default async function SkillsPage() {
  const skills = await getSkills()
  return <SkillsClient skills={skills} />
}