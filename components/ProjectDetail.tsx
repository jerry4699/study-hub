import React, { useState } from 'react';
import { Project, Review } from '../types';
import { generateVivaQuestions } from '../services/geminiService';

interface ProjectDetailProps {
    project: Project;
    onBack: () => void;
    onOpenNotebook: (project: Project) => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, onOpenNotebook }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'viva'>('overview');
    const [vivaQuestions, setVivaQuestions] = useState<string[]>([]);
    const [loadingViva, setLoadingViva] = useState(false);

    // Review State
    const [reviews, setReviews] = useState<Review[]>(project.reviewsList || []);
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculate current average rating dynamically based on local state (to show updates immediately)
    const currentRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
        : project.rating || '0.0';
    
    const currentReviewCount = reviews.length;

    const handleGenerateViva = async () => {
        setLoadingViva(true);
        const questions = await generateVivaQuestions(project.title, project.description, project.techStack);
        setVivaQuestions(questions);
        setLoadingViva(false);
    };

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (newRating === 0) return;
        
        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            const newReview: Review = {
                id: Date.now().toString(),
                author: 'You', // In real app, get from user context
                avatar: 'ME',
                rating: newRating,
                text: newComment,
                date: 'Just now'
            };
            
            setReviews([newReview, ...reviews]);
            setNewRating(0);
            setNewComment('');
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <button onClick={onBack} className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors dark:text-gray-400 dark:hover:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back to Projects
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header Image */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-200">
                        <div className="h-64 md:h-80 relative">
                            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                                <div>
                                    <div className="flex gap-2 mb-2">
                                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">{project.category}</span>
                                        {project.difficulty && (
                                            <span className="bg-white/20 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold border border-white/30">
                                                {project.difficulty}
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{project.title}</h1>
                                    <div className="flex items-center text-white/90 text-sm gap-4">
                                        <span>By {project.author}</span>
                                        <span>•</span>
                                        <span>{project.branch || 'General'}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-400">
                                                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                                            </svg>
                                            {currentRating} ({currentReviewCount} reviews)
                                        </span>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* AI Notebook CTA */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-100 dark:border-blue-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg text-blue-600 dark:text-blue-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Study this in AI Notebook</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">Ask questions, generate summaries, and create exam prep materials specifically for this project.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => onOpenNotebook(project)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform hover:scale-105 whitespace-nowrap"
                        >
                            Open AI Notebook
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-200">
                        <div className="border-b border-gray-100 dark:border-gray-700 flex overflow-x-auto">
                            <button 
                                onClick={() => setActiveTab('overview')}
                                className={`flex-1 py-4 px-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                            >
                                Overview & Problem
                            </button>
                            <button 
                                onClick={() => setActiveTab('reviews')}
                                className={`flex-1 py-4 px-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'reviews' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                            >
                                Reviews ({currentReviewCount})
                            </button>
                            <button 
                                onClick={() => setActiveTab('viva')}
                                className={`flex-1 py-4 px-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'viva' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                            >
                                Viva Prep Mode <span className="ml-2 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 px-1.5 py-0.5 rounded text-[10px]">AI</span>
                            </button>
                        </div>
                        
                        <div className="p-8">
                            {activeTab === 'overview' && (
                                <div className="space-y-8 animate-fade-in text-gray-800 dark:text-gray-200">
                                    <section>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Problem Statement</h3>
                                        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg">
                                            <p className="leading-relaxed">
                                                {project.problemStatement || "This project addresses a key gap in the current ecosystem by providing a streamlined solution for users to access and manage resources effectively."}
                                            </p>
                                        </div>
                                    </section>
                                    
                                    <section>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Description</h3>
                                        <p className="leading-relaxed whitespace-pre-line">{project.description}</p>
                                    </section>

                                    <section>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Tech Stack</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {project.techStack?.map((tech, i) => (
                                                <span key={i} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-600">
                                                    {tech}
                                                </span>
                                            )) || <span className="text-gray-400 text-sm">No tech stack listed</span>}
                                        </div>
                                    </section>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="animate-fade-in space-y-8">
                                    {/* Review Submission Form */}
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Leave a Review</h3>
                                        <form onSubmit={handleSubmitReview}>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Rating</label>
                                                <div className="flex gap-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button 
                                                            key={star} 
                                                            type="button"
                                                            onClick={() => setNewRating(star)}
                                                            className="focus:outline-none transition-transform active:scale-95"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-8 h-8 ${star <= newRating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}>
                                                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comment</label>
                                                <textarea 
                                                    rows={3}
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    placeholder="Share your feedback about this project..."
                                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                    required
                                                />
                                            </div>
                                            <button 
                                                type="submit" 
                                                disabled={isSubmitting || newRating === 0}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                            </button>
                                        </form>
                                    </div>

                                    {/* Reviews List */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Community Reviews</h3>
                                        {reviews.length === 0 ? (
                                            <p className="text-gray-500 dark:text-gray-400 italic">No reviews yet. Be the first to review!</p>
                                        ) : (
                                            <div className="space-y-6">
                                                {reviews.map((review) => (
                                                    <div key={review.id} className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                                                                    {review.avatar}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{review.author}</h4>
                                                                    <span className="text-xs text-gray-500 dark:text-gray-400">{review.date}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex text-amber-400">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth={i < review.rating ? 0 : 1.5} className="w-4 h-4">
                                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                                    </svg>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{review.text}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'viva' && (
                                <div className="animate-fade-in text-gray-800 dark:text-gray-200">
                                    <div className="text-center mb-8">
                                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-purple-600 dark:text-purple-400">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Prepare for your Viva!</h3>
                                        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                                            Our AI analyzes the project details and generates likely interview questions.
                                        </p>
                                        {vivaQuestions.length === 0 && (
                                            <button 
                                                onClick={handleGenerateViva}
                                                disabled={loadingViva}
                                                className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md transition-all active:scale-95 disabled:opacity-70"
                                            >
                                                {loadingViva ? 'Generating...' : 'Generate Questions'}
                                            </button>
                                        )}
                                    </div>

                                    {vivaQuestions.length > 0 && (
                                        <div className="space-y-4">
                                            {vivaQuestions.map((q, idx) => (
                                                <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 p-5 rounded-xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-md transition-all cursor-pointer group">
                                                    <div className="flex items-start gap-3">
                                                        <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                                            Q{idx + 1}
                                                        </span>
                                                        <p className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">{q}</p>
                                                    </div>
                                                </div>
                                            ))}
                                             <div className="mt-6 text-center">
                                                <button onClick={handleGenerateViva} className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium hover:underline">
                                                    Generate Different Questions
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Actions & Meta */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Actions</h3>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mb-3 shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            Download Project
                        </button>
                        <button className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                            </svg>
                            Save for Later
                        </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                         <h3 className="font-bold text-gray-900 dark:text-white mb-4">Project Details</h3>
                         <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                            <div className="flex justify-between border-b border-gray-50 dark:border-gray-700 pb-2">
                                <span className="text-gray-500 dark:text-gray-400">Semester</span>
                                <span className="font-medium">{project.semester || 'N/A'}</span>
                            </div>
                             <div className="flex justify-between border-b border-gray-50 dark:border-gray-700 pb-2">
                                <span className="text-gray-500 dark:text-gray-400">Branch</span>
                                <span className="font-medium">{project.branch || 'N/A'}</span>
                            </div>
                             <div className="flex justify-between border-b border-gray-50 dark:border-gray-700 pb-2">
                                <span className="text-gray-500 dark:text-gray-400">Difficulty</span>
                                <span className={`font-medium ${
                                    project.difficulty === 'Advanced' ? 'text-red-600 dark:text-red-400' :
                                    project.difficulty === 'Intermediate' ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'
                                }`}>{project.difficulty || 'N/A'}</span>
                            </div>
                             <div className="flex justify-between border-b border-gray-50 dark:border-gray-700 pb-2">
                                <span className="text-gray-500 dark:text-gray-400">File Type</span>
                                <span className="font-medium uppercase">{project.type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Published</span>
                                <span className="font-medium">{project.date}</span>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;