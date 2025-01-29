import { useEffect } from "react";
import { router } from "@inertiajs/react";

const GUEST_ROUTES = ['/login', '/auth/email-link']

export function GuestLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Immediately redirect to login page if not a guest route
        if (!GUEST_ROUTES.includes(window.location.pathname)) {
            router.visit("/login");
            return;
        }
    }, []) // Remove dependency since we're using window.location

    return !GUEST_ROUTES.includes(window.location.pathname) ? null : children;
}