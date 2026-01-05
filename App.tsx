import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProjectCard from './components/ProjectCard';
import ProjectDetail from './components/ProjectDetail';
import Dashboard from './components/Dashboard';
import SearchWithGrounding from './components/SearchWithGrounding';
import AIChat from './components/AIChat';
import UploadForm from './components/UploadForm';
import AINotebook from './components/AINotebook';
import NewsFeed from './components/NewsFeed';
import BranchHub from './components/BranchHub';
import Councils from './components/Councils';
import SkillArena from './components/SkillArena';
import AuthFlow from './components/AuthFlow';
import FocusZone from './components/FocusZone';
import LoadingScreen from './components/LoadingScreen';
import { Project, UserStats, ViewState, Badge, NewsItem, Council, BranchDetails, Hackathon, QuizQuestion, LeaderboardUser, UserProfile } from './types';

// Enriched Mock Data with realistic details AND Simulated Full Content for RAG
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Microservices Platform',
    description: 'A scalable e-commerce backend built with Spring Boot microservices. Features include product catalog, inventory management, user authentication with JWT, and order processing. Uses Eureka for service discovery.',
    problemStatement: 'Monolithic e-commerce applications struggle with scalability during high traffic. This project solves that by decoupling services into independently deployable units, improving fault tolerance and maintainability.',
    techStack: ['Java', 'Spring Boot', 'Microservices', 'Docker', 'MySQL', 'Redis'],
    category: 'Web Development',
    branch: 'CSE',
    semester: 'Sem 7',
    difficulty: 'Advanced',
    author: 'Prasad Rane',
    date: '2 days ago',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    type: 'Web',
    downloads: 145,
    rating: 4.8,
    reviews: 12,
    reviewsList: [
        { id: 'r1', author: 'Rahul Gupta', avatar: 'RG', rating: 5, text: 'Excellent architecture! The code structure is very clean and easy to follow. Docker compose setup worked seamlessly.', date: '1 day ago' },
        { id: 'r2', author: 'Sneha Patil', avatar: 'SP', rating: 4, text: 'Great project. However, the documentation for setting up Kafka could be more detailed.', date: '2 days ago' }
    ],
    fullContent: `
    PROJECT REPORT: E-COMMERCE MICROSERVICES PLATFORM
    
    1. INTRODUCTION
    Traditional monolithic architectures face significant challenges in scalability and maintenance. As e-commerce platforms grow, a single large codebase becomes difficult to manage. This project implements a microservices architecture using Spring Boot to address these issues.

    2. SYSTEM ARCHITECTURE
    The system is divided into the following independent services:
    - Discovery Service (Netflix Eureka): Handles service registration and discovery.
    - API Gateway (Spring Cloud Gateway): Acts as the single entry point for client requests, handling routing and load balancing.
    - Product Service: Manages product catalog (CRUD operations) using MySQL.
    - Order Service: Handles order placement and status updates. It communicates with the Inventory Service using Feign Client.
    - Inventory Service: Tracks stock levels.
    - Notification Service: Listens to Kafka topics for order placement events to send emails.

    3. KEY TECHNOLOGIES
    - Java 17 & Spring Boot 3.0
    - Docker for containerization
    - Redis for caching product data
    - JWT (JSON Web Tokens) for stateless authentication

    4. CHALLENGES FACED
    - Data Consistency: Maintaining consistency across services was hard. We implemented the SAGA pattern to handle distributed transactions.
    - Service Communication: Synchronous communication (REST) caused latency. We moved to asynchronous communication using Kafka for non-critical tasks like notifications.

    5. CONCLUSION
    This architecture demonstrates improved fault tolerance. If the Notification Service fails, the Order Service continues to function, unlike in a monolith where a single failure could crash the app.
    `
  },
  {
    id: '2',
    title: 'Student Management System',
    description: 'Complete desktop solution for managing student records, attendance, and grades. Java Swing UI with MySQL database connectivity. Includes reports generation for attendance.',
    problemStatement: 'Manual record keeping in colleges is prone to errors. This desktop app automates attendance tracking and result generation, saving faculty time.',
    techStack: ['Java', 'Swing', 'MySQL', 'JDBC'],
    category: 'Java',
    branch: 'IT',
    semester: 'Sem 4',
    difficulty: 'Intermediate',
    author: 'Shreyash Garud',
    date: '1 week ago',
    imageUrl: 'https://picsum.photos/800/600?random=2',
    type: 'ZIP',
    downloads: 128,
    rating: 4.2,
    reviews: 8,
    reviewsList: [
        { id: 'r1', author: 'Amit Singh', avatar: 'AS', rating: 4, text: 'Simple and effective. Good use of JDBC.', date: '5 days ago' }
    ],
    fullContent: `
    Documentation: Student Management System (SMS)

    Overview:
    SMS is a Java Swing-based desktop application designed to streamline the administrative tasks of educational institutions. It provides an interface for adding students, marking attendance, and calculating grades.

    Modules:
    1. Admin Module: Login with secure credentials. Access to full database.
    2. Student Module: View-only access to their own records.
    3. Faculty Module: Mark attendance and input marks.

    Database Schema:
    - Table 'students': id (PK), name, roll_no, branch, semester.
    - Table 'attendance': id, student_id (FK), date, status (Present/Absent).
    - Table 'marks': id, student_id (FK), subject, score.

    Technical Implementation:
    - JDBC (Java Database Connectivity) is used to connect the Swing frontend to the MySQL backend.
    - PreparedStatement is used to prevent SQL Injection attacks.
    - JTable is used to display data in a tabular format.

    Future Enhancements:
    - Migration to a Web-based interface using React.
    - Adding SMS notifications for absent students.
    `
  },
  {
    id: '3',
    title: 'Weather Forecast App',
    description: 'Beautiful Flutter application showing real-time weather data with animations. Cross-platform mobile support (iOS & Android). Consumes OpenWeatherMap API.',
    problemStatement: 'Users need accurate, real-time weather updates with a simple UI. Existing apps are often cluttered with ads.',
    techStack: ['Flutter', 'Dart', 'REST API', 'Figma'],
    category: 'Mobile App',
    branch: 'CSE',
    semester: 'Sem 6',
    difficulty: 'Intermediate',
    author: 'Hitesh Ghuge',
    date: '3 days ago',
    imageUrl: 'https://picsum.photos/800/600?random=3',
    type: 'Mobile',
    downloads: 82,
    rating: 4.5,
    reviews: 5
  },
   {
    id: '4',
    title: 'Structural Analysis 101 Notes',
    description: 'Comprehensive handwritten notes and diagrams for Civil Engineering structural analysis basics. Covers trusses, beams, and arches.',
    problemStatement: 'Textbooks are often too dense. these notes simplify complex structural concepts with diagrams for exam preparation.',
    techStack: ['Civil', 'Notes', 'PDF'],
    category: 'Engineering',
    branch: 'Civil',
    semester: 'Sem 3',
    difficulty: 'Beginner',
    author: 'Sarah Jenkins',
    date: '5 hours ago',
    imageUrl: 'https://picsum.photos/800/600?random=4',
    type: 'PDF',
    downloads: 42,
    rating: 4.9,
    reviews: 20,
    fullContent: `
    UNIT 1: INTRODUCTION TO STRUCTURAL ANALYSIS

    1.1 Types of Structures
    - Beams: Horizontal members carrying vertical loads.
    - Trusses: Frameworks where members are subjected to axial forces (tension or compression).
    - Arches: Curved structures that carry loads primarily in compression.

    1.2 Equilibrium Equations
    For a structure to be in static equilibrium in 2D:
    1. Sum of vertical forces (Fy) = 0
    2. Sum of horizontal forces (Fx) = 0
    3. Sum of moments (M) = 0

    1.3 Determinacy
    - Statically Determinate: Can be analyzed using only equilibrium equations.
    - Statically Indeterminate: Requires compatibility equations (deformation) to solve.

    UNIT 2: ANALYSIS OF TRUSSES
    - Method of Joints: Analyze equilibrium at each joint. Good for finding forces in all members.
    - Method of Sections: Cut the truss to solve for specific members. Faster for specific forces.
    
    Important Formula for Truss Stability: m = 2j - 3
    Where m = members, j = joints.
    `
  },
  {
    id: '5',
    title: 'AI Traffic Control System',
    description: 'Python based project using OpenCV to detect vehicle density and adjust traffic light timers dynamically.',
    problemStatement: 'Static traffic timers cause congestion. This AI system optimizes flow based on real-time density.',
    techStack: ['Python', 'OpenCV', 'AI/ML', 'Raspberry Pi'],
    category: 'Engineering',
    branch: 'EnTC',
    semester: 'Sem 8',
    difficulty: 'Advanced',
    author: 'David Chen',
    date: '1 day ago',
    imageUrl: 'https://picsum.photos/800/600?random=5',
    type: 'ZIP',
    downloads: 210,
    rating: 5.0,
    reviews: 35
  }
];

