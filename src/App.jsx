// App.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MdEmail, MdPhone, MdLocationOn, MdPerson } from "react-icons/md";
import {
  FaLinkedinIn,
  FaGithub,
  FaJava,
  FaReact,
  FaJs,
  FaHtml5,
  FaCss3Alt,
  FaInstagram,
  FaYoutube
} from "react-icons/fa";
import {
  SiSpring,
  SiHibernate,
  SiMysql,
  SiTailwindcss,
  SiPostman,
  SiMongodb,
} from "react-icons/si";
import { VscAzure } from "react-icons/vsc";
import ritsLogo from "../public/ritsLogo.png";
import profileImage from "../public/profile.jpeg";
import aboutImage from "../public/aboutimage.png";
import eCommerceImage from "../public/ECommerce.png";
import stockMarketImage from "../public/StockMarket.png";
import cv from "../public/cv.pdf";
import ritsBillingSuiteImage from "../public/ritsBillingSuite.png";
import swapTicketImage from "../public/swapticket.png";

// Experience duration calculator (AUTO updates)
function calculateExperienceDuration(startDate) {
  const start = new Date(startDate);
  const now = new Date();

  let months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());

  // Adjust if current day is before start day
  if (now.getDate() < start.getDate()) {
    months--;
  }

  if (months < 1) return "Less than a month";

  if (months < 12) {
    return `${months} Month${months > 1 ? "s" : ""}`;
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) {
    return `${years} Year${years > 1 ? "s" : ""}`;
  }

  return `${years} Year${years > 1 ? "s" : ""} ${remainingMonths} Month${
    remainingMonths > 1 ? "s" : ""
  }`;
}

