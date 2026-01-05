import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const getBadgeColor = (cat: string) => {
    switch(cat) {
      case 'Web Development': return 'bg-blue-100 text-blue-800';
      case 'Java': return 'bg-red-100 text-red-800';
      case 'Mobile App': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (diff?: string) => {
      switch(diff) {
          case 'Advanced': return 'text-red-600 bg-red-50';
          case 'Intermediate': return 'text-amber-600 bg-amber-50';
          default: return 'text-green-600 bg-green-50';
      }
  }

  return (
    <div 
        onClick={() => onClick(project)}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full"
    >
      <div className="h-48 overflow-hidden relative bg-gray-200">
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold shadow-sm">
            {project.type}
        </div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
            <span className="font-medium bg-blue-600 px-4 py-2 rounded-full">View Details</span>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${getBadgeColor(project.category)}`}>
            {project.category}
            </span>
             {project.difficulty && (
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wide font-bold border border-transparent ${getDifficultyColor(project.difficulty)}`}>
                    {project.difficulty}
                </span>
            )}
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{project.title}</h3>
        
        <div className="flex items-center gap-1 mb-3">
             <div className="flex text-amber-400">
                 {[...Array(5)].map((_, i) => (
                     <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={i < Math.floor(project.rating || 0) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={i < Math.floor(project.rating || 0) ? 0 : 1.5} className="w-3.5 h-3.5">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                 ))}
             </div>
             <span className="text-xs text-gray-500">({project.reviews || 0})</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{project.description}</p>
        
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                    {project.author.charAt(0)}
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-900">{project.author}</span>
                    <span className="text-[10px] text-gray-500">{project.date}</span>
                </div>
            </div>
            <div className="flex items-center text-gray-500 text-xs font-medium gap-1">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.965 3.129V2.75z" />
                  <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                </svg>
                {project.downloads}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