const MOCK_BADGES: Badge[] = [
    { id: '1', name: 'First Upload', icon: '🚀', description: 'Uploaded your first project', earned: true, color: '#3b82f6' },
    { id: '2', name: 'Scholar', icon: '📚', description: 'Downloaded 10+ resources', earned: true, color: '#10b981' },
    { id: '3', name: 'Top Rated', icon: '⭐', description: 'Received a 5-star rating', earned: false, color: '#f59e0b' },
    { id: '4', name: 'Mentor', icon: '🎓', description: 'Helped 5 students', earned: false, color: '#8b5cf6' },
];

const MOCK_STATS: UserStats = {
  uploads: 2,
  downloads: 12,
  points: 850,
  badges: MOCK_BADGES
};

const MOCK_NEWS: NewsItem[] = [
    {
        id: '1',
        title: 'End Semester Exam Timetable Released',
        summary: 'The confirmed timetable for the Winter 2024 End Semester Examinations for all branches has been released by the Exam Cell.',
        category: 'Exam',
        branch: 'Common',
        date: '2 hours ago',
        author: 'Exam Cell',
        important: true
    },
    {
        id: '2',
        title: 'CodeCell Hackathon 2024 Registrations Open',
        summary: 'Participate in the biggest 24-hour hackathon of the semester. Themes include AI, Blockchain, and Social Impact.',
        category: 'Hackathon',
        branch: 'Common',
        date: '1 day ago',
        author: 'CodeCell',
        important: false
    },
    {
        id: '3',
        title: 'JP Morgan Chase - Code for Good',
        summary: 'Eligible students from CSE and IT branches can apply for the Code for Good challenge. Check eligibility criteria.',
        category: 'Placement',
        branch: 'CSE',
        date: '2 days ago',
        author: 'Placement Office',
        important: true
    }
];

