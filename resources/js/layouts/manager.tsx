import { GuestLayout } from "./guest";
import { AuthLayout } from "./authenticated";
import { useAuthStore } from "@/stores/useAuthStore";
import { useLaravelProps } from "@/stores/useLaravelProps";

export function LayoutManager({ children }: { children: React.ReactNode }) {
    const { user } = useAuthStore()
    const { auth } = useLaravelProps()

    // Immediately render guest layout for non-authenticated users
    if (!user || !auth?.user) {
        return <GuestLayout>{children}</GuestLayout>
    }

    return <AuthLayout>{children}</AuthLayout>
}