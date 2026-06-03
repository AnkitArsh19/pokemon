/**
 * Portfolio content data — all text/info in one place for easy editing.
 */
export const portfolio = {
  trainer: {
    name: 'ANKIT',
    title: 'Full-Stack Developer',
    level: 5,
    id: '04823',
    type: 'FULL-STACK',
    nature: 'CREATIVE',
    hp: { current: 85, max: 100 },
    xp: { current: 620, max: 1000 },
  },

  projects: [
    {
      name: 'Portfolio RPG',
      type: 'WEB',
      level: 50,
      description: 'This very portfolio! A Pokémon-style RPG built with Phaser 3, React, and Grid Engine.',
      tech: ['React', 'Phaser 3', 'Vite'],
    },
    {
      name: 'Project Alpha',
      type: 'APP',
      level: 42,
      description: 'A full-stack web application with real-time features.',
      tech: ['Node.js', 'React', 'MongoDB'],
    },
    {
      name: 'Data Explorer',
      type: 'DATA',
      level: 38,
      description: 'Data visualization dashboard with interactive charts.',
      tech: ['Python', 'D3.js', 'PostgreSQL'],
    },
    {
      name: 'Cloud Deploy',
      type: 'DEVOPS',
      level: 35,
      description: 'CI/CD pipeline and cloud infrastructure automation.',
      tech: ['Docker', 'AWS', 'GitHub Actions'],
    },
  ],

  skills: [
    { name: 'React', type: 'GRASS', proficiency: 90 },
    { name: 'JavaScript', type: 'ELECTRIC', proficiency: 92 },
    { name: 'Node.js', type: 'WATER', proficiency: 85 },
    { name: 'Python', type: 'FIRE', proficiency: 78 },
    { name: 'TypeScript', type: 'PSYCHIC', proficiency: 80 },
    { name: 'SQL', type: 'STEEL', proficiency: 75 },
    { name: 'CSS/HTML', type: 'FAIRY', proficiency: 88 },
    { name: 'Git', type: 'DARK', proficiency: 85 },
  ],

  contact: {
    email: 'hello@ankit.dev',
    github: 'https://github.com/ankit',
    linkedin: 'https://linkedin.com/in/ankit',
  },

  dialogues: {
    professor: [
      "Ah, a visitor! Welcome to DEVTOWN!",
      "This is a world where code\ncomes to life!",
      "My name is OAK... er, I mean,\nI'm the town guide!",
      "Feel free to explore! Each\nbuilding has something special.",
      "The PROJECT GYM has my best\nwork. Go check it out!",
    ],
    profChen: [
      "Ah, welcome back! How is your\nPokémon journey going?",
      "Remember, the more you walk,\nthe stronger your team gets!",
      "Don't forget to check out all\nthe buildings in town!",
    ],
    nurseJoy: [
      "Welcome to the POKéMON CENTER!",
      "Let me heal your Pokémon...",
      "...",
      "Your Pokémon are fully healed!\nWe hope to see you again!",
    ],
    gymLeader: [
      "Welcome to the PROJECT GYM!",
      "Each project here was forged\nthrough countless battles...",
      "...I mean, debugging sessions!",
      "Press ESC and check PROJECTS\nto see what I've built!",
    ],
    librarian: [
      "Welcome to SKILL ACADEMY!",
      "Here we catalog all the\ntechnologies I've mastered.",
      "Each skill is like a move\nin your arsenal!",
      "Press ESC and check SKILLS\nto see my full set!",
    ],
    rival: [
      "Hey! It's me, GARY!",
      "I see you're building up\nyour team. Not bad!",
      "But my team is WAY stronger!\n...Just kidding, keep going!",
      "Walk around more to find\nwild Pokémon in the grass!",
    ],
    cafeOwner: [
      "Hey there! Welcome to\nCONTACT CORNER!",
      "This is where trainers\nconnect with each other.",
      "Want to get in touch?",
    ],
    sign_devtown: [
      "DEVTOWN\nA quiet town where great\ncode is born.",
    ],
    sign_home: [
      "ANKIT's House",
    ],
    sign_gym: [
      "PROJECT GYM\n\"Where ideas become reality\"",
    ],
    sign_academy: [
      "SKILL ACADEMY\n\"Knowledge is power\"",
    ],
    sign_cafe: [
      "CONTACT CORNER\n\"Let's connect!\"",
    ],
    sign_route: [
      "ROUTE 1\nMore adventures await...\n(Coming soon!)",
    ],
  },
};

/**
 * Pokémon-style type colors for UI badges
 */
export const TYPE_COLORS = {
  GRASS: '#78C850',
  FIRE: '#F08030',
  WATER: '#6890F0',
  ELECTRIC: '#F8D030',
  PSYCHIC: '#F85888',
  STEEL: '#B8B8D0',
  DARK: '#705848',
  FAIRY: '#EE99AC',
  NORMAL: '#A8A878',
  WEB: '#6890F0',
  APP: '#78C850',
  DATA: '#F8D030',
  DEVOPS: '#A040A0',
};
