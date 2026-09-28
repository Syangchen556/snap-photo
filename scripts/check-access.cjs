const assert = require('node:assert/strict');
const http = require('node:http');
const express = require('express');
const setupLocalApi = require('../src/setupProxy');
const { authenticated } = require('../lib/access');

async function main() {
  delete process.env.ACCESS_SESSION_SECRET;
  delete process.env.BLOB_READ_WRITE_TOKEN;
  delete process.env.ACCESS_PIN;
  const app = express();
  setupLocalApi(app);
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const url = `http://127.0.0.1:${server.address().port}/api/access`;
    const post = pin => fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });
    const wrong = await post('wrong');
    assert.equal(wrong.status, 401);
    assert.equal(wrong.headers.get('set-cookie'), null);
    const right = await post('sky508');
    assert.equal(right.status, 200);
    assert.deepEqual(await right.json(), { unlocked: true });
    const cookie = right.headers.get('set-cookie');
    assert.match(cookie, /HttpOnly/);
    assert.equal(authenticated({ headers: { cookie } }), true);
    assert.equal(authenticated({ headers: { cookie: cookie.replace('snap_access=', 'snap_access=0') } }), false);
    console.log('Local HTTP access checks passed without configured secrets.');
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
