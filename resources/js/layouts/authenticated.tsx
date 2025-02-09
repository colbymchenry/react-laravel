import { AppSidebar } from "@/components/sidebar";
import { AppTopbar } from "@/components/topbar";
import { Frame } from "@shopify/polaris";

export function AuthLayout({ children }: { children: React.ReactNode }) {
    const logo = {
        topBarSource:
            '/assets/nav-logo.png',
        width: 36,
        url: '#',
        accessibilityLabel: 'Shopify',
    };

    return (
        <Frame 
            sidebar={window.location.pathname !== '/setup-openai'} 
            navigation={window.location.pathname !== '/setup-openai' ? <AppSidebar /> : null} 
            topBar={<AppTopbar />} 
            logo={logo}
        >
            {children}
        </Frame>
    );
}