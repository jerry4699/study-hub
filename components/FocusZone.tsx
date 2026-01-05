import React, { useState, useEffect, useRef } from 'react';
import { generateUniversityExam, evaluateExamAnswers, createChatSession, sendMessageToChat } from '../services/geminiService';
import { Project, UniversityExam, ExamEvaluation, TheoryQuestion } from '../types';
import { Chat } from "@google/genai";

interface FocusZoneProps {
    onExit: () => void;
    projects: Project[];
}

type Mode = 'SELECT_MODE' | 'SELECT_CONTENT' | 'FOCUS_ACTIVE' | 'EXAM_SETUP' | 'EXAM_ACTIVE' | 'EXAM_RESULT';

const FocusZone: React.FC<FocusZoneProps> = ({ onExit, projects }) => {
    const [mode, setMode] = useState<Mode>('SELECT_MODE');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [intendedMode, setIntendedMode] = useState<'STUDY' | 'EXAM'>('STUDY');
    
    // Focus Mode State
    const [focusDuration, setFocusDuration] = useState(25);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [distractions, setDistractions] = useState(0);
    const [focusWarning, setFocusWarning] = useState<string | null>(null);

    // AI Explainer State (Study Mode Only)
    const [explainerChat, setExplainerChat] = useState<{role: 'user'|'model', text: string}[]>([]);
    const [explainerInput, setExplainerInput] = useState('');
    const [explainerLoading, setExplainerLoading] = useState(false);
    const explainerSessionRef = useRef<Chat | null>(null);
    const explainerEndRef = useRef<HTMLDivElement>(null);

    // Exam Mode State
    const [examConfig, setExamConfig] = useState({ short: 6, medium: 3, long: 1 });
    const [examPaper, setExamPaper] = useState<UniversityExam | null>(null);
    const [answers, setAnswers] = useState<{[key: number]: string}>({});
    const [loadingGen, setLoadingGen] = useState(false);
    const [evaluation, setEvaluation] = useState<ExamEvaluation[] | null>(null);
    
    // Media & System Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // --- UTILS ---
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const enterFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            }
        } catch (e) {
            console.error("Fullscreen denied", e);
        }
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            streamRef.current = stream;
        } catch (e) {
            console.warn("Camera denied or unavailable", e);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    // --- MONITORING LOGIC ---
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                handleDistraction("Tab switching detected");
            }
        };

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && (mode === 'FOCUS_ACTIVE' || mode === 'EXAM_ACTIVE')) {
                handleDistraction("Exited fullscreen mode");
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, [mode, isTimerRunning]);

    const handleDistraction = (reason: string) => {
        if (mode === 'FOCUS_ACTIVE' && isTimerRunning) {
            setIsTimerRunning(false);
            setDistractions(prev => prev + 1);
            setFocusWarning(`Focus Lost! ${reason}. Timer paused.`);
        } else if (mode === 'EXAM_ACTIVE') {
            setDistractions(prev => prev + 1);
            setFocusWarning(`⚠️ Warning: ${reason}. Incident logged.`);
        }
    };

    useEffect(() => {
        let interval: any;
        if (isTimerRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isTimerRunning) {
            setIsTimerRunning(false);
            setFocusWarning("🎉 Session Complete!");
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timeLeft]);

    useEffect(() => {
        if (explainerChat.length > 0 && explainerEndRef.current) {
            explainerEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [explainerChat]);

    // --- HANDLERS ---

    const handleModeSelection = (targetMode: 'STUDY' | 'EXAM') => {
        setIntendedMode(targetMode);
        setMode('SELECT_CONTENT');
    };

    const handleContentSelection = (project: Project) => {
        setSelectedProject(project);
        if (intendedMode === 'STUDY') {
            setMode('FOCUS_ACTIVE');
            // Init chat for study mode
            explainerSessionRef.current = createChatSession();
            setExplainerChat([{ role: 'model', text: "I'm ready to explain any part of this document while you study." }]);
            enterFullscreen();
            startCamera();
            setIsTimerRunning(true);
        } else {
            setMode('EXAM_SETUP');
        }
    };

    const generateExam = async () => {
        if (!selectedProject) return;
        await enterFullscreen();
        await startCamera();
        setLoadingGen(true);
        
        const content = selectedProject.fullContent || selectedProject.description;
        const exam = await generateUniversityExam(content, examConfig);
        
        if (exam) {
            setExamPaper(exam);
            setMode('EXAM_ACTIVE');
            // Estimate time based on marks: 1.5 min per mark roughly
            const totalMarks = (examConfig.short * 2) + (examConfig.medium * 5) + (examConfig.long * 10);
            setTimeLeft(totalMarks * 1.5 * 60); 
            setIsTimerRunning(true);
        } else {
            alert("Failed to generate exam. Please try again.");
            setMode('EXAM_SETUP');
        }
        setLoadingGen(false);
    };

    const handleExplainerSend = async () => {
        if (!explainerInput.trim() || !explainerSessionRef.current) return;
        const userText = explainerInput;
        setExplainerInput('');
        setExplainerChat(prev => [...prev, { role: 'user', text: userText }]);
        setExplainerLoading(true);

        const response = await sendMessageToChat(explainerSessionRef.current, `Context: ${selectedProject?.description}\nUser Question: ${userText}`);
        setExplainerChat(prev => [...prev, { role: 'model', text: response }]);
        setExplainerLoading(false);
    }

    const submitExam = async () => {
        setIsTimerRunning(false);
        setLoadingGen(true);
        // Flatten questions for evaluation
        const allQuestions: TheoryQuestion[] = [];
        examPaper?.sections.forEach(sec => allQuestions.push(...sec.questions));
        
        const content = selectedProject?.fullContent || selectedProject?.description || "";
        const results = await evaluateExamAnswers(allQuestions, answers, content);
        
        setEvaluation(results);
        setMode('EXAM_RESULT');
        setLoadingGen(false);
        if (document.fullscreenElement) document.exitFullscreen();
    };

    const exitZone = () => {
        stopCamera();
        if (document.fullscreenElement) document.exitFullscreen();
        onExit();
    };

    // --- MAIN RENDER ---
    return (
        <div className="fixed inset-0 bg-gray-900 text-white z-[60] flex flex-col overflow-hidden font-sans">
            {/* Top Bar */}
            <div className="flex justify-between items-center p-3 bg-gray-950 border-b border-gray-800">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2 text-sm font-bold tracking-wider text-blue-400">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                        FOCUS ZONE
                    </span>
                    {mode !== 'SELECT_MODE' && (
                        <span className="text-gray-500 text-sm border-l border-gray-700 pl-4 hidden sm:inline">
                            {intendedMode === 'STUDY' ? 'Study Mode' : 'Exam Mode'} &gt; {mode.replace(/_/g, ' ')}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-4">
                     {(mode === 'FOCUS_ACTIVE' || mode === 'EXAM_ACTIVE') && (
                        <div className={`px-4 py-1 rounded text-lg font-mono font-bold border ${isTimerRunning ? 'bg-gray-800 border-gray-700 text-white' : 'bg-red-900/20 border-red-500/50 text-red-400'}`}>
                            {formatTime(timeLeft)}
                        </div>
                     )}
                    <button onClick={exitZone} className="text-gray-400 hover:text-white text-sm font-medium px-3 py-1 hover:bg-white/10 rounded transition-colors">
                        Exit
                    </button>
                </div>
            </div>

            {focusWarning && (
                <div className="bg-red-500/90 text-white text-center py-2 text-sm font-bold animate-bounce cursor-pointer z-50 shadow-lg" onClick={() => {
                    setFocusWarning(null); 
                    if(mode === 'FOCUS_ACTIVE' || mode === 'EXAM_ACTIVE') { enterFullscreen(); setIsTimerRunning(true); }
                }}>
                    {focusWarning} (Click to Resume)
                </div>
            )}

            <div className="flex-1 flex overflow-hidden">
                
                {/* 1. SELECT MODE SCREEN */}
                {mode === 'SELECT_MODE' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-4 animate-fade-in bg-gradient-to-br from-gray-900 to-black">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">StudyHub Focus Zone</h1>
                        <p className="text-gray-400 mb-12 text-lg max-w-xl text-center">Choose your path: Deep focused reading or rigorous self-assessment.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                            <div onClick={() => handleModeSelection('STUDY')} 
                                className="bg-gray-800/50 p-10 rounded-3xl border border-gray-700 hover:border-blue-500 hover:bg-gray-800 transition-all cursor-pointer group text-center backdrop-blur-sm">
                                <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                                    📖
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Study Mode</h2>
                                <p className="text-gray-500">Read & Learn. Document viewer with AI explainer. Distraction monitoring.</p>
                            </div>

                             <div onClick={() => handleModeSelection('EXAM')}
                                className="bg-gray-800/50 p-10 rounded-3xl border border-gray-700 hover:border-purple-500 hover:bg-gray-800 transition-all cursor-pointer group text-center backdrop-blur-sm">
                                <div className="w-20 h-20 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                                    📝
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Exam Mode</h2>
                                <p className="text-gray-500">Self-Assessment. Configure your question paper pattern. Strict exam environment.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. SELECT CONTENT SCREEN */}
                {mode === 'SELECT_CONTENT' && (
                    <div className="flex-1 flex flex-col animate-fade-in">
                        <div className="text-center py-8">
                             <h2 className="text-3xl font-bold">Select Material for {intendedMode === 'STUDY' ? 'Studying' : 'Exam'}</h2>
                             <p className="text-gray-500">Choose the document or project to load.</p>
                        </div>
                        <div className="flex-1 overflow-y-auto px-6 pb-20">
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                                {projects.map(p => (
                                    <div key={p.id} onClick={() => handleContentSelection(p)} 
                                        className={`bg-gray-800 border border-gray-700 p-6 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-gray-700 transition-all group`}>
                                        <div className="h-32 bg-gray-900 rounded mb-4 overflow-hidden relative">
                                            <img src={p.imageUrl} className="w-full h-full object-cover opacity-70 group-hover:opacity-100"/>
                                        </div>
                                        <h3 className="font-bold text-lg mb-1 truncate">{p.title}</h3>
                                        <span className="text-xs bg-gray-600 px-2 py-1 rounded text-gray-300">{p.category}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. FOCUS ACTIVE (DOCUMENT READER + EXPLAINER) */}
                {mode === 'FOCUS_ACTIVE' && selectedProject && (
                    <div className="flex-1 flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative">
                        {/* PDF Viewer Simulation */}
                        <div className="flex-1 bg-gray-500 dark:bg-gray-950 overflow-y-auto p-8 flex justify-center">
                            <div className="bg-white dark:bg-gray-800 shadow-2xl max-w-4xl w-full min-h-[150vh] p-12 text-lg leading-relaxed text-gray-800 dark:text-gray-200 font-serif">
                                {/* Simulated Document Header */}
                                <div className="border-b-2 border-gray-100 dark:border-gray-700 pb-6 mb-8 flex justify-between items-end">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{selectedProject.title}</h1>
                                        <p className="text-gray-500 dark:text-gray-400 mt-2">Author: {selectedProject.author} • {selectedProject.branch}</p>
                                    </div>
                                    <div className="text-right text-gray-400 text-sm font-sans">
                                        Page 1 / 12
                                    </div>
                                </div>
                                
                                {/* Simulated Content */}
                                <div className="space-y-6">
                                    {selectedProject.fullContent ? (
                                        <div className="whitespace-pre-line">{selectedProject.fullContent}</div>
                                    ) : (
                                        <>
                                            <p>{selectedProject.description}</p>
                                            <h3 className="text-xl font-bold mt-8">1. Introduction</h3>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                                            <h3 className="text-xl font-bold mt-8">2. Methodology</h3>
                                            <p>Problem Statement: {selectedProject.problemStatement}</p>
                                            <ul className="list-disc pl-5 space-y-2">
                                                <li>Analysis of current systems.</li>
                                                <li>Implementation using {selectedProject.techStack?.join(', ')}.</li>
                                                <li>Testing and validation.</li>
                                            </ul>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Controls & AI Explainer */}
                        <div className="w-80 bg-gray-900 text-white border-l border-gray-800 flex flex-col">
                            <div className="p-4 border-b border-gray-800">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Focus Controls</h3>
                                <div className="text-center mb-4">
                                     <button onClick={() => isTimerRunning ? setIsTimerRunning(false) : setIsTimerRunning(true)} 
                                        className={`w-full py-2 rounded-lg font-bold text-sm transition-colors ${isTimerRunning ? 'bg-gray-800 text-red-400 border border-gray-700 hover:bg-gray-700' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                                        {isTimerRunning ? 'Pause Session' : 'Resume'}
                                     </button>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Distractions</span>
                                    <span className="text-white font-bold">{distractions}</span>
                                </div>
                            </div>

                            {/* AI Explainer Chat */}
                            <div className="flex-1 flex flex-col min-h-0 bg-gray-900">
                                <div className="p-3 bg-gray-800 border-b border-gray-700 text-xs font-bold text-blue-400 flex items-center gap-2">
                                    <span className="text-lg">🤖</span> AI Explainer
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {explainerChat.map((msg, i) => (
                                        <div key={i} className={`text-sm rounded-lg p-3 ${msg.role === 'user' ? 'bg-blue-600 text-white ml-4' : 'bg-gray-800 text-gray-200 mr-4'}`}>
                                            {msg.text}
                                        </div>
                                    ))}
                                    {explainerLoading && (
                                        <div className="text-gray-500 text-xs animate-pulse">Explaining...</div>
                                    )}
                                    <div ref={explainerEndRef} />
                                </div>
                                <div className="p-3 bg-gray-800 border-t border-gray-700">
                                    <div className="flex gap-2">
                                        <input 
                                            value={explainerInput}
                                            onChange={(e) => setExplainerInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleExplainerSend()}
                                            placeholder="Explain this..."
                                            className="flex-1 bg-gray-900 border border-gray-600 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
                                        />
                                        <button onClick={handleExplainerSend} className="text-blue-400 hover:text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Webcam Preview */}
                            <div className="p-4 bg-black border-t border-gray-800">
                                <div className="aspect-video bg-gray-800 rounded overflow-hidden relative border border-gray-700">
                                    <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover opacity-50" />
                                    <div className="absolute top-2 left-2 flex gap-1 items-center">
                                         <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                         <span className="text-[9px] text-green-500 font-bold uppercase">Presence Check</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. EXAM SETUP (Custom Pattern) */}
                {mode === 'EXAM_SETUP' && (
                    <div className="flex-1 flex items-center justify-center p-4 animate-fade-in bg-gradient-to-br from-gray-900 to-black">
                        <div className="bg-gray-800 p-8 rounded-2xl max-w-lg w-full border border-gray-700 shadow-2xl">
                             <div className="mb-6 text-center">
                                <h2 className="text-2xl font-bold text-white">Configure Question Pattern</h2>
                                <p className="text-gray-400 text-sm mt-1">Customize your exam structure.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-sm font-bold text-gray-300">2 Mark Questions</label>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setExamConfig(p => ({...p, short: Math.max(0, p.short-1)}))} className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 text-white">-</button>
                                            <span className="w-6 text-center">{examConfig.short}</span>
                                            <button onClick={() => setExamConfig(p => ({...p, short: p.short+1}))} className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 text-white">+</button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-sm font-bold text-gray-300">5 Mark Questions</label>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setExamConfig(p => ({...p, medium: Math.max(0, p.medium-1)}))} className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 text-white">-</button>
                                            <span className="w-6 text-center">{examConfig.medium}</span>
                                            <button onClick={() => setExamConfig(p => ({...p, medium: p.medium+1}))} className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 text-white">+</button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-bold text-gray-300">10 Mark Questions</label>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setExamConfig(p => ({...p, long: Math.max(0, p.long-1)}))} className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 text-white">-</button>
                                            <span className="w-6 text-center">{examConfig.long}</span>
                                            <button onClick={() => setExamConfig(p => ({...p, long: p.long+1}))} className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 text-white">+</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm font-mono text-blue-300">
                                    <span>Total Questions: {examConfig.short + examConfig.medium + examConfig.long}</span>
                                    <span>Total Marks: {(examConfig.short*2) + (examConfig.medium*5) + (examConfig.long*10)}</span>
                                </div>

                                <button onClick={generateExam} disabled={loadingGen || (examConfig.short + examConfig.medium + examConfig.long === 0)}
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:opacity-90 disabled:opacity-50 flex justify-center items-center gap-2">
                                    {loadingGen ? (
                                        <>Generating Paper...</>
                                    ) : 'Start Exam'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. EXAM ACTIVE */}
                {mode === 'EXAM_ACTIVE' && examPaper && (
                    <div className="flex-1 flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                        <div className="flex-1 overflow-y-auto p-8">
                             <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-xl min-h-screen p-12">
                                <div className="text-center border-b-2 border-gray-900 dark:border-gray-600 pb-6 mb-8">
                                    <h1 className="text-3xl font-bold uppercase tracking-wide text-gray-900 dark:text-white">University Examination</h1>
                                    <p className="text-lg mt-2 font-serif italic text-gray-700 dark:text-gray-300">{selectedProject?.title}</p>
                                    <div className="flex justify-center gap-8 mt-4 text-sm font-bold text-gray-600 dark:text-gray-400">
                                        <span>Max Marks: {(examConfig.short*2) + (examConfig.medium*5) + (examConfig.long*10)}</span>
                                        <span>Time: {Math.floor(timeLeft / 60)} Mins Remaining</span>
                                    </div>
                                </div>

                                {examPaper.sections.map((section, sIdx) => (
                                    <div key={sIdx} className="mb-10">
                                        {section.questions.length > 0 && (
                                            <>
                                                <div className="bg-gray-100 dark:bg-gray-700 p-3 font-bold text-lg mb-4 border-l-4 border-gray-900 dark:border-gray-500 text-gray-900 dark:text-white">
                                                    {section.title}
                                                </div>
                                                <div className="space-y-8">
                                                    {section.questions.map((q, qIdx) => (
                                                        <div key={q.id}>
                                                            <p className="font-serif text-lg mb-3 text-gray-800 dark:text-gray-200">
                                                                <span className="font-bold mr-2">Q{q.id}.</span> 
                                                                {q.question} 
                                                                <span className="float-right text-sm font-sans font-bold bg-gray-100 dark:bg-gray-700 px-2 rounded text-gray-800 dark:text-gray-200">[{q.marks} Marks]</span>
                                                            </p>
                                                            <textarea 
                                                                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-serif text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-900 placeholder-gray-400 dark:placeholder-gray-500"
                                                                rows={q.marks === 2 ? 3 : q.marks === 5 ? 6 : 10}
                                                                placeholder="Type your answer here..."
                                                                value={answers[q.id] || ''}
                                                                onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}

                                <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-8 mt-12 flex justify-end">
                                    <button onClick={submitExam} disabled={loadingGen}
                                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded text-lg font-bold shadow-md disabled:opacity-50">
                                        {loadingGen ? 'Submitting & Evaluating...' : 'Submit Exam'}
                                    </button>
                                </div>
                             </div>
                        </div>
                    </div>
                )}

                {/* 6. EXAM RESULTS */}
                {mode === 'EXAM_RESULT' && evaluation && (
                     <div className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-gray-900">
                         <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
                             <div className="bg-green-600 text-white p-8 text-center">
                                 <h1 className="text-3xl font-bold">Exam Evaluation Report</h1>
                                 <p className="opacity-90 mt-2">AI Generated Assessment</p>
                                 <div className="mt-6 text-6xl font-bold">
                                     {evaluation.reduce((acc, curr) => acc + curr.score, 0).toFixed(1)} <span className="text-2xl opacity-50">/ {(examConfig.short*2) + (examConfig.medium*5) + (examConfig.long*10)}</span>
                                 </div>
                             </div>
                             
                             <div className="p-8 space-y-8">
                                 {evaluation.map((evalItem, idx) => {
                                     // Find original question details
                                     let questionText = "Question";
                                     let maxMarks = 0;
                                     examPaper?.sections.forEach(s => s.questions.forEach(q => {
                                         if(q.id === evalItem.questionId) {
                                             questionText = q.question;
                                             maxMarks = q.marks;
                                         }
                                     }));

                                     return (
                                         <div key={idx} className="border-b border-gray-100 dark:border-gray-700 pb-8 last:border-0">
                                             <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-gray-900 dark:text-white text-lg w-3/4">{questionText}</h3>
                                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                                    evalItem.score >= maxMarks * 0.8 ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' : 
                                                    evalItem.score >= maxMarks * 0.4 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                                                }`}>
                                                    {evalItem.score} / {maxMarks}
                                                </span>
                                             </div>
                                             
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                                 <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                                     <h4 className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase mb-2">Your Feedback</h4>
                                                     <p className="text-gray-700 dark:text-gray-200 text-sm">{evalItem.feedback}</p>
                                                 </div>
                                                 <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                                                     <h4 className="text-xs font-bold text-blue-500 dark:text-blue-300 uppercase mb-2">Model Answer</h4>
                                                     <p className="text-blue-900 dark:text-blue-100 text-sm">{evalItem.modelAnswer}</p>
                                                 </div>
                                             </div>
                                         </div>
                                     );
                                 })}
                             </div>
                             <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-center">
                                 <button onClick={() => setMode('SELECT_CONTENT')} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Take Another Exam</button>
                             </div>
                         </div>
                     </div>
                )}

            </div>
        </div>
    );
};

export default FocusZone;