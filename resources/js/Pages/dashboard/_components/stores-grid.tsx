import { router } from '@inertiajs/react'
import { usePage } from '@inertiajs/react'
import { Deferred } from '@inertiajs/react'
import {
    Page,
    Layout,
    Card,
    Grid,
    BlockStack,
    InlineStack,
    SkeletonDisplayText,
    SkeletonBodyText,
    Button,
} from '@shopify/polaris'
import { RefreshIcon } from '@shopify/polaris-icons'
import { StoreCard } from './store-card'
import { GetStoreSyncDataResponse, StoreSyncResponse } from '@/types/responses'

export function StoresGrid() {
    const { syncData = [] as GetStoreSyncDataResponse } = usePage().props

    const handleRefresh = () => {
        router.reload(); // This will refresh the page and fetch new data
    }

    const LoadingSkeleton = () => (
        <Grid>
            {[1, 2, 3, 4].map((index) => (
                <Grid.Cell columnSpan={{
                    xs: 6,
                    sm: 6,
                    md: 6,
                    lg: 6,
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
        <Page
            primaryAction={
                <Button onClick={handleRefresh} icon={RefreshIcon}>
                    Refresh
                </Button>
            }
        >
            <Layout>
                <Layout.Section>
                    <Deferred data="syncData" fallback={<LoadingSkeleton />}>
                        <Grid>
                            {(syncData?.original ?? []).map((data: StoreSyncResponse, index: number) => (
                                <Grid.Cell columnSpan={{
                                    xs: 6,
                                    sm: 6,
                                    md: 6,
                                    lg: 6,
                                }} key={index}>
                                    <StoreCard data={data} />
                                </Grid.Cell>
                            ))}
                        </Grid>
                    </Deferred>
                </Layout.Section>
            </Layout>
        </Page>
    )
}
