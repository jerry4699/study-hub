import React from 'react';
import { Council } from '../types';

interface CouncilsProps {
    councils: Council[];
}

const CouncilCard: React.FC<{ council: Council }> = ({ council }) => (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all group flex flex-col h-full">
        <div className={`h-24 relative ${council.type === 'Council' ? 'bg-gradient-to-r from-blue-700 to-blue-900' : 'bg-gradient-to-r from-slate-100 to-slate-200'}`}>
            <div className="absolute -bottom-6 left-6">
                <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center p-2 border border-gray-100 text-2xl font-bold text-gray-800">
                    {council.logo}
                </div>
            </div>
            {council.type === 'Council' && (
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur px-2 py-0.5 rounded text-[10px] text-white font-semibold border border-white/20">
                    Official Body
                    </div>
            )}
        </div>
        <div className="pt-8 px-6 pb-6 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-bold text-gray-900">{council.name}</h3>
            </div>
            <div className="text-xs text-gray-500 mb-3 font-medium flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                </svg>
                Sec: {council.secretary}
            </div>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{council.description}</p>
            
            {council.nextEvent && (
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-2 mb-4">
                    <span className="text-[10px] uppercase font-bold text-gray-500 block mb-0.5">Upcoming</span>
                    <span className="text-xs font-semibold text-blue-700">{council.nextEvent}</span>
                </div>
            )}

            <button className={`w-full py-2 rounded-lg font-semibold text-sm transition-colors ${
                council.type === 'Council' 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}>
                View Profile
            </button>
        </div>
    </div>
);

const Councils: React.FC<CouncilsProps> = ({ councils }) => {
    // Group by type
    const adminCouncils = councils.filter(c => c.type === 'Council');
    const societies = councils.filter(c => c.type === 'Society' || c.type === 'Cell');

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900">Student Councils & Societies</h1>
                <p className="text-gray-500 mt-2">The heartbeat of campus life. Leadership, Culture, Sports, and Tech.</p>
            </div>

            {/* Section 1: Core Councils */}
            <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                    Representative Councils
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {adminCouncils.map((council) => (
                        <CouncilCard key={council.id} council={council} />
                    ))}
                </div>
            </div>

             {/* Section 2: Societies & Cells */}
            <div>
                 <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="w-2 h-6 bg-purple-600 rounded-full"></span>
                    Technical Societies & Cells
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {societies.map((council) => (
                        <CouncilCard key={council.id} council={council} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Councils;