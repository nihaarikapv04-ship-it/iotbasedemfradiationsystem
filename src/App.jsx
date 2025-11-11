import React, { useEffect, useState } from 'react';
// Import Firebase functions: query and limitToLast are key for performance
import { ref, onValue, query, limitToLast } from 'firebase/database'; 

// Import your custom components (Header, Charts, Table)
import Header from './components/Header';
import RealtimeChart from './components/RealtimeChart';
import ReadingsTable from './components/ReadingsTable';
// import { fetchHistory } from './mocks/mockApi'; // Mocks removed

// Assuming 'database' is passed as a prop from main.js
export default function App({ database }) {
    // State for the dashboard chart/table data
    const [readings, setReadings] = useState([]);
    // State for the critical alert status display
    const [alertStatus, setAlertStatus] = useState("Awaiting Classification...");

    useEffect(() => {
        if (!database) {
            console.error("Firebase database connection is missing.");
            return; 
        }

        // --- 1. Listener for Real-Time Alerts (The Status Display) ---
        // Query to retrieve only the last 1 item on the classified-alerts list.
        const alertsQuery = query(ref(database, 'classified-alerts'), limitToLast(1));
        
        const unsubscribeAlerts = onValue(alertsQuery, (snapshot) => {
            const alertsList = snapshot.val();
            
            if (alertsList) {
                // Get the unique time-ordered key (the name of the last item in the list)
                const latestKey = Object.keys(alertsList).pop();
                const latestAlert = alertsList[latestKey];
                
                // Update the critical alert status
                setAlertStatus(latestAlert.status); 
            } else {
                setAlertStatus("No data received yet.");
            }
        });


        // --- 2. Listener for Charts & Tables (Historical Data) ---
        // This listens to ALL the data in the classified-alerts path for the charts/tables
        // Note: For charts with lots of data, you might want to adjust the query limit
        const readingsRef = ref(database, 'classified-alerts'); 

        const unsubscribeReadings = onValue(readingsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Convert the Firebase object into an array and reverse for chronological display
                const historicalReadings = Object.values(data);
                // We assume your readings array uses the same data structure as the alert object
                setReadings(historicalReadings.slice().reverse()); 
            }
        });


        // Cleanup function to detach both listeners when the component unmounts
        return () => {
            unsubscribeAlerts();
            unsubscribeReadings();
        };
    }, [database]); 
    // We are deliberately ignoring the old mock state updates, which were removed.

    return (
        <div className="app">
            <Header />
            <div className="layout">
                <div>
                    <div className="card charts">
                        {/* RealtimeChart component is now receiving actual Firebase data */}
                        <RealtimeChart readings={readings} />
                    </div>

                    <div className="card table" style={{ marginTop: 16 }}>
                        <ReadingsTable readings={readings.slice(0, 30)} />
                    </div>
                </div>

                <div>
                    <div className="card" style={{ marginBottom: 12 }}>
                        <h3>Device Info</h3>
                        <p><strong>ID:</strong> device-001</p>
                        <p><strong>Location:</strong> Bangalore (Realtime)</p>
                        <p><strong>Last update:</strong> {readings[0] ? new Date(readings[0].timestamp * 1000).toLocaleString() : '—'}</p>
                    </div>

                    <div className="card">
                        <h3>Alerts</h3>
                        {/* Display the real-time classified status */}
                        <p style={{ fontWeight: 'bold', color: alertStatus === "UNSAFE" ? 'red' : 'green' }}>
                            {alertStatus}
                        </p>
                        <small>Status provided by Edge AI classification.</small>
                    </div>
                </div>
            </div>
        </div>
    );
}
