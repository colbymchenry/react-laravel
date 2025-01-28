import { useEffect } from "react";
import { router } from "@inertiajs/react";

const GUEST_ROUTES = ['/login', '/auth/email-link']

export function GuestLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Immediately redirect to login page if not a guest route
        if (!GUEST_ROUTES.includes(router.page.url)) {
            router.visit("/login");
            return;
        }
    }, [router.page.url]) // Use router.page.url as dependency

    // Remove console.log
    return !GUEST_ROUTES.includes(router.page.url) ? null : children;
}