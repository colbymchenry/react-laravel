import { router } from '@inertiajs/react'
import {
    Text,
    BlockStack,
    InlineStack,
    Button,
    Icon,
    Spinner,
    Banner
} from '@shopify/polaris'
import { RefreshIcon, InfoIcon } from '@shopify/polaris-icons'
import { useState } from "react";
import { StoreSyncResponse } from '@/types/responses'
import { Store } from '@/types/models'
import Drawer from '@/components/drawer';
import { StoreLogs } from './store-logs';

export function StoreCard({ data }: {
    data: StoreSyncResponse
}) {
    const store: Store = data.store
    const products: number = data.sync_data.product?.total ?? 0
    const articles: number = data.sync_data.article?.total ?? 0
    const synced_products: number = data.sync_data.product?.synced ?? 0
    const synced_articles: number = data.sync_data.article?.synced ?? 0
    const last_synced_at: string | undefined = data.sync_data.product?.latest?.updated_at ?? undefined
    let last_sync_error: string | undefined = store.error ?? undefined

    const [popoverActive, setPopoverActive] = useState<boolean>(false);

    let sync_status: 'error' | 'synced' | 'syncing' | 'unsynced' = 'synced'

    if (store.syncing) {
        sync_status = 'syncing'
    }

    if (last_sync_error) {
        sync_status = 'error'
    }

    if (!last_synced_at) {
        sync_status = 'unsynced'
    }

    if (store.error) {
        sync_status = 'error'
    }

    const runSync = async () => {
        try {
            await router.post('/api/sync', { store_id: store.id })
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Banner title={`${store.name} (${sync_status === 'syncing' ? 'Syncing' : sync_status === 'error' ? 'Error' : sync_status === 'unsynced' ? 'Not Synced' : 'Synced'})`} tone={sync_status === 'error' ? 'critical' : sync_status === 'syncing' ? 'info' : sync_status === 'unsynced' ? 'warning' : 'success'}>
            <BlockStack gap={'400'}>
                <BlockStack gap={'200'}>
                    <InlineStack align="space-between">
                        <Text as="span" variant="bodyMd">Products</Text>
                        {sync_status === "error" || sync_status === "unsynced" ? (
                            <Text as="span" variant="bodyMd" tone={"critical"}>N/A</Text>
                        ) : sync_status === "syncing" ? (
                            <div><Spinner size={"small"} /></div>
                        ) : <Text as="span" variant="bodyMd">{synced_products}/{products}</Text>}
                    </InlineStack>
                    <InlineStack align="space-between">
                        <Text as="span" variant="bodyMd">Articles</Text>
                        {sync_status === "error" || sync_status === "unsynced" ? (
                            <Text as="span" variant="bodyMd" tone={"critical"}>N/A</Text>
                        ) : sync_status === "syncing" ? (
                            <div><Spinner size={"small"} /></div>
                        ) : <Text as="span" variant="bodyMd">{synced_articles}/{articles}</Text>}
                    </InlineStack>
                </BlockStack>

                <InlineStack align="space-between" gap="200" wrap={false}>
                    <BlockStack gap={'100'} align="center">
                        <Text as="span" variant="bodySm" tone="subdued">
                            {last_synced_at ? `Last synced: ${new Date(last_synced_at).toLocaleString()}` : 'Last synced: Never'}
                        </Text>
                    </BlockStack>

                    <InlineStack gap="200" align="end">
                        <Button
                            icon={
                                <Icon
                                    source={RefreshIcon}
                                    tone="base"
                                />}
                            variant="primary"
                            onClick={runSync}
                            disabled={sync_status === "syncing"}
                        >
                            Sync
                        </Button>


                        <Drawer
                            title={`${store.name}`}
                            description="View errors and skipped products/articles here."
                            open={popoverActive}
                            onClose={() => setPopoverActive(false)}
                            trigger={<Button onClick={() => setPopoverActive(true)} variant="secondary" icon={<Icon source={InfoIcon} />}>
                                Logs
                            </Button>}
                        >
                            {popoverActive && <StoreLogs store={store} />}
                        </Drawer>
                    </InlineStack>
                </InlineStack>
            </BlockStack>
        </Banner>
    )
}
