import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';

// Force use of Google DNS to resolve Atlas SRV records if local DNS fails
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load env vars from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://peerquiz:Qwerty13579@peer.8zojvsr.mongodb.net/test';

// --- SCHEMAS ---

const RoleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skillsRequired: [{ type: String }],
  filled: { type: Boolean, default: false },
  assignedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const MilestoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['completed', 'in-progress', 'pending'], default: 'pending' },
  assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  progress: { type: Number, default: 0 },
});

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  pitch: { type: String, required: true },
  description: { type: String, required: true },
  problemStatement: { type: String, required: true },
  techStack: [{ type: String }],
  cohortId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cohort', required: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roles: [RoleSchema],
  status: { type: String, enum: ['hiring', 'in-progress', 'completed', 'archived'], default: 'hiring' },
  progress: { type: Number, default: 0 },
  milestones: [MilestoneSchema],
  deadline: { type: Date, required: true },
  maxParticipants: { type: Number, default: 5 },
  currentParticipants: { type: Number, default: 0 },
}, { timestamps: true });

const Project = mongoose.model('Project', ProjectSchema);

const TaskSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['todo', 'in-progress', 'in-review', 'revision', 'done'], default: 'todo' },
  submissions: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fileUrl: String,
    fileName: String,
    description: String,
    submittedAt: { type: Date, default: Date.now },
    reviewStatus: { type: String, enum: ['pending', 'approved', 'needs-revision'], default: 'pending' },
    version: { type: Number, default: 1 },
    feedback: [{
      authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      comment: String,
      type: { type: String, enum: ['approval', 'revision', 'general'] },
      createdAt: { type: Date, default: Date.now }
    }]
  }],
  dueDate: { type: Date, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema);

const ProjectActivitySchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['task_rejected', 'new_applicant', 'deadline', 'task_submitted', 'accepted', 'review_given', 'milestone_completed', 'general'], default: 'general' },
  message: { type: String, required: true },
  detail: String,
  actionUrl: String,
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

const ProjectActivity = mongoose.model('ProjectActivity', ProjectActivitySchema);

const ApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  roleId: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: { type: String, enum: ['pending', 'reviewing', 'shortlisted', 'hired', 'rejected'], default: 'pending' },
  resumeUrl: { type: String, required: true },
  portfolioUrl: String,
  coverNote: { type: String, required: true },
  appliedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Application = mongoose.model('Application', ApplicationSchema);

// --- IDS & DATA ---

const cohorts = {
  webDev: new mongoose.Types.ObjectId("6819e100a1b2c3d4e5f60001"),
  cyber: new mongoose.Types.ObjectId("6819e100a1b2c3d4e5f60002"),
  ai: new mongoose.Types.ObjectId("6819e100a1b2c3d4e5f60003"),
  dsa: new mongoose.Types.ObjectId("6819e100a1b2c3d4e5f60004")
};

const users = {
  sneha: new mongoose.Types.ObjectId("6819d100a1b2c3d4e5f70004"),
  aditya: new mongoose.Types.ObjectId("6819d100a1b2c3d4e5f70005"),
  kavya: new mongoose.Types.ObjectId("6819d100a1b2c3d4e5f70006"),
  vikram: new mongoose.Types.ObjectId("6819d100a1b2c3d4e5f70007")
};

const now = new Date();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const deadline1 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
const deadline2 = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

