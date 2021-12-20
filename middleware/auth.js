module.exports = {
  ensureAuth: function (request, response, next) {
    if (request.isAuthenticated()) {
      return next(); //callback function, must be called to pass request/response to the next middleware or route, or app will just hang
    } else {
      response.redirect('/');
    }
  },

  ensureGuest: function (request, response, next) {
    if (request.isAuthenticated()) {
      response.redirect('/dashboard');
    } else {
      return next();
    }
  },
};
