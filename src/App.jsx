import React, { useEffect, useState } from 'react';
// Import Firebase functions
import { ref, onValue, query, limitToLast } from 'firebase/database'; 
// REMOVE: import { fetchHistory } from './mocks/mockApi';
// REMOVE: import { startSim } from './mocks/wsSim';

import Header from './components/Header';
import RealtimeChart from './components/RealtimeChart';
import ReadingsTable from './components/ReadingsTable';

// The component receives the 'database' prop from main.js
export default function App({ database }) {
  // We'll use one state for the readings and another for the current status
  const [readings, setReadings] = useState([]);
  const [alertStatus, setAlertStatus] = useState("Awaiting Classification...");

  useEffect(() => {
    if (!database) {
        console.error("Firebase database object is missing.");
        return; 
    }
    
    // --- 1. Listener for Historical/Chart Data (/raw-readings/) ---
    // We limit this to the last 1000 readings for chart performance
    const readingsQuery = query(ref(database, 'raw-readings'), limitToLast(1000));
    
    // Listen for new and historical data on the raw readings path
    const unsubscribeReadings = onValue(readingsQuery, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Convert the Firebase object into an array of reading documents
            const rawReadingsArray = Object.values(data);
            setReadings(rawReadingsArray.reverse()); // Reverse to get most recent first
        }
    });


    // --- 2. Listener for Real-Time Alerts (/classified-alerts/) ---
    // We only need the very last classified alert
    const alertsQuery = query(ref(database, 'classified-alerts'), limitToLast(1));
    
    const unsubscribeAlerts = onValue(alertsQuery, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // The object will have one key/value pair (the latest alert)
            const latestAlertDoc = Object.values(data)[0];
            setAlertStatus(latestAlertDoc.status); 
        } else {
            setAlertStatus("No recent classification.");
        }
    });

    // Cleanup function to detach both listeners when the component unmounts
    return () => {
        unsubscribeReadings();
        unsubscribeAlerts();
    };
  }, [database]); // Depend on the database prop

  return (
    <div className="app">
      <Header />
      <div className="layout">
        {/* ... chart and table components use 'readings' state as before ... */}
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
            {/* Display status and timestamp from the most recent reading */}
            <p><strong>Last update:</strong> {readings[0] ? new Date(readings[0].timestamp * 1000).toLocaleString() : '—'}</p>
          </div>

          <div className="card">
            <h3>Alerts</h3>
            {/* Display the real-time alert status */}
            <p style={{ fontWeight: 'bold', color: alertStatus === "UNSAFE" ? 'red' : 'green' }}>
                {alertStatus}
            </p>
            <small>Status provided by Vertex AI classification via Cloud Function</small>
          </div>
        </div>
      </div>
    </div>
  );
}