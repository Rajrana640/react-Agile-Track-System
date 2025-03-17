import React from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const SignUp = () => {
    const history = useHistory();

    // Validation schema
    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string()
            .email("Please include an '@'.")
            .required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const handleSignUp = async (values, { setSubmitting }) => {
        try {
            await axios.post('http://localhost:4000/users', {
                name: values.name,
                email: values.email,
                password: values.password,
                role: 'employee'
            });
            history.push('/login');
        } catch (error) {
            console.error('Error signing up:', error);
        }
        setSubmitting(false);
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <Formik
                initialValues={{ name: '', email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSignUp}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div>
                            <label>Name:</label>
                            <Field type="text" name="name" />
                            <ErrorMessage name="name" component="div" style={{ color: 'red' }} />
                        </div>
                        <div>
                            <label>Email:</label>
                            <Field type="email" name="email" />
                            <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
                        </div>
                        <div>
                            <label>Password:</label>
                            <Field type="password" name="password" />
                            <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
                        </div>
                        <button type="submit" disabled={isSubmitting}>Sign Up</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default SignUp;

