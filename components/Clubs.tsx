import React from 'react';
import { Council } from '../types';

interface ClubsProps {
    clubs: Council[];
}

const Clubs: React.FC<ClubsProps> = ({ clubs }) => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900">Student Communities</h1>
                <p className="text-gray-500 mt-2">Join a club, attend workshops, and grow your network.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {clubs.map((club) => (
                    <div key={club.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all group">
                        <div className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 relative">
                             <div className="absolute -bottom-8 left-6">
                                 <div className="w-20 h-20 bg-white rounded-xl shadow-md flex items-center justify-center p-2 border border-gray-100">
                                     <span className="font-black text-2xl text-gray-800">{club.logo}</span>
                                 </div>
                             </div>
                        </div>
                        <div className="pt-10 px-6 pb-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-gray-900">{club.name}</h3>
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{club.memberCount} Members</span>
                            </div>
                            <p className="text-gray-600 text-sm mb-6 h-10 line-clamp-2">{club.description}</p>
                            
                            {club.nextEvent && (
                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-6">
                                    <span className="text-[10px] uppercase font-bold text-blue-600 block mb-1">Upcoming Event</span>
                                    <span className="text-sm font-semibold text-blue-900">{club.nextEvent}</span>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <button className="flex-1 bg-gray-900 text-white py-2 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors">
                                    Join Club
                                </button>
                                <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors">
                                    View Events
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Clubs;