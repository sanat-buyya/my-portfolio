# Sanat Buyya — Portfolio

Personal portfolio of Sanat Buyya, Full Stack Developer (Java, Spring Boot, React, React Native, Node.js).

**Live:** https://sanatbuyya.vercel.app/

## Features

- Single-page portfolio: Home, About, Skills, Experience, Projects, and Contact sections
- Experience duration updates automatically from the start date
- Contact form backed by [Formspree](https://formspree.io/)
- **Ask Sanat AI**: a floating chat assistant that answers questions about skills, projects, experience, and contact details. It runs entirely in the browser; there are no API calls or keys.

## Tech stack

React 19 · Vite 7 · Tailwind CSS 3 · Framer Motion · React Icons · deployed on Vercel

## Getting started

```bash
npm install
npm run dev      # start the dev server at http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build locally
npm run lint     # ESLint
```

## Project structure

```
public/                       images, profile photo, cv.pdf
src/
  App.jsx                     all page sections
  components/ChatAssistant.jsx  chat widget UI
  data/portfolioKnowledge.js  profile, experience, projects, contact (shared data)
  utils/chatEngine.js         matches questions to answers from the shared data
```

## Updating content

- **Experience, contact details, job titles:** edit `src/data/portfolioKnowledge.js`. The page and the chat assistant both read from it.
- **Projects and skills shown on the page:** edit the lists in `src/App.jsx`, and update the matching entries in `portfolioKnowledge.js` so the chat assistant stays in sync.
- **Resume:** replace `public/cv.pdf`.
