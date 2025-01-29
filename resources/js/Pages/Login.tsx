import { Button, Card, Page, Form, FormLayout, TextField, Banner } from "@shopify/polaris";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { sendMagicLink } from "@/services/firebase";

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
        <Page title="Login">
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
                            value={formik.values.email}
                            onChange={(value) => formik.setFieldValue('email', value)}
                            label="Email"
                            type="email"
                            name="email"
                            error={formik.touched.email && formik.errors.email}
                            autoComplete="email"
                            onBlur={formik.handleBlur}
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
        </Page>
    );
}