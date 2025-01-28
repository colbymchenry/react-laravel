import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export async function sendMagicLink(email: string) {
    window.localStorage.setItem('emailForSignIn', email);
    const actionCodeUrl = await sendSignInLinkToEmail(auth, email, {
        url: `${import.meta.env.VITE_APP_URL}/auth/email-link`,
        handleCodeInApp: true,
    });
    return actionCodeUrl;
}

export function isLoginEmailLink(url: string) {
    return url.includes('apiKey') && isSignInWithEmailLink(auth, url);
}

export async function loginWithEmailLink(email: string, url: string) {
    try {
        const result = await signInWithEmailLink(auth, email, url);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}