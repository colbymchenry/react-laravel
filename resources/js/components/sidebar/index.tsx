import { usePage } from "@inertiajs/react";
import { Icon, Navigation } from "@shopify/polaris";
import { HomeIcon, StoreIcon } from "@shopify/polaris-icons";
import {
    PersonLockFilledIcon
} from '@shopify/polaris-icons';

export function AppSidebar() {
    const { userData } = usePage().props

    let routes = [
        {
            label: 'Home',
            icon: HomeIcon,
            url: '/dashboard',
            selected: window.location.pathname === '/dashboard',
        },
        {
            label: 'Stores',
            icon: StoreIcon,
            url: '/dashboard/stores',
            selected: window.location.pathname === '/dashboard/stores',
        },
    ]

    if (userData?.admin) {
        routes.push({
            label: 'Admin Dashboard',
            icon: () => (
                <Icon
                    source={PersonLockFilledIcon}
                    tone="base"
                />
            ),
            url: '/dashboard/admin',
            selected: window.location.pathname === '/dashboard/admin',
        })
    }


    return (
        <Navigation location="Sidebar">
            <Navigation.Section
                items={routes}
            />
        </Navigation>
    )
}