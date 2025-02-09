import { ArticleEmbedding, ProductEmbedding, Store } from "./models";

interface SyncData {
    total: number;
    synced: number;
    latest: {
        id: string;
        store_id: string;
        type: 'product' | 'article';
        sync_error: string;
        synced_at: string;
        created_at: string;
        updated_at: string;
    } | null;
    error_count: number;
    embedding_count: number;
    errors?: ProductEmbedding[] | ArticleEmbedding[];
    skipped?: ProductEmbedding[] | ArticleEmbedding[];
}

export interface StoreSyncResponse {
    store: Store;
    sync_data: {
        product: SyncData;
        article: SyncData;
    };
}

export type GetStoreSyncDataResponse = StoreSyncResponse[];