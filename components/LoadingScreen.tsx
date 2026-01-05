import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
    onComplete: () => void;
}

const FACTS = [
    "Did you know? The first computer bug was a real moth found in 1947 inside the Harvard Mark II.",
    "You know what... Writing notes by hand improves memory retention better than typing on a laptop.",
    "Did you know? The University of Al Quaraouiyine is the oldest existing university, founded in 859 AD.",
    "You know what... Your brain uses 20% of your body's energy while studying, despite being only 2% of the mass.",
    "Did you know? The name 'Google' is derived from 'Googol' (the number 1 followed by 100 zeros).",
    "Did you know? Teaching someone else is the most effective way to learn a new concept (The Feynman Technique).",
    "You know what... The most productive time for most students is typically between 10 AM and 2 PM.",
    "Did you know? Java was originally called 'Oak' after a tree that stood outside the developer's window.",
    "Did you know? 60% of students say they study better with ambient music or white noise.",
    "You know what... The word 'Engineer' comes from the Latin word for 'ingenuity' or 'cleverness'."
];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
    const [fact, setFact] = useState("");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Random fact selection
        setFact(FACTS[Math.floor(Math.random() * FACTS.length)]);
        
        const duration = 3500; // 3.5 seconds loading time
        const start = Date.now();
        const intervalTime = 30;
        
        const interval = setInterval(() => {
            const elapsed = Date.now() - start;
            const p = Math.min(100, (elapsed / duration) * 100);
            setProgress(p);
            
            if (elapsed >= duration) {
                clearInterval(interval);
                // Small buffer before unmounting for smoothness
                setTimeout(onComplete, 400);
            }
        }, intervalTime);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-[100] flex flex-col items-center justify-center p-6 transition-colors duration-200 font-sans">
            <style>{`
                .perspective-book { perspective: 800px; }
                .book-spine {
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 12px;
                    background: #2563eb;
                    transform: rotateY(-20deg) translateZ(-2px);
                    border-radius: 2px 0 0 2px;
                }
                .book-cover { 
                    transform: rotateY(-20deg); 
                    z-index: 10;
                    box-shadow: 5px 5px 15px rgba(0,0,0,0.1);
                }
                .page { 
                    transform-origin: left center; 
                    border: 1px solid #e5e7eb;
                    background: white;
                    backface-visibility: hidden;
                }
                @keyframes pageFlip {
                    0% { transform: rotateY(0deg); z-index: 1; }
                    25% { transform: rotateY(-40deg); z-index: 2; }
                    50% { transform: rotateY(-90deg); z-index: 3; }
                    100% { transform: rotateY(-180deg); z-index: 4; }
                }
                .animate-page-turn {
                    animation: pageFlip 2.5s infinite ease-in-out;
                }
                .dark .page {
                    background: #f3f4f6;
                    border-color: #d1d5db;
                }
            `}</style>

            {/* Book Animation */}
            <div className="relative w-28 h-20 mb-14 perspective-book">
                <div className="absolute inset-0 bg-blue-600 rounded-r-md rounded-l-sm shadow-md origin-left book-cover flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white/30 rounded-full"></div>
                </div>
                <div className="book-spine"></div>
                {/* Pages */}
                <div className="absolute inset-y-[3px] right-[3px] left-[4px] rounded-r-sm page animate-page-turn" style={{ animationDelay: '0s' }}></div>
                <div className="absolute inset-y-[3px] right-[3px] left-[4px] rounded-r-sm page animate-page-turn" style={{ animationDelay: '0.8s' }}></div>
                <div className="absolute inset-y-[3px] right-[3px] left-[4px] rounded-r-sm page animate-page-turn" style={{ animationDelay: '1.6s' }}></div>
            </div>

            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8 animate-pulse tracking-tight">
                StudyHub
            </h2>

            <div className="h-32 flex items-center justify-center max-w-md w-full">
                <div className="w-full text-center animate-fade-in bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <p className="text-gray-700 dark:text-gray-200 font-medium text-lg leading-relaxed">
                        {fact}
                    </p>
                </div>
            </div>

            <div className="w-64 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mt-10 overflow-hidden relative">
                <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 transition-all duration-100 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="text-xs text-gray-400 mt-3 font-medium">Gathering resources...</p>
        </div>
    );
};

export default LoadingScreen;