const MOCK_COUNCILS: Council[] = [
    { 
        id: '1', 
        name: 'Student Council', 
        type: 'Council',
        description: 'The apex student body acting as the voice of students. We bridge the gap between administration and students, and organize college-wide events.', 
        logo: '🏛️', 
        secretary: 'Rahul Mehta',
        nextEvent: 'Annual Town Hall', 
        memberCount: 25 
    },
    { 
        id: '2', 
        name: 'Cultural Council', 
        type: 'Council',
        description: 'Bringing life to campus through art, music, dance, and drama. Organizers of the annual cultural fest "Utsav".', 
        logo: '🎭', 
        secretary: 'Ananya Singh',
        nextEvent: 'Traditional Day', 
        memberCount: 40 
    },
    { 
        id: '3', 
        name: 'Sports Council', 
        type: 'Council',
        description: 'Fostering team spirit and fitness. We organize "Sphurti" (Indoor & Outdoor) and inter-college sports meets.', 
        logo: '🏆', 
        secretary: 'Vikram Patil',
        nextEvent: 'Football League', 
        memberCount: 30 
    },
    { 
        id: '4', 
        name: 'CSI - Computer Society of India', 
        type: 'Society',
        description: 'The largest technical society for computer professionals. We organize workshops on web dev, app dev, and more.', 
        logo: 'C', 
        secretary: 'Rohan Gupta',
        nextEvent: 'Web Dev Bootcamp', 
        memberCount: 350 
    },
    { 
        id: '5', 
        name: 'IEEE', 
        type: 'Society',
        description: 'Advancing technology for humanity. Join us for hardware hackathons and research seminars.', 
        logo: 'I', 
        secretary: 'Sneha Deshmukh',
        nextEvent: 'RoboWars 2024', 
        memberCount: 280 
    },
    { 
        id: '6', 
        name: 'E-Cell', 
        type: 'Cell',
        description: 'Fostering entrepreneurship and innovation among students. Pitch your startup ideas.', 
        logo: 'E', 
        secretary: 'Arjun Reddy',
        nextEvent: 'Startup Expo', 
        memberCount: 150 
    },
];

