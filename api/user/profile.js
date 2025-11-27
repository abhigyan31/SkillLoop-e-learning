// api/user/profile.js
const connectToDatabase = require('../../lib/mongoose');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const User = require('../../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

function getUserIdFromReq(req) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.token;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.id;
  } catch (err) {
    return null;
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', 'PUT');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    const userId = getUserIdFromReq(req);
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const {
      firstName,
      lastName,
      email,
      mobile,
      address,
      dob,
      sex,
      avatar
    } = req.body || {};

    const update = {};

    if (typeof firstName !== 'undefined') update.firstName = firstName;
    if (typeof lastName !== 'undefined') update.lastName = lastName;
    if (typeof email !== 'undefined') update.email = email.toLowerCase();
    if (typeof mobile !== 'undefined') update.mobile = mobile;
    if (typeof address !== 'undefined') update.address = address;
    if (typeof sex !== 'undefined') update.sex = sex;
    if (typeof avatar !== 'undefined') update.avatar = avatar;

    if (typeof dob !== 'undefined') {
      if (dob) {
        update.dob = new Date(dob);
      } else {
        update.dob = null;
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: update },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        dob: user.dob ? user.dob.toISOString() : null,
        sex: user.sex,
        avatar: user.avatar || null
      }
    });
  } catch (err) {
    console.error('profile update error', err);
    res.status(500).json({ error: 'Server error' });
  }
};
