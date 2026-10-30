// App.jsx
import { useEffect, useRef, useState, Suspense, lazy } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { MdEmail, MdPhone, MdLocationOn, MdOutlineClear } from "react-icons/md";
import {
  FaLinkedinIn,
  FaGithub,
  FaJava,
  FaReact,
  FaJs,
  FaHtml5,
  FaCss3Alt,
  FaInstagram,
  FaYoutube,
  FaChevronCircleLeft,
  FaChevronCircleRight,
  FaDatabase,
} from "react-icons/fa";
import {
  SiSpring,
  SiHibernate,
  SiMysql,
  SiTailwindcss,
  SiPostman,
  SiMongodb,
  SiRender,
  SiVercel,
  SiGit,
  SiTypescript,
  SiNodedotjs,
  SiJavascript,
  SiPostgresql,
  SiNextdotjs,
} from "react-icons/si";
import { VscAzure } from "react-icons/vsc";
import { SlLocationPin } from "react-icons/sl";
import { HiOutlineMenu } from "react-icons/hi";
import { TbFileDownload, TbSql } from "react-icons/tb";
import {
  calculateExperienceDuration,
  calculateExperienceYears,
  profile,
  experience,
  contact,
} from "./data/portfolioKnowledge";

// Lazy-loaded so the floating chat assistant doesn't add to the initial page load.
const ChatAssistant = lazy(() => import("./components/ChatAssistant"));

// "Oct 2024" — UTC so a date-only string never shifts to the previous month.
function formatMonthYear(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function App() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = [
      "home",
      "about",
      "skills",
      "experience",
      "projects",
      "contact",
    ];

    const handleScroll = () => {
      // The last section may be too short to reach the top of the viewport,
      // so treat "scrolled to the bottom" as being on it.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActiveSection(sections[sections.length - 1]);
        return;
      }

      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    handleScroll(); // page may load already scrolled (e.g. a #projects link)
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Header activeSection={activeSection} />
      <Home />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
      <Footer />
      <Suspense fallback={null}>
        <ChatAssistant />
      </Suspense>
    </div>
  );
}

