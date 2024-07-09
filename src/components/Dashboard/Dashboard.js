import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScrumDetails from '../Scrum Details/ScrumDetails';

const Dashboard = () => {
    const [scrums, setScrums] = useState([]);
    const [selectedScrum, setSelectedScrum] = useState(null);

    useEffect(() => {
        const fetchScrums = async () => {
            try {
                const response = await axios.get('http://localhost:4000/scrums');
                setScrums(response.data);
            } catch (error) {
                console.error('Error fetching scrums:', error);
            }
        };

        fetchScrums();
    }, []);

    const handleGetDetails = async (scrumId) => {
        try {
            const response = await axios.get(`http://localhost:4000/scrums/${scrumId}`);
            setSelectedScrum(response.data);
        } catch (error) {
            console.error('Error fetching scrum details:', error);
        }
    };

    return (
        <div>
            <h2>Scrum Teams</h2>
            <ul>
                {scrums.map(scrum => (
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