// Helper to get branch details based on ID
const getBranchDetails = (branchId: string): BranchDetails => {
    // In a real app, fetch from DB
    const baseDetails: BranchDetails = {
        id: branchId,
        name: `${branchId} Department`,
        description: 'The Department is committed to providing excellent education in the field of computing. We focus on core concepts, modern frameworks, and practical problem-solving skills.',
        hod: 'Dr. Nupur Giri',
        topSkills: ['Data Structures', 'Machine Learning', 'Cloud Computing', 'Full Stack Dev'],
        placementStats: '12.5 LPA'
    };
    
    if (branchId === 'IT') return { ...baseDetails, name: 'Information Technology', hod: 'Dr. Shanta Sondur' };
    if (branchId === 'EXTC') return { ...baseDetails, name: 'Electronics & Telecommunication', hod: 'Dr. Nadir Charniya', topSkills: ['Embedded Systems', 'IoT', 'Signal Processing'] };
    if (branchId === 'AI/DS') return { ...baseDetails, name: 'Artificial Intelligence & Data Science' };
    
    return baseDetails; // Default CSE
}


// Skill Arena Mocks
const MOCK_QUIZ_QUESTIONS: QuizQuestion[] = [
    { id: '1', topic: 'DSA', question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'], correctAnswer: 1 },
    { id: '2', topic: 'DSA', question: 'Which data structure follows LIFO?', options: ['Queue', 'Stack', 'Linked List', 'Tree'], correctAnswer: 1 },
    { id: '3', topic: 'DSA', question: 'Worst case time complexity of QuickSort?', options: ['O(n log n)', 'O(n^2)', 'O(n)', 'O(1)'], correctAnswer: 1 },
    { id: '4', topic: 'Aptitude', question: 'Look at this series: 2, 1, (1/2), (1/4), ... What number comes next?', options: ['(1/3)', '(1/8)', '(2/8)', '(1/16)'], correctAnswer: 1 },
    { id: '5', topic: 'Aptitude', question: 'Which word does NOT belong with the others?', options: ['Parsley', 'Basil', 'Dill', 'Mayonnaise'], correctAnswer: 3 },
];

const MOCK_HACKATHONS: Hackathon[] = [
    { id: '1', title: 'CodeCell Hackathon 2024', organizer: 'CodeCell VESIT', date: 'Oct 25-26', mode: 'Offline', tags: ['AI', 'Web3'], description: 'The flagship 24-hour hackathon of VESIT. Build solutions for social impact.' },
    { id: '2', title: 'Smart India Hackathon (Internal)', organizer: 'IIC VESIT', date: 'Nov 10', mode: 'Online', tags: ['GovTech', 'Smart City'], description: 'Internal selection round for SIH 2024. Top 5 teams proceed to nationals.' },
    { id: '3', title: 'GameJam 2.0', organizer: 'CSI', date: 'Dec 05', mode: 'Offline', tags: ['GameDev', 'Unity'], description: 'Build a game from scratch in 48 hours. No pre-made assets allowed.' },
];

const MOCK_LEADERBOARD: LeaderboardUser[] = [
    { rank: 1, name: "Sarah J.", points: 1250, avatar: "SJ" },
    { rank: 2, name: "Prasad R.", points: 850, avatar: "PR" },
    { rank: 3, name: "Mike R.", points: 720, avatar: "MR" },
    { rank: 4, name: "Priya K.", points: 690, avatar: "PK" },
    { rank: 5, name: "David L.", points: 540, avatar: "DL" },
];

const getWelcomeMessage = (name: string, branch: string) => {
    const firstName = name.split(' ')[0];
    const messages = [
        `"Picture abhi baaki hai, mere dost!" 🎬 Keep grinding, ${firstName}!`,
        `Don't let the bugs bite! 🐞 Your ${branch} survival kit is ready.`,
        `"Padhai likhai karo, IAS-YAS bano!" 🎓 Or just build a cool project.`,
        `Engineering: Where 'Last Minute' is a standard unit of time. ⏳ You got this!`,
        `Coffee ☕ + Code 💻 = You 🚀. Let's get things done, ${firstName}!`,
        `"Zindagi na milegi dobara", but assignments will come again and again! 😂`,
        `How's the josh? High Sir! 🔥 Ready to conquer ${branch}?`,
        `Just remember, every expert was once a beginner who didn't quit. 🌟`,
        `"Apna Time Aayega!" 🎤 Until then, let's ace these exams.`,
        `Debugging: Being the detective in a crime movie where you are also the murderer. 🕵️‍♂️`,
        `Keep calm and pretend it's on the syllabus. 📚`,
        `Success is loading... ████████░░ 80% complete.`,
        `"Mogambo khush hua!" 😈 Welcome back to the arena.`,
        `"Bade bade deshon mein aisi choti choti deadlines hoti rehti hain!" ⏳`,
        `Welcome, ${firstName}! Ready to turn caffeine into code? ⚡`,
        `"Ye dhai kilo ka haath jab keyboard pe padta hai na... toh code compile ho jata hai!" 🖥️`,
        `Exams are coming? "Darr ke aage jeet hai!" 🏔️`,
        `Eat. Sleep. Code. Repeat. (And maybe shower?) 🚿`,
        `Parampara, Pratishtha, Anushasan... and lots of Assignments! 🏫`,
        `You are the CSS to my HTML. Without you, this platform has no style! 😎`,
        `"Rishte mein toh hum tumhare Study Partner lagte hai, naam hai StudyHub!" 🤝`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<ViewState>(ViewState.NEWS); 
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [myProjects] = useState<Project[]>([MOCK_PROJECTS[0], MOCK_PROJECTS[4]]);
  const [welcomeMessage, setWelcomeMessage] = useState("");

  // Filters State
  const [filterBranch, setFilterBranch] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  const handleUploadSuccess = () => {
      alert("Project uploaded successfully! +50 Points earned.");
      setView(ViewState.DASHBOARD);
  }

  const handleProjectClick = (project: Project) => {
      setSelectedProject(project);
      setView(ViewState.PROJECT_DETAIL);
  }

  const handleAuthComplete = (profile: UserProfile) => {
      setUser(profile);
      // Optional: Set default branch filters based on user profile
      setFilterBranch(profile.branch || 'All');
  }

  const handleLogout = () => {
      setUser(null);
      setView(ViewState.NEWS); // Reset view
  }

  const filteredProjects = MOCK_PROJECTS.filter(p => {
      if (filterBranch !== 'All' && p.branch !== filterBranch) return false;
      if (filterDifficulty !== 'All' && p.difficulty !== filterDifficulty) return false;
      if (filterCategory !== 'All' && p.category !== filterCategory) return false;
      return true;
  });
  
  // Set random welcome message when home view loads or user changes
  useEffect(() => {
    if (user && view === ViewState.HOME) {
        setWelcomeMessage(getWelcomeMessage(user.name, user.branch || 'General'));
    }
  }, [user, view]);

  if (isLoading) {
      return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  // If no user is logged in (simulated), show Auth Flow
  if (!user) {
      return <AuthFlow onComplete={handleAuthComplete} />;
  }

  if (view === ViewState.FOCUS_ZONE) {
      return <FocusZone onExit={() => setView(ViewState.HOME)} projects={MOCK_PROJECTS} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar 
        currentView={view} 
        setView={(v) => {
          setView(v);
          if (v !== ViewState.PROJECT_DETAIL) setSelectedProject(null);
        }} 
        user={user}
        onLogout={handleLogout}
      />
      
      {/* Verification Status Banner */}
      {user.verificationStatus !== 'Verified' && (
          <div className={`text-center py-2 text-xs font-bold ${user.verificationStatus === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-gray-200 text-gray-700'}`}>
              {user.verificationStatus === 'Pending' 
                ? 'Your ID Verification is Pending. Some features like Leaderboards are locked.' 
                : 'You are using a Guest/Unverified Account. Please upload ID to unlock full access.'}
          </div>
      )}

      <main className="flex-1">
        {view === ViewState.HOME && (
          <>
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-600 text-white py-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
                  Your Digital Student Ecosystem
                </h1>
                <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto font-light italic">
                  {welcomeMessage || `Welcome back, ${user.name.split(' ')[0]}. Access your ${user.branch || 'college'} resources and connect with peers.`}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <button 
                    onClick={() => setView(ViewState.NEWS)}
                    className="bg-white text-blue-600 font-bold py-3.5 px-8 rounded-full hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                  >
                    Go to Feed
                  </button>
                  <button 
                    onClick={() => setView(ViewState.BRANCH_HUB)}
                    className="bg-blue-500/30 backdrop-blur border border-white/30 text-white font-bold py-3.5 px-8 rounded-full hover:bg-blue-500/50 transition-all flex items-center justify-center gap-2"
                  >
                    My Branch Hub
                  </button>
                </div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 -mt-10 relative z-20">
                <div 
                    onClick={() => setView(ViewState.BRANCH_HUB)}
                    className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 text-center hover:transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                    <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">Branch Hubs</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Dedicated spaces for CSE, IT, EXTC syllabus, resources, and senior guidance.</p>
                </div>
                <div 
                    onClick={() => setView(ViewState.SKILL_ARENA)}
                    className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 text-center hover:transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                     <div className="w-14 h-14 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0V5.625a1.125 1.125 0 00-1.125-1.125H10.5a1.125 1.125 0 00-1.125 1.125v8.625m-5.007 0H2.625" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">Skill Arena</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Gamified learning with Quizzes, Hackathons, and Leaderboards.</p>
                </div>
                <div 
                    onClick={() => setView(ViewState.PROJECTS)}
                    className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 text-center hover:transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                     <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">AI Study Notebook</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Upload notes and let AI generate exam questions, summaries, and flashcards.</p>
                </div>
                 <div 
                    onClick={() => setView(ViewState.FOCUS_ZONE)}
                    className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 text-center hover:transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                    <div className="w-14 h-14 bg-blue-900 text-blue-300 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">Focus Zone</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Distraction-free timer and AI Self-Assessment Exams.</p>
                </div>
            </div>
          </>
        )}

        {view === ViewState.NEWS && (
            <NewsFeed news={MOCK_NEWS} userBranch={user.branch} />
        )}

        {view === ViewState.BRANCH_HUB && (
            <BranchHub branch={getBranchDetails(user.branch || 'CSE')} />
        )}

        {view === ViewState.COUNCILS && (
            <Councils councils={MOCK_COUNCILS} />
        )}

        {view === ViewState.SKILL_ARENA && (
            <SkillArena 
                hackathons={MOCK_HACKATHONS} 
                quizzes={MOCK_QUIZ_QUESTIONS} 
                leaderboard={MOCK_LEADERBOARD} 
                userVerificationStatus={user.verificationStatus}
            />
        )}

        {view === ViewState.PROJECTS && (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
             <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40 shadow-sm transition-colors duration-200">
                 <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">All Resources</h2>
                    {/* Filters */}
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                         <select 
                            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                         >
                            <option value="All">All Categories</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Java">Java</option>
                            <option value="Engineering">Engineering</option>
                        </select>
                         <select 
                            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                            value={filterBranch}
                            onChange={(e) => setFilterBranch(e.target.value)}
                         >
                            <option value="All">All Branches</option>
                            <option value="CSE">CSE</option>
                            <option value="IT">IT</option>
                            <option value="EnTC">EnTC</option>
                            <option value="Civil">Civil</option>
                        </select>
                         <select 
                            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                            value={filterDifficulty}
                            onChange={(e) => setFilterDifficulty(e.target.value)}
                         >
                            <option value="All">Difficulty</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                 </div>
             </div>
             
             <SearchWithGrounding />

             <div className="max-w-7xl mx-auto px-4 mt-8">
                {filteredProjects.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p>No projects match your filters.</p>
                        <button onClick={() => {setFilterBranch('All'); setFilterDifficulty('All'); setFilterCategory('All');}} className="text-blue-600 dark:text-blue-400 underline mt-2">Clear Filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map(p => (
                            <ProjectCard key={p.id} project={p} onClick={handleProjectClick} />
                        ))}
                    </div>
                )}
             </div>
          </div>
        )}

        {view === ViewState.PROJECT_DETAIL && selectedProject && (
            <ProjectDetail 
                project={selectedProject} 
                onBack={() => setView(ViewState.PROJECTS)} 
                onOpenNotebook={(p) => setView(ViewState.NOTEBOOK)}
            />
        )}

        {view === ViewState.NOTEBOOK && selectedProject && (
            <AINotebook 
                project={selectedProject} 
                onClose={() => setView(ViewState.PROJECT_DETAIL)}
            />
        )}

        {view === ViewState.DASHBOARD && (
          <Dashboard stats={MOCK_STATS} myProjects={myProjects} user={user} />
        )}

        {view === ViewState.UPLOAD && (
            <UploadForm onCancel={() => setView(ViewState.HOME)} onSuccess={handleUploadSuccess} />
        )}
      </main>

      {/* Hide global AI chat when in Notebook view to avoid clutter */}
      {view !== ViewState.NOTEBOOK && view !== ViewState.FOCUS_ZONE && <AIChat />}

      <footer className="bg-gray-900 text-gray-400 py-12 mt-auto border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
                <div className="flex items-center gap-2 text-white mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                    <span className="text-lg font-bold">StudyHub</span>
                </div>
                <p className="text-sm">Empowering students to share, learn, and grow together through collaborative knowledge sharing.</p>
                <p className="text-xs mt-2 opacity-50">Not an official college website. Student run community.</p>
            </div>
            <div>
                <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                    <li className="hover:text-white cursor-pointer" onClick={() => setView(ViewState.NEWS)}>Campus Feed</li>
                    <li className="hover:text-white cursor-pointer" onClick={() => setView(ViewState.BRANCH_HUB)}>Branch Hubs</li>
                    <li className="hover:text-white cursor-pointer" onClick={() => setView(ViewState.PROJECTS)}>Projects</li>
                </ul>
            </div>
            <div>
                 <h4 className="text-white font-semibold mb-4">Made by Students for Students</h4>
                 <p className="text-sm">Built by Prasad, Shreyash & Hitesh.</p>
                 <div className="mt-4 flex gap-4">
                     {/* Social Icons Placeholder */}
                     <div className="w-8 h-8 bg-gray-800 rounded-full hover:bg-gray-700 cursor-pointer flex items-center justify-center">L</div>
                     <div className="w-8 h-8 bg-gray-800 rounded-full hover:bg-gray-700 cursor-pointer flex items-center justify-center">G</div>
                 </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;