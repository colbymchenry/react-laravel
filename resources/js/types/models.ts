// This file is auto-generated. Do not edit manually.

export interface RemoteConfig {
    openai_api_key: string;
    openai_embedding_model: string;
    openai_model: string;
    _id: string;
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
    _id: string;
    created_at: string;
    updated_at: string;
}

export interface SyncData {
    store_id: string;
    type: string;
    shopify_id: string;
    synced_at: string;
    sync_status: string;
    sync_error: string;
    _id: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    uid: string;
    admin: string;
    _id: string;
    created_at: string;
    updated_at: string;
}
