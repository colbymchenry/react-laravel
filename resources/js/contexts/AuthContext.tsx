import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/services/firebase';
import axios from 'axios';
import { router } from '@inertiajs/react';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: () => {},
});

interface Props {
    children: React.ReactNode;
    initialAuth?: {
        user: {
            uid: string;
            email: string;
        } | null;
        token?: string;
    };
}

export function AuthProvider({ children, initialAuth }: Props) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Set initial token if available
        if (initialAuth?.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${initialAuth.token}`;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const token = await user.getIdToken(true);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } else {
                delete axios.defaults.headers.common['Authorization'];
            }
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [initialAuth]);

    async function logout() {
        try {
            // First sign out from Firebase
            await signOut(auth);
            // Then make a POST request to server to clear the session
            router.post('/logout', {}, {
                onSuccess: () => {
                    router.visit('/login');
                },
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext); 