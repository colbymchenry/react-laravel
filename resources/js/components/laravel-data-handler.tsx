import { useLaravelProps } from '@/stores/laravel-props'
import { useEffect } from 'react'

export function LaravelDataHandler(props: any) {
    const { setAuth, setStores } = useLaravelProps()

    useEffect(() => {
        if (props.initialPage && props.initialPage.props) {
            const { auth, stores } = props.initialPage.props
            setAuth(auth)
            setStores(stores)
        }
    }, [props])

    return <>{props.children}</>
} 