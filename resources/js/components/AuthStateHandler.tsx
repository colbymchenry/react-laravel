import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/services/firebase'
import { useAuthStore } from '@/stores/useAuthStore'
import axios from 'axios'
import { useLaravelProps } from '@/stores/useLaravelProps'
import { LayoutManager } from '@/layouts/manager'

interface Props {
    children: React.ReactNode
}

export function AuthStateHandler({ children }: Props) {
    const { setUser, setLoading, initialize, loading } = useAuthStore()
    const laravelData = useLaravelProps()

    useEffect(() => {
        initialize(laravelData.auth)

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const token = await user.getIdToken(true)
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                axios.post('/auth/refresh-token', { token })
            } else {
                delete axios.defaults.headers.common['Authorization']
            }
            setUser(user)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    return <>{!loading && <LayoutManager>{children}</LayoutManager>}</>
} 