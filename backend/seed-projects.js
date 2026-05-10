// Run this script in mongosh (the MongoDB Shell)
// mongosh "your_connection_string" < seed-projects.js

const dbName = 'test'; // Change this if your database name is different
db = db.getSiblingDB(dbName);

// Clear existing projects if you want a fresh start (optional, uncomment to use)
// db.projects.deleteMany({});

const cohorts = {
  webDev: ObjectId("6819e100a1b2c3d4e5f60001"),
  cyber: ObjectId("6819e100a1b2c3d4e5f60002"),
  ai: ObjectId("6819e100a1b2c3d4e5f60003"),
  dsa: ObjectId("6819e100a1b2c3d4e5f60004")
};

const users = {
  sneha: ObjectId("6819d100a1b2c3d4e5f70004"),
  aditya: ObjectId("6819d100a1b2c3d4e5f70005"),
  kavya: ObjectId("6819d100a1b2c3d4e5f70006"),
  vikram: ObjectId("6819d100a1b2c3d4e5f70007")
};

const now = new Date();
const deadline1 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 days
const deadline2 = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000); // +60 days

const projects = [
  // --- COHORT 1: Web Dev ---
  {
    title: "NextJS E-Commerce Platform",
    pitch: "A full-stack e-commerce site with Stripe integration and TailwindCSS.",
    description: "Looking for frontend and backend developers to build a modern e-commerce platform. We will use Next.js, Node, MongoDB, and Stripe for payments.",
    problemStatement: "Small businesses struggle with high fees on platforms like Shopify. We want to build an open-source alternative.",
    techStack: ["Next.js", "React", "Node.js", "MongoDB", "TailwindCSS"],
    cohortId: cohorts.webDev,
    hostId: users.sneha,
    status: "hiring",
    progress: 0,
    deadline: deadline1,
    maxParticipants: 5,
    currentParticipants: 1, // the host
    roles: [
      {
        _id: new ObjectId(),
        title: "Frontend Developer",
        description: "Build the UI components using React and Tailwind.",
        skillsRequired: ["React", "CSS", "Tailwind"],
        filled: false
      },
      {
        _id: new ObjectId(),
        title: "Backend Developer",
        description: "Setup API endpoints and Stripe webhooks.",
        skillsRequired: ["Node.js", "Express", "MongoDB"],
        filled: false
      }
    ],
    milestones: [],
    createdAt: now,
    updatedAt: now
  },
  {
    title: "Real-time Collaborative Whiteboard",
    pitch: "WebSocket-based collaborative drawing tool.",
    description: "A Miro-clone allowing multiple users to draw on the same canvas in real-time.",
    problemStatement: "Existing tools are too heavy. We need a lightweight, fast alternative.",
    techStack: ["React", "Socket.io", "Canvas API", "Node.js"],
    cohortId: cohorts.webDev,
    hostId: users.aditya,
    status: "in-progress",
    progress: 35,
    deadline: deadline2,
    maxParticipants: 4,
    currentParticipants: 2,
    roles: [
      {
        _id: new ObjectId(),
        title: "Socket.io Expert",
        description: "Handle the real-time syncing logic.",
        skillsRequired: ["Socket.io", "Node.js"],
        filled: true,
        assignedUserId: users.kavya
      },
      {
        _id: new ObjectId(),
        title: "Canvas UI Developer",
        description: "Handle the HTML5 Canvas interactions.",
        skillsRequired: ["React", "Canvas API"],
        filled: false
      }
    ],
    milestones: [
      {
        _id: new ObjectId(),
        name: "Basic Canvas Setup",
        description: "Setup the drawing board locally.",
        status: "completed",
        progress: 100,
        assigneeId: users.aditya
      },
      {
        _id: new ObjectId(),
        name: "WebSocket Integration",
        description: "Sync mouse movements.",
        status: "in-progress",
        progress: 50,
        assigneeId: users.kavya
      }
    ],
    createdAt: now,
    updatedAt: now
  },
  {
    title: "Task Management Dashboard",
    pitch: "A Kanban board clone with drag-and-drop features.",
    description: "Building a simpler alternative to Jira for small teams.",
    problemStatement: "Jira is too complex. Trello is too simple.",
    techStack: ["React", "Redux", "Firebase"],
    cohortId: cohorts.webDev,
    hostId: users.kavya,
    status: "hiring",
    progress: 0,
    deadline: deadline1,
    maxParticipants: 3,
    currentParticipants: 1,
    roles: [
      {
        _id: new ObjectId(),
        title: "Frontend Dev",
        description: "Implement drag and drop.",
        skillsRequired: ["React", "dnd-kit"],
        filled: false
      }
    ],
    milestones: [],
    createdAt: now,
    updatedAt: now
  },

  // --- COHORT 2: Cyber Security ---
  {
    title: "Vulnerability Scanner CLI",
    pitch: "Automated vulnerability scanner in Python.",
    description: "A command-line tool to scan ports and identify outdated services.",
    problemStatement: "Many open-source tools are too noisy. We want to build a targeted scanner.",
    techStack: ["Python", "Nmap API", "Bash"],
    cohortId: cohorts.cyber,
    hostId: users.vikram,
    status: "in-progress",
    progress: 60,
    deadline: deadline2,
    maxParticipants: 3,
    currentParticipants: 2,
    roles: [
      {
        _id: new ObjectId(),
        title: "Python Scripting",
        description: "Write the core scanning modules.",
        skillsRequired: ["Python", "Networking"],
        filled: true,
        assignedUserId: users.sneha
      }
    ],
    milestones: [],
    createdAt: now,
    updatedAt: now
  },
  {
    title: "Network Traffic Analyzer",
    pitch: "Packet sniffer and analyzer with a web dashboard.",
    description: "Capture and analyze network packets to detect anomalies.",
    problemStatement: "Wireshark is great but hard to read for beginners.",
    techStack: ["Python", "Scapy", "React", "Flask"],
    cohortId: cohorts.cyber,
    hostId: users.sneha,
    status: "hiring",
    progress: 0,
    deadline: deadline1,
    maxParticipants: 4,
    currentParticipants: 1,
    roles: [
      {
        _id: new ObjectId(),
        title: "Backend Engineer",
        description: "Process packets via Scapy.",
        skillsRequired: ["Python", "Scapy"],
        filled: false
      },
      {
        _id: new ObjectId(),
        title: "Frontend Engineer",
        description: "Visualize data in React.",
        skillsRequired: ["React", "Chart.js"],
        filled: false
      }
    ],
    milestones: [],
    createdAt: now,
    updatedAt: now
  },
  {
    title: "Zero Trust Architecture Demo",
    pitch: "Implement zero-trust architecture concepts in a demo lab.",
    description: "Creating a virtual environment to demonstrate zero-trust principles.",
    problemStatement: "Companies struggle to understand zero trust. This provides a visual playground.",
    techStack: ["Docker", "Kubernetes", "Linux", "Nginx"],
    cohortId: cohorts.cyber,
    hostId: users.aditya,
    status: "hiring",
    progress: 0,
    deadline: deadline2,
    maxParticipants: 3,
    currentParticipants: 1,
    roles: [
      {
        _id: new ObjectId(),
        title: "DevOps Engineer",
        description: "Setup the Docker containers.",
        skillsRequired: ["Docker", "Networking"],
        filled: false
      }
    ],
    milestones: [],
    createdAt: now,
    updatedAt: now
  },

  // --- COHORT 3: AI & Machine Learning ---
  {
    title: "Sentiment Analysis Trading Bot",
    pitch: "Analyze Twitter sentiment to predict stock movement.",
    description: "A bot that reads financial news and tweets to gauge market sentiment.",
    problemStatement: "Retail traders lack access to fast sentiment analysis.",
    techStack: ["Python", "NLP", "TensorFlow", "Pandas"],
    cohortId: cohorts.ai,
    hostId: users.aditya,
    status: "in-progress",
    progress: 40,
    deadline: deadline1,
    maxParticipants: 4,
    currentParticipants: 3,
    roles: [
      {
        _id: new ObjectId(),
        title: "Data Scientist",
        description: "Train the NLP model.",
        skillsRequired: ["TensorFlow", "Python"],
        filled: true,
        assignedUserId: users.kavya
      },
      {
        _id: new ObjectId(),
        title: "Data Engineer",
        description: "Scrape Twitter and News sites.",
        skillsRequired: ["Python", "BeautifulSoup"],
        filled: true,
        assignedUserId: users.vikram
      },
      {
        _id: new ObjectId(),
        title: "Backend Developer",
        description: "Serve the model via API.",
        skillsRequired: ["FastAPI", "Python"],
        filled: false
      }
    ],
    milestones: [],
    createdAt: now,
    updatedAt: now
  },
  {
    title: "Medical Image Diagnosis Assistant",
    pitch: "CNN based model to detect anomalies in X-Rays.",
    description: "Using PyTorch to build a classification model for medical images.",
    problemStatement: "Doctors are overworked, AI can assist in initial screening.",
    techStack: ["PyTorch", "Python", "OpenCV"],
    cohortId: cohorts.ai,
    hostId: users.kavya,
    status: "hiring",
    progress: 0,
    deadline: deadline2,
    maxParticipants: 3,
    currentParticipants: 1,
    roles: [
      {
        _id: new ObjectId(),
        title: "ML Engineer",
        description: "Design the CNN architecture.",
        skillsRequired: ["PyTorch", "Deep Learning"],
        filled: false
      }
    ],
    milestones: [],
    createdAt: now,
    updatedAt: now
  },
  {
    title: "Course Recommendation Engine",
    pitch: "Movie recommendation system but for our LMS.",
    description: "Analyze user profiles to suggest the best courses.",
    problemStatement: "Students don't know what to learn next.",
    techStack: ["Python", "Scikit-Learn", "MongoDB"],
    cohortId: cohorts.ai,
    hostId: users.vikram,
    status: "hiring",
    progress: 0,
    deadline: deadline1,
    maxParticipants: 2,
    currentParticipants: 1,
    roles: [
      {
        _id: new ObjectId(),
        title: "Data Analyst",
        description: "Clean the dataset.",
        skillsRequired: ["Pandas", "SQL"],
        filled: false
      }
    ],
    milestones: [],
    createdAt: now,
    updatedAt: now
  },

  // --- COHORT 4: Data Structures & CP ---
  {
    title: "Algorithm Visualizer App",
    pitch: "Visualize sorting and graph algorithms in the browser.",
    description: "A React app to step through algorithms like Dijkstra's visually.",
    problemStatement: "Reading code is hard. Seeing it execute makes it easier to learn.",
    techStack: ["React", "TypeScript", "CSS Animations"],
    cohortId: cohorts.dsa,
    hostId: users.kavya,
    status: "in-progress",
    progress: 80,
    deadline: deadline1,
    maxParticipants: 3,
    currentParticipants: 2,
    roles: [
      {
        _id: new ObjectId(),
        title: "Algorithm Expert",
        description: "Write the step-by-step logic for the visualizer.",
        skillsRequired: ["DSA", "JavaScript"],
        filled: true,
        assignedUserId: users.sneha
      },
      {
        _id: new ObjectId(),
        title: "UI Designer",
        description: "Make the UI look great.",
        skillsRequired: ["CSS", "Figma"],
        filled: false
      }
    ],
    milestones: [],
    createdAt: now,
    updatedAt: now
  },
  {
    title: "Discord CP Contest Bot",
    pitch: "Discord bot for fetching competitive programming contests.",
    description: "A bot that pings servers when Codeforces/LeetCode contests are about to start.",
    problemStatement: "We keep missing contest start times.",
    techStack: ["Node.js", "Discord.js", "REST APIs"],
    cohortId: cohorts.dsa,
    hostId: users.sneha,
    status: "hiring",
    progress: 0,
    deadline: deadline2,
    maxParticipants: 2,
    currentParticipants: 1,
    roles: [
      {
        _id: new ObjectId(),
        title: "Node Developer",
        description: "Help build the API integration.",
        skillsRequired: ["Node.js", "Discord.js"],
        filled: false
      }
    ],
    milestones: [],
    createdAt: now,
    updatedAt: now
  },
  {
    title: "LeetCode Pattern Generator",
    pitch: "Generate similar questions to practice a specific pattern.",
    description: "A tool that groups questions by pattern (Sliding Window, Two Pointers) and generates quizzes.",
    problemStatement: "Doing random questions is inefficient. Pattern practice is better.",
    techStack: ["Python", "React", "MongoDB"],
    cohortId: cohorts.dsa,
    hostId: users.vikram,
    status: "hiring",
    progress: 0,
    deadline: deadline1,
    maxParticipants: 4,
    currentParticipants: 1,
    roles: [
      {
        _id: new ObjectId(),
        title: "Data Scraper",
        description: "Scrape question metadata.",
        skillsRequired: ["Python", "Selenium"],
        filled: false
      },
      {
        _id: new ObjectId(),
        title: "Frontend Dev",
        description: "Build the quiz interface.",
        skillsRequired: ["React", "TypeScript"],
        filled: false
      }
    ],
    milestones: [],
    createdAt: now,
    updatedAt: now
  }
];

const result = db.projects.insertMany(projects);
print("Successfully inserted " + result.insertedIds.length + " projects.");
