import { usePageData } from "@/stores/page-data";
import { Icon, Navigation } from "@shopify/polaris";
import { HomeIcon, StoreIcon } from "@shopify/polaris-icons";
import {
    PersonLockFilledIcon
} from '@shopify/polaris-icons';

export function AppSidebar() {
    const { userData } = usePageData()

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

    console.log(userData)

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