// Header Component
const Header = ({ activeSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-gray-900/90 backdrop-blur-sm border-b border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <motion.a
            href="#home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold"
          >
            <span className="text-blue-400">Sanat</span>
            <span className="text-white">Buyya</span>
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`relative py-2 text-sm font-medium transition-all duration-300 ${
                  activeSection === item.id
                    ? "text-blue-400"
                    : "text-gray-300 hover:text-blue-400"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <MdOutlineClear size={24} />
            ) : (
              <HiOutlineMenu size={24} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 pb-4"
          >
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block py-2 px-4 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </header>
  );
};

// Home Component
const Home = () => {
  const texts = profile.titles;

  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter: each tick does exactly one step, so there's a single pending
  // timer that the cleanup always clears.
  useEffect(() => {
    const currentText = texts[textIndex];
    const isFullyTyped = !isDeleting && displayText === currentText;
    const delay = isFullyTyped ? 1000 : isDeleting ? 60 : 120; // pause after typing

    const timeout = setTimeout(() => {
      if (isFullyTyped) {
        setIsDeleting(true);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      } else {
        setDisplayText(
          currentText.substring(0, displayText.length + (isDeleting ? -1 : 1)),
        );
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [texts, displayText, isDeleting, textIndex]);

  return (
    <section id="home" className="w-full min-h-screen flex items-center pt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
            <div className="mb-6">
              <span className="text-blue-400 font-semibold">Hello, I'm</span>
              <h1 className="text-5xl md:text-6xl font-bold mt-2 mb-4">
                Sanat <span className="text-blue-400">Buyya</span>
              </h1>
              <div className="h-5 flex items-center">
                <span className="text-xl md:text-2xl">
                  <span className="text-blue-400 font-bold">
                    {displayText}
                    <span className="animate-pulse">|</span>
                  </span>
                </span>
              </div>
            </div>
            <p className="text-gray-300 mb-8 max-w-2xl">
              Passionate Software Engineer with{" "}
              <span className="text-blue-400 font-semibold capitalize">
                {calculateExperienceDuration(profile.experienceStartDate)}
              </span>{" "}
              of hands-on experience building real-world web applications and enterprise solutions.
              Specializing in Java, Spring Boot, React, and modern web and
              mobile technologies. Focused on building scalable applications
              with clean code and best practices.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#contact"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
              >
                Contact Me
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#projects"
                className="px-8 py-3 border-2 border-blue-400 text-blue-400 hover:bg-blue-400/10 rounded-lg font-semibold transition-colors"
              >
                View Projects
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2 flex flex-col items-center justify-center"
          >
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-blue-400/30">
                <div className="w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 flex items-center justify-center">
                  <img
                    src="/profile.jpeg"
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="flex gap-6 mt-8">
              {/* Years of Experience */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-400/30 rounded-lg p-4 text-center"
              >
                <div className="text-3xl font-bold text-blue-400">
                  {calculateExperienceYears(profile.experienceStartDate)}+
                </div>
                <div className="text-gray-300 text-sm mt-2">Years of Experience</div>
              </motion.div>

              {/* Projects Completed */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-400/30 rounded-lg p-4 text-center"
              >
                <div className="text-3xl font-bold text-purple-400">8+</div>
                <div className="text-gray-300 text-sm mt-2">Projects Completed</div>
              </motion.div>

              {/* Current Position */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-400/30 rounded-lg p-4 text-center"
              >
                <div className="text-sm font-semibold text-green-400">Open to Work</div>
                <div className="text-gray-300 text-sm mt-2">Current Position</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// About Component
const About = () => {
  return (
    <section id="about" className="py-8">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-8"
        >
          About <span className="text-blue-400">Me</span>
        </motion.h2>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/3"
          >
            <div className="relative">
              <div className="w-75 h-72 rounded-2xl overflow-hidden border-4 border-blue-400/30 mx-auto">
                <div className="w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 flex items-center justify-center">
                  <img
                    src="/aboutimage.jpg"
                    alt="Sanat working at a computer"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm">Available for opportunities</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-2/3"
          >
            <h3 className="text-2xl font-bold mb-6">Who am I?</h3>
            <p className="text-gray-300 mb-4">
              I am a Full Stack Developer with hands-on industry experience.
              I previously worked at Revappayya IT Services Pvt. Ltd., where I contributed to the development of real-world products for 1.5+ years. One of
              the products I worked on is successfully live on both the website
              and the Google Play Store, giving me end-to-end exposure to
              production-grade application development. I hold a Bachelor of
              Engineering degree from Bangalore Institute of Technology and have
              completed a Java Full Stack Development program. Over time, I have
              expanded my skill set beyond academics into modern, in-demand
              technologies through practical project work and professional
              experience.
            </p>

            {/* gap-2 when stacked so the two groups read as one list; gap-6 only between side-by-side columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 my-8">
              <div className="space-y-2">
                <div className="flex">
                  <span className="text-gray-400 min-w-28">Name:</span>
                  <span className="text-white">Sanat Buyya</span>
                </div>
                <div className="flex">
                  <span className="text-gray-400 min-w-28">Email:</span>
                  <span className="text-white">{contact.email}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-400 min-w-28">Experience:</span>
                  <span className="text-white capitalize">
                    {calculateExperienceDuration(profile.experienceStartDate)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex">
                  <span className="text-gray-400 min-w-28">Phone:</span>
                  <span className="text-white">{contact.phone}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-400 min-w-28">Location:</span>
                  <span className="text-white">{contact.location}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-400 min-w-28">Status:</span>
                  <span className="text-green-400">Open to work</span>
                </div>
              </div>
            </div>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={contact.resume}
              download="Sanat-Buyya-CV.pdf"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Download CV
              <TbFileDownload />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Skills Component
const Skills = () => {
  const skills = [
    { name: "Java", icon: <FaJava />, color: "bg-red-500" },
    { name: "Spring Boot", icon: <SiSpring />, color: "bg-green-600" },
    { name: "Hibernate", icon: <SiHibernate />, color: "bg-orange-500" },
    { name: "JDBC", icon: <FaDatabase />, color: "bg-purple-600" },
    { name: "JavaScript", icon: <SiJavascript />, color: "bg-yellow-400 text-black" },
    { name: "TypeScript", icon: <SiTypescript />, color: "bg-blue-600" },
    { name: "React JS", icon: <FaReact />, color: "bg-cyan-500" },
    { name: "Next.js", icon: <SiNextdotjs />, color: "bg-gray-800" },
    { name: "Node.js", icon: <SiNodedotjs />, color: "bg-green-500" },
    { name: "React Native", icon: <FaReact />, color: "bg-blue-500" },
    { name: "Tailwind CSS", icon: <SiTailwindcss />, color: "bg-cyan-600" },
    { name: "HTML5", icon: <FaHtml5 />, color: "bg-orange-600" },
    { name: "CSS3", icon: <FaCss3Alt />, color: "bg-blue-500" },
    { name: "SQL", icon: <TbSql />, color: "bg-blue-600" },
    { name: "MySQL", icon: <SiMysql />, color: "bg-blue-600" },
    { name: "PostgreSQL", icon: <SiPostgresql />, color: "bg-blue-600"},
    { name: "MongoDB", icon: <SiMongodb />, color: "bg-green-500" },
    { name: "Postman", icon: <SiPostman />, color: "bg-orange-400" },
    { name: "Azure", icon: <VscAzure />, color: "bg-blue-700" },
    { name: "GitHub", icon: <FaGithub />, color: "bg-gray-800" },
    { name: "Git", icon: <SiGit />, color: "bg-red-600" },
    { name: "Vercel", icon: <SiVercel />, color: "bg-black" },
    { name: "Render", icon: <SiRender />, color: "bg-black" },
  ];

  return (
    <section id="skills" className="py-8 bg-gray-800/50">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12"
        >
          Technical <span className="text-blue-400">Skills</span>
        </motion.h2>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl px-2 py-3 sm:p-4 hover:border-blue-400/50 transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-2xl sm:text-3xl mb-2">{skill.icon}</div>
                <h3 className="text-sm sm:text-base font-semibold">{skill.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Experience Component — entries come from portfolioKnowledge.js, shared with the chat
// assistant so both always show the same details.
const Experience = () => {
  return (
    <section id="experience" className="py-8">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12"
        >
          Work <span className="text-blue-400">Experience</span>
        </motion.h2>

        <div className="max-w-3xl mx-auto">
          {experience.map((exp) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <img
                        src="/ritsLogoMark.png"
                        alt="Revappayya IT Services logo"
                        loading="lazy"
                        decoding="async"
                        className="w-16 h-16 mb-4 md:mb-0 rounded bg-white"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-blue-400">
                        {exp.company}
                      </h3>
                      <p className="text-xl font-semibold mt-1">
                        {exp.position}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className="inline-block px-4 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-semibold">
                      {formatMonthYear(exp.startDate)} -{" "}
                      {formatMonthYear(exp.endDate)} ({exp.durationLabel})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-400 mb-3">
                  <SlLocationPin size={18} />
                  <span>{exp.location}</span>
                </div>

                <p className="text-gray-300 mb-6">{exp.description}</p>

                <div>
                  <h4 className="font-semibold mb-3">Technologies Used:</h4>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Projects Component
const Projects = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const projects = [
    {
      title: "RITS Billing Suite",
      image: "/ritsBillingSuite.png",
      applicationType: "Web and Mobile Application",
      description:
        "A comprehensive billing solution for RITS, featuring automated invoice, quotation and payment processing.",
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
    },
    {
      title: "SwapTicket",
      image: "/swapticket.png",
      applicationType: "Web Application",
      description:
        "A platform for users to swap tickets for Train, Bus, and Flight tickets with secure transactions.",
      technologies: [
        "Spring Boot",
        "Spring Data JPA",
        "MySQL",
        "RazorPay",
        "Cloudinary",
        "Thymeleaf",
      ],
      status: "Completed",
    },
    {
      title: "ShopEase - Ecommerce",
      image: "/ECommerce.png",
      applicationType: "Web Application",
      description:
        "A full-featured e-commerce platform with cart functionality, payment integration, and admin dashboard.",
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
    },
    {
      title: "Stock Market",
      image: "/StockMarket.png",
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
    },
  ];

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + projects.length) % projects.length);
  };

  // Only auto-advance while the carousel is on screen, so visitors scrolling
  // down from the top arrive at the first project instead of a later one.
  const carouselRef = useRef(null);
  const isInView = useInView(carouselRef, { amount: 0.4 });

  // Auto-advance every 5 seconds, looping back to the first project after the
  // last. Re-runs whenever `current` changes, so an arrow or dot click restarts
  // the countdown instead of jumping again right away.
  useEffect(() => {
    if (isPaused || !isInView) return undefined;
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [current, isPaused, isInView, projects.length]);

  return (
    <section id="projects" className="py-8 bg-gray-800/50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          My <span className="text-blue-400">Projects</span>
        </h2>

        {/* Pause while a mouse is over the card so visitors can read it.
            Mouse only: on touch screens a tap would otherwise pause it for good. */}
        <div
          ref={carouselRef}
          className="relative max-w-3xl mx-auto"
          onPointerEnter={(e) => e.pointerType === "mouse" && setIsPaused(true)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setIsPaused(false)}
        >
          {/* Slide */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden h-[520px] md:h-full flex flex-col"
            >
              <div className="h-56">
                <img
                  src={projects[current].image}
                  alt={`${projects[current].title} screenshot`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 flex flex-col flex-1">
                {/* items-start: otherwise the badge stretches to the title's height when it wraps */}
                <div className="flex justify-between items-start gap-3">
                  <h3 className="text-xl font-bold">
                    {projects[current].title}
                  </h3>

                  <span className="mt-0.5 shrink-0 whitespace-nowrap px-3 py-1 flex items-center bg-green-600/20 text-green-400 rounded-full text-xs">
                    {projects[current].status}
                  </span>
                </div>

                <h4 className="text-sm text-gray-400 mt-1 mb-4">
                  {projects[current].applicationType}
                </h4>

                <p className="text-gray-300 mb-4 line-clamp-3">
                  {projects[current].description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {projects[current].technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous project"
            className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 bg-gray-800 p-2 rounded-full hover:bg-gray-700"
          >
            <FaChevronCircleLeft size={25} />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next project"
            className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 bg-gray-800 p-2 rounded-full hover:bg-gray-700"
          >
            <FaChevronCircleRight size={25} />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 gap-3">
            {projects.map((project, index) => (
              <button
                key={project.title}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Show ${project.title}`}
                aria-current={current === index}
                className={`h-3 w-3 rounded-full transition-all ${
                  current === index ? "bg-blue-400 scale-125" : "bg-gray-500"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// name@domain.tld: no spaces, one "@", no empty or trailing dot in the
// domain, and a TLD of at least 2 letters (so "sanat@gmail." fails).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)*\.[A-Za-z]{2,}$/;
const INVALID_EMAIL_MESSAGE = "Please enter a valid email address";

// Contact Component
const Contact = () => {
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState(null); // { type: "success" | "error", text }
  const [error, setError] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const socialLinks = [
    { label: "LinkedIn", href: contact.linkedin, icon: <FaLinkedinIn className="text-lg" /> },
    { label: "GitHub", href: contact.github, icon: <FaGithub className="w-5 h-5" /> },
    { label: "Instagram", href: contact.instagram, icon: <FaInstagram className="w-5 h-5" /> },
    { label: "YouTube", href: contact.youtube, icon: <FaYoutube className="w-5 h-5" /> },
  ];

  const validation = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    const email = formData.email.trim();
    if (!email) {
      errors.email = "Email is required";
    } else if (!EMAIL_PATTERN.test(email)) {
      errors.email = INVALID_EMAIL_MESSAGE;
    }

    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
    }

    setError(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSending || !validation()) return;
    setIsSending(true);
    setStatus(null);

    try {
      const response = await fetch("https://formspree.io/f/xjkweeby", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // Formspree uses `_subject` as the notification email's subject line.
        body: JSON.stringify({
          ...formData,
          email: formData.email.trim(),
          _subject: `Portfolio contact: ${formData.subject}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      setStatus({ type: "success", text: "Thanks! Your message has been sent." });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error:", error);
      setStatus({
        type: "error",
        text: `There was a problem sending your message. Please try again later or email ${contact.email}.`,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (error[name]) {
      setError({ ...error, [name]: undefined });
    }
  };

  // Flag a malformed email as soon as the visitor leaves the field.
  const handleEmailBlur = () => {
    const email = formData.email.trim();
    if (email && !EMAIL_PATTERN.test(email)) {
      setError((prev) => ({ ...prev, email: INVALID_EMAIL_MESSAGE }));
    }
  };

  return (
    <section id="contact" className="py-8">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12"
        >
          Get In <span className="text-blue-400">Touch</span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-600/20 border border-blue-400/30 flex items-center justify-center">
                  <MdEmail className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <a
                    href={contact.emailHref}
                    className="text-gray-300 hover:text-blue-400 hover:underline transition"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-600/20 border border-blue-400/30 flex items-center justify-center">
                  <MdPhone className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Phone</h3>
                  <a
                    href={contact.phoneHref}
                    className="text-gray-300 hover:text-blue-400 transition"
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-600/20 border border-blue-400/30 flex items-center justify-center">
                  <MdLocationOn className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Location</h3>
                  <p className="text-gray-300">{contact.location}</p>
                </div>
              </div>

              <div className="pt-8">
                <h3 className="font-semibold text-lg mb-4">Connect with me</h3>
                <div className="flex gap-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      title={link.label}
                      className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 flex items-center justify-center transition-colors"
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Each field reserves an h-4 row for its error, so the visible gap is 16px + 4px.
                noValidate: those inline errors replace the browser's own pop-up. */}
            <form onSubmit={handleSubmit} noValidate className="space-y-1">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                />
                <div className="h-4">
                  {error.name && (
                    <p className="text-red-400 text-xs leading-4">{error.name}</p>
                  )}
                </div>
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  autoComplete="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                />
                <div className="h-4">
                  {error.email && (
                    <p className="text-red-400 text-xs leading-4">{error.email}</p>
                  )}
                </div>
              </div>
              <div>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                />
                <div className="h-4">
                  {error.subject && (
                    <p className="text-red-400 text-xs leading-4">{error.subject}</p>
                  )}
                </div>
              </div>
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-400 transition-colors resize-none"
                />
                <div className="h-4">
                  {error.message && (
                    <p className="text-red-400 text-xs leading-4">{error.message}</p>
                  )}
                </div>
              </div>
              {/* No scale effect: the button is full-width, so scaling would push it past the form edges. */}
              <button
                type="submit"
                disabled={isSending}
                className="w-full px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSending ? "Sending..." : "Send Message"}
              </button>
              <p
                role="status"
                className={`text-sm text-center min-h-5 ${
                  status?.type === "error" ? "text-red-400" : "text-green-400"
                }`}
              >
                {status?.text}
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="py-4 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Sanat Buyya. All rights reserved.
          </div>
          <div className="text-center md:mr-4">
            <p className="text-gray-300 mb-2">
              Let's build something amazing together!
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default App;