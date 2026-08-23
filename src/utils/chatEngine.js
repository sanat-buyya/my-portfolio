import {
  profile,
  education,
  skills,
  allSkillsFlat,
  experience,
  projects,
  contact,
  sectionIds,
  calculateExperienceDuration,
} from "../data/portfolioKnowledge";

export function normalize(text) {
  return text
    .toLowerCase()
    .replace(/['’]/g, "") // don't -> dont
    .replace(/[^a-z0-9\s]/g, " ") // strip punctuation
    .replace(/\s+/g, " ")
    .trim();
}

function includesWord(normalizedText, phrase) {
  // Match whole phrase with word boundaries, works for multi-word phrases too.
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(^|\\s)${escaped}(\\s|$)`);
  return re.test(normalizedText);
}

// ---------- project detection ----------

export function detectProject(normalizedText) {
  for (const project of projects) {
    const names = [project.title.toLowerCase(), ...project.aliases];
    for (const name of names) {
      if (normalizedText.includes(normalize(name))) {
        return project;
      }
    }
  }
  return null;
}

function detectProjectSubIntent(normalizedText) {
  if (
    [
      "purpose",
      "problem",
      "problem statement",
      "what problem",
      "what issue",
      "why was it built",
      "what does it solve",
      "goal",
      "objective",
      "why"
    ].some((p) => normalizedText.includes(p))
  ) {
    return "purpose";
  }

  if (
    [
      "technology",
      "technologies",
      "tech stack",
      "stack",
      "built with",
      "built using",
      "used to build",
      "what language",
      "what framework",
      "database"
    ].some((p) => normalizedText.includes(p))
  ) {
    return "tech";
  }

  if (
    [
      "feature",
      "features",
      "functionality",
      "what does it do",
      "used for",
      "user roles",
      "seller",
      "buyer",
      "admin"
    ].some((p) => normalizedText.includes(p))
  ) {
    return "features";
  }

  if (
    [
      "payment",
      "payment gateway",
      "razorpay",
      "how payment works"
    ].some((p) => normalizedText.includes(p))
  ) {
    return "payment";
  }

  if (
    [
      "websocket",
      "web socket",
      "customer support",
      "real time support",
      "real-time support",
      "chat support"
    ].some((p) => normalizedText.includes(p))
  ) {
    return "support";
  }

  if (
    [
      "train tracking",
      "track train",
      "train status",
      "train api"
    ].some((p) => normalizedText.includes(p))
  ) {
    return "train-tracking";
  }

  if (
    [
      "role",
      "roles",
      "seller",
      "buyer",
      "admin"
    ].some((p) => normalizedText.includes(p))
  ) {
    return "roles";
  }

  if (
    [
      "responsibility",
      "responsibilities",
      "my role",
      "sanat role",
      "what did sanat do"
    ].some((p) => normalizedText.includes(p))
  ) {
    return "role";
  }

  if (
    ["link", "url", "demo", "live", "github", "repo", "source code"].some(
      (p) => normalizedText.includes(p)
    )
  ) {
    return "links";
  }

  return "overview";
}

// ---------- intents ----------

const INTENTS = [
  {
    id: "greeting",
    triggers: [
      "hi",
      "hello",
      "hey",
      "yo",
      "good morning",
      "good evening",
      "good afternoon",
    ],
  },
  {
    id: "thanks",
    triggers: [
      "thanks",
      "thank you",
      "thankyou",
      "appreciate it",
      "cool thanks",
    ],
  },
  {
    id: "profile",
    triggers: [
      "who is sanat",
      "tell me about sanat",
      "about sanat",
      "who are you",
      "introduce yourself",
      "what type of developer",
      "what kind of developer",
      "developer type",
      "full stack experience",
      "tell me about yourself",
    ],
  },
  {
    id: "skills",
    triggers: [
      "skills",
      "skill",
      "technologies does sanat know",
      "tech stack",
      "technical skills",
      "programming languages",
      "what can sanat do",
      "what does sanat know",
      "tools does sanat use",
    ],
  },
  {
    id: "frontend",
    triggers: [
      "frontend",
      "front end",
      "front-end",
      "ui development",
      "client side",
    ],
  },
  {
    id: "backend",
    triggers: ["backend", "back end", "back-end", "server side"],
  },
  {
    id: "database",
    triggers: [
      "database",
      "databases",
      "sql",
      "mysql",
      "mongodb",
      "data storage",
    ],
  },
  {
    id: "react-check",
    triggers: [
      "does sanat know react",
      "know react",
      "react experience",
      "reactjs experience",
      "worked with react",
      "about react",
      "react js",
      "react",
    ],
  },
  {
    id: "springboot-check",
    triggers: [
      "does sanat know spring boot",
      "know spring boot",
      "spring boot experience",
      "worked with spring boot",
      "about spring boot",
      "springboot",
      "spring boot",
    ],
  },
  {
    id: "projects-general",
    triggers: [
      "projects",
      "project",
      "what has sanat built",
      "what has sanat worked on",
      "show me his work",
      "portfolio projects",
    ],
  },
  {
    id: "experience",
    triggers: [
      "experience",
      "work experience",
      "responsibilities",
      "job history",
      "where does sanat work",
      "current job",
      "employment",
    ],
  },
  {
    id: "education",
    triggers: [
      "education",
      "educational background",
      "degree",
      "college",
      "university",
      "studied",
    ],
  },
  {
    id: "contact",
    triggers: [
      "contact",
      "reach sanat",
      "get in touch",
      "email address",
      "phone number",
      "how can i contact",
    ],
  },
  {
    id: "github",
    triggers: ["github", "git hub", "repositories", "repos"],
  },
  {
    id: "linkedin",
    triggers: ["linkedin", "linked in"],
  },
  {
    id: "resume",
    triggers: ["resume", "cv", "download resume", "download cv"],
  },
  {
    id: "availability",
    triggers: [
      "available for a job",
      "is sanat available",
      "looking for a job",
      "open to work",
      "hiring",
      "why should i hire",
      "hire sanat",
      "available for hire",
      "job ready",
    ],
  },
];

// "profile" (and small-talk) intents are intentionally broad ("tell me about
// sanat") so they act as a catch-all. That means a more specific question
// like "tell me about Sanat's experience" would otherwise tie with the
// narrower "experience" intent. To keep the most specific match winning, we
// score everything else first and only fall back to these generic intents
// if nothing more specific matched.
const GENERIC_INTENT_IDS = new Set(["profile", "greeting", "thanks"]);

function scoreAgainst(normalizedText, intentList) {
  let best = null;
  let bestScore = 0;

  for (const intent of intentList) {
    let score = 0;
    for (const trigger of intent.triggers) {
      const normalizedTrigger = normalize(trigger);
      if (
        normalizedTrigger.includes(" ") &&
        normalizedText.includes(normalizedTrigger)
      ) {
        // full phrase match — strong signal
        score += 3;
      } else if (includesWord(normalizedText, normalizedTrigger)) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = intent.id;
    }
  }

  return bestScore > 0 ? best : null;
}

function scoreIntents(normalizedText) {
  const specificIntents = INTENTS.filter((i) => !GENERIC_INTENT_IDS.has(i.id));
  const genericIntents = INTENTS.filter((i) => GENERIC_INTENT_IDS.has(i.id));

  return (
    scoreAgainst(normalizedText, specificIntents) ||
    scoreAgainst(normalizedText, genericIntents)
  );
}

// ---------- response builders ----------

function listify(items) {
  return items.join(", ");
}

function projectOverview(project, subIntent) {
  const purposeText = project.purpose || project.description;
  const problemText = project.problemStatement || project.description;
  const rolesText = project.userRoles?.length
    ? project.userRoles.join(", ")
    : "multiple user roles";
  const featureSummary = project.technicalFeatures?.length
    ? project.technicalFeatures.slice(0, 5).join(", ")
    : project.technologies?.slice(0, 5).join(", ");

  if (subIntent === "purpose") {
    return {
      text: `${project.title} is a ${project.applicationType.toLowerCase()} built to ${purposeText.toLowerCase()}. The core problem it solves is: ${problemText}.`,
    };
  }

  if (subIntent === "tech") {
    return {
      text: `${project.title} was built with: ${listify(project.technologies || [])}.`,
    };
  }

  if (subIntent === "features") {
    const sellerFeatures = project.sellerFeatures?.length
      ? project.sellerFeatures.slice(0, 3).join(", ")
      : "seller workflows";
    const buyerFeatures = project.buyerFeatures?.length
      ? project.buyerFeatures.slice(0, 3).join(", ")
      : "buyer workflows";
    const adminText = project.adminPanel?.available
      ? "an admin panel for monitoring users and transactions"
      : "limited admin controls";

    return {
      text: `${project.title} supports ${rolesText}. Sellers can ${sellerFeatures}, while buyers can ${buyerFeatures}. It also includes ${adminText}. Key technical capabilities: ${featureSummary}.`,
    };
  }

  if (subIntent === "links") {
    if (!project.liveUrl && !project.githubUrl) {
      return {
        text: `Sanat hasn't published a public live demo or repo link for ${project.title} on the portfolio yet. You can ask him directly via the contact section, or check his GitHub for related work.`,
        actions: [
          { label: "View GitHub", href: contact.github, external: true },
        ],
      };
    }
    const actions = [];
    if (project.liveUrl)
      actions.push({
        label: "Live Demo",
        href: project.liveUrl,
        external: true,
      });
    if (project.githubUrl)
      actions.push({
        label: "View Code",
        href: project.githubUrl,
        external: true,
      });
    return { text: `Here's where you can see ${project.title}:`, actions };
  }

  return {
    text: `${project.title} (${project.applicationType}) — ${purposeText}. It solves: ${problemText}. Users include ${rolesText}. Built with ${listify(project.technologies || [])}. Status: ${project.status}.`,
  };
}

