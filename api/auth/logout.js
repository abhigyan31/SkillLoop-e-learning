// api/auth/logout.js
const cookie = require('cookie');

module.exports = function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  const cookieStr = cookie.serialize('token', '', {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });

  res.setHeader('Set-Cookie', cookieStr);
  res.json({ ok: true });
};
