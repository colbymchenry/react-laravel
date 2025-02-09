import { useDialog } from "@/stores/dialog";
import { ArticleEmbedding, ProductEmbedding, Store } from "@/types/models";
import { useEffect, useState } from "react";
import { Text, Card, BlockStack, SkeletonBodyText, Tabs } from "@shopify/polaris";
import axios from "axios";
import { SearchableDataTable } from "@/components/searchable-data-table";

type StoreLogsResponse = {
    product: {
        error: ProductEmbedding[];
        skipped: ProductEmbedding[];
    };
    article: {
        error: ArticleEmbedding[];
        skipped: ArticleEmbedding[];
    }
}

const LoadingSkeleton = () => (
    <BlockStack gap="400">
        <Card>
            <BlockStack gap="400">
                <SkeletonBodyText lines={3} />
            </BlockStack>
        </Card>
        <Card>
            <BlockStack gap="400">
                <SkeletonBodyText lines={3} />
            </BlockStack>
        </Card>
    </BlockStack>
);

export function StoreLogs({ store }: { store: Store }) {
    const dialog = useDialog();
    const [data, setData] = useState<StoreLogsResponse>();
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState(0);

    async function getStoreLogs() {
        setLoading(true);
        axios.get(`/api/store-logs/${store.id}`).then(async (res) => {
            const json = res.data;
            setData(json);
        }).catch((error: any) => {
            dialog.addDialog({
                title: 'Error',
                children: <Text as="p">{error.response.data.message || 'Failed to fetch store logs'}</Text>,
                primaryAction: {
                    content: 'OK',
                    onAction: () => {
                        dialog.removeDialog();
                    }
                }
            });
        }).finally(() => {
            setLoading(false);
        });
    }

    useEffect(() => {
        getStoreLogs();
    }, []);

    const tabs = [
        {
            id: 'products',
            content: 'Products',
            accessibilityLabel: 'Products',
            panelID: 'products-panel',
        },
        {
            id: 'articles',
            content: 'Articles',
            accessibilityLabel: 'Articles',
            panelID: 'articles-panel',
        },
    ];

    const truncateTitle = (title: string) => {
        return title.length >= 50 ? title.substring(0, 48) + '...' : title;
    };

    const renderProductTables = () => (
        <BlockStack gap="400">
            <Card>
                <BlockStack gap="200">
                    <Text variant="headingMd" as="h3">Skipped Products</Text>
                    <SearchableDataTable
                        items={data?.product.skipped ?? []}
                        columnContentTypes={['text', 'text']}
                        headings={['Title', 'Reason']}
                        itemToRow={(product: ProductEmbedding) => [
                            truncateTitle(product.title),
                            product.skipped
                        ]}
                        loading={loading}
                        searchPlaceholder="Search skipped products..."
                    />
                </BlockStack>
            </Card>

            <Card>
                <BlockStack gap="200">
                    <Text variant="headingMd" as="h3">Products with Errors</Text>
                    <SearchableDataTable
                        items={data?.product.error ?? []}
                        columnContentTypes={['text', 'text']}
                        headings={['Title', 'Error']}
                        itemToRow={(product: ProductEmbedding) => [
                            truncateTitle(product.title),
                            product.error
                        ]}
                        loading={loading}
                        searchPlaceholder="Search products with errors..."
                    />
                </BlockStack>
            </Card>
        </BlockStack>
    );

    const renderArticleTables = () => (
        <BlockStack gap="400">
            <Card>
                <BlockStack gap="200">
                    <Text variant="headingMd" as="h3">Skipped Articles</Text>
                    <SearchableDataTable
                        items={data?.article.skipped ?? []}
                        columnContentTypes={['text', 'text']}
                        headings={['Title', 'Reason']}
                        itemToRow={(article: ArticleEmbedding) => [
                            truncateTitle(article.title),
                            article.skipped
                        ]}
                        loading={loading}
                        searchPlaceholder="Search skipped articles..."
                    />
                </BlockStack>
            </Card>

            <Card>
                <BlockStack gap="200">
                    <Text variant="headingMd" as="h3">Articles with Errors</Text>
                    <SearchableDataTable
                        items={data?.article.error ?? []}
                        columnContentTypes={['text', 'text']}
                        headings={['Title', 'Error']}
                        itemToRow={(article: ArticleEmbedding) => [
                            truncateTitle(article.title),
                            article.error
                        ]}
                        loading={loading}
                        searchPlaceholder="Search articles with errors..."
                    />
                </BlockStack>
            </Card>
        </BlockStack>
    );

    if (loading) {
        return <div className="w-full md:w-[500px]"><LoadingSkeleton /></div>;
    }

    return (
        <div className="w-full md:w-[500px]">
            <BlockStack gap="400">
                <Text variant="headingMd" as="h3" tone={store.error ? "critical" : "success"}>
                    {store.error ?? 'Store is working fine'}
                </Text>
                <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
                    <Card roundedAbove="sm">
                        {selectedTab === 0 ? renderProductTables() : renderArticleTables()}
                    </Card>
                </Tabs>
            </BlockStack>
        </div>
    );
}