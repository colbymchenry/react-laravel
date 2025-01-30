import { Modal, Text, Button, TextField, List, FormLayout, Form, Link } from '@shopify/polaris';
import { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import getFormikFieldProps from '@/utils/utils';

const StoreUrlSchema = Yup.object().shape({
    shopifyStoreUrl: Yup.string()
        .matches(/^[a-z0-9-]+$/, 'Store URL can only contain lowercase letters, numbers, and hyphens')
        .min(5, 'Store URL must be at least 5 characters')
        .required('Store URL is required')
});

const TokenSchema = Yup.object().shape({
    token: Yup.string()
        .required('API token is required')
        .matches(
            /^shpat_[a-fA-F0-9]{32}$/,
            'Token must start with "shpat_" followed by 32 hexadecimal characters'
        )
        .length(38, 'Token must be exactly 38 characters long')
});

export function ConnectStoreModal({ open, onClose }: { open: boolean, onClose: () => void }) {
    const [step, setStep] = useState<'url' | 'instructions' | 'token'>('url');
    const [storeUrl, setStoreUrl] = useState('');

    const urlFormik = useFormik({
        initialValues: {
            shopifyStoreUrl: ''
        },
        validationSchema: StoreUrlSchema,
        onSubmit: (values) => {
            setStoreUrl(values.shopifyStoreUrl);
            setStep('instructions');
        }
    });

    const tokenFormik = useFormik({
        initialValues: {
            token: ''
        },
        validationSchema: TokenSchema,
        onSubmit: async (values) => {
            try {
                await axios.post('/api/verify-store-token', {
                    storeUrl: storeUrl,
                    token: values.token
                });
                window.location.reload();
            } catch (error) {
                console.error('Failed to verify token:', error);
                tokenFormik.setFieldError('token', 'Invalid token');
            }
        }
    });

    const handleClose = () => {
        onClose();
        // Reset forms and step after animation completes
        setTimeout(() => {
            urlFormik.resetForm();
            tokenFormik.resetForm();
            setStep('url');
        }, 300);
    };

    const renderStoreUrlForm = () => (
        <Form onSubmit={urlFormik.handleSubmit}>
            <FormLayout>
                <TextField
                    label="Store URL"
                    suffix=".myshopify.com"
                    placeholder="my-store"
                    autoComplete="off"
                    {...getFormikFieldProps('shopifyStoreUrl', urlFormik)}
                />
                <Button
                    submit
                    variant="primary"
                    disabled={!urlFormik.isValid || !urlFormik.dirty}
                    fullWidth
                >
                    Continue
                </Button>
            </FormLayout>
        </Form>
    );

    const renderInstructions = () => (
        <div className="space-y-6">
            <div className="text-center">
                <Text as="p" variant="bodyLg">
                    Go to <Link url={`https://admin.shopify.com/store/${storeUrl}/settings/apps/development`} target="_blank">
                        App Development Settings
                    </Link>
                </Text>
            </div>

            <List type="number">
                <List.Item>Click "Allow custom app development" if prompted</List.Item>
                <List.Item>Click "Create an app" and name it whatever you want</List.Item>
                <List.Item>Click "Configure Admin API scopes"</List.Item>
                <List.Item>Add the following scopes:
                    <List type="bullet">
                        <List.Item>read_products</List.Item>
                        <List.Item>read_orders</List.Item>
                        <List.Item>read_content</List.Item>
                    </List>
                </List.Item>
                <List.Item>Click "Save" in the top right</List.Item>
                <List.Item>Go to the "API credentials" tab</List.Item>
                <List.Item>Click "Install app"</List.Item>
            </List>

            <div className="flex justify-center space-x-2">
                <Button onClick={() => setStep('url')}>Back</Button>
                <Button variant="primary" onClick={() => setStep('token')}>Continue</Button>
            </div>
        </div>
    );

    const renderTokenForm = () => (
        <Form onSubmit={tokenFormik.handleSubmit}>
            <FormLayout>
                <Text as="p" variant="bodyLg" alignment="center">
                    Click the "Reveal token once" button. Copy and paste the token below.
                </Text>

                <TextField
                    label="API Token"
                    placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    monospaced
                    autoComplete="off"
                    {...getFormikFieldProps('token', tokenFormik)}
                />

                <div className="flex justify-center space-x-2">
                    <Button onClick={() => setStep('instructions')}>Back</Button>
                    <Button
                        variant="primary"
                        submit
                        disabled={tokenFormik.isSubmitting || !tokenFormik.isValid || !tokenFormik.dirty}
                    >
                        Connect Store
                    </Button>
                </div>
            </FormLayout>
        </Form>
    );

    return (
        <Modal
            open={open}
            onClose={handleClose}
            title="Connect Shopify Store"
        >
            <Modal.Section>
                {step === 'url' && renderStoreUrlForm()}
                {step === 'instructions' && renderInstructions()}
                {step === 'token' && renderTokenForm()}
            </Modal.Section>
        </Modal>
    );
}