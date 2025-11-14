import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  CategoryScale
} from 'chart.js';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Legend, Tooltip, CategoryScale);

export default function RealtimeChart({ readings = [] }) {
  // prepare series (reverse so oldest -> newest)
  const latest = readings.slice(0, 120).reverse();
  // Handle timestamp in seconds or milliseconds
  const labels = latest.map(r => {
    const ts = typeof r.timestamp === 'number' ? (r.timestamp > 1e12 ? r.timestamp : r.timestamp * 1000) : r.timestamp;
    return new Date(ts).toLocaleTimeString();
  });
  const gamma = latest.map(r => r.gamma_cpm || (r.sensors && r.sensors.gamma_cpm) || 0);
  const uv = latest.map(r => r.uv_index || (r.sensors && r.sensors.uv_index) || 0);
  const emf = latest.map(r => r.emf_mT || (r.sensors && r.sensors.emf_mT) || 0);

  const data = useMemo(() => ({
    labels,
    datasets: [
      { 
        label: 'Gamma (CPM)', 
        data: gamma, 
        tension: 0.3, 
        borderWidth: 2, 
        fill: false,
        borderColor: 'rgb(75, 192, 192)'
      },
      { 
        label: 'UV Index', 
        data: uv, 
        tension: 0.3, 
        borderWidth: 2, 
        fill: false,
        borderColor: 'rgb(255, 99, 132)'
      },
      { 
        label: 'EMF (mT)', 
        data: emf, 
        tension: 0.3, 
        borderWidth: 2, 
        fill: false,
        borderColor: 'rgb(54, 162, 235)'
      }
    ]
  }), [labels, gamma, uv, emf]);

  return (
    <div>
      <h3>Realtime</h3>
      <Line data={data} />
    </div>
  );
}
