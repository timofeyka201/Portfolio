import { Metadata } from "next"
import { prisma } from "@/lib/db"
import ContactClient from "./contact-client"

export const metadata: Metadata = {
  title: "Contact | Timofey Morozov",
  description: "Get in touch - Telegram, Email, GitHub, LinkedIn.",
}

async function getSocialLinks() {
  return prisma.socialLink.findMany({
    where: { isVisible: true },
    orderBy: { order: 'asc' },
  })
}

export default async function ContactPage() {
  const socialLinks = await getSocialLinks()
  return <ContactClient socialLinks={socialLinks} />
}