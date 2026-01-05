import React, { useState, useEffect } from 'react';
import { generateAutoTags } from '../services/geminiService';

interface UploadFormProps {
    onCancel: () => void;
    onSuccess: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onCancel, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [branch, setBranch] = useState('');
    const [semester, setSemester] = useState('');
    const [difficulty, setDifficulty] = useState('');
    
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [loadingAI, setLoadingAI] = useState(false);
    const [estimatedPoints, setEstimatedPoints] = useState(10);

    // Dynamic points calculation to motivate detailed uploads
    useEffect(() => {
        let pts = 10;
        if (title.length > 10) pts += 5;
        if (description.length > 50) pts += 10;
        if (category) pts += 5;
        if (branch) pts += 5;
        if (tags.length > 3) pts += 10;
        setEstimatedPoints(pts);
    }, [title, description, category, branch, tags]);

    const handleAutoTag = async () => {
        if (!title || !description) return;
        setLoadingAI(true);
        const generatedTags = await generateAutoTags(title, description);
        setTags(prev => Array.from(new Set([...prev, ...generatedTags])));
        setLoadingAI(false);
    };

    const handleAddTag = () => {
        if(tagInput.trim()) {
            setTags(prev => [...prev, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (t: string) => {
        setTags(prev => prev.filter(tag => tag !== t));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSuccess();
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 transition-colors duration-200">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Share Your Knowledge</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Upload study materials or projects. Help others and earn points.</p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 px-4 py-2 rounded-lg text-sm font-bold border border-amber-100 dark:border-amber-800 flex flex-col items-center">
                        <span className="text-xs font-medium uppercase tracking-wide text-amber-600 dark:text-amber-300">Est. Points</span>
                        <span className="text-xl">+{estimatedPoints}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" 
                            placeholder="E.g., Library Management System in Java"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description <span className="text-red-500">*</span></label>
                        <textarea 
                            rows={4} 
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" 
                            placeholder="Describe the problem solved, technologies used, and key features..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                        <button 
                            type="button" 
                            onClick={handleAutoTag}
                            disabled={loadingAI || !title || !description}
                            className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 disabled:opacity-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                            </svg>
                            {loadingAI ? 'Generating...' : 'Auto-generate tags with Gemini'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category <span className="text-red-500">*</span></label>
                            <select 
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <option value="">Select category</option>
                                <option value="Web Development">Web Development</option>
                                <option value="Java">Java</option>
                                <option value="Mobile App">Mobile App</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Data Science">Data Science</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Branch</label>
                            <select 
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                            >
                                <option value="">Select Branch</option>
                                <option value="CSE">Computer Science (CSE)</option>
                                <option value="IT">Information Tech (IT)</option>
                                <option value="EnTC">Electronics (EnTC)</option>
                                <option value="Mech">Mechanical</option>
                                <option value="Civil">Civil</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Semester</label>
                            <select 
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                value={semester}
                                onChange={(e) => setSemester(e.target.value)}
                            >
                                <option value="">Select Semester</option>
                                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={`Sem ${n}`}>Semester {n}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                            <select 
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                            >
                                <option value="">Select Difficulty</option>
                                <option value="Beginner">Beginner (Mini Project)</option>
                                <option value="Intermediate">Intermediate (Semester Project)</option>
                                <option value="Advanced">Advanced (Final Year)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tech Stack & Tags</label>
                        <div className="flex flex-wrap gap-2 mb-2 p-2 border border-gray-100 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700/50 min-h-[40px]">
                            {tags.map((t, i) => (
                                <span key={i} className="bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 text-gray-700 dark:text-gray-200 px-2 py-1 rounded text-xs flex items-center gap-1 shadow-sm">
                                    {t}
                                    <button type="button" onClick={() => removeTag(t)} className="hover:text-red-500 dark:hover:text-red-400">×</button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                             <input 
                                type="text" 
                                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" 
                                placeholder="Add tech stack (e.g. React, Python) or tags..."
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                            />
                            <button type="button" onClick={handleAddTag} className="bg-gray-800 dark:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700 dark:hover:bg-gray-500">Add</button>
                        </div>
                    </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload File <span className="text-red-500">*</span></label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group cursor-pointer">
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-500">PDF, ZIP, DOCX up to 25MB</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-50 dark:border-gray-700">
                        <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium">Cancel</button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-semibold shadow-md transition-transform hover:scale-105">
                            Upload Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadForm;