import { Navigation } from "@shopify/polaris";
import { HomeIcon, StoreIcon } from "@shopify/polaris-icons";

export function AppSidebar() {
    return (
        <Navigation location="Sidebar">
            <Navigation.Section
                items={[
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
                ]}
            />
        </Navigation>
    )
}