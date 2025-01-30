import { Card, Text, Button, TextField, List, FormLayout, Form, Box, Link } from '@shopify/polaris';
import { useState } from "react"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

export default function ShopifyConnectCard() {
    const [confirmed, setConfirmed] = useState<boolean>(false)

    const validationSchema = Yup.object().shape({
        shopifyStoreUrl: Yup.string()
            .matches(/^[a-z0-9-]+$/, 'Store URL can only contain lowercase letters, numbers, and hyphens')
            .min(5, 'Store URL must be at least 5 characters')
            .required('Store URL is required')
    });

    const formik = useFormik({
        initialValues: {
            shopifyStoreUrl: ''
        },
        validationSchema,
        onSubmit: () => {
            setConfirmed(true);
        }
    });

    return (
        <div className="flex">
            <Card>
                <Box paddingBlockEnd="200">
                    <div className="text-center">
                        <Box paddingBlockEnd="200">
                            <Text variant="headingLg" as="h2">Connect Your Shopify Store</Text>
                        </Box>
                        <Box>
                            <Text variant="bodyMd" tone="subdued" as="p">
                                Integrate your Shopify store to unlock powerful features and insights.
                            </Text>
                        </Box>
                    </div>
                </Box>

                <Box paddingBlock="200">

                    <div className="justify-center flex">
                        <img
                            src="/assets/icons/ic-shopify.svg"
                            alt="Shopify Logo"
                            width={64}
                            height={64}
                        />
                    </div>

                    {confirmed ? <Box paddingBlock="400"><Steps shopifyStoreUrl={formik.values.shopifyStoreUrl} /></Box> : (
                        <Form onSubmit={formik.handleSubmit}>
                            <FormLayout>
                                <TextField
                                    label="Store URL"
                                    value={formik.values.shopifyStoreUrl}
                                    onChange={(value) => formik.setFieldValue('shopifyStoreUrl', value)}
                                    suffix=".myshopify.com"
                                    placeholder="my-store"
                                    autoComplete="off"
                                    name="shopifyStoreUrl"
                                    id="shopifyStoreUrl"
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.shopifyStoreUrl && formik.errors.shopifyStoreUrl}
                                />
                                <Button
                                    submit
                                    variant="primary"
                                    disabled={!formik.isValid || !formik.dirty}
                                >
                                    Confirm
                                </Button>
                            </FormLayout>
                        </Form>
                    )}
                </Box>

                <Box paddingBlockStart="200">
                    <Text variant="bodySm" tone="subdued" alignment="center" as="p">
                        By connecting your store, you'll be able to sync products, orders, and customer data.
                    </Text>
                </Box>
            </Card>
        </div>
    )
}

function Steps({ shopifyStoreUrl }: { shopifyStoreUrl: string }) {
    const [step, setStep] = useState<number>(1)
    const STEPS = [Step1, Step2, Step3, Step4, Step5]

    if (step === 6) {
        return <Step6 shopifyStoreUrl={shopifyStoreUrl} />
    }

    return (
        <div className="w-full">
            {STEPS[step - 1]({ shopifyStoreUrl })}
            <div className="flex flex-row items-center justify-center w-full gap-2 mt-4">
                <Button onClick={() => setStep(step - 1)} disabled={step === 1}>Previous</Button>
                <Button variant='primary' onClick={() => setStep(step + 1)} disabled={step === 6}>Next</Button>
            </div>
        </div>
    )
}

function Step1({ shopifyStoreUrl }: { shopifyStoreUrl: string }) {
    return (
        <div className="text-center">
            <Text as="p" variant="bodyLg">
                Go <Link
                    url={`https://admin.shopify.com/store/${shopifyStoreUrl}/settings/apps/development`}
                    target="_blank">here</Link> and click <Button variant="primary">Allow custom app development</Button>
            </Text>
            <Box paddingBlockStart="400">
                <Text as="p" variant="bodySm" tone="subdued">
                    If you do not see this message from Shopify and you see a <strong>Create an app</strong> button, <strong>click Next</strong>.
                </Text>
            </Box>
        </div>
    )
}

function Step2() {
    return (
        <Text as="p" variant="bodyLg" alignment="center">
            Next click <Button variant="primary">Create an app</Button> on the same page and name it whatever you want.
        </Text>
    )
}

function Step3() {
    return (
        <Text as="p" variant="bodyLg" alignment="center">
            Next click <Button>Configure Admin API scopes</Button> on the same page.
        </Text>
    )
}

function Step4() {
    return (
        <div className="text-center">
            <Text as="p" variant="bodyLg">Add the following scopes:</Text>
            <List type="bullet">
                <List.Item>read_products</List.Item>
                <List.Item>read_orders</List.Item>
                <List.Item>read_content</List.Item>
            </List>
            <Text as="p" variant="bodyLg">
                Then click <Button variant="primary">Save</Button> on the top right.
            </Text>
        </div>
    )
}

function Step5() {
    return (
        <Text as="p" variant="bodyLg" alignment="center">
            Go to the <strong>API credentials</strong> tab on the same page and click <Button variant="primary">Install app</Button>
        </Text>
    )
}

const validationSchema = Yup.object().shape({
    token: Yup.string()
        .required('API token is required')
        .matches(
            /^shpat_[a-fA-F0-9]{32}$/,
            'Token must start with "shpat_" followed by 32 hexadecimal characters'
        )
        .length(38, 'Token must be exactly 38 characters long')
});

function Step6({ shopifyStoreUrl }: { shopifyStoreUrl: string }) {
    const formik = useFormik({
        initialValues: { token: '' },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await axios.post('/api/verify-store-token', {
                    storeUrl: shopifyStoreUrl,
                    token: values.token
                });
                // Redirect to dashboard or show success message
                window.location.reload()
            } catch (error) {
                console.error('Failed to verify token:', error);
                formik.setFieldError('token', 'Invalid token');
            }
        }
    });

    return (
        <Form onSubmit={formik.handleSubmit}>
            <FormLayout>
                <Text as="p" variant="bodyLg" alignment="center">
                    Click the <Link>Reveal token once</Link> button. Copy and paste the token below.
                </Text>

                <TextField
                    label="API Token"
                    name="token"
                    id="token"
                    value={formik.values.token}
                    onChange={(value) => formik.setFieldValue('token', value)}
                    onBlur={formik.handleBlur}
                    error={formik.touched.token && formik.errors.token}
                    type="text"
                    placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    monospaced
                    autoComplete="off"
                />

                <Button
                    variant="primary"
                    submit
                    disabled={
                        formik.isSubmitting ||
                        !formik.isValid ||
                        !formik.dirty
                    }
                    fullWidth
                >
                    Verify Token
                </Button>
            </FormLayout>
        </Form>
    )
}
