import React, { useState, useEffect, useRef } from 'react';
import { Project, ChatMessage } from '../types';
import { createNotebookSession, sendMessageToChat, generateExamPrep } from '../services/geminiService';
import { Chat } from "@google/genai";

interface AINotebookProps {
    project: Project;
    onClose: () => void;
}

const AINotebook: React.FC<AINotebookProps> = ({ project, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '0', role: 'model', text: `Hi! I've analyzed "${project.title}". Ask me anything about it, or use the tools on the left to generate study materials.` }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatingExam, setGeneratingExam] = useState(false);
    const [examContent, setExamContent] = useState<string | null>(null);
    
    const chatSessionRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize the RAG-like session
    useEffect(() => {
        if (project.fullContent) {
            chatSessionRef.current = createNotebookSession(project.fullContent, project.title);
        } else {
            // Fallback for projects without full content simulation
            chatSessionRef.current = createNotebookSession(project.description + "\nProblem: " + project.problemStatement, project.title);
        }
    }, [project]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !chatSessionRef.current) return;

        const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const responseText = await sendMessageToChat(chatSessionRef.current, userMsg.text);
            const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateExam = async (type: 'UT' | 'EndSem' | 'Viva') => {
        setGeneratingExam(true);
        setExamContent(null);
        // Add a message to chat to indicate action
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: `Generate a ${type} exam paper for me.` }]);
        
        const content = project.fullContent || project.description;
        const exam = await generateExamPrep(content, type);
        
        setMessages(prev => [...prev, { id: (Date.now()+1).toString(), role: 'model', text: exam }]);
        setExamContent(exam);
        setGeneratingExam(false);
    }

    return (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col md:flex-row font-sans">
            {/* Mobile Header / Close */}
            <div className="md:hidden bg-blue-600 text-white p-4 flex justify-between items-center">
                <span className="font-bold">AI Notebook</span>
                <button onClick={onClose}>✕</button>
            </div>

            {/* Left Panel: Source Guide & Tools (NotebookLM Style) */}
            <div className="w-full md:w-80 lg:w-96 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
                <div className="p-6 border-b border-gray-200 hidden md:flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">{project.title}</h2>
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1 block">Source Guide</span>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto space-y-6">
                    {/* Summary Card */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Key Topics
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {project.techStack?.map((t, i) => (
                                <span key={i} className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-md font-medium border border-purple-100">{t}</span>
                            ))}
                            {project.category && <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md font-medium border border-blue-100">{project.category}</span>}
                        </div>
                    </div>

                    {/* Quick Actions (Exam Mode) */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Exam Prep Mode</h3>
                        <div className="space-y-2">
                            <button 
                                onClick={() => handleGenerateExam('UT')}
                                disabled={generatingExam}
                                className="w-full text-left p-3 rounded-lg bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all flex items-center gap-3 group"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <span className="font-bold text-xs">UT</span>
                                </div>
                                <div>
                                    <span className="block text-sm font-semibold text-gray-800">Unit Test Paper</span>
                                    <span className="block text-xs text-gray-500">20 Marks • Short Qs</span>
                                </div>
                            </button>

                             <button 
                                onClick={() => handleGenerateExam('EndSem')}
                                disabled={generatingExam}
                                className="w-full text-left p-3 rounded-lg bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all flex items-center gap-3 group"
                            >
                                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                    <span className="font-bold text-xs">ES</span>
                                </div>
                                <div>
                                    <span className="block text-sm font-semibold text-gray-800">End Sem Exam</span>
                                    <span className="block text-xs text-gray-500">50 Marks • Comprehensive</span>
                                </div>
                            </button>

                             <button 
                                onClick={() => handleGenerateExam('Viva')}
                                disabled={generatingExam}
                                className="w-full text-left p-3 rounded-lg bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all flex items-center gap-3 group"
                            >
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="block text-sm font-semibold text-gray-800">Viva Assistant</span>
                                    <span className="block text-xs text-gray-500">Tricky questions</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Chat Interface */}
            <div className="flex-1 flex flex-col bg-white h-full">
                {/* Chat Header (Mobile only context) */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between md:hidden">
                   <span className="text-sm font-semibold text-gray-500">Chatting with {project.title}</span>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-3.5 shadow-sm text-sm md:text-base leading-relaxed ${
                                msg.role === 'user' 
                                    ? 'bg-blue-600 text-white rounded-br-none' 
                                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                            }`}>
                                <div className="whitespace-pre-wrap">{msg.text}</div>
                                {msg.role === 'model' && (
                                    <div className="mt-2 flex gap-2 text-xs opacity-50">
                                        <span>AI Generated</span>
                                        <span>•</span>
                                        <span>Based on Source</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                             <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-5 py-4 flex items-center gap-2 shadow-sm">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                                <span className="text-xs text-gray-400 ml-2">Analyzing document...</span>
                             </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 border-t border-gray-100 bg-white">
                    <div className="max-w-3xl mx-auto relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                            placeholder="Ask a question about this project..."
                            className="w-full pl-5 pr-12 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm text-gray-800 placeholder-gray-400"
                        />
                        <button 
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            className="absolute right-2 top-2 bottom-2 aspect-square bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-3">
                        StudyHub AI can make mistakes. Always verify important info.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AINotebook;
