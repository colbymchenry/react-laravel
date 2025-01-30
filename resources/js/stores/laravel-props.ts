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
    stores: Store[]
    handleProps: (props: any) => void
}

export const useLaravelProps = create<LaravelProps>((set) => ({
    auth: undefined,
    stores: [],
    handleProps: (props: any) => {
        set(props.initialPage.props)
    }
})) 