import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ScrumDetails from '../Scrum Details/ScrumDetails';
import { UserContext } from '../../context/UserContext';

const Dashboard = () => {
    const [scrums, setScrums] = useState([]);
    const [selectedScrum, setSelectedScrum] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [users, setUsers] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchScrums = async () => {
            try {
                const response = await axios.get('http://localhost:4000/scrums');
                setScrums(response.data);
            } catch (error) {
                console.error('Error fetching scrums:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchScrums();
        fetchUsers();
    }, []);

    const handleGetDetails = async (scrumId) => {
        try {
            const response = await axios.get(`http://localhost:4000/scrums/${scrumId}`);
            setSelectedScrum(response.data);
        } catch (error) {
            console.error('Error fetching scrum details:', error);
        }
    };

    const formik = useFormik({
        initialValues: {
            scrumName: '',
            taskTitle: '',
            taskDescription: '',
            taskStatus: 'To Do',
            assignedTo: ''
        },
        validationSchema: Yup.object({
            scrumName: Yup.string().required('Scrum Name is required'),
            taskTitle: Yup.string().required('Task Title is required'),
            taskDescription: Yup.string().required('Task Description is required'),
            assignedTo: Yup.string().required('You must assign a user')
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const newScrumResponse = await axios.post('http://localhost:4000/scrums', {
                    name: values.scrumName,
                });

                const newScrum = newScrumResponse.data;

                await axios.post('http://localhost:4000/tasks', {
                    title: values.taskTitle,
                    description: values.taskDescription,
                    status: values.taskStatus,
                    scrumId: newScrum.id,
                    assignedTo: values.assignedTo,
                    history: [{
                        status: values.taskStatus,
                        date: new Date().toISOString().split('T')[0],
                    }],
                });

                const updatedScrums = await axios.get('http://localhost:4000/scrums');
                setScrums(updatedScrums.data);
                setShowForm(false);
                resetForm();
            } catch (error) {
                console.error('Error adding scrum:', error);
            }
        }
    });

    return (
        <div>
            <h2>Scrum Teams</h2>
            {user?.role === 'admin' && (
                <div>
                    <button onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : 'Add New Scrum'}
                    </button>
                    {showForm && (
                        <form onSubmit={formik.handleSubmit}>
                            <div>
                                <label>Scrum Name:</label>
                                <input
                                    type="text"
                                    {...formik.getFieldProps('scrumName')}
                                />
                                {formik.touched.scrumName && formik.errors.scrumName && (
                                    <div style={{ color: 'red' }}>{formik.errors.scrumName}</div>
                                )}
                            </div>
                            <div>
                                <label>Task Title:</label>
                                <input
                                    type="text"
                                    {...formik.getFieldProps('taskTitle')}
                                />
                                {formik.touched.taskTitle && formik.errors.taskTitle && (
                                    <div style={{ color: 'red' }}>{formik.errors.taskTitle}</div>
                                )}
                            </div>
                            <div>
                                <label>Task Description:</label>
                                <input
                                    type="text"
                                    {...formik.getFieldProps('taskDescription')}
                                />
                                {formik.touched.taskDescription && formik.errors.taskDescription && (
                                    <div style={{ color: 'red' }}>{formik.errors.taskDescription}</div>
                                )}
                            </div>
                            <div>
                                <label>Task Status:</label>
                                <select {...formik.getFieldProps('taskStatus')}>
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                            <div>
                                <label>Assign To:</label>
                                <select {...formik.getFieldProps('assignedTo')}>
                                    <option value="">Select a user</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                                {formik.touched.assignedTo && formik.errors.assignedTo && (
                                    <div style={{ color: 'red' }}>{formik.errors.assignedTo}</div>
                                )}
                            </div>
                            <button  type="submit">Create Scrum</button>
                        </form>
                    )}
                </div>
            )}
            <ul>
                {scrums.map((scrum) => (
                    <li key={scrum.id}>
                        {scrum.name}
                        <button onClick={() => handleGetDetails(scrum.id)}>Get Details</button>
                    </li>
                ))}
            </ul>
            {selectedScrum && <ScrumDetails scrum={selectedScrum} />}
        </div>
    );
};

export default Dashboard;

