import { RemoteConfig } from '@/types/models';
import getFormikFieldProps from '@/utils/utils';
import { Form, FormLayout, TextField, Select, Button, Page, Layout } from '@shopify/polaris';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    openai_api_key: Yup.string().required('OpenAI API Key is required'),
    openai_embedding_model: Yup.string().required('OpenAI Embedding Model is required'),
    openai_model: Yup.string().required('OpenAI Model is required')
});

export default function AdminPage() {
    const [config, setConfig] = useState<RemoteConfig>({
        openai_api_key: '',
        openai_embedding_model: '',
        openai_model: '',
        _id: '',
        created_at: '',
        updated_at: ''
    });

    const handleSubmit = async (values: RemoteConfig) => {
        try {
            console.log(values)
        } catch (error) {
            console.error('Failed to update config:', error);
        }
    };

    return (
        <Page
            title="Admin Settings"
            subtitle="Manage API Keys, Default Values, and more"
        >
            <Layout>
                <Layout.Section>
                    <RemoteConfigForm
                        config={config}
                        onSubmit={handleSubmit}
                    />
                </Layout.Section>
            </Layout>
        </Page>
    );
}

function RemoteConfigForm({ config, onSubmit }: {
    config: RemoteConfig,
    onSubmit: (values: RemoteConfig) => Promise<void>
}) {
    const formik = useFormik({
        initialValues: {
            openai_api_key: config.openai_api_key,
            openai_embedding_model: config.openai_embedding_model,
            openai_model: config.openai_model
        },
        validationSchema,
        onSubmit: async (values) => {
            await onSubmit(values as RemoteConfig);
        }
    });

    return (
        <Form onSubmit={formik.handleSubmit}>
            <FormLayout>
                <TextField
                    label="OpenAI API Key"
                    placeholder="sk-..."
                    autoComplete="off"
                    {...getFormikFieldProps('openai_api_key', formik)}
                />

                <Select
                    label="OpenAI Model"
                    placeholder="Select a model"
                    options={[
                        { label: 'GPT-4o-mini', value: 'gpt-4o-mini' },
                        { label: 'GPT-4o', value: 'gpt-4' },
                        { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' }
                    ]}
                    {...getFormikFieldProps('openai_model', formik)}
                />

                <Select
                    label="OpenAI Embedding Model"
                    placeholder="Select an embedding model"
                    options={[
                        { label: 'text-embedding-3-large', value: 'text-embedding-3-large' },
                        { label: 'text-embedding-3-small', value: 'text-embedding-3-small' }
                    ]}
                    {...getFormikFieldProps('openai_embedding_model', formik)}
                />

                <Button submit loading={formik.isSubmitting}>Save Changes</Button>
            </FormLayout>
        </Form>
    );
}
