const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('./routes/schemas/userschema.js');
const bcrypt = require('bcryptjs');
require("dotenv").config();

// Configure LocalStrategy for username/password authentication
passport.use(new LocalStrategy({
    usernameField: 'email', // Assuming the email is used as the username
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false, { message: 'Invalid login' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid login' });
      }
    } catch (error) {
      return done(error);
    }
  }
));

// Configure JwtStrategy for JWT authentication
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWTPVTKEY,
};

passport.use(new JwtStrategy(jwtOptions, (payload, done) => {
  // Find the user based on the JWT payload
  const user = User.findById(payload.id);

  if (user) {
    return done(null, user);
  } else {
    return done(null, false);
  }
}));

module.exports = passport;