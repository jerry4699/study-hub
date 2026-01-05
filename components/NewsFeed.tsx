import React, { useState, useEffect } from 'react';
import { NewsItem, UserProfile } from '../types';

interface NewsFeedProps {
    news: NewsItem[];
    userBranch?: string;
    userCollegeId?: string;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ news, userBranch = 'Common', userCollegeId }) => {
    const [filterCategory, setFilterCategory] = useState<string>('All');
    const [filterBranch, setFilterBranch] = useState<string>(userBranch);

    // If user has no college (General user), default to All and don't allow specific branch filtering that implies college context
    const isGeneralUser = !userCollegeId;

    const filteredNews = news.filter(item => {
        // 1. Filter by Category
        if (filterCategory !== 'All' && item.category !== filterCategory) return false;
        
        // 2. Filter by College Context
        // If news has a specific collegeId, only show if user belongs to that college
        if (item.collegeId && item.collegeId !== userCollegeId) return false;

        // 3. Filter by Branch (Only applicable if user is in a college context)
        if (userCollegeId) {
             if (filterBranch !== 'All' && item.branch !== 'Common' && item.branch !== filterBranch) return false;
        } else {
            // General users see only 'Common' or Global items (assume no collegeId = global)
            if (item.branch !== 'Common') return false; 
        }

        return true;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Campus Feed</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Updates, opportunities, and team finding.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* Branch Filter - Hide for General Users */}
                    {!isGeneralUser && (
                        <select 
                            value={filterBranch} 
                            onChange={(e) => setFilterBranch(e.target.value)}
                            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white text-sm rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="All">All Branches</option>
                            <option value="CSE">CSE</option>
                            <option value="IT">IT</option>
                            <option value="EXTC">EXTC</option>
                            <option value="AI/DS">AI/DS</option>
                        </select>
                    )}

                    {/* Category Filter */}
                    <div className="flex gap-2 bg-white dark:bg-gray-700 p-1 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm overflow-x-auto">
                        {['All', 'Exam', 'Event', 'Placement', 'Hackathon'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                                    filterCategory === cat 
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Helper Text for Personalization */}
            {!isGeneralUser && filterBranch === userBranch && filterBranch !== 'All' && (
                <div className="mb-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Showing personalized updates for <strong>{userBranch}</strong>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Feed */}
                <div className="lg:col-span-2 space-y-6">
                    {filteredNews.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                            {isGeneralUser ? "No global updates available. Link a college to see more." : "No updates found for this filter."}
                        </div>
                    ) : (
                        filteredNews.map((item) => (
                            <div key={item.id} className={`bg-white dark:bg-gray-800 rounded-xl p-6 border ${item.important ? 'border-l-4 border-l-red-500 border-gray-200 dark:border-gray-700 shadow-md' : 'border-gray-100 dark:border-gray-700 shadow-sm'} hover:shadow-md transition-shadow`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex gap-2 items-center">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${
                                            item.category === 'Exam' ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300' :
                                            item.category === 'Placement' ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300' :
                                            'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                                        }`}>
                                            {item.category}
                                        </span>
                                        <span className="text-gray-400 text-xs flex items-center gap-1">
                                            • {item.branch === 'Common' ? 'All Branches' : item.branch}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-400">{item.date}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">{item.summary}</p>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-50 dark:border-gray-700">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500 dark:text-gray-300">
                                            {item.author.charAt(0)}
                                        </div>
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{item.author}</span>
                                    </div>
                                    <button className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline">
                                        Read More →
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Sidebar: Team Finder & Quick Links */}
                <div className="space-y-6">
                     {/* Team Finder Widget */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 5.472m0 0a9.09 9.09 0 00-3.246 1.517M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Team Finder
                            </h3>
                            <span className="bg-white/20 px-2 py-0.5 rounded text-xs">Live</span>
                        </div>
                        <p className="text-indigo-100 text-sm mb-4">Find teammates for Hackathons or Projects.</p>
                        
                        <div className="space-y-3">
                             <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm text-sm border border-white/10">
                                <div className="flex justify-between mb-1">
                                    <span className="font-semibold text-white">Smart India Hackathon</span>
                                    <span className="text-[10px] bg-green-500/20 text-green-200 px-1.5 rounded">Looking for Frontend</span>
                                </div>
                                <p className="text-indigo-200 text-xs">Team "CodeWizards" needs a React dev.</p>
                                <button className="mt-2 w-full bg-white text-indigo-700 py-1.5 rounded text-xs font-bold hover:bg-gray-100">Connect</button>
                             </div>
                        </div>
                        <button className="mt-4 w-full border border-white/30 text-white py-2 rounded-lg text-sm font-semibold hover:bg-white/10">
                            Post Requirement
                        </button>
                    </div>

                    {/* Quick Links */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <h3 className="font-bold text-gray-800 dark:text-white mb-3 text-sm uppercase tracking-wide">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <li className="flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                                <span>Exam Timetables</span>
                                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">PDF</span>
                            </li>
                             <li className="flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                                <span>Result Portal</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                </svg>
                            </li>
                             <li className="flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                                <span>Academic Calendar</span>
                                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">PDF</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsFeed;