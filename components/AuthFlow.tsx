import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole, VerificationStatus, College } from '../types';
import { isOfficialDomain, simulateLogin, simulateIDUpload, generateAvatarInitials, sendOTP, verifyOTP, MOCK_COLLEGES } from '../services/authService';

interface AuthFlowProps {
    onComplete: (profile: UserProfile) => void;
}

type AuthMethod = 'EMAIL' | 'PHONE';
type Step = 'METHOD_SELECT' | 'LOGIN_EMAIL' | 'LOGIN_PHONE' | 'VERIFY_OTP' | 'PROFILE_SETUP' | 'ACADEMIC_SETUP' | 'VERIFY_UPLOAD';

// --- Doodle Background Component ---
const DoodleBackground = () => {
    return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none font-sans z-0">
        <style>
            {`
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-12px) rotate(2deg); }
            }
            @keyframes float-reverse {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(12px) rotate(-2deg); }
            }
            @keyframes dash {
                0% { stroke-dasharray: 0, 2000; stroke-dashoffset: 0; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { stroke-dasharray: 600, 2000; stroke-dashoffset: -2000; opacity: 0; }
            }
             @keyframes drift {
                0% { transform: translateX(0) translateY(0); opacity: 0.4; }
                50% { transform: translateX(30px) translateY(-20px); opacity: 0.8; }
                100% { transform: translateX(0) translateY(0); opacity: 0.4; }
            }
            .animate-float { animation: float 6s ease-in-out infinite; }
            .animate-float-slow { animation: float-reverse 8s ease-in-out infinite; }
            .animate-dash { animation: dash 8s linear infinite; }
            .animate-dash-fast { animation: dash 6s linear infinite; }
            .animate-dash-slow { animation: dash 12s linear infinite; }
            .animate-drift { animation: drift 15s ease-in-out infinite; }
            `}
        </style>

        {/* --- RUNNING LINES ANIMATION (GLOWING & VIBRANT) --- */}
        <div className="absolute inset-0 opacity-60 dark:opacity-40 w-full h-full">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                 <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                        <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ec4899" stopOpacity="0" />
                        <stop offset="50%" stopColor="#ec4899" stopOpacity="1" />
                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="grad3" x1="100%" y1="0%" x2="0%" y2="100%">
                         <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
                        <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </linearGradient>
                     <linearGradient id="grad4" x1="0%" y1="100%" x2="100%" y2="0%">
                         <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                        <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                    
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                {/* Main Flowing Curves with Glow */}
                <path className="animate-dash" d="M-100,50 Q400,250 800,50 T1800,100" stroke="url(#grad1)" strokeWidth="3" fill="none" filter="url(#glow)" />
                <path className="animate-dash-slow" d="M0,800 Q400,500 800,800 T2000,600" stroke="url(#grad2)" strokeWidth="3" fill="none" filter="url(#glow)" />
                <path className="animate-dash-fast" d="M2000,200 Q1500,600 1000,100 T-100,300" stroke="url(#grad3)" strokeWidth="3" fill="none" filter="url(#glow)" style={{animationDelay: '2s'}} />
                
                {/* Extra Doodle Lines for density */}
                <path className="animate-dash" d="M-50,600 Q300,400 600,600 T1200,500" stroke="url(#grad4)" strokeWidth="2" fill="none" style={{animationDelay: '4s', opacity: 0.6}} />
                <path className="animate-dash-slow" d="M1500,-50 Q1200,300 900,100 T500,200" stroke="url(#grad1)" strokeWidth="2" fill="none" style={{animationDelay: '1s', opacity: 0.6}} />
                <path className="animate-dash" d="M100,0 Q600,300 1100,0 T2100,200" stroke="url(#grad2)" strokeWidth="2" fill="none" style={{animationDelay: '3s', opacity: 0.5}} />
                
                {/* Floating Particles/Circles */}
                <circle cx="15%" cy="20%" r="4" className="fill-blue-400 animate-drift" filter="url(#glow)" />
                <circle cx="80%" cy="80%" r="6" className="fill-purple-400 animate-drift" style={{animationDelay: '1.5s'}} filter="url(#glow)" />
                <circle cx="10%" cy="85%" r="3" className="fill-pink-400 animate-drift" style={{animationDelay: '3s'}} />
                <circle cx="90%" cy="15%" r="5" className="fill-green-400 animate-drift" style={{animationDelay: '0.5s'}} filter="url(#glow)" />
                <circle cx="50%" cy="10%" r="2" className="fill-yellow-400 animate-drift" style={{animationDelay: '2.5s'}} />
            </svg>
        </div>
    </div>
    );
};

