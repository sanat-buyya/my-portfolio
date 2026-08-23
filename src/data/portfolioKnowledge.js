// src/data/portfolioKnowledge.js
//
// Single source of truth for the "Ask Sanat AI" chat assistant.
// Every field here is copied from the content that already exists in
// src/App.jsx (Home, About, Skills, Experience, Projects, Contact, Footer).
// Nothing is invented. If you update your portfolio content, update it here
// too so the assistant stays in sync.

// Kept in one place so both App.jsx and the chat assistant compute the
// same "years of experience" text without duplicating logic.
export function calculateExperienceDuration(startDate) {
  const start = new Date(startDate);
  const now = new Date();

  let months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());

  if (now.getDate() < start.getDate()) {
    months--;
  }

  if (months < 1) return "less than a month";
  if (months < 12) return `${months} month${months > 1 ? "s" : ""}`;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) return `${years} year${years > 1 ? "s" : ""}`;
  return `${years} year${years > 1 ? "s" : ""} ${remainingMonths} month${
    remainingMonths > 1 ? "s" : ""
  }`;
}

export const profile = {
  name: "Sanat Buyya",

  titles: [
    "Full Stack Developer",
    "Java Developer",
    "React Developer",
    "Software Engineer",
  ],

  primaryTitle: "Full Stack Developer",

  location: "Bengaluru, Karnataka",

  availability: "Open to work / available for new opportunities",

  summary:
    "Passionate Software Engineer with around 1 year 9 months of professional experience in software development, including approximately 1.5 years at Revappayya IT Services Pvt. Ltd. and additional experience working on client projects. Specializes in Java, Spring Boot, React, React Native, Node.js, and modern web and mobile technologies.",

  about:
    "Sanat is a Full Stack Developer with around 1 year 9 months of professional software development experience. He worked for approximately 1.5 years at Revappayya IT Services Pvt. Ltd., contributing to real-world web and mobile applications. He also has additional experience working on client projects, gaining practical exposure to full-stack development and production-oriented application development.",

  totalExperience: "1 year 9 months",

  companyExperience: "Approximately 1.5 years",

  clientProjectExperience:
    "Additional professional experience working on client projects.",

  currentEmploymentStatus:
    "Currently open to work and available for new opportunities.",

  previousEmployment:
    "Previously worked as a Full Stack Developer at Revappayya IT Services Pvt. Ltd.",

  experienceStartDate: "2024-10-25",
};

export const education = {
  degree: "Bachelor of Engineering (B.E.)",
  institution: "Bangalore Institute of Technology",
  additional: "Completed a Java Full Stack Development program",
};

// Skills grouped the same way a recruiter would ask about them.
// "tag" values are the exact labels shown in the Skills section of the site.
export const skills = {
  frontend: [
    "JavaScript",
    "TypeScript",
    "React JS",
    "Next.js",
    "React Native",
    "Tailwind CSS",
    "HTML5",
    "CSS3",
  ],
  backend: ["Java", "Spring Boot", "Hibernate", "JDBC", "Node.js"],
  database: ["SQL", "MySQL", "PostgreSQL", "MongoDB"],
  toolsAndPlatforms: ["Postman", "Azure", "GitHub", "Git", "Vercel", "Render"],
};

export const allSkillsFlat = [
  ...skills.frontend,
  ...skills.backend,
  ...skills.database,
  ...skills.toolsAndPlatforms,
];

export const experience = [
  {
    company: "Revappayya IT Services Pvt Ltd",
    position: "Full Stack Developer",
    location: "Bengaluru",

    startDate: "2024-10-25",
    endDate: "2026-03-31",

    durationLabel: "Approximately 1.5 years",

    employmentStatus: "Previous employment",

    description:
      "Worked on full-stack development projects using JavaScript, React, React Native, and Node.js. Contributed to building scalable applications and implementing best practices.",

    technologies: [
      "JavaScript",
      "React JS",
      "React Native",
      "Tailwind CSS",
      "Node.js",
      "Azure",
    ],
  },
];

