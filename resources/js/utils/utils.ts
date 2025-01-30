export default function getFormikFieldProps(name: string, formik: any) {
    return {
        value: formik.values[name],
        onChange: (value: any) => formik.setFieldValue(name, value),
        onBlur: () => formik.setFieldTouched(name),
        error: formik.touched[name] && formik.errors[name],
        name: name
    }
}