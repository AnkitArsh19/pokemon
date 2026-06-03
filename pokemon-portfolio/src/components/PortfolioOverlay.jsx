import { useState, useEffect } from 'react';
import EventBus from '../game/EventBus';
import audioManager from '../data/audioManager';
import '../App.css'; // Add CSS styles there or inline

// The portfolio data mapped by interior
const PORTFOLIO_DATA = {
  house_1: [
    {
      title: 'INTRODUCTION',
      content: 'I am Ankit Arsh. Full Stack Developer.<br/>Backend-heavy systems, production-grade architecture, and interfaces that actually feel good to use.<br/><br/>Currently in my 4th year of B.Tech IT at KIIT, Bhubaneswar.<br/><br/>From Ranchi, Jharkhand.<br/><br/>I do not just write code.<br/><br/>I build things that run in the real world, handle real failures, and solve problems that do not have a clean answer in the documentation.'
    },
    {
      title: 'INTRODUCTION',
      content: 'This map is one of two portfolios I built.<br/><br/>The other one looks like a leather-bound restaurant menu sitting on a dark wooden table, with 3D page-flip physics, bone-based mesh deformation, and dynamic lighting.<br/><br/>If that sounds strange for a portfolio, it is because I tend to treat every project as a chance to learn something I did not know before I started.<br/></br>Explore this map.<br/>Enter the houses.<br/>Catch some Pokemon.'
    }
  ],
  house_2: [
    {
      title: 'ABOUT ME',
      content: 'Outside of code, I draw.<br/><br/>Graphite and charcoal mostly.<br/><br/>Monochromatic studies of whatever catches the eye on that particular day.<br/><br/>Architecture, figures, objects, things that have interesting shadows or structure.<br/><br/>I keep the canvas stark and save the colour for a life well-lived.<br/><br/>I also draw the occasional Pokemon I catch here, but do not tell anyone.'
    },
    {
      title: 'ABOUT ME',
      content: 'I cook.<br/><br/>New dishes, unusual pairings, combinations that have no business working together.<br/><br/>Some experiments fail in genuinely interesting ways.<br/><br/>The failures teach more than the successes.<br/><br/>I also travel when I can.<br/><br/>Chasing new experiences, local flavours, distant landscapes, and the stories of people I would never meet if I stayed in the same place.'
    },
    {
      title: 'ABOUT ME',
      content: 'I write on <a href="https://medium.com/@ankitarsh19" target="_blank" rel="noopener noreferrer">Medium</a> when I understand something well enough to explain it clearly.<br/><br/>The blog is proof of understanding, not a performance of it.<br/><br/>I also built a Pokemon Fire Red replica as a portfolio because building for joy matters just as much as building for work.<br/><br/>You are currently standing inside it.<br/><br/>Which I think makes this entry a little recursive.'
    }
  ],
  house_3: [
    {
      title: 'CRESCENDO',
      content: 'CRESCENDO is a no-code workflow automation engine built entirely from scratch.<br/><br/>Think of it as Zapier, except every architectural decision was made deliberately and documented in my head before a single line was written.<br/><br/>You connect apps, define triggers and multi-step actions, and it runs everything reliably via Redis Streams.<br/><br/>The integration framework is fully data-driven.<br/><br/>Adding a new app requires zero code changes. Only a database entry.'
    },
    {
      title: 'CRESCENDO',
      content: '20 plus integrations are already supported.<br/><br/>Google, Slack, GitHub, Discord, Spotify, OpenAI, and more.<br/><br/>The node-graph workflow builder uses schema-driven form rendering, which means the frontend never needs to change when a new integration is added.<br/><br/>The UI reads the schema from the database and builds itself.<br/><br/>No hardcoded forms.<br/><br/>No frontend deployments per integration.'
    },
    {
      title: 'CRESCENDO',
      content: 'Under the hood, there are some interesting engineering decisions.<br/><br/>Distributed Redis locks are implemented with atomic Lua scripts to prevent race conditions during concurrent execution.<br/><br/>Execution queues use manual ACK rather than auto-acknowledge so a crash does not silently drop jobs.<br/><br/>A PEL reclaim reaper handles recovery.<br/><br/>There is a transactional outbox for guaranteed event delivery, a Dead Letter Queue for failed jobs, and TOTP-based MFA on auth.'
    },
    {
      title: 'CRESCENDO',
      content: 'There is also a full transactional email subsystem with async queue processing, domain verification, and delivery lifecycle tracking built in.<br/><br/>Stack: Spring Boot 4, React 19, PostgreSQL, Redis Streams, Docker, OAuth 2.0, CQRS, Event-Driven Architecture, XYFlow, Cloudflare Tunnel, Azure.<br/><br/>Currently in active production development.<br/><br/>GitHub: <a href="https://github.com/AnkitArsh19/crescendo" target="_blank" rel="noopener noreferrer">github.com/AnkitArsh19/crescendo</a>'
    }
  ],
  house_4: [
    {
      title: 'YAPLAB',
      content: 'YapLab is a production-deployed real-time messaging system built from scratch without relying on any messaging SDK.<br/><br/>Personal and group chats, file sharing across all media types, message threading, typing indicators, and live delivery tracking from SENT to DELIVERED to READ with real-time tick updates.<br/><br/>Everything you would expect from a messaging app, built on raw WebSockets and STOMP protocol over a stateless Spring Boot backend.'
    },
    {
      title: 'YAPLAB',
      content: 'Messages travel instantly between users, making conversations feel seamless.<br/><br/>Real-time communication was a core focus throughout development.<br/><br/>Security was treated as a fundamental requirement, not an afterthought.<br/>The system includes authentication mechanisms to verify users, encryption practices to protect communication, and reliable message handling to ensure consistency.<br/><br/>Every feature was designed with trust and stability in mind.'
    },
    {
      title: 'YAPLAB',
      content: 'All message content is encrypted at rest with AES-256.<br/><br/>CI/CD pipeline runs on GitHub Actions and deploys to Azure App Service.<br/><br/>Stack: Spring Boot 3.4, React 19, WebSocket/STOMP, MySQL, Docker, Azure, GitHub Actions.<br/><br/>GitHub: <a href="https://github.com/AnkitArsh19/yaplab-app" target="_blank" rel="noopener noreferrer">github.com/AnkitArsh19/yaplab-app</a> Live: <a href="https://yaplab.social" target="_blank" rel="noopener noreferrer">yaplab.social</a>'
    }
  ],
  house_5: [
    {
      title: 'KAIZEN',
      content: 'Kaizen is a team e-learning platform.<br/><br/>I was the backend lead and owned the full API surface.<br/><br/>HLS adaptive streaming at multiple resolutions, chunked video upload with resumable sessions, and live OBS/RTMP streaming for real-time class broadcasts.<br/><br/>The kind of system that has a lot of moving parts and requires the backend to be reliable or everything downstream breaks.'
    },
    {
      title: 'KAIZEN',
      content: 'It had a Python FastAPI recommendation service using hybrid content-based and collaborative filtering.<br/><br/>It learns from what users watch and what similar users watch, and blends the two signals to recommend the next course.<br/><br/>On top of that, Sarvam AI was integrated for multi-language support across 9 Indian languages, making the platform accessible to learners who do not communicate primarily in English.'
    },
    {
      title: 'KAIZEN',
      content: 'This project was different from building alone.<br/><br/>I had to design APIs that other team members would consume, make architectural decisions that affected the whole team, and keep the backend stable while the frontend and ML teams built on top of it simultaneously.<br/><br/>Stack: Spring Boot 4, Next.js, FastAPI, Cloudinary, PostgreSQL, Sarvam AI.'
    }
  ],
  house_6: [
    {
      title: 'SIH 2025',
      content: 'Smart India Hackathon 2025.<br/><br/>Team Heisenbugs.<br/><br/>I was the team lead.<br/><br/>Six people across backend, frontend, and AI/ML.<br/><br/>Five days under competition pressure with no room for hesitation.<br/><br/>The kind of environment where decisions have to be made with incomplete information, and changing your mind midway is sometimes the most strategic move available.'
    },
    {
      title: 'SIH 2025',
      content: 'We pivoted the problem statement mid-competition.<br/><br/>The original direction was not going to produce something worth submitting.<br/><br/>We changed course, realigned the team, and rebuilt the approach.<br/><br/>I integrated a RAG pipeline, FAISS vector search, and semantic clustering built by the ML team into the Spring Boot backend.<br/><br/>The system evaluated R and D proposals for NaCCER, CMPDI Ranchi using AI-based scoring and semantic analysis.'
    },
    {
      title: 'SIH 2025',
      content: 'What this competition taught me was that leading a team under real pressure is a completely different skill from writing good code alone.<br/><br/>You are managing energy, unblocking people, making calls that affect everyone, and keeping momentum when things start to slip.<br/><br/>It was genuinely hard.<br/><br/>I would do it again.'
    }
  ],
  house_7: [
    {
      title: 'THE SKILL DOJO',
      content: 'LANGUAGES AND BACKEND<br/><br/>Java, JavaScript, TypeScript, Python, C.<br/><br/>Spring Boot 4, Spring MVC, Spring Security, Spring WebSocket, Spring OAuth2, Spring Data JPA.<br/><br/>REST APIs, WebSockets with STOMP and SockJS, FastAPI.<br/><br/>The backend is where I spend most of my time, and Spring Boot is the framework I know the deepest, including the parts that are not in the official docs.'
    },
    {
      title: 'THE SKILL DOJO',
      content: 'FRONTEND<br/><br/>React 19, Next.js 14, Vite 7, Tailwind CSS.<br/><br/>Zustand for state, Framer Motion for animation, XYFlow for node-graph interfaces, React Hook Form, Zod, React Router.<br/><br/>I build frontends that connect cleanly to complex backends.<br/><br/>I am not primarily a frontend developer, but I can build something that works well and feels good.'
    },
    {
      title: 'THE SKILL DOJO',
      content: 'DATABASES AND INFRASTRUCTURE<br/><br/>PostgreSQL, MySQL.<br/><br/>Redis: Streams, Pub/Sub, Cache, Distributed Locks.<br/><br/>Docker, Docker Compose, GitHub Actions.<br/><br/>Azure App Service, Azure Blob Storage, Azure Static Web Apps, GCP, Cloudflare Tunnel.<br/><br/>I am comfortable with the full deployment pipeline from local development to production on cloud infrastructure.'
    },
    {
      title: 'THE SKILL DOJO',
      content: 'ARCHITECTURE AND SECURITY<br/><br/>CQRS, Domain-Driven Design, Event-Driven Architecture.<br/><br/>Transactional Outbox, Consumer Groups with Manual ACK.<br/><br/>Dead Letter Queue, PEL Reclaim, Distributed Locking with Redis and Lua.<br/><br/>Defensive Webhook Ingestion.<br/><br/>JWT, OAuth 2.0, BCrypt, AES-256/CBC/PKCS5, TOTP/MFA, Stateless Spring Security.'
    }
  ],
  house_8: [
    {
      title: 'THE OTHER PORTFOLIO',
      content: 'There is another version of this portfolio.<br/><br/>It does not look like a game.<br/><br/>It looks like a leather-bound restaurant menu sitting on a dark wooden table.<br/><br/>You open it, and the pages physically flip in 3D.<br/><br/>Warm spotlight light falls across the paper surface. Shadows pool in the spine crease.<br/><br/>Each page is a section, designed like a luxury menu card, with hand-drawn illustrations and vintage typography.'
    },
    {
      title: 'THE OTHER PORTFOLIO',
      content: 'The 3D physics are built on a 30-bone SkinnedMesh rig in Three.js and React Three Fiber.<br/><br/>Each bone controls a segment of the page.<br/><br/>When the page flips, the bones rotate in sequence from the spine outward, creating the curl and tension of real paper bending.<br/><br/>The lighting, textures, and leather grain all react to the scene\'s dynamic spotlight in real time.'
    },
    {
      title: 'THE OTHER PORTFOLIO',
      content: 'Building it turned into a deep dive into WebGL, GPU texture sampling, UV coordinate distortion under bone deformation, and why canvas-rendered text goes blurry on curved mesh surfaces.<br/><br/>An art project that was also an architecture problem.<br/><br/>The two portfolios exist because different ideas deserve different forms.<br/><br/>The menu portfolio link is in the Contact house.<br/><br/>Visit - <a href="https://ankitarsh.me" target="_blank" rel="noopener noreferrer">ankitarsh.me</a>'
    }
  ],
  house_9: [
    {
      title: 'THE RECIPE BOOK',
      content: 'I write on <a href="https://medium.com/@ankitarsh19" target="_blank" rel="noopener noreferrer">Medium</a> about the systems I build. To understand.<br/><br/>Writing forces a level of clarity that building alone does not.<br/><br/>If I can explain why a Transactional Outbox pattern exists, why I chose it over alternatives, and what breaks without it, then I actually understand distributed systems.<br/><br/>If I cannot explain it simply, I go back and learn it again.<br/><br/>The blog is proof of understanding.'
    },
    {
      title: 'THE RECIPE BOOK',
      content: 'Topics covered so far include distributed architecture, Spring Boot internals, event-driven design, workflow automation, database design, real-time communication, etc.<br/><br/>Many articles are based on real projects, covering challenges faced, solutions implemented, and insights gained throughout the development process.<br/><br/>Read at: <a href="https://medium.com/@ankitarsh19" target="_blank" rel="noopener noreferrer">medium.com/@ankitarsh19</a>'
    }
  ],
  house_10: [
    {
      title: 'POKECENTRE DIRECTORY',
      content: 'Want to find me outside this map?<br/><br/>Here is where I actually exist.<br/><br/>Email: <a href="mailto:ankitarsh19@gmail.com">ankitarsh19@gmail.com</a><br/><br/>Location: Ranchi, Jharkhand<br/><br/>I check email.<br/><br/>I respond to interesting things.<br/><br/>Boring things still get a reply, just slower.'
    },
    {
      title: 'POKECENTRE DIRECTORY',
      content: 'GitHub: <a href="https://github.com/AnkitArsh19" target="_blank" rel="noopener noreferrer">github.com/AnkitArsh19</a><br/><br/>LinkedIn: <a href="https://linkedin.com/in/ankitarsh19" target="_blank" rel="noopener noreferrer">linkedin.com/in/ankitarsh19</a><br/><br/>Medium: <a href="https://medium.com/@ankitarsh19" target="_blank" rel="noopener noreferrer">medium.com/@ankitarsh19</a><br/><br/>X / Twitter: <a href="https://x.com/AnkitArsh19" target="_blank" rel="noopener noreferrer">x.com/AnkitArsh19</a><br/><br/>Instagram: <a href="https://instagram.com/ankit_arsh19" target="_blank" rel="noopener noreferrer">instagram.com/ankit_arsh19</a>'
    },
    {
      title: 'POKECENTRE DIRECTORY',
      content: 'Open for full-time roles, internships, and problems that do not have an obvious answer.<br/><br/>Currently in my 4th year at KIIT, Bhubaneswar.<br/><br/>Graduating 2027.<br/><br/>If you found this portfolio by actually playing the game, exploring the map, entering houses, and reading signs, I appreciate that more than I can express in a text box.<br/><br/>That is exactly the kind of person I want to work with.'
    }
  ]
};

