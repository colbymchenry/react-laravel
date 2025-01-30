import { GuestLayout } from "./guest";
import { AuthLayout } from "./authenticated";
import { usePageData } from "@/stores/page-data";
import { useAuth } from "@/stores/auth";

export function LayoutManager({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const { auth } = usePageData()

    // Immediately render guest layout for non-authenticated users
    if (!user || !auth?.user) {
        return <GuestLayout>{children}</GuestLayout>
    }

    return <AuthLayout>{children}</AuthLayout>
}