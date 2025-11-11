// Simple simulator: call onMessage with messages every 3 seconds
export function startSim(onMessage) {
  const id = setInterval(() => {
    const now = new Date().toISOString();
    const doc = {
      _id: now,
      deviceId: 'device-001',
      timestamp: now,
      gamma_cpm: Math.max(0, 100 + Math.round((Math.random() - 0.5) * 80)),
      uv_index: +(Math.random() * 6).toFixed(2),
      emf_mT: +(Math.random() * 0.03).toFixed(4),
      classification: Math.random() > 0.97 ? 'unsafe' : 'safe'
    };
    onMessage({ type: 'new-reading', doc });
  }, 3000);

  return () => clearInterval(id);
}
