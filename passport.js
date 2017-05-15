var passport = require('passport');
var RallyStrategy = require('passport-rally').Strategy;

module.exports = function(){

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new RallyStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.SERVER_URL + '/rally-callback',
    userAgent: 'nodejs-oauth-example',
    scope: 'alm',
  }, function (accessToken, refreshToken, profile, done) {
    user = profile._json.User;
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    process.nextTick(function () {
      return done(null, user);
    });
  }));

  return passport;
}
