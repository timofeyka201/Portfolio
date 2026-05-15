import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lang = searchParams.get('lang') || 'ru'

  const profile = await prisma.profile.findFirst()
  const experiences = await prisma.experience.findMany({ 
    where: { isVisible: true },
    orderBy: { order: 'asc' }
  })
  const projects = await prisma.project.findMany({ 
    where: { isVisible: true },
    orderBy: { order: 'asc' }
  })
  const skills = await prisma.skill.findMany({ 
    where: { isVisible: true },
    orderBy: { order: 'asc' }
  })
  const achievements = await prisma.achievement.findMany({ 
    where: { isVisible: true },
    orderBy: { order: 'asc' }
  })
  const socialLinks = await prisma.socialLink.findMany({ 
    where: { isVisible: true },
    orderBy: { order: 'asc' }
  })
  const education = await prisma.education.findMany({ 
    where: { isVisible: true },
    orderBy: { order: 'asc' }
  })
  const languages = await prisma.language.findMany({ 
    where: { isVisible: true },
    orderBy: { order: 'asc' }
  })
  const siteSettings = await prisma.siteSettings.findMany()

  const settings = siteSettings.reduce((acc, s) => {
    acc[s.key] = s.value
    return acc
  }, {} as Record<string, string>)

  const getLocalizedField = (item: any, field: string, lang: string) => {
    const ruField = item[`${field}Ru`]
    const enField = item[`${field}En`]
    return lang === 'en' ? (enField || ruField || '') : (ruField || enField || '')
  }

  const localizedProfile = profile ? {
    ...profile,
    name: lang === 'en' ? (profile.nameEn || profile.nameRu || '') : (profile.nameRu || profile.nameEn || ''),
    role: lang === 'en' ? (profile.roleEn || profile.roleRu || '') : (profile.roleRu || profile.roleEn || ''),
    positioningStatement: lang === 'en' ? (profile.positioningStatementEn || profile.positioningStatementRu || '') : (profile.positioningStatementRu || profile.positioningStatementEn || ''),
    bio: lang === 'en' ? (profile.bioEn || profile.bioRu || '') : (profile.bioRu || profile.bioEn || ''),
    philosophy: lang === 'en' ? (profile.philosophyEn || profile.philosophyRu || '') : (profile.philosophyRu || profile.philosophyEn || ''),
    currentFocus: lang === 'en' ? (profile.currentFocusEn || profile.currentFocusRu || '') : (profile.currentFocusRu || profile.currentFocusEn || ''),
    interests: lang === 'en' ? (profile.interestsEn || profile.interestsRu || '') : (profile.interestsRu || profile.interestsEn || ''),
  } : null

  const localizedExperiences = experiences.map(exp => ({
    ...exp,
    company: getLocalizedField(exp, 'company', lang),
    role: getLocalizedField(exp, 'role', lang),
    location: getLocalizedField(exp, 'location', lang),
    description: getLocalizedField(exp, 'description', lang),
    highlights: lang === 'en' ? (exp.highlightsEn || exp.highlightsRu || []) : (exp.highlightsRu || exp.highlightsEn || []),
  }))

  const localizedProjects = projects.map(proj => ({
    ...proj,
    title: getLocalizedField(proj, 'title', lang),
    description: getLocalizedField(proj, 'description', lang),
    longDescription: getLocalizedField(proj, 'longDescription', lang),
    tags: lang === 'en' ? (proj.tagsEn || proj.tagsRu || []) : (proj.tagsRu || proj.tagsEn || []),
  }))

  const localizedSkills = skills.map(skill => ({
    ...skill,
    name: getLocalizedField(skill, 'name', lang),
  }))

  const localizedAchievements = achievements.map(ach => ({
    ...ach,
    title: getLocalizedField(ach, 'title', lang),
    description: getLocalizedField(ach, 'description', lang),
  }))

  const localizedSocialLinks = socialLinks.map(link => ({
    ...link,
    platform: getLocalizedField(link, 'label', lang) || link.platform,
  }))

  const localizedEducation = education.map(edu => ({
    ...edu,
    institution: getLocalizedField(edu, 'institution', lang),
    degree: getLocalizedField(edu, 'degree', lang),
    field: getLocalizedField(edu, 'field', lang),
    description: getLocalizedField(edu, 'description', lang),
  }))

  const localizedLanguages = languages.map(langItem => ({
    ...langItem,
    name: getLocalizedField(langItem, 'name', lang),
  }))

  return NextResponse.json({
    profile: localizedProfile,
    experiences: localizedExperiences,
    projects: localizedProjects,
    skills: localizedSkills,
    achievements: localizedAchievements,
    socialLinks: localizedSocialLinks,
    education: localizedEducation,
    languages: localizedLanguages,
    settings,
    currentLang: lang,
  })
}