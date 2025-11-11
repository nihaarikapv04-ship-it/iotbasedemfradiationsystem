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
  const labels = latest.map(r => new Date(r.timestamp).toLocaleTimeString());
  const gamma = latest.map(r => r.gamma_cpm || (r.sensors && r.sensors.gamma_cpm) || 0);
  const uv = latest.map(r => r.uv_index || (r.sensors && r.sensors.uv_index) || 0);

  const data = useMemo(() => ({
    labels,
    datasets: [
      { label: 'Gamma (CPM)', data: gamma, tension: 0.3, borderWidth: 2, fill: false },
      { label: 'UV Index', data: uv, tension: 0.3, borderWidth: 2, fill: false }
    ]
  }), [labels, gamma, uv]);

  return (
    <div>
      <h3>Realtime</h3>
      <Line data={data} />
    </div>
  );
}
