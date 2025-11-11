// mock API reading generator - returns an array of readings
export async function fetchHistory(deviceId = 'device-001', limit = 200) {
  // fetch base sample (from public/mock/data.json)
  const base = await fetch('/mock/data.json').then(r => r.json());
  const arr = Array.from({ length: limit }).map((_, i) => {
    // generate time spaced entries
    const ts = new Date(Date.now() - (limit - i) * 60 * 1000).toISOString();
    const gamma = Math.max(0, base.sensors.gamma_cpm + Math.round((Math.random() - 0.5) * 40));
    const uv = +(Math.max(0, base.sensors.uv_index + (Math.random() - 0.5) * 1.5)).toFixed(2);
    const emf = +(Math.max(0, base.sensors.emf_mT + (Math.random() - 0.5) * 0.01)).toFixed(4);
    return {
      _id: `${deviceId}-${i}`,
      deviceId,
      timestamp: ts,
      gamma_cpm: gamma,
      uv_index: uv,
      emf_mT: emf,
      classification: Math.random() > 0.98 ? 'unsafe' : 'safe'
    };
  });
  return arr;
}
