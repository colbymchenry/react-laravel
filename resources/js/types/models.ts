// This file is auto-generated. Do not edit manually.

export interface ApiKey {
    api_key: string;
    type: string;
    user_id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    id: string;
    created_at: string;
    updated_at: string;
}

export interface ArticleEmbedding {
    store_id: string;
    shopify_id: string;
    embedding: any[];
    title: string;
    content: string;
    url: string;
    imageUrl: string;
    publishedAt: string;
    error: string;
    skipped: string;
    id: string;
    created_at: string;
    updated_at: string;
}

export interface ProductEmbedding {
    store_id: string;
    shopify_id: string;
    embedding: any[];
    title: string;
    description: string;
    price: string;
    url: string;
    imageUrl: string;
    error: string;
    skipped: string;
    id: string;
    created_at: string;
    updated_at: string;
}

export interface RemoteConfig {
    openai_api_key: string;
    openai_embedding_model: string;
    openai_model: string;
    id: string;
    created_at: string;
    updated_at: string;
}

export interface Store {
    user_uid: string;
    store_url: string;
    access_token: string;
    name: string;
    email: string;
    domain: string;
    shop_owner: string;
    syncing: string;
    error: string;
    id: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    uid: string;
    admin: string;
    id: string;
    created_at: string;
    updated_at: string;
}
