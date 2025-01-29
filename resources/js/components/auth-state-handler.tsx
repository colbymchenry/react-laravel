import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/services/firebase'
import axios from 'axios'
import { LayoutManager } from '@/layouts/manager'
import { useAuth } from '@/stores/auth'
import { useLaravelProps } from '@/stores/laravel-props'

interface Props {
    children: React.ReactNode
}

export function AuthStateHandler({ children }: Props) {
    const { setUser, setLoading, initialize, loading } = useAuth()
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