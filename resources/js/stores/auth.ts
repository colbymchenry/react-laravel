import { create } from 'zustand'
import { User, signOut } from 'firebase/auth'
import { auth } from '@/services/firebase'
import axios from 'axios'
import { router } from '@inertiajs/react'

interface AuthState {
    user: User | null
    loading: boolean
    setUser: (user: User | null) => void
    setLoading: (loading: boolean) => void
    logout: () => Promise<void>
    initialize: (initialAuth?: { 
        user: { uid: string; email: string } | null
        token?: string 
    }) => void
}

export const useAuth = create<AuthState>((set) => ({
    user: null,
    loading: true,
    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ loading }),
    logout: async () => {
        try {
            await signOut(auth)
            router.post('/logout')
        } catch (error) {
            console.error('Logout error:', error)
        }
    },
    initialize: (initialAuth) => {
        if (initialAuth?.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${initialAuth.token}`
        }
    }
})) 