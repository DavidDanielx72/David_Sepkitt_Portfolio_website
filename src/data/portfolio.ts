export const personal = {
  age: '20 years old',
  location: 'Cape Town, Western Cape',
  languages: 'English, Afrikaans',
  license: "Driver's License: No",
}

export const interests = ['Artificial Intelligence', 'Music', 'Technology']

export const carouselTech = [
  { label: 'Java', group: 'Programming' },
  { label: 'JavaScript', group: 'Programming' },
  { label: 'TypeScript', group: 'Programming' },
  { label: 'HTML5', group: 'Programming' },
  { label: 'CSS3', group: 'Programming' },
  { label: 'C++', group: 'Programming' },
  { label: 'React', group: 'Frameworks & Tools' },
  { label: 'WordPress', group: 'Frameworks & Tools' },
  { label: 'GitHub', group: 'Frameworks & Tools' },
  { label: 'Visual Studio Code', group: 'Frameworks & Tools' },
  { label: 'IntelliJ IDEA', group: 'Frameworks & Tools' },
  { label: 'Figma', group: 'Frameworks & Tools' },
  { label: 'UI/UX Design', group: 'Design' },
  { label: 'SQL', group: 'Data & Backend' },
  { label: 'Supabase', group: 'Data & Backend' },
  { label: 'Database Design', group: 'Data & Backend' },
]

export const links = {
  github: 'https://github.com/DavidDanielx72',
  linkedin: 'https://www.linkedin.com/in/david-sepkitt-811837362/',
  email: 'mailto:davidsepkitt@gmail.com',
  emailAddress: 'davidsepkitt@gmail.com',
}

export const skills = [
  { icon: 'code', title: 'Programming', desc: 'Clean, efficient code across multiple languages and paradigms.', tags: ['Java', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'C++ (Basic)'] },
  { icon: 'layers', title: 'Frameworks & Tools', desc: 'Component-driven interfaces and source control.', tags: ['React', 'WordPress', 'GitHub', 'Visual Studio Code', 'IntelliJ IDEA', 'Figma'] },
  { icon: 'database', title: 'Data & Backend', desc: 'Schema design and database integration for app data.', tags: ['SQL', 'Supabase', 'Database Design'] },
  { icon: 'brain', title: 'Soft Skills', desc: 'Collaboration and continuous learning.', tags: ['Problem-solving', 'Teamwork', 'Adaptability', 'Attention to Detail'] },
]

export type Project = {
  id: string
  title: string
  tag: string
  icon: string
  stack: string[]
  desc: string
  link: string
  demo?: string
}

export const projects: Project[] = [
  {
    id: 'careerpilot',
    title: 'CareerPilot AI',
    tag: 'AI \u00b7 Full Stack',
    icon: 'sparkles',
    stack: ['React', 'AI', 'JavaScript', 'Supabase'],
    desc: 'An intelligent AI-powered career assistant that helps users create stronger, more professional CVs. CareerPilot analyses, improves, and generates CV content tailored to today\u2019s job market \u2014 offering personalised suggestions that help any CV stand out.',
    link: 'https://github.com/DavidDanielx72/Careerpilot_AI',
    demo: 'https://aspire-ai-assistant.lovable.app/',
  },
  {
    id: 'ubuntu',
    title: 'Ubuntu Navigator AI Chatbot',
    tag: 'AI \u00b7 Conversational',
    icon: 'globe',
    stack: ['AI', 'NLP', '11 SA Languages', 'Location'],
    desc: 'An AI-powered conversational assistant for SASSA, Home Affairs, and City of Cape Town services. Supports all 11 official South African languages, answers questions in the user\u2019s language, and helps users find nearby Home Affairs offices by location.',
    link: 'https://github.com/DavidDanielx72/Ubuntu-Navigator-AI-Chatbot-',
    demo: 'https://cape-town-aid-guide.lovable.app/',
  },
  {
    id: 'sparky',
    title: 'Sparky Studio AI',
    tag: 'AI \u00b7 Creative Platform',
    icon: 'sparkles',
    stack: ['React', 'TypeScript', 'AI', 'Supabase'],
    desc: 'Sparky Studio is an AI-powered creative platform designed to make content generation simple, intuitive, and enjoyable. Instead of functioning as a traditional chatbot, Sparky Studio separates its capabilities into dedicated workspaces, allowing users to generate images, create code, or produce written content in an organised environment. The application focuses on combining modern AI technologies with an engaging user experience to provide a fast, responsive, and visually appealing creative platform.',
    link: 'https://github.com/DavidDanielx72/Sparky-Studio-AI',
    demo: 'https://sparky-studio.bolt.host/',
  },
  {
    id: 'analysisbuddy',
    title: 'Analysis Buddy AI',
    tag: 'AI \u00b7 Sentiment Analysis',
    icon: 'brain',
    stack: ['AI', 'Sentiment Analysis', 'Data Visualization', 'React'],
    desc: 'An AI-powered sentiment analysis platform that transforms raw text into actionable insights. Whether you\u2019re analyzing customer feedback, reviews, documents, or online content, the application classifies sentiment, highlights recurring themes, visualizes results, and generates intelligent recommendations to help you better understand your data. Designed with a clean, premium interface and subtle cyber-inspired aesthetics, the platform provides a seamless experience for exploring sentiment through interactive visualizations and AI-assisted analysis.',
    link: 'https://github.com/DavidDanielx72/Analysis-BuddyAI',
    demo: 'https://sentiment-analysis-ai.bolt.host/',
  },
  {
    id: 'rietfontein',
    title: 'Rietfontein Guest Farm Website',
    tag: 'Web \u00b7 Content & Design',
    icon: 'globe',
    stack: ['WordPress', 'UI/UX', 'Content', 'Design'],
    desc: 'Updated website content, business information, images, and page layouts to keep the site accurate and aligned with the client\u2019s needs. Improved structure, usability, and overall presentation while collaborating with the client to support their brand and communication goals.',
    link: 'https://rietfontein.co.za/',
  },
]

export const experience = [
  {
    role: 'Website Content & Design Updates',
    org: 'Rietfontein Ladismith Guest Farm',
    date: 'Jan 2026 \u2013 Feb 2026',
    points: [
      'Updated website content, business information, images, and page layouts to keep the site accurate, current, and aligned with the client\u2019s needs.',
      'Improved the website\u2019s structure, usability, and overall presentation while collaborating with the client to support the business\u2019s brand and communication goals.',
    ],
  },
  {
    role: 'Seasonal Sales Consultant',
    org: 'Country Road Waterfront (Woolworths Group)',
    date: 'Dec 2025 \u2013 Jan 2026',
    points: [
      'Provided customer service in the menswear department, assisting with product enquiries, purchases, and general customer needs.',
      'Maintained stock levels and merchandising standards while supporting daily store operations in a fast-paced retail environment.',
    ],
  },
  {
    role: 'Casual Bar Attendant',
    org: 'Cape Town DHL Stadium',
    date: 'Dec 2023 \u2013 Feb 2024',
    points: [
      'Served beverages and provided customer service during high-volume events, ensuring efficient and professional service.',
      'Assisted with stock replenishment and beverage transport, working accurately and calmly under pressure.',
    ],
  },
]

export const education = [
  { title: 'Diploma in ICT \u2014 Applications Development', org: 'Cape Peninsula University of Technology (CPUT)', year: '2024 \u2013 Present' },
  { title: 'National Senior Certificate', org: 'Zwaanswyk High School', year: '2019 \u2013 2023' },
]
