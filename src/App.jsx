import React, { useEffect, useState } from 'react';
// Import necessary Firebase functions, including 'query' and 'limitToLast'
import { ref, onValue, query, limitToLast } from 'firebase/database'; 

// Import your custom components
import Header from './components/Header';
import RealtimeChart from './components/RealtimeChart';
import ReadingsTable from './components/ReadingsTable';

// The component receives the 'database' object as a prop from main.js
export default function App({ database }) {
    // State for the dashboard chart/table data
    const [readings, setReadings] = useState([]);
    // State for the critical alert status display
    const [alertStatus, setAlertStatus] = useState("Awaiting Classification...");

    useEffect(() => {
        if (!database) {
            console.error("❌ Firebase database connection is missing.");
            return; 
        }

        // --- 1. Listener for Real-Time Alerts (Status Display) ---
        const alertsQuery = query(
            ref(database, 'classified-alerts'), 
            limitToLast(1)
        );
        
        const unsubscribeAlerts = onValue(alertsQuery, (snapshot) => {
            const alertsList = snapshot.val();
            
            if (alertsList) {
                const latestAlert = Object.values(alertsList)[0];
                
                if (latestAlert && latestAlert.status) {
                    // Normalize status to uppercase for clean display
                    setAlertStatus(latestAlert.status.toUpperCase()); 
                } else {
                    setAlertStatus("Data format error - missing status");
                }
            } else {
                setAlertStatus("No data received yet.");
            }
        }, (error) => {
            console.error("❌ Error reading from classified-alerts:", error);
            setAlertStatus("Connection error - check console");
        });


        // --- 2. Listener for Charts & Tables (Historical Data) ---
        const readingsRef = ref(database, 'classified-alerts'); 

        const unsubscribeReadings = onValue(readingsRef, (snapshot) => {
            const data = snapshot.val();
            
            if (data) {
                const historicalReadings = Object.values(data);
                
                // CRITICAL FIX: Map the data to ensure column names are correctly retrieved.
                // This ensures that if the Python script sends 'gamma', the table gets 'Gamma'.
                const mappedReadings = historicalReadings.map(item => ({
                    // FIX: Timestamp conversion (from seconds to milliseconds)
                    timestamp: item.timestamp,
                    
                    // CRITICAL FIX: Ensure keys match the table headers exactly (case-sensitive)
                    Gamma: item.gamma || item.Gamma || '-',
                    UV: item.uv || item.UV || '-',
                    // Check for both common formats of the EMF field
                    'EMF (mT)': item.EMF_mT || item.emf_mT || item.EMF || '-', 
                    Class: item.status ? item.status.toUpperCase() : 'UNKNOWN',
                }));
                
                // Reverse and set the final data
                setReadings(mappedReadings.slice().reverse()); 
            } else {
                setReadings([]);
            }
        }, (error) => {
            console.error("❌ Error reading readings data:", error);
        });


        // Cleanup function to detach both listeners when the component unmounts
        return () => {
            unsubscribeAlerts();
            unsubscribeReadings();
        };
    }, [database]); 
    

    return (
        <div className="app">
            <Header />
            <div className="layout">
                <div>
                    <div className="card charts">
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
                        <p>
                            <strong>Last update:</strong> 
                            {/* Final date formatting fix */}
                            {readings[0] 
                                ? new Date(readings[0].timestamp * 1000).toLocaleString() 
                                : '—'
                            }
                        </p>
                    </div>

                    <div className="card">
                        <h3>Alerts</h3>
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