const { sessionCookie, equal } = require('../lib/access');

module.exports = async function access(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }
  const pin = request.body && request.body.pin;
  if (typeof pin !== 'string' || pin.length > 128 || !equal(pin, process.env.ACCESS_PIN || '1509')) {
    return response.status(401).json({ error: 'Incorrect PIN. Please try again.' });
  }
  try {
    response.setHeader('Set-Cookie', sessionCookie());
    return response.status(200).json({ unlocked: true });
  } catch {
    return response.status(503).json({ error: 'Access is not configured yet. Please contact the site owner.' });
  }
};
