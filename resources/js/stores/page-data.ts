import { Store, User as UserData } from '@/types/models'
import { create } from 'zustand'

interface PageData {
    auth?: {
        user: {
            uid: string
            email: string
        } | null
        token?: string
    }
    stores: Store[]
    userData?: UserData
    handleProps: (props: any) => void
}

export const usePageData = create<PageData>((set) => ({
    auth: undefined,
    stores: [],
    userData: undefined,
    handleProps: (props: any) => {
        set(props.initialPage.props)
    }
})) 