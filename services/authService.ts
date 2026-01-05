import { UserProfile, UserRole, VerificationStatus, College } from '../types';

export const MOCK_COLLEGES: College[] = [
    { id: 'vesit', name: 'VES Institute of Technology', domain: 'ves.ac.in', location: 'Mumbai' },
    { id: 'vjti', name: 'Veermata Jijabai Technological Institute', domain: 'vjti.ac.in', location: 'Mumbai' },
    { id: 'spit', name: 'Sardar Patel Institute of Technology', domain: 'spit.ac.in', location: 'Mumbai' },
    { id: 'other', name: 'My College is not listed', location: '' }
];

export const isOfficialDomain = (email: string): boolean => {
    // Check against any college domain
    return MOCK_COLLEGES.some(c => c.domain && email.endsWith(`@${c.domain}`));
};

export const simulateLogin = async (identifier: string): Promise<{ exists: boolean, user?: Partial<UserProfile> }> => {
    // Simulating an API call
    return new Promise((resolve) => {
        setTimeout(() => {
            // Mock: Any email starting with "test" is an existing user
            if (identifier.includes('@') && identifier.startsWith('test')) {
                resolve({ 
                    exists: true, 
                    user: { 
                        name: 'Test User', 
                        email: identifier, 
                        authProvider: 'email',
                        role: 'Student', 
                        verificationStatus: 'Verified',
                        isOfficialEmail: true,
                        collegeId: 'vesit',
                        collegeName: 'VES Institute of Technology',
                        branch: 'CSE',
                        year: 'TE'
                    } 
                });
            } else {
                resolve({ exists: false });
            }
        }, 800);
    });
};

export const sendOTP = async (phone: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`OTP sent to ${phone}: 1234`);
            resolve(true);
        }, 1500);
    });
};

export const verifyOTP = async (phone: string, otp: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(otp === '1234');
        }, 1000);
    });
};

export const simulateIDUpload = async (file: File): Promise<boolean> => {
    // Simulating file upload to secure storage
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Uploaded ${file.name} for manual verification.`);
            resolve(true);
        }, 1500);
    });
};

export const generateAvatarInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};