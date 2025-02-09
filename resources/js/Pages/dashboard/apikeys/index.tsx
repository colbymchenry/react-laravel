import { Page, Layout, Card, Text, Button, DataTable, ButtonGroup, SkeletonDisplayText, SkeletonBodyText } from '@shopify/polaris';
import { useDialog } from '@/stores/dialog';
import axios from 'axios';
import { useState } from 'react';
import { ApiKey } from '@/types/models';
import { usePage } from '@inertiajs/react';
import { ConnectApiKeyModal } from './_components/connect-apikey';
import { Deferred } from '@inertiajs/react';

export default function ApiKeys() {
    const { apikeys = [] as ApiKey[] } = usePage().props;
    const { addDialog } = useDialog();
    const [isConnectApiKeyModalOpen, setIsConnectApiKeyModalOpen] = useState(false);

    const handleDelete = (id: string, name: string) => {
        addDialog({
            title: 'Delete API Key',
            children: (
                <Text as="p">
                    Are you sure you want to delete <strong>{name}</strong>? This action cannot be undone.
                </Text>
            ),
            primaryAction: {
                content: 'Yes, delete',
                destructive: true,
                onAction: async () => {
                    try {
                        await axios.delete(`/api/apikeys/${id}`);
                        window.location.reload();
                    } catch (error) {
                        console.error('Failed to delete API key:', error);
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

    const SkeletonComponent = (
        <Page
            title="API Keys"
            primaryAction={
                <Button variant="primary" disabled>
                    Add New API Key
                </Button>
            }
        >
            <Layout>
                <Layout.Section>
                    <Card>
                        <SkeletonDisplayText size="small" />
                        <div style={{ marginTop: '1rem' }}>
                            {[...Array(3)].map((_, index) => (
                                <div key={index} style={{ marginBottom: '1rem' }}>
                                    <SkeletonBodyText lines={1} />
                                </div>
                            ))}
                        </div>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );

    return (
        <Page
            title="API Keys"
            primaryAction={
                <Button
                    variant="primary"
                    onClick={() => setIsConnectApiKeyModalOpen(true)}
                >
                    Add New API Key
                </Button>
            }
        >
            <Layout>
                <Layout.Section>
                    <Card padding="0">
                        <Deferred data={"apikeys"} fallback={SkeletonComponent}>
                            <DataTable
                                columnContentTypes={[
                                    'text',
                                    'text',
                                    'text',
                                    'text',
                                    'text',
                                ]}
                                headings={[
                                    'Name',
                                    'Type',
                                    'Description',
                                    'Created On',
                                    'Actions'
                                ]}
                                rows={apikeys.map((apiKey: ApiKey) => [
                                    <Text variant="bodyMd" as="span" fontWeight="bold">{apiKey.name}</Text>,
                                    <Text variant="bodyMd" as="span">{apiKey.type}</Text>,
                                    <Text variant="bodyMd" as="span">{apiKey.description}</Text>,
                                    <Text variant="bodyMd" as="span">
                                        {new Date(apiKey.created_at).toLocaleDateString()}
                                    </Text>,
                                    <ButtonGroup>
                                        <Button
                                            tone="critical"
                                            onClick={() => handleDelete(apiKey.id, apiKey.name)}
                                        >
                                            Delete
                                        </Button>
                                    </ButtonGroup>
                                ])}
                            />
                        </Deferred>
                    </Card>
                </Layout.Section>
            </Layout>
            <ConnectApiKeyModal
                open={isConnectApiKeyModalOpen}
                onClose={() => setIsConnectApiKeyModalOpen(false)}
            />
        </Page>
    );
}
