import { prisma } from "@/lib/db"
import ProjectsClient from "./projects-client"

export const metadata = {
  title: "Projects | Timofey Morozov",
}

async function getProjects() {
  return prisma.project.findMany({
    where: { isVisible: true },
    orderBy: { order: 'asc' },
  })
}

export default async function ProjectsPage() {
  const projects = await getProjects()
  return <ProjectsClient projects={projects} />
}