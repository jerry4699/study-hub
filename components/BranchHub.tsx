import React from 'react';
import { BranchDetails } from '../types';

interface BranchHubProps {
    branch: BranchDetails;
}

const BranchHub: React.FC<BranchHubProps> = ({ branch }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header / Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <span className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 inline-block">Department Hub</span>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{branch.name}</h1>
                            <p className="text-slate-300 max-w-2xl text-lg">{branch.description}</p>
                            <div className="flex gap-4 mt-6">
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                    HOD: {branch.hod}
                                </div>
                                 <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                                    </svg>
                                    Avg Package: {branch.placementStats}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="bg-white text-slate-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                                View Syllabus
                            </button>
                             <button className="bg-slate-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-600 transition-colors">
                                Faculty List
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-10">
                    
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Subjects & Resources</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {['Data Structures', 'Database Management', 'Operating Systems', 'Computer Networks'].map((sub, i) => (
                                <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group">
                                    <h3 className="font-bold text-gray-800 mb-2 group-hover:text-blue-600">{sub}</h3>
                                    <div className="flex gap-2 text-xs text-gray-500">
                                        <span className="bg-gray-100 px-2 py-1 rounded">Notes</span>
                                        <span className="bg-gray-100 px-2 py-1 rounded">PYQs</span>
                                        <span className="bg-gray-100 px-2 py-1 rounded">Lab Manual</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                         <h2 className="text-2xl font-bold text-gray-900 mb-6">Core Competencies</h2>
                         <div className="flex flex-wrap gap-3">
                             {branch.topSkills.map((skill, i) => (
                                 <span key={i} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium border border-blue-100">
                                     {skill}
                                 </span>
                             ))}
                         </div>
                    </section>

                     <section>
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
                            <h2 className="text-2xl font-bold mb-4">Connect with Seniors</h2>
                            <p className="mb-6 opacity-90">Get guidance on projects, internships, and placements from final-year students.</p>
                            <button className="bg-white text-blue-600 px-6 py-2.5 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                                Find a Mentor
                            </button>
                        </div>
                    </section>

                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Top Placement Companies</h3>
                        <ul className="space-y-3">
                            {['JP Morgan Chase', 'Morgan Stanley', 'Barclays', 'Oracle'].map((co, i) => (
                                <li key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center font-bold text-xs text-gray-500">
                                        {co.charAt(0)}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{co}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="w-full mt-4 text-blue-600 text-sm font-semibold hover:underline">View Placement Report</button>
                    </div>

                    <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                        <h3 className="font-bold text-amber-800 mb-2">Important Notice</h3>
                        <p className="text-amber-700 text-sm mb-3">Submission for Mini Project 2B is due on 25th Oct.</p>
                        <button className="text-amber-900 text-xs font-bold underline">View Details</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BranchHub;
