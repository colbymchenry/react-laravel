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
        <Frame sidebar={true} navigation={<AppSidebar />} topBar={<AppTopbar />} logo={logo} >
            {children}
        </Frame>
    );
}