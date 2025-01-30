import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import axios from 'axios'
import { LayoutManager } from '@/layouts/manager'
import { useAuth } from '@/stores/auth'
import { auth } from '@/services/firebase'
import { usePageData } from '@/stores/page-data'

export function AuthStateHandler(props: any) {
    usePageData.getState().handleProps(props)
    const { setUser, setLoading, initialize, loading } = useAuth()

    useEffect(() => {
        if (props.initialPage && props.initialPage.props) {
            const { auth: initialAuth } = props.initialPage.props
            initialize(initialAuth)

            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const token = await user.getIdToken(true)
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                    await axios.post('/auth/refresh-token', { token })
                } else {
                    if (initialAuth?.token) {
                        await axios.post('/logout')
                    }
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