function App() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "home",
        "about",
        "skills",
        "experience",
        "projects",
        "contact",
      ];
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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Header activeSection={activeSection} />
      <Home />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
      <Footer />
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
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
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
  const texts = [
    "Full Stack Developer",
    "Java Developer",
    "React Developer",
    "Software Engineer",
  ];

  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    let typingSpeed = isDeleting ? 60 : 120;

    const timeout = setTimeout(() => {
      setDisplayText((prev) => {
        if (!isDeleting) {
          // Typing
          const updated = currentText.substring(0, prev.length + 1);
          if (updated === currentText) {
            setTimeout(() => setIsDeleting(true), 1000); // pause after typing
          }
          return updated;
        } else {
          // Deleting
          const updated = currentText.substring(0, prev.length - 1);
          if (updated === "") {
            setIsDeleting(false);
            setTextIndex((prev) => (prev + 1) % texts.length);
          }
          return updated;
        }
      });
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex]);

  return (
    <section id="home" className="min-h-screen flex items-center pt-20">
      <div className="container mx-auto px-4 py-12">
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
              <div className="h-12 flex items-center">
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
              <span className="text-blue-400 font-semibold">
                {calculateExperienceDuration("2025-08-25")}
              </span>{" "}
              of professional experience at Revappayya IT Services Pvt Ltd.
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
            className="lg:w-1/2 flex justify-center"
          >
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-blue-400/30">
                <div className="w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 flex items-center justify-center">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <MdPerson className="text-8xl" />
                  )}
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-blue-500/10 border border-blue-400/30 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-purple-500/10 border border-purple-400/30 animate-pulse"></div>
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
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12"
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
                    src={aboutImage}
                    alt="About Me"
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
              I am a Full Stack Developer with hands-on industry experience,
              currently working at Revappayya IT Services Pvt. Ltd., where I
              have been contributing to the development of real-world products
              for the past {calculateExperienceDuration("2025-08-25")}. One of
              the products I worked on is successfully live on both the website
              and the Google Play Store, giving me end-to-end exposure to
              production-grade application development. I hold a Bachelor of
              Engineering degree from Bangalore Institute of Technology and have
              completed a Java Full Stack Development program. Over time, I have
              expanded my skill set beyond academics into modern, in-demand
              technologies through practical project work and professional
              experience.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <div className="space-y-2">
                <div className="flex">
                  <span className="text-gray-400 min-w-28">Name:</span>
                  <span className="text-white">Sanat Buyya</span>
                </div>
                <div className="flex">
                  <span className="text-gray-400 min-w-28">Email:</span>
                  <span className="text-white">sanatbuyya@gmail.com</span>
                </div>
                <div className="flex">
                  <span className="text-gray-400 min-w-28">Experience:</span>
                  <span className="text-white">
                    {calculateExperienceDuration("2025-08-25")}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex">
                  <span className="text-gray-400 min-w-28">Phone:</span>
                  <span className="text-white">+91 6363356214</span>
                </div>
                <div className="flex">
                  <span className="text-gray-400 min-w-28">Location:</span>
                  <span className="text-white">Bengaluru, Karnataka</span>
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
              href="/cv.pdf"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Download CV
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
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
    {
      name: "JDBC",
      icon: (
        <img
          src="https://img.icons8.com/color/48/000000/database.png"
          alt="JDBC"
        />
      ),
      color: "bg-purple-600",
    },
    { name: "SQL / MySQL", icon: <SiMysql />, color: "bg-blue-600" },

    { name: "JavaScript", icon: <FaJs />, color: "bg-yellow-400 text-black" },
    { name: "React JS", icon: <FaReact />, color: "bg-cyan-500" },
    { name: "React Native", icon: <FaReact />, color: "bg-blue-500" },
    { name: "Tailwind CSS", icon: <SiTailwindcss />, color: "bg-cyan-600" },
    { name: "HTML5", icon: <FaHtml5 />, color: "bg-orange-600" },
    { name: "CSS3", icon: <FaCss3Alt />, color: "bg-blue-500" },

    { name: "MongoDB", icon: <SiMongodb />, color: "bg-green-500" },
    { name: "Postman", icon: <SiPostman />, color: "bg-orange-400" },
    { name: "Azure", icon: <VscAzure />, color: "bg-blue-700" },
    { name: "GitHub", icon: <FaGithub />, color: "bg-gray-800" },
  ];

  return (
    <section id="skills" className="py-20 bg-gray-800/50">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12"
        >
          Technical <span className="text-blue-400">Skills</span>
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-blue-400/50 transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl mb-3">{skill.icon}</div>
                <h3 className="font-semibold mb-2">{skill.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Experience Component
const Experience = () => {
  const experiences = [
    {
      company: "Revappayya IT Services Pvt Ltd",
      position: "Full Stack Developer",
      startDate: "2025-08-25",
      location: "Bengaluru",
      description:
        "Working on full-stack development projects using JavaScript, React, and React Native, Node.js. Contributing to building scalable applications and implementing best practices.",
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

  return (
    <section id="experience" className="py-20">
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
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div>
                      <img
                        src={ritsLogo}
                        alt="Revappayya Logo"
                        className="w-16 h-16 mb-4 md:mb-0 rounded"
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
                      {calculateExperienceDuration(exp.startDate)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-400 mb-6">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
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
  const projects = [
    {
      title: "RITS Billing Suite",
      image: ritsBillingSuiteImage,
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
      status: "Ongoing",
    },
    {
      title: "SwapTicket",
      image: swapTicketImage,
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
      image: eCommerceImage,
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
      image: stockMarketImage,
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

  const shouldScroll = projects.length > 3;
  const displayProjects = shouldScroll ? [...projects, ...projects] : projects;

  return (
    <section id="projects" className="py-20 bg-gray-800/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12"
        >
          My <span className="text-blue-400">Projects</span>
        </motion.h2>

        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-8"
            animate={shouldScroll ? { x: ["0%", "-100%"] } : { x: 0 }}
            transition={
              shouldScroll
                ? {
                    duration: 15,
                    ease: "linear",
                    repeat: Infinity,
                  }
                : {}
            }
          >
            {displayProjects.map((project, index) => (
              <div
                key={index}
                className="min-w-[300px] md:min-w-[350px] lg:min-w-[380px]"
              >
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:border-blue-400/50 transition-all duration-300 hover:scale-105 h-full">
                  <div className="h-48 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">🚀</span>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold">{project.title}</h3>
                      <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-xs font-semibold">
                        {project.status}
                      </span>
                    </div>

                    <h4 className="font-semibold text-sm text-gray-400 mb-4">
                      {project.applicationType}
                    </h4>

                    <p className="text-gray-300 mb-6">{project.description}</p>

                    <div>
                      <h4 className="font-semibold mb-3 text-sm text-gray-400">
                        Technologies:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Contact Component
const Contact = () => {
  const [messageSent, setMessageSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessageSent(true);

    try {
      const response = await fetch("https://formspree.io/f/xjkweeby", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Message sent successfully!");
        setMessageSent(false);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "There was a problem sending your message. Please try again later."
      );
    } finally {
      setMessageSent(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-20">
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
                  <p className="text-gray-300">sanatbuyya@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-600/20 border border-blue-400/30 flex items-center justify-center">
                  <MdPhone className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Phone</h3>
                  <p className="text-gray-300">+91 6363356214</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-600/20 border border-blue-400/30 flex items-center justify-center">
                  <MdLocationOn className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Location</h3>
                  <p className="text-gray-300">Bengaluru, Karnataka</p>
                </div>
              </div>

              <div className="pt-8">
                <h3 className="font-semibold text-lg mb-4">Connect with me</h3>
                <div className="flex gap-4">
                  <a
                    href="https://www.linkedin.com/in/sanat-buyya-a32b9b282/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 flex items-center justify-center transition-colors"
                  >
                    <FaLinkedinIn className="text-lg" />
                  </a>
                  <a
                    href="https://github.com/sanat-buyya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 flex items-center justify-center transition-colors"
                  >
                    <FaGithub className="w-5 h-5" />
                  </a>
                  <a
                    href="https://instagram.com/sanat_buyya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 flex items-center justify-center transition-colors"
                  >
                    <FaInstagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UCGxNgzjDA1yISEITXJYBUaw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 flex items-center justify-center transition-colors"
                  >
                    <FaYoutube className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  required
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  rows="4"
                  required
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-400 transition-colors resize-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
              >
                {messageSent ? "Sending..." : "Send Message"}
              </motion.button>
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
    <footer className="py-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Sanat Buyya. All rights reserved.
          </div>
          <div className="text-center">
            <p className="text-gray-300 mb-2">
              Let's build something amazing together!
            </p>
          </div>
          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com/in/sanat-buyya-a32b9b282/"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/sanat-buyya"
              className="text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default App;