export const projects = [
  {
    id: "rits-billing-suite",
    aliases: ["rits", "billing suite", "rits billing suite", "billing", "invoice project", "quotation project"],
    title: "RITS Billing Suite",
    applicationType: "Web and Mobile Application",
    description:
      "A comprehensive billing solution for RITS, featuring automated invoice, quotation, and payment processing.",
    technologies: [
      "React JS",
      "Node.js",
      "Express",
      "MongoDB",
      "Azure",
      "Tailwind CSS",
      "React Native",
    ],
    status: "Completed",
    liveUrl: null,
    githubUrl: null,
  },
  {
  id: "swapticket",

  aliases: [
    "swapticket",
    "swap ticket",
    "ticket swap",
    "ticket app",
    "train ticket",
    "bus ticket",
    "flight ticket",
    "ticket marketplace"
  ],

  title: "SwapTicket",

  applicationType: "Web Application",

  platform: ["Web Application"],

  status: "Completed",

  purpose:
  "SwapTicket is a ticket marketplace platform that allows users to list and sell unused or non-refundable travel tickets that they can no longer use. Other users can discover and purchase these available tickets, helping sellers recover value from otherwise unusable tickets while giving buyers access to available Train, Bus, and Flight tickets at suitable prices. The platform also provides secure transaction management, ticket management, train tracking, and real-time customer support.",
  
  problemStatement:
    "The application provides a platform where users can list tickets they no longer need and make them available to other users. Buyers can browse available tickets and purchase suitable tickets through the platform.",

  description:
    "SwapTicket is a full-stack web application for buying and selling Train, Bus, and Flight tickets. It provides separate functionality for buyers and sellers, transaction tracking, train tracking, customer support, and an admin panel for managing users and platform operations.",

  userRoles: [
    "Buyer",
    "Seller",
    "Admin"
  ],

  roleBasedAccess:
    "The application implements role-based access so different users can access functionality according to their role.",

  sellerFeatures: [
    "Register and login",
    "Access seller dashboard",
    "List tickets for sale",
    "Provide ticket details",
    "View listed tickets",
    "Track sold tickets",
    "View transaction history",
    "Manage ticket-related information"
  ],

  sellerDescription:
    "Sellers can list Train, Bus, and Flight tickets on the platform. Once a ticket is purchased, the seller can view the transaction and sold-ticket information.",


  buyerFeatures: [
    "Register and login",
    "Browse available tickets",
    "View ticket details",
    "Purchase tickets",
    "View purchased tickets",
    "View transaction history",
    "Track trains",
    "Contact customer support"
  ],

  buyerDescription:
    "Buyers can browse available tickets, select a suitable ticket, complete the purchase process, and view their purchased tickets and transaction history.",

  ticketTypes: [
    "Train",
    "Bus",
    "Flight"
  ],

  ticketManagement:
    "The platform allows sellers to list travel tickets and buyers to view and purchase available tickets.",

  ticketLifecycle: [
    "Seller lists ticket",
    "Ticket becomes available",
    "Buyer views ticket",
    "Buyer purchases ticket",
    "Transaction is recorded",
    "Ticket is moved to the appropriate sold/purchased state"
  ],

  transactionFeatures: [
    "Ticket purchase transaction",
    "Transaction history",
    "Buyer transaction records",
    "Seller transaction records",
    "Credit and debit transaction tracking",
    "Platform fee tracking"
  ],

  transactionDescription:
    "The application maintains transaction records for users so buyers and sellers can track their financial activity related to ticket purchases and sales.",

  payment:
    "The application integrates Razorpay for handling ticket payment transactions.",

  paymentTechnology: [
    "Razorpay"
  ],

  trainTracking: {
    available: true,

    description:
      "The application provides train tracking functionality using a third-party train tracking API.",

    features: [
      "Track train information",
      "Search train information",
      "Retrieve train status from third-party API"
    ],

    integration:
      "Third-party train tracking API"
  },

  customerSupport: {
    available: true,

    technology: [
      "WebSocket"
    ],

    description:
      "The application provides real-time customer support using WebSocket communication, allowing users to communicate with the support system without repeatedly refreshing the page.",

    features: [
      "Real-time customer support",
      "Two-way communication",
      "Instant message delivery"
    ]
  },

  
  adminPanel: {
    available: true,

    description:
      "The admin panel allows administrators to monitor and manage important platform activities.",

    features: [
      "User management",
      "Transaction monitoring",
      "Platform fee tracking",
      "Ticket-related monitoring",
      "Customer issue management",
      "Customer support issue resolution"
    ]
  },

  authentication: {
    available: true,

    features: [
      "User registration",
      "User login",
      "Role-based access",
      "Authenticated user dashboard"
    ]
  },

  database: {
    name: "MySQL",

    technologies: [
      "Spring Data JPA",
      "Hibernate",
      "MySQL"
    ],

    description:
      "MySQL is used for persistent application data, while Spring Data JPA is used for database interaction."
  },
  backend: {
    language: "Java",

    framework: [
      "Spring Boot"
    ],

    technologies: [
      "Java",
      "Spring Boot",
      "Spring Data JPA",
      "Hibernate"
    ],

    description:
      "The backend is developed using Java and Spring Boot. Spring Data JPA and Hibernate are used for database operations and entity management."
  },

  // FRONTEND
  frontend: {
    type: "Web Application",

    technologies: [
      "Thymeleaf",
      "HTML",
      "CSS",
      "JavaScript"
    ],

    description:
      "The web interface is implemented using Thymeleaf along with standard web technologies."
  },

  // THIRD-PARTY INTEGRATIONS

  integrations: [
    {
      name: "Razorpay",
      purpose: "Payment processing"
    },
    {
      name: "Cloudinary",
      purpose: "Cloud-based media/file management"
    },
    {
      name: "Third-party Train Tracking API",
      purpose: "Train tracking and train status information"
    }
  ],

  // TECH STACK
  technologies: [
    "Java",
    "Spring Boot",
    "Spring Data JPA",
    "Hibernate",
    "MySQL",
    "Thymeleaf",
    "HTML",
    "CSS",
    "JavaScript",
    "Razorpay",
    "Cloudinary",
    "WebSocket"
  ],

  technologyCategories: {

    frontend: [
      "Thymeleaf",
      "HTML",
      "CSS",
      "JavaScript"
    ],

    backend: [
      "Java",
      "Spring Boot",
      "Spring Data JPA",
      "Hibernate"
    ],

    database: [
      "MySQL"
    ],

    payment: [
      "Razorpay"
    ],

    cloudStorage: [
      "Cloudinary"
    ],

    realtime: [
      "WebSocket"
    ],

    externalApis: [
      "Third-party Train Tracking API"
    ]
  },

  // APPLICATION FLOW
  
  applicationFlow: [
    "User registers on the platform",
    "User logs in",
    "User accesses functionality based on their role",
    "Seller lists a travel ticket",
    "Buyer browses available tickets",
    "Buyer selects a ticket",
    "Buyer completes payment",
    "Transaction is recorded",
    "Buyer can view the purchased ticket",
    "Seller can view the sold ticket",
    "Users can view transaction history",
    "Users can track trains through the external API",
    "Users can contact customer support through WebSocket",
    "Admin monitors users and transactions"
  ],

  // IMPORTANT TECHNICAL FEATURES
  
  technicalFeatures: [
    "Role-based access control",
    "REST API based backend architecture",
    "Spring Boot backend",
    "Spring Data JPA database integration",
    "MySQL relational database",
    "Razorpay payment integration",
    "Cloudinary integration",
    "Third-party train tracking API integration",
    "WebSocket based real-time customer support",
    "Transaction history",
    "Admin dashboard",
    "Seller dashboard",
    "Buyer functionality"
  ],

  // MY ROLE
  
  myRole:
    "Worked on full-stack development of the application, including backend development with Java and Spring Boot, database integration using Spring Data JPA and MySQL, frontend development, API integrations, transaction functionality, ticket management, and real-time customer support.",

  responsibilities: [
    "Developed backend functionality using Java and Spring Boot",
    "Implemented database operations using Spring Data JPA",
    "Worked with MySQL database",
    "Implemented ticket listing functionality",
    "Implemented ticket purchasing functionality",
    "Implemented transaction history",
    "Integrated Razorpay payment functionality",
    "Integrated third-party train tracking API",
    "Implemented real-time customer support using WebSocket",
    "Worked on role-based access functionality",
    "Worked on admin functionality",
    "Worked on buyer and seller workflows"
  ],

  // PROJECT HIGHLIGHTS
  highlights: [
    "Full-stack Java Spring Boot application",
    "Buyer and seller workflows",
    "Role-based access control",
    "Train, Bus, and Flight ticket support",
    "Payment integration",
    "Real-time WebSocket customer support",
    "Third-party API integration",
    "Transaction history",
    "Admin management panel"
  ],

  // QUESTIONS THE AI SHOULD BE ABLE TO ANSWER
  
  suggestedQuestions: [
    "What is SwapTicket?",
    "What is the purpose of SwapTicket?",
    "What problem does SwapTicket solve?",
    "What technologies were used in SwapTicket?",
    "Is SwapTicket a web or mobile application?",
    "What features does SwapTicket have?",
    "What are the user roles in SwapTicket?",
    "What can sellers do in SwapTicket?",
    "What can buyers do in SwapTicket?",
    "How does ticket purchasing work?",
    "How does ticket selling work?",
    "How does payment work?",
    "Which payment gateway was used?",
    "How does train tracking work?",
    "Which API is used for train tracking?",
    "How does customer support work?",
    "Why was WebSocket used?",
    "Does SwapTicket have an admin panel?",
    "What can the admin do?",
    "Which database was used?",
    "What backend technology was used?",
    "What frontend technology was used?",
    "What was Sanat's role in SwapTicket?",
    "What were Sanat's responsibilities?",
    "What are the main technical features of SwapTicket?"
  ],

  liveUrl: null,

  githubUrl: null
},
  {
    id: "shopease-ecommerce",
    aliases: ["shopease", "shop ease", "ecommerce", "e-commerce", "ecommerce project", "online store"],
    title: "ShopEase - Ecommerce",
    applicationType: "Web Application",
    description:
      "A full-featured e-commerce platform with cart functionality, payment integration, and an admin dashboard.",
    technologies: [
      "Java",
      "Spring Boot",
      "MySQL",
      "Thymeleaf",
      "RazorPay",
      "Cloudinary",
      "HTML/CSS",
    ],
    status: "Completed",
    liveUrl: null,
    githubUrl: null,
  },
  {
    id: "stock-market",
    aliases: ["stock market", "stock market project", "stock app", "portfolio management project"],
    title: "Stock Market",
    applicationType: "Web Application",
    description:
      "Real-time stock market data platform with user authentication and portfolio management features.",
    technologies: [
      "Spring Boot",
      "Spring Data JPA",
      "MySQL",
      "Alpha Vantage API",
      "Java Mail Sender",
    ],
    status: "Completed",
    liveUrl: null,
    githubUrl: null,
  },
];

export const contact = {
  email: "sanatbuyya@gmail.com",
  emailHref: "mailto:sanatbuyya@gmail.com",
  phone: "+91 6363356214",
  phoneHref: "tel:+916363356214",
  location: "Bengaluru, Karnataka",
  linkedin: "https://www.linkedin.com/in/sanat-buyya-a32b9b282/",
  github: "https://github.com/sanat-buyya",
  instagram: "https://instagram.com/sanat_buyya",
  youtube: "https://www.youtube.com/channel/UCGxNgzjDA1yISEITXJYBUaw",
  resume: "/cv.pdf",
  portfolio: "https://sanatbuyya.vercel.app/",
};

// Anchor ids that already exist in App.jsx sections — reused for
// "scroll to section" actions instead of creating new navigation.
export const sectionIds = {
  home: "home",
  about: "about",
  skills: "skills",
  experience: "experience",
  projects: "projects",
  contact: "contact",
};