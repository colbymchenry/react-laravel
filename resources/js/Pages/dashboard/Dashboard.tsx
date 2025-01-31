import { Store, SyncData } from '@/types/models'
import { usePage } from '@inertiajs/react'
import { Deferred } from '@inertiajs/react'
import { Page, Layout, Text, Card, Grid, BlockStack, InlineStack, Badge, SkeletonDisplayText, SkeletonBodyText, Button, Icon } from '@shopify/polaris'
import { RefreshIcon } from '@shopify/polaris-icons'
import axios from 'axios'
import { useState } from 'react'

export default function Dashboard() {
    const { syncData = [] as { store: Store, sync_data: SyncData }[] } = usePage().props

    const LoadingSkeleton = () => (
        <Grid>
            {[1, 2, 3, 4].map((index) => (
                <Grid.Cell columnSpan={{
                    xs: 6,
                    sm: 3,
                    md: 3,
                    lg: 5,
                }} key={index}>
                    <Card>
                        <BlockStack gap={'400'}>
                            <InlineStack align="space-between" gap="200" wrap={false}>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <SkeletonDisplayText size="small" />
                                </div>
                                <div style={{ width: '60px' }}>
                                    <SkeletonBodyText lines={1} />
                                </div>
                            </InlineStack>

                            <BlockStack gap={'200'}>
                                <InlineStack align="space-between">
                                    <SkeletonBodyText lines={1} />
                                </InlineStack>
                                <InlineStack align="space-between">
                                    <SkeletonBodyText lines={1} />
                                </InlineStack>
                            </BlockStack>

                            <BlockStack gap={'100'}>
                                <SkeletonBodyText lines={2} />
                            </BlockStack>
                        </BlockStack>
                    </Card>
                </Grid.Cell>
            ))}
        </Grid>
    )

    return (
        <Page>
            <Layout>
                <Layout.Section>
                    <Deferred data="syncData" fallback={<LoadingSkeleton />}>
                        <Grid>
                            {(syncData?.original ?? []).map((data: {store: Store, sync_data: SyncData}, index: number) => (
                                <Grid.Cell columnSpan={{
                                    xs: 6,
                                    sm: 3,
                                    md: 3,
                                    lg: 5,
                                }} key={index}>
                                    <StoreCard store={data.store} sync_data={data.sync_data} />
                                </Grid.Cell>
                            ))}
                        </Grid>
                    </Deferred>
                </Layout.Section>
            </Layout>
        </Page>
    )
}

function StoreCard({ store, sync_data }: { store: Store, sync_data: SyncData }) {

    const [syncing, setSyncing] = useState(false)

    const products: number = 181
    const articles: number = 101
    const synced_products: number = 180
    const synced_articles: number = 100
    const sync_status: string = 'synced'
    const last_synced_at: string = '2024-01-01'
    const last_sync_error: string = 'No error'

    const runSync = async () => {
        if (syncing) return
        setSyncing(true)
        try {
            const response = await axios.post('/api/sync', { store_id: store._id })
            console.log(response)
        } catch (error) {
            console.error(error)
        } finally {
            setSyncing(false)
        }
    }

    return (
        <Card>
            <BlockStack gap={'400'}>
                <InlineStack align="space-between" gap="200" wrap={false}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <Text as="h2" variant="headingMd" truncate>{store.name}</Text>
                    </div>
                    <Badge tone="success">
                        {sync_status}
                    </Badge>
                </InlineStack>

                <BlockStack gap={'200'}>
                    <InlineStack align="space-between">
                        <Text as="span" variant="bodyMd">Products</Text>
                        <Text as="span" variant="bodyMd">{synced_products}/{products}</Text>
                    </InlineStack>
                    <InlineStack align="space-between">
                        <Text as="span" variant="bodyMd">Articles</Text>
                        <Text as="span" variant="bodyMd">{synced_articles}/{articles}</Text>
                    </InlineStack>
                </BlockStack>

                <InlineStack align="space-between" gap="200" wrap={false}>
                    <BlockStack gap={'100'}>
                        <Text as="span" variant="bodySm" tone="subdued">
                            Last synced: {last_synced_at}
                        </Text>
                        {last_sync_error !== 'No error' && (
                            <Text as="span" variant="bodySm" tone="critical">
                                Error: {last_sync_error}
                            </Text>
                        )}
                    </BlockStack>
                    <Button
                        icon={
                            <Icon
                                source={RefreshIcon}
                                tone="base"
                            />}
                        variant="primary"
                        disabled={synced_products === products && synced_articles === articles}
                        loading={syncing}
                        onClick={runSync}
                    >
                        Sync
                    </Button>
                </InlineStack>
            </BlockStack>
        </Card>
    )
}