function buildResponse(intentId) {
  const experienceDuration = calculateExperienceDuration(
    profile.experienceStartDate,
  );

  switch (intentId) {
    case "greeting":
      return {
        text: `Hi! I'm Sanat's portfolio assistant. Ask me about his skills, projects, experience, education, or how to reach him.`,
      };

    case "thanks":
      return {
        text: `You're welcome! Anything else you'd like to know about Sanat?`,
      };

    case "profile":
  return {
    text: `${profile.about} He is currently open to new opportunities and is focused on full-stack development across frontend, backend, and mobile technologies.`,

    actions: [
      {
        label: "View Projects",
        scrollTo: sectionIds.projects,
      },
    ],
  };

    case "skills":
      return {
        text: `Sanat's core technical skills include: ${listify(allSkillsFlat)}.`,
        actions: [{ label: "View Skills", scrollTo: sectionIds.skills }],
      };

    case "frontend":
      return {
        text: `On the frontend, Sanat works with: ${listify(skills.frontend)}.`,
      };

    case "backend":
      return {
        text: `On the backend, Sanat works with: ${listify(skills.backend)}.`,
      };

    case "database":
      return {
        text: `Sanat has worked with these databases: ${listify(skills.database)}.`,
      };

    case "react-check":
  return {
    text: `Yes — React JS is one of Sanat's core frontend skills, and he has also used React Native for mobile application development. React is used in projects like RITS Billing Suite and in his professional development experience.`,
  };

    case "springboot-check":
      return {
        text: `Yes — Spring Boot is one of Sanat's core backend skills. He's used it (with Spring Data JPA and MySQL) in projects like SwapTicket, ShopEase, and the Stock Market app.`,
      };

    case "projects-general":
      return {
        text: `Sanat has built ${projects.length} projects shown on the portfolio: ${listify(
          projects.map((p) => p.title),
        )}. Ask me about any one of them for details, e.g. "Tell me about SwapTicket."`,
        actions: [{ label: "View Projects", scrollTo: sectionIds.projects }],
      };

    case "experience": {
      const exp = experience[0];

      return {
        text: `Sanat has approximately ${profile.totalExperience} of professional software development experience. He has around ${profile.companyExperience} of experience at ${exp.company}, where he worked as a ${exp.position}. In addition, he has experience working on client projects. His experience includes ${listify(exp.technologies)}, along with Java, Spring Boot, MySQL, MongoDB, and other full-stack technologies. Sanat is currently open to new opportunities.`,

        actions: [
          {
            label: "View Experience",
            scrollTo: sectionIds.experience,
          },
        ],
      };
    }

    case "education":
      return {
        text: `Sanat holds a ${education.degree} from ${education.institution}. He has also ${education.additional.charAt(0).toLowerCase() + education.additional.slice(1)}.`,
      };

    case "contact":
      return {
        text: `You can reach Sanat by email at ${contact.email}, or connect on LinkedIn and GitHub below.`,
        actions: [
          { label: "Email Sanat", href: contact.emailHref, external: true },
          { label: "LinkedIn", href: contact.linkedin, external: true },
          { label: "GitHub", href: contact.github, external: true },
          { label: "Download Resume", href: contact.resume, external: true },
        ],
      };

    case "github":
      return {
        text: `Here's Sanat's GitHub profile:`,
        actions: [
          { label: "GitHub Profile", href: contact.github, external: true },
        ],
      };

    case "linkedin":
      return {
        text: `Here's Sanat's LinkedIn profile:`,
        actions: [
          { label: "LinkedIn Profile", href: contact.linkedin, external: true },
        ],
      };

    case "resume":
      return {
        text: `Yes, you can download Sanat's resume here:`,
        actions: [
          { label: "Download Resume", href: contact.resume, external: true },
        ],
      };

    case "availability":
      return {
        text: `Sanat is currently ${profile.availability}. He has about ${experienceDuration} of full-stack experience with Java, Spring Boot, React, React Native and Deployment, and has shipped production applications end-to-end — feel free to reach out.`,
        actions: [{ label: "Contact Sanat", scrollTo: sectionIds.contact }],
      };

    default:
      return null;
  }
}

// ---------- public API ----------

export function getSuggestedQuestions() {
  return [
    "What are Sanat's skills?",
    "Tell me about his projects",
    "What is SwapTicket?",
    "What is his experience?",
    "How can I contact him?",
  ];
}

export function generateReply(rawText) {
  const normalizedText = normalize(rawText);

  if (!normalizedText) {
    return {
      text: "I didn't quite catch that — could you rephrase your question?",
    };
  }

  // Project-specific questions take priority since they're the most specific.
  const project = detectProject(normalizedText);
  if (project) {
    const subIntent = detectProjectSubIntent(normalizedText);
    return projectOverview(project, subIntent);
  }

  const intentId = scoreIntents(normalizedText);
  if (intentId) {
    const response = buildResponse(intentId);
    if (response) return response;
  }

  return {
  text:
    "I couldn't find that information in Sanat's portfolio. I can help with his profile, skills, projects, experience, education, or contact information. Try asking something like \"What technologies were used in SwapTicket?\"",
};
}
