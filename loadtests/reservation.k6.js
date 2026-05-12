import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

// 10 concurrent users hammering POST /api/reservations/create.
// Logs in ONCE in setup() so the auth endpoint isn't measured here —
// the token is shared across all VUs.
//
// IMPORTANT: backend/src/app.js applies a global rate limit of 100 req / 15 min per IP.
// Before running this test, EITHER:
//   1) Temporarily raise `max` in the rateLimit() config, OR
//   2) Comment out `app.use(limiter)` in app.js,
// otherwise VUs will start receiving 429 Too Many Requests almost immediately.

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000';
const EMAIL    = __ENV.TEST_EMAIL;
const PASSWORD = __ENV.TEST_PASSWORD;

const reservationLatency = new Trend('reservation_latency_ms', true);
const reservationOk      = new Rate('reservation_success');

export const options = {
    scenarios: {
        ten_concurrent: {
            executor: 'constant-vus',
            vus: 10,
            duration: '15s',
        },
    },
    thresholds: {
        'reservation_success':            ['rate>0.95'],   // ≥95% of creates succeed
        'reservation_latency_ms':         ['p(95)<1500'],  // 95th percentile under 1.5s
        'http_req_failed':                ['rate<0.05'],
    },
};

export function setup() {
    if (!EMAIL || !PASSWORD) {
        throw new Error('Set TEST_EMAIL and TEST_PASSWORD env vars (a pre-seeded user in your DB).');
    }

    const res = http.post(
        `${BASE_URL}/api/users/login`,
        JSON.stringify({ email: EMAIL, password: PASSWORD }),
        { headers: { 'Content-Type': 'application/json' } },
    );

    if (res.status !== 200) {
        throw new Error(`Login failed (${res.status}): ${res.body}`);
    }

    return { token: res.json('token') };
}

export default function (data) {
    // Reservation date one week out — avoids the "in the past" validation.
    const reservationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

    const payload = JSON.stringify({
        reservationDate,
        reservationTime: '19:00',
        numberOfGuests: 2,
        orderedItem: `k6 load test VU=${__VU} ITER=${__ITER}`,
    });

    const res = http.post(`${BASE_URL}/api/reservations/create`, payload, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token}`,
        },
        tags: { endpoint: 'reservation_create' },
    });

    const passed = check(res, {
        'status is 201': (r) => r.status === 201,
        'has reservation id': (r) => !!r.json('reservation._id'),
    });

    reservationOk.add(passed);
    reservationLatency.add(res.timings.duration);

    // Small pause so each VU does a few iterations across the 15s window
    // instead of one giant burst — closer to "10 concurrent users clicking submit".
    sleep(1);
}
