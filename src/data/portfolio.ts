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
  { label: 'C++ (Basic)', group: 'Programming' },
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
  { icon: 'brain', title: 'Soft Skills', desc: '', tags: ['Problem-solving', 'Teamwork', 'Adaptability', 'Attention to Detail'] },
]

export const projects = [
  {
    id: 'careerpilot',
    title: 'CareerPilot AI',
    tag: 'AI \u00b7 Full Stack',
    icon: 'sparkles',
    stack: ['React', 'AI', 'JavaScript', 'Supabase'],
    desc: 'An intelligent AI-powered career assistant that helps users create stronger, more professional CVs. CareerPilot analyses, improves, and generates CV content tailored to today\u2019s job market \u2014 offering personalised suggestions that help any CV stand out.',
    link: 'https://github.com/DavidDanielx72/Careerpilot_AI',
  },
  {
    id: 'ubuntu',
    title: 'Ubuntu Navigator AI Chatbot',
    tag: 'AI \u00b7 Conversational',
    icon: 'globe',
    stack: ['AI', 'NLP', '11 SA Languages', 'Location'],
    desc: 'An AI-powered conversational assistant for SASSA, Home Affairs, and City of Cape Town services. Supports all 11 official South African languages, answers questions in the user\u2019s language, and helps users find nearby Home Affairs offices by location.',
    link: 'https://github.com/DavidDanielx72/Ubuntu-Navigator-AI-Chatbot-',
  },
  {
    id: 'beep',
    title: 'Beep \u2014 IoT Alarm System',
    tag: 'IoT \u00b7 Full Stack',
    icon: 'cpu',
    stack: ['ESP32', 'RFID', 'Web Dashboard', 'SQL'],
    desc: 'A fully integrated IoT security system combining hardware and software. Features a web dashboard for remote control, ESP32 with RFID for arming/disarming, alarm scheduling, and real-time activity monitoring \u2014 controllable from any device.',
    link: 'https://github.com/DavidDanielx72/iot-elective-project-2026-beep',
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
