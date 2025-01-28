import { useAuth } from '@/contexts/AuthContext';
import { Page, Layout, Button, Text } from '@shopify/polaris';

export default function Dashboard() {
    const { user, logout } = useAuth();
    
    return (
        <Page>
            <Layout>
                <Layout.Section>
                    <Text variant="heading2xl" as="h1">
                        Dashboard
                    </Text>
                    
                    <div className="mt-4">
                        <Text variant="bodyLg" as="p">
                            Welcome, {user?.email}
                        </Text>
                        
                        <div className="mt-6">
                            <Button 
                                onClick={logout}
                                tone="critical"
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </Layout.Section>
            </Layout>
        </Page>
    );
} 