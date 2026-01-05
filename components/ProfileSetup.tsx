import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileSetupProps {
    onSave: (profile: UserProfile) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onSave }) => {
    const [name, setName] = useState('');
    const [branch, setBranch] = useState('');
    const [year, setYear] = useState('');
    const [division, setDivision] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && branch && year) {
            onSave({
                name,
                email: name.toLowerCase().replace(' ', '.') + '@ves.ac.in', // Simulated email
                college: 'VESIT',
                branch: branch as any,
                year: year as any,
                division: division || undefined,
                avatar: name.split(' ').map(n => n[0]).join('').toUpperCase()
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center text-blue-600 mb-4">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Welcome to StudyHub
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Let's set up your academic profile to personalize your experience.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="e.g. Prasad Rane"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                College
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    disabled
                                    value="VESIT"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
                                    Branch
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="branch"
                                        name="branch"
                                        required
                                        value={branch}
                                        onChange={(e) => setBranch(e.target.value)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                        <option value="">Select</option>
                                        <option value="CSE">CSE</option>
                                        <option value="IT">IT</option>
                                        <option value="EXTC">EXTC</option>
                                        <option value="AI/DS">AI/DS</option>
                                        <option value="Mech">Mech</option>
                                        <option value="Civil">Civil</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                                    Current Year
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="year"
                                        name="year"
                                        required
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                        <option value="">Select</option>
                                        <option value="FE">FE (1st)</option>
                                        <option value="SE">SE (2nd)</option>
                                        <option value="TE">TE (3rd)</option>
                                        <option value="BE">BE (4th)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="division" className="block text-sm font-medium text-gray-700">
                                Division (Optional)
                            </label>
                            <div className="mt-1">
                                <input
                                    id="division"
                                    name="division"
                                    type="text"
                                    value={division}
                                    onChange={(e) => setDivision(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="e.g. D10"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Create Profile & Enter
                            </button>
                        </div>
                    </form>
                </div>
                <p className="mt-4 text-center text-xs text-gray-500">
                    By joining, you agree to become part of the VESIT digital ecosystem.
                </p>
            </div>
        </div>
    );
};

export default ProfileSetup;
