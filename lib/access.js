const { createHmac, timingSafeEqual } = require('crypto');

const COOKIE = 'snap_access';
const LIFETIME = 8 * 60 * 60;

function secret() {
  const value = process.env.ACCESS_SESSION_SECRET || process.env.BLOB_READ_WRITE_TOKEN;
  if (!value) throw new Error('Access session secret is not configured.');
  return value;
}

function equal(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function signature(value) {
  return createHmac('sha256', secret()).update(value).digest('hex');
}

function authenticated(request) {
  const cookie = (request.headers.cookie || '').split(';').map(v => v.trim())
    .find(v => v.startsWith(`${COOKIE}=`));
  if (!cookie) return false;
  const [expiry, signed, extra] = cookie.slice(COOKIE.length + 1).split('.');
  if (extra || !/^\d+$/.test(expiry) || !signed || Number(expiry) <= Date.now()) return false;
  return equal(signature(expiry), signed);
}

function sessionCookie() {
  const expiry = String(Date.now() + LIFETIME * 1000);
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE}=${expiry}.${signature(expiry)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${LIFETIME}${secure}`;
}

module.exports = { authenticated, sessionCookie, equal };
