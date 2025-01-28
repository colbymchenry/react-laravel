import { AppSidebar } from "@/components/sidebar";
import { AppTopbar } from "@/components/topbar";
import { Frame } from "@shopify/polaris";

export function AuthLayout({ children }: { children: React.ReactNode }) {
    const logo = {
        topBarSource:
            'https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png',
        width: 86,
        url: '#',
        accessibilityLabel: 'Shopify',
    };

    return (
        <Frame sidebar={true} navigation={<AppSidebar />} topBar={<AppTopbar />} logo={logo} >
            {children}
        </Frame>
    );
}