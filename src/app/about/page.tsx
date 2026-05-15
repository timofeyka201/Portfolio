import { prisma } from "@/lib/db"
import Link from "next/link"
import AboutClient from "./about-client"

export const metadata = {
  title: "About | Timofey Morozov",
}

async function getData() {
  const profile = await prisma.profile.findFirst()
  const education = await prisma.education.findMany({
    where: { isVisible: true },
    orderBy: { order: 'asc' },
  })
  const languages = await prisma.language.findMany({
    where: { isVisible: true },
    orderBy: { order: 'asc' },
  })
  return { profile, education, languages }
}

export default async function AboutPage() {
  const data = await getData()
  return <AboutClient data={data} />
}