export default function PortfolioOverlay() {
  const [visible, setVisible] = useState(false);
  const [interiorKey, setInteriorKey] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    const unsubOpen = EventBus.on('openPortfolioOverlay', (data) => {
      setInteriorKey(data.interiorKey);
      setPage(0);
      setVisible(true);
      EventBus.emit('blockInput');
      audioManager.play('guide', true);
    });

    return () => {
      unsubOpen();
    };
  }, []);

  const data = PORTFOLIO_DATA[interiorKey] || PORTFOLIO_DATA.house_1;
  const currentPage = data[page];

  const handleNext = () => {
    setPage((prev) => (prev + 1) % data.length);
  };

  const handleBack = () => {
    setPage((prev) => (prev - 1 + data.length) % data.length);
  };

  const handleClose = () => {
    setVisible(false);
    EventBus.emit('unblockInput');
    EventBus.emit('closePortfolioOverlay');
    audioManager.play('pallet_town', true);
  };

  useEffect(() => {
    if (!visible) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'Escape' || e.key === 'Backspace') {
        handleBack();
      } else if (e.key === 'x' || e.key === 'z') {
        if (e.key === 'x') {
          handleClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, data.length]);

  if (!visible) return null;

  return (
    <div className="portfolio-overlay" onClick={handleClose}>
      <div
        className="portfolio-container"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the box itself
      >
        <img
          src="./assets/ui/information_screen.png"
          alt="Information Screen"
          className="portfolio-bg"
        />

        {/* Next Button Overlay (Top Right area of the image) */}
        <div
          className="portfolio-btn next-btn"
          onClick={handleNext}
          style={{ cursor: 'pointer' }}
        ></div>

        {/* Back Button Overlay (Top Left area of the image) */}
        <div
          className="portfolio-btn back-btn"
          onClick={handleBack}
          style={{ cursor: 'pointer' }}
        ></div>

        {/* Close Button (Bottom Right area or top right corner) */}
        <div className="portfolio-btn close-btn" onClick={handleClose}>
          ✖
        </div>

        {/* Content Area */}
        <div className="portfolio-content">
          <h2>{currentPage.title}</h2>
          <p dangerouslySetInnerHTML={{ __html: currentPage.content }}></p>
          <div className="page-indicator">Page {page + 1} of {data.length}</div>
        </div>
      </div>
    </div>
  );
}
