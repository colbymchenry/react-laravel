import { Page, Layout, Card, Text, Button, DataTable, ButtonGroup } from '@shopify/polaris';
import { useDialog } from '@/stores/dialog';
import axios from 'axios';
import ShopifyConnectCard from '@/components/shopify-connect-card';
import { useState } from 'react';
import { ConnectStoreModal } from '@/components/modals/connect-store';
import { Store } from '@/types/models';
import { usePage } from '@inertiajs/react';

export default function Stores() {
    const { stores = [] as Store[] } = usePage().props;
    const { addDialog } = useDialog();
    const [isConnectStoreModalOpen, setIsConnectStoreModalOpen] = useState(false);

    const handleDisconnect = (domain: string, storeName: string) => {
        addDialog({
            title: 'Disconnect Store',
            children: (
                <Text as="p">
                    Are you sure you want to disconnect <strong>{storeName}</strong>? This action cannot be undone.
                </Text>
            ),
            primaryAction: {
                content: 'Yes, disconnect',
                destructive: true,
                onAction: async () => {
                    try {
                        await axios.delete(`/api/stores/${domain}`);
                        window.location.reload();
                    } catch (error) {
                        console.error('Failed to disconnect store:', error);
                    }
                },
            },
            secondaryActions: [
                {
                    content: 'Cancel',
                }
            ]
        });
    };

    if (!stores?.length) {
        return (
            <Page>
                <Layout>
                    <Layout.Section>
                        <ShopifyConnectCard />
                    </Layout.Section>
                </Layout>
            </Page>
        );
    }

    const rows = stores.map((store: Store) => [
        <Text variant="bodyMd" as="span" fontWeight="bold">{store.name}</Text>,
        <Text variant="bodyMd" as="span">{store.domain}</Text>,
        <Text variant="bodyMd" as="span">{store.shop_owner}</Text>,
        <Text variant="bodyMd" as="span">{store.email}</Text>,
        <Text variant="bodyMd" as="span">
            {new Date(store.created_at).toLocaleDateString()}
        </Text>,
        <ButtonGroup>
            <Button
                tone="critical"
                onClick={() => handleDisconnect(store.domain, store.name)}
            >
                Disconnect
            </Button>
        </ButtonGroup>
    ]);

    return (
        <Page
            title="Connected Stores"
            primaryAction={
                <Button
                    variant="primary"
                    onClick={() => setIsConnectStoreModalOpen(true)}
                >
                    Connect New Store
                </Button>
            }
        >
            <Layout>
                <Layout.Section>
                    <Card padding="0">
                        <DataTable
                            columnContentTypes={[
                                'text',
                                'text',
                                'text',
                                'text',
                                'text',
                                'text',
                            ]}
                            headings={[
                                'Store Name',
                                'Domain',
                                'Owner',
                                'Email',
                                'Connected On',
                                'Actions'
                            ]}
                            rows={rows}
                        />
                    </Card>
                </Layout.Section>
            </Layout>
            <ConnectStoreModal
                open={isConnectStoreModalOpen}
                onClose={() => setIsConnectStoreModalOpen(false)}
            />
        </Page>
    );
}
