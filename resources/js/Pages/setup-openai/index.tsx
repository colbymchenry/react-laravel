import { Button, Card, Page, Form, FormLayout, TextField, Banner, Text, BlockStack, Link, ButtonGroup } from "@shopify/polaris";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import getFormikFieldProps from "@/utils/utils";
import axios from "axios";
import { router } from "@inertiajs/react";

const validationSchema = Yup.object().shape({
    apiKey: Yup.string()
        .required("API key is required")
        .matches(
            /^sk-svcacct-[A-Za-z0-9_-]+$/,
            "Invalid API key format. It should start with 'sk-svcacct-' followed by the key"
        ),
});

export default function SetupOpenAIPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [status, setStatus] = useState<{ type: 'success' | 'critical', message: string } | null>(null);

    const formik = useFormik({
        initialValues: { apiKey: '' },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await axios.post('/api/openai/store-token', { token: values.apiKey });
                setStatus({
                    type: 'success',
                    message: 'API key has been saved!'
                });

                setTimeout(() => {
                    router.visit('/dashboard');
                }, 2000);
            } catch (error: any) {
                console.error(error);
                setStatus({
                    type: 'critical',
                    message: (error.response.data.message || 'Failed to save API key. Please try again.').replace('***************************************************************************************************************', '')
                });
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleNext = () => setCurrentStep(2);
    const handleBack = () => setCurrentStep(1);

    return (
        <Page>
            <div className="m-auto max-w-[800px]">
                <Text as="h1" variant="headingXl">
                    Setup OpenAI ({currentStep}/2)
                </Text>
                
                {currentStep === 1 && (
                    <>
                        <div className="my-4">
                            <video src="/assets/videos/OpenAI-Billing-Limits-Guide.mp4" autoPlay muted loop className="w-full h-auto rounded-xl shadow-xs" />
                        </div>
                        <Card>
                            <Text as="h2" variant="headingMd">
                                Step 1: Purchase OpenAI Credits
                            </Text>
                            <Text as="p" variant="bodyMd">
                                You must have credits before using ChatGPT.
                            </Text>
                            <div className="mt-4">
                                <ButtonGroup>
                                    <Button url="https://platform.openai.com/settings/organization/billing/overview" target="_blank">
                                        Purchase Credits
                                    </Button>
                                    <Button onClick={handleNext} variant="primary">
                                        Next Step
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </Card>
                    </>
                )}

                {currentStep === 2 && (
                    <>
                        <div className="my-4">
                            <video src="/assets/videos/OpenAI-API-Key-Guide.mp4" autoPlay muted loop className="w-full h-auto rounded-xl shadow-xs" />
                        </div>
                        <Card>
                            {status && (
                                <div className="mb-4">
                                    <Banner
                                        tone={status.type === 'success' ? 'success' : 'critical'}
                                        onDismiss={() => setStatus(null)}
                                        title={status.type === 'success' ? 'Success!' : 'Error'}
                                    >
                                        <p>{status.message}</p>
                                    </Banner>
                                </div>
                            )}

                            <Text as="h2" variant="headingMd">
                                Step 2: Enter Your API Key
                            </Text>

                            <Form onSubmit={formik.handleSubmit}>
                                <FormLayout>
                                    <TextField
                                        {...getFormikFieldProps('apiKey', formik)}
                                        label="OpenAI API Key"
                                        type="text"
                                        autoComplete="apiKey"
                                        disabled={formik.isSubmitting || status?.type === 'success'}
                                        helpText={
                                            <BlockStack gap="200">  
                                                <Link url="https://platform.openai.com/api-keys" target="_blank">
                                                    <span>
                                                        Click here to get your OpenAI API key.
                                                    </span>
                                                </Link>
                                                <span>
                                                    We&apos;ll use this API key to generate embeddings for your store.
                                                </span>
                                            </BlockStack>
                                        }
                                    />
                                    <ButtonGroup>
                                        <Button onClick={handleBack}>
                                            Back
                                        </Button>
                                        <Button
                                            submit
                                            variant="primary"
                                            loading={formik.isSubmitting}
                                            disabled={formik.isSubmitting || status?.type === 'success'}
                                        >
                                            Save
                                        </Button>
                                    </ButtonGroup>
                                </FormLayout>
                            </Form>
                        </Card>
                    </>
                )}
            </div>
        </Page>
    );
}