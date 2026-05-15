import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Delete all skills first
  await prisma.skill.deleteMany()
  console.log('Deleted skills')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@timofey.dev' },
    update: {},
    create: {
      email: 'admin@timofey.dev',
      password: hashedPassword,
      name: 'Timofey Morozov',
      role: 'ADMIN',
    },
  })

  console.log('Created admin user:', admin.email)

  // Create profile
  const profile = await prisma.profile.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Тимофей Морозов',
      role: 'Product Manager, AI Enthusiast, Vibecoder',
      positioningStatement: 'Product Manager building AI-native products and rapid prototypes.',
      bio: 'I\'m a Product Manager with a passion for building AI-native products and rapid prototypes. Based in Moscow, I\'ve been working on the intersection of technology, design, and user needs.',
      philosophy: 'My approach to product management is rooted in deep user understanding. I believe in Jobs-to-be-Done (JTBD) methodology, data-driven decision making, and iterative development.',
      currentFocus: 'Currently focused on AI-powered products, vibecoding prototypes, and exploring how LLMs can transform product workflows.',
      interests: 'AI/ML, startup ecosystems, product development, UX research, automation, and building tools that make life easier.',
    },
  })

  console.log('Created profile')

  // Create education
  await prisma.education.upsert({
    where: { id: 'hse' },
    update: {},
    create: {
      id: 'hse',
      institution: 'Higher School of Economics (HSE)',
      degree: 'Bachelor',
      field: 'Economics and Data Analysis',
      startDate: new Date('2022-09-01'),
      isCurrent: true,
      order: 0,
    },
  })

  console.log('Created education')

  // Create languages
  const languages = [
    { id: 'russian', name: 'Russian', proficiency: 'Native', order: 0 },
    { id: 'english', name: 'English', proficiency: 'B2', order: 1 },
  ]

  for (const lang of languages) {
    await prisma.language.upsert({
      where: { id: lang.id },
      update: {},
      create: lang,
    })
  }

  console.log('Created languages')

  // Create experiences
  const experiences = [
    {
      id: 'accelerator',
      company: 'Startup Accelerator',
      role: 'Participant',
      startDate: new Date('2024-01-01'),
      isCurrent: true,
      description: 'Selected for a competitive startup accelerator program focused on AI products.',
      highlights: ['Conducted JTBD interviews with 50+ potential users', 'Built rapid prototypes using AI tools', 'Validated product ideas through user testing'],
      order: 0,
    },
    {
      id: 'product-work',
      company: 'Various Projects',
      role: 'Product Manager',
      startDate: new Date('2023-01-01'),
      isCurrent: true,
      description: 'Working on various product initiatives including Termeet and VPN Telegram bots.',
      highlights: ['End-to-end product development', 'User research and analytics', 'Working with Jira, Confluence, Miro'],
      order: 1,
    },
  ]

  for (const exp of experiences) {
    await prisma.experience.upsert({
      where: { id: exp.id },
      update: {},
      create: exp,
    })
  }

  console.log('Created experiences')

  // Create projects
  const projects = [
    {
      id: 'termeet',
      title: 'Termeet',
      slug: 'termeet',
      description: 'AI-powered meeting scheduler that helps teams find the perfect time for meetings using natural language.',
      stack: ['AI', 'Python', 'Telegram', 'Product Management'],
      tags: ['AI', 'Product Management', 'Python', 'Telegram'],
      status: 'LIVE',
      featured: true,
      order: 0,
    },
    {
      id: 'guardvpn',
      title: 'GuardVPN Bot',
      slug: 'guardvpn-bot',
      description: 'Telegram bot for VPN service management with user authentication and subscription handling.',
      stack: ['Telegram Bot', 'Python', 'Product'],
      tags: ['Telegram Bot', 'Python', 'Product'],
      status: 'LIVE',
      order: 1,
    },
    {
      id: 'vibecoding',
      title: 'Vibecoding Projects',
      slug: 'vibecoding',
      description: 'Collection of rapid prototypes built with AI tools - exploring the boundaries of AI-assisted development.',
      stack: ['AI Tools', 'Rapid Prototyping', 'Vibecoding'],
      tags: ['AI Tools', 'Rapid Prototyping', 'Vibecoding'],
      status: 'LIVE',
      order: 2,
    },
  ]

  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: {},
      create: project,
    })
  }

  console.log('Created projects')

  // Create skills - without duplicates
  const skillCategories: Record<string, string[]> = {
    Product: ['Product Strategy', 'Roadmapping', 'User Research', 'JTBD', 'Stakeholder Management', 'Agile'],
    AI: ['LLMs', 'GitHub Copilot', 'AI Tools', 'ChatGPT', 'Prompt Engineering', 'Vibecoding'],
    Analytics: ['SQL', 'Analytics', 'Data Analysis', 'User Analytics', 'Metrics', 'A/B Testing'],
    Technical: ['Python', 'Prototyping', 'Basic Development', 'API Design', 'Technical Writing'],
    Research: ['JTBD Interviews', 'Surveys', 'Usability Testing', 'Customer Discovery'],
    Tools: ['Figma', 'Jira', 'Confluence', 'Miro', 'Notion', 'Linear'],
  }

  let order = 0
  for (const [category, skills] of Object.entries(skillCategories)) {
    for (const skill of skills) {
      const skillId = skill.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
      await prisma.skill.create({
        data: {
          id: skillId,
          name: skill,
          category,
          order: order++,
        },
      })
    }
  }

  console.log('Created skills')

  // Create achievements
  const achievements = [
    {
      id: 'accelerator-achievement',
      title: 'Startup Accelerator Program',
      description: 'Selected for a competitive startup accelerator program.',
      date: new Date('2024-01-01'),
      type: 'Accelerator',
      order: 0,
    },
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { id: achievement.id },
      update: {},
      create: achievement,
    })
  }

  console.log('Created achievements')

  // Create social links
  const socialLinks = [
    { id: 'telegram', platform: 'telegram', url: 'https://t.me/username', order: 0 },
    { id: 'github', platform: 'github', url: 'https://github.com/username', order: 1 },
    { id: 'linkedin', platform: 'linkedin', url: 'https://linkedin.com/in/username', order: 2 },
    { id: 'email', platform: 'email', url: 'mailto:hello@timofey.dev', order: 3 },
  ]

  for (const link of socialLinks) {
    await prisma.socialLink.upsert({
      where: { id: link.id },
      update: {},
      create: link,
    })
  }

  console.log('Created social links')

  console.log('\n✅ Seed completed!')
  console.log('Admin login: admin@timofey.dev / admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })