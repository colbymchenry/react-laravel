import getFormikFieldProps from '@/utils/utils';
import { usePage, Deferred, } from '@inertiajs/react';
import { Form, FormLayout, TextField, Select, Button, SkeletonDisplayText, SkeletonBodyText } from '@shopify/polaris';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    openai_api_key: Yup.string().required('OpenAI API Key is required'),
    openai_embedding_model: Yup.string().required('OpenAI Embedding Model is required'),
    openai_model: Yup.string().required('OpenAI Model is required')
});

const LoadingSkeleton = () => (
    <Form onSubmit={() => { }}>
        <FormLayout>
            <div style={{ marginBottom: '1rem' }}>
                <SkeletonDisplayText size="small" />
                <div style={{ marginTop: '0.5rem' }}>
                    <SkeletonBodyText lines={1} />
                </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <SkeletonDisplayText size="small" />
                <div style={{ marginTop: '0.5rem' }}>
                    <SkeletonBodyText lines={1} />
                </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <SkeletonDisplayText size="small" />
                <div style={{ marginTop: '0.5rem' }}>
                    <SkeletonBodyText lines={1} />
                </div>
            </div>

            <div style={{ width: '100px' }}>
                <SkeletonBodyText lines={1} />
            </div>
        </FormLayout>
    </Form>
);

export function RemoteConfigForm() {
    return (
        <Deferred data="remoteConfig" fallback={<LoadingSkeleton />}>
            <ConfigFormContent />
        </Deferred>
    );
}

function ConfigFormContent() {
    const { remoteConfig } = usePage().props

    console.log(remoteConfig)

    const formik = useFormik({
        initialValues: {
            openai_api_key: remoteConfig?.openai_api_key,
            openai_embedding_model: remoteConfig?.openai_embedding_model,
            openai_model: remoteConfig?.openai_model
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await axios.post('/api/update-remote-config', values)
            } catch (error) {
                console.error('Failed to update config:', error);
            }
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
