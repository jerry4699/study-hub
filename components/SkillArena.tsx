import React, { useState } from 'react';
import { Hackathon, QuizQuestion, LeaderboardUser, VerificationStatus } from '../types';

interface SkillArenaProps {
    hackathons: Hackathon[];
    quizzes: QuizQuestion[];
    leaderboard: LeaderboardUser[];
    userVerificationStatus: VerificationStatus;
}

const SkillArena: React.FC<SkillArenaProps> = ({ hackathons, quizzes, leaderboard, userVerificationStatus }) => {
    const [activeTab, setActiveTab] = useState<'GAMES' | 'HACKATHONS' | 'LEADERBOARD'>('GAMES');
    const [activeGame, setActiveGame] = useState<string | null>(null); // 'DSA' or 'Aptitude'
    
    // Quiz Engine State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const isVerified = userVerificationStatus === 'Verified';

    const filteredQuizzes = quizzes.filter(q => q.topic === activeGame);

    const handleAnswer = (optionIndex: number) => {
        if (selectedOption !== null) return; // Prevent multiple clicks
        setSelectedOption(optionIndex);
        
        if (optionIndex === filteredQuizzes[currentQuestionIndex].correctAnswer) {
            setScore(prev => prev + 10);
        }

        setTimeout(() => {
            if (currentQuestionIndex < filteredQuizzes.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedOption(null);
            } else {
                setQuizFinished(true);
            }
        }, 1000);
    };

    const resetGame = () => {
        setActiveGame(null);
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizFinished(false);
        setSelectedOption(null);
    }

    // Render lock screen if access denied
    if (!isVerified && activeTab === 'LEADERBOARD') {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                 <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Campus Engagement & Skill Arena</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">Level up your skills through games, compete with peers, and find your dream team.</p>
                </div>
                 <div className="flex justify-center mb-8">
                    <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex">
                        {['GAMES', 'HACKATHONS', 'LEADERBOARD'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
                                    activeTab === tab 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                {tab === 'GAMES' ? 'Skill Games' : tab === 'HACKATHONS' ? 'Hackathons' : 'Leaderboard'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-100 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                        🔒
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Verified Students Only</h2>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">Leaderboards display real student data. Please verify your identity by uploading your college ID to access this feature.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">Campus Engagement & Skill Arena</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">Level up your skills through games, compete with peers, and find your dream team for hackathons.</p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex justify-center mb-8">
                <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex">
                    {['GAMES', 'HACKATHONS', 'LEADERBOARD'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${
                                activeTab === tab 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            {tab === 'GAMES' ? 'Skill Games' : tab === 'HACKATHONS' ? 'Hackathons' : 'Leaderboard'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                
                {/* GAMES TAB */}
                {activeTab === 'GAMES' && !activeGame && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                        {/* Game Card 1 */}
                        <div onClick={() => setActiveGame('DSA')} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl hover:border-blue-400 transition-all cursor-pointer group text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-3xl">🧩</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Quiz Battles</h3>
                            <p className="text-sm text-gray-500 mb-4">Challenge your Data Structures & Algorithms knowledge. Fast-paced MCQ.</p>
                            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">Start Game</span>
                        </div>

                        {/* Game Card 2 */}
                        <div onClick={() => setActiveGame('Aptitude')} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl hover:border-green-400 transition-all cursor-pointer group text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-teal-500"></div>
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-3xl">🧠</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Aptitude Sprint</h3>
                            <p className="text-sm text-gray-500 mb-4">Prepare for placements with rapid-fire aptitude and logic questions.</p>
                            <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Start Game</span>
                        </div>

                        {/* Game Card 3 (Coming Soon) */}
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-center relative opacity-75">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">💻</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Code Debugger</h3>
                            <p className="text-sm text-gray-500 mb-4">Fix the bug in the provided code snippet. (Coming Soon)</p>
                            <span className="inline-block bg-gray-200 text-gray-500 text-xs font-bold px-3 py-1 rounded-full">Locked</span>
                        </div>
                    </div>
                )}

                {/* ACTIVE QUIZ INTERFACE */}
                {activeTab === 'GAMES' && activeGame && (
                    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden animate-fade-in">
                        {quizFinished ? (
                            <div className="p-10 text-center">
                                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-4xl">🏆</span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
                                <p className="text-gray-500 mb-6">You scored <span className="font-bold text-blue-600 text-xl">{score}</span> points.</p>
                                <button onClick={resetGame} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">Back to Arena</button>
                            </div>
                        ) : (
                            <>
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                    <span className="font-bold text-gray-700">{activeGame} Challenge</span>
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-mono">Q{currentQuestionIndex + 1}/{filteredQuizzes.length}</span>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-lg font-medium text-gray-900 mb-6">{filteredQuizzes[currentQuestionIndex]?.question}</h3>
                                    <div className="space-y-3">
                                        {filteredQuizzes[currentQuestionIndex]?.options.map((option, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleAnswer(idx)}
                                                disabled={selectedOption !== null}
                                                className={`w-full text-left p-4 rounded-xl border transition-all ${
                                                    selectedOption === idx 
                                                        ? idx === filteredQuizzes[currentQuestionIndex].correctAnswer 
                                                            ? 'bg-green-50 border-green-500 text-green-700' 
                                                            : 'bg-red-50 border-red-500 text-red-700'
                                                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                                }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-500">Score: {score}</span>
                                    <button onClick={resetGame} className="text-xs text-gray-400 hover:text-gray-600">Quit Game</button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* HACKATHONS TAB */}
                {activeTab === 'HACKATHONS' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                        <div className="lg:col-span-2 space-y-6">
                            {hackathons.map((hack) => (
                                <div key={hack.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{hack.title}</h3>
                                        <span className={`text-xs px-2 py-1 rounded font-bold ${hack.mode === 'Online' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>{hack.mode}</span>
                                    </div>
                                    <p className="text-sm text-blue-600 font-medium mb-3">Organized by {hack.organizer} • {hack.date}</p>
                                    <p className="text-gray-600 text-sm mb-4">{hack.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {hack.tags.map((tag, i) => (
                                            <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border border-gray-200">{tag}</span>
                                        ))}
                                    </div>
                                    <button className="w-full bg-slate-900 text-white py-2 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors">Register Now</button>
                                </div>
                            ))}
                        </div>
                        
                        {/* Team Finder Side Widget (Contextual) */}
                        <div className="space-y-4">
                            <div className="bg-indigo-600 rounded-xl p-6 text-white shadow-lg">
                                <h3 className="font-bold mb-2">Need a Teammate?</h3>
                                <p className="text-indigo-100 text-sm mb-4">Post your requirements here. 40+ students found teams last month.</p>
                                <div className="space-y-3">
                                    <div className="bg-white/10 p-3 rounded-lg border border-white/10 text-sm">
                                        <p className="font-semibold text-white">Looking for UI Designer</p>
                                        <p className="text-xs text-indigo-200">For CodeCell Hackathon. Contact: @rahul_cse</p>
                                    </div>
                                    <div className="bg-white/10 p-3 rounded-lg border border-white/10 text-sm">
                                        <p className="font-semibold text-white">Need Backend Dev (Node.js)</p>
                                        <p className="text-xs text-indigo-200">Team 'AlgoRiders'. Contact: @priya_it</p>
                                    </div>
                                </div>
                                <button className="mt-4 w-full bg-white text-indigo-600 py-2 rounded-lg text-sm font-bold hover:bg-gray-100">Post Request</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* LEADERBOARD TAB */}
                {activeTab === 'LEADERBOARD' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in max-w-4xl mx-auto">
                        <div className="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 text-lg">Top Performers (This Week)</h3>
                            <div className="text-sm text-gray-500">Updated: 10 mins ago</div>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {leaderboard.map((user) => (
                                <div key={user.rank} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <span className={`w-8 h-8 flex items-center justify-center font-bold text-lg rounded-full ${
                                            user.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                                            user.rank === 2 ? 'bg-gray-200 text-gray-600' :
                                            user.rank === 3 ? 'bg-orange-100 text-orange-600' :
                                            'text-gray-400'
                                        }`}>
                                            {user.rank}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                                                {user.avatar}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{user.name}</p>
                                                <p className="text-xs text-gray-500">Computer Engineering</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">{user.points} XP</p>
                                        <p className="text-xs text-green-600 font-medium">Top 5%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillArena;