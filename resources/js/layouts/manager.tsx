
import { GuestLayout } from "./guest";
import { AuthLayout } from "./authenticated";
import { useAuth } from "@/contexts/AuthContext";

export function LayoutManager({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()

    // Immediately render guest layout for non-authenticated users
    if (!user) {
        return <GuestLayout>{children}</GuestLayout>
    }

    return <AuthLayout>{children}</AuthLayout>
}