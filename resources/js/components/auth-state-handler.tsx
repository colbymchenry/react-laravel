import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import axios from 'axios'
import { LayoutManager } from '@/layouts/manager'
import { useAuth } from '@/stores/auth'
import { auth } from '@/services/firebase'

export function AuthStateHandler(props: any) {
    const { setUser, setLoading, initialize, loading } = useAuth()

    useEffect(() => {
        if (props.initialPage && props.initialPage.props) {
            const { auth: initialAuth } = props.initialPage.props
            initialize(initialAuth)

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
        }
    }, [props])

    return <>{!loading && <LayoutManager>{props.children}</LayoutManager>}</>
} 