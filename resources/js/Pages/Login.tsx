import { Button, Card, Page, Form, FormLayout, TextField, Banner, Text } from "@shopify/polaris";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { sendMagicLink } from "@/services/firebase";
import getFormikFieldProps from "@/utils/utils";

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
});

export default function LoginPage() {
    const [status, setStatus] = useState<{ type: 'success' | 'critical', message: string } | null>(null);

    const formik = useFormik({
        initialValues: { email: '' },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await sendMagicLink(values.email);
                setStatus({
                    type: 'success',
                    message: 'Magic link has been sent to your email!'
                });
            } catch (error) {
                console.error(error);
                setStatus({
                    type: 'critical',
                    message: 'Failed to send magic link. Please try again.'
                });
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Page>
            <div className="m-auto max-w-[500px]">
                <Text as="h1" variant="headingXl">
                    Login
                </Text>
                <div className="my-4"></div>
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

                    <Form onSubmit={formik.handleSubmit}>
                        <FormLayout>
                            <TextField
                                {...getFormikFieldProps('email', formik)}
                                label="Email"
                                type="email"
                                autoComplete="email"
                                disabled={formik.isSubmitting || status?.type === 'success'}
                                helpText={
                                    <span>
                                        We&apos;ll use this email address to send you a magic link to sign in.
                                    </span>
                                }
                            />
                            <Button
                                submit
                                variant="primary"
                                loading={formik.isSubmitting}
                                disabled={formik.isSubmitting || status?.type === 'success'}
                            >
                                Send Magic Link
                            </Button>
                        </FormLayout>
                    </Form>
                </Card>
            </div>
        </Page>
    );
}