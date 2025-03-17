import React, { useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Login = () => {
    const history = useHistory();
    const { login } = useContext(UserContext);

    // Validation schema
    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Please include an '@'.")
            .required('Email is required'),
        password: Yup.string().required('Password is required'),
    });
//coment added
    const handleLogin = async (values, { setSubmitting, setErrors }) => {
        try {
            const response = await axios.get(`http://localhost:4000/users?email=${values.email}&password=${values.password}`);
            if (response.data.length > 0) {
                const user = response.data[0];
                login(user);
                if (user.role === 'admin') {
                    history.push('/');
                } else {
                    history.push('/profiles');
                }
            } else {
                setErrors({ credentials: 'Invalid email or password' });
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
        setSubmitting(false);
    };

    return (
        <div>
            <h2>Login</h2>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleLogin}
            >
                {({ isSubmitting, errors }) => (
                    <Form>
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
                        {errors.credentials && <div style={{ color: 'red' }}>{errors.credentials}</div>}
                        <button type="submit" disabled={isSubmitting}>Login</button>
                    </Form>
                )}
            </Formik>
            <button onClick={() => history.push('/signup')}>Sign Up</button>
        </div>
    );
};

export default Login;
