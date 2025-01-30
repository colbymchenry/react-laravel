import { usePageData } from '@/stores/page-data'
import { Deferred } from '@inertiajs/react'
import { Page, Layout, Text, Card, Grid, BlockStack, InlineStack, Badge, SkeletonDisplayText, SkeletonBodyText, Button, Icon } from '@shopify/polaris'
import { RefreshIcon } from '@shopify/polaris-icons'

export default function Dashboard() {
    const { stores = [] } = usePageData()

    const cards = stores.map((store) => {
        return {
            ...store,
            products: 180,
            articles: 100,
            synced_products: 180,
            synced_articles: 100,
            sync_status: 'synced',
            last_synced_at: '2024-01-01',
            last_sync_error: 'No error',
        }
    })

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
                    <Deferred data="sync_data" fallback={<LoadingSkeleton />}>
                        <Grid>
                            {cards.map((card, index) => (
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
                                                    <Text as="h2" variant="headingMd" truncate>{card.name}</Text>
                                                </div>
                                                <Badge tone="success">
                                                    {card.sync_status}
                                                </Badge>
                                            </InlineStack>

                                            <BlockStack gap={'200'}>
                                                <InlineStack align="space-between">
                                                    <Text as="span" variant="bodyMd">Products</Text>
                                                    <Text as="span" variant="bodyMd">{card.synced_products}/{card.products}</Text>
                                                </InlineStack>
                                                <InlineStack align="space-between">
                                                    <Text as="span" variant="bodyMd">Articles</Text>
                                                    <Text as="span" variant="bodyMd">{card.synced_articles}/{card.articles}</Text>
                                                </InlineStack>
                                            </BlockStack>

                                            <InlineStack align="space-between" gap="200" wrap={false}>
                                                <BlockStack gap={'100'}>
                                                    <Text as="span" variant="bodySm" tone="subdued">
                                                        Last synced: {card.last_synced_at}
                                                    </Text>
                                                    {card.last_sync_error !== 'No error' && (
                                                        <Text as="span" variant="bodySm" tone="critical">
                                                            Error: {card.last_sync_error}
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
                                                    disabled={card.synced_products === card.products && card.synced_articles === card.articles}>Sync</Button>
                                            </InlineStack>
                                        </BlockStack>
                                    </Card>
                                </Grid.Cell>
                            ))}
                        </Grid>
                    </Deferred>
                </Layout.Section>
            </Layout>
        </Page>
    )
} 