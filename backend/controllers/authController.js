const { oauth2Client, SCOPES } = require('../config/googleConfig');
const User = require('../models/User');
const axios = require('axios');

const getAuthUrl = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
  res.json({ url });
};

const googleCallback = async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const userInfo = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });

    const { id, email, name, picture } = userInfo.data;

    let user = await User.findOne({ googleId: id });
    if (!user) {
      user = await User.create({
        googleId: id,
        email,
        name,
        picture,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token
      });
    } else {
      user.accessToken = tokens.access_token;
      if (tokens.refresh_token) user.refreshToken = tokens.refresh_token;
      await user.save();
    }

    // Redirect to frontend with user info or token
    res.redirect(`${process.env.FRONTEND_URL}/auth-success?userId=${user._id}`);
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

module.exports = { getAuthUrl, googleCallback };
