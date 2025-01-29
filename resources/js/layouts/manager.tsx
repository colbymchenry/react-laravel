import { GuestLayout } from "./guest";
import { AuthLayout } from "./authenticated";
import { useLaravelProps } from "@/stores/laravel-props";
import { useAuth } from "@/stores/auth";

export function LayoutManager({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const { auth } = useLaravelProps()

    // Immediately render guest layout for non-authenticated users
    if (!user || !auth?.user) {
        return <GuestLayout>{children}</GuestLayout>
    }

    return <AuthLayout>{children}</AuthLayout>
}