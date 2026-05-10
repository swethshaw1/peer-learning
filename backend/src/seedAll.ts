import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';
import bcrypt from 'bcryptjs';

// Force use of Google DNS to resolve Atlas SRV records if local DNS fails
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load env vars from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://peerquiz:Qwerty13579@peer.8zojvsr.mongodb.net/test';

// --- MODELS ---
import User from './models/User';
import Cohort from './models/Cohort';
import Project from './models/Project';
import Task from './models/Task';
import ProjectActivity from './models/ProjectActivity';
import Application from './models/Application';

// --- IDS ---
const cohortsIds = {
  webDev: new mongoose.Types.ObjectId("6819e100a1b2c3d4e5f60001"),
  cyber: new mongoose.Types.ObjectId("6819e100a1b2c3d4e5f60002"),
  ai: new mongoose.Types.ObjectId("6819e100a1b2c3d4e5f60003"),
  dsa: new mongoose.Types.ObjectId("6819e100a1b2c3d4e5f60004")
};

const userIds = {
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

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    // Cleanup
    console.log('Cleaning database...');
    await Promise.all([
      User.deleteMany({}),
      Cohort.deleteMany({}),
      Project.deleteMany({}),
      Task.deleteMany({}),
      ProjectActivity.deleteMany({}),
      Application.deleteMany({})
    ]);

    // --- SEED USERS ---
    console.log('Seeding Users...');
    const password = await bcrypt.hash('Demo!123', 12);
    const userData = [
      { _id: userIds.sneha, name: "Sneha Kapoor", email: "sneha@example.com", password, role: "student", points: 1250, skills: ["React", "Node.js", "TypeScript"] },
      { _id: userIds.aditya, name: "Aditya Verma", email: "aditya@example.com", password, role: "student", points: 980, skills: ["Python", "Flask", "Machine Learning"] },
      { _id: userIds.kavya, name: "Kavya Iyer", email: "kavya@example.com", password, role: "student", points: 1100, skills: ["Java", "Spring Boot", "DSA"] },
      { _id: userIds.vikram, name: "Vikram Singh", email: "vikram@example.com", password, role: "student", points: 850, skills: ["C++", "Cyber Security", "Networking"] }
    ];
    await User.insertMany(userData);

    // --- SEED COHORTS ---
    console.log('Seeding Cohorts...');
    const cohortData = [
      { _id: cohortsIds.webDev, name: "Full Stack Web Development", description: "Master the MERN stack.", tags: ["React", "Node", "MongoDB"], members: [userIds.sneha, userIds.aditya, userIds.kavya, userIds.vikram] },
      { _id: cohortsIds.cyber, name: "Cyber Security & Ethical Hacking", description: "Learn to protect systems.", tags: ["Networking", "Security", "Python"], members: [userIds.vikram, userIds.sneha] },
      { _id: cohortsIds.ai, name: "AI & Machine Learning", description: "Build intelligent systems.", tags: ["Python", "TensorFlow", "Pandas"], members: [userIds.aditya, userIds.kavya] },
      { _id: cohortsIds.dsa, name: "Data Structures & Algorithms", description: "Ace your coding interviews.", tags: ["Java", "C++", "Interview Prep"], members: [userIds.kavya, userIds.sneha] }
    ];
    await Cohort.insertMany(cohortData);

    // --- SEED PROJECTS ---
    console.log('Seeding Projects...');
    const projectData = [
      {
        title: "NextJS E-Commerce Platform",
        pitch: "A full-stack e-commerce site with Stripe integration.",
        description: "Looking for developers to build a modern e-commerce platform.",
        problemStatement: "Small businesses struggle with high fees on platforms like Shopify.",
        techStack: ["Next.js", "React", "Node.js", "MongoDB"],
        cohortId: cohortsIds.webDev,
        hostId: userIds.sneha,
        status: "hiring",
        progress: 10,
        deadline: deadline1,
        maxParticipants: 5,
        currentParticipants: 1,
        roles: [
          { _id: new mongoose.Types.ObjectId(), title: "Frontend Developer", description: "Build the UI.", skillsRequired: ["React"], filled: false },
          { _id: new mongoose.Types.ObjectId(), title: "Backend Developer", description: "Setup API.", skillsRequired: ["Node.js"], filled: false }
        ],
        milestones: [{ name: "Design Phase", description: "Figma designs.", status: "completed", progress: 100, assigneeId: userIds.sneha }]
      },
      {
        title: "Real-time Collaborative Whiteboard",
        pitch: "WebSocket-based drawing tool.",
        description: "Miro-clone for real-time collaboration.",
        problemStatement: "Need a lightweight whiteboard for quick brainstorming.",
        techStack: ["React", "Socket.io", "Node.js"],
        cohortId: cohortsIds.webDev,
        hostId: userIds.aditya,
        status: "in-progress",
        progress: 45,
        deadline: deadline2,
        maxParticipants: 4,
        currentParticipants: 2,
        roles: [
          { _id: new mongoose.Types.ObjectId(), title: "Socket.io Expert", description: "Sync cursor movements.", skillsRequired: ["Socket.io"], filled: true, assignedUserId: userIds.kavya },
          { _id: new mongoose.Types.ObjectId(), title: "Canvas UI Developer", description: "Drawing logic.", skillsRequired: ["React"], filled: false }
        ],
        milestones: [
          { name: "Setup Server", description: "Node server with Socket.io.", status: "completed", progress: 100, assigneeId: userIds.aditya },
          { name: "Live Sync", description: "Sync cursor movements.", status: "in-progress", progress: 60, assigneeId: userIds.kavya }
        ]
      },
      {
        title: "Sentiment Analysis Trading Bot",
        pitch: "Analyze news sentiment for stocks.",
        description: "NLP model to predict stock trends.",
        problemStatement: "Retail traders lack fast sentiment data.",
        techStack: ["Python", "TensorFlow", "Pandas"],
        cohortId: cohortsIds.ai,
        hostId: userIds.aditya,
        status: "in-progress",
        progress: 30,
        deadline: deadline1,
        maxParticipants: 4,
        currentParticipants: 3,
        roles: [
          { _id: new mongoose.Types.ObjectId(), title: "Data Scientist", description: "Train model.", skillsRequired: ["TensorFlow"], filled: true, assignedUserId: userIds.kavya },
          { _id: new mongoose.Types.ObjectId(), title: "Data Engineer", description: "Scrape data.", skillsRequired: ["Python"], filled: true, assignedUserId: userIds.vikram }
        ]
      },
      {
        title: "Algorithm Visualizer App",
        pitch: "Visualize algorithms in the browser.",
        description: "Interactive visualizer for DSA learning.",
        problemStatement: "Learning DSA is easier with visual feedback.",
        techStack: ["React", "TypeScript"],
        cohortId: cohortsIds.dsa,
        hostId: userIds.kavya,
        status: "in-progress",
        progress: 75,
        deadline: deadline1,
        maxParticipants: 3,
        currentParticipants: 2,
        roles: [
          { _id: new mongoose.Types.ObjectId(), title: "Algorithm Expert", description: "Logic for steps.", skillsRequired: ["DSA"], filled: true, assignedUserId: userIds.sneha }
        ]
      }
    ];
    const insertedProjects = await Project.insertMany(projectData);

    const ecommerce = insertedProjects[0];
    const whiteboard = insertedProjects[1];
    const tradingBot = insertedProjects[2];
    const visualizer = insertedProjects[3];

    // --- SEED TASKS ---
    console.log('Seeding Tasks...');
    const taskData = [
      {
        projectId: whiteboard._id,
        assigneeId: userIds.kavya,
        title: "Implement Heartbeat Mechanism",
        description: "Ensure clients stay connected.",
        status: "done",
        priority: "high",
        dueDate: yesterday,
        submissions: [{
          userId: userIds.kavya,
          fileUrl: "https://github.com/test/repo/pull/1",
          fileName: "heartbeat-logic.js",
          description: "Implemented basic ping-pong check.",
          reviewStatus: "approved",
          feedback: [{ authorId: userIds.aditya, comment: "Looks solid. Approved.", type: "approval" }]
        }]
      },
      {
        projectId: whiteboard._id,
        assigneeId: userIds.kavya,
        title: "Refactor Canvas Drawing Logic",
        description: "Optimize for frame rates.",
        status: "in-review",
        priority: "medium",
        dueDate: now,
        submissions: [{
          userId: userIds.kavya,
          fileUrl: "https://github.com/test/repo/pull/2",
          fileName: "optimized-canvas.tsx",
          description: "Switched to requestAnimationFrame.",
          reviewStatus: "pending",
          feedback: []
        }]
      },
      {
        projectId: tradingBot._id,
        assigneeId: userIds.vikram,
        title: "Twitter API Integration",
        description: "Fetch tweets for stock tickers.",
        status: "in-progress",
        priority: "high",
        dueDate: deadline1,
        submissions: []
      }
    ];
    await Task.insertMany(taskData);

    // --- SEED APPLICATIONS ---
    console.log('Seeding Applications...');
    const appData = [
      {
        userId: userIds.aditya,
        projectId: ecommerce._id,
        roleId: ecommerce.roles[0]._id,
        status: "pending",
        resumeUrl: "https://drive.google.com/resume_aditya.pdf",
        coverNote: "I have 2 years of experience with React."
      }
    ];
    await Application.insertMany(appData);

    // --- SEED ACTIVITIES ---
    console.log('Seeding Activities...');
    const activityData = [
      { projectId: whiteboard._id, userId: userIds.kavya, type: "task_submitted", message: "Kavya submitted a task for review", detail: "Refactor Canvas Drawing Logic", timestamp: yesterday },
      { projectId: ecommerce._id, userId: userIds.aditya, type: "new_applicant", message: "New application from Aditya", detail: "Frontend Developer", timestamp: now }
    ];
    await ProjectActivity.insertMany(activityData);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
