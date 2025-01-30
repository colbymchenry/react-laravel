import { GuestLayout } from "./guest";
import { AuthLayout } from "./authenticated";
import { useAuth } from "@/stores/auth";
import { usePage } from "@inertiajs/react";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { useEffect } from "react";
import { auth } from "@/services/firebase";

export function LayoutManager(props: any) {
    const { user } = useAuth()
    const { auth: initialAuth } = usePage().props

    const { setUser, setLoading, initialize, loading } = useAuth()

    useEffect(() => {
        if (initialAuth) {
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
    }, [initialAuth])

    if (loading) {
        return null
    }

    // Immediately render guest layout for non-authenticated users
    if (!user || !initialAuth?.user) {
        return <GuestLayout>{props.children}</GuestLayout>
    }

    return <AuthLayout>{props.children}</AuthLayout>
}