import { Page, Layout } from '@shopify/polaris';
import { RemoteConfigForm } from './_components/remote-config-form';

export default function AdminPage() {
    return (
        <Page
            title="Admin Settings"
            subtitle="Manage API Keys, Default Values, and more"
        >
            <Layout>
                <Layout.Section>
                    <RemoteConfigForm />
                </Layout.Section>
            </Layout>
        </Page>
    );
}