const AuthFlow: React.FC<AuthFlowProps> = ({ onComplete }) => {
    const [step, setStep] = useState<Step>('METHOD_SELECT');
    const [authMethod, setAuthMethod] = useState<AuthMethod>('EMAIL');
    const [loading, setLoading] = useState(false);
    
    // Identity State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    
    // Profile State
    const [name, setName] = useState('');
    const [role, setRole] = useState<UserRole>('Student');
    
    // Academic Details
    const [selectedCollegeId, setSelectedCollegeId] = useState('');
    const [branch, setBranch] = useState('');
    const [year, setYear] = useState('');
    const [division, setDivision] = useState('');
    
    // Verification State
    const [isOfficial, setIsOfficial] = useState(false);
    const [idFile, setIdFile] = useState<File | null>(null);

    // --- HANDLERS ---

    const handleMethodSelect = (method: AuthMethod) => {
        setAuthMethod(method);
        if (method === 'EMAIL') setStep('LOGIN_EMAIL');
        else setStep('LOGIN_PHONE');
    };

    // Email Login Flow
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;
        setLoading(true);

        const official = isOfficialDomain(email);
        setIsOfficial(official);

        const result = await simulateLogin(email);
        setLoading(false);

        if (result.exists && result.user) {
            onComplete(result.user as UserProfile);
        } else {
            // New user -> Profile Setup
            // Pre-select role if official domain
            if(official) setRole('Student');
            setStep('PROFILE_SETUP');
        }
    };

    // Phone Login Flow
    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length < 10) return;
        setLoading(true);
        await sendOTP(phone);
        setLoading(false);
        setStep('VERIFY_OTP');
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const isValid = await verifyOTP(phone, otp);
        setLoading(false);
        
        if (isValid) {
            setStep('PROFILE_SETUP');
        } else {
            alert("Invalid OTP (Hint: use 1234)");
        }
    };

    // Profile Setup Flow
    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // If Student or Faculty, mandatory academic setup
        // If General, optional academic setup
        setStep('ACADEMIC_SETUP');
    };

    const handleAcademicSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Finalize Logic
        if (authMethod === 'EMAIL' && !isOfficial && (role === 'Student' || role === 'Faculty')) {
            // Personal email but Academic role -> Need ID
            setStep('VERIFY_UPLOAD');
        } else {
            // Phone users, Official Emails, or General users -> Done
            completeRegistration(isOfficial ? 'Verified' : (role === 'General' ? 'Unverified' : 'Pending'));
        }
    };

    const handleUploadSubmit = async () => {
        if (!idFile) return;
        setLoading(true);
        await simulateIDUpload(idFile);
        setLoading(false);
        completeRegistration('Pending');
    };

    const completeRegistration = (status: VerificationStatus) => {
        const college = MOCK_COLLEGES.find(c => c.id === selectedCollegeId);
        
        const profile: UserProfile = {
            id: Date.now().toString(),
            name,
            email: authMethod === 'EMAIL' ? email : undefined,
            phoneNumber: authMethod === 'PHONE' ? phone : undefined,
            authProvider: authMethod === 'EMAIL' ? 'email' : 'phone',
            role,
            verificationStatus: status,
            isOfficialEmail: isOfficial,
            
            // Academic - Only if selected
            collegeId: selectedCollegeId || undefined,
            collegeName: college?.name,
            branch: branch || undefined,
            year: year || undefined,
            division: division || undefined,
            
            avatar: generateAvatarInitials(name)
        };
        onComplete(profile);
    };

    // --- RENDERERS ---

    const renderMethodSelect = () => (
        <div className="space-y-6 animate-fade-in text-center relative z-10">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Welcome to StudyHub</h2>
            <p className="text-gray-500 dark:text-gray-400">Join the collaborative learning network.</p>
            
            <div className="space-y-3 mt-8">
                <button onClick={() => handleMethodSelect('EMAIL')} className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    Continue with Email
                </button>
                
                <button onClick={() => handleMethodSelect('PHONE')} className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                    </svg>
                    Continue with Phone
                </button>
            </div>
            
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700" /></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or</span></div>
            </div>
            
            <button className="w-full text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                View as Guest (Limited)
            </button>
        </div>
    );

    const renderLoginEmail = () => (
        <form onSubmit={handleEmailSubmit} className="space-y-4 animate-fade-in relative z-10">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Academic Login</h2>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">College Email / Personal Email</label>
                <input 
                    type="email" required 
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all focus:shadow-md"
                    placeholder="student@college.edu"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input 
                    type="password" required 
                    value={password} onChange={e => setPassword(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all focus:shadow-md"
                    placeholder="••••••••"
                />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 hover:shadow-lg transform active:scale-95 duration-200">
                {loading ? 'Authenticating...' : 'Sign In / Sign Up'}
            </button>
        </form>
    );

    const renderLoginPhone = () => (
        <form onSubmit={handlePhoneSubmit} className="space-y-4 animate-fade-in relative z-10">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Phone Login</h2>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Number</label>
                <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm">
                        +91
                    </span>
                    <input 
                        type="tel" required 
                        value={phone} onChange={e => setPhone(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-r-xl focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all focus:shadow-md"
                        placeholder="98765 43210"
                    />
                </div>
                <p className="text-xs text-gray-500 mt-2">We'll send a 4-digit OTP to this number.</p>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 hover:shadow-lg transform active:scale-95 duration-200">
                {loading ? 'Sending OTP...' : 'Get OTP'}
            </button>
        </form>
    );

    const renderVerifyOtp = () => (
        <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in relative z-10">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">Verify OTP</h2>
            <p className="text-center text-gray-500 text-sm mb-6">Sent to +91 {phone}</p>
            
            <div className="flex justify-center">
                <input 
                    type="text" required maxLength={4}
                    value={otp} onChange={e => setOtp(e.target.value)}
                    className="w-40 text-center text-3xl tracking-widest px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all focus:shadow-md"
                    placeholder="0000"
                />
            </div>
            
            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 mt-4 hover:shadow-lg transform active:scale-95 duration-200">
                {loading ? 'Verifying...' : 'Verify & Proceed'}
            </button>
            <button type="button" onClick={() => setStep('LOGIN_PHONE')} className="w-full text-blue-600 text-sm mt-2 hover:underline">Change Number</button>
        </form>
    );

    const renderProfileSetup = () => (
        <form onSubmit={handleProfileSubmit} className="space-y-4 animate-fade-in relative z-10">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">About You</h2>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input 
                    type="text" required 
                    value={name} onChange={e => setName(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">I am a...</label>
                <div className="grid grid-cols-2 gap-3">
                    {['Student', 'Faculty', 'Alumni', 'General'].map((r) => (
                        <div 
                            key={r}
                            onClick={() => setRole(r as UserRole)}
                            className={`cursor-pointer px-4 py-3 rounded-xl border text-center font-medium transition-all ${
                                role === r 
                                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300 shadow-sm' 
                                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            {r}
                        </div>
                    ))}
                </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors mt-4 hover:shadow-lg transform active:scale-95 duration-200">
                Next: Academic Details
            </button>
        </form>
    );

    const renderAcademicSetup = () => (
        <form onSubmit={handleAcademicSubmit} className="space-y-4 animate-fade-in relative z-10">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">Education Details</h2>
            <p className="text-center text-gray-500 text-sm mb-6">
                {(role === 'Student' || role === 'Faculty') ? 'Select your college to access resources.' : 'Optional: Link a college if applicable.'}
            </p>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">College / Institution</label>
                <select 
                    value={selectedCollegeId} 
                    onChange={e => setSelectedCollegeId(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required={role === 'Student' || role === 'Faculty'}
                >
                    <option value="">Select College</option>
                    {MOCK_COLLEGES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            {selectedCollegeId && selectedCollegeId !== 'other' && (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Branch</label>
                            <select value={branch} onChange={e => setBranch(e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                <option value="">Select</option>
                                <option value="CSE">CSE</option>
                                <option value="IT">IT</option>
                                <option value="EXTC">EXTC</option>
                                <option value="AI/DS">AI/DS</option>
                                <option value="Mech">Mech</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
                            <select value={year} onChange={e => setYear(e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                <option value="">Select</option>
                                <option value="FE">FE (1st)</option>
                                <option value="SE">SE (2nd)</option>
                                <option value="TE">TE (3rd)</option>
                                <option value="BE">BE (4th)</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Division (Optional)</label>
                        <input 
                            type="text" 
                            value={division} onChange={e => setDivision(e.target.value)}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="e.g. D10"
                        />
                    </div>
                </>
            )}

            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors mt-4 hover:shadow-lg transform active:scale-95 duration-200">
                {(role === 'General' && !selectedCollegeId) ? 'Skip & Finish' : 'Finish Setup'}
            </button>
        </form>
    );

    const renderVerifyUpload = () => (
        <div className="space-y-6 animate-fade-in text-center relative z-10">
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Identity Verification</h2>
             <p className="text-gray-500">You are joining as <strong>{role}</strong> using a personal email.</p>
             <p className="text-sm bg-amber-50 text-amber-800 p-3 rounded-lg">Please upload your College ID card to unlock full student access.</p>

             <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 relative transition-colors">
                <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => setIdFile(e.target.files?.[0] || null)}
                    accept="image/*,.pdf"
                />
                <div className="text-gray-400">
                    {idFile ? (
                        <div className="text-green-600 font-bold">{idFile.name}</div>
                    ) : (
                        <span>Click to Upload ID (Image/PDF)</span>
                    )}
                </div>
             </div>

             <button onClick={handleUploadSubmit} disabled={!idFile || loading} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 hover:shadow-lg transform active:scale-95 duration-200">
                 {loading ? 'Uploading...' : 'Submit for Review'}
             </button>
             
             <button onClick={() => completeRegistration('Unverified')} className="text-sm text-gray-500 hover:text-gray-700">
                 Skip for now (Restricted Access)
             </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200 relative overflow-hidden">
            {/* Background Doodles */}
            <DoodleBackground />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center text-blue-600 dark:text-blue-400 mb-6 drop-shadow-sm">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-16 h-16">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                </div>
                <div className="bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 py-8 px-6 shadow-2xl sm:rounded-2xl border border-white/50 dark:border-gray-700 transition-colors duration-200 relative overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 h-1.5 bg-gray-100 dark:bg-gray-700 w-full">
                        <div className={`h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out`} style={{ 
                            width: step === 'METHOD_SELECT' ? '10%' : 
                                   step === 'LOGIN_EMAIL' || step === 'LOGIN_PHONE' ? '30%' :
                                   step === 'VERIFY_OTP' ? '50%' :
                                   step === 'PROFILE_SETUP' ? '70%' :
                                   step === 'ACADEMIC_SETUP' ? '90%' : '100%' 
                        }}></div>
                    </div>

                    {step === 'METHOD_SELECT' && renderMethodSelect()}
                    {step === 'LOGIN_EMAIL' && renderLoginEmail()}
                    {step === 'LOGIN_PHONE' && renderLoginPhone()}
                    {step === 'VERIFY_OTP' && renderVerifyOtp()}
                    {step === 'PROFILE_SETUP' && renderProfileSetup()}
                    {step === 'ACADEMIC_SETUP' && renderAcademicSetup()}
                    {step === 'VERIFY_UPLOAD' && renderVerifyUpload()}
                    
                    {step !== 'METHOD_SELECT' && (
                        <div className="mt-6 text-center">
                            <button onClick={() => setStep('METHOD_SELECT')} className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                ← Back to Start
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthFlow;