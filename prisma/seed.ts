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
      nameRu: 'Тимофей Морозов',
      nameEn: 'Timofey Morozov',
      roleRu: 'Product Manager, AI энтузиаст, Вибекодер',
      roleEn: 'Product Manager, AI Enthusiast, Vibecoder',
      positioningStatementRu: 'Product Manager, создающий AI-native продукты и быстрые прототипы.',
      positioningStatementEn: 'Product Manager building AI-native products and rapid prototypes.',
      bioRu: 'Я Product Manager с passion к созданию AI-native продуктов и быстрых прототипов. Базируюсь в Москве, работаю на стыке технологий, дизайна и потребностей пользователей.',
      bioEn: "I'm a Product Manager with a passion for building AI-native products and rapid prototypes. Based in Moscow, I've been working on the intersection of technology, design, and user needs.",
      philosophyRu: 'Мой подход к продакт-менеджменту основан на глубоком понимании пользователей. Я верю в методологию Jobs-to-be-Done (JTBD), data-driven решения и итеративную разработку.',
      philosophyEn: 'My approach to product management is rooted in deep user understanding. I believe in Jobs-to-be-Done (JTBD) methodology, data-driven decision making, and iterative development.',
      currentFocusRu: 'Сейчас фокусируюсь на AI-продуктах, вибекодинг прототипов и изучении того, как LLMs могут трансформировать продуктовые процессы.',
      currentFocusEn: 'Currently focused on AI-powered products, vibecoding prototypes, and exploring how LLMs can transform product workflows.',
      interestsRu: 'AI/ML, стартап-экосистемы, продакт-разработка, UX-исследования, автоматизация и создание инструментов, упрощающих жизнь.',
      interestsEn: 'AI/ML, startup ecosystems, product development, UX research, automation, and building tools that make life easier.',
    },
  })

  console.log('Created profile')

  // Create education
  await prisma.education.upsert({
    where: { id: 'hse' },
    update: {},
    create: {
      id: 'hse',
      institutionRu: 'Высшая школа экономики (ВШЭ)',
      institutionEn: 'Higher School of Economics (HSE)',
      degreeRu: 'Бакалавр',
      degreeEn: 'Bachelor',
      fieldRu: 'Экономика и анализ данных',
      fieldEn: 'Economics and Data Analysis',
      startDate: new Date('2022-09-01'),
      isCurrent: true,
      order: 0,
    },
  })

  console.log('Created education')

  // Create languages
  const languages = [
    { id: 'russian', nameRu: 'Русский', nameEn: 'Russian', proficiency: 'Native', order: 0 },
    { id: 'english', nameRu: 'Английский', nameEn: 'English', proficiency: 'B2', order: 1 },
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
      companyRu: 'Стартап-акселератор',
      companyEn: 'Startup Accelerator',
      roleRu: 'Участник',
      roleEn: 'Participant',
      startDate: new Date('2024-01-01'),
      isCurrent: true,
      descriptionRu: 'Отобран в конкурентную программу стартап-акселератора, сфокусированную на AI-продуктах.',
      descriptionEn: 'Selected for a competitive startup accelerator program focused on AI products.',
      highlightsRu: ['Провел JTBD интервью с 50+ потенциальными пользователями', 'Создал быстрые прототипы с использованием AI-инструментов', 'Валидировал продуктовые идеи через user testing'],
      highlightsEn: ['Conducted JTBD interviews with 50+ potential users', 'Built rapid prototypes using AI tools', 'Validated product ideas through user testing'],
      order: 0,
    },
    {
      id: 'product-work',
      companyRu: 'Различные проекты',
      companyEn: 'Various Projects',
      roleRu: 'Product Manager',
      roleEn: 'Product Manager',
      startDate: new Date('2023-01-01'),
      isCurrent: true,
      descriptionRu: 'Работаю над различными продуктовыми инициативами, включая Termeet и VPN Telegram боты.',
      descriptionEn: 'Working on various product initiatives including Termeet and VPN Telegram bots.',
      highlightsRu: ['End-to-end продуктовая разработка', 'User research и аналитика', 'Работа с Jira, Confluence, Miro'],
      highlightsEn: ['End-to-end product development', 'User research and analytics', 'Working with Jira, Confluence, Miro'],
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
      titleRu: 'Termeet',
      titleEn: 'Termeet',
      slug: 'termeet',
      descriptionRu: 'AI-powered планировщик встреч, который помогает командам найти идеальное время для встреч с использованием естественного языка.',
      descriptionEn: 'AI-powered meeting scheduler that helps teams find the perfect time for meetings using natural language.',
      stack: ['AI', 'Python', 'Telegram', 'Product Management'],
      tagsRu: ['AI', 'Product Management', 'Python', 'Telegram'],
      tagsEn: ['AI', 'Product Management', 'Python', 'Telegram'],
      status: 'LIVE',
      featured: true,
      order: 0,
    },
    {
      id: 'guardvpn',
      titleRu: 'GuardVPN Bot',
      titleEn: 'GuardVPN Bot',
      slug: 'guardvpn-bot',
      descriptionRu: 'Telegram бот для управления VPN-сервисом с аутентификацией пользователей и обработкой подписок.',
      descriptionEn: 'Telegram bot for VPN service management with user authentication and subscription handling.',
      stack: ['Telegram Bot', 'Python', 'Product'],
      tagsRu: ['Telegram Bot', 'Python', 'Product'],
      tagsEn: ['Telegram Bot', 'Python', 'Product'],
      status: 'LIVE',
      order: 1,
    },
    {
      id: 'vibecoding',
      titleRu: 'Вибекодинг проекты',
      titleEn: 'Vibecoding Projects',
      slug: 'vibecoding',
      descriptionRu: 'Коллекция быстрых прототипов, созданных с помощью AI-инструментов - исследую границы AI-assisted разработки.',
      descriptionEn: 'Collection of rapid prototypes built with AI tools - exploring the boundaries of AI-assisted development.',
      stack: ['AI Tools', 'Rapid Prototyping', 'Vibecoding'],
      tagsRu: ['AI Tools', 'Rapid Prototyping', 'Vibecoding'],
      tagsEn: ['AI Tools', 'Rapid Prototyping', 'Vibecoding'],
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

  // Create skills
  const skillCategories: Record<string, { ru: string; en: string }[]> = {
    Product: [
      { ru: 'Product Strategy', en: 'Product Strategy' },
      { ru: 'Roadmapping', en: 'Roadmapping' },
      { ru: 'User Research', en: 'User Research' },
      { ru: 'JTBD', en: 'JTBD' },
      { ru: 'Stakeholder Management', en: 'Stakeholder Management' },
      { ru: 'Agile', en: 'Agile' },
    ],
    AI: [
      { ru: 'LLMs', en: 'LLMs' },
      { ru: 'GitHub Copilot', en: 'GitHub Copilot' },
      { ru: 'AI Tools', en: 'AI Tools' },
      { ru: 'ChatGPT', en: 'ChatGPT' },
      { ru: 'Prompt Engineering', en: 'Prompt Engineering' },
      { ru: 'Vibecoding', en: 'Vibecoding' },
    ],
    Analytics: [
      { ru: 'SQL', en: 'SQL' },
      { ru: 'Analytics', en: 'Analytics' },
      { ru: 'Data Analysis', en: 'Data Analysis' },
      { ru: 'User Analytics', en: 'User Analytics' },
      { ru: 'Metrics', en: 'Metrics' },
      { ru: 'A/B Testing', en: 'A/B Testing' },
    ],
    Technical: [
      { ru: 'Python', en: 'Python' },
      { ru: 'Prototyping', en: 'Prototyping' },
      { ru: 'Basic Development', en: 'Basic Development' },
      { ru: 'API Design', en: 'API Design' },
      { ru: 'Technical Writing', en: 'Technical Writing' },
    ],
    Research: [
      { ru: 'JTBD Interviews', en: 'JTBD Interviews' },
      { ru: 'Surveys', en: 'Surveys' },
      { ru: 'Usability Testing', en: 'Usability Testing' },
      { ru: 'Customer Discovery', en: 'Customer Discovery' },
    ],
    Tools: [
      { ru: 'Figma', en: 'Figma' },
      { ru: 'Jira', en: 'Jira' },
      { ru: 'Confluence', en: 'Confluence' },
      { ru: 'Miro', en: 'Miro' },
      { ru: 'Notion', en: 'Notion' },
      { ru: 'Linear', en: 'Linear' },
    ],
  }

  let order = 0
  for (const [category, skills] of Object.entries(skillCategories)) {
    for (const skill of skills) {
      const skillId = skill.en.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
      await prisma.skill.create({
        data: {
          id: skillId,
          nameRu: skill.ru,
          nameEn: skill.en,
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
      titleRu: 'Программа стартап-акселератора',
      titleEn: 'Startup Accelerator Program',
      descriptionRu: 'Отобран в конкурентную программу стартап-акселератора.',
      descriptionEn: 'Selected for a competitive startup accelerator program.',
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
    { id: 'telegram', platform: 'telegram', url: 'https://t.me/username', labelRu: 'Telegram', labelEn: 'Telegram', order: 0 },
    { id: 'github', platform: 'github', url: 'https://github.com/username', labelRu: 'GitHub', labelEn: 'GitHub', order: 1 },
    { id: 'linkedin', platform: 'linkedin', url: 'https://linkedin.com/in/username', labelRu: 'LinkedIn', labelEn: 'LinkedIn', order: 2 },
    { id: 'email', platform: 'email', url: 'mailto:hello@timofey.dev', labelRu: 'Email', labelEn: 'Email', order: 3 },
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