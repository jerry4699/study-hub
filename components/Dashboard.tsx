import React from 'react';
import { UserStats, Project, Badge, LeaderboardUser, UserProfile } from '../types';

interface DashboardProps {
  stats: UserStats;
  myProjects: Project[];
  user: UserProfile;
}

// Mock Leaderboard
const LEADERBOARD: LeaderboardUser[] = [
    { rank: 1, name: "Sarah J.", points: 1250, avatar: "SJ" },
    { rank: 2, name: "Prasad R.", points: 850, avatar: "PR" },
    { rank: 3, name: "Mike R.", points: 720, avatar: "MR" },
    { rank: 4, name: "Priya K.", points: 690, avatar: "PK" },
    { rank: 5, name: "David L.", points: 540, avatar: "DL" },
];

const Dashboard: React.FC<DashboardProps> = ({ stats, myProjects, user }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* User Profile Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold border-4 border-blue-50 dark:border-blue-900/50 shadow-md">
              {user.avatar}
          </div>
          <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
                   {user.collegeName && (
                       <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium">
                           {user.collegeName}
                       </span>
                   )}
                   {user.branch && (
                       <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-100 dark:border-blue-800">
                           {user.branch}
                       </span>
                   )}
                   {user.year && (
                       <span className="px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium border border-purple-100 dark:border-purple-800">
                           {user.year}
                       </span>
                   )}
                   {user.division && (
                       <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium">
                           Div: {user.division}
                       </span>
                   )}
                   <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium border border-amber-100 dark:border-amber-800">
                       {user.role}
                   </span>
              </div>
          </div>
           <div className="text-right hidden md:block">
              <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
              <p className="font-mono font-medium text-gray-700 dark:text-gray-200">
                  {user.email || user.phoneNumber || 'N/A'}
              </p>
          </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
             <div className="absolute right-0 top-0 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-32 h-32">
                  <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                </svg>
             </div>
             <div className="relative z-10">
                 <h3 className="text-lg font-medium opacity-90">My Uploads</h3>
                 <p className="text-4xl font-bold mt-2">{stats.uploads}</p>
                 <p className="text-sm opacity-70 mt-1">Top 15% of contributors</p>
             </div>
        </div>

        <div className="bg-green-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
             <div className="absolute right-0 top-0 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-32 h-32">
                  <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                </svg>
             </div>
             <div className="relative z-10">
                 <h3 className="text-lg font-medium opacity-90">Total Downloads</h3>
                 <p className="text-4xl font-bold mt-2">{stats.downloads}</p>
                 <p className="text-sm opacity-70 mt-1">+12 this week</p>
             </div>
        </div>

        <div className="bg-amber-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
             <div className="absolute right-0 top-0 opacity-20 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-32 h-32">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
             </div>
             <div className="relative z-10">
                 <h3 className="text-lg font-medium opacity-90">Points Earned</h3>
                 <p className="text-4xl font-bold mt-2">{stats.points}</p>
                 <p className="text-sm opacity-70 mt-1">Next rank: Scholar (1000 pts)</p>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Badges Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amber-500">
                        <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.612-3.179 6.73 6.73 0 002.743-1.346 6.753 6.753 0 006.139-5.6a.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z" clipRule="evenodd" />
                    </svg>
                    Achievements
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {stats.badges.map((badge) => (
                        <div key={badge.id} className={`flex flex-col items-center p-4 rounded-lg border ${badge.earned ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600' : 'bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 opacity-50'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 shadow-sm ${badge.earned ? 'bg-white dark:bg-gray-600' : 'grayscale'}`} style={{ color: badge.earned ? badge.color : '#ccc' }}>
                                {badge.icon}
                            </div>
                            <span className="font-semibold text-xs text-center text-gray-800 dark:text-gray-200">{badge.name}</span>
                            <span className="text-[10px] text-center text-gray-500 dark:text-gray-400 mt-1 leading-tight">{badge.description}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Uploads Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 dark:text-white">My Recent Uploads</h3>
                    <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                        <thead className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-3">Title</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Stats</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {myProjects.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No uploads yet. Share your first project!</td></tr>
                            ) : (
                                myProjects.map((proj) => (
                                    <tr key={proj.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{proj.title}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-semibold">
                                                {proj.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{proj.type}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">
                                                <span className="flex items-center gap-1 text-xs">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-gray-400">
                                                        <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.965 3.129V2.75z" />
                                                    </svg>
                                                    {proj.downloads}
                                                </span>
                                                 <span className="flex items-center gap-1 text-xs">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-amber-400">
                                                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                                                    </svg>
                                                    {proj.rating || '-'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition-colors" title="Edit">
                                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Right Sidebar: Leaderboard & Contributions */}
        <div className="space-y-6">
             {/* Contribution Graph (Visual Mock) */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4">Contribution Activity</h3>
                <div className="flex flex-wrap gap-1 justify-center">
                    {[...Array(60)].map((_, i) => (
                        <div 
                            key={i} 
                            className={`w-3 h-3 rounded-sm ${Math.random() > 0.7 ? 'bg-green-500' : Math.random() > 0.4 ? 'bg-green-300' : 'bg-gray-100 dark:bg-gray-700'}`} 
                            title="1 contribution on..."
                        ></div>
                    ))}
                </div>
                <div className="flex items-center justify-end gap-2 mt-2 text-[10px] text-gray-400">
                    <span>Less</span>
                    <div className="w-2 h-2 bg-gray-100 dark:bg-gray-700 rounded-sm"></div>
                    <div className="w-2 h-2 bg-green-300 rounded-sm"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-sm"></div>
                    <span>More</span>
                </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                 <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-between">
                     <span>Top Contributors</span>
                     <span className="text-xs font-normal text-blue-600 dark:text-blue-400 cursor-pointer">Global</span>
                 </h3>
                 <div className="space-y-4">
                     {LEADERBOARD.map((user) => (
                         <div key={user.rank} className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <span className={`w-5 text-center font-bold text-sm ${user.rank === 1 ? 'text-amber-500' : user.rank === 2 ? 'text-gray-500 dark:text-gray-400' : user.rank === 3 ? 'text-orange-600' : 'text-gray-400 dark:text-gray-600'}`}>
                                     {user.rank}
                                 </span>
                                 <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                                     {user.avatar}
                                 </div>
                                 <span className={`text-sm font-medium ${user.rank === 2 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                     {user.name} {user.rank === 2 && '(You)'}
                                 </span>
                             </div>
                             <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{user.points} pts</span>
                         </div>
                     ))}
                 </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;