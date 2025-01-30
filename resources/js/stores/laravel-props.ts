import { Store } from '@/types/models'
import { create } from 'zustand'

interface LaravelProps {
    auth?: {
        user: {
            uid: string
            email: string
        } | null
        token?: string
    }
    setAuth: (auth: any) => void
    stores: Store[]
    setStores: (stores: Store[]) => void
    handleProps: (props: any) => void
}

export const useLaravelProps = create<LaravelProps>((set) => ({
    auth: undefined,
    setAuth: (auth: any) => set({ auth }),
    stores: [],
    setStores: (stores: Store[]) => set({ stores }),
    handleProps: (props: any) => {
        set(props.initialPage.props)
    }
})) 