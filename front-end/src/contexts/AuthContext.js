import { createContext, useState, useContext, useEffect } from 'react';
import { auth, provider } from '../services/firebase';
import {
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        getRedirectResult(auth)
            .then((result) => {
                if (result?.user) {
                    setUser(result.user);
                }
            })
            .catch((error) => {
                console.error('Error getting redirect result:', error);
                setError('Authentication failed. Please try again.');
            });

        return () => unsubscribe();
    }, []);

    const signInWithPopupMethod = async () => {
        try {
            setError(null);
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
        } catch (error) {
            console.error('Error during popup sign-in:', error);
            if (error.code === 'auth/cancelled-popup-request') {
                signInWithRedirectMethod();
            } else {
                setError('Authentication failed. Please try again.');
            }
        }
    };

    const signInWithRedirectMethod = async () => {
        try {
            setError(null);
            await signInWithRedirect(auth, provider);
        } catch (error) {
            console.error('Error during redirect sign-in:', error);
            setError('Authentication failed. Please try again.');
        }
    };

    const logOut = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error('Error during sign-out:', error);
            setError('Sign out failed. Please try again.');
        }
    };

    const value = {
        user,
        loading,
        error,
        signIn: signInWithPopupMethod,
        logOut,
        setError
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};