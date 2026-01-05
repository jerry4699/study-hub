import React, { useState } from 'react';
import { searchExternalResources } from '../services/geminiService';
import { SearchResult } from '../types';

const SearchWithGrounding: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ text: string; links: SearchResult[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults(null);
    const data = await searchExternalResources(query);
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Explore Resources</h2>
        <p className="text-gray-500 mb-6">Search for study materials. We'll use AI to find the best external resources if they aren't here.</p>
        
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
             </div>
             <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Ex: 'React hooks tutorial' or 'Quantum Physics basics'"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400"
            />
          </div>
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
                <>
                <svg className="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
                </>
            ) : (
                'Search with AI'
            )}
          </button>
        </div>

        {results && (
          <div className="animate-fade-in">
            <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                    AI Summary
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">{results.text}</p>
            </div>

            {results.links.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">External Sources (Google Search Grounding)</h3>
                <div className="grid gap-3">
                  {results.links.map((link, idx) => (
                    <a 
                        key={idx} 
                        href={link.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-start p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-sm transition-all bg-gray-50 hover:bg-white group"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-700 group-hover:underline text-sm">{link.title}</h4>
                        <p className="text-xs text-gray-500 truncate mt-1">{link.url}</p>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400 group-hover:text-blue-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchWithGrounding;
