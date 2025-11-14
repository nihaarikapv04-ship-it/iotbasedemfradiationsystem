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

        console.log("🔌 Connecting to Firebase Database...");
        console.log("📡 Listening to path: classified-alerts");

        // --- 1. Listener for Real-Time Alerts (The Status Display) ---
        // This query reliably gets ONLY the last item added to the list.
        const alertsQuery = query(
            ref(database, 'classified-alerts'), 
            limitToLast(1)
        );
        
        const unsubscribeAlerts = onValue(alertsQuery, (snapshot) => {
            const alertsList = snapshot.val();
            
            console.log("📥 Received data from classified-alerts:", alertsList);
            
            if (alertsList) {
                // Safely extract the data: Get the single value from the object/list
                const latestAlert = Object.values(alertsList)[0];
                
                if (latestAlert && latestAlert.status) {
                    // Update the critical alert status
                    setAlertStatus(latestAlert.status); 
                    console.log("✅ ALERT STATUS UPDATED:", latestAlert.status);
                } else {
                    console.warn("⚠️ Data received but missing 'status' field:", latestAlert);
                    setAlertStatus("Data format error - missing status");
                }
            } else {
                console.warn("⚠️ No data found at 'classified-alerts' path. Make sure data is added under 'classified-alerts' node in Firebase.");
                setAlertStatus("No data received yet.");
            }
        }, (error) => {
            console.error("❌ Error reading from classified-alerts:", error);
            setAlertStatus("Connection error - check console");
        });


        // --- 2. Listener for Charts & Tables (Historical Data) ---
        // This listens to ALL data for your charts/tables.
        const readingsRef = ref(database, 'classified-alerts'); 

        const unsubscribeReadings = onValue(readingsRef, (snapshot) => {
            const data = snapshot.val();
            console.log("📊 Received readings data:", data);
            
            if (data) {
                // Convert the Firebase object into an array and reverse for chronological display
                const historicalReadings = Object.values(data);
                console.log(`✅ Loaded ${historicalReadings.length} readings`);
                setReadings(historicalReadings.slice().reverse()); 
            } else {
                console.warn("⚠️ No readings data found. Add data under 'classified-alerts' in Firebase Console.");
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
                        <p><strong>Last update:</strong> {readings[0] ? new Date(readings[0].timestamp * 1000).toLocaleString() : '—'}</p>
                    </div>

                    <div className="card">
                        <h3>Alerts</h3>
                        {/* The status color changes based on the alertStatus state */}
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
