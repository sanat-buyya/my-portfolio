import {
  profile,
  education,
  skills,
  allSkillsFlat,
  experience,
  projects,
  contact,
  sectionIds,
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

// Checked in order and the first match wins, so specific topics ("Sanat's
// role", "payment") come before broad ones ("features", "purpose").
// Matching is by substring so plurals and verb forms ("purchasing") still hit.
const PROJECT_SUB_INTENTS = [
  {
    id: "role",
    triggers: [
      "responsibilit",
      "sanats role",
      "his role",
      "my role",
      "role did",
      "contribut",
      "what did sanat do",
      "what did he do",
    ],
  },
  { id: "payment", triggers: ["payment", "razorpay", "gateway", "checkout"] },
  {
    id: "trainTracking",
    triggers: [
      "train tracking",
      "track train",
      "track a train",
      "train status",
      "train api",
    ],
  },
  { id: "support", triggers: ["support", "websocket", "web socket"] },
  { id: "admin", triggers: ["admin"] },
  {
    id: "seller",
    triggers: ["seller", "sell", "list a ticket", "list tickets", "listing"],
  },
  { id: "buyer", triggers: ["buyer", "buy", "purchas"] },
  {
    id: "roles",
    triggers: ["role", "user types", "types of users", "who can use"],
  },
  {
    id: "type",
    triggers: [
      "web or mobile",
      "mobile or web",
      "mobile",
      "type of app",
      "kind of app",
    ],
  },
  { id: "database", triggers: ["database"] },
  { id: "backend", triggers: ["backend", "back end", "server side"] },
  { id: "frontend", triggers: ["frontend", "front end", "user interface"] },
  {
    id: "tech",
    triggers: [
      "technolog",
      "tech stack",
      "stack",
      "built with",
      "built using",
      "used to build",
      "language",
      "framework",
      "tools",
    ],
  },
  {
    id: "features",
    triggers: [
      "feature",
      "functionalit",
      "what does it do",
      "what can it do",
      "capabilit",
      "modules",
      "used for",
    ],
  },
  {
    id: "purpose",
    triggers: ["purpose", "problem", "solve", "why", "goal", "objective"],
  },
  {
    id: "status",
    triggers: ["status", "completed", "finished", "ongoing", "in progress"],
  },
  {
    id: "links",
    triggers: [
      "link",
      "url",
      "demo",
      "live",
      "github",
      "repo",
      "source code",
      "website",
    ],
  },
];

// Project-specific topics, mapped to the project field that answers them.
const PROJECT_TOPIC_FIELDS = {
  payment: "payment",
  trainTracking: "trainTracking",
  support: "customerSupport",
  admin: "adminPanel",
  seller: "sellerFeatures",
  buyer: "buyerFeatures",
};

function detectProjectSubIntent(normalizedText) {
  // "What can buyers and sellers do?" is really a question about user roles.
  if (normalizedText.includes("sell") && normalizedText.includes("buy")) {
    return "roles";
  }

  const match = PROJECT_SUB_INTENTS.find(({ triggers }) =>
    triggers.some((t) => normalizedText.includes(t)),
  );
  return match ? match.id : "overview";
}

// ---------- skill detection ----------

// Each skill matches on its normalized name, the name without spaces
// ("nodejs"), and the name without a version suffix ("html" for HTML5).
const SKILL_MATCHERS = allSkillsFlat.map((skill) => {
  const name = normalize(skill);
  const variants = new Set([
    name,
    name.replace(/ /g, ""),
    name.replace(/\d+$/, "").trim(),
  ]);
  return { skill, variants: [...variants].filter((v) => v.length > 1) };
});

function matchesSkill(normalizedText, matcher) {
  return matcher.variants.some((v) => includesWord(normalizedText, v));
}

function detectSkills(normalizedText) {
  const found = SKILL_MATCHERS.filter((m) => matchesSkill(normalizedText, m));
  // Drop skills that only matched as part of a longer one ("css" in "tailwind css").
  return found
    .filter(
      (m) =>
        !found.some(
          (other) => other !== m && matchesSkill(normalize(other.skill), m),
        ),
    )
    .map((m) => m.skill);
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
      "available",
      "available to work",
      "available for work",
      "available for a job",
      "available for jobs",
      "available for new opportunities",
      "available to join",
      "is sanat available",
      "is sanat available to work",
      "is sanat available for work",
      "is sanat looking for a job",
      "is sanat looking for work",
      "looking for a job",
      "looking for jobs",
      "looking for work",
      "looking for opportunities",
      "open to work",
      "open for work",
      "open to new opportunities",
      "open for opportunities",
      "hiring",
      "can i hire sanat",
      "can we hire sanat",
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

const listFormatters = {
  and: new Intl.ListFormat("en", { style: "long", type: "conjunction" }),
  or: new Intl.ListFormat("en", { style: "long", type: "disjunction" }),
};

function listify(items, joiner = "and") {
  return listFormatters[joiner].format(items);
}

function bullets(items) {
  return items.map((item) => `• ${item}`).join("\n");
}

// Ends text with exactly one sentence terminator.
function sentence(text) {
  const trimmed = text.trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function lowerFirst(text) {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

// Project data is written as "The application provides ..."; name the
// project instead when that sentence opens a reply.
function openingSentence(project, text) {
  return sentence(text.replace(/^The application\b/, project.title));
}

const viewProjectsAction = { label: "View Projects", scrollTo: sectionIds.projects };
const viewSkillsAction = { label: "View Skills", scrollTo: sectionIds.skills };
const contactSanatAction = { label: "Contact Sanat", scrollTo: sectionIds.contact };

function projectSummary(project) {
  const intro = project.description.startsWith(project.title)
    ? sentence(project.description)
    : `${project.title} (${project.applicationType}): ${sentence(project.description)}`;
  return `${intro} Built with ${listify(project.technologies)}.`;
}

// Only offer follow-up topics the project's data can actually answer.
function followUpHint(project) {
  const topics = [
    project.highlights && "its features",
    project.payment && "payments",
    project.trainTracking?.available && "train tracking",
    project.customerSupport?.available && "customer support",
    project.myRole && "Sanat's role",
  ].filter(Boolean);
  return topics.length ? `\n\nYou can also ask about ${listify(topics, "or")}.` : "";
}

// When a project's portfolio entry doesn't cover the question, say so
// instead of guessing, and share what the portfolio does say.
function notCovered(project, topic) {
  return {
    text: `The portfolio doesn't include details about ${topic} for ${project.title}. Here's what it does cover: ${projectSummary(project)}`,
    actions: [contactSanatAction],
  };
}

const TECH_CATEGORY_LABELS = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  payment: "Payments",
  cloudStorage: "Media storage",
  realtime: "Real-time",
  externalApis: "External APIs",
};

function projectTechReply(project) {
  const categories = project.technologyCategories;
  if (!categories) {
    return { text: `${project.title} was built with ${listify(project.technologies)}.` };
  }
  const lines = Object.entries(categories).map(
    ([key, items]) => `${TECH_CATEGORY_LABELS[key] || key}: ${listify(items)}`,
  );
  return { text: `${project.title}'s tech stack:\n${bullets(lines)}` };
}

function projectReply(project, subIntent, normalizedText) {
  const { title } = project;

  switch (subIntent) {
    case "role":
      if (!project.myRole) return notCovered(project, "Sanat's specific role");
      return {
        text: `In ${title}, Sanat ${sentence(lowerFirst(project.myRole))}\n\nKey responsibilities:\n${bullets(project.responsibilities)}`,
      };

    case "payment":
      if (!project.payment) return notCovered(project, "the payment flow");
      return {
        text: [
          openingSentence(project, project.payment),
          project.transactionDescription && sentence(project.transactionDescription),
        ]
          .filter(Boolean)
          .join(" "),
      };

    case "trainTracking":
      if (!project.trainTracking?.available) {
        return notCovered(project, "train tracking");
      }
      return {
        text: `${openingSentence(project, project.trainTracking.description)}\n\n${bullets(project.trainTracking.features)}`,
      };

    case "support":
      if (!project.customerSupport?.available) {
        return notCovered(project, "customer support");
      }
      return {
        text: `${openingSentence(project, project.customerSupport.description)}\n\n${bullets(project.customerSupport.features)}`,
      };

    case "admin":
      if (!project.adminPanel?.available) {
        return notCovered(project, "the admin panel");
      }
      return {
        text: `${title} includes an admin panel. ${sentence(project.adminPanel.description)}\n\n${bullets(project.adminPanel.features)}`,
      };

    case "seller":
      if (!project.sellerFeatures) return notCovered(project, "seller features");
      return {
        text: `In ${title}, ${sentence(lowerFirst(project.sellerDescription))}\n\nSellers can:\n${bullets(project.sellerFeatures)}`,
      };

    case "buyer":
      if (!project.buyerFeatures) return notCovered(project, "buyer features");
      return {
        text: `In ${title}, ${sentence(lowerFirst(project.buyerDescription))}\n\nBuyers can:\n${bullets(project.buyerFeatures)}`,
      };

    case "roles":
      if (!project.userRoles?.length) return notCovered(project, "user roles");
      return {
        text: [
          `${title} has ${listify(project.userRoles)} roles.`,
          project.roleBasedAccess,
          project.sellerDescription,
          project.buyerDescription,
          project.adminPanel?.description,
        ]
          .filter(Boolean)
          .map(sentence)
          .join(" "),
      };

    case "type":
      return {
        text: `${title} is a ${project.applicationType.toLowerCase()}.`,
      };

    case "database":
    case "backend":
    case "frontend": {
      const layer = project[subIntent];
      if (!layer?.technologies) return projectTechReply(project);
      return {
        text: `${title}'s ${subIntent} uses ${listify(layer.technologies)}. ${sentence(layer.description)}`,
      };
    }

    case "tech":
      return projectTechReply(project);

    case "features": {
      const wantsTechnical = normalizedText.includes("technical");
      const list =
        (wantsTechnical && project.technicalFeatures) || project.highlights;
      if (!list) {
        return {
          text: `${projectSummary(project)} The portfolio doesn't list a more detailed feature breakdown.`,
        };
      }
      return {
        text: `${title}'s main ${wantsTechnical ? "technical " : ""}features:\n${bullets(list)}`,
      };
    }

    case "purpose":
      if (!project.purpose) return { text: projectSummary(project) };
      return {
        text: [project.purpose, project.problemStatement]
          .filter(Boolean)
          .map(sentence)
          .join(" "),
      };

    case "status":
      return { text: `${title} is ${project.status.toLowerCase()}.` };

    case "links": {
      if (!project.liveUrl && !project.githubUrl) {
        return {
          text: `Sanat hasn't published a public live demo or repo link for ${title} on the portfolio yet. You can ask him directly via the contact section, or check his GitHub for related work.`,
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
      return { text: `Here's where you can see ${title}:`, actions };
    }

    default:
      return {
        text: `${projectSummary(project)} Status: ${project.status}.${followUpHint(project)}`,
        actions: [viewProjectsAction],
      };
  }
}

const SKILL_CATEGORY_LABELS = {
  frontend: "frontend skills",
  backend: "backend skills",
  database: "database skills",
  toolsAndPlatforms: "everyday tools and platforms",
};

function skillReply(found) {
  if (found.length > 1) {
    return {
      text: `Yes — Sanat's skills include ${listify(found)}.`,
      actions: [viewSkillsAction],
    };
  }

  const [skill] = found;
  const category = Object.keys(skills).find((key) =>
    skills[key].includes(skill),
  );
  const matcher = SKILL_MATCHERS.find((m) => m.skill === skill);
  const usedIn = projects
    .filter((p) => p.technologies.some((t) => matchesSkill(normalize(t), matcher)))
    .map((p) => p.title);

  let text = `Yes — ${skill} is one of Sanat's ${SKILL_CATEGORY_LABELS[category]}.`;
  if (usedIn.length) text += ` He used it in ${listify(usedIn)}.`;
  return { text, actions: [viewSkillsAction] };
}

function buildResponse(intentId) {
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

        actions: [viewProjectsAction],
      };

    case "skills":
      return {
        text: `Sanat's core technical skills include: ${listify(allSkillsFlat)}.`,
        actions: [viewSkillsAction],
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
        actions: [viewProjectsAction],
      };

    case "experience": {
      const exp = experience[0];

      return {
        text: `Sanat has approximately ${profile.totalExperience} of professional software development experience. He spent ${profile.companyExperience.toLowerCase()} at ${exp.company} as a ${exp.position}, and has also worked on client projects. His experience includes ${listify(exp.technologies)}, along with Java, Spring Boot, MySQL, MongoDB, and other full-stack technologies. Sanat is currently open to new opportunities.`,

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
        text: `You can reach Sanat by email at ${contact.email} or by phone at ${contact.phone}. You can also connect with him on LinkedIn and GitHub, or download his resume below.`,
        actions: [
          { label: "Email Sanat", href: contact.emailHref },
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
        text: `Yes — Sanat is currently open to work and available for new opportunities. He has about ${profile.totalExperience} of professional software development experience, including full-stack work with Java, Spring Boot, React, React Native, Node.js, and modern deployment platforms.`,
        actions: [contactSanatAction],
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
    return projectReply(project, subIntent, normalizedText);
  }

  const intentId = scoreIntents(normalizedText);
  if (intentId) {
    const response = buildResponse(intentId);
    if (response) return response;
  }

  // "Does he know Java?" — any listed skill that no intent above covers.
  const skillsMentioned = detectSkills(normalizedText);
  if (skillsMentioned.length) return skillReply(skillsMentioned);

  // "How does payment work?" without naming a project: answer for the one
  // project whose data covers that topic, if there's exactly one.
  const subIntent = detectProjectSubIntent(normalizedText);
  const field = PROJECT_TOPIC_FIELDS[subIntent];
  const candidates = field ? projects.filter((p) => p[field]) : [];
  if (candidates.length === 1) {
    return projectReply(candidates[0], subIntent, normalizedText);
  }

  return {
    text: "I couldn't find that information in Sanat's portfolio. I can help with his profile, skills, projects, experience, education, or contact information. Try asking something like \"What technologies were used in SwapTicket?\"",
  };
}
