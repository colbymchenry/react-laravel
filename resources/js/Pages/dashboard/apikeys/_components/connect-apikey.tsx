import { Modal, Text, Button, TextField, FormLayout, Form, Select } from '@shopify/polaris';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import getFormikFieldProps from '@/utils/utils';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    type: Yup.string().required('Type is required'),
    description: Yup.string(),
    apiKey: Yup.string().required('API key is required')
});

const API_TYPES = [
    { label: 'OpenAI', value: 'openai' }
];

export function ConnectApiKeyModal({ open, onClose }: { open: boolean, onClose: () => void }) {
    const formik = useFormik({
        initialValues: {
            name: '',
            type: '',
            description: '',
            apiKey: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await axios.post('/api/apikeys', {
                    name: values.name,
                    type: values.type,
                    description: values.description,
                    api_key: values.apiKey
                });
                window.location.reload();
            } catch (error: any) {
                console.error('Failed to add API key:', error);
                if (error.response && error.response.data && error.response.data.message) {
                    if (error.response.data.message === 'API key name already exists') {
                        formik.setFieldError('name', error.response.data.message);
                    } else {
                        formik.setFieldError('apiKey', error.response.data.message);
                    }
                } else {
                    formik.setFieldError('apiKey', 'Failed to add API key');
                }
            }
        }
    });

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            formik.resetForm();
        }, 300);
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            title="Add New API Key"
        >
            <Modal.Section>
                <Form onSubmit={formik.handleSubmit}>
                    <FormLayout>
                        <TextField
                            label="Name"
                            autoComplete="off"
                            {...getFormikFieldProps('name', formik)}
                        />
                        <Select
                            label="Type"
                            options={API_TYPES}
                            placeholder="Select API Type"
                            {...getFormikFieldProps('type', formik)}
                        />
                        <TextField
                            label="Description"
                            autoComplete="off"
                            {...getFormikFieldProps('description', formik)}
                        />
                        <TextField
                            label="API Key"
                            autoComplete="off"
                            type="password"
                            {...getFormikFieldProps('apiKey', formik)}
                        />
                        <Button
                            submit
                            variant="primary"
                            disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
                            fullWidth
                        >
                            Add API Key
                        </Button>
                    </FormLayout>
                </Form>
            </Modal.Section>
        </Modal>
    );
}