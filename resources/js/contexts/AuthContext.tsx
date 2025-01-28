import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/services/firebase';
import axios from 'axios';

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
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

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext); 