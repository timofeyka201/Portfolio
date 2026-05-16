import { Metadata } from "next"
import { prisma } from "@/lib/db"
import AchievementsClient from "./achievements-client"

export const metadata: Metadata = {
  title: "Achievements | Timofey Morozov",
  description: "Awards, competitions, and achievements.",
}

async function getAchievements() {
  return prisma.achievement.findMany({
    where: { isVisible: true },
    orderBy: { order: 'asc' },
  })
}

export default async function AchievementsPage() {
  const achievements = await getAchievements()
  return <AchievementsClient achievements={achievements} />
}