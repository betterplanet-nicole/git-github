const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('../server');

function startServer() {
  return new Promise((resolve) => {
    const server = createServer();
    server.listen(0, () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

test('GET /api/aws-solution returns architecture recommendation', async () => {
  const { server, baseUrl } = await startServer();

  try {
    const res = await fetch(`${baseUrl}/api/aws-solution`);
    assert.equal(res.status, 200);

    const payload = await res.json();
    assert.match(payload.architecture, /API Gateway/);
    assert.equal(Array.isArray(payload.rationale), true);
  } finally {
    server.close();
  }
});

test('POST /api/leads stores a lead and returns id', async () => {
  const { server, baseUrl } = await startServer();

  try {
    const lead = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '555-555-5555',
      utility: 'PG&E',
      state: 'CA',
      monthlyBill: '190',
      notes: 'Interested in rebates',
    };

    const submitRes = await fetch(`${baseUrl}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });

    assert.equal(submitRes.status, 201);
    const submitPayload = await submitRes.json();
    assert.equal(submitPayload.leadId, 1);

    const listRes = await fetch(`${baseUrl}/api/leads`);
    assert.equal(listRes.status, 200);
    const listPayload = await listRes.json();
    assert.equal(listPayload.count, 1);
    assert.equal(listPayload.data[0].email, 'jane@example.com');
  } finally {
    server.close();
  }
});
