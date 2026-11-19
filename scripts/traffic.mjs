const endpoint = process.env.CHECKOUT_URL ?? 'http://localhost:4300/checkout';
const rps = Math.max(1, Math.min(50, Number(process.env.TRAFFIC_RPS ?? 5)));
const seconds = Math.max(5, Math.min(600, Number(process.env.TRAFFIC_SECONDS ?? 120)));
let sent = 0, good = 0, failed = 0;
console.log(`Traffic: ${rps} req/s for ${seconds}s -> ${endpoint}`);
const timer = setInterval(async () => {
  sent++;
  try {
    const response = await fetch(endpoint, { signal: AbortSignal.timeout(5000) });
    if (response.ok) good++; else failed++;
  } catch { failed++; }
}, 1000 / rps);
setTimeout(() => {
  clearInterval(timer);
  console.log(JSON.stringify({ sent, success: good, failures: failed, note: 'In-flight requests may still complete.' }));
}, seconds * 1000);