const projectData = [
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
    progress: 10,
    deadline: deadline1,
    maxParticipants: 5,
    currentParticipants: 1,
    roles: [
      { _id: new mongoose.Types.ObjectId(), title: "Frontend Developer", description: "Build the UI components using React and Tailwind.", skillsRequired: ["React", "CSS", "Tailwind"], filled: false },
      { _id: new mongoose.Types.ObjectId(), title: "Backend Developer", description: "Setup API endpoints and Stripe webhooks.", skillsRequired: ["Node.js", "Express", "MongoDB"], filled: false }
    ],
    milestones: [{ name: "Design Phase", description: "Figma designs.", status: "completed", progress: 100, assigneeId: users.sneha }]
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
    progress: 45,
    deadline: deadline2,
    maxParticipants: 4,
    currentParticipants: 2,
    roles: [
      { _id: new mongoose.Types.ObjectId(), title: "Socket.io Expert", description: "Handle the real-time syncing logic.", skillsRequired: ["Socket.io", "Node.js"], filled: true, assignedUserId: users.kavya },
      { _id: new mongoose.Types.ObjectId(), title: "Canvas UI Developer", description: "Handle the HTML5 Canvas interactions.", skillsRequired: ["React", "Canvas API"], filled: false }
    ],
    milestones: [
      { name: "Setup Server", description: "Node server with Socket.io.", status: "completed", progress: 100, assigneeId: users.aditya },
      { name: "Live Sync", description: "Sync cursor movements.", status: "in-progress", progress: 60, assigneeId: users.kavya }
    ]
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
      { _id: new mongoose.Types.ObjectId(), title: "Frontend Dev", description: "Implement drag and drop.", skillsRequired: ["React", "dnd-kit"], filled: false }
    ],
    milestones: []
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
      { _id: new mongoose.Types.ObjectId(), title: "Python Scripting", description: "Write the core scanning modules.", skillsRequired: ["Python", "Networking"], filled: true, assignedUserId: users.sneha }
    ],
    milestones: []
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
      { _id: new mongoose.Types.ObjectId(), title: "Backend Engineer", description: "Process packets via Scapy.", skillsRequired: ["Python", "Scapy"], filled: false },
      { _id: new mongoose.Types.ObjectId(), title: "Frontend Engineer", description: "Visualize data in React.", skillsRequired: ["React", "Chart.js"], filled: false }
    ],
    milestones: []
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
      { _id: new mongoose.Types.ObjectId(), title: "Data Scientist", description: "Train the NLP model.", skillsRequired: ["TensorFlow", "Python"], filled: true, assignedUserId: users.kavya },
      { _id: new mongoose.Types.ObjectId(), title: "Data Engineer", description: "Scrape Twitter and News sites.", skillsRequired: ["Python", "BeautifulSoup"], filled: true, assignedUserId: users.vikram },
      { _id: new mongoose.Types.ObjectId(), title: "Backend Developer", description: "Serve the model via API.", skillsRequired: ["FastAPI", "Python"], filled: false }
    ],
    milestones: []
  },

  // --- COHORT 4: DSA ---
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
      { _id: new mongoose.Types.ObjectId(), title: "Algorithm Expert", description: "Write the step-by-step logic for the visualizer.", skillsRequired: ["DSA", "JavaScript"], filled: true, assignedUserId: users.sneha },
      { _id: new mongoose.Types.ObjectId(), title: "UI Designer", description: "Make the UI look great.", skillsRequired: ["CSS", "Figma"], filled: false }
    ],
    milestones: []
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    // Cleanup
    await Promise.all([
      Project.deleteMany({}),
      Task.deleteMany({}),
      ProjectActivity.deleteMany({}),
      Application.deleteMany({})
    ]);
    console.log('Database cleaned.');

    // Insert Projects
    const insertedProjects = await Project.insertMany(projectData);
    console.log(`Inserted ${insertedProjects.length} projects.`);

    const ecommerce = insertedProjects[0];
    const whiteboard = insertedProjects[1];
    const tradingBot = insertedProjects[5];
    const visualizer = insertedProjects[6];

    // --- SEED TASKS ---
    console.log('Seeding Tasks...');
    const tasks = [
      {
        projectId: whiteboard._id,
        assigneeId: users.kavya,
        title: "Implement Heartbeat Mechanism",
        description: "Ensure clients stay connected and reconnect gracefully.",
        status: "done",
        priority: "high",
        dueDate: yesterday,
        submissions: [{
          userId: users.kavya,
          fileUrl: "https://github.com/test/repo/pull/1",
          fileName: "heartbeat-logic.js",
          description: "Implemented basic ping-pong check.",
          reviewStatus: "approved",
          feedback: [{ authorId: users.aditya, comment: "Looks solid. Approved.", type: "approval" }]
        }]
      },
      {
        projectId: whiteboard._id,
        assigneeId: users.kavya,
        title: "Refactor Canvas Drawing Logic",
        description: "Optimize for higher frame rates on mobile.",
        status: "in-review",
        priority: "medium",
        dueDate: now,
        submissions: [{
          userId: users.kavya,
          fileUrl: "https://github.com/test/repo/pull/2",
          fileName: "optimized-canvas.tsx",
          description: "Switched to requestAnimationFrame.",
          reviewStatus: "pending",
          feedback: []
        }]
      },
      {
        projectId: tradingBot._id,
        assigneeId: users.vikram,
        title: "Twitter API Integration",
        description: "Fetch last 100 tweets for given stock tickers.",
        status: "in-progress",
        priority: "high",
        dueDate: deadline1,
        submissions: []
      },
      {
        projectId: visualizer._id,
        assigneeId: users.sneha,
        title: "Dijkstra's Visualizer",
        description: "Add step-by-step visualization for shortest path.",
        status: "revision",
        priority: "high",
        dueDate: yesterday,
        submissions: [{
          userId: users.sneha,
          fileUrl: "https://github.com/test/repo/pull/5",
          fileName: "dijkstra-v1.ts",
          description: "Initial implementation.",
          reviewStatus: "needs-revision",
          version: 1,
          feedback: [{ authorId: users.kavya, comment: "Need to highlight the current node being visited.", type: "revision" }]
        }]
      }
    ];
    await Task.insertMany(tasks);

    // --- SEED APPLICATIONS ---
    console.log('Seeding Applications...');
    const apps = [
      {
        userId: users.aditya,
        projectId: ecommerce._id,
        roleId: ecommerce.roles[0]._id,
        status: "pending",
        resumeUrl: "https://drive.google.com/resume_aditya.pdf",
        coverNote: "I have 2 years of experience with React and I'd love to contribute."
      },
      {
        userId: users.vikram,
        projectId: ecommerce._id,
        roleId: ecommerce.roles[1]._id,
        status: "reviewing",
        resumeUrl: "https://drive.google.com/resume_vikram.pdf",
        coverNote: "Express and Mongo are my specialties."
      }
    ];
    await Application.insertMany(apps);

    // --- SEED ACTIVITIES ---
    console.log('Seeding Activities...');
    const activities = [
      { projectId: whiteboard._id, userId: users.kavya, type: "task_submitted", message: "Kavya submitted a task for review", detail: "Refactor Canvas Drawing Logic", timestamp: yesterday },
      { projectId: whiteboard._id, userId: users.aditya, type: "accepted", message: "Aditya approved a task", detail: "Implement Heartbeat Mechanism", timestamp: lastWeek },
      { projectId: ecommerce._id, userId: users.aditya, type: "new_applicant", message: "New application from Aditya", detail: "Frontend Developer", timestamp: now },
      { projectId: visualizer._id, userId: users.kavya, type: "review_given", message: "Kavya requested revision on a task", detail: "Dijkstra's Visualizer", timestamp: yesterday },
      { projectId: whiteboard._id, userId: users.aditya, type: "milestone_completed", message: "Milestone reached: Setup Server", detail: "Completed by Aditya", timestamp: lastWeek }
    ];
    await ProjectActivity.insertMany(